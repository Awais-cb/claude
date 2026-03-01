# Memory System

## What is the Memory System?

Imagine you have a notepad on your desk that you keep between meetings with a colleague. After each conversation, you jot down the decisions you made, the preferences they expressed, the problems you solved together. Next time they come back, you glance at your notes first — so you never start from scratch.

Claude's memory system works exactly like that notepad. At the end of a session (or during one), Claude saves important notes to a file on your machine. The next time you open Claude in the same project, it reads those notes automatically. You don't have to re-explain anything it already learned.

```
Session 1:                           Session 2 (days later):
> We're using Redis for sessions,    > add a logout endpoint
  not the database
                                     Claude: [already knows about Redis,
Claude: Got it, I'll remember that.   adds the right implementation]
```

No re-explaining. No starting over. Claude picks up where it left off.

---

## How It Works

At the end of a session (or while working), Claude saves notes to a `MEMORY.md` file on your machine. The next time you start Claude in the same project, those notes are loaded automatically.

**Storage location:**

**macOS / Linux / WSL:**
```
~/.claude/projects/<project-path>/memory/MEMORY.md
```

For example, if your project is at `/home/alex/projects/my-api`:
```
~/.claude/projects/home-alex-projects-my-api/memory/MEMORY.md
```

**Windows:**
```
C:\Users\YourName\.claude\projects\<project-path>\memory\MEMORY.md
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

### What gets saved automatically — realistic examples

Here are the kinds of things Claude will note down without being asked:

| What happened in session | What gets saved |
|--------------------------|-----------------|
| You corrected Claude's approach to error handling | "User prefers returning error objects, not throwing exceptions" |
| You explained that tests need a seeded database | "Run `npm run db:seed` before `npm test`" |
| Claude discovered a non-obvious pattern in the codebase | "Auth middleware is in `middleware/` not `src/auth/`" |
| You decided on a naming convention mid-session | "New API routes follow REST convention: `/api/v1/resources/:id`" |

---

## Enabling / Disabling

Auto-memory is **enabled by default**.

**macOS / Linux / WSL:**
```bash
# Disable for all projects
echo '{"autoMemoryEnabled": false}' > ~/.claude/settings.json

# Or toggle inside a session:
> /memory
```

**Windows (PowerShell):**
```powershell
# Disable for all projects
'{"autoMemoryEnabled": false}' | Out-File -FilePath "$env:USERPROFILE\.claude\settings.json"
```

You can also disable via environment variable:

**macOS / Linux / WSL:**
```bash
CLAUDE_CODE_DISABLE_AUTO_MEMORY=true claude
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_DISABLE_AUTO_MEMORY="true"; claude
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

![Memory viewer inside Claude Code session](./images/memory-viewer.png)
> What to expect: an interactive panel showing your current memory file contents, with the ability to edit entries directly.

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

## How Memory, CLAUDE.md, and Session Context Relate

These three things all give Claude information — but they serve different purposes:

```
┌─────────────────────────────────────────────────────────┐
│                    Claude's Knowledge                   │
├─────────────────┬──────────────────┬────────────────────┤
│   CLAUDE.md     │    MEMORY.md     │  Session Context   │
│                 │                  │                    │
│ Written by YOU  │ Written by CLAUDE│ Built up as you    │
│                 │                  │ chat               │
│ Project rules   │ Discoveries &    │ Everything said    │
│ & standards     │ decisions from   │ this session       │
│                 │ past sessions    │                    │
│ Committed to    │ Local only —     │ Gone when session  │
│ git (shared)    │ not shared       │ ends               │
│                 │                  │                    │
│ Example:        │ Example:         │ Example:           │
│ "use TypeScript"│ "JWT decided     │ The last 20 things │
│ "tests: npm t"  │  Jan 15"         │ you said           │
└─────────────────┴──────────────────┴────────────────────┘
         ↓                  ↓                  ↓
         All three are loaded together at the start of a session
```

**Best practice:** Use CLAUDE.md for project standards and conventions. Let MEMORY.md handle session-specific discoveries and personal preferences.

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

## A More Complete Real-World Scenario

Here's how memory builds up over a week of work on a project:

**Monday — Session 1:**
```
> the API returns dates as Unix timestamps but the frontend expects ISO 8601

Claude: Got it. I'll note that down and convert dates in all API responses.
[MEMORY.md updated: "API returns ISO 8601 dates (not Unix timestamps)"]
```

**Wednesday — Session 2:**
```
> why is Claude writing ISO 8601 dates here?

Claude: Based on my notes from Monday, we decided to use ISO 8601 format
because the frontend expects it that way.
```

**Friday — Session 3:**
```
> add a new /api/events endpoint

Claude: [automatically formats dates as ISO 8601 without being told]
```

Each session builds on the last. After a week, Claude has a detailed picture of your project's quirks, decisions, and preferences — and you never had to repeat yourself.

---

## Privacy Note

Memory files are stored **only on your local machine**:

**macOS / Linux / WSL:**
```
~/.claude/projects/<path-hash>/memory/
```

**Windows:**
```
C:\Users\YourName\.claude\projects\<path-hash>\memory\
```

They are never sent to Anthropic's servers independently — they're included as part of your conversation context (which follows normal data handling policies).
