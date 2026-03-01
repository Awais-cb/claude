# Getting Started with Claude Code

## What is Claude Code, really?

Imagine hiring a senior developer who never sleeps, never gets frustrated, and lives permanently inside your terminal. You describe a problem in plain English — "the login form is broken" or "add a search bar to the homepage" — and they read your actual files, figure out what's wrong, make the changes, and run your tests to confirm it works.

That's Claude Code. It's not a chatbot you copy-paste code to and from. It's an AI assistant that can directly read, edit, and run things in your project — with your permission at every step.

```
You type: "the login is broken, fix it"
          ↓
Claude reads your login files
          ↓
Claude finds the bug
          ↓
Claude edits the file
          ↓
Claude runs your tests to verify
          ↓
Claude shows you what it changed
```

You stay in control the whole time. Claude asks before doing anything risky, and you can cancel at any point.

---

## Installation

### Prerequisites

- An **Anthropic account** (claude.ai)

### Step 1: Install Claude Code

**macOS (recommended — native installer):**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**macOS (Homebrew):**
```bash
brew install claude
```

**Linux / Ubuntu:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (WSL — recommended):**

Most Windows developers run Claude Code inside WSL (Windows Subsystem for Linux), which gives you a real Linux terminal inside Windows.

```powershell
# Step 1: Install WSL (run in PowerShell as Administrator)
wsl --install

# This installs Ubuntu by default. Restart your computer when prompted.
```

```bash
# Step 2: Inside WSL (Ubuntu), run the installer
curl -fsSL https://claude.ai/install.sh | bash
```

**Windows (native PowerShell):**
```powershell
winget install Anthropic.Claude
```

**Alternative — install via npm** (requires Node.js 18+):
```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2: Verify installation

```bash
claude --version
```

You should see something like `claude-code/1.x.x`.

![Claude Code version output in terminal](./images/claude-version-output.png)
> What to expect: a version number printed to your terminal confirming the install worked.

### Step 4: Log in

```bash
claude auth login
```

This opens a browser window to authenticate with your Anthropic account. After logging in, return to the terminal — you're ready to go.

**Windows note:** If the browser doesn't open automatically in WSL, copy the URL shown in the terminal and paste it into your Windows browser manually.

---

## Your First Session

### Navigate to your project first

Claude Code works in whatever directory you start it from. Always `cd` into your project before launching Claude:

**macOS / Linux / WSL:**
```bash
cd ~/projects/my-app
claude
```

**Windows (PowerShell):**
```powershell
cd C:\Users\YourName\projects\my-app
claude
```

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

### Or start with an immediate task

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

## A Complete First Session Walkthrough

Here's what a realistic first session looks like — from opening Claude to finishing a small task:

```
$ cd ~/projects/my-web-app
$ claude

> read the README and give me an overview of this project

Claude reads README.md, package.json, and a few key source files...

Claude: This is a Node.js REST API for a task management app. It uses:
- Express for routing
- PostgreSQL via Sequelize ORM
- JWT for authentication
- Jest for testing

The main entry point is src/server.js. There are 3 feature modules:
users, tasks, and notifications.

> the /api/tasks endpoint is returning a 500 error when I filter by status.
  look at src/routes/tasks.js and fix it

Claude: I'll look at that file now...

[Claude reads src/routes/tasks.js]

I found the issue. On line 47, the status filter is comparing against
the raw query string value but the database stores it in uppercase.
Here's the fix:

[Claude edits the file — shows you the diff]

Should I run the test suite to verify?

> yes

Claude runs: npm test

All 23 tests passing. The fix works.

> great. commit the change with a clear message

Claude runs: git add src/routes/tasks.js
Claude runs: git commit -m "Fix: uppercase status comparison in task filter"

Done. Committed as abc1234.
```

That's a complete bug-fix cycle — find, fix, test, commit — all through conversation.

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

**macOS / Linux / WSL:**
```bash
cd ~/projects/my-app
claude
```

**Windows (PowerShell):**
```powershell
cd C:\Users\YourName\projects\my-app
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

## PATH and Shell Setup Notes

After installing Claude Code, if running `claude` gives you "command not found":

**macOS / Linux / WSL (native installer):**

The installer sets up your PATH automatically. If it didn't take effect, restart your terminal or run:
```bash
source ~/.bashrc    # for bash
source ~/.zshrc     # for zsh
```

**macOS / Linux / WSL (npm install):**
```bash
# Check where npm installed it
npm config get prefix

# Add that path to your shell config
# For bash (~/.bashrc or ~/.bash_profile):
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# For zsh (~/.zshrc):
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Windows (PowerShell):**
```powershell
# The winget installer sets PATH automatically.
# For npm install, the global bin is usually already in PATH after Node.js install.
# If not, find the npm prefix with: npm config get prefix
# Then add that path to your system environment variables.
```

---

## Next Steps

- [cli-commands.md](cli-commands.md) — All CLI flags and options
- [slash-commands.md](slash-commands.md) — Commands available inside sessions
- [claude-md.md](claude-md.md) — Teach Claude about your project
- [permissions.md](permissions.md) — Control what Claude is allowed to do
