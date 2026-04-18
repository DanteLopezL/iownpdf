# iownpdf Roadmap

A comprehensive roadmap for the iownpdf PDF conversion application.

## 🎯 Vision

Create a beautiful, fast, and offline-first desktop application for converting various document formats to PDF — and back.

---

## Phase 1: Foundation ✅ (Complete)

### Core Setup
- [x] Project initialization with TanStack Router
- [x] Tauri desktop app setup
- [x] TypeScript configuration
- [x] Tailwind CSS v4 styling
- [x] Biome linting & formatting
- [x] Vite build configuration
- [x] Editorial brutalist UI redesign

### MVP Features
- [x] **Home Page**
  - Bold editorial UI with geometric design language
  - File format selection via native file picker (Tauri dialog plugin)
  - Conversion status indicators (idle → converting → success/error)
  - Staggered entrance animations
- [x] **Markdown (`.md`) to PDF** — working via Rust `iownpdf_core`
- [x] **Word (`.docx`) to PDF** — working via Rust `iownpdf_core`
- [x] **PowerPoint (`.pptx`) to PDF** — working via Rust `iownpdf_core`

---

## Phase 2: Core UX Improvements (v0.2)

*Estimated: 2–3 weeks | Dependencies: none*

These are the highest-impact, lowest-friction improvements. All leverage existing `FileConverter` trait and `tauri_plugin_dialog`.

### File Management
- [ ] **Output folder selection** — Add optional output path to `FileConverter` trait; each converter respects it or falls back to `input.with_extension("pdf")`. Use `tauri_plugin_dialog` folder picker for the UI.
- [ ] **Open containing folder after conversion** — Add `open_folder` Tauri command (platform-specific: `open` / `explorer` / `xdg-open`). Shown as a button in the success state of the modal.

### Productivity
- [ ] **Batch conversion** — Add `batch_convert` Tauri command accepting `Vec<(path, file_type)>`. Reuse existing `FileConverter` trait via a factory dispatch function (`FileType` enum → converter instantiation). Collect per-file results into a `BatchResult` struct. Frontend: drag-and-drop zone + per-file progress list.
- [ ] **Real-time progress for batch** — Emit Tauri window events from batch command. Frontend listens and updates per-file progress bars.

### Milestone: v0.2 — "Practical"
- Output folder selection, batch conversion, open containing folder.
- The app goes from "single-file converter" to something actually useful for daily work.

---

## Phase 3: PDF Manipulation (v0.3)

*Estimated: 3–4 weeks | Dependencies: new Rust PDF library*

Before any PDF-in features work, you need a PDF manipulation library in `iownpdf_core`. This is a prerequisite gate.

### PDF Library Foundation
- [ ] Add `pdfium-render` or `lopdf` to `iownpdf_core` dependencies
- [ ] Create a `PdfManipulator` module with shared helpers (open PDF, write PDF, iterate pages)
- [ ] This enables everything below without adding Tauri commands repeatedly

### PDF Tools
- [ ] **PDF to JPG** — Render pages to images via `pdfium-render`. Tauri command takes PDF path + page range + DPI. Frontend: modal with page range/DPI inputs, output as zip or individual files. **High impact, low effort** — best first PDF tool.
- [ ] **Watermark PDF** — Overlay text on each page via the PDF library. Tauri command: `apply_watermark(path, text, position, opacity)`. Frontend: text input, position selector, opacity slider.
- [ ] **PDF merging** — Combine multiple PDFs into one. Tauri command: `merge_pdfs(Vec<PathBuf>) -> Result<PathBuf, _>`. Frontend: "Add files" list with reorder handles.
- [ ] **PDF splitting** — Extract page ranges into separate files. Follows same pattern as merging.

### Milestone: v0.3 — "PDF Toolkit"
- PDF to JPG, watermark, merge, split.
- The app goes from "converter" to a lightweight PDF utility tool.

---

## Phase 4: Reverse Conversions (v0.4)

*Estimated: 4–6 weeks | Mixed complexity*

### PDF to Markdown (P1 — feasible)
- [ ] Add `pdf-extract` or `poppler` to `iownpdf_core`
- [ ] New `PdfToMdConverter` in `iownpdf_core` following the existing `FileConverter` pattern
- [ ] Add `PdfToMdConverter` to `converter/mod.rs` exports
- [ ] Add `convert_pdf_to_md` Tauri command + `"pdf"` variant to `FileType` enum
- [ ] Frontend: new card on home page, wire up command map in modal

### PDF to Word (P2 — complex)
- [ ] No well-maintained Rust crate exists. Evaluate bundling `pdf2docx` (Python) via `tauri-plugin-process` or `mammoth` (Node.js) via child process.
- [ ] This is the first feature requiring a non-Rust runtime dependency.
- [ ] Consider whether the complexity is worth it vs. recommending users use a dedicated tool.

### PDF to PowerPoint (P2 — complex)
- [ ] PDF-to-PPTX ecosystem is thin even in other languages.
- [ ] Likely requires PDF-to-image → image-to-pptx pipeline.
- **Recommendation**: Deprioritize this until user demand justifies the effort.

### Milestone: v0.4 — "Reverse"
- PDF to Markdown (solid win), PDF to Word (if dependency choice works), PDF to PowerPoint (deferred or experimental).

---

## Phase 5: PDF Options & Polish (v0.5)

