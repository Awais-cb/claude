# Workflow Tips and Best Practices

Getting the most out of Claude Code in VS Code is about building habits, not just knowing the features. These tips come from real development workflows and cover layout, context management, and how to phrase prompts effectively.

Think of your setup like a physical workspace. A cluttered desk makes you inefficient even with good tools. The same applies here — the right layout, the right habits, and knowing when to use which feature turns Claude Code from "useful sometimes" into "can't imagine coding without it."

---

## Recommended VS Code Layout

The most productive setup is a **split view** with code on one side and Claude on the other.

### Option A: Side-by-side (best for wide monitors)

```
┌───────────────────────┬────────────────────────┐
│                       │                        │
│   Your Code           │  Claude Code           │
│   (editor)            │  (terminal or panel)   │
│                       │                        │
│   function login() {  │  > Why is this slow?   │
│     ...               │                        │
│   }                   │  Claude: The N+1 query │
│                       │  in line 34 is the     │
│                       │  culprit. Here's why:  │
│                       │                        │
└───────────────────────┴────────────────────────┘
```

**How to set this up on macOS:**
1. Open the integrated terminal: `Ctrl+`` ` `` `
2. Drag the terminal tab to the right side of the editor area
3. Or use the menu: **View → Editor Layout → Two Columns**

**How to set this up on Windows / Linux:**
1. Same approach: `Ctrl+`` ` `` ` to open terminal
2. Right-click the terminal tab → "Move Terminal to Editor Area"
3. Or drag it to the right panel

**How to set this up in WSL:**
Same as Linux above — the layout controls are in VS Code regardless of whether you're in WSL.

### Option B: Code on top, Claude below (best for laptops)

```
┌──────────────────────────────────────────┐
│           Your Code (editor)             │
│                                          │
│   function login() { ... }               │
│                                          │
├──────────────────────────────────────────┤
│        Claude Code (terminal panel)      │
│                                          │
│  > explain the login function            │
│  Claude: This function handles...        │
└──────────────────────────────────────────┘
```

The default VS Code layout — terminal appears at the bottom. No setup needed.

Resize the split by dragging the horizontal divider between editor and terminal.

### Option C: Claude Code panel in the sidebar

Pin the Claude Code panel to the Activity Bar on the left or right. This keeps it visible without taking up editor or terminal space.

```
┌───┬──────────────────────────────────────┐
│ C │        Your Code (full editor)       │
│ l │                                      │
│ a │   function login() { ... }           │
│ u │                                      │
│ d │   > ask a question here              │
│ e │                                      │
└───┴──────────────────────────────────────┘
```

Right-click the Claude Code icon in the Activity Bar → "Move to" → pick your preferred position.

---

## Setting Up the Layout on Each OS

### macOS — keyboard-driven split

```
1. Cmd+` to open terminal
2. Cmd+Shift+5 → View: Split Editor Right
3. Drag the terminal tab into the right editor group
4. Now the left pane shows your code files, right pane shows the terminal/Claude
```

### Windows — using keyboard shortcuts

```
1. Ctrl+` to open terminal
2. Right-click the terminal tab
3. Select "Move Terminal into Editor Area"
4. Drag to the right side
```

### Linux (Ubuntu) — same as Windows

VS Code's layout controls work identically on Linux.

### WSL — same as Linux once VS Code is open

Once VS Code is connected to WSL, the layout experience is identical to native Linux.

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

The first prompt gives Claude the symptom, the location, and the error message. The second requires Claude to go hunting — which works, but is slower.

---

## Session Habits

### Name sessions immediately

```
> /rename payment-refactor
```

Do this as soon as you start a session so you can find it later. You'll thank yourself next week when you need to resume exactly where you left off.

### Compact when responses feel off-topic

If Claude starts giving less relevant answers in a long session, it may be losing earlier context:

```
> /compact
```

This summarizes old history and frees up the context window. Think of it like reorganizing your notes — you keep the important stuff but discard the drafts.

### Use one session per feature

Don't mix concerns in one session. One session for the auth refactor, another for the UI bug. Focused sessions produce better results because Claude's working memory stays relevant to what you're doing.

### Resume instead of restarting

```bash
claude --ide -c
```

Always try to resume the last session rather than starting fresh. You'll have all the context from where you left off. Starting a new session every day is like throwing away your notes every morning.

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

Getting an explanation first ensures you understand what Claude is about to change. This is especially valuable when you're working in an unfamiliar part of the codebase.

