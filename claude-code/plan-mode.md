# Plan Mode

## What is Plan Mode?

Imagine you're renovating your kitchen. You wouldn't want the contractor to start tearing out cabinets the moment they walk in the door. First, you'd want them to look around, measure everything, and draw up blueprints. Only once you've reviewed the plan and said "yes, this is what I want" would construction begin.

Plan Mode works the same way. When you activate it, Claude can look at everything — read your files, trace through your code, research approaches — but it cannot touch anything. No edits, no commands, no changes of any kind. It draws up the blueprints first. You review them. Then you decide whether to proceed.

```
Without Plan Mode:              With Plan Mode:
> refactor the auth module      > refactor the auth module

Claude: [immediately starts     Claude: Here's what I'd change:
editing files]                  1. Extract token logic (auth.ts)
                                2. Split into 3 smaller services
                                3. Update 8 route handlers
                                4. Add 12 new tests

                                Ready to proceed?

                                > yes [switch to Normal Mode]
                                Claude: Starting implementation...
```

The difference: you see the full scope of work before a single file is touched.

---

## What is Plan Mode?

In Plan Mode:
- Claude **can** read files, search code, browse the web
- Claude **cannot** edit files, run commands, or make any changes

Think of it as "show me your plan before you do anything."

---

## Enabling Plan Mode

### Start a session in plan mode

**macOS / Linux / WSL:**
```bash
claude --permission-mode plan
```

**Windows (PowerShell):**
```powershell
claude --permission-mode plan
```

The command is identical on all platforms — only the terminal you run it from differs.

### Toggle during a session

```
Shift+Tab    # cycles: Normal → Plan → Auto-Accept
```

> **Keyboard note:** `Shift+Tab` means hold Shift and press Tab. This works in all terminals on macOS, Linux, and Windows (including WSL and PowerShell). It cycles through the three modes — keep pressing until you see "Plan Mode" in the status bar.

Or use the slash command:

```
> /plan
```

---

## The Plan → Review → Execute Workflow

```
┌────────────────────────────────────────────────────────────┐
│              Plan Mode Workflow                            │
└────────────────────────────────────────────────────────────┘

  Step 1: Enter Plan Mode
  ┌─────────────────────┐
  │  $ claude           │
  │    --permission-mode│
  │    plan             │
  └──────────┬──────────┘
             │
             ▼
  Step 2: Explore & Ask Questions
  ┌─────────────────────┐
  │ > How does auth     │   Claude reads files,
  │   work here?        │   traces code paths,
  │                     │   searches the codebase.
  │ > What would break  │   Cannot change anything.
  │   if I changed X?   │
  └──────────┬──────────┘
             │
             ▼
  Step 3: Request a Plan
  ┌─────────────────────┐
  │ > I want to add     │   Claude outlines every
  │   rate limiting.    │   file it would change,
  │   What's your plan? │   every step it would take.
  └──────────┬──────────┘
             │
             ▼
  Step 4: Review the Plan
  ┌─────────────────────┐
  │ You read the plan.  │   Ask follow-up questions.
  │ Does it look right? │   Request changes to the plan.
  │ Any concerns?       │   Clarify scope or approach.
  └──────────┬──────────┘
             │
             ▼
  Step 5: Approve & Execute
  ┌─────────────────────┐
  │ > Yes, go ahead     │   Press Shift+Tab to switch
  │                     │   to Normal Mode.
  │  [Shift+Tab]        │   Claude implements the plan.
  └─────────────────────┘
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

## When Would a Beginner Use This?

You don't need to be an expert to benefit from Plan Mode. Here are common beginner scenarios:

**"I've inherited someone else's code and I'm afraid to break it."**
```
> [Plan Mode] Walk me through how this app handles user login.
  What files are involved? What would I need to understand before changing anything?
```
Claude maps out the codebase for you safely, before you touch a thing.

**"I want to add a feature but I'm not sure how big it is."**
```
> [Plan Mode] I want to add email notifications when a user places an order.
  What would that involve? How many files would you need to change?
```
Claude tells you the scope upfront — whether it's a 1-file change or a 15-file refactor.

**"I asked Claude to do something and I'm not sure if it's safe."**
```
> [Plan Mode] What would happen if you ran the database migration script?
  What exactly would change?
```
Plan Mode lets you inspect Claude's intended actions before they happen.

**"I'm learning a new framework and want to understand the patterns."**
```
> [Plan Mode] Explain how this Django app handles API authentication.
  Show me each layer from the request to the response.
```
Safe exploration — Claude reads and explains, but touches nothing.

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

## Example: Understanding an Unfamiliar Codebase

```
$ claude --permission-mode plan

> I just joined this team. Can you give me a tour of the codebase?
  What are the main parts, how do they connect, and where should I
  start if I want to add a new API endpoint?

Claude: [reads project structure, key files, routes, controllers]

Here's an overview:

This is a Laravel + Vue.js application with 3 main layers:

1. API Layer (routes/api.php → app/Http/Controllers/Api/)
   - All endpoints follow REST conventions
   - Authentication uses JWT via app/Http/Middleware/JwtAuth.php

2. Service Layer (app/Services/)
   - Business logic lives here, not in controllers
   - Example: OrderService.php handles all order operations

3. Frontend (resources/js/)
   - Vue 3 with Composition API
   - State managed by Pinia stores in resources/js/stores/

To add a new API endpoint, you'd typically:
1. Add route to routes/api.php
2. Create a controller in app/Http/Controllers/Api/
3. Put business logic in a new or existing Service
4. Add validation in app/Http/Requests/
5. Write tests in tests/Feature/Api/

Want me to walk through a specific feature in detail?
```

This whole exploration happened without a single file being changed.

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
- You can **switch back to Plan Mode mid-task** if you want to pause and re-examine before continuing
