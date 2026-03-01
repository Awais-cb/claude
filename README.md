# Claude Code Documentation

A complete, beginner-friendly reference for every feature of **Claude Code** — Anthropic's official CLI for Claude.

## What's Inside

24 guides covering everything from getting started to advanced automation:

| Guide | Description |
|-------|-------------|
| [Getting Started](claude-code/getting-started.md) | Installation, first session, basic workflow |
| [CLI Commands](claude-code/cli-commands.md) | All `claude` flags and options |
| [Slash Commands](claude-code/slash-commands.md) | Every `/command` available inside a session |
| [Keyboard Shortcuts](claude-code/keyboard-shortcuts.md) | Hotkeys, vim mode, custom bindings |
| [CLAUDE.md](claude-code/claude-md.md) | Teach Claude about your project |
| [Memory System](claude-code/memory-system.md) | Persistent memory across sessions |
| [Permissions](claude-code/permissions.md) | Control what Claude can and can't do |
| [Plan Mode](claude-code/plan-mode.md) | Explore and plan before making changes |
| [Thinking Mode](claude-code/thinking-mode.md) | Extended reasoning for complex problems |
| [Fast Mode](claude-code/fast-mode.md) | 2.5× faster responses |
| [Subagents](claude-code/subagents.md) | Spawn specialized parallel workers |
| [Skills](claude-code/skills.md) | Create your own custom `/commands` |
| [Hooks](claude-code/hooks.md) | Automate actions on events |
| [MCP Servers](claude-code/mcp-servers.md) | Connect Claude to external tools |
| [Git Integration](claude-code/git-integration.md) | Commits, PRs, worktrees, GitHub |
| [IDE Integration](claude-code/ide-integration.md) | VS Code and JetBrains extensions |
| [Settings](claude-code/settings.md) | settings.json and environment variables |
| [Context Management](claude-code/context-management.md) | Context window, compaction, rewind |
| [Task List](claude-code/task-list.md) | Built-in progress tracking |
| [Output Formats](claude-code/output-formats.md) | JSON mode, piping, scripting |
| [Vision & Multimodal](claude-code/vision-multimodal.md) | Images and screenshots |
| [Chrome Integration](claude-code/chrome-integration.md) | Browser automation |
| [Headless Mode](claude-code/headless-mode.md) | Non-interactive / CI/CD usage |
| [Cost Tracking](claude-code/cost-tracking.md) | Monitor usage and reduce costs |

## VS Code Extension

13 focused guides for the Claude Code VS Code extension:

| Guide | Description |
|-------|-------------|
| [Overview](vscode-extension/README.md) | What the extension does and quick start |
| [Installation](vscode-extension/installation.md) | Installing from Marketplace, terminal, or VSIX |
| [Connecting to VS Code](vscode-extension/connecting-to-ide.md) | The `--ide` flag and auto-connect setup |
| [Prompt Box](vscode-extension/prompt-box.md) | Submitting prompts without leaving the editor |
| [File References](vscode-extension/file-references.md) | `@filename` autocomplete for files and folders |
| [Selected Code Context](vscode-extension/selected-code-context.md) | Highlighted code as automatic context |
| [Clickable Links](vscode-extension/clickable-links.md) | Jump to files and lines from Claude's responses |
| [Session Management](vscode-extension/session-management.md) | Naming, resuming, and running multiple sessions |
| [Keyboard Shortcuts](vscode-extension/keyboard-shortcuts.md) | VS Code-level and session-level shortcuts |
| [Remote Development](vscode-extension/remote-development.md) | SSH, Dev Containers, WSL, and Codespaces |
| [Slash Commands](vscode-extension/slash-commands-in-vscode.md) | All slash commands available in VS Code sessions |
| [Settings & Configuration](vscode-extension/settings-configuration.md) | Settings files, options, and environment variables |
| [Workflow Tips](vscode-extension/workflow-tips.md) | Best practices, layouts, and productivity patterns |

## Workflows

Role-based guides for teams — how each role uses Claude Code day-to-day:

| Guide | Who it's for |
|-------|-------------|
| [Team Lead Setup](workflows/team-lead-setup.md) | Configure Claude for the whole team |
| [Backend](workflows/backend.md) | APIs, databases, migrations, backend testing |
| [Frontend](workflows/frontend.md) | Components, styling, state, frontend testing |
| [Fullstack](workflows/fullstack.md) | End-to-end feature development |
| [Figma to Frontend](workflows/figma-to-frontend.md) | Convert Figma designs to code |
| [Frontend to Backend](workflows/frontend-to-backend.md) | API integration, type sharing |
| [Testing](workflows/testing.md) | Unit, integration, E2E, and TDD |
| [Code Review](workflows/code-review.md) | PR review, security, performance audits |

**Laravel teams:** see [workflows/laravel/](workflows/laravel/) for Laravel-specific guides (service layer, Eloquent, Livewire, Blade, testing, PR review).

## Quick Start

```bash
# Install Claude Code
curl -fsSL https://claude.ai/install.sh | bash
# macOS: brew install claude  |  Windows: winget install Anthropic.Claude

# Log in
claude auth login

# Start a session
claude
```

## Other Resources

| File | What it is |
|------|-----------|
| [OVERVIEW.md](OVERVIEW.md) | One-liner feature map with analogies — skim to discover what's possible |
| [CHEATSHEET.md](CHEATSHEET.md) | Single-page command reference — print this for your desk |

## Who This Is For

Anyone new to Claude Code who wants to understand what it can do and how to use it effectively — from basic file editing to advanced automation pipelines.
