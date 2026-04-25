// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::{Path, PathBuf};

use iownpdf_core::{
    converter::{DocxConverter, FileConverter, MdConverter, PptxConverter},
    errors::IownPdfError,
};
use serde::Serialize;
use tauri::{AppHandle, Emitter};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

/// Supported file types for conversion.
#[derive(Debug, Clone, Copy)]
enum FileType {
    Md,
    Docx,
    Pptx,
}

impl FileType {
    fn from_str(s: &str) -> Option<Self> {
        match s {
            "md" => Some(Self::Md),
            "docx" => Some(Self::Docx),
            "pptx" => Some(Self::Pptx),
            _ => None,
        }
    }

    /// Infers the file type from a path's extension.
    fn from_path(path: &Path) -> Option<Self> {
        let ext = path.extension()?.to_str()?;
        match ext {
            "md" | "markdown" => Some(Self::Md),
            "docx" => Some(Self::Docx),
            "pptx" => Some(Self::Pptx),
            _ => None,
        }
    }

    /// Dispatches to the right converter and produces a PDF.
    fn convert(
        self,
        input: &Path,
        output_dir: Option<&Path>,
    ) -> Result<PathBuf, IownPdfError> {
        match self {
            Self::Md => MdConverter::new(input)?.to_pdf(output_dir),
            Self::Docx => DocxConverter::new(input)?.to_pdf(output_dir),
            Self::Pptx => PptxConverter::new(input)?.to_pdf(output_dir),
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            convert_to_pdf,
            batch_convert,
            pick_file,
            pick_folder,
            reveal_in_folder,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn convert_to_pdf(
    file_path: String,
    file_type: String,
    output_dir: Option<String>,
) -> Result<String, String> {
    let kind = FileType::from_str(&file_type)
        .ok_or_else(|| format!("unknown file type: {file_type}"))?;

    let input = Path::new(&file_path);
    let out_dir = output_dir.as_deref().map(Path::new);

    let output = kind.convert(input, out_dir).map_err(|e| e.to_string())?;
    Ok(output.to_string_lossy().to_string())
}

/// Per-file outcome returned from a batch conversion.
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "status", rename_all = "lowercase")]
enum BatchItem {
    Success {
        file_path: String,
        output_path: String,
    },
    Error {
        file_path: String,
        error: String,
    },
}

#[derive(Debug, Clone, Serialize)]
struct BatchResult {
    successes: Vec<BatchItem>,
    failures: Vec<BatchItem>,
}

/// Progress payload emitted once per processed file.
#[derive(Debug, Clone, Serialize)]
struct BatchProgress {
    index: usize,
    total: usize,
    item: BatchItem,
}

#[tauri::command]
fn batch_convert(
    app: AppHandle,
    file_paths: Vec<String>,
    output_dir: Option<String>,
) -> Result<BatchResult, String> {
    let total = file_paths.len();
    let out_dir = output_dir.as_deref().map(Path::new);

    let mut successes: Vec<BatchItem> = Vec::new();
    let mut failures: Vec<BatchItem> = Vec::new();

    for (index, file_path) in file_paths.iter().enumerate() {
        let input = Path::new(file_path);

        let item = match FileType::from_path(input) {
            None => BatchItem::Error {
                file_path: file_path.clone(),
                error: format!(
                    "unsupported extension: {}",
                    input
                        .extension()
                        .and_then(|e| e.to_str())
                        .unwrap_or("(none)")
                ),
            },
            Some(kind) => match kind.convert(input, out_dir) {
                Ok(out) => BatchItem::Success {
                    file_path: file_path.clone(),
                    output_path: out.to_string_lossy().to_string(),
                },
                Err(e) => BatchItem::Error {
                    file_path: file_path.clone(),
                    error: e.to_string(),
                },
            },
        };

        let _ = app.emit(
            "batch-progress",
            BatchProgress {
                index,
                total,
                item: item.clone(),
            },
        );

        match &item {
            BatchItem::Success { .. } => successes.push(item),
            BatchItem::Error { .. } => failures.push(item),
        }
    }

    Ok(BatchResult {
        successes,
        failures,
    })
}

#[tauri::command]
async fn pick_file(
    app: AppHandle,
    file_type: String,
) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::FilePath;

    // Set file type filters based on the type
    let filtered_path = match FileType::from_str(&file_type) {
        Some(FileType::Md) => app
            .dialog()
            .file()
            .add_filter("Markdown Files", &["md", "markdown"])
            .blocking_pick_file(),
        Some(FileType::Docx) => app
            .dialog()
            .file()
            .add_filter("Word Documents", &["docx"])
            .blocking_pick_file(),
        Some(FileType::Pptx) => app
            .dialog()
            .file()
            .add_filter("PowerPoint Presentations", &["pptx"])
            .blocking_pick_file(),
        None => app.dialog().file().blocking_pick_file(),
    };

    Ok(filtered_path.and_then(|p| match p {
        FilePath::Path(path) => Some(path.to_string_lossy().to_string()),
        FilePath::Url(url) => Some(url.to_string()),
    }))
}

#[tauri::command]
async fn pick_folder(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::FilePath;

    let picked = app.dialog().file().blocking_pick_folder();

    Ok(picked.and_then(|p| match p {
        FilePath::Path(path) => Some(path.to_string_lossy().to_string()),
        FilePath::Url(url) => Some(url.to_string()),
    }))
}

#[tauri::command]
fn reveal_in_folder(app: AppHandle, path: String) -> Result<(), String> {
    app.opener()
        .reveal_item_in_dir(&path)
        .map_err(|e| e.to_string())
}
