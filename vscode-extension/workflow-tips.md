# Workflow Tips and Best Practices

Getting the most out of Claude Code in VS Code is about building habits, not just knowing the features. These tips come from real development workflows and cover layout, context management, and how to phrase prompts effectively.

---

## Recommended VS Code Layout

The most productive setup is a **split view** with code on one side and Claude on the other.

### Option A: Side-by-side (wide monitor)

```
┌───────────────────┬──────────────────┐
│                   │                  │
│   Your Code       │  Claude Code     │
│   (editor)        │  (terminal or    │
│                   │   panel)         │
│                   │                  │
└───────────────────┴──────────────────┘
```

How to set this up:
1. Open the integrated terminal: `Ctrl+`` ` ``
2. Drag the terminal to the right side of the editor
3. Or use **View → Editor Layout → Two Columns**

### Option B: Code on top, Claude below (laptop)

```
┌──────────────────────────────────────┐
│          Your Code (editor)          │
├──────────────────────────────────────┤
│        Claude Code (terminal)        │
└──────────────────────────────────────┘
```

The default VS Code layout with the terminal at the bottom.

### Option C: Use the Claude Code panel in the sidebar

Pin the Claude Code panel to the Activity Bar on the left or right. This keeps it visible without taking up editor space.

---

## Context Tips

### Select precisely, not broadly

Instead of selecting an entire file, select the specific function or block you're asking about. Claude gives more focused answers with tighter context.

```
[Select 10 lines — a specific function]
> Why is this slow?
```

Better than:

```
[Select 300 lines — the whole file]
> Why is something slow in here?
```

### Use `@` for files you're not currently editing

If you need Claude to reference a config file, a model, or a utility while you're in a different file:

```
> @config/database.php — what's the connection pool size set to?
```

### Tell Claude the full picture for complex tasks

Prompts with context produce better results:

```
> The registration flow breaks when a user signs up with a Google account
  that's already linked to an existing email. @app/Services/AuthService.php
  is where the merge logic lives. The error is "Duplicate entry for key email".
  Fix it.
```

Versus:

```
> fix the registration bug
```

---

## Session Habits

### Name sessions immediately

```
> /rename payment-refactor
```

Do this as soon as you start a session so you can find it later. You'll thank yourself next week.

### Compact when responses feel off-topic

If Claude starts giving less relevant answers in a long session, it may be losing earlier context:

```
> /compact
```

This summarizes old history and frees up the context window.

### Use one session per feature

Don't mix concerns in one session. One session for the auth refactor, another for the UI bug. Focused sessions produce better results.

### Resume instead of restarting

```bash
claude --ide -c
```

Always try to resume the last session rather than starting fresh. You'll have all the context from where you left off.

---

## Prompt Patterns That Work Well

### Diagnosis + fix

```
> The checkout form is returning a 500 error when the postal code contains a space.
  @app/Http/Controllers/CheckoutController.php — find the validation and fix it.
```

### Explain before modifying

```
> @src/middleware/rateLimit.ts — explain what this does, then suggest how to
  make the limit configurable per route.
```

### Incremental refinement

```
[First prompt]
> Add pagination to the users list endpoint

[After seeing the result]
> Good. Now add a 'sort by' parameter that accepts 'name', 'email', or 'created_at'

[After seeing that result]
> Add a test for the sort parameter
```

Breaking tasks into steps beats trying to do everything in one giant prompt.

### Ask for the plan before execution

```
> Before making any changes — walk me through what you'd do to add soft deletes
  to the products table. I want to understand the approach first.
```

This is essentially `/plan` mode in natural language — Claude explains without touching files.

---

## File Management Tips

### Let Claude open files

Instead of manually finding and opening a file:

```
> open the authentication service and add password strength validation
```

Claude reads it, makes the changes, and VS Code auto-reloads.

### Watch for auto-reloads

VS Code reloads edited files automatically. When Claude edits a file:
- Your cursor position is preserved (usually)
- The file reflects Claude's changes immediately
- You can undo Claude's edit with `Ctrl+Z` in the editor (or `Esc Esc` in Claude)

### Undo Claude's changes

Two ways to revert:

1. **In VS Code**: `Ctrl+Z` in the affected file (standard undo)
2. **In Claude**: `Esc Esc` — reverts the last file operation Claude performed

---

## Speed Tips

### Use Fast Mode for quick questions

```
> /fast
```

Toggle on when asking simple questions or doing rapid iteration. Toggle off for complex multi-step tasks.

### Use Haiku for exploration

```
> /model haiku
```

Haiku is faster and cheaper. Switch to it when browsing the codebase or asking questions. Switch back to Opus for complex tasks:

```
> /model opus
```

### Pre-approve commands you trust

In `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": ["Bash(npm *)", "Bash(git *)"],
    "defaultMode": "acceptEdits"
  }
}
```

This removes the confirmation prompt for common commands. Only do this on projects you trust.

---

## Team Workflow Tips

### Commit `.claude/settings.json`

Share Claude's permissions and behavior across the team. This prevents "Claude did something unexpected" surprises for teammates.

### Keep `CLAUDE.md` updated

Treat `CLAUDE.md` like living documentation. When something about the project changes (new patterns, new conventions), update it so Claude stays aligned.

### Use Claude for PR reviews

```
> /review 47
```

Get a second opinion on any PR before approving it. Click the file links to jump to issues.

### Use Claude for onboarding

When a new developer joins, have Claude explain the codebase:

```
> @src/ — give a new developer a walkthrough of this codebase:
  architecture, key patterns, where to find things, and gotchas to watch out for
```

---

## Avoiding Common Mistakes

| Mistake | Better Approach |
|---------|----------------|
| Asking too vaguely | Include the file, the error, and the expected behavior |
| Starting fresh sessions every time | Use `claude --ide -c` to resume |
| Letting sessions get too long | Run `/compact` when responses drift |
| Ignoring the permission mode | Use Auto-Accept on trusted projects, Plan-only for exploration |
| Not naming sessions | `/rename` immediately after starting |
| Only using Claude for coding | Use it for code review, PR descriptions, and documentation too |

---

## Related

- [connecting-to-ide.md](connecting-to-ide.md) — Starting and connecting sessions
- [selected-code-context.md](selected-code-context.md) — Using selections effectively
- [session-management.md](session-management.md) — Naming, resuming, and managing sessions
- [settings-configuration.md](settings-configuration.md) — Configuring permissions and defaults
- [slash-commands-in-vscode.md](slash-commands-in-vscode.md) — Commands for managing the session
