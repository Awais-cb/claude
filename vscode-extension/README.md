# Claude Code — VS Code Extension

A complete guide to using Claude Code inside Visual Studio Code. Each doc covers one feature in depth.

---

## What Is the VS Code Extension?

Think of the Claude Code VS Code extension like hiring a co-pilot who sits right next to you while you code. Instead of switching between a terminal and your editor — like constantly looking over your shoulder — your AI assistant lives *inside* VS Code, sees exactly what you're looking at, and responds right there without you leaving your workspace.

The extension bridges your editor and the Claude Code CLI. You get a **prompt box inside VS Code**, automatic context from your open files and selections, and clickable file links directly in Claude's responses. When Claude says "the bug is in `auth.ts` line 47," you click that reference and VS Code jumps there instantly.

The extension does not replace the CLI — it enhances it. Claude Code still runs as a process (in your terminal or background), and the extension connects VS Code to that process over a local bidirectional channel.

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

## Quick Start

### macOS

```bash
# 1. Install the extension
code --install-extension anthropic.claude-code

# 2. Open your project in VS Code, then in the integrated terminal:
cd ~/projects/my-app
claude --ide
```

> If `code` is not found, open VS Code → `Cmd+Shift+P` → type "Shell Command: Install 'code' command in PATH" → press Enter.

### Linux (Ubuntu/Debian)

```bash
# 1. Install the extension
code --install-extension anthropic.claude-code

# 2. Open your project and start Claude with IDE integration
cd ~/projects/my-app
claude --ide
```

### Windows — Native (PowerShell)

```powershell
# 1. Install the extension
code --install-extension anthropic.claude-code

# 2. Open your project and start Claude
cd C:\projects\my-app
claude --ide
```

### Windows — WSL (Recommended for Windows users)

```bash
# Inside your WSL terminal (Ubuntu, Debian, etc.)
# 1. Install the extension in VS Code (do this from the Windows side, or from WSL with code --install-extension)
code --install-extension anthropic.claude-code

# 2. Open VS Code connected to WSL: Ctrl+Shift+P → "WSL: New WSL Window"
# 3. In the WSL integrated terminal:
cd ~/projects/my-app
claude --ide
```

The Claude Code prompt box appears in VS Code. You're ready.

---

## How It All Connects

```
┌─────────────────────────────────────────────────────┐
│                   VS Code Editor                    │
│                                                     │
│  ┌──────────────────┐     ┌───────────────────────┐ │
│  │   Your Code      │     │   Claude Code         │ │
│  │   (editor tabs)  │     │   Prompt Box / Panel  │ │
│  │                  │     │                       │ │
│  │  > select code   │────▶│  > ask about it       │ │
│  │  > see edits     │◀────│  > Claude edits here  │ │
│  └──────────────────┘     └───────────────────────┘ │
│         ▲                           │               │
│    File edits                  Prompts sent         │
│    appear here                 from here            │
└─────────────────────┬───────────────────────────────┘
                      │  bidirectional sync
                      │  (local socket connection)
┌─────────────────────▼───────────────────────────────┐
│           Claude Code CLI (background process)      │
│   Reads files, runs tools, edits code, runs tests   │
└─────────────────────────────────────────────────────┘
                      │
                      │  HTTPS API calls
                      ▼
┌─────────────────────────────────────────────────────┐
│              Anthropic API (Claude model)           │
└─────────────────────────────────────────────────────┘
```

**What this means in practice:**
- Your code editor and Claude share the same workspace awareness
- When you select code, Claude sees it without you doing anything extra
- When Claude edits a file, VS Code refreshes it instantly
- File references in Claude's responses (`auth.ts:47`) are clickable links

---

## Prerequisites

| Requirement | Minimum Version | Per-OS Notes |
|-------------|----------------|--------------|
| VS Code | 1.80+ | Works on Windows, macOS, Linux |
| Node.js | 18+ | macOS: use `brew` or `nvm`; Windows: use `nvm-windows` or WSL; Linux: use `nvm` or `apt` |
| Claude Code CLI | Latest | Install via `npm install -g @anthropic-ai/claude-code` |
| Anthropic account | — | Sign up free at [claude.ai](https://claude.ai) |

### Node.js version check

**macOS / Linux / WSL:**
```bash
node --version   # Should print v18.0.0 or higher
```

**Windows (PowerShell):**
```powershell
node --version
```

If Node.js is missing or outdated, see [installation.md](installation.md) for full OS-specific install instructions.

---

## Related Docs

- [../ide-integration.md](../ide-integration.md) — High-level IDE overview (VS Code + JetBrains)
- [../getting-started.md](../getting-started.md) — Installing and using Claude Code
- [../keyboard-shortcuts.md](../keyboard-shortcuts.md) — Full keyboard shortcut reference
- [../slash-commands.md](../slash-commands.md) — All slash commands
