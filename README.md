# iownpdf

> **Your documents, your control. Beautiful, offline-first PDF conversion.**

A desktop application built with Tauri and React that converts Markdown, Word, and PowerPoint files to PDF — entirely locally, with zero uploads.

---

## ✨ Features

- 🎨 **Bold Editorial UI** — Brutalist design with sharp geometry and clear typographic hierarchy
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

# Run Biome check
bun run check

# Format code
bun run format

# Lint code
bun run lint
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
| [Lucide React](https://lucide.dev) | Icons |

### Rust Core

The conversion engine lives in `crates/iownpdf_core` — a Rust crate that handles all PDF generation. The Tauri backend (`src-tauri/`) exposes these as invokable commands to the React frontend.

---

## 📁 Project Structure

```
iownpdf/
├── src/                      # React frontend
│   ├── routes/               # File-based routes (TanStack Router)
│   │   ├── __root.tsx        # Root layout
│   │   └── index.tsx         # Home page
│   ├── components/           # UI components
│   │   ├── ComingSoonCard    # Placeholder for planned features
│   │   ├── ConvertButton     # Conversion action card
│   │   └── Modal             # File picker & conversion modal
│   ├── lib/                  # Utilities (conversion helpers)
│   ├── styles.css            # Global styles & design tokens
│   └── main.tsx              # App entry point
├── src-tauri/                # Tauri Rust backend
│   ├── src/lib.rs            # Tauri commands & setup
│   └── tauri.conf.json       # Tauri configuration
├── crates/iownpdf_core/      # Core PDF conversion engine (Rust)
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
