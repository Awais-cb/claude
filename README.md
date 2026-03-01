# Claude Code Documentation

A complete, beginner-friendly reference for every feature of **Claude Code** — Anthropic's official CLI for Claude.

## What's Inside

25 markdown guides covering everything from getting started to advanced automation:

| Guide | Description |
|-------|-------------|
| [Getting Started](docs/getting-started.md) | Installation, first session, basic workflow |
| [CLI Commands](docs/cli-commands.md) | All `claude` flags and options |
| [Slash Commands](docs/slash-commands.md) | Every `/command` available inside a session |
| [Keyboard Shortcuts](docs/keyboard-shortcuts.md) | Hotkeys, vim mode, custom bindings |
| [CLAUDE.md](docs/claude-md.md) | Teach Claude about your project |
| [Memory System](docs/memory-system.md) | Persistent memory across sessions |
| [Permissions](docs/permissions.md) | Control what Claude can and can't do |
| [Plan Mode](docs/plan-mode.md) | Explore and plan before making changes |
| [Thinking Mode](docs/thinking-mode.md) | Extended reasoning for complex problems |
| [Fast Mode](docs/fast-mode.md) | 2.5× faster responses |
| [Subagents](docs/subagents.md) | Spawn specialized parallel workers |
| [Skills](docs/skills.md) | Create your own custom `/commands` |
| [Hooks](docs/hooks.md) | Automate actions on events |
| [MCP Servers](docs/mcp-servers.md) | Connect Claude to external tools |
| [Git Integration](docs/git-integration.md) | Commits, PRs, worktrees, GitHub |
| [IDE Integration](docs/ide-integration.md) | VS Code and JetBrains extensions |
| [Settings](docs/settings.md) | settings.json and environment variables |
| [Context Management](docs/context-management.md) | Context window, compaction, rewind |
| [Task List](docs/task-list.md) | Built-in progress tracking |
| [Output Formats](docs/output-formats.md) | JSON mode, piping, scripting |
| [Vision & Multimodal](docs/vision-multimodal.md) | Images and screenshots |
| [Chrome Integration](docs/chrome-integration.md) | Browser automation |
| [Headless Mode](docs/headless-mode.md) | Non-interactive / CI/CD usage |
| [Cost Tracking](docs/cost-tracking.md) | Monitor usage and reduce costs |

## Quick Start

```bash
# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Log in
claude auth login

# Start a session
claude
```

## Who This Is For

Anyone new to Claude Code who wants to understand what it can do and how to use it effectively — from basic file editing to advanced automation pipelines.