*Estimated: 2–3 weeks | Depends on PDF library from Phase 3*

### PDF Options (requires PDF library from Phase 3)
- [ ] **Custom PDF metadata** (title, author, subject) — For Markdown: pass to `markdown2pdf::config`. For DOCX/PPTX: post-process with `lopdf` to inject PDF info dict.
- [ ] **Page size and orientation** — Pass to `markdown2pdf::config` for Markdown. For DOCX/PPTX: depends on `office2pdf` capabilities (may not support this).
- [ ] **Margin and padding controls** — Same as page size; depends on underlying crate support.
- [ ] **Compression/quality settings** — For PDF-to-JPG output quality. For PDF creation: depends on library.

### UX Polish
- [ ] **Conversion history** — Store in Tauri's built-in persistence or a local JSON file. Show in a sidebar or settings panel.
- [ ] **Recent files list** — Persist last N files per type. Quick-access button in the modal.
- [ ] **Keyboard shortcuts** — e.g., `Cmd+O` to open file picker, `Cmd+Enter` to convert.

### Milestone: v0.5 — "Refined"
- PDF metadata/options, conversion history, keyboard shortcuts.
- The app feels polished and complete for its core scope.

---

## Phase 6: Additional Input Formats (v0.6)

*Estimated: 3–4 weeks | Each is a standalone converter*

Evaluate each based on the `FileConverter` trait pattern:

- [ ] **HTML to PDF** — `markdown2pdf` already handles HTML; could add `HtmlConverter` reusing that crate.
- [ ] **Excel (`.xlsx`) to PDF** — `office2pdf` likely supports this; test first, then add `XlsxConverter`.
- [ ] **CSV to PDF** — New converter; format as table, render via a lightweight HTML/PDF pipeline.
- [ ] **Image formats (PNG, JPG) to PDF** — `pdfium-render` can embed images into PDF pages. Straightforward.
- [ ] **Text files (`.txt`) to PDF** — Trivial: wrap text in minimal HTML, use `markdown2pdf`.
- [ ] **RTF to PDF** — Low demand; defer unless requested.

**Recommendation**: Add HTML and Excel first (highest demand, lowest effort). Image-to-PDF is also good since you already have `pdfium-render`.

### Milestone: v0.6 — "Expanded"
- HTML, Excel, CSV, and image-to-PDF support.

---

## Phase 7: Distribution & Release (v1.0)

*Estimated: 2–3 weeks | Independent of feature work*

### App Branding
- [ ] Final app icon set (32x32, 128x128, 128x128@2x, .icns, .ico)
- [ ] App name, description, and metadata for each platform

### Installers
- [ ] macOS `.dmg` + `.app` — `bunx tauri build` produces these by default
- [ ] Windows `.exe` + `.msi` — configure `tauri.bundle.windows` in `tauri.conf.json`
- [ ] Linux `.AppImage` + `.deb` — configure `tauri.bundle.linux`

### Auto-Update
- [ ] Enable `tauri-plugin-updater` in `tauri.conf.json`
- [ ] Configure GitHub Releases as update endpoint
- [ ] Test update flow on all platforms

### Documentation
- [ ] `CONTRIBUTING.md` guide
- [ ] User-facing help/docs (in-app or website)
- [ ] Screenshots and demo video

### Milestone: v1.0 — "Release"
- First stable release with installers for all three platforms and auto-update.

---

## Deferred / Low Priority

These are either high-effort, low-demand, or depend on external tooling that may not be viable:

- [ ] **PDF to PowerPoint** — Thin ecosystem; defer until demand justifies it
- [ ] **Sign PDF** — Requires signature drawing UI + cryptographic signing; moderate effort
- [ ] **PDF splitting** — Useful but lower demand than merge/watermark
- [ ] **Password protection** — Adds complexity; evaluate after core features are solid
- [ ] **OCR for scanned documents** — Requires `tesseract` bundling; significant dependency overhead
- [ ] **RTF to PDF** — Low demand
- [ ] **Compression/quality settings for PDF creation** — Depends on `office2pdf` capabilities; may not be supported

---

## Technical Improvements (Ongoing)

### Performance
- [ ] Worker threads for conversion tasks (via `tokio::task::spawn_blocking`)
- [ ] Streaming for large files
- [ ] Memory optimization for batch operations

### Quality
- [ ] Unit test coverage > 80% for `iownpdf_core`
- [ ] E2E testing with Playwright
- [ ] Error tracking and reporting (opt-in)

### Developer Experience
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated releases tied to tags
- [ ] Code documentation for `iownpdf_core` public API

---

## Version Timeline

| Version | Focus | Target |
|---------|-------|--------|
| **v0.1** | Foundation (complete) | ✅ Done |
| **v0.2** | Output folder, batch conversion, open folder | ~Month 1–2 |
| **v0.3** | PDF tools (JPG, watermark, merge, split) | ~Month 3–4 |
| **v0.4** | Reverse conversions (PDF → MD, DOCX) | ~Month 5–6 |
| **v0.5** | PDF options, history, keyboard shortcuts | ~Month 7–8 |
| **v0.6** | Additional input formats (HTML, Excel, images) | ~Month 9–10 |
| **v1.0** | Distribution, installers, auto-update, docs | ~Month 11–12 |

---

## Contributing

Want to help? Check out our [Contributing Guide](CONTRIBUTING.md) (coming soon).

---

**Last Updated:** April 16, 2026
