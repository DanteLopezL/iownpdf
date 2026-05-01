# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**iownpdf** is a cross-platform desktop app for local, offline document-to-PDF conversion. Built with Tauri v2 (Rust backend) + React 19 (TypeScript frontend). All conversions happen 100% on-device — no network calls.

**Supported conversions:** Markdown → PDF, Word (.docx) → PDF, PowerPoint (.pptx) → PDF.

## Commands

Uses **Bun** as the package manager.

```bash
bun run dev       # Start Vite dev server + Tauri listener
bun run build     # Build frontend (Vite)
bun run check     # Biome check with --fix
bun run format    # Biome format
bun run lint      # Biome lint
bun run test      # Vitest (frontend)
bunx tauri build  # Build distributable desktop app
```

For Rust tests inside the core crate:
```bash
cd crates/iownpdf_core && cargo test
```

## Architecture

The app follows a classic Tauri IPC pattern across three layers:

```
React Frontend (src/)
  ↕ invoke() via @tauri-apps/api
Tauri Commands (src-tauri/src/lib.rs)
  ↕ Rust function calls
iownpdf_core (crates/iownpdf_core/)
```

### Frontend (`src/`)

- **Routing:** TanStack Router with file-based routes (`src/routes/`). Route tree is auto-generated in `routeTree.gen.ts` — do not edit manually.
- **UI flow:** `index.tsx` renders conversion cards → clicking opens a Modal → `pick_file()` Tauri command triggers native file picker → `convert_*_to_pdf()` command runs → result shown.
- **Styling:** Tailwind CSS v4, brutalist aesthetic. Design tokens (colors, fonts) are in `src/styles.css`. Color coding: Blue = Markdown, Orange = PowerPoint, Purple = Word.
- **Custom title bar:** Window has `decorations: false`; `CustomTitleBar` component handles drag/minimize/close via Tauri window API.

### Backend (`src-tauri/src/lib.rs`)

All Tauri commands live here:
- `pick_file(extensions)` — opens native file dialog (Tauri dialog plugin)
- `convert_md_to_pdf`, `convert_docx_to_pdf`, `convert_pptx_to_pdf` — thin wrappers calling a generic `convert_file<C>()` helper that instantiates the appropriate `FileConverter` implementor from `iownpdf_core`

Output PDF is always written alongside the source file.

### Core Engine (`crates/iownpdf_core/`)

- **`FileConverter` trait** (`converter/traits.rs`): `new(input: PathBuf)` + `to_pdf() -> Result<PathBuf, IownPdfError>`
- **Implementations:** `MdConverter` (uses `markdown2pdf`), `DocxConverter`, `PptxConverter` (both use `office2pdf`)
- **Error type:** `IownPdfError` in `errors.rs` (derives `thiserror`)
- **Utils:** `utils/` contains input validation (file existence, extension checks) shared by all converters

To add a new format: implement `FileConverter`, add a Tauri command in `lib.rs`, add a card in `index.tsx`.

## Code Conventions

- **Linter/formatter:** Biome (`biome.json`) — tabs, double quotes, auto-organizes imports. Run `bun run check` before committing.
- **TypeScript:** Strict mode with `noUnusedLocals` and `noUnusedParameters` enabled. Path alias `@/` maps to `src/`.
- **Rust:** Use `IownPdfError` for all errors; validate inputs via utils before calling converters.
