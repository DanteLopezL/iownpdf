# iownpdf

> **Your documents, your control. Beautiful, offline-first PDF conversion.**

A desktop application built with Tauri and React that converts Markdown, Word, and PowerPoint files to PDF — entirely locally, with zero uploads.

---

## ✨ Features

- 🎨 **Bold Editorial UI** — Brutalist design with sharp geometry and clear typographic hierarchy
- 🌓 **Light & Dark Mode** — System-aware theme with one-click toggle, persisted across sessions
- 🪟 **Custom Window Chrome** — Frameless title bar with integrated theme toggle and window controls
- ⚡ **Native Performance** — Powered by Rust (`iownpdf_core`) for fast conversions
- 🔒 **100% Local** — Your files never leave your machine
- 📦 **Multi-Format** — Convert `.md`, `.docx`, and `.pptx` to PDF
- 🖥️ **Desktop App** — Native file picker integration via Tauri dialog plugin

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
│   │   ├── Modal             # File picker & conversion modal
│   │   └── ThemeToggle       # Light / dark switcher
│   ├── context/
│   │   └── ThemeContext      # Theme state + localStorage persistence
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
2. **Click** a conversion card (Markdown, Word, or PowerPoint)
3. **Select** your file using the native file picker
4. **Click** "Convert to PDF"
5. The PDF is saved alongside your original file

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

**Next up (v0.2):** output folder selection, batch conversion, drag-and-drop, "open containing folder" after a successful convert — running in parallel with a v0.2.1 pass on Vitest specs and a cross-platform GitHub Actions pipeline.

**Looking further out:** a persistent preferences store (v0.3), a PDF manipulation toolkit — JPG export, merge, split, watermark, image-to-PDF (v0.4), reverse conversions starting with PDF→Markdown (v0.5), and signed installers with auto-update across macOS, Windows, and Linux for v1.0.

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
