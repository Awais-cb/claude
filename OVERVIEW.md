# Claude Code — Feature Overview

> One-liner descriptions of every feature, with analogies and examples.
> Skim this to discover what's possible. Follow any link to explore further.

---

## How It All Fits Together

```
┌──────────────────────────────────────────────────────────────────┐
│                          YOU                                     │
│        Terminal  │  VS Code  │  CI Pipeline  │  Browser         │
└──────────────────┬───────────┬───────────────┬──────────────────┘
                   │           │               │
              ┌────▼───────────▼───────────────▼────┐
              │                                      │
              │           CLAUDE CODE                │
              │         (your AI co-pilot)           │
              │                                      │
              │  reads  ─┐   ┌─ slash commands       │
              │  writes  ─┤   ├─ skills (custom /cmd) │
              │  runs    ─┤   ├─ hooks (auto-actions) │
              │  reasons ─┘   └─ subagents (parallel) │
              │                                      │
              └────┬─────────────────┬──────────────┘
                   │                 │
      ┌────────────▼────┐   ┌────────▼───────────────┐
      │   YOUR PROJECT  │   │    EXTERNAL WORLD       │
      │  • Files & Git  │   │  • GitHub PRs           │
      │  • Tests & Logs │   │  • MCP servers          │
      │  • Terminal cmds│   │  • Chrome / browser     │
      │  • CLAUDE.md    │   │  • Databases, APIs      │
      └─────────────────┘   └────────────────────────┘
```

---

## 1. Starting a Session

How you launch Claude Code and what each mode means.

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Interactive session** | Start a back-and-forth conversation with Claude in your terminal | A chat window that can also run commands | [getting-started.md](claude-code/getting-started.md) |
| **One-shot mode** (`-p`) | Send a single prompt, get a result, exit — no back-and-forth | `curl` for AI tasks: `claude -p "fix this file"` | [cli-commands.md](claude-code/cli-commands.md) |
| **Resume session** (`-c`) | Continue your last conversation exactly where you left it | Reopening a browser tab you closed yesterday | [cli-commands.md](claude-code/cli-commands.md) |
| **Model selection** (`--model`) | Choose which Claude model to use (Opus, Sonnet, Haiku) | Choosing between a sports car, sedan, or compact | [cli-commands.md](claude-code/cli-commands.md) |
| **Headless / CI mode** | Run Claude non-interactively in scripts and pipelines, no human needed | A robot arm on a factory line — no operator required | [headless-mode.md](claude-code/headless-mode.md) |

---

## 2. Teaching Claude About Your Project

Give Claude permanent knowledge so you never repeat yourself.

```
Without CLAUDE.md               With CLAUDE.md
──────────────────────          ──────────────────────────────────
"Use Laravel's service layer"   Claude already knows — every session
"We use GenericResponse DTOs"   Claude already knows — every session
"Run php artisan pint to lint"  Claude already knows — every session
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **CLAUDE.md** | A file in your repo Claude reads at the start of every session — conventions, architecture, commands | A staff handbook for a new employee | [claude-md.md](claude-code/claude-md.md) |
| **Memory system** | Claude writes its own notes in `MEMORY.md` and reads them next session | A developer's personal notebook that survives laptop crashes | [memory-system.md](claude-code/memory-system.md) |
| **Settings** | Project-level (`settings.json`) and personal (`settings.local.json`) config — models, permissions, env vars | `~/.bashrc` for Claude | [settings.md](claude-code/settings.md) |

---

## 3. Giving Claude Context Right Now

Feed Claude exactly what it needs to understand the current task.

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **`@` file references** | Type `@filename` to include a file's content in your prompt | Attaching a file to an email, but in-conversation | [cli-commands.md](claude-code/cli-commands.md) |
| **Vision & images** | Paste or drag a screenshot and Claude sees it — designs, error messages, diagrams | Showing a doctor a photo of what hurts | [vision-multimodal.md](claude-code/vision-multimodal.md) |
| **Context management** | Control the conversation window — compact it, checkpoint it, rewind it | Summarizing a long email thread to fit on one page | [context-management.md](claude-code/context-management.md) |
| **Task list** | Claude tracks multi-step work as a live todo list you can see | A project board that updates itself as Claude works | [task-list.md](claude-code/task-list.md) |

---

## 4. Controlling What Claude Can Do

Safety rails, review gates, and automation triggers.

```
Permission levels (from most restricted → most open):
─────────────────────────────────────────────────────
plan      →  Read-only. Claude proposes, you approve everything.
default   →  Claude asks before writing files or running commands.
auto      →  Claude acts freely within your allow/deny rules.
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Permissions** | Allow or deny specific tools — control exactly what Claude can read, write, or run | App permissions on your phone | [permissions.md](claude-code/permissions.md) |
| **Plan mode** | Claude reads and reasons but cannot change anything — you review the plan first | An architect drawing blueprints before construction begins | [plan-mode.md](claude-code/plan-mode.md) |
| **Hooks** | Shell commands that fire automatically on events (before/after tool use, on session start) | `git hooks`, but for Claude — e.g., auto-run `pint` after every file edit | [hooks.md](claude-code/hooks.md) |

