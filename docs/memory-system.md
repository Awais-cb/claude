# Memory System

Claude Code can remember things across sessions automatically. This means you don't have to re-explain your preferences, past decisions, or project context every time you start a new conversation.

---

## How It Works

At the end of a session (or while working), Claude saves notes to a `MEMORY.md` file on your machine. The next time you start Claude in the same project, those notes are loaded automatically.

**Storage location:**
```
~/.claude/projects/<project-path>/memory/MEMORY.md
```

This is **local to your machine** — it's not synced to the cloud or shared with teammates.

---

## What Gets Saved

Claude saves things like:

- Architectural decisions made during a session
  - *"We decided to use JWT tokens instead of sessions"*
- Your preferences
  - *"User prefers verbose error messages"*
- Recurring problems and their solutions
  - *"The test suite requires the DB to be seeded first"*
- Important file locations
  - *"Main config is in config/app.ts, not .env"*
- Project conventions discovered during work

---

## Enabling / Disabling

Auto-memory is **enabled by default**.

```bash
# Disable for all projects
echo '{"autoMemoryEnabled": false}' > ~/.claude/settings.json

# Or toggle inside a session:
> /memory
```

You can also disable via environment variable:
```bash
CLAUDE_CODE_DISABLE_AUTO_MEMORY=true claude
```

---

## Viewing Your Memory

```
> /memory
```

This opens an interactive view showing:
- Your project's `MEMORY.md`
- Any topic files
- Your global `~/.claude/CLAUDE.md`

You can edit these directly from this interface.

---

## The MEMORY.md File

The main memory file is `MEMORY.md`. It has a **200-line limit** on what Claude loads — lines after 200 are truncated. Keep it concise and use topic files for details.

### Example MEMORY.md

```markdown
# Project Memory

## Architecture Decisions
- Using PostgreSQL (not MySQL) — decided 2024-01-15
- Auth uses JWT stored in httpOnly cookies
- All API responses follow { data, error, meta } shape

## User Preferences
- Prefers TypeScript strict mode
- Always asks before deleting files
- Likes verbose commit messages with "why"

## Recurring Issues
- See debugging.md for DB connection fixes
- Test suite: always run `npm run db:reset` before `npm test`

## Key Files
- `src/lib/api.ts` — API client (not axios, custom)
- `src/config/constants.ts` — all app-wide constants
- See patterns.md for service layer pattern details
```

---

## Topic Files

For details that don't fit in the 200-line MEMORY.md, create separate topic files and link to them:

```
~/.claude/projects/my-project/memory/
├── MEMORY.md           ← Index (loaded automatically, 200-line limit)
├── debugging.md        ← Detailed debugging notes
├── patterns.md         ← Code patterns and conventions
├── api-conventions.md  ← API design decisions
└── decisions.md        ← Architecture decision log
```

**MEMORY.md links to topic files:**

```markdown
## Patterns
See [patterns.md](patterns.md) for service layer and repository patterns.

## Debugging
See [debugging.md](debugging.md) for known issues and fixes.
```

---

## Manually Saving a Memory

You can ask Claude to save something explicitly:

```
> Remember that we decided to use Redis for session storage, not the database
```

Or:

```
> Save this to memory: the staging server is at https://staging.acme.com and needs VPN
```

---

## Updating & Removing Memories

```
> Update the memory to say we switched from Stripe to Paddle for payments

> Remove the note about using Redux — we migrated to Zustand

> Forget everything about the old authentication system
```

Claude will edit the memory files accordingly.

---

## Memory vs CLAUDE.md

| | MEMORY.md | CLAUDE.md |
|--|-----------|-----------|
| **Written by** | Claude automatically | You (manually) |
| **Purpose** | Remember discoveries & decisions | Explain project upfront |
| **Updated** | Automatically during sessions | Manually as project evolves |
| **Committed to git?** | No (stays local) | Yes (share with team) |
| **Per-machine?** | Yes | No (in repo) |

**Best practice:** Use CLAUDE.md for project standards and conventions. Let MEMORY.md handle session-specific discoveries and personal preferences.

---

## Subagent Memory

Subagents (specialized workers Claude can spawn) can also have persistent memory:

```yaml
# .claude/agents/code-reviewer.md
---
name: code-reviewer
memory: project
---
# Code Review Agent
Always review for security vulnerabilities first...
```

With `memory: project`, the subagent builds its own memory across sessions, separate from your main Claude memory.

Options:
- `memory: user` — stored in `~/.claude/` (all projects)
- `memory: project` — stored in project's `.claude/` folder
- `memory: local` — stored locally, not committed

---

## Practical Example

**Session 1:**
```
> We've decided that all database queries should go through the Repository pattern.
  Never query the DB directly in controllers.

Claude: Understood. I'll remember that pattern.
```

**Session 2 (days later):**
```
> Add a new endpoint to fetch user orders

Claude: I'll add that endpoint. Based on my notes, we use the Repository pattern
here — I'll create an OrderRepository and use it from the controller.
```

Claude remembered — no need to re-explain.

---

## Privacy Note

Memory files are stored **only on your local machine**:
```
~/.claude/projects/<path-hash>/memory/
```

They are never sent to Anthropic's servers independently — they're included as part of your conversation context (which follows normal data handling policies).
