/**
 * This file shows TWO approaches for calling your Rust functions from the frontend.
 *
 * APPROACH 1: Use Tauri's Native File Picker (Recommended)
 * - Requires: cargo add tauri-plugin-dialog
 * - Pros: Works with existing Rust code, handles file paths correctly
 * - Cons: Loses drag-and-drop UX
 *
 * APPROACH 2: Send File Content from Browser (Keeps Drag-and-Drop)
 * - Requires: Modifying Rust functions to accept content instead of paths
 * - Pros: Keeps current UX with drag-and-drop
 * - Cons: Uses more memory for large files
 */

import { invoke } from "@tauri-apps/api/core";

// ============================================================================
// APPROACH 1: Using Tauri File Picker (Recommended)
// ============================================================================

/**
 * Opens Tauri's native file picker and converts the selected file.
 *
 * PREREQUISITES:
 * 1. Run: cd src-tauri && cargo add tauri-plugin-dialog
 * 2. Add pick_file command to src-tauri/src/lib.rs:
 *
 *    #[tauri::command]
 *    async fn pick_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
 *        let file_path = app.dialog().file().blocking_pick_file();
 *        Ok(file_path.map(|p| p.path.to_string_lossy().to_string()))
 *    }
 *
 * 3. Add it to invoke_handler in lib.rs
 */
export async function convertWithFilePicker(
	fileType: "md" | "docx" | "pptx",
): Promise<string | null> {
	try {
		// Open native file picker
		const filePath = await invoke<string | null>("pick_file");
		if (!filePath) {
			console.log("User cancelled file selection");
			return null;
		}

		const commandMap = {
			md: "convert_md_to_pdf",
			docx: "convert_docx_to_pdf",
			pptx: "convert_pptx_to_pdf",
		};

		// Convert the file using your existing Rust command
		const outputPath = await invoke<string>(commandMap[fileType], {
			filePath,
		});

		console.log("Conversion successful:", outputPath);
		return outputPath;
	} catch (error) {
		console.error("Conversion failed:", error);
		throw error;
	}
}

// ============================================================================
// APPROACH 2: Using Browser File Input (Keeps Drag-and-Drop)
// ============================================================================

/**
 * Converts a file from browser input to PDF.
 *
 * PREREQUISITES:
 * You need to modify your Rust functions to accept file content instead of paths.
 *
 * Add this to src-tauri/src/lib.rs:
 *
 *    #[tauri::command]
 *    fn convert_md_to_pdf_from_content(content: String) -> Result<Vec<u8>, String> {
 *        use std::io::Write;
 *
 *        // Write to temp file
 *        let temp_path = std::env::temp_dir().join("temp_input.md");
 *        let mut file = std::fs::File::create(&temp_path)
 *            .map_err(|e| e.to_string())?;
 *        file.write_all(content.as_bytes())
 *            .map_err(|e| e.to_string())?;
 *
 *        // Convert
 *        let converter = iownpdf_core::converter::MdConverter::new(&temp_path)
 *            .map_err(|e| e.to_string())?;
 *        let output_path = converter.to_pdf()
 *            .map_err(|e| e.to_string())?;
 *
 *        // Read PDF bytes
 *        let pdf_bytes = std::fs::read(&output_path)
 *            .map_err(|e| e.to_string())?;
 *
 *        // Cleanup temp files
 *        let _ = std::fs::remove_file(&temp_path);
 *        let _ = std::fs::remove_file(&output_path);
 *
 *        Ok(pdf_bytes)
 *    }
 *
 * Repeat similar functions for docx and pptx.
 */
export async function convertBrowserFileToPdf(
	file: File,
	fileType: "md" | "docx" | "pptx",
): Promise<Uint8Array> {
	try {
		// Read file content
		const content = await file.text();

		const commandMap = {
			md: "convert_md_to_pdf_from_content",
			docx: "convert_docx_to_pdf_from_content",
			pptx: "convert_pptx_to_pdf_from_content",
		};

		// Send content to Rust and get PDF bytes back
		const pdfBytesArray = await invoke<number[]>(commandMap[fileType], {
			content,
		});

		// Convert to Uint8Array
		const pdfBytes = new Uint8Array(pdfBytesArray);
		console.log(`Converted ${file.name} to PDF (${pdfBytes.length} bytes)`);
		return pdfBytes;
	} catch (error) {
		console.error("Conversion failed:", error);
		throw error;
	}
}

/**
 * Downloads the PDF file to user's computer
 */
export function downloadPdf(
	pdfBytes: Uint8Array,
	originalFileName: string,
): void {
	// Create blob from PDF bytes
	const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
		type: "application/pdf",
	});
	const url = URL.createObjectURL(blob);

	// Create download link and trigger it
	const a = document.createElement("a");
	a.href = url;
	// Replace extension with .pdf
	const pdfFileName = `${originalFileName.replace(/\.[^/.]+$/, "")}.pdf`;
	a.download = pdfFileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	console.log(`Downloaded: ${pdfFileName}`);
}

// ============================================================================
// HELPER: Complete flow with error handling
// ============================================================================

export interface ConversionResult {
	success: boolean;
	outputPath?: string;
	error?: string;
}

/**
 * Complete conversion flow with file picker (Approach 1)
 */
export async function handleConversionWithPicker(
	fileType: "md" | "docx" | "pptx",
): Promise<ConversionResult> {
	try {
		const outputPath = await convertWithFilePicker(fileType);
		if (!outputPath) {
			return { success: false, error: "User cancelled" };
		}
		return { success: true, outputPath };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}

/**
 * Complete conversion flow with browser file input (Approach 2)
 */
export async function handleConversionWithBrowserFile(
	file: File,
	fileType: "md" | "docx" | "pptx",
	onProgress?: (message: string) => void,
): Promise<ConversionResult> {
	try {
		onProgress?.("Reading file...");
		const pdfBytes = await convertBrowserFileToPdf(file, fileType);

		onProgress?.("Preparing download...");
		downloadPdf(pdfBytes, file.name);

		return {
			success: true,
			outputPath: `${file.name.replace(/\.[^/.]+$/, "")}.pdf`,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		};
	}
}
