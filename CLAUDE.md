# CLAUDE.md — OpenConvert Repository Guide

## Repository Overview

OpenConvert is a **local-first Windows desktop file converter** built with
Tauri v2. All processing happens entirely on the user's machine. No data is
uploaded, no accounts are required, and no telemetry is collected.

## Tech Stack

- **Desktop Shell**: Tauri v2
- **Frontend**: React 18, TypeScript 5, Tailwind CSS 3, Lucide React
- **Bundler**: Vite 5
- **Backend**: Rust (Tauri commands in `src-tauri/src/`)
- **Testing**: Vitest (frontend), `cargo test` (Rust)
- **Linting**: ESLint 9 + TypeScript-ESLint
- **Installer**: NSIS (Windows)

## Branch Workflow

- `main` is the default and release branch.
- Feature branches should use conventional prefixes:
  - `feat/` — new features
  - `fix/` — bug fixes
  - `docs/` — documentation
  - `chore/` — tooling, CI, maintenance
  - `refactor/` — code restructuring
- Keep branches focused on a single concern.
- Squash-merge PRs into `main` with descriptive commit messages.

## Coding Expectations

### TypeScript / React

- Use strict TypeScript (`strict: true` in tsconfig). Avoid `any`.
- Functional components with hooks. Follow the rules of hooks.
- Use Tailwind utility classes — avoid custom CSS when possible.
- Use Lucide React for icons.
- Keep components small and focused. Extract reusable logic to `src/lib/`.

### Rust

- Follow idiomatic Rust conventions.
- Handle errors with `Result` types. Avoid `unwrap()` in production code.
- Use `cargo fmt` and `cargo clippy` before committing.

### General

- Run `npm run lint && npm run test && npm run build` before pushing.
- Run `cargo test --manifest-path src-tauri/Cargo.toml` for Rust tests.
- No dead code — if it's not used, remove it.
- No secrets in source files. Use environment variables where needed.

## Architecture Constraints

- **Local-first**: No cloud uploads, no accounts, no telemetry.
- **Windows-first**: The primary target is Windows NSIS installer.
- **File processing**: All conversion happens via Tauri IPC to the Rust backend.
- **History**: Only stores metadata (filename, format, timestamp, status) — not
  file contents or paths.
- **Auto-updates**: Via Tauri updater + GitHub Releases.
- **AGPL-3.0**: Ensure all contributions are compatible.

## Directory Structure

```
OpenConvert/
├── src/                  # Frontend source
│   ├── App.tsx           # Main app component
│   ├── components/       # React components
│   ├── lib/              # Utilities and logic
│   ├── types.ts          # TypeScript types
│   ├── main.tsx          # Entry point
│   └── styles.css        # Tailwind CSS
├── src-tauri/            # Rust backend
│   ├── src/              # Rust source
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
├── .github/workflows/    # CI/CD pipelines
├── docs/                 # Documentation
├── package.json          # npm dependencies
└── vite.config.ts        # Vite configuration
```

## AI Coding Assistant Rules

When acting as an AI coding assistant for this repository:

1. **Do not change source code or product functionality** without explicit
   human approval.
2. **Do add missing governance files** (CODE_OF_CONDUCT, CONTRIBUTING,
   SECURITY, SUPPORT).
3. **Do improve documentation** (README, ROADMAP, CHANGELOG, docs/).
4. **Do improve CI/CD** workflows but verify with `npm run lint/test/build`.
5. **Do audit** for secrets, dead files, and hygiene issues.
6. **Flag security issues** immediately.
