# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

A documentation project containing beginner-friendly markdown guides for Claude Code features. There are no build steps, tests, or dependencies — all work is editing `.md` files.

## Repository Structure

```
claude-code/        # 25 guides covering Claude Code CLI features
vscode-extension/   # 13 guides covering the VS Code extension specifically
workflows/          # 9 general role-based workflow guides
workflows/laravel/  # 6 Laravel-specific workflow guides (fullstack, backend, frontend, database, testing, pr-review)
CHEATSHEET.md       # Single-page quick reference for the dev team
README.md           # Project overview with full table of contents
.claude/skills/     # Project-level skills (update-readme)
```

Each directory (`claude-code/`, `vscode-extension/`, `workflows/`) has its own `README.md` as a navigation index.

## Documentation Conventions

- Each file covers exactly one feature — do not combine topics into one file
- Headings follow this order: What it is → How to enable/use → Examples → Tips
- Tables for all reference material (flags, shortcuts, options)
- Tone is beginner-friendly — assume no prior Claude Code knowledge
- Every doc includes practical, copy-pasteable examples with real-world use cases (not just syntax)
- Include OS-specific instructions for macOS, Linux/Ubuntu, and Windows (WSL) where relevant
- Internal cross-links use relative paths: `[connecting-to-ide.md](connecting-to-ide.md)` or `[../claude-code/settings.md](../claude-code/settings.md)`

## Content Scope

`claude-code/` covers the CLI and general features: slash commands, hooks, MCP, git, memory, permissions, plan mode, subagents, skills, settings, context management, output formats, vision, headless/CI mode, cost tracking, and more.

`vscode-extension/` covers the VS Code extension specifically: installation, the `--ide` flag, prompt box, `@` file references, selected-code context, clickable links, remote development (SSH/Containers/WSL/Codespaces), and VS Code-specific keyboard shortcuts.

`workflows/` covers practical team workflows by role: backend, frontend, fullstack, figma-to-frontend, frontend-to-backend, testing, code review, and team lead setup.

## Skills

The `.claude/skills/update-readme.md` skill (`/update-readme`) analyzes recent git changes and makes targeted updates to `README.md` to keep it in sync with the codebase. Run it after adding or removing doc files.
