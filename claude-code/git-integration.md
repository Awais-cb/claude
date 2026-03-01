# Git Integration

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

🤖 Generated with Claude Code
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

---

## Fetching PR Comments

```
> /pr-comments 47
```

Shows all review comments on a PR so you can address them:

```
> fetch the comments on PR #47 and fix the issues
```

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

---

## Git Worktrees — Parallel Work

Worktrees let you work on multiple things simultaneously without switching branches. Each worktree is an isolated copy of your repo.

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

## Tips

- Claude follows git best practices: feature branches, descriptive commits, no force-pushing to main
- Claude will **warn you** before running destructive operations like `git reset --hard` or `git push --force`
- Use `--allowedTools "Bash(git *)"` to auto-approve all git commands
- Claude understands your git history and uses it as context when debugging
