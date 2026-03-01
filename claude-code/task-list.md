# Task List & Progress Tracking

Claude Code has a built-in task system for tracking progress on multi-step work. When Claude breaks a complex task into steps, it creates a todo list and marks items as it completes them — so you always know what's happening.

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

```bash
Ctrl+T      # Toggle task list view
```

Or:

```
> /tasks    # Show all tasks and their status
```

---

## Task States

| Icon | State | Meaning |
|------|-------|---------|
| ⏳ | `pending` | Not started yet |
| 🔄 | `in_progress` | Currently working on |
| ✅ | `completed` | Done |

---

## Background Tasks

You can run tasks in the background while you do something else:

```bash
Ctrl+B      # Background the currently running task
```

The task keeps running. You can:
- Start a new conversation
- Continue asking questions
- Check back on the background task

```bash
Ctrl+T      # See background task progress
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

```bash
Ctrl+F      # Kill background agents (press twice to confirm)
```

---

## Shared Task Lists

For agent teams or cross-session task coordination:

```bash
CLAUDE_CODE_TASK_LIST_ID=/path/to/shared/tasks claude
```

Multiple Claude sessions can see and update the same task list — useful for agent teams working on different parts of the same project.

---

## How Claude Uses Tasks

Claude automatically creates tasks for complex work (3+ distinct steps). It uses the task list to:

1. **Plan before acting** — breaks work into clear steps
2. **Show progress** — you always know what's happening
3. **Stay organized** — one task at a time, in order
4. **Survive compaction** — tasks persist even when conversation is compacted

### When Claude creates tasks

Claude creates a task list when:
- Multiple independent steps are needed
- The work will take more than a few actions
- You give multiple things to do at once:

```
> 1. Update the API endpoints to use the new auth system
  2. Update all the tests
  3. Update the documentation
  4. Create a migration for the schema changes
```

Claude creates 4 tasks and works through them systematically.

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
