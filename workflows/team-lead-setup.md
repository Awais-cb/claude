# Team Lead Setup Guide

How to configure Claude Code so every developer on your team gets a consistent, productive, and safe experience from day one.

---

## Overview

As a team lead, you control:
1. **What Claude knows about your project** — via `CLAUDE.md`
2. **What Claude is allowed to do** — via `settings.json` permissions
3. **How Claude behaves automatically** — via hooks
4. **Reusable workflows** — via shared skills and agents
5. **What each developer should set up locally** — onboarding checklist

Everything in `.claude/` gets committed to git and shared with the team. Personal preferences go in `.claude/settings.local.json` (gitignored).

---

## Step 1: Create the Project CLAUDE.md

This is the most impactful thing you can do. Every Claude session every developer starts will read this file automatically.

```bash
# Generate a first draft automatically
claude
> /init
```

Then edit it to add your team's specifics. A strong CLAUDE.md covers:

```markdown
# [Project Name] — Claude Guide

## Project Overview
[2-3 sentences: what the app does, who uses it, tech stack summary]

## Architecture
[How the layers connect — e.g. React SPA → Express API → PostgreSQL]
Key entry points:
- Frontend: `src/main.tsx`
- API: `src/server.ts`
- DB models: `src/models/`

## Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js 20, Express, Prisma ORM
- **Database**: PostgreSQL 15
- **Testing**: Vitest (unit), Playwright (E2E)
- **CI**: GitHub Actions

## Commands
```bash
npm run dev          # start dev server (frontend + backend)
npm run dev:api      # backend only
npm test             # run Vitest
npm run test:e2e     # run Playwright
npm run lint         # ESLint
npm run typecheck    # TypeScript check
npx prisma migrate dev  # run DB migrations
```

## Coding Conventions
- 2-space indent, single quotes, trailing commas
- Named exports only — no default exports
- Every API route must have a Zod validation schema
- Use `logger` (src/lib/logger.ts), never `console.log`
- All DB access via repositories in `src/repositories/`
- Services in `src/services/` handle business logic

## Git Conventions
- Branch naming: `feat/`, `fix/`, `chore/`, `refactor/`
- Commit format: Conventional Commits (`feat:`, `fix:`, `docs:`)
- PR must pass CI and have at least 1 approval before merge

## Do Not
- Never run `prisma migrate reset` — wipes the database
- Don't commit `.env` or any secrets
- Don't use `any` in TypeScript — use `unknown` and narrow it
- Don't bypass ESLint with `// eslint-disable` without a comment explaining why
- Don't write raw SQL — use Prisma query builder

## Key Files to Know
- `src/lib/errors.ts` — custom error classes
- `src/lib/auth.ts` — JWT helpers
- `src/middleware/` — Express middleware (auth, validation, error handling)
- `src/types/` — shared TypeScript types
```

**Tips for a great CLAUDE.md:**
- Keep it under 150 lines — Claude reads it every session
- Update it when conventions change — stale instructions hurt more than none
- Use `@file` imports to pull in architecture docs: `@docs/architecture.md`

---

## Step 2: Configure Shared Permissions

Create `.claude/settings.json` at the project root and commit it:

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Bash(git status)",
      "Bash(git log *)",
      "Bash(git diff *)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git checkout *)",
      "Bash(git branch *)",
      "Bash(git push *)",
      "Bash(git pull *)",
      "Bash(npm run *)",
      "Bash(npm test *)",
      "Bash(npx prisma *)",
      "Bash(npx playwright *)"
    ],
    "deny": [
      "Write(.env*)",
      "Write(*.key)",
      "Write(*.pem)",
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(npx prisma migrate reset)",
      "Bash(npx prisma db push --force-reset)"
    ],
    "defaultMode": "normal"
  },
  "includeCoAuthoredBy": true
}
```

This pre-approves safe commands (git, npm scripts, Prisma migrations) so developers aren't interrupted by prompts for routine actions, while blocking dangerous ones outright.

