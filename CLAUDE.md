# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A documentation project containing beginner-friendly markdown guides for Claude Code features. There are no build steps, tests, or dependencies — all work is editing `.md` files.

## Repository Structure

```
claude-code/        # 25 guides covering Claude Code CLI features
vscode-extension/   # 13 guides covering the VS Code extension specifically
README.md           # Project overview (note: still references old docs/ path — needs updating)
```

## Documentation Conventions

- Each file covers exactly one feature — do not combine topics into one file
- Headings follow this order: What it is → How to enable/use → Examples → Tips
- Tables for all reference material (flags, shortcuts, options)
- Tone is beginner-friendly — assume no prior Claude Code knowledge
- Every doc includes practical, copy-pasteable examples with real-world use cases (not just syntax)
- Internal cross-links use relative paths: `[connecting-to-ide.md](connecting-to-ide.md)` or `[../claude-code/settings.md](../claude-code/settings.md)`

## Content Scope

`claude-code/` covers the CLI and general features (slash commands, hooks, MCP, git, memory, permissions, etc.).

`vscode-extension/` covers the VS Code extension specifically: installation, the `--ide` flag, prompt box, `@` file references, selected-code context, clickable links, remote development (SSH/Containers/WSL/Codespaces), and VS Code-specific keyboard shortcuts.

Each directory has its own `README.md` as a navigation index.

## What Needs Updating

The root `README.md` still links to `docs/` paths — these should be updated to `claude-code/` when editing that file.
