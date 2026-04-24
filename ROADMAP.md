# iownpdf Roadmap

A comprehensive roadmap for the iownpdf PDF conversion application.

## 🎯 Vision

Create a beautiful, fast, and offline-first desktop application for converting various document formats to PDF — and back.

---

## Phase 1: Foundation ✅ (Complete)

### Core Setup
- [x] Project initialization with TanStack Router
- [x] Tauri v2 desktop app setup (frameless + transparent window, 1200×800 default)
- [x] TypeScript configuration with `#/*` path alias
- [x] Tailwind CSS v4 styling with design tokens
- [x] Biome linting & formatting
- [x] Vite 7 build configuration
- [x] Vitest + Testing Library wired up (no specs yet)
- [x] Editorial brutalist UI redesign

### Shell & Chrome
- [x] **Custom title bar** (`CustomTitleBar`) — frameless window with brand mark, theme toggle, and window controls (minimize / maximize / close) using `@tauri-apps/api/window`
- [x] **Light + dark mode** — `ThemeProvider` context with `prefers-color-scheme` detection, `localStorage` persistence, and `data-theme` attribute on `<html>`
- [x] **Final app icon set** (32×32, 128×128, 128×128@2x, `.icns`, `.ico`)

### MVP Features
- [x] **Home page**
  - Bold editorial UI with geometric design language
  - File format selection via native file picker (`tauri_plugin_dialog`)
  - Conversion status states (`idle` → `converting` → `success` / `error`)
  - Staggered entrance animations
- [x] **Markdown (`.md`, `.markdown`) to PDF** — `MdConverter` via `markdown2pdf`
- [x] **Word (`.docx`) to PDF** — `DocxConverter` via `office2pdf`
- [x] **PowerPoint (`.pptx`) to PDF** — `PptxConverter` via `office2pdf`

### Milestone: v0.1 — "Foundation" ✅
- Three forward converters, custom chrome, light/dark theming, final icon set.

---

## Phase 2: Core UX Improvements (v0.2)

*Estimated: 2–3 weeks | Dependencies: none*

Highest-impact, lowest-friction improvements. All leverage the existing `FileConverter` trait and `tauri_plugin_dialog`.

### File Management
- [ ] **Output folder selection** — Extend `FileConverter::to_pdf` (or add a `to_pdf_at(output_dir)` variant) so each converter can honor a user-supplied directory, falling back to `input.with_extension("pdf")`. Use `tauri_plugin_dialog` folder picker in the modal.
- [ ] **Open containing folder after conversion** — New `reveal_in_folder` Tauri command using `tauri-plugin-opener` (preferred over hand-rolling per-platform `open` / `explorer` / `xdg-open`). Surface as a button in the modal's success state.

### Productivity
- [ ] **Drag-and-drop** — Accept drops on the home page; infer `FileType` from extension and open the corresponding modal pre-populated. Use Tauri's `onDragDropEvent` on the window.
- [ ] **Batch conversion** — Add `batch_convert(Vec<{path, file_type}>)` Tauri command. Introduce a factory dispatch (`FileType` enum → converter instantiation) to avoid repeating the per-converter glue. Return a `BatchResult { successes, failures }` struct.
- [ ] **Real-time progress for batch** — Emit `batch-progress` events from the Rust side (`AppHandle::emit`). Frontend subscribes and renders per-file progress rows.

### Milestone: v0.2 — "Practical"
- Output folder selection, batch conversion, drag-and-drop, open containing folder.
- The app goes from "single-file converter" to something actually useful for daily work.

---

## Phase 3: Testing & CI Foundation (v0.2.1)

*Estimated: 1 week | Dependencies: none — tooling is already installed*

Vitest and Testing Library are in `package.json` but unused. Establish the pattern now, before the frontend grows another 10 components.

### Frontend
- [ ] First specs for `Modal`, `ConvertButton`, and the conversion state machine in `routes/index.tsx`
- [ ] Co-locate `*.test.tsx` with components; wire `bun run test` into the default dev loop

### Rust Core
- [ ] Integration tests for `MdConverter`, `DocxConverter`, `PptxConverter` using `tempfile` (already a dev-dep) with small fixture files
- [ ] Unit tests for `utils/validator.rs` edge cases (missing file, wrong extension, unreadable path)

### CI
- [ ] **GitHub Actions** — matrix on `macos-latest`, `ubuntu-latest`, `windows-latest`: `cargo test`, `bun run check`, `bun run test`, `bunx tauri build --debug`
- [ ] Cache `~/.cargo`, `target/`, and `~/.bun/install/cache` to keep CI under ~5 min

### Milestone: v0.2.1 — "Confidence"
- CI green on all three platforms with meaningful coverage for the Rust core and the modal flow.