---

## 5. Commands & Controls Inside a Session

How to steer Claude while it's running.

```
Most-used controls at a glance:
─────────────────────────────────────────────────────────────
/plan        → Switch to read-only planning mode
/fast        → Toggle 2.5× faster responses
/clear       → Wipe conversation, start fresh
/compact     → Summarize history to free up context
Ctrl+C       → Stop Claude mid-action (emergency brake)
Esc Esc      → Undo Claude's last change
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Slash commands** | `/commands` that control Claude's behavior from inside a session | Keyboard shortcuts for your AI — `/plan`, `/clear`, `/cost`, `/diff` | [slash-commands.md](claude-code/slash-commands.md) |
| **Keyboard shortcuts** | Hotkeys for navigation, submission, cancellation, and rewind | Ctrl+Z but for AI edits — Esc Esc undoes Claude's last action | [keyboard-shortcuts.md](claude-code/keyboard-shortcuts.md) |

---

## 6. Making Claude Faster & Smarter

Tune the quality and speed tradeoff for each task.

```
Speed vs. depth:
─────────────────────────────────────────────────────────
Fast Mode     ──── 2.5× faster ────── great for routine tasks
Default       ──── balanced   ────── most everyday use
Thinking Mode ──── deeper reasoning ─ architecture, hard bugs, math
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Fast mode** | Uses a faster model backend — same quality, 2.5× the speed | Switching your IDE from dark-theme rendering to performance mode | [fast-mode.md](claude-code/fast-mode.md) |
| **Thinking mode** | Claude reasons step-by-step before responding — better for complex logic | Asking someone to "think out loud" before answering a hard question | [thinking-mode.md](claude-code/thinking-mode.md) |

---

## 7. Doing Multiple Things at Once

Run parallel workers, create custom commands, automate repetitive tasks.

```
Without subagents:               With subagents:
────────────────────────         ─────────────────────────────────
Task 1 → done                    Task 1 ─┐
Task 2 → done              →     Task 2 ─┤ → all running in parallel
Task 3 → done                    Task 3 ─┘ → done 3× faster
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Subagents** | Spawn multiple Claude instances that work in parallel on independent tasks | Hiring 3 contractors to work on 3 rooms simultaneously | [subagents.md](claude-code/subagents.md) |
| **Skills** | Define your own `/commands` in a markdown file — runs a preset prompt instantly | Macros in Excel, but for Claude — `/pr`, `/deploy`, `/security-review` | [skills.md](claude-code/skills.md) |

---

## 8. Connecting Claude to the Outside World

Plug Claude into tools beyond your local filesystem.

```
Your Claude ─── MCP ──► Postgres database
             ─── MCP ──► Jira / Notion
             ─── MCP ──► Custom internal API
             ──────────► GitHub PRs (built-in)
             ──────────► Chrome browser (built-in)
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **MCP servers** | Connect Claude to any external tool — databases, APIs, Jira, Notion — via the Model Context Protocol | USB ports for AI: one standard plug, infinite devices | [mcp-servers.md](claude-code/mcp-servers.md) |
| **Git integration** | Claude reads diffs, writes commits, creates PRs, and works in isolated git worktrees | A developer who knows git as well as you do | [git-integration.md](claude-code/git-integration.md) |
| **IDE integration** | VS Code and JetBrains extensions — Claude runs inside your editor with full file awareness | Having a co-pilot in the passenger seat vs. shouting across the room | [ide-integration.md](claude-code/ide-integration.md) |
| **Chrome integration** | Claude can open a browser, click, fill forms, and read pages — full browser automation | A test engineer who can actually use your web app | [chrome-integration.md](claude-code/chrome-integration.md) |

---

## 9. Scripting & Output

Use Claude as a building block in larger systems.

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Output formats** | Get results as plain text, JSON, or piped to a file — structured for scripting | `jq` for AI output — `claude -p "..." --json \| jq .result` | [output-formats.md](claude-code/output-formats.md) |
| **Headless mode** | Run Claude in CI/CD pipelines, cron jobs, or scripts with no terminal interaction | A scheduled task that uses AI instead of a hardcoded rule | [headless-mode.md](claude-code/headless-mode.md) |
| **Cost tracking** | See exactly how many tokens each session uses and what it costs | A data usage meter on your phone plan | [cost-tracking.md](claude-code/cost-tracking.md) |

