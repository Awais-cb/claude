# Session Management in VS Code

Claude Code sessions are conversations with memory — Claude remembers everything you've discussed within a session. The VS Code extension makes it easy to name, resume, and run multiple sessions in parallel.

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

```
> /rename auth-refactor
```

Or when starting:

```bash
claude --ide --session-name "auth-refactor"
```

Good naming conventions:
- Use the feature or bug you're working on: `payment-bug`, `user-auth`, `api-pagination`
- Use a ticket number: `JIRA-1234`
- Use a date for long-running work: `refactor-2024-03`

---

## Resuming Sessions in VS Code

You don't have to remember session names — the VS Code extension shows a list of recent sessions.

From the Command Palette (`Ctrl+Shift+P`):
```
Claude Code: Resume Session
```

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

Shows the full conversation history for the current session — useful when picking up where you left off.

---

## Multiple Sessions in VS Code

VS Code lets you run multiple Claude Code sessions simultaneously — one per terminal panel. This is powerful for parallel work.

### Starting a second session

1. Open a new terminal panel: `Ctrl+Shift+`` ` `` or **Terminal → New Terminal**
2. In the new panel:

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

When you start a new session (`claude --ide` without `-c`), Claude starts fresh. Use `-c` to carry over context.

---

## Session Files on Disk

Sessions are stored in:

```
~/.claude/sessions/
```

Each session is a JSON file containing the full conversation. You can:
- Browse them to find old sessions
- Delete sessions you no longer need
- Back them up before a major refactor

---

## Saving Work Between Sessions

For work that should persist across sessions regardless of which session you start, use:

### CLAUDE.md (project-level memory)

```
> /memory
```

Add important context that Claude should always know about this project.

### Auto-memory

Claude Code automatically extracts key facts and saves them in:

```
~/.claude/projects/<project>/memory/MEMORY.md
```

Review and edit these with `/memory`.

---

## Tips

- **Name sessions immediately** — `> /rename my-task` as soon as you start, so you can find it later
- **Use one session per feature/ticket** — keeps context focused and relevant
- **Resume often** — `claude --ide -c` is the fastest way to pick up where you left off
- **Don't fear long sessions** — Claude Code handles context compaction automatically, so sessions can run for hours without issue

---

## Related

- [connecting-to-ide.md](connecting-to-ide.md) — The `--ide` flag and connection setup
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [../context-management.md](../context-management.md) — Context window limits and compaction
- [../memory-system.md](../memory-system.md) — Persistent memory across sessions
