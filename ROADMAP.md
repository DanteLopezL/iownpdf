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

## Phase 2: Enhanced UX

### User Experience
- [ ] Dark/Light theme toggle
- [ ] Custom PDF metadata (title, author, subject)
- [ ] Page size and orientation options
- [ ] Margin and padding controls
- [ ] Compression/quality settings

### Productivity
- [ ] Batch conversion (multiple files at once)
- [ ] Conversion history
- [ ] Recent files list
- [ ] Keyboard shortcuts
- [ ] Real-time progress indicators for large files

### File Management
- [ ] Output folder selection
- [ ] Auto-save to predefined location
- [ ] File naming templates
- [ ] Open containing folder after conversion

---

## Phase 3: Reverse Conversions

### PDF Export Formats
- [ ] **PDF to Markdown** — extract text and structure
- [ ] **PDF to Word** — convert to editable `.docx`
- [ ] **PDF to PowerPoint** — transform slides to `.pptx`

---

## Phase 4: Advanced Features

### Additional Input Formats
- [ ] Excel (`.xlsx`) to PDF
- [ ] HTML to PDF
- [ ] CSV to PDF
- [ ] Image formats (PNG, JPG) to PDF
- [ ] Text files (`.txt`) to PDF
- [ ] RTF to PDF

### PDF Tools
- [ ] **PDF to JPG** — export pages as images with resolution control
- [ ] **Watermark PDF** — text/image watermarks with position control
- [ ] **Sign PDF** — draw or upload signature
- [ ] PDF merging
- [ ] PDF splitting
- [ ] Password protection
- [ ] OCR for scanned documents

---

## Phase 5: Distribution & Polish

### Release Preparation
- [ ] App icon and branding
- [ ] Installer packages for macOS (`.dmg`)
- [ ] Auto-update functionality
- [ ] Documentation and help guides
- [ ] Performance optimization
- [ ] Accessibility improvements

### Platform Support
- [ ] macOS (`.dmg`, `.app`)
- [ ] Windows (`.exe`, `.msi`)
- [ ] Linux (`.AppImage`, `.deb`)

---

## Technical Improvements

### Performance
- [ ] Worker threads for conversion tasks
- [ ] Streaming for large files
- [ ] Caching mechanisms
- [ ] Memory optimization

### Quality
- [ ] Unit test coverage > 80%
- [ ] E2E testing with Playwright
- [ ] Error tracking and reporting
- [ ] User analytics (opt-in)

### Developer Experience
- [ ] CI/CD pipeline
- [ ] Automated releases
- [ ] Code documentation
- [ ] Contributing guidelines

---

## Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| MD/DOCX/PPTX to PDF | High | Done | ✅ |
| Batch Conversion | High | Medium | P0 |
| Dark Mode | Medium | Low | P1 |
| Output folder selection | High | Low | P1 |
| PDF to Markdown | High | Medium | P1 |
| PDF to Word | High | High | P2 |
| PDF to JPG | High | Low | P1 |
| Watermark PDF | Medium | Medium | P2 |
| Sign PDF | High | Medium | P1 |
| PDF Merging | Medium | Medium | P3 |

---

## Contributing

Want to help? Check out our [Contributing Guide](CONTRIBUTING.md) (coming soon).

---

**Last Updated:** April 7, 2026