**Add `.claude/settings.local.json` to `.gitignore`** so devs can override locally without affecting the team:

```bash
echo ".claude/settings.local.json" >> .gitignore
```

---

## Step 3: Set Up Shared Hooks

Create `.claude/settings.json` hooks section to automate quality enforcement:

```json
{
  "permissions": { "...": "..." },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "FILE=$CLAUDE_TOOL_INPUT_FILE_PATH; case $FILE in *.ts|*.tsx|*.js|*.jsx) npx prettier --write \"$FILE\" 2>/dev/null; npx eslint --fix \"$FILE\" 2>/dev/null;; *.css|*.scss) npx prettier --write \"$FILE\" 2>/dev/null;; esac"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "CMD=$CLAUDE_TOOL_INPUT_COMMAND; if echo \"$CMD\" | grep -qE 'migrate reset|db push --force|drop database|DROP TABLE'; then echo '{\"decision\":\"block\",\"reason\":\"Destructive database operation blocked. Run manually if you are sure.\"}'; else echo '{\"decision\":\"allow\"}'; fi"
      }
    ]
  }
}
```

**Per-OS notifications** (each dev adds this to their `.claude/settings.local.json`):

```json
{
  "hooks": {
    "Notification": [
      {
        "command": "YOUR_NOTIFICATION_COMMAND"
      }
    ]
  }
}
```

| OS | Notification command |
|----|---------------------|
| macOS | `osascript -e 'display notification "Claude needs input" with title "Claude Code"'` |
| Linux | `notify-send "Claude Code" "Claude needs input"` |
| Windows (WSL) | `powershell.exe -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Claude needs input','Claude Code')"` |

---

## Step 4: Create Shared Skills

Skills are reusable slash commands. Create them in `.claude/skills/` and commit.

### `/pr` — Full PR workflow

`.claude/skills/pr.md`:
```markdown
---
name: pr
description: Stage changes, write commit, push, and open a PR
---

Review all changed files with /diff first, then:
1. Stage all relevant files (not .env, not node_modules)
2. Write a Conventional Commits message (feat/fix/refactor/chore + scope + description)
3. Push to the current branch
4. Create a GitHub PR with:
   - Title: same as commit subject
   - Body: bullet summary of changes + test plan checklist
   - Draft if the work is not yet complete
```

### `/check` — Pre-commit quality gate

`.claude/skills/check.md`:
```markdown
---
name: check
description: Run lint, typecheck, and tests before committing
---

Run these in order and report results:
1. `npm run typecheck` — TypeScript errors
2. `npm run lint` — ESLint violations
3. `npm test -- --run` — unit tests

If anything fails, fix it before proceeding.
Report a summary: PASS/FAIL for each step with counts.
```

### `/review` override — Team-specific review

`.claude/skills/team-review.md`:
```markdown
---
name: team-review
description: Review code against our team's specific standards
---

Review the changed files against these rules:

SECURITY
- [ ] No hardcoded secrets or API keys
- [ ] User input validated with Zod at API boundaries
- [ ] SQL/DB queries use Prisma (no raw SQL)
- [ ] Auth middleware applied to protected routes

CODE QUALITY
- [ ] No `any` types in TypeScript
- [ ] No `console.log` (use logger)
- [ ] Errors use custom error classes from src/lib/errors.ts
- [ ] No functions over 40 lines

ARCHITECTURE
- [ ] Business logic in services, not controllers
- [ ] DB access only via repositories
- [ ] New endpoints have Zod schema validation

TESTS
- [ ] New functions have unit tests
- [ ] Happy path + at least one error case tested

Report each item as PASS, FAIL, or N/A with line references for failures.
```

---

## Step 5: Create Shared Agents

Agents are specialized Claude instances. Create them in `.claude/agents/`:

### Code Reviewer Agent

