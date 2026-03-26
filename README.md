# iownpdf

> **Beautiful, offline-first PDF conversion for everyone.**

A modern desktop application built with Tauri and TanStack Start that converts various document formats to PDF with ease.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

---

## ✨ Features

- 🎨 **Beautiful UI** - Clean, modern interface with dark/light theme support
- ⚡ **Fast & Lightweight** - Native desktop performance with minimal resource usage
- 🔒 **Offline-First** - Works completely offline, no internet required
- 📦 **Multi-Format Support** - Convert MD, DOCX, PPTX, XLSX and more to PDF
- 🛠️ **Customizable** - Control output quality, page size, margins, and metadata
- 🚀 **Batch Processing** - Convert multiple files at once

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
bun --bun run dev

# Build for production
bun --bun run build
```

### Pre-built Binaries

Pre-built installers for Windows, macOS, and Linux will be available on the [Releases](https://github.com/yourusername/iownpdf/releases) page.

---

## 🚀 Getting Started

### Development

```bash
# Start development server
bun --bun run dev

# Run tests
bun --bun run test

# Format code
bun --bun run format

# Lint code
bun --bun run lint

# Run all checks
bun --bun run check
```

### Building for Production

```bash
# Build the web app
bun --bun run build

# Build the Tauri desktop app
bun tauri build
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [TanStack Start](https://tanstack.com/start) | Full-stack React framework |
| [TanStack Router](https://tanstack.com/router) | File-based routing |
| [Tauri](https://tauri.app) | Desktop app framework |
| [React 19](https://react.dev) | UI library |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Biome](https://biomejs.dev) | Linting & formatting |
| [Vitest](https://vitest.dev) | Testing |
| [Lucide React](https://lucide.dev) | Icons |

---

## 📁 Project Structure

```
iownpdf/
├── src/                  # React application source code
│   ├── routes/           # File-based routes (TanStack Router)
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and helpers
│   └── styles/           # Global styles
├── src-tauri/            # Tauri native code (Rust)
│   ├── src/              # Rust source files
│   └── tauri.conf.json   # Tauri configuration
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── biome.json            # Biome configuration
```

---

## 📖 Usage

### Converting Documents

1. **Launch** iownpdf from your applications folder
2. **Drag & Drop** your file(s) onto the conversion zone
3. **Select** your desired output format (PDF)
4. **Configure** optional settings (page size, margins, etc.)
5. **Click** Convert and wait for completion
6. **Open** your converted PDF or the containing folder

### Supported Formats

| Format | Extension | Status |
|--------|-----------|--------|
| Markdown | `.md` | 🚧 In Progress |
| Word | `.docx` | 🚧 In Progress |
| PowerPoint | `.pptx` | ⏳ Planned |
| Excel | `.xlsx` | ⏳ Planned |
| HTML | `.html` | ⏳ Planned |
| Images | `.png`, `.jpg` | ⏳ Planned |
| Text | `.txt` | ⏳ Planned |

---

## 🧪 Testing

```bash
# Run all tests
bun --bun run test

# Run tests in watch mode
bun --bun run test:watch

# Run tests with coverage
bun --bun run test:coverage
```

---

## 🎨 Customization

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove demo pages in `src/routes/demo/`
2. Replace Tailwind imports in `src/styles.css` with your own styles
3. Remove `tailwindcss()` from plugins in `vite.config.ts`
4. Uninstall packages: `bun remove @tailwindcss/vite tailwindcss`

### Adding Custom Routes

TanStack Router uses file-based routing. To add a new route:

1. Create a new file in `src/routes/` (e.g., `src/routes/about.tsx`)
2. The route will be automatically generated at `/about`

Example:
```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return <h1>About Page</h1>
}
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) (coming soon) first.

### Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/YOUR_USERNAME/iownpdf.git

# Install dependencies
bun install

# Create a branch
git checkout -b feature/your-feature

# Make your changes and commit
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/your-feature
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [TanStack Start](https://tanstack.com/start) and [Tauri](https://tauri.app)
- Icons by [Lucide](https://lucide.dev)
- Powered by [Vite](https://vitejs.dev)

---

## 📬 Contact

- **Website:** [iownpdf.com](https://iownpdf.com) (coming soon)
- **GitHub:** [github.com/iownpdf](https://github.com/yourusername/iownpdf)
- **Issues:** [Report a bug](https://github.com/yourusername/iownpdf/issues)

---

**Made with ❤️ using TanStack Start + Tauri**
