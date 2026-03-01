# Plan Mode

Plan Mode is a read-only mode where Claude can explore and reason about your code without making any changes. It's perfect for understanding a codebase, reviewing a plan before execution, or getting a second opinion before a big refactor.

---

## What is Plan Mode?

In Plan Mode:
- ✅ Claude **can** read files, search code, browse the web
- ❌ Claude **cannot** edit files, run commands, or make any changes

Think of it as "show me your plan before you do anything."

---

## Enabling Plan Mode

### Start a session in plan mode

```bash
claude --permission-mode plan
```

### Toggle during a session

```bash
Shift+Tab    # cycles: Normal → Plan → Auto-Accept
```

Or use the slash command:

```
> /plan
```

---

## Why Use Plan Mode?

### 1. Understand before changing

```
[Plan Mode]
> How does authentication work in this codebase?

Claude reads the auth module, traces the login flow,
and explains it — without changing anything.
```

### 2. Get a plan before approving it

```
[Plan Mode]
> I want to refactor the User model to use UUIDs instead of integer IDs.
  What would need to change?

Claude: Here's what I'd need to do:
1. Update the `users` table migration
2. Change all foreign keys in 8 related tables
3. Update the User model's $casts
4. Update all controllers that rely on integer IDs
5. Update API responses that expose user IDs
6. Add a migration to backfill UUID values

Want me to proceed with these changes?
```

Now you can review the plan, ask follow-up questions, then switch to Normal Mode to execute it.

### 3. Explore unfamiliar code safely

```
[Plan Mode]
> Walk me through the payment processing flow from checkout to receipt
```

Claude traces through the code — reading files, following function calls — and explains everything without risk of accidental changes.

---

## Typical Workflow

```
1. Start in Plan Mode
   claude --permission-mode plan

2. Explore and ask questions
   > How does the caching layer work?
   > What would break if I changed the User.email field?
   > Show me all the places we call the Stripe API

3. Review Claude's plan
   > I want to add rate limiting to the API. What's your plan?

4. Approve and switch to Normal Mode
   Shift+Tab  (switches to Normal or Auto-Accept)

5. Execute the plan
   > Now go ahead and implement it
```

---

## Plan Mode in `EnterPlanMode` (SDK)

If you're using Claude Code as an SDK or writing custom agents, you can use the `EnterPlanMode` and `ExitPlanMode` tools to programmatically enter and exit plan mode.

**EnterPlanMode** — transitions Claude into plan mode so it explores and designs a solution.

**ExitPlanMode** — presents the plan to the user for approval before any code is written.

```
# Example agent behavior:
1. User: "Add user authentication to the app"
2. Claude enters plan mode → explores codebase
3. Claude calls ExitPlanMode → user sees and approves plan
4. User approves → Claude implements
```

---

## Example: Big Refactor Planning

```
$ claude --permission-mode plan

> Our app is getting slow. I think the problem is in how we load data on
  the dashboard page. Can you investigate?

Claude: [reads DashboardController.php, DashboardService.php, 5 related models]

I found several issues:
1. **N+1 query** in DashboardService::getUserStats() — loading 150+ queries per request
2. **No caching** — user stats recalculated on every page load
3. **Unused joins** — 3 LEFT JOINs in the main query return data never used

Here's my recommended fix:
- Add eager loading with `with(['sessions', 'bookings'])`
- Cache user stats in Redis with 5-minute TTL
- Remove unused columns from the SELECT

This should reduce queries from ~150 to ~5 and cut page load by 80%.

Want me to implement these changes?

> Yes, go ahead

[Switch to Normal Mode with Shift+Tab]

Claude: Starting implementation...
```

---

## Plan Mode vs `/review`

| | Plan Mode | `/review` |
|--|-----------|-----------|
| **When** | Before making changes | After changes are made |
| **Focus** | Explore + strategize | Review existing work |
| **Result** | A plan to execute | Feedback on what's done |
| **Edits?** | No | No |

Use Plan Mode **before**, `/review` **after**.

---

## Tips

- Use Plan Mode at the **start of big tasks** to get a roadmap
- You can **ask clarifying questions** in Plan Mode before executing
- Plan Mode **doesn't affect** what Claude has already read — context carries over when you switch modes
- Plan Mode is great for **onboarding** to an unfamiliar codebase: just explore and ask questions
