# iownpdf

> **Your documents, your control. Beautiful, offline-first PDF conversion.**

A desktop application built with Tauri and React that converts Markdown, Word, and PowerPoint files to PDF — entirely locally, with zero uploads.

---

## ✨ Features

- 🎨 **Bold Editorial UI** — Brutalist design with sharp geometry and clear typographic hierarchy
- 🌓 **Light & Dark Mode** — System-aware theme with one-click toggle, persisted via preferences store
- 🪟 **Custom Window Chrome** — Frameless title bar with integrated theme toggle and window controls
- ⚡ **Native Performance** — Powered by Rust (`iownpdf_core`) for fast conversions
- 🔒 **100% Local** — Your files never leave your machine
- 📦 **Multi-Format** — Convert `.md`, `.docx`, and `.pptx` to PDF
- 🖥️ **Desktop App** — Native file picker integration via Tauri dialog plugin
- 🗂️ **Batch Conversion** — Select multiple files at once; per-file real-time progress
- 🖱️ **Drag & Drop** — Drop files onto the home screen to open the matching converter
- 📂 **Output Folder** — Choose a destination folder or default to alongside the source file
- ⚙️ **Persistent Preferences** — Settings panel for theme, default output folder, post-convert reveal, and overwrite behavior
- 🕒 **Recent Files** — Quick-access list of previously converted files per format

---

## 📦 Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/iownpdf.git
cd iownpdf

# Install dependencies
bun install

# Run development mode
bun run dev

# Build for production
bun run build
```

### Prerequisites

- [Rust](https://rustup.rs/) 1.89+
- [Bun](https://bun.sh/) 1.0+
- macOS, Windows, or Linux

---

## 🚀 Getting Started

### Development

```bash
# Start development server (Vite + Tauri)
bun run dev

# Run Biome check (format + lint, with fixes)
bun run check

# Format code
bun run format

# Lint code
bun run lint

# Run tests
bun run test
```

### Building the Desktop App

```bash
# Build the Tauri desktop app
bunx tauri build
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Tauri v2](https://tauri.app) | Desktop app framework (Rust backend) |
| [React 19](https://react.dev) | UI library |
| [TanStack Router](https://tanstack.com/router) | File-based routing |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Biome](https://biomejs.dev) | Linting & formatting |
| [Vite](https://vitejs.dev) | Build tool |
| [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) | Unit & component tests |
| [Lucide React](https://lucide.dev) | Icons |

### Rust Core

The conversion engine lives in `crates/iownpdf_core` — a Rust crate that handles all PDF generation. The Tauri backend (`src-tauri/`) exposes these as invokable commands to the React frontend.

---

## 📁 Project Structure

```
iownpdf/
├── src/                      # React frontend
│   ├── routes/               # File-based routes (TanStack Router)
│   │   ├── __root.tsx        # Root layout (mounts ThemeProvider + title bar)
│   │   └── index.tsx         # Home page
│   ├── components/           # UI components
│   │   ├── ComingSoonCard    # Placeholder for planned features
│   │   ├── ConvertButton     # Conversion action card
│   │   ├── CustomTitleBar    # Frameless window chrome
│   │   ├── Modal             # Single-file picker & conversion modal
│   │   ├── BatchModal        # Multi-file conversion with per-file progress
│   │   └── SettingsModal     # Preferences panel (theme, output folder, toggles)
│   ├── context/
│   │   └── ThemeContext      # Theme state, synced to tauri-plugin-store
│   ├── lib/                  # Utilities (conversion helpers)
│   ├── styles.css            # Global styles, design tokens, light/dark vars
│   └── main.tsx              # App entry point
├── src-tauri/                # Tauri Rust backend
│   ├── src/lib.rs            # Tauri commands & setup
│   ├── icons/                # App icons (32, 128, 128@2x, .icns, .ico)
│   └── tauri.conf.json       # Tauri configuration (frameless window)
├── crates/iownpdf_core/      # Core PDF conversion engine (Rust)
│   └── src/
│       ├── converter/        # MdConverter, DocxConverter, PptxConverter
│       ├── utils/validator.rs # Path & extension validation
│       └── errors.rs         # IownPdfError enum (thiserror)
├── index.html                # HTML template
└── vite.config.ts            # Vite configuration
```

---

## 📖 Usage

1. **Launch** iownpdf
2. **Click** a conversion card (Markdown, Word, or PowerPoint) — or drag files straight onto the window
3. **Select** your file using the native file picker (or pick a folder for batch)
4. Optionally choose an **output folder**; otherwise the PDF lands alongside the source file
5. **Click** "Convert to PDF" — then open the containing folder directly from the success state

### Supported Formats

| Format | Extension | Status |
|--------|-----------|--------|
| Markdown | `.md`, `.markdown` | ✅ Working |
| Word | `.docx` | ✅ Working |
| PowerPoint | `.pptx` | ✅ Working |
| PDF to Markdown | — | ⏳ Planned |
| PDF to Word | — | ⏳ Planned |
| PDF to PowerPoint | — | ⏳ Planned |

---

## 🎨 Design

The UI follows an editorial brutalist aesthetic — sharp borders, hard box shadows, geometric forms, and high-contrast monochrome with accent colors per file type:

- 🔵 **Blue** — Markdown conversions
- 🟠 **Orange** — PowerPoint conversions
- 🟣 **Purple** — Word conversions

Typography uses Fraunces (display) and Manrope (body) for a distinctive, editorial feel.

Both light and dark themes are first-class — the toggle lives in the custom title bar and the choice is remembered across sessions.

---

## 🗺️ Roadmap

The full phase-by-phase plan lives in [ROADMAP.md](ROADMAP.md).

**Shipped (v0.1):** three forward converters, frameless window chrome, light/dark theming, final icon set.

**Shipped (v0.2):** output folder selection, batch conversion with real-time progress, drag-and-drop, and "open containing folder" after conversion.

**Shipped (v0.3):** persistent preferences store (`tauri-plugin-store`), settings panel (theme, output folder, post-convert reveal, overwrite toggle), and recent files per format.

**Next up (v0.4):** reverse conversions — PDF→Markdown (pure Rust, `pdf-extract`) and PDF→Word (evaluating Python sidecar).

**Looking further out:** a PDF manipulation toolkit — JPG export, merge, split, watermark, image→PDF (v0.5), generation options and conversion history (v0.6), HTML/Excel/text/CSV input formats (v0.7), and signed installers with auto-update for v1.0.

---

## 🤝 Contributing

Contributions are welcome!

```bash
# Fork, clone, and install
git clone https://github.com/YOUR_USERNAME/iownpdf.git
cd iownpdf && bun install

# Create a branch
git checkout -b feature/your-feature

# Make changes, ensure lint passes
bun run check

# Commit and push
git commit -m "feat: add amazing feature"
git push origin feature/your-feature
```

---

## 📄 License

MIT — see the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- Conversion engine: [iownpdf_core](crates/iownpdf_core/) (Rust)
- Desktop framework: [Tauri](https://tauri.app)
- UI library: [React](https://react.dev)
- Icons: [Lucide](https://lucide.dev)
- Fonts: [Fraunces](https://fraunces.undercase.xyz/) + [Manrope](https://manropefont.com/)

---

**Made with ❤️ using Rust & React**
