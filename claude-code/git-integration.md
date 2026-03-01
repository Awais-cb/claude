# Git Integration

Imagine having a seasoned git expert sitting right next to you. You don't have to remember the exact flags for an interactive rebase, or the right way to write a commit message, or the `gh` CLI syntax to open a pull request. You just describe what you want — "commit this, push it, and open a PR against main" — and they handle all the commands while you stay focused on writing code. That's what Claude Code's git integration feels like.

Claude Code has deep integration with Git and GitHub — from making commits to reviewing PRs to running parallel experiments in isolated worktrees.

---

## Basic Git Operations

Claude can run any git command. Just ask naturally:

```
> commit these changes with a meaningful message
> create a new branch called feature/user-auth
> what changed in the last 3 commits?
> rebase onto main
> show me the diff for the payment module
```

Claude understands git and follows safe practices:
- Creates new commits (never force-amends unless asked)
- Writes descriptive commit messages
- Checks status before making changes
- Warns before destructive operations

---

## Git Setup by OS

Before Claude can push to remote repositories, git needs to be configured with your credentials. Here's how to do that on each OS:

**macOS:**
```bash
# Install git (if not already installed via Xcode tools)
xcode-select --install

# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Use macOS Keychain to store credentials (recommended)
git config --global credential.helper osxkeychain

# Install GitHub CLI for PR creation
brew install gh
gh auth login
```

**Linux (Ubuntu):**
```bash
# Install git and GitHub CLI
sudo apt update && sudo apt install git gh -y

# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Store credentials for HTTPS remotes
git config --global credential.helper store

# Authenticate GitHub CLI
gh auth login
```

**Windows (WSL):**
```bash
# Inside WSL terminal — install git and GitHub CLI
sudo apt update && sudo apt install git -y

# Install GitHub CLI in WSL
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
  && sudo mkdir -p -m 755 /etc/apt/keyrings \
  && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg \
     | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
  && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
     | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt update && sudo apt install gh -y

# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Use the Windows Credential Manager from WSL (bridges to Windows)
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"

# Authenticate GitHub CLI
gh auth login
```

---

## Creating Commits

```
> commit the changes I just made
```

Claude will:
1. Run `git status` to see what changed
2. Run `git diff` to understand the changes
3. Stage the relevant files
4. Write a descriptive commit message
5. Create the commit

### Example output

```
I'll commit the authentication changes.

Changes:
- src/auth/login.ts — added JWT validation
- src/middleware/auth.ts — updated token check
- tests/auth.test.ts — added 5 new test cases

Creating commit: "Add JWT token validation to auth middleware"
```

### "I just wrote some code — what do I do next?" (Step by step for beginners)

This is the most common scenario. You've been coding, and now you want to save your work and share it. Here's the full flow:

```
Step 1: Tell Claude what you built
─────────────────────────────────
> I just added user authentication with email and password.
  Commit these changes.

Step 2: Claude reviews and commits
───────────────────────────────────
Claude runs git status, git diff, stages files,
and creates a commit with a descriptive message.

Step 3: Push to remote
───────────────────────
> push this to GitHub

Step 4: Open a pull request
────────────────────────────
> open a PR to merge this into main

Step 5: Share the PR URL
─────────────────────────
Claude gives you the GitHub PR link to share with your team.
```

---

## Creating Pull Requests

```
> create a PR for this branch
```

Claude will:
1. Check the current branch and commits
2. Compare with the base branch
3. Generate a PR title and description
4. Run `gh pr create` to open the PR

### Commit → Push → PR workflow (visual)

```
Local Machine                        GitHub
─────────────────────────────────    ────────────────────────────
Your Code Changes
      │
      │  > commit these changes
      ▼
  git commit ─────────────────────►  (not yet on GitHub)
      │
      │  > push to GitHub
      ▼
  git push ────────────────────────► feature/my-branch (on GitHub)
      │
      │  > create a PR
      ▼
  gh pr create ────────────────────► Pull Request #47
                                          │
                                          │  Team reviews
                                          ▼
                                     PR merged into main
```

### Example PR description Claude writes

```markdown
## Summary
- Add JWT validation to authentication middleware
- Fix token expiry edge case for refresh tokens
- Add unit tests for token validation logic

## Test plan
- [ ] Run `npm test` — all tests pass
- [ ] Manually test login with valid token
- [ ] Verify expired tokens are rejected

Generated with Claude Code
```

---

## Reviewing Pull Requests

```
> /review 47
```

Or:

```
> review pull request #47 for security issues
```

Claude will:
- Fetch the PR diff
- Review for correctness, security, performance
- Suggest improvements with specific line references

**When to use:** Before merging any PR, especially ones that touch authentication, payments, or database queries. Claude catches things humans miss after staring at code all day.

---

## Fetching PR Comments

```
> /pr-comments 47
```

Shows all review comments on a PR so you can address them:

```
> fetch the comments on PR #47 and fix the issues
```

**Real-world scenario:** A teammate left 6 review comments on your PR. Instead of reading each one and manually making changes, you run this command and Claude reads all the comments, understands what's needed, and makes all the fixes in one pass.

---

## Commit, Push, and PR in One Step

```
> /commit-push-pr
```

Claude will:
1. Stage changed files
2. Create a commit
3. Push to remote
4. Open a pull request