`.claude/agents/reviewer.md`:
```markdown
---
name: reviewer
description: Strict code reviewer focused on security and our team standards
model: opus
tools: [Read, Grep, Glob]
permissionMode: plan
---

You are a strict but fair code reviewer for our team. You know our conventions
from CLAUDE.md. When reviewing:

1. Security first — look for injection, auth bypass, exposed secrets
2. Type safety — flag any `any` or unchecked casts
3. Architecture — is business logic in the right layer?
4. Test coverage — are edge cases tested?

Be specific: always give file name and line number.
Categorize findings as: CRITICAL / WARNING / SUGGESTION
```

### Explorer Agent (read-only, cheap)

`.claude/agents/explorer.md`:
```markdown
---
name: explorer
description: Fast, read-only codebase search and exploration
model: haiku
tools: [Read, Grep, Glob, WebSearch]
permissionMode: plan
---

You find and summarize code. Never modify anything.
When searching, be systematic: search by file name, then by content, then by imports.
Always report: what you found, where it is (file:line), and a brief summary.
```

---

## Step 6: Developer Onboarding Checklist

Share this with every new developer joining the team:

```markdown
# Claude Code Onboarding

## Install (10 min)
- [ ] Install Node.js 18+ (use nvm recommended)
- [ ] `npm install -g @anthropic-ai/claude-code`
- [ ] `claude auth login` — sign in with your Anthropic account
- [ ] Install the Claude Code VS Code extension: `code --install-extension anthropic.claude-code`
- [ ] Run `/terminal-setup` inside Claude to configure Shift+Enter

## Configure (5 min)
- [ ] Create `~/.claude/CLAUDE.md` with your personal preferences:
  ```markdown
  # My Preferences
  - My name is [Name]
  - I prefer verbose explanations while I'm learning the codebase
  - Always ask before deleting files
  ```
- [ ] Create `.claude/settings.local.json` in the project for personal overrides:
  ```json
  { "permissions": { "allow": ["Bash(docker *)"] } }
  ```
- [ ] Set up your OS notification in `.claude/settings.local.json`

## First Session
- [ ] `cd` to the project root
- [ ] `claude --ide` to connect to VS Code
- [ ] Ask: `> give me an overview of this codebase and how to get started`
- [ ] Read through the generated CLAUDE.md so you know what Claude knows

## Daily Workflow
See the relevant workflow guide:
- Backend: [backend.md](backend.md)
- Frontend: [frontend.md](frontend.md)
- Fullstack: [fullstack.md](fullstack.md)
```

---

## Step 7: Team Best Practices to Enforce

### Keep CLAUDE.md up to date
Assign someone (you, or rotate) to review `CLAUDE.md` monthly. Outdated instructions are worse than none — Claude will follow them even if they're wrong.

### Commit `.claude/` to git
```
.claude/
├── settings.json       ✅ commit (shared permissions + hooks)
├── settings.local.json ❌ gitignore (personal overrides)
├── agents/             ✅ commit (shared agents)
└── skills/             ✅ commit (shared skills)
```

### Name sessions, not conversations
Encourage devs to immediately `/rename` every session with the ticket number or feature name. This makes it trivial to pick up where they left off.

### Use plan mode for risky work
Any ticket involving DB schema changes, auth changes, or large refactors should start with:
```bash
claude --permission-mode plan
```

### Review with Claude before human review
Before opening a PR, every dev should run:
```
> /check          # lint + types + tests
> /team-review    # team-specific code review
> /pr             # commit + push + open PR
```

This catches 80% of review comments before a human ever sees the code.

---

## Maintenance

| Cadence | Task |
|---------|------|
| Every PR | Check if CLAUDE.md needs updating for new patterns |
| Monthly | Review shared skills and agents — are they still accurate? |
| Quarterly | Review `.claude/settings.json` permissions — too loose? Too tight? |
| When onboarding | Walk through this guide with the new dev |