---

## Phase 4: Settings & Preferences (v0.3)

*Estimated: 1–2 weeks | Dependencies: Phase 2 (output folder selection)*

Dark mode already uses `localStorage`. Consolidate user prefs into one persisted store so new prefs land in a consistent place.

- [ ] **Preferences store** — `tauri-plugin-store` for durable JSON at the OS config dir; migrate the `theme` key out of `localStorage` for parity between web preview and desktop
- [ ] **Settings panel** — Slide-in sheet or dedicated route; fields: theme, default output folder, "open folder after convert" toggle, "confirm before overwrite" toggle
- [ ] **Recent files list** — Persist last N files per type; quick-access section in each modal
- [ ] **Keyboard shortcuts** — `Cmd/Ctrl+O` open picker, `Cmd/Ctrl+Enter` convert, `Esc` close modal, `Cmd/Ctrl+,` open settings

### Milestone: v0.3 — "Yours"
- Persistent preferences, recent files, keyboard-driven workflow.

---

## Phase 5: PDF Manipulation (v0.4)

*Estimated: 3–4 weeks | Dependencies: new Rust PDF library*

Before any PDF-in features work, `iownpdf_core` needs a PDF manipulation library. This is a prerequisite gate — pick once, reuse for everything downstream.

### PDF Library Foundation
- [ ] Evaluate `pdfium-render` (binary dep, full render pipeline) vs `lopdf` (pure Rust, no rendering). Likely: **both** — `lopdf` for metadata/merge/split, `pdfium-render` for rasterization.
- [ ] New `pdf/` module in `iownpdf_core` with shared helpers (open, iterate pages, write)
- [ ] Decide how/whether to bundle the Pdfium shared library across platforms — the biggest distribution concern for v1.0

### PDF Tools
- [ ] **PDF to JPG** — Rasterize pages via `pdfium-render`; Tauri command takes PDF path, page range, DPI. Output individual files or a zip. **Best first PDF tool — high impact, low effort.**
- [ ] **PDF merging** — Pure `lopdf`. Tauri command: `merge_pdfs(paths: Vec<PathBuf>) -> PathBuf`. Frontend: reorderable list.
- [ ] **PDF splitting** — `lopdf` page extraction. Same UI pattern as merge.
- [ ] **Watermark PDF** — Text overlay per page via `lopdf` content streams. Inputs: text, position, opacity, font size.
- [ ] **Image (PNG/JPG) to PDF** — `pdfium-render` can embed images. Straightforward and reuses the same dep.

### Milestone: v0.4 — "PDF Toolkit"
- PDF→JPG, merge, split, watermark, image→PDF.
- The app goes from "converter" to a lightweight PDF utility tool.

---

## Phase 6: Reverse Conversions (v0.5)

*Estimated: 4–6 weeks | Mixed complexity*

### PDF to Markdown (P1 — feasible)
- [ ] Add `pdf-extract` (pure Rust) to `iownpdf_core`; fall back to `pdfium-render` text extraction if layout matters
- [ ] New `PdfToMdConverter` following the existing `FileConverter` pattern
- [ ] Add `convert_pdf_to_md` Tauri command + `Pdf` variant to `FileType` enum
- [ ] Frontend: promote the existing "Coming Soon" card on `routes/index.tsx` to a real `ConvertButton`

### PDF to Word (P2 — complex)
- [ ] No well-maintained Rust crate exists. Evaluate bundling `pdf2docx` (Python) via `tauri-plugin-shell` sidecar, or a pure-Rust "paragraph reflow" approach that loses formatting.
- [ ] This is the first feature needing a non-Rust runtime dep — decide whether that's acceptable for the project's "one binary" goal.

### PDF to PowerPoint (P3 — deferred)
- [ ] PDF→PPTX ecosystem is thin in every language. Likely requires PDF→image → image-to-pptx pipeline.
- **Recommendation**: Keep the "Coming Soon" card as a placeholder; ship only if user demand justifies it.

### Milestone: v0.5 — "Reverse"
- PDF→Markdown (solid win). PDF→Word if the sidecar tradeoff is acceptable. PDF→PowerPoint deferred.

---

## Phase 7: PDF Options & Polish (v0.6)

*Estimated: 2–3 weeks | Depends on Phase 5 library choice*

### PDF Generation Options
- [ ] **Custom metadata** (title, author, subject) — For `.md`: pass via `markdown2pdf::config`. For `.docx`/`.pptx`: post-process with `lopdf` to inject the info dict.
- [ ] **Page size & orientation** — Pass to `markdown2pdf::config` for `.md`. For `.docx`/`.pptx`: depends on `office2pdf` capabilities; if unsupported, document the limitation.
- [ ] **Margins** — Same story as page size.
- [ ] **JPG output quality** — Slider that maps to `pdfium-render` render settings and JPEG encoder quality.

