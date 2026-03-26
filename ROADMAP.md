# iownpdf Roadmap

A comprehensive roadmap for the iownpdf PDF conversion application.

## 🎯 Vision

Create a beautiful, fast, and offline-first desktop application for converting various document formats to PDF.

---

## Phase 1: Foundation (Current)

### Core Setup
- [x] Project initialization with TanStack Start
- [x] Tauri desktop app setup
- [x] TypeScript configuration
- [x] Tailwind CSS styling
- [x] Biome linting & formatting
- [x] Vitest testing setup

### MVP Features
- [ ] **Home Page**
  - Clean, modern UI with drag-and-drop zone
  - File format selection
  - Conversion status indicators
  - Settings/preferences panel

---

## Phase 2: Core Conversion Features

### Document Converters
- [ ] **Markdown (`.md`) to PDF**
  - Syntax highlighting for code blocks
  - Table of contents generation
  - Custom themes (light/dark)
  - Preview before export

- [ ] **Word (`.docx`) to PDF**
  - Preserve formatting and styles
  - Handle images and tables
  - Support headers/footers
  - Batch conversion support

- [ ] **PowerPoint (`.pptx`) to PDF**
  - Slide-by-slide conversion
  - Maintain animations as static frames
  - Handout mode (multiple slides per page)
  - Notes inclusion option

- [ ] **Excel (`.xlsx`) to PDF**
  - Sheet selection
  - Fit-to-page options
  - Preserve formulas as values
  - Maintain formatting and charts

---

## Phase 3: Enhanced Features

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
- [ ] Progress indicators for large files

### File Management
- [ ] Output folder selection
- [ ] Auto-save to predefined location
- [ ] File naming templates
- [ ] Open containing folder after conversion

---

## Phase 4: Advanced Features

### Additional Formats
- [ ] HTML to PDF
- [ ] CSV to PDF
- [ ] Image formats (PNG, JPG) to PDF
- [ ] Text files (`.txt`) to PDF
- [ ] RTF to PDF
- [ ] **PDF to JPG** (Image Export)
  - Export all pages as images
  - Select specific pages
  - Resolution/quality settings
  - Batch export support

### PDF Tools
- [ ] **Watermark PDF**
  - Text watermarks (custom font, size, opacity)
  - Image watermarks (logo support)
  - Position control (tiling, center, corners)
  - Apply to single or all pages

- [ ] **Sign PDF**
  - Draw signature with mouse/trackpad
  - Upload signature image
  - Save multiple signatures
  - Place and resize on pages
  - Digital signature support (future)

### Premium Features
- [ ] PDF merging
- [ ] PDF splitting
- [ ] Password protection
- [ ] OCR for scanned documents

---

## Phase 5: Distribution & Polish

### Release Preparation
- [ ] App icon and branding
- [ ] Installer packages for macOS
- [ ] Auto-update functionality
- [ ] Documentation and help guides
- [ ] Performance optimization
- [ ] Accessibility improvements

### Platform Support
- [ ] macOS (`.dmg`, `.app`)

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
| Home Page | High | Low | P0 |
| MD to PDF | High | Medium | P0 |
| DOCX to PDF | High | High | P1 |
| PPTX to PDF | Medium | High | P2 |
| XLSX to PDF | Medium | High | P2 |
| Batch Conversion | High | Medium | P1 |
| Dark Mode | Medium | Low | P1 |
| PDF to JPG | High | Low | P1 |
| Watermark PDF | Medium | Medium | P2 |
| Sign PDF | High | Medium | P1 |
| PDF Merging | Medium | Medium | P3 |

---

## Contributing

Want to help? Check out our [Contributing Guide](CONTRIBUTING.md) (coming soon).

---

**Last Updated:** March 24, 2026
