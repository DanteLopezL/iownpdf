# File Picker & Auto-Generate PDF Updates

## ✅ Changes Implemented

### 1. **Removed Download PDF Button**
- ❌ Removed the "Download PDF" button from success state
- ✅ Replaced with simple "Close" button
- ✅ PDF is now auto-generated in the same path as the original file

### 2. **Auto-Generate PDF in Same Path**
The Rust conversion functions already handle this:
```rust
fn convert_md_to_pdf(file_path: String) -> Result<String, String> {
    let converter = MdConverter::new(Path::new(&file_path))?;
    let output = converter.to_pdf()?;  // Auto-generates in same directory
    Ok(output.to_string_lossy().to_string())
}
```

The PDF will be created in the same directory as the source file with the same name but `.pdf` extension.

### 3. **Restricted File Browser by File Type**
Added Tauri's native file picker with file type filters:

**Rust Implementation** (`src-tauri/src/lib.rs`):
```rust
#[tauri::command]
async fn pick_file(
    app: tauri::AppHandle,
    file_type: String,
) -> Result<Option<String>, String> {
    let filtered_path = match file_type.as_str() {
        "md" => app
            .dialog()
            .file()
            .add_filter("Markdown Files", &["md", "markdown"])
            .blocking_pick_file(),
        "docx" => app
            .dialog()
            .file()
            .add_filter("Word Documents", &["docx"])
            .blocking_pick_file(),
        "pptx" => app
            .dialog()
            .file()
            .add_filter("PowerPoint Presentations", &["pptx"])
            .blocking_pick_file(),
        _ => app.dialog().file().blocking_pick_file(),
    };

    Ok(filtered_path.map(|p| p.path.to_string_lossy().to_string()))
}
```

**File Type Restrictions:**
- **Markdown Modal**: Only shows `.md` and `.markdown` files
- **PowerPoint Modal**: Only shows `.pptx` files
- **Word Modal**: Only shows `.docx` files

### 4. **Updated Frontend**

**Replaced Browser File Input with Tauri File Picker:**
```typescript
async function handlePickFile() {
  if (!openModal) return;

  const filePath = await invoke<string | null>("pick_file", {
    fileType: openModal,
  });

  if (!filePath) return; // User cancelled

  const fileName = filePath.split("/").pop() || filePath;
  setSelectedFilePath(filePath);
  setSelectedFileName(fileName);
}
```

**Removed Components:**
- ❌ `FileUploadCard` component (no longer needed)
- ❌ Drag-and-drop functionality (using native file picker instead)
- ❌ Download PDF button (PDF auto-generated)

**Updated UI:**
- ✅ Simple file picker button with file type icon
- ✅ Shows selected file name
- ✅ "Convert to PDF" button
- ✅ Success state shows file path and "Close" button
- ✅ Error state with clear messaging

### 5. **Added Dependencies**

**Cargo.toml:**
```toml
tauri-plugin-dialog = "2"
```

## 📁 Modified Files

1. **`src-tauri/src/lib.rs`**
   - Added `pick_file` command with file type filters
   - Imported `tauri_plugin_dialog::DialogExt`

2. **`src-tauri/Cargo.toml`**
   - Added `tauri-plugin-dialog = "2"` dependency

3. **`src/routes/index.tsx`**
   - Removed `FileUploadCard` import and usage
   - Added `invoke` from `@tauri-apps/api/core`
   - Updated state management for file paths
   - Implemented `handlePickFile` function
   - Updated `handleConvertToPdf` to call Rust commands
   - Removed download button, added close button
   - Updated UI to show file path instead of File object

## 🎯 How It Works

1. **User clicks conversion card** (e.g., "Markdown")
2. **Modal opens** with file picker button
3. **User clicks file picker button**
4. **Native file dialog opens** restricted to `.md` and `.markdown` files
5. **User selects file**
6. **File path is stored** in state
7. **User clicks "Convert to PDF"**
8. **Rust converts file** and saves PDF in same directory
9. **Success state shows** output file path
10. **User clicks "Close"** to dismiss modal

## ✨ Benefits

1. **Better UX**: Native file picker feels more integrated
2. **File Type Safety**: Users can only select valid file types
3. **Automatic Output**: PDF created next to source file
4. **Simpler Code**: No need to handle browser File objects
5. **Direct Paths**: Rust functions work with real file paths
6. **Clean Interface**: No drag-and-drop complexity

## 🔍 File Path Example

**Input:** `/Users/name/Documents/report.md`  
**Output:** `/Users/name/Documents/report.pdf`

The PDF is automatically generated in the same directory as the source file.

## ✅ All Checks Pass

- ✅ **TypeScript:** Zero errors
- ✅ **Linting:** Clean (biome check passes)
- ✅ **Build:** Successful production build
- ✅ **Accessibility:** Proper semantic HTML

## 🚀 Ready to Use

The implementation is complete and ready to test! Just run:
```bash
cargo tauri dev
```

The file picker will work immediately with proper file type restrictions.
