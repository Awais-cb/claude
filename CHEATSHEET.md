# Claude Code — Developer Cheatsheet

Quick reference for everything you need during active development.
Full docs: [`claude-code/`](claude-code/) · VS Code: [`vscode-extension/`](vscode-extension/)

---

## Install & Auth

| OS | Command |
|----|---------|
| **macOS** | `curl -fsSL https://claude.ai/install.sh \| bash` or `brew install claude` |
| **Linux / WSL** | `curl -fsSL https://claude.ai/install.sh \| bash` |
| **Windows** | `winget install Anthropic.Claude` |
| **npm (alt)** | `npm install -g @anthropic-ai/claude-code` (requires Node.js 18+) |
| **All** | `claude auth login` — authenticate once, stays logged in |
| **Verify** | `claude --version` or `claude update` to update |

---

## Starting a Session

```bash
claude                          # New interactive session
claude "fix the bug in app.js"  # Start with an immediate task
claude -c                       # Resume last session
claude -r "session-name"        # Resume named session
claude --ide                    # Connect to VS Code / JetBrains
claude --permission-mode plan   # Read-only (explore without changing anything)
claude -p "summarize README"    # Non-interactive, print and exit
```

---

## Models

```bash
claude --model opus     # Most powerful — hard problems, architecture decisions
claude --model sonnet   # Default — everyday coding tasks
claude --model haiku    # Fastest & cheapest — simple questions, boilerplate
```

Switch mid-session: `/model` → pick from menu, or `Alt+P` / `Option+P`

---

