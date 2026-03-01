# Getting Started with Claude Code

Claude Code is an AI coding assistant that lives in your terminal. It can read your files, run commands, search the web, manage git — all through natural conversation.

---

## Installation

### Prerequisites
- **Node.js** 18 or higher
- An **Anthropic account** (claude.ai)

### Install

```bash
npm install -g @anthropic-ai/claude-code
```

### Verify installation

```bash
claude --version
```

### Log in

```bash
claude auth login
```

This opens a browser window to authenticate with your Anthropic account.

---

## Your First Session

### Start Claude Code

```bash
claude
```

You'll see a prompt where you can type naturally:

```
> What files are in this project?
> Fix the bug in login.js
> Add a unit test for the calculateTotal function
> Explain what this code does
```

### Start with an immediate task

```bash
claude "explain what this project does"
```

### Exit a session

```bash
# Type in the terminal:
exit

# Or press:
Ctrl+D
```

---

## Basic Workflow

Here's a typical session:

```
> read the README and give me an overview

Claude reads README.md and explains the project...

> the getUserById function in src/users.js is throwing a 500 error. Fix it.

Claude reads the file, identifies the bug, and edits it...

> write a test for the fix

Claude creates a test file...

> run the tests

Claude runs: npm test
```

**That's it.** Just talk to it like a senior developer.

---

## Resuming a Previous Session

```bash
# Resume the most recent conversation
claude -c
# or
claude --continue

# Resume a specific session by name
claude -r "my-feature"
# or
claude --resume "my-feature"
```

Inside a session, name it so you can find it later:
```
/rename my-feature
```

---

## Modes: How Claude Works

Claude has three modes you can switch between:

| Mode | What Claude can do | When to use |
|------|-------------------|-------------|
| **Normal** (default) | Everything, asks permission for risky actions | Day-to-day work |
| **Plan Mode** | Read-only — no edits allowed | Explore before committing |
| **Auto-Accept** | Does everything without asking | Trusted, fast iteration |

Switch modes with `Shift+Tab` while in a session.

---

## Key Concepts for Beginners

### Claude can use tools
Claude doesn't just chat — it actively uses tools:
- **Read files** — looks at your actual code
- **Edit files** — makes real changes
- **Run bash commands** — runs tests, builds, etc.
- **Search the web** — fetches documentation
- **Manage git** — commits, PRs, branches

### You're always in control
- Claude **asks before** doing anything potentially risky
- You can **cancel** any action mid-way (`Ctrl+C`)
- You can **undo** recent changes (`Esc Esc`)

### Context is everything
Claude reads your project files to understand context. You can give it more context via:
- **CLAUDE.md** — a file where you explain your project (see [claude-md.md](claude-md.md))
- **Memory** — Claude can remember things across sessions (see [memory-system.md](memory-system.md))

---

## Directory Matters

Claude Code works in the **current directory** when you start it. Always `cd` into your project first:

```bash
cd ~/projects/my-app
claude
```

---

## Practical Examples

### Debug a bug
```
> the login form is not submitting. check src/auth/LoginForm.jsx and tell me why
```

### Add a feature
```
> add a "forgot password" link to the login page that routes to /reset-password
```

### Understand code
```
> explain how the payment processing works in this codebase
```

### Refactor code
```
> the getUserData function in api/users.js is too long. split it into smaller functions
```

### Run and fix tests
```
> run the test suite and fix any failing tests
```

### Write documentation
```
> write a docstring for every function in utils/helpers.py
```

---

## Getting Help

```bash
# Inside a session:
/help        # Show all available commands
/status      # Show version and account info
/doctor      # Diagnose any issues with your setup
```

---

## Next Steps

- [cli-commands.md](cli-commands.md) — All CLI flags and options
- [slash-commands.md](slash-commands.md) — Commands available inside sessions
- [claude-md.md](claude-md.md) — Teach Claude about your project
- [permissions.md](permissions.md) — Control what Claude is allowed to do
