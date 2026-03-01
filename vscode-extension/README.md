# Claude Code — VS Code Extension

A complete guide to using Claude Code inside Visual Studio Code. Each doc covers one feature in depth.

---

## What Is the VS Code Extension?

The Claude Code VS Code extension bridges your editor and the Claude Code CLI. Instead of switching between a terminal and your editor, you get a **prompt box inside VS Code**, automatic context from your open files and selections, and clickable file links directly in Claude's responses.

The extension does not replace the CLI — it enhances it. Claude Code still runs as a process (in your terminal or background), and the extension connects VS Code to that process.

---

## Guides in This Folder

| Guide | What It Covers |
|-------|---------------|
| [installation.md](installation.md) | Installing the extension from the Marketplace or terminal |
| [connecting-to-ide.md](connecting-to-ide.md) | `claude --ide` — auto-connecting Claude Code to VS Code |
| [prompt-box.md](prompt-box.md) | The VS Code prompt panel — submitting prompts without leaving the editor |
| [file-references.md](file-references.md) | `@filename` autocomplete for referencing files and folders |
| [selected-code-context.md](selected-code-context.md) | Highlight code → Claude sees it automatically as context |
| [clickable-links.md](clickable-links.md) | File links in responses that jump directly to the right line |
| [session-management.md](session-management.md) | Resuming sessions, naming sessions, running multiple sessions |
| [keyboard-shortcuts.md](keyboard-shortcuts.md) | Every shortcut available in VS Code + inside sessions |
| [remote-development.md](remote-development.md) | SSH, Dev Containers, WSL, and GitHub Codespaces |
| [slash-commands-in-vscode.md](slash-commands-in-vscode.md) | All slash commands available inside a VS Code session |
| [settings-configuration.md](settings-configuration.md) | Settings files, key options, and environment variables |
| [workflow-tips.md](workflow-tips.md) | Best practices, recommended layouts, and productivity patterns |

---

## Quick Start (60 seconds)

```bash
# 1. Install the extension
code --install-extension anthropic.claude-code

# 2. Open your project in VS Code, then in the integrated terminal:
cd ~/projects/my-app
claude --ide
```

The Claude Code prompt box appears in VS Code. You're ready.

---

## How It All Connects

```
┌──────────────────────────────────────┐
│           VS Code Editor             │
│                                      │
│  ┌─────────────┐  ┌───────────────┐  │
│  │  Your Code  │  │  Claude Code  │  │
│  │  (editor)   │  │  Prompt Box   │  │
│  └─────────────┘  └───────────────┘  │
│         ↑                ↓           │
│    File edits       Prompts sent     │
│    appear here      from here        │
└──────────────┬───────────────────────┘
               │  bidirectional sync
┌──────────────▼───────────────────────┐
│      Claude Code CLI (process)       │
│  Reads files, runs tools, edits code │
└──────────────────────────────────────┘
```

---

## Prerequisites

- VS Code (any recent version)
- Node.js 18+
- Claude Code CLI installed: `npm install -g @anthropic-ai/claude-code`
- Anthropic account (for API key)

---

## Related Docs

- [../ide-integration.md](../ide-integration.md) — High-level IDE overview (VS Code + JetBrains)
- [../getting-started.md](../getting-started.md) — Installing and using Claude Code
- [../keyboard-shortcuts.md](../keyboard-shortcuts.md) — Full keyboard shortcut reference
- [../slash-commands.md](../slash-commands.md) — All slash commands
