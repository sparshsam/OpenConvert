# Architecture

## Overview

OpenConvert is a local-first Windows desktop file converter built with
**Tauri v2** (Rust backend + web frontend). Files are processed entirely on the
user's machine — no data leaves the computer.

```
┌─────────────────────────────────────────────────┐
│                 Tauri Shell                       │
│  ┌──────────────────────┐  ┌──────────────────┐  │
│  │   Frontend (WebView)  │  │  Backend (Rust)   │  │
│  │                       │  │                   │  │
│  │  React + TypeScript   │  │  Tauri Commands   │  │
│  │  Tailwind CSS         │◄─┤  Image Conversion │  │
│  │  Lucide Icons         │  │  File I/O         │  │
│  │                       │  │  Updater          │  │
│  └──────────────────────┘  └──────────────────┘  │
│              │                       ▲            │
│              │     IPC (invoke)      │            │
│              └───────────────────────┘            │
└─────────────────────────────────────────────────┘
```

## Technology Stack

| Layer        | Technology                              |
|-------------|-----------------------------------------|
| Desktop Shell | Tauri v2                              |
| Frontend     | React 18 + TypeScript 5                |
| Styling      | Tailwind CSS 3                         |
| Icons        | Lucide React                           |
| Bundler      | Vite 5                                 |
| Backend      | Rust (Tauri commands)                  |
| Installer    | NSIS (Windows)                         |
| Testing      | Vitest (frontend), built-in (Rust)     |
| Linting      | ESLint 9 + TypeScript-ESLint           |

## Frontend Architecture

The frontend is a single-page React app:

- **`src/App.tsx`** — Main application component with drag-and-drop zone,
  format selector, and conversion trigger.
- **`src/components/`** — UI components:
  - `AboutDialog.tsx` — Application info dialog
  - `HistoryList.tsx` — Local conversion history display
- **`src/lib/`** — Business logic and utilities:
  - `formats.ts` — Format definitions and conversion mapping
  - `formats.test.ts` — Unit tests for format logic
- **`src/types.ts`** — Shared TypeScript types and interfaces
- **`src/styles.css`** — Tailwind CSS directives and custom styles
- **`src/main.tsx`** — React entry point

## Backend Architecture (Rust)

The Rust backend exposes IPC commands invoked from the frontend:

- **`src-tauri/src/main.rs`** — Application entry point
- **`src-tauri/src/lib.rs`** — Tauri command implementations (image conversion,
  file handling, history management)
- **`src-tauri/Cargo.toml`** — Rust dependencies and build configuration

## Data Flow

1. User drops or selects an image file in the frontend
2. Frontend extracts file metadata and sends an IPC `invoke` to the Rust backend
3. Rust backend:
   a. Validates the input file
   b. Decodes the image using the appropriate library
   c. Encodes the image in the target format
   d. Writes the output file to the user-selected directory
   e. Returns the result + history entry to the frontend
4. Frontend displays the result and updates the history list

## Security Model

- **No uploads** — All processing is local
- **No accounts** — No authentication or user data collection
- **No telemetry** — No analytics, crash reporting, or usage tracking
- **No persistent storage of files** — Only filenames and metadata are stored
  in history
- **Safe output naming** — Output files never overwrite existing files
- **CSP** — Content Security Policy is configured via Tauri (currently null
  for development; locked down for production)

## Auto-Update Architecture

OpenConvert uses the Tauri updater plugin to check for new releases on
GitHub Releases. The workflow:

1. A new GitHub Release is published with Tauri updater metadata
2. At app startup, updater checks `latest.json` on GitHub Releases
3. If a newer version is found, user is prompted to download and install
4. The NSIS installer performs a silent passive install

## Build and Release Pipeline

- **CI** (`.github/workflows/ci.yml`): Lint, typecheck, test, and build on
  every push/PR
- **Release** (`.github/workflows/release.yml`): Triggered by `v*` tags.
  Builds the Windows NSIS installer and publishes to GitHub Releases with
  auto-update metadata