---

## 10. VS Code Extension

Everything the VS Code extension adds on top of the CLI.

```
Without extension:               With extension:
─────────────────────────────    ─────────────────────────────────────
Switch to terminal, type prompt  Type prompt in VS Code sidebar
Copy-paste file paths manually   @ autocompletes filenames instantly
Read Claude's response in CLI    Click a filename → jump to that line
One session at a time            Multiple named sessions, side by side
```

| Feature | What it does | Like... | Guide |
|---------|-------------|---------|-------|
| **Installation** | Install from VS Code Marketplace or VSIX in one click | Like installing any VS Code extension | [installation.md](vscode-extension/installation.md) |
| **`--ide` flag** | Connects the terminal Claude session to VS Code for full file awareness | Plugging a keyboard into the right computer | [connecting-to-ide.md](vscode-extension/connecting-to-ide.md) |
| **Prompt box** | Submit prompts directly from the VS Code sidebar — no terminal switching | A chat panel inside your editor | [prompt-box.md](vscode-extension/prompt-box.md) |
| **`@` file references** | Type `@` in the prompt box for autocomplete of filenames and folders | Like VS Code's `Ctrl+P` but inside a Claude prompt | [file-references.md](vscode-extension/file-references.md) |
| **Selected code context** | Highlight code in the editor → Claude automatically sees it | Highlighting text before asking a question | [selected-code-context.md](vscode-extension/selected-code-context.md) |
| **Clickable links** | Claude mentions `app/Services/OrderService.php:45` → click it → jump there | Hyperlinks inside a terminal — actually works | [clickable-links.md](vscode-extension/clickable-links.md) |
| **Session management** | Name, save, switch between, and resume multiple Claude sessions | Browser tabs, but for AI conversations | [session-management.md](vscode-extension/session-management.md) |
| **VS Code shortcuts** | VS Code-level keybindings for opening Claude, submitting, and cancelling | Same as terminal shortcuts, but wired to VS Code commands | [keyboard-shortcuts.md](vscode-extension/keyboard-shortcuts.md) |
| **Remote development** | Works over SSH, Dev Containers, WSL, and GitHub Codespaces | Claude follows you into the container — not left behind on your laptop | [remote-development.md](vscode-extension/remote-development.md) |
| **Slash commands in VS Code** | All `/commands` work in the VS Code prompt box, not just the terminal | Same steering wheel, different car | [slash-commands-in-vscode.md](vscode-extension/slash-commands-in-vscode.md) |
| **Settings & config** | VS Code-specific settings for the extension — model, auto-connect, keybindings | VS Code's settings.json, but for Claude | [settings-configuration.md](vscode-extension/settings-configuration.md) |
| **Workflow tips** | Best layouts, split-pane setups, and productivity patterns for VS Code users | How to arrange your desk for the best workflow | [workflow-tips.md](vscode-extension/workflow-tips.md) |

---

## Quick Feature Picker

Not sure where to start? Use this:

```
I want to...                              → Feature to explore
────────────────────────────────────────────────────────────────────
...teach Claude my project conventions    → CLAUDE.md
...Claude to remember things between days → Memory system
...stop Claude from editing certain files → Permissions
...review Claude's plan before it acts   → Plan mode
...run tasks faster                       → Fast mode
...solve a hard architecture problem      → Thinking mode
...run 3 things at once                   → Subagents
...create a /deploy or /review command   → Skills
...automate formatting on every file save → Hooks
...connect Claude to my database          → MCP servers
...review a GitHub PR                     → Git integration
...use Claude without leaving VS Code     → VS Code extension
...run Claude in a CI/CD pipeline         → Headless mode
...get JSON output for scripting          → Output formats
...control my browser with Claude         → Chrome integration
...see what I'm spending                  → Cost tracking
```

---

## Explore Further

| Collection | What's inside |
|------------|--------------|
| [claude-code/](claude-code/) | 25 full guides for every CLI feature |
| [vscode-extension/](vscode-extension/) | 13 guides for the VS Code extension |
| [workflows/](workflows/) | Role-based workflows (backend, frontend, fullstack, testing, code review) |
| [workflows/laravel/](workflows/laravel/) | Laravel-specific workflows (service layer, Livewire, Eloquent, PR review) |
| [CHEATSHEET.md](CHEATSHEET.md) | Single-page command reference — print this |