## Essential Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit prompt |
| `Ctrl+C` | Cancel / stop Claude |
| `Ctrl+D` | Exit session |
| `Shift+Tab` | Cycle permission mode (Normal → Auto-Accept → Plan) |
| `Esc Esc` | Undo Claude's last file change |
| `Ctrl+V` | Paste image from clipboard (all platforms, including macOS) |
| `Ctrl+G` | Open current prompt in `$EDITOR` |
| `Ctrl+L` | Clear screen (keeps conversation) |
| `Ctrl+O` | Toggle verbose output (see Claude's reasoning) |
| `Ctrl+B` | Background current task |
| `Ctrl+T` | Toggle task list view |
| `↑ / ↓` | Navigate prompt history |
| `Alt+T` / `Option+T` | Toggle extended thinking |
| `Alt+F` / `Option+F` | Toggle fast mode |

> **macOS:** `Option` = `Alt` on Linux/Windows

---

## Permission Modes

| Mode | What Claude can do | Toggle |
|------|-------------------|--------|
| **Normal** (default) | Everything, asks before risky actions | `Shift+Tab` |
| **Plan** | Read-only — no edits, no commands | `Shift+Tab` or `--permission-mode plan` |
| **Auto-Accept** | Does everything without asking | `Shift+Tab` |

**Pre-approve tools via CLI:**
```bash
claude --allowedTools "Bash(git *),Bash(npm *),Read(*)"
claude --disallowedTools "Bash"          # block all shell commands
claude --tools "Read,Glob,Grep"          # read-only lockdown
```

**Permanent permissions in `.claude/settings.json`:**
```json
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm *)", "Read(*)", "Write(src/*)"],
    "deny":  ["Write(.env*)", "Bash(rm -rf *)"]
  }
}
```

---

## Slash Commands — Most Used

| Command | What it does |
|---------|-------------|
| `/help` | List all commands |
| `/clear` | Wipe conversation, start fresh |
| `/compact` | Summarize history, free up context space |
| `/rename <name>` | Name current session |
| `/model` | Switch model interactively |
| `/plan` | Switch to read-only plan mode |
| `/fast` | Toggle fast mode (2.5× faster) |
| `/diff` | Interactive diff of recent changes |
| `/review <PR#>` | Review a GitHub pull request |
| `/security-review` | Check branch for security issues |
| `/commit-push-pr` | Commit + push + open PR in one step |
| `/init` | Auto-generate CLAUDE.md for this project |
| `/memory` | View/edit memory and CLAUDE.md files |
| `/context` | Show context window usage |
| `/cost` | Show token usage and cost this session |
| `/doctor` | Diagnose setup issues |
| `/hooks` | Manage automation hooks |
| `/agents` | Manage subagents |
| `/skills` | List custom slash commands |
| `/mcp` | Manage MCP server connections |
| `/vim` | Toggle vim mode |
| `/config` | Open visual settings editor |
| `/terminal-setup` | Configure Shift+Enter, Alt keys |

**Special prefixes:**
```
!ls -la          # Run bash directly (bypasses Claude)
@src/utils.ts    # Reference a file in your prompt
```

---

## File & Context References

```
> @src/auth.ts — explain this file
> @src/auth.ts @src/middleware.ts — compare these two
> @config/ — what does this folder configure?
```

In VS Code: type `@` in the prompt box → autocomplete dropdown appears.
Highlight code in editor → Claude automatically sees it as context.

---

## Common Dev Workflows

### Bug fix
```
> the login form throws a 500 when the email has a + symbol. check
  src/auth/LoginController.php and fix it
```

### Add a feature
```
> add pagination to GET /api/users — page and per_page query params,
  default 20 per page, max 100
```

### Code review before commit
```
> /diff
> /security-review
> /commit-push-pr
```

### Understand unfamiliar code
```bash
claude --permission-mode plan
> walk me through how requests flow from the router to the database
```

### Fix failing tests
```
> run npm test and fix every failing test
```

### Refactor safely
```bash
claude -w "refactor-attempt"    # isolated worktree
> refactor the UserService to use the repository pattern
```

---

## Session Management

```bash
claude -c                       # Resume last session
claude -r "auth-refactor"       # Resume by name
claude -w "experiment"          # New isolated worktree branch
```

Inside a session:
```
> /rename auth-refactor         # Name it so you can find it later
> /compact                      # Free up context when session gets long
> /checkpoint                   # Save state before a risky operation
> /rewind                       # Go back to last checkpoint
```

---

## Non-Interactive / Scripting

```bash
# One-shot answer and exit
claude -p "what does this function return?"

# Pipe input
cat error.log | claude -p "what caused this?"
git diff | claude -p "write a commit message for this"

# Save output to file
claude -p "write a README for this project" > README.md

# JSON output for scripts
claude -p "list all API endpoints" --output-format json

# Limit cost
claude -p "big task" --max-budget-usd 0.50
```

---

## CLAUDE.md — Teach Claude Your Project

Create at project root. Claude reads it every session automatically.

```markdown
## Tech Stack
- Node.js 20, TypeScript, Express
- PostgreSQL + Prisma ORM

## Commands
- `npm run dev`   — start dev server
- `npm test`      — run Vitest tests
- `npm run lint`  — ESLint

## Conventions
- 2-space indent, single quotes
- Named exports only
- Use the `logger` util, never `console.log`

## Do Not
- Never edit .env directly
- Don't use `any` in TypeScript
```

Generate one automatically: `> /init`

---

## Hooks — Automate on Events

Auto-format after every edit (`.claude/settings.json`):
```json
{
  "hooks": {
    "PostToolUse": [
      { "matcher": "Edit|Write", "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\"" }
    ],
    "Notification": [
      { "command": "notify-send 'Claude Code' 'Needs your input'" }
    ]
  }
}
```

| Notification command | OS |
|---------------------|-----|
| `osascript -e 'display notification "Msg" with title "Claude"'` | macOS |
| `notify-send 'Claude' 'Msg'` | Linux |
| `powershell.exe -c "[Windows.UI.Notifications.ToastNotificationManager,...]"` | WSL→Windows |

---

## Subagents — Parallel Work

```
> use the explorer agent to find all places we call the Stripe API
> run these 3 tasks in parallel using subagents: [list tasks]
```

Create a custom agent (`.claude/agents/my-agent.md`):
```yaml
---
name: test-writer
description: Writes unit tests for existing code
model: sonnet
tools: [Read, Grep, Write, "Bash(npm test)"]
---
Write comprehensive tests. Cover happy path, edge cases, and errors.
Always match the existing test style.
```

Use it: `> use the test-writer agent on src/services/UserService.ts`

---

## Skills — Custom Slash Commands

Create (`.claude/skills/changelog/SKILL.md`):
```yaml
---
name: changelog
description: Generate changelog from recent git commits
---
Run git log since last tag, group by type, write Keep a Changelog entry.
```

Use it: `> /changelog`

List all: `> /skills`

---

## MCP Servers — Extend Claude's Abilities

```
> /mcp                          # manage connections
```

Add via CLI (recommended):
```bash
claude mcp add github -e GITHUB_TOKEN=ghp_... -- npx -y @modelcontextprotocol/server-github
claude mcp list     # see configured servers
claude mcp remove github
```

Or edit `.mcp.json` at project root manually:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "ghp_..." }
    }
  }
}
```

---

## VS Code Extension

```bash
code --install-extension anthropic.claude-code   # install (requires VS Code 1.98.0+)
```

Open Claude via the **Spark icon** or status bar in VS Code — no terminal command needed. From a terminal session, use `claude --ide` to auto-connect to your open editor.

| VS Code shortcut | Action |
|-----------------|--------|
| `Cmd+N` / `Ctrl+N` | New conversation (Claude focused) |
| `Cmd+Esc` / `Ctrl+Esc` | Focus input |
| `Cmd+Shift+Esc` / `Ctrl+Shift+Esc` | Open in new tab |
| `Option+K` / `Alt+K` | Insert @-mention with line reference |
| `Ctrl+Shift+P` → "Claude Code" | Open command palette |

- Highlight code → ask Claude → selection is automatic context
- Click `filename.ts:47` in Claude's response → jumps to that line

---

## Cost & Context Tips

```
> /cost      # see spend this session
> /context   # see how full the context window is
```

**Keep costs down:**
- Use `haiku` for simple questions, `sonnet` for everyday work, `opus` for hard problems
- Reference specific files (`@file.ts`) instead of entire folders
- Run `/compact` in long sessions before context fills up
- Use `-p` (print mode) for one-off questions — no session overhead

**Context getting full? Signs:**
- Responses feel less relevant or start forgetting earlier context
- Run `/compact` → frees space while keeping key decisions
- Or `/clear` → fresh start

---

## Settings Files

| File | Scope |
|------|-------|
| `~/.claude/settings.json` | Your machine, all projects |
| `.claude/settings.json` | This project (commit to git) |
| `.claude/settings.local.json` | This project, local only (gitignore this) |

**Windows paths:** Replace `~/.claude/` with `%USERPROFILE%\.claude\`

---

## Quick Troubleshooting

| Problem | Fix |
|---------|-----|
| `claude: command not found` | Re-run the installer; restart terminal; check PATH |
| Auth fails | `claude auth logout` then `claude auth login` |
| Claude stops mid-task | Press `Enter` to nudge, or `Ctrl+C` and re-ask |
| Context full / drifting | `/compact` or `/clear` |
| Wrong file edited | `Esc Esc` to revert, or `Ctrl+Z` in the file |
| Hook not running | `> /doctor`; check shell path in hook command |
| VS Code not connecting | Re-run `claude --ide`; check extension is enabled |
| Slow responses | `/fast on` or `/model haiku` for simple tasks |
