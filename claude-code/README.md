# Claude Code — Complete Feature Documentation

A beginner-friendly reference covering every feature of Claude Code, Anthropic's official CLI for Claude.

---

## What is Claude Code?

Claude Code is an AI-powered terminal assistant that helps you write, edit, debug, and understand code. You run it in your terminal, and it can read files, run commands, search the web, manage git, and much more — all through natural conversation.

```bash
# Install
npm install -g @anthropic-ai/claude-code

# Start
claude
```

---

## Documentation Index

### Getting Started
| File | What it covers |
|------|---------------|
| [getting-started.md](getting-started.md) | Installation, first session, basic workflow |
| [cli-commands.md](cli-commands.md) | All CLI flags and options |
| [slash-commands.md](slash-commands.md) | Every `/command` available inside a session |
| [keyboard-shortcuts.md](keyboard-shortcuts.md) | All hotkeys and key bindings |

### Configuration & Instructions
| File | What it covers |
|------|---------------|
| [claude-md.md](claude-md.md) | CLAUDE.md project instructions — teach Claude about your project |
| [memory-system.md](memory-system.md) | Auto-memory (MEMORY.md) — Claude remembers across sessions |
| [settings.md](settings.md) | settings.json, environment variables, all config options |
| [permissions.md](permissions.md) | Permission modes — control what Claude can do |

### Core Workflows
| File | What it covers |
|------|---------------|
| [plan-mode.md](plan-mode.md) | Plan before coding — review before Claude changes anything |
| [context-management.md](context-management.md) | Managing the context window, compaction, checkpoints |
| [task-list.md](task-list.md) | Built-in task/todo tracking for multi-step work |
| [output-formats.md](output-formats.md) | Output styles, JSON mode, piping to files |

### Advanced Features
| File | What it covers |
|------|---------------|
| [thinking-mode.md](thinking-mode.md) | Extended thinking / reasoning mode |
| [fast-mode.md](fast-mode.md) | 2.5× faster responses with Fast Mode |
| [subagents.md](subagents.md) | Spawn specialized sub-agents for parallel work |
| [skills.md](skills.md) | Custom `/commands` you define yourself |
| [hooks.md](hooks.md) | Automate actions on events (pre/post tool use, etc.) |

### Integrations
| File | What it covers |
|------|---------------|
| [mcp-servers.md](mcp-servers.md) | Model Context Protocol — connect Claude to external tools |
| [git-integration.md](git-integration.md) | Git, GitHub PRs, worktrees |
| [ide-integration.md](ide-integration.md) | VS Code and JetBrains IDE extensions |
| [chrome-integration.md](chrome-integration.md) | Browser automation with Chrome |

### Other Capabilities
| File | What it covers |
|------|---------------|
| [vision-multimodal.md](vision-multimodal.md) | Images, screenshots, diagrams |
| [headless-mode.md](headless-mode.md) | Non-interactive / CI/CD / scripting mode |
| [cost-tracking.md](cost-tracking.md) | Monitor token usage and costs |

---

## Quick-Start Cheat Sheet

```bash
claude                          # Start interactive session
claude "fix the login bug"      # Start with a prompt
claude -c                       # Resume last conversation
claude --model opus             # Use a specific model
claude -p "summarize file.txt"  # Non-interactive, print result
```

**Inside a session:**
```
/help           Show all commands
/plan           Switch to plan mode (read-only)
/fast           Toggle fast mode
/cost           Show token usage & cost
/clear          Start a fresh conversation
Ctrl+C          Cancel current action
Esc Esc         Rewind last change
```

---

## Folder Structure of These Docs

```
claude-code/
├── README.md                  ← You are here
├── getting-started.md
├── cli-commands.md
├── slash-commands.md
├── keyboard-shortcuts.md
├── claude-md.md
├── memory-system.md
├── settings.md
├── permissions.md
├── plan-mode.md
├── context-management.md
├── task-list.md
├── output-formats.md
├── thinking-mode.md
├── fast-mode.md
├── subagents.md
├── skills.md
├── hooks.md
├── mcp-servers.md
├── git-integration.md
├── ide-integration.md
├── chrome-integration.md
├── vision-multimodal.md
├── headless-mode.md
└── cost-tracking.md
```
