# Session Management in VS Code

Claude Code sessions are conversations with memory — Claude remembers everything you've discussed within a session. The VS Code extension makes it easy to name, resume, and run multiple sessions in parallel.

Think of a session like a project notebook. When you open it, you pick up exactly where you left off — Claude remembers which files you looked at, what changes were made, and what you were trying to accomplish. You can have multiple notebooks open at once (one per feature), and each keeps its own separate record.

---

## Starting a Session

### Basic start (new session)

```bash
claude --ide
```

### Start with an immediate task

```bash
claude --ide "explain what this project does"
```

### Resume the most recent session

```bash
claude --ide -c
# or
claude --ide --continue
```

### Resume a named session

```bash
claude --ide -r "auth-refactor"
# or
claude --ide --resume "auth-refactor"
```

---

## Naming Sessions

Name a session so you can find it later:

Inside a session:
```
> /rename auth-refactor
```

Or when starting:
```bash
claude --ide --session-name "auth-refactor"
```

Good naming conventions:
- Use the feature or bug you're working on: `payment-bug`, `user-auth`, `api-pagination`
- Use a ticket number: `JIRA-1234`, `GH-456`
- Use a date for long-running work: `refactor-2024-03`

---

## Resuming Sessions in VS Code

You don't have to remember session names — the VS Code extension shows a list of recent sessions.

From the Command Palette:

| OS | Shortcut |
|----|----------|
| macOS | `Cmd+Shift+P` → "Claude Code: Resume Session" |
| Windows / Linux | `Ctrl+Shift+P` → "Claude Code: Resume Session" |

![Session list in VS Code](./images/session-list.png)
> What to expect: The session picker shows a list of your recent sessions, sorted by last activity. Each entry shows the session name (or a truncated preview of the first message if unnamed), and the date/time it was last active. Select one to resume.

Or from the terminal:
```bash
# List recent sessions
claude --list-sessions

# Resume by name
claude --ide -r "session-name"
```

---

## Viewing Session History

Inside an active session:

```
> /history
```

Shows the full conversation history for the current session — useful when picking up where you left off after a few days away.

---

## Multiple Sessions in VS Code

VS Code lets you run multiple Claude Code sessions simultaneously — one per terminal panel. This is powerful for parallel work.

```
┌─────────────────────────────────────────────────────────┐
│  VS Code                                                │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Your Code Editor (files)                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────┐    ┌──────────────────────────┐    │
│  │  Terminal 1     │    │  Terminal 2              │    │
│  │  Session:       │    │  Session:                │    │
│  │  "auth-refactor"│    │  "fix-payment-bug"       │    │
│  │                 │    │                          │    │
│  │  > working on   │    │  > investigating the     │    │
│  │    login flow   │    │    null ref error        │    │
│  └─────────────────┘    └──────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Starting a second session

Open a new terminal panel:

| OS | Method |
|----|--------|
| macOS | `Ctrl+`` ` `` ` or Terminal → New Terminal |
| Windows / Linux | `Ctrl+`` ` `` ` or Terminal → New Terminal |

Then in the new panel:
```bash
claude --ide -r "other-feature"
```

### Switching between sessions

Click between terminal tabs in VS Code. Each terminal is its own Claude session with separate context.

### Use cases for parallel sessions

| Session 1 | Session 2 |
|-----------|-----------|
| Building a new feature | Fixing an unrelated bug |
| Refactoring the backend | Updating frontend components |
| Writing tests | Implementing the code being tested |
| Reviewing a PR | Working on your own branch |

---

## Ending a Session

```
Ctrl+D
```

or type `exit`. The session history is saved automatically — you can resume it later with `-c` or `-r`.

---

## Session Context

Each session maintains its own context window. Within a session, Claude remembers:

- All files it has read
- All changes it has made
- All commands it has run
- Your entire conversation history

When you start a new session (`claude --ide` without `-c`), Claude starts fresh. Use `-c` to carry over context from the previous session.

---

## Session Files on Disk

Sessions are stored as JSON files. The location depends on your OS:

**macOS:**
```
~/.claude/sessions/
```

**Linux / WSL:**
```
~/.claude/sessions/
```

**Windows (native):**
```
%USERPROFILE%\.claude\sessions\
```
Which typically resolves to:
```
C:\Users\YourName\.claude\sessions\
```

**Windows (WSL):**
```
~/.claude/sessions/
```
(which is at `/home/yourname/.claude/sessions/` in the Linux filesystem)

Each session is a JSON file containing the full conversation. You can:
- Browse them to find old sessions
- Delete sessions you no longer need
- Back them up before a major refactor

To view your session directory:

**macOS / Linux / WSL:**
```bash
ls ~/.claude/sessions/
```

**Windows (PowerShell):**
```powershell
Get-ChildItem "$env:USERPROFILE\.claude\sessions\"
```

---

## Saving Work Between Sessions

For work that should persist across sessions regardless of which session you start, use:

### CLAUDE.md (project-level memory)

```
> /memory
```

Add important context that Claude should always know about this project. This is especially useful for:
- Documenting the project architecture
- Noting conventions and patterns
- Recording decisions made during the session that future sessions should know about

### Auto-memory

Claude Code automatically extracts key facts and saves them:

**macOS / Linux / WSL:**
```
~/.claude/projects/<project>/memory/MEMORY.md
```

**Windows (native):**
```
%USERPROFILE%\.claude\projects\<project>\memory\MEMORY.md
```

Review and edit these with:
```
> /memory
```

---

## Tips

- **Name sessions immediately** — `> /rename my-task` as soon as you start, so you can find it later
- **Use one session per feature/ticket** — keeps context focused and relevant
- **Resume often** — `claude --ide -c` is the fastest way to pick up where you left off
- **Don't fear long sessions** — Claude Code handles context compaction automatically, so sessions can run for hours without issue
- **Use `/compact` in long sessions** — if responses start to feel less focused, run `> /compact` to summarize old history and free up space

---

## Related

- [connecting-to-ide.md](connecting-to-ide.md) — The `--ide` flag and connection setup
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [../context-management.md](../context-management.md) — Context window limits and compaction
- [../memory-system.md](../memory-system.md) — Persistent memory across sessions
