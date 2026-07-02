<p align="center">
  <h1 align="center">OpenConvert</h1>
  <p align="center">
    A bright, roomy, local-first desktop file converter for Windows.
    <br />
    <strong>Privacy-first · No uploads · No accounts · No telemetry</strong>
  </p>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Status: Alpha" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue?style=for-the-badge" alt="License: AGPL-3.0" /></a>
  <a href="https://github.com/sparshsam/OpenConvert/releases"><img src="https://img.shields.io/badge/platform-Windows-blue?style=for-the-badge" alt="Platform: Windows" /></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" /></a>
  <br />
  <a href="https://github.com/sparshsam/OpenConvert/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/sparshsam/OpenConvert/ci.yml?branch=main&label=CI&style=for-the-badge" alt="CI" /></a>
  <a href="https://github.com/sparshsam/OpenConvert/releases"><img src="https://img.shields.io/github/v/release/sparshsam/OpenConvert?display_name=tag&style=for-the-badge" alt="Latest Release" /></a>
</p>

---

**Version `0.1.0`** supports image-to-image conversion only. Created by
[Sparsh Sam](https://github.com/sparshsam) and licensed under
[AGPL-3.0](LICENSE).

## Quick Links

- [Features](#features)
- [Supported Formats](#supported-formats)
- [Install](#install)
- [Development](#development)
- [Architecture](docs/architecture.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)

## Screenshots

> Screenshots coming soon. OpenConvert is in early alpha.

## Features

| Feature                    | Status |
|----------------------------|--------|
| 📁 Drag-and-drop upload    | ✅     |
| 📂 Manual file picker      | ✅     |
| 🔍 Local file type detection | ✅   |
| 🔄 Single-file image conversion | ✅ |
| 📝 Output folder selection | ✅     |
| 📊 Conversion progress & status | ✅ |
| 📜 Local conversion history | ✅    |
| 🔄 Auto-update plumbing    | ✅     |
| 🔒 No accounts / cloud / telemetry | ✅ |
| 📦 Batch conversion        | ❌     |
| 📄 PDF / document conversion | ❌   |
| 🎵 Audio conversion        | ❌     |
| 🎬 Video conversion        | ❌     |

## Supported Formats

| Direction | Formats                       |
|-----------|-------------------------------|
| **Input** | PNG, JPG/JPEG, WEBP, BMP, TIFF |
| **Output** | PNG, JPG/JPEG, WEBP, BMP, TIFF |

All valid image-to-image combinations between those formats are supported.

## Tech Stack

| Layer        | Technology                              |
|-------------|-----------------------------------------|
| Desktop Shell | [Tauri v2](https://v2.tauri.app)     |
| Frontend     | [React 18](https://react.dev), [TypeScript 5](https://www.typescriptlang.org) |
| Styling      | [Tailwind CSS 3](https://tailwindcss.com) |
| Icons        | [Lucide React](https://lucide.dev)    |
| Bundler      | [Vite 5](https://vitejs.dev)          |
| Backend      | [Rust](https://www.rust-lang.org) (Tauri commands) |
| Installer    | NSIS (Windows)                        |
| Testing      | [Vitest](https://vitest.dev), `cargo test` |
| Linting      | [ESLint 9](https://eslint.org) + TypeScript-ESLint |

## Privacy

OpenConvert processes files **locally on your computer**. It never uploads
files, requires accounts, or sends telemetry. It also never stores original or
converted files inside the app.

History stores only:
- original filename
- input format
- output format
- timestamp
- result status

History does **not** store original files, converted files, file paths, or
file contents.

## Install

Download the latest Windows installer from
[GitHub Releases](https://github.com/sparshsam/OpenConvert/releases).

Run the `.exe` installer. Windows will also get a standard uninstaller entry.

## Development

### Requirements

- Node.js 20 or newer
- Rust stable
- Windows build tools for packaging Windows installers

### Setup

```bash
npm install
```

### Run in development

```bash
npm run tauri dev
```

### Run checks

```bash
npm run lint       # ESLint
npm run test       # Vitest (frontend)
npm run build      # TypeScript typecheck + Vite build
cd src-tauri && cargo test  # Rust tests
```

### Build the Windows installer

```bash
npm run tauri build
```

## Repository Structure

```
OpenConvert/
├── src/                      # Frontend source
│   ├── App.tsx               # Main app component
│   ├── components/           # React components
│   │   ├── AboutDialog.tsx   # About dialog
│   │   └── HistoryList.tsx   # Conversion history
│   ├── lib/                  # Utilities and logic
│   │   ├── formats.ts        # Format definitions
│   │   └── formats.test.ts   # Format tests
│   ├── types.ts              # Shared TypeScript types
│   ├── main.tsx              # React entry point
│   └── styles.css            # Tailwind CSS directives
├── src-tauri/                # Rust backend
│   ├── src/
│   │   ├── lib.rs            # Tauri commands
│   │   └── main.rs           # Rust entry point
│   ├── Cargo.toml            # Rust dependencies
│   ├── Cargo.lock            # Locked Rust deps
│   ├── tauri.conf.json       # Tauri configuration
│   ├── capabilities/         # Tauri capability config
│   └── icons/                # App icons
├── docs/                     # Documentation
│   └── architecture.md       # Architecture overview
├── .github/workflows/        # CI/CD
│   ├── ci.yml                # Lint, test, build
│   └── release.yml           # Windows release build
├── package.json              # npm dependencies
├── eslint.config.js          # ESLint configuration
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── index.html                # HTML entry point
├── LICENSE                   # AGPL-3.0 license
├── CODE_OF_CONDUCT.md        # Community guidelines
├── CONTRIBUTING.md           # Contribution guide
├── SECURITY.md               # Security policy
├── SUPPORT.md                # Support information
├── AGENTS.md                 # AI agent guidance
├── CLAUDE.md                 # Repository rules for AI
├── ROADMAP.md                # Project roadmap
├── CHANGELOG.md              # Version history
└── README.md                 # This file
```

## Limitations in v0.1.0

- Image conversion only
- Single-file conversion only
- No audio, video, PDF, document, OCR, mobile, cloud, account, telemetry,
  plugin, or batch features
- Resolution is preserved through decode/encode
- Orientation and color profile preservation depend on source metadata and
  encoder support

## License

OpenConvert is licensed under the **GNU Affero General Public License v3.0**.
See [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Last updated: 2026-06-14</sub>
</p>

<br>

---

<br>

<p align="center">
  <strong>Part of the Kovina Collection</strong>
</p>

<p align="center">
  <a href="https://github.com/sparshsam/openreader">OpenReader</a> ·
  <a href="https://github.com/sparshsam/openjournal">OpenJournal</a> ·
  <a href="https://github.com/sparshsam/openledger">OpenLedger</a> ·
  <a href="https://github.com/sparshsam/opentone">OpenTone</a> ·
  <a href="https://github.com/sparshsam/openpalette">OpenPalette</a> ·
  <a href="https://github.com/sparshsam/openconvert">OpenConvert</a>
</p>

<p align="center">
  <a href="https://github.com/sparshsam/opensnap">OpenSnap</a> ·
  <a href="https://github.com/sparshsam/worldclock-widget">WorldClock Widget</a> ·
  <a href="https://github.com/sparshsam/openproof">OpenProof</a> ·
  <a href="https://github.com/sparshsam/opensend">OpenSend</a> ·
  <a href="https://github.com/sparshsam/opensprout">OpenSprout</a>
</p>

<p align="center">
  <a href="https://github.com/sparshsam/wordwise">WordWise</a> ·
  <a href="https://github.com/sparshsam/openscrabble">OpenScrabble</a> ·
  <a href="https://github.com/sparshsam/chess">Chess</a> ·
  <a href="https://github.com/sparshsam/hisstastic">Hisstastic</a>
</p>

<p align="center">
  <sub>Minimal, focused tools for everyday tasks.</sub>
</p>