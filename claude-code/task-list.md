# Task List & Progress Tracking

Think of the task list like a sticky note board that Claude keeps updated while it works — you can see exactly what's done, what's in progress, and what's coming next. When you hand Claude a big job, it doesn't just dive in blindly. It first pins up a set of sticky notes (tasks), then works through them one at a time, moving each from "todo" to "done" as it goes. You always know where it is and how much is left.

This is especially valuable for complex work that takes several minutes. Instead of staring at a blank terminal wondering "is it still going?", you get a live progress board.

![Claude Code task list panel showing tasks in different states](./images/task-list-panel.png)
> *What to expect: A sidebar or inline panel listing task steps with icons showing pending, in-progress, and completed states updating in real time.*

---

## What is the Task List?

When you give Claude a complex task, it creates a structured list of steps and updates it in real-time:

```
> Implement user authentication with login, registration, and password reset

Claude creates tasks:
[⏳] Set up auth database tables
[⏳] Create User model with password hashing
[⏳] Build login endpoint with JWT
[⏳] Build registration endpoint with validation
[⏳] Build password reset with email flow
[⏳] Add auth middleware for protected routes
[⏳] Write tests for all auth endpoints

Claude starts working...

[✅] Set up auth database tables
[🔄] Create User model with password hashing
[⏳] Build login endpoint with JWT
...
```

---

## Viewing the Task List

Toggle the task list view at any time:

**macOS:**
```bash
Ctrl+T      # Toggle task list view
```

**Linux (Ubuntu):**
```bash
Ctrl+T      # Toggle task list view
```

**Windows (WSL or PowerShell):**
```bash
Ctrl+T      # Toggle task list view
```

Or type a slash command inside any session:

```
> /tasks    # Show all tasks and their status
```

This works the same way on all operating systems.

---

## Task States

| Icon | State | Meaning |
|------|-------|---------|
| ⏳ | `pending` | Not started yet |
| 🔄 | `in_progress` | Currently working on |
| ✅ | `completed` | Done |

Here is what the flow looks like as Claude works through a feature:

```
Time →

[⏳] Create DB tables
[⏳] Build model
[⏳] Build endpoint
[⏳] Write tests

          ↓  Claude starts

[✅] Create DB tables
[🔄] Build model
[⏳] Build endpoint
[⏳] Write tests

          ↓  Model done

[✅] Create DB tables
[✅] Build model
[🔄] Build endpoint
[⏳] Write tests

          ↓  All done

[✅] Create DB tables
[✅] Build model
[✅] Build endpoint
[✅] Write tests
```

---

## When to Use Task Lists

The task list feature is most helpful when:

- You are asking Claude to implement a multi-step feature from scratch
- You want to monitor progress without interrupting Claude mid-task
- You are running long jobs (test suites, large refactors, batch file processing) and want to do other work in parallel
- You are coordinating multiple Claude agents across a shared codebase

You do NOT need to do anything to enable the task list. Claude creates it automatically when it detects that the work has 3 or more distinct steps.

---

## When Claude Creates Tasks (and When It Doesn't)

Claude creates a task list when:
- Multiple independent steps are needed
- The work will take more than a few actions
- You give multiple things to do at once

```
> 1. Update the API endpoints to use the new auth system
  2. Update all the tests
  3. Update the documentation
  4. Create a migration for the schema changes
```

Claude creates 4 tasks and works through them systematically.

Claude does NOT create a task list when:
- The request is a single action (e.g., "rename this variable")
- You are asking a question rather than requesting work
- The job can be completed in one or two steps

---

## Background Tasks

You can run tasks in the background while you do something else. Think of it like putting laundry in the washing machine — you start it, walk away, and check back when it is done.

**macOS:**
```bash
Ctrl+B      # Background the currently running task
```

**Linux (Ubuntu):**
```bash
Ctrl+B      # Background the currently running task
```

**Windows (WSL):**
```bash
Ctrl+B      # Background the currently running task
```

The task keeps running. You can:
- Start a new conversation
- Continue asking questions
- Check back on the background task