**When to use:** When you're done with a feature and want to get it to GitHub in one go without thinking about the individual steps.

---

## Git Worktrees — Parallel Work

Worktrees let you work on multiple things simultaneously without switching branches. Each worktree is an isolated copy of your repo.

Think of your project folder like a workbench. Normally you can only work on one thing at a time — you have to put one project away before starting another. Worktrees are like having multiple workbenches side by side. Your half-built refactor stays on one bench while you do a hotfix on another, and they never get mixed up.

```
Main Worktree                    Worktree: hotfix-login
─────────────────────────────    ────────────────────────────────
Branch: feature/big-refactor     Branch: worktree-hotfix-login
Working on: payment overhaul     Working on: JWT token fix
Status: 40 files changed         Status: 2 files changed

     Both exist independently — you can switch between them
     without stashing, without losing your place.
```

### Create a worktree

```bash
# Start a session in a new worktree
claude -w "new-feature"

# Equivalent to:
claude --worktree "new-feature"
```

This creates:
```
.claude/worktrees/new-feature/    ← isolated copy of your repo
```
On a new branch: `worktree-new-feature`

### Why use worktrees?

**Scenario:** You're in the middle of a big refactor, but there's a critical bug to fix.

Without worktrees: stash your work, switch branches, fix bug, switch back, unstash — messy.

With worktrees: keep your refactor going in the main session, open a worktree for the bug fix.

```bash
# Terminal 1: Continue refactor
claude  # (your main session)

# Terminal 2: Fix the bug independently
claude -w "hotfix-login-bug"
```

### Worktree visual diagram

```
Your Project Directory
├── src/                     ← main worktree (feature/big-refactor)
├── tests/
├── package.json
│
└── .claude/
    └── worktrees/
        ├── hotfix-login/    ← isolated copy (branch: worktree-hotfix-login)
        │   ├── src/
        │   ├── tests/
        │   └── package.json
        │
        └── experiment-v2/   ← another isolated copy
            ├── src/
            ├── tests/
            └── package.json
```

Each worktree shares the same git history but has its own working files. Changes in one worktree never bleed into another.

### Worktree use cases

```
> /batch
```

The `/batch` command uses worktrees automatically to:
1. Plan a large-scale change (e.g., rename a function across 50 files)
2. Execute changes in parallel across multiple worktrees
3. Merge results back

---

## Worktree for Subagents

You can run subagents in isolated worktrees:

```yaml
---
name: experimenter
description: Try risky changes without affecting main work
isolation: worktree
---
```

Each time this agent runs, it gets its own clean worktree.

---

## GitHub App Integration

Set up Claude as a GitHub Actions bot:

```
> /install-github-app
```

This configures Claude to:
- Automatically respond to PR comments that tag `@claude`
- Run code reviews when PRs are opened
- Fix issues when asked via comments

### Example GitHub Actions usage

After installation, in any PR comment:
```
@claude please review this for security issues
@claude fix the failing tests
@claude refactor the getUserData function to be more readable
```

**When to use:** Teams that want Claude automatically available for every PR, without anyone having to manually invoke it.

---

## Viewing Diffs

```
> /diff
```

Opens an interactive diff view of recent changes.

```
> show me what changed since last commit
> compare main and this branch
> what's different in the auth module from 3 commits ago?
```

---

## Security Review

```
> /security-review
```

Reviews all changes on the current branch vs main for security vulnerabilities:
- Injection vulnerabilities
- Authentication/authorization issues
- Exposed credentials
- Unsafe dependencies
- Input validation gaps

**When to use:** Before merging any branch that touches user data, authentication, payments, file uploads, or external API integrations.

---

## Practical Git Workflow

### Feature development workflow

```bash
# 1. Start new feature
cd my-project
claude

> create a branch for the new payment feature

# 2. Develop
> implement the Stripe payment integration

# 3. Review your work
> /diff

# 4. Commit and PR
> /commit-push-pr

# 5. Address review comments
> /pr-comments 52
> fix the issues from the PR review
```

### Bug fix workflow

```bash
# Quick worktree for the hotfix
claude -w "hotfix-auth"

> the login is broken in production — JWT tokens are being rejected
  even when valid. Find and fix the issue.

> /commit-push-pr
```

---

## Troubleshooting Common Git Issues

| Error | What it means | What to tell Claude |
|-------|--------------|---------------------|
| `Permission denied (publickey)` | SSH key not configured | "Set up SSH keys for GitHub on this machine" |
| `failed to push — non-fast-forward` | Remote has commits you don't have locally | "Pull the latest changes from remote and then push" |
| `fatal: not a git repository` | You're not inside a git project | "Initialize a new git repository here" |
| `nothing to commit, working tree clean` | No changes to commit | Check if you saved your files |
| `Merge conflict in file.ts` | Two branches changed the same lines | "Help me resolve the merge conflicts in this file" |
| `detached HEAD state` | You checked out a commit directly | "Get me back on the main branch" |

---

## Tips

- Claude follows git best practices: feature branches, descriptive commits, no force-pushing to main
- Claude will **warn you** before running destructive operations like `git reset --hard` or `git push --force`
- Use `--allowedTools "Bash(git *)"` to auto-approve all git commands
- Claude understands your git history and uses it as context when debugging