### Incremental refinement

```
[First prompt]
> Add pagination to the users list endpoint

[After seeing the result]
> Good. Now add a 'sort by' parameter that accepts 'name', 'email', or 'created_at'

[After seeing that result]
> Add a test for the sort parameter
```

Breaking tasks into steps beats trying to do everything in one giant prompt. Each step builds on the last and you can course-correct at each stage.

### Ask for the plan before execution

```
> Before making any changes — walk me through what you'd do to add soft deletes
  to the products table. I want to understand the approach first.
```

This is essentially Plan mode in natural language — Claude explains without touching files. Good for complex refactors where you want to review the plan before committing.

### Beginner-friendly: ask Claude what it needs

If you're not sure how to frame a request:

```
> I want to add rate limiting to our API. What information do you need from me
  to do this well? Which files should I point you at?
```

Claude will tell you exactly what context it needs, and you can then provide it with `@` references or selections.

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

1. **In VS Code**: `Ctrl+Z` (`Cmd+Z` on macOS) in the affected file (standard undo)
2. **In Claude**: `Esc Esc` — reverts the last file operation Claude performed

`Esc Esc` is better when Claude changed multiple files — it reverts them all at once. `Ctrl+Z` works file-by-file.

---

## Speed Tips

### Use Fast Mode for quick questions

```
> /fast
```

Toggle on when asking simple questions or doing rapid iteration. Toggle off for complex multi-step tasks where thoroughness matters more than speed.

### Use Haiku for exploration

```
> /model haiku
```

Haiku is faster and cheaper. Switch to it when browsing the codebase or asking questions. Switch back to Opus for complex tasks:

```
> /model opus
```

A practical pattern: use Haiku to explore and understand, then switch to Opus when it's time to write or refactor code.

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

Treat `CLAUDE.md` like living documentation. When something about the project changes (new patterns, new conventions, architectural decisions), update it so Claude stays aligned. Add it to your onboarding checklist.

### Use Claude for PR reviews

```
> /review 47
```

Get a second opinion on any PR before approving it. Click the file links in the response to jump to specific issues. This catches things human reviewers miss.

### Use Claude for onboarding

When a new developer joins, have Claude explain the codebase:

```
> @src/ — give a new developer a walkthrough of this codebase:
  architecture, key patterns, where to find things, and gotchas to watch out for
```

This generates a more up-to-date onboarding guide than any README you've written by hand.

### Use Claude for documentation

```
> @src/services/PaymentService.ts — generate comprehensive JSDoc comments for
  every public method. Include param descriptions, return types, and example usage.
```

Claude reads the actual implementation and writes accurate documentation — no guessing.

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
| Selecting too much code | Select the specific function/block, not the whole file |
| Forgetting to update CLAUDE.md | Treat it like a living team wiki |

---

## Workflow for Common Scenarios

### Starting your day

```bash
# 1. Open your project
code ~/projects/my-app

# 2. Resume your session from yesterday
claude --ide -c

# 3. Check where you left off
> /history

# 4. Continue from where you stopped
```

### Bug fix workflow

```
1. Reproduce the bug
2. Select the relevant code
3. > Describe the bug with symptom + error message
4. Claude diagnoses it
5. Click any file links to navigate to the issue
6. > fix it
7. > /diff  (review what changed)
8. Test
9. > commit with a message explaining the fix
```

### New feature workflow

```
1. > Before writing any code, outline an approach for [feature].
   What files will need to change?

2. Review the plan

3. > Good. Let's start with [first part]. @relevant/file.ts

4. Iterate with follow-up prompts

5. > /security-review  (before committing)

6. > /commit-push-pr
```

### Code review workflow

```
1. > /review 123   (PR number)
2. Read Claude's feedback
3. Click links to navigate to each issue
4. Select the problematic code
5. > fix this issue (for each one)
6. > /diff  (confirm all changes are correct)
7. Approve or request changes
```

---

## Related

- [connecting-to-ide.md](connecting-to-ide.md) — Starting and connecting sessions
- [selected-code-context.md](selected-code-context.md) — Using selections effectively
- [session-management.md](session-management.md) — Naming, resuming, and managing sessions
- [settings-configuration.md](settings-configuration.md) — Configuring permissions and defaults
- [slash-commands-in-vscode.md](slash-commands-in-vscode.md) — Commands for managing the session