```bash
Ctrl+T      # See background task progress (all platforms)
```

### Example: Run tests while working

```
> run the full test suite

[Starts running 500 tests...]

[You press Ctrl+B to background it]

> while tests run, explain how the payment module works

Claude explains the payment module...

[Tests finish in background]

Claude: Background task completed: 498 tests passed, 2 failed.
Tests/UserAuthTest.php:
  - testLoginWithInvalidPassword — assertion failed
  - testTokenExpiry — timeout exceeded
```

---

## Killing Background Agents

If you need to cancel a background task:

**macOS / Linux (Ubuntu) / Windows (WSL):**
```bash
Ctrl+F      # Kill background agents (press twice to confirm)
```

This is the equivalent of pulling the plug — use it when a task is going in the wrong direction or has been running longer than expected.

---

## Shared Task Lists

For agent teams or cross-session task coordination:

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_TASK_LIST_ID=/path/to/shared/tasks claude
```

**Windows (WSL):**
```bash
CLAUDE_CODE_TASK_LIST_ID=/mnt/c/path/to/shared/tasks claude
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_TASK_LIST_ID = "C:\path\to\shared\tasks"
claude
```

Multiple Claude sessions can see and update the same task list — useful for agent teams working on different parts of the same project.

---

## How Claude Uses Tasks

Claude automatically creates tasks for complex work (3+ distinct steps). It uses the task list to:

1. **Plan before acting** — breaks work into clear steps
2. **Show progress** — you always know what's happening
3. **Stay organized** — one task at a time, in order
4. **Survive compaction** — tasks persist even when conversation is compacted

### Visual: How tasks relate to Claude's work

```
Your request
     │
     ▼
Claude plans
  ┌─────────────────────────┐
  │ [⏳] Step 1             │
  │ [⏳] Step 2             │
  │ [⏳] Step 3             │
  └─────────────────────────┘
     │
     ▼
Claude executes (updates task list as it goes)
  ┌─────────────────────────┐
  │ [✅] Step 1  ← done     │
  │ [🔄] Step 2  ← active   │
  │ [⏳] Step 3             │
  └─────────────────────────┘
     │
     ▼
Claude finishes
  ┌─────────────────────────┐
  │ [✅] Step 1             │
  │ [✅] Step 2             │
  │ [✅] Step 3             │
  └─────────────────────────┘
```

---

## Practical Example: Large Feature

```
$ claude

> I need to add a complete notification system: email, SMS, and in-app notifications.
  Users should be able to set their preferences.

Claude creates tasks:
[⏳] Design notification system architecture
[⏳] Create notifications database tables
[⏳] Build notification preferences UI
[⏳] Implement email notification service
[⏳] Implement SMS notification service
[⏳] Implement in-app notification storage
[⏳] Create notification preference API endpoints
[⏳] Write tests for notification services

[🔄] Designing notification system architecture...
```

You can check in anytime:

```
> how's it going?

Claude: I've completed the database tables and preferences UI.
Currently implementing the email service.
5 tasks remaining after this one.
```

---

## Task List Persistence

Task lists survive:
- **Context compaction** — task list persists even when conversation is summarized
- **Session pauses** — resume a session with `/continue` and tasks are still there
- **Multiple worktrees** — with `CLAUDE_CODE_TASK_LIST_ID`, tasks are shared

---

## Tips for Working with Tasks

### Break down requests yourself

Claude creates better tasks when you structure your request:

```
> Do the following in order:
  1. First, read through the existing auth code
  2. Then identify any security issues
  3. Then fix each issue
  4. Finally, add tests for the fixes
```

### Check in, don't interrupt

While Claude is working on tasks, you can ask status questions:

```
> what are you working on?
> how many tasks are left?
> is there anything I need to decide?
```

Claude updates you without losing progress.

### Background long-running tasks

If you need Claude to do something that takes 5-10 minutes (like running a full test suite, processing many files, or doing extensive research):

```
> analyze all 200 API endpoints for security vulnerabilities
  [Ctrl+B to background it]
> in the meantime, let's work on something else
```
