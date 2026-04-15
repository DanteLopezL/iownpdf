// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;

use iownpdf_core::converter::{DocxConverter, FileConverter, MdConverter, PptxConverter};
use tauri_plugin_dialog::DialogExt;

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
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            convert_md_to_pdf,
            convert_docx_to_pdf,
            convert_pptx_to_pdf,
            pick_file
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

/// Generic helper to convert a file using the provided converter.
fn convert_file<C: FileConverter>(file_path: &str) -> Result<String, String> {
    let converter = C::new(Path::new(file_path)).map_err(|e| e.to_string())?;
    let output = converter.to_pdf().map_err(|e| e.to_string())?;
    Ok(output.to_string_lossy().to_string())
}

#[tauri::command]
fn convert_md_to_pdf(file_path: String) -> Result<String, String> {
    convert_file::<MdConverter>(&file_path)
}

#[tauri::command]
fn convert_docx_to_pdf(file_path: String) -> Result<String, String> {
    convert_file::<DocxConverter>(&file_path)
}

#[tauri::command]
fn convert_pptx_to_pdf(file_path: String) -> Result<String, String> {
    convert_file::<PptxConverter>(&file_path)
}

#[tauri::command]
async fn pick_file(
    app: tauri::AppHandle,
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

    // Convert FilePath enum to string
    Ok(filtered_path.and_then(|p| match p {
        FilePath::Path(path) => Some(path.to_string_lossy().to_string()),
        FilePath::Url(url) => Some(url.to_string()),
    }))
}
