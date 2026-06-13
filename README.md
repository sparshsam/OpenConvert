# OpenConvert

OpenConvert is a bright, roomy, local-first Windows desktop file converter.

Version `0.1.0` supports image-to-image conversion only. It is created by [Sparsh Sam](https://github.com/sparshsam) and licensed under AGPL-3.0.

## Features

- Windows-first desktop app built with Tauri, React, TypeScript, Tailwind CSS, and Rust
- Clean native Windows NSIS installer and uninstaller
- Auto-update plumbing through GitHub Releases
- Drag-and-drop image upload
- Manual file picker
- Local file type detection
- Single-file image conversion
- Output folder selection
- Conversion progress and success/failure status
- Basic local conversion history
- No accounts, no cloud uploads, no telemetry

## Supported Formats

Input:

- PNG
- JPG/JPEG
- WEBP
- BMP
- TIFF

Output:

- PNG
- JPG/JPEG
- WEBP
- BMP
- TIFF

All valid image-to-image combinations between those formats are supported.

## Privacy

OpenConvert processes files locally on your computer.

It never uploads files, requires accounts, or sends telemetry. It also never stores original or converted files inside the app.

History stores only:

- original filename
- input format
- output format
- timestamp
- result status

History does not store original files, converted files, file paths, or file contents.

## Install

Download the latest Windows installer from GitHub Releases:

https://github.com/sparshsam/OpenConvert/releases

Run the `.exe` installer. Windows will also get a standard uninstaller entry.

## Development

Requirements:

- Node.js 20 or newer
- Rust stable
- Windows build tools for packaging Windows installers

Install dependencies:

```bash
npm install
```

Run the app in development:

```bash
npm run tauri dev
```

Run checks:

```bash
npm run lint
npm run test
npm run build
cd src-tauri && cargo test
```

Build the Windows installer:

```bash
npm run tauri build
```

## Auto-Updates

OpenConvert is configured to check GitHub Releases for Tauri updater metadata at:

```text
https://github.com/sparshsam/OpenConvert/releases/latest/download/latest.json
```

Before publishing production releases, generate Tauri updater keys and set the private key as GitHub Actions secrets:

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` if the key is password-protected

The public key must be stored in `src-tauri/tauri.conf.json`.

## Limitations in v0.1.0

- Image conversion only
- Single-file conversion only
- No audio, video, PDF, document, OCR, mobile, cloud, account, telemetry, plugin, or batch features
- Resolution is preserved through decode/encode
- Orientation and color profile preservation depend on source metadata and encoder support