### Conversion History
- [ ] History log persisted via `tauri-plugin-store` (same store as preferences)
- [ ] History panel in settings: file name, timestamp, output path, "re-open output" action

### Milestone: v0.6 — "Refined"
- Generation options exposed in the modal; history is searchable.

---

## Phase 8: Additional Input Formats (v0.7)

*Estimated: 3–4 weeks | Each a standalone converter*

Each new format is a new struct implementing `FileConverter` in `crates/iownpdf_core/src/converter/`.

- [ ] **HTML to PDF** — `markdown2pdf` accepts HTML; add `HtmlConverter` reusing it
- [ ] **Excel (`.xlsx`) to PDF** — `office2pdf` likely supports it; test, then add `XlsxConverter`
- [ ] **Plain text (`.txt`) to PDF** — Trivial: wrap in minimal HTML and run through `markdown2pdf`
- [ ] **CSV to PDF** — Format as table, render via the text/HTML pipeline
- [ ] **RTF to PDF** — Low demand; defer unless requested

**Order of operations**: HTML and Excel first (highest demand, reuse existing deps). Text/CSV second. RTF last.

### Milestone: v0.7 — "Expanded"
- HTML, Excel, text, CSV support.

---

## Phase 9: Distribution & Release (v1.0)

*Estimated: 2–3 weeks | Independent of feature work*

### Installers
- [ ] macOS `.dmg` + `.app` — `bunx tauri build` produces these by default; set up code signing + notarization
- [ ] Windows `.exe` + `.msi` — configure `tauri.bundle.windows` with signing
- [ ] Linux `.AppImage` + `.deb` — configure `tauri.bundle.linux`

### Pdfium Bundling
- [ ] Resolve how the Pdfium shared library ships per platform (see Phase 5). Blocks release if unaddressed.

### Auto-Update
- [ ] Enable `tauri-plugin-updater` in `tauri.conf.json`
- [ ] GitHub Releases as the update endpoint
- [ ] Test update flow on all three platforms

### Documentation
- [ ] `CONTRIBUTING.md`
- [ ] In-app help (keyboard shortcuts overlay, about modal)
- [ ] Screenshots and short demo video in the README

### Milestone: v1.0 — "Release"
- Signed installers for all three platforms, auto-update, proper docs.

---

## Deferred / Low Priority

High-effort, low-demand, or blocked on external tooling that may not be viable:

- [ ] **PDF to PowerPoint** — thin ecosystem; defer until demand justifies it
- [ ] **Sign PDF** — signature drawing UI + cryptographic signing; moderate effort
- [ ] **Password protection / encryption** — adds complexity; evaluate after core features are solid
- [ ] **OCR for scanned documents** — requires `tesseract` bundling; significant dependency overhead
- [ ] **RTF to PDF** — low demand
- [ ] **Compression settings for PDF creation** — depends on `office2pdf` capabilities; may not be supported

---

## Technical Improvements (Ongoing)

### Performance
- [ ] Worker threads for conversion tasks (`tokio::task::spawn_blocking`) so the UI stays responsive
- [ ] Streaming for large files
- [ ] Memory tuning for batch operations

### Quality
- [ ] Coverage target ≥ 80% for `iownpdf_core`
- [ ] E2E smoke tests via Playwright against `tauri-driver` (once CI is green)
- [ ] Opt-in error telemetry (only after explicit user consent)

### Developer Experience
- [ ] Automated releases tied to git tags (part of Phase 3 CI)
- [ ] Rustdoc for `iownpdf_core` public API, published to GitHub Pages
- [ ] Storybook or Ladle for UI components

---

## Version Timeline

| Version | Focus | Status |
|---------|-------|--------|
| **v0.1** | Foundation: three converters, theming, custom chrome | ✅ Shipped |
| **v0.2** | Output folder, batch conversion, drag-and-drop | Next |
| **v0.2.1** | Tests + CI on all platforms | Parallel with v0.2 |
| **v0.3** | Persistent preferences, recent files, keyboard shortcuts | — |
| **v0.4** | PDF toolkit: JPG, merge, split, watermark, image→PDF | — |
| **v0.5** | Reverse: PDF→Markdown (and maybe PDF→Word) | — |
| **v0.6** | PDF generation options + conversion history | — |
| **v0.7** | HTML, Excel, text, CSV input formats | — |
| **v1.0** | Signed installers + auto-update for macOS / Windows / Linux | — |

Deliberately no calendar dates — ship when each milestone is solid.

---

## Contributing

Want to help? Check out our [Contributing Guide](CONTRIBUTING.md) (coming soon).

---

**Last Updated:** April 24, 2026
