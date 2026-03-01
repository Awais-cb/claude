# CLI Commands & Flags

CLI flags are options you add when starting Claude Code from your terminal. They let you control what session to open, which AI model to use, what Claude is allowed to do, and more.

> **Analogy:** Think of flags like options when ordering coffee. `claude` is "I'd like a coffee." `claude --model opus "fix the auth bug"` is "I'd like a large, strong coffee in a to-go cup, and here's the exact order." The flags customize what you get before you even start.

Flags always come after `claude` and before or after your prompt:

```bash
claude                              # basic — just start
claude "fix the login bug"          # start with a task
claude --model opus "fix the login bug"   # with a flag
claude -c                           # short flag (dash + single letter)
claude --continue                   # long flag (double dash + word)
```

---

## Basic Usage

```bash
claude                          # Interactive session
claude "your prompt here"       # Start with an initial prompt
claude -p "your prompt"         # Print mode (non-interactive, exits after response)
```

### Interactive vs. print mode

**Interactive** (`claude` or `claude "task"`) — Opens a conversation. Claude works, you respond, back and forth. Best for most development tasks.

**Print mode** (`claude -p "task"`) — Claude answers once and exits. Best for scripts, automation, or quick one-off questions.

```bash
# Interactive: have a conversation
claude "help me debug this function"

# Print: get a quick answer and move on
claude -p "what does the -v flag do in curl?"
```

---

## Session Management

These flags decide which conversation you're opening — a new one, or an existing one you want to continue.

| Flag | Short | Description |
|------|-------|-------------|
| `--continue` | `-c` | Resume the most recent conversation |
| `--resume <name>` | `-r` | Resume a session by name or ID (or show picker) |
| `--worktree <name>` | `-w` | Start session in an isolated git worktree |
| `--fork-session` | | Create new session instead of resuming original (use with `--resume` or `--continue`) |
| `--session-id <uuid>` | | Use a specific session ID |
| `--from-pr <number>` | | Resume session linked to a GitHub PR |

### `-c` / `--continue` — Pick up where you left off

> **Analogy:** Like reopening a document you closed yesterday. Everything is exactly as you left it.

```bash
claude -c
```

The most-used flag. Resumes your last session so Claude remembers everything it already knows about your task.

**Without `-c`:** Claude starts fresh with no memory of previous conversations.
**With `-c`:** Claude has full context of your last session — what files it read, what decisions were made, what still needs doing.

---

### `-r` / `--resume` — Open a specific session by name

> **Analogy:** Like opening a specific saved file instead of the most recent one.

```bash
claude -r "payment-refactor"
claude -r "JIRA-1234"
```

First, name your sessions so you can find them:

```
> /rename payment-refactor    ← inside a session
```

Then resume by name later:

```bash
claude -r "payment-refactor"
```

---

### `-w` / `--worktree` — Work in isolation

> **Analogy:** Like making a copy of your project in a separate folder to experiment without risk. When you're done, you either merge the changes back or throw the copy away.

```bash
claude -w "try-new-approach"
```

Creates an isolated copy of your git repository in `.claude/worktrees/try-new-approach/`. Claude works in that copy. Your main branch is untouched.

**When to use it:**
- Trying a risky refactor without breaking your main work
- Running a parallel experiment ("what if we used Redis instead of Postgres?")
- Fixing a hotfix bug while mid-feature on the main branch

---

## Model Selection

Choose which AI model Claude uses for the session.

| Flag | Description |
|------|-------------|
| `--model <model>` | Choose model: `opus`, `sonnet`, `haiku`, or full model ID |
| `--fallback-model <model>` | Fallback model if primary is rate-limited (print mode only) |

### Choosing the right model

> **Analogy:** Like choosing a tool for a job. A screwdriver works for most screws. A power drill is overkill for one screw but essential for 50.

```bash
claude --model opus             # Most capable — complex problems, architecture
claude --model sonnet           # Balanced — everyday coding (default)
claude --model haiku            # Fastest and cheapest — simple questions, scripts
```

| Model | Use when... | Avoid when... |
|-------|-------------|--------------|
| **opus** | You have a hard problem, need deep reasoning, or are making important architecture decisions | You're doing something simple — you'll waste money and time |
| **sonnet** | Writing features, fixing bugs, reviewing code | (Good default — rarely a wrong choice) |
| **haiku** | Answering quick questions, generating boilerplate, summarizing | The problem is genuinely complex — haiku will miss things |

You can also switch mid-session without restarting:

```
> /model      ← switch interactively inside a session
```

---

## Permission & Safety

