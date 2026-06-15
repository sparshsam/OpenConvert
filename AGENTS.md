# Agents

This file describes how AI agents (Cline, Codex, Copilot, etc.) should interact
with this repository.

## Context

OpenConvert is a local-first Windows desktop file converter built with
Tauri v2 (Rust + React + TypeScript). All processing is done locally;
no data leaves the user's machine.

## Key Constraints

- **Do not modify source code or product functionality.** Only documentation,
  CI/CD, and project governance files should be touched unless explicitly
  directed otherwise.
- **Local-first.** No cloud, no accounts, no telemetry.
- **Windows-first.** The primary target is Windows via NSIS installer.
- **AGPL-3.0 licensed.** Ensure all contributions are compatible.

## When to Consult This File

Agents should read this file at the start of any session involving this
repository, especially when opening PRs, suggesting architecture changes,
or writing new code.

## Agent Tasks

Allowed tasks for AI agents without explicit human approval:

- Fix typos in documentation
- Add badges or metadata to README
- Update CHANGELOG formatting
- Refactor CI/CD workflow formatting
- Create standard governance files (CODE_OF_CONDUCT, CONTRIBUTING, SECURITY, SUPPORT)
- Audit for secret leaks or dead files
- Recommend dependency updates (do not apply without review)

Tasks requiring human approval:

- Any change to `src/` or `src-tauri/src/` source code
- Adding new npm or Cargo dependencies
- Changing the build pipeline or release workflow logic
- Changing the license
- Adding telemetry, analytics, or network calls

## Communication Style

- Be direct and concise.
- Provide structured summaries after audits.
- Flag blockers immediately rather than fabricating results.
