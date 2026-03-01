# CLI Commands & Flags

Everything you can pass to `claude` when starting it from your terminal.

---

## Basic Usage

```bash
claude                          # Interactive session
claude "your prompt here"       # Start with an initial prompt
claude -p "your prompt"         # Print mode (non-interactive, exits after response)
```

---

## Session Management

| Flag | Short | Description |
|------|-------|-------------|
| `--continue` | `-c` | Resume the most recent conversation |
| `--resume <name>` | `-r` | Resume a session by name or ID |
| `--worktree <name>` | `-w` | Start session in an isolated git worktree |
| `--rename <name>` | | Name the current session |
| `--fork-session` | | Create new session instead of resuming original |
| `--session-id <uuid>` | | Use a specific session ID |
| `--from-pr <number>` | | Resume session linked to a GitHub PR |

### Examples

```bash
# Resume last session
claude -c

# Resume a named session
claude -r "auth-refactor"

# Start in a new worktree branch (isolated copy of repo)
claude -w "new-feature"
```

---

## Model Selection

| Flag | Description |
|------|-------------|
| `--model <model>` | Choose model: `opus`, `sonnet`, `haiku`, or full model ID |
| `--fallback-model <model>` | Fallback model if primary is rate-limited (print mode only) |

### Examples

```bash
claude --model opus             # Most capable
claude --model sonnet           # Balanced (default)
claude --model haiku            # Fastest and cheapest
```

---

## Permission & Safety

| Flag | Description |
|------|-------------|
| `--permission-mode plan` | Start in Plan Mode (read-only, no edits) |
| `--dangerously-skip-permissions` | Skip all permission prompts |
| `--allowedTools <tools>` | Comma-separated list of tools that auto-approve |
| `--disallowedTools <tools>` | Tools to explicitly deny |
| `--tools <tools>` | Restrict Claude to only these tools |

### Examples

```bash
# Start in read-only plan mode
claude --permission-mode plan

# Only allow reading files, no editing
claude --allowedTools "Read,Glob,Grep"

# Prevent Claude from running bash commands
claude --disallowedTools "Bash"
```

---

## System Prompt Customization

| Flag | Description |
|------|-------------|
| `--system-prompt <text>` | Replace the entire default system prompt |
| `--system-prompt-file <path>` | Load system prompt from a file |
| `--append-system-prompt <text>` | Add text to the end of the default prompt |
| `--append-system-prompt-file <path>` | Append file contents to default prompt |

### Example

```bash
# Give Claude specific instructions at startup
claude --append-system-prompt "Always write TypeScript, never JavaScript."
```

---

## Print / Non-Interactive Mode

Use `-p` (or `--print`) to run Claude without an interactive session. Great for scripts and CI.

| Flag | Description |
|------|-------------|
| `-p` / `--print` | Print response and exit |
| `--output-format <format>` | `text` (default), `json`, or `stream-json` |
| `--input-format <format>` | `text` (default) or `stream-json` |
| `--max-turns <number>` | Limit how many agentic turns Claude takes |
| `--max-budget-usd <amount>` | Stop if estimated cost exceeds this |
| `--no-session-persistence` | Don't save the session to disk |
| `--json-schema <schema>` | Return validated JSON matching the schema |

### Examples

```bash
# Simple print mode
claude -p "what is 2+2"

# Pipe a file into Claude
cat error.log | claude -p "what caused this error?"

# Save output to a file
claude -p "write a README for this project" > README.md

# Get structured JSON output
claude -p "list the 3 biggest files" --output-format json
```

---

## Workspace & Directories

| Flag | Description |
|------|-------------|
| `--add-dir <path>` | Add an additional directory Claude can access |

### Example

```bash
# Let Claude access both the frontend and backend
claude --add-dir ../backend
```

---

## IDE & Integrations

| Flag | Description |
|------|-------------|
| `--ide` | Auto-connect to your open IDE on startup |
| `--chrome` | Enable Chrome browser automation |
| `--no-chrome` | Disable Chrome for this session |

---

## MCP (Model Context Protocol)

| Flag | Description |
|------|-------------|
| `--mcp-config <path>` | Load MCP server config from a JSON file |
| `--strict-mcp-config` | Only use MCP servers from `--mcp-config` (ignore others) |
| `--permission-prompt-tool <tool>` | Use an MCP tool to handle permission prompts |

### Example

```bash
claude --mcp-config ./my-mcp-servers.json
```

---

## Subagents & Plugins

| Flag | Description |
|------|-------------|
| `--agents <JSON>` | Define subagents dynamically via JSON |
| `--agent <name>` | Use a specific named subagent for this session |
| `--plugin-dir <path>` | Load plugins from a directory (can be repeated) |
| `--betas <list>` | Enable beta API features |

---

## Remote & Web

| Flag | Description |
|------|-------------|
| `--remote "description"` | Create a web session on claude.ai |
| `--teleport` | Resume a web session in your local terminal |
| `--remote-control` / `--rc` | Enable remote control from claude.ai |

---

## Debugging & Logging

| Flag | Description |
|------|-------------|
| `--debug [category]` | Enable debug logging |
| `--verbose` | Full turn-by-turn output |
| `--version` / `-v` | Show version number |

---

## Settings & Configuration

| Flag | Description |
|------|-------------|
| `--settings <path or JSON>` | Load additional settings |
| `--setting-sources <sources>` | Specify which setting sources to load |
| `--init` | Run initialization hooks then start |
| `--init-only` | Run initialization hooks then exit |

---

## Authentication

```bash
claude auth login               # Sign in
claude auth logout              # Sign out
claude auth status              # Check login status
```

---

## Quick Reference Card

```bash
# Most common patterns
claude                                  # Just start
claude -c                               # Resume last chat
claude "fix the bug in app.js"          # Start with a task
claude --model opus                     # Use most capable model
claude --permission-mode plan           # Read-only exploration
claude -p "summarize README.md"         # Non-interactive
cat file.txt | claude -p "explain this" # Pipe input
```
