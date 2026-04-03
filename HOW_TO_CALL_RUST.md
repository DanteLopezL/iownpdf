# How to Call Your Rust Functions from Frontend

## ✅ What's Already Done

Your Rust commands are properly defined in `src-tauri/src/lib.rs`:
- `convert_md_to_pdf(file_path: String) -> Result<String, String>`
- `convert_docx_to_pdf(file_path: String) -> Result<String, String>`
- `convert_pptx_to_pdf(file_path: String) -> Result<String, String>`

Your frontend now uses `invoke` from `@tauri-apps/api/core` in `src/routes/index.tsx`.

## ⚠️ The Core Issue

**Browser file inputs don't provide file paths** - they provide `File` objects for security reasons. Your Rust functions expect file paths, which creates a mismatch.

## 🎯 Two Solutions

### Solution 1: Use Tauri's Native File Picker (Recommended)

**Pros:**
- ✅ Works with your existing Rust code (no changes needed)
- ✅ Better for large files (no memory overhead)
- ✅ Native UX with proper file path access

**Cons:**
- ❌ Requires adding `tauri-plugin-dialog`
- ❌ Loses drag-and-drop functionality

**Implementation:**

1. **Add the dialog plugin:**
   ```bash
   cd src-tauri
   cargo add tauri-plugin-dialog
   ```

2. **Add a file picker command to `src-tauri/src/lib.rs`:**
   ```rust
   #[tauri::command]
   async fn pick_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
       let file_path = app.dialog().file().blocking_pick_file();
       Ok(file_path.map(|p| p.path.to_string_lossy().to_string()))
   }
   ```

3. **Register it in your invoke_handler:**
   ```rust
   .invoke_handler(tauri::generate_handler![
       convert_md_to_pdf,
       convert_docx_to_pdf,
       convert_pptx_to_pdf,
       pick_file,  // ← Add this
   ])
   ```

4. **Use it in your frontend:**
   ```typescript
   import { invoke } from "@tauri-apps/api/core";
   
   async function handleConvert() {
     const filePath = await invoke<string | null>("pick_file");
     if (!filePath) return; // User cancelled
     
     const outputPath = await invoke<string>("convert_md_to_pdf", {
       filePath,
     });
     console.log("Success:", outputPath);
   }
   ```

---

### Solution 2: Keep Browser File Input (Send Content Instead)

**Pros:**
- ✅ Keeps drag-and-drop UX
- ✅ No additional plugins needed

**Cons:**
- ❌ Requires modifying Rust functions
- ❌ Uses more memory (loads entire file into RAM)
- ❌ May struggle with very large files

**Implementation:**

1. **Add new commands to `src-tauri/src/lib.rs`:**
   ```rust
   use std::io::Write;
   
   #[tauri::command]
   fn convert_md_to_pdf_from_content(content: String) -> Result<Vec<u8>, String> {
       // Write to temp file
       let temp_path = std::env::temp_dir().join("temp_input.md");
       let mut file = std::fs::File::create(&temp_path)
           .map_err(|e| e.to_string())?;
       file.write_all(content.as_bytes())
           .map_err(|e| e.to_string())?;
       
       // Convert
       let converter = iownpdf_core::converter::MdConverter::new(&temp_path)
           .map_err(|e| e.to_string())?;
       let output_path = converter.to_pdf()
           .map_err(|e| e.to_string())?;
       
       // Read PDF bytes
       let pdf_bytes = std::fs::read(&output_path)
           .map_err(|e| e.to_string())?;
       
       // Cleanup
       let _ = std::fs::remove_file(&temp_path);
       let _ = std::fs::remove_file(&output_path);
       
       Ok(pdf_bytes)
   }
   ```

2. **Use it in frontend:**
   ```typescript
   import { invoke } from "@tauri-apps/api/core";
   
   async function handleConvert(file: File) {
     const content = await file.text();
     
     const pdfBytes = await invoke<number[]>("convert_md_to_pdf_from_content", {
       content,
     });
     
     // Download the PDF
     const blob = new Blob([new Uint8Array(pdfBytes)], { 
       type: "application/pdf" 
     });
     const url = URL.createObjectURL(blob);
     const a = document.createElement("a");
     a.href = url;
     a.download = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
     a.click();
     URL.revokeObjectURL(url);
   }
   ```

---

## 📁 Files Created

1. **`src/lib/conversion.ts`** - Complete implementation of both approaches with helper functions
2. **`HOW_TO_CALL_RUST.md`** - This guide

## 🚀 My Recommendation

**Use Solution 1 (Tauri File Picker)** because:
- No changes to your working Rust code
- Better performance for large files
- Simpler implementation
- More reliable

The drag-and-drop UX is nice, but the native file picker is more robust and expected by users for document conversion apps.

## 🔧 Next Steps

Tell me which solution you prefer, and I'll:
1. Fully integrate it into your `index.tsx` 
2. Update the Rust code if needed
3. Test the complete flow

## 📝 Current State of `index.tsx`

Your `src/routes/index.tsx` currently has:
- ✅ Import of `invoke` from `@tauri-apps/api/core`
- ✅ `handleConvertToPdf()` function set up
- ✅ Loading states and error handling
- ❌ Won't work yet due to file path issue (needs one of the solutions above)

The code is ready - it just needs to use one of the two approaches above to work properly!