These control what Claude is allowed to do. By default, Claude asks before doing anything potentially risky. These flags let you tighten or loosen that.

| Flag | Description |
|------|-------------|
| `--permission-mode plan` | Start in Plan Mode (read-only, no edits) |
| `--dangerously-skip-permissions` | Skip all permission prompts |
| `--allow-dangerously-skip-permissions` | Enable permission bypassing as an option (without activating it — composable with `--permission-mode`) |
| `--allowedTools <tools>` | Tools that execute without prompting for permission |
| `--disallowedTools <tools>` | Tools to explicitly deny (removed from Claude's context) |
| `--tools <tools>` | Restrict Claude to only these built-in tools (use `""` for none, `"default"` for all) |

### `--permission-mode plan` — Explore safely

> **Analogy:** Like sending someone to look around your house and take notes, but not letting them move or touch anything.

```bash
claude --permission-mode plan
```

Claude can read files, search code, and tell you what it would do — but it **cannot** edit anything or run commands. Great for:
- Exploring an unfamiliar codebase before making changes
- Getting a plan from Claude that you review before approving
- Letting Claude audit a project without touching it

---

### `--allowedTools` — Pre-approve specific actions

> **Analogy:** Like giving someone a pre-approved shopping list. They can buy anything on the list without asking you first, but need approval for anything else.

```bash
# Let Claude read files without asking, but ask for everything else
claude --allowedTools "Read,Glob,Grep"

# Auto-approve all git commands
claude --allowedTools "Bash(git *)"

# Auto-approve npm and git but nothing else
claude --allowedTools "Bash(npm *),Bash(git *)"
```

This is much more comfortable than `--dangerously-skip-permissions` — you keep control over risky actions while removing friction for safe ones.

---

### `--disallowedTools` — Block specific capabilities

> **Analogy:** Like telling a contractor "you can do anything in the house except go into the basement."

```bash
# Prevent Claude from running any bash commands at all
claude --disallowedTools "Bash"

# Prevent Claude from making web requests
claude --disallowedTools "WebFetch,WebSearch"
```

---

### `--dangerously-skip-permissions` — Full auto-approve (use carefully)

> **Analogy:** Like giving someone your house key, your car key, and your credit card and saying "handle everything while I'm away." Total trust, no checks.

```bash
claude --dangerously-skip-permissions
```

Claude does everything without asking. Useful in automated pipelines and CI/CD where there's no human to approve things. Not recommended for interactive sessions where you want oversight.

---

## System Prompt Customization

A system prompt is a background instruction that tells Claude how to behave — like a briefing before it starts work.

| Flag | Description |
|------|-------------|
| `--system-prompt <text>` | Replace the entire default system prompt |
| `--system-prompt-file <path>` | Load system prompt from a file |
| `--append-system-prompt <text>` | Add text to the end of the default prompt |
| `--append-system-prompt-file <path>` | Append file contents to default prompt |

### When to use this

> **Analogy:** Like writing a job brief before hiring a contractor. Instead of explaining the rules every session, you write them once and attach them to every session automatically.

```bash
# Always use TypeScript
claude --append-system-prompt "Always write TypeScript, never plain JavaScript."

# Set a persona/coding style
claude --append-system-prompt "Follow the Google style guide. Prefer functional patterns over OOP."

# Load from a file (for longer instructions)
claude --system-prompt-file ./my-instructions.txt
```

---

## Print / Non-Interactive Mode

Use `-p` to run Claude like a command-line tool — it answers once and exits. Essential for scripting and automation.

| Flag | Description |
|------|-------------|
| `-p` / `--print` | Print response and exit |
| `--output-format <format>` | `text` (default), `json`, or `stream-json` |
| `--input-format <format>` | `text` (default) or `stream-json` |
| `--max-turns <number>` | Limit how many agentic turns Claude takes |
| `--max-budget-usd <amount>` | Stop if estimated cost exceeds this |
| `--no-session-persistence` | Don't save the session to disk |
| `--json-schema <schema>` | Return validated JSON matching the schema |

### Common print mode patterns

> **Analogy:** Like using a calculator. You type in the question, it gives you the answer, done. No conversation, no back-and-forth.

```bash
# Simple question
claude -p "what is 2+2"

# Pipe a file in and ask about it
cat error.log | claude -p "what caused this error?"

# Save Claude's output to a file
claude -p "write a README for this project" > README.md

# Get structured JSON output for scripting
claude -p "list the 3 biggest files" --output-format json

# Limit cost — stop if it would cost more than $0.10
claude -p "refactor all the components" --max-budget-usd 0.10

# Pipe between commands
git diff | claude -p "write a commit message for these changes"
```

### `--output-format json` — Machine-readable output

When you're using Claude in a script and need to parse the output programmatically:

```bash
result=$(claude -p "is the code valid?" --output-format json)
echo $result | jq '.answer'
```

---

## Workspace & Directories

| Flag | Description |
|------|-------------|
| `--add-dir <path>` | Add an additional directory Claude can access |

By default, Claude only accesses files in the directory you started it from. Use `--add-dir` to grant access to other directories.

```bash
# Frontend project + shared component library
claude --add-dir ../shared-components

# Monorepo: give access to both packages
claude --add-dir ../packages/api
```

> **Note:** Claude still won't access directories outside what you've explicitly allowed. This is a security feature.

---

## IDE & Integrations

| Flag | Description |
|------|-------------|
| `--ide` | Auto-connect to your open IDE on startup |
| `--chrome` | Enable Chrome browser automation |
| `--no-chrome` | Disable Chrome for this session |

### `--ide` — Connect to VS Code or JetBrains

```bash
claude --ide
```

Opens Claude Code and connects it to your running editor. You get a prompt box inside VS Code, selected code as automatic context, and clickable file links in responses. See the [VS Code extension docs](../vscode-extension/README.md) for full details.

---

## MCP (Model Context Protocol)

MCP servers give Claude new abilities — database access, Jira integration, Figma access, etc.

| Flag | Description |
|------|-------------|
| `--mcp-config <path>` | Load MCP server config from a JSON file |
| `--strict-mcp-config` | Only use MCP servers from `--mcp-config` (ignore others) |
| `--permission-prompt-tool <tool>` | Use an MCP tool to handle permission prompts |

```bash
# Load a specific MCP config for this session
claude --mcp-config ./my-mcp-servers.json
```

See [mcp-servers.md](mcp-servers.md) for what MCP servers are and how to set them up.

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

```bash
# Check your installed version
claude --version

# See exactly what Claude is doing (very detailed)
claude --verbose
```

---

## Settings & Configuration

| Flag | Description |
|------|-------------|
| `--settings <path or JSON>` | Load additional settings |
| `--setting-sources <sources>` | Specify which setting sources to load (`user`, `project`, `local`) |
| `--init` | Run initialization hooks then start |
| `--init-only` | Run initialization hooks then exit |
| `--maintenance` | Run maintenance hooks then exit |

---

## Session Behavior

| Flag | Description |
|------|-------------|
| `--teammate-mode <mode>` | Set how agent team teammates display: `auto` (default), `in-process`, or `tmux` |
| `--disable-slash-commands` | Disable all skills and commands for this session |
| `--include-partial-messages` | Include partial streaming events in output (requires `--print` and `--output-format=stream-json`) |

---

## Authentication

```bash
claude auth login               # Sign in to your Anthropic account
claude auth logout              # Sign out
claude auth status              # Check whether you're logged in
```

Run `claude auth login` once when setting up. It opens a browser window to authenticate. After that, you don't need to log in again unless you explicitly sign out.

---

## Update & Maintenance

```bash
claude update                   # Update Claude Code to the latest version
```

---

## Subagents & MCP

```bash
claude agents                   # List all configured subagents
claude mcp                      # Configure MCP servers
```

---

## Remote Control

```bash
claude remote-control           # Start a remote control session (control from claude.ai)
```

---

## Quick Reference Card

The patterns you'll use 90% of the time:

```bash
# ── Starting sessions ──────────────────────────────────
claude                                  # New interactive session
claude -c                               # Resume last session
claude -r "session-name"               # Resume named session
claude "fix the bug in app.js"          # Start with a task

# ── Choosing models ───────────────────────────────────
claude --model haiku                    # Fast, cheap (simple tasks)
claude --model opus                     # Powerful (hard problems)

# ── Controlling permissions ───────────────────────────
claude --permission-mode plan           # Read-only exploration
claude --allowedTools "Bash(git *)"     # Pre-approve git commands

# ── Scripting & automation ────────────────────────────
claude -p "summarize README.md"         # Non-interactive, print result
cat file.txt | claude -p "explain this" # Pipe input to Claude
claude -p "task" --output-format json   # Get JSON output

# ── IDE & remote ──────────────────────────────────────
claude --ide                            # Connect to VS Code
claude remote-control                   # Control from claude.ai

# ── Updates & info ────────────────────────────────────
claude update                           # Update to latest version
claude agents                           # List configured subagents
claude mcp                              # Configure MCP servers
```
