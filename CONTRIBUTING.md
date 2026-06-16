# Contributing to OpenConvert

Thank you for your interest in contributing! OpenConvert is a local-first
desktop file converter. We welcome contributions that respect the project's
scope and principles.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project and everyone participating in it is governed by the
[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). By participating, you are expected
to uphold this code.

## Getting Started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/OpenConvert.git
   ```
3. Set up the development environment:
   - Node.js 20 or newer
   - Rust stable
   - Windows build tools (for packaging)
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a branch for your work:
   ```bash
   git checkout -b my-feature-branch
   ```

## Development Workflow

1. Make your changes on a feature branch (not `main`).
2. Keep changes focused — one feature or fix per branch.
3. Run checks before committing:
   ```bash
   npm run lint
   npm run test
   npm run build
   cd src-tauri && cargo test
   ```
4. Commit messages should follow conventional commits:
   - `feat:` — new feature
   - `fix:` — bug fix
   - `docs:` — documentation
   - `chore:` — tooling, CI, maintenance
   - `refactor:` — code restructuring

## Pull Request Guidelines

- Open PRs against the `main` branch.
- Title should summarize the change (e.g., "feat: add batch conversion").
- Link related issues in the PR description.
- Keep PRs small and reviewable.
- Ensure all CI checks pass before requesting review.
- Do not merge your own PRs without review.

## Coding Standards

- **TypeScript**: Strict mode enabled. Avoid `any`. Use typed interfaces.
- **React**: Functional components with hooks. Follow hooks rules.
- **Rust**: Idiomatic Rust, handle errors with `Result`, avoid `unwrap` in
  production code.
- **CSS**: Tailwind CSS utility classes. Avoid custom CSS unless necessary.
- **Formatting**: ESLint and Prettier conventions (run `npm run lint`).

## Testing

- Frontend tests: `npm run test` (Vitest).
- Rust tests: `cargo test` in `src-tauri/`.
- Add tests for new functionality.
- Ensure existing tests pass.

## Reporting Issues

- Search existing issues before opening a new one.
- Use issue templates if available.
- Include:
  - OpenConvert version
  - OS version
  - Steps to reproduce
  - Expected vs. actual behavior
  - Screenshots or logs if applicable

## Licensing

By contributing, you agree that your contributions will be licensed under the
AGPL-3.0 License.
