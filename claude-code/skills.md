# Skills — Custom Slash Commands

Think of skills like keyboard macros or TextExpander shortcuts. Instead of typing out a long, repetitive set of instructions every time you want Claude to do something, you define it once as a skill — and then trigger it with a short `/command`. One short command, full workflow.

For example, instead of typing "Please review my code for security issues, check for hardcoded credentials, validate all SQL queries use parameterized inputs, and check that authentication is required on protected routes" every time, you create a `/security-check` skill and just type that.

Skills are markdown files with instructions. When you type `/skill-name`, Claude loads and executes those instructions as if you had written them out in full.

Think of skills as reusable macros or playbooks for things you do repeatedly.

![The /skills list view showing available commands](./images/skills-list.png)
> *What to expect: Typing `/skills` opens a list of all available skills with their names and descriptions. Built-in skills appear alongside any custom ones you've created. You can tab-complete skill names when typing `/` in your session.*

---

## Built-in Skills

Claude Code ships with several built-in skills:

| Command | What it does |
|---------|-------------|
| `/simplify` | Review recently changed code for quality and efficiency |
| `/review` | Review a pull request for quality, correctness, security |
| `/security-review` | Analyze branch changes for security vulnerabilities |
| `/debug` | Debug the current session using debug logs |
| `/batch` | Execute a large-scale change across multiple worktrees |
| `/pr-comments` | Fetch and display GitHub PR comments |
| `/commit-push-pr` | Commit changes, push, and create a PR |

---

## Creating a Custom Skill

### 1. Create the skill directory and file

Each skill lives in its own **directory** with a `SKILL.md` file inside it — not a standalone `.md` file.

**macOS / Linux (Ubuntu):**
```bash
# User-level: available in all your projects
mkdir -p ~/.claude/skills/my-skill
# then create ~/.claude/skills/my-skill/SKILL.md

# Project-level: only for the current project
mkdir -p .claude/skills/my-skill
# then create .claude/skills/my-skill/SKILL.md
```

**Windows (WSL):**
```bash
# User-level
mkdir -p ~/.claude/skills/my-skill

# Project-level
mkdir -p .claude/skills/my-skill
```

**Windows (native path):**
```
# User-level
%USERPROFILE%\.claude\skills\my-skill\SKILL.md

# Project-level
.claude\skills\my-skill\SKILL.md
```

The resulting structure looks like this:

```
~/.claude/skills/
└── my-skill/
    └── SKILL.md      ← required
```

> **Common mistake:** Creating `~/.claude/skills/my-skill.md` (flat file) instead of `~/.claude/skills/my-skill/SKILL.md` (directory + file). The flat file will not appear in `/skills`.

### 2. Add frontmatter + instructions to `SKILL.md`

```markdown
---
name: test-coverage
description: Run tests and report which files lack coverage
---

Run the test suite with coverage enabled, then analyze the output to find
files with less than 80% coverage. Report them sorted by coverage percentage
(lowest first) with specific suggestions for what tests to add.

Commands to use:
- `npm test -- --coverage`
- Parse the coverage output from the terminal
```

### 3. Invoke it

```
> /test-coverage
```

---

## Create Your First Skill in 5 Minutes

Here's a complete beginner walkthrough. We'll create a `/standup` skill that generates a daily standup summary from your recent git activity.

**Step 1: Create the skill directory**

**macOS / Linux (Ubuntu):**
```bash
mkdir -p ~/.claude/skills/standup
```

**Windows (WSL):**
```bash
mkdir -p ~/.claude/skills/standup
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\skills\standup" -Force
```

**Step 2: Create the SKILL.md file**

**macOS / Linux (Ubuntu):**
```bash
nano ~/.claude/skills/standup/SKILL.md
```

**Windows (WSL):**
```bash
nano ~/.claude/skills/standup/SKILL.md
```

**Windows (PowerShell):**
```powershell
notepad "$env:USERPROFILE\.claude\skills\standup\SKILL.md"
```

**Step 3: Write the skill**

```markdown
---
name: standup
description: Generate a daily standup summary from recent git activity
---

Generate my daily standup report by:

1. Running `git log --oneline --since="yesterday" --author="$(git config user.name)"`
2. Looking at which files were changed with `git diff --name-only HEAD~5..HEAD`
3. Summarizing in the classic standup format:

## Yesterday
[What was completed based on commits]

## Today
[What's in progress or next logical step based on recent changes]

## Blockers
[Any TODO comments added recently, or note "None identified"]

Keep it brief — 3-5 bullet points per section max. Friendly, casual tone.
```

**Step 4: Use it**

```
> /standup
```

That's it. Claude reads your git history and generates a ready-to-paste standup summary.

---

## Skill File Format

Each skill is a **directory** containing a `SKILL.md` file:

```
~/.claude/skills/
└── skill-name/
    ├── SKILL.md          ← required
    ├── scripts/          ← optional: helper scripts
    ├── references/       ← optional: docs loaded as needed
    └── assets/           ← optional: templates, icons, etc.
```

The `SKILL.md` file uses YAML frontmatter followed by instructions:

```markdown
---
name: skill-name              # Used as /skill-name command
description: What this does   # Shown in /skills list
trigger: specific phrase      # Optional: Claude auto-invokes when it sees this
---

Your instructions go here.

Be as detailed as needed.
Include example workflows.
Specify which tools to use.
```

---

## Practical Skill Examples

### Example 1: Changelog generator

```markdown
---
name: changelog
description: Generate a changelog entry from recent git commits
---

Generate a changelog entry for the changes since the last git tag.

1. Run `git log --oneline $(git describe --tags --abbrev=0)..HEAD`
2. Group commits by type (feat, fix, refactor, docs, etc.)
3. Write a user-friendly changelog entry in Keep a Changelog format
4. Output it ready to paste into CHANGELOG.md
```

**Usage:**
```
> /changelog
```

---

### Example 2: Code review checklist

```markdown
---
name: checklist
description: Review code against our team's standard checklist
---

Review the recently changed files against this checklist:

## Security
- [ ] No hardcoded credentials or secrets
- [ ] User input is validated and sanitized
- [ ] SQL queries use parameterized inputs
- [ ] Authentication is required where needed

## Code Quality
- [ ] No functions longer than 50 lines
- [ ] No duplicated code (DRY)
- [ ] Error cases are handled
- [ ] No `console.log` statements left in

## Tests
- [ ] New functions have unit tests
- [ ] Edge cases are covered
- [ ] Test names clearly describe what they test

Report each item as PASS, FAIL, or N/A with a brief explanation.
```

**Usage:**
```
> /checklist
```

---

### Example 3: Database migration helper

```markdown
---
name: migration
description: Create a new database migration with rollback
---

Create a new database migration file for the described change.

1. Ask me what the migration should do (if not already stated)
2. Create the migration file in `database/migrations/`
3. Use the correct timestamp format: YYYY_MM_DD_HHMMSS_description.php
4. Include both `up()` and `down()` methods
5. Follow existing migration conventions in the project
6. After creating, run `php artisan migrate` to apply it

If the migration involves a new table, also create the corresponding Model.
```

**Usage:**
```
> /migration add user preferences table
```

---

### Example 4: Auto-documentation

```markdown
---
name: document
description: Add JSDoc/docstring comments to undocumented functions
---

Find all functions in the specified file (or recently changed files) that
lack documentation comments.

For each undocumented function:
1. Read the function body to understand what it does
2. Add a JSDoc comment (for JS/TS) or docstring (for Python)
3. Include: description, @param with types, @returns, @throws if applicable
4. Keep it concise — one line description + params is enough

Don't change the function code, only add documentation.
```

**Usage:**
```
> /document src/utils/helpers.js
```

---

### Example 5: Environment setup check (practical for new teammates)

```markdown
---
name: env-check
description: Verify the development environment is correctly configured
---

Check that the development environment is set up correctly:

1. Run `node --version` and verify it's >= 18.0.0
2. Run `npm --version` and verify it's >= 9.0.0
3. Check that `.env` exists (don't read it, just confirm it's present)
4. Run `npm install` and report if there are any errors
5. Run the test suite with `npm test` and report pass/fail count
6. Check if the database is reachable (if applicable to this project)

Report a clear PASS/FAIL for each step with the actual version numbers found.
Suggest fixes for anything that fails.
```

**Usage (great to run when onboarding to a new project):**
```
> /env-check
```

---

### Example 6: PR description writer

```markdown
---
name: pr-description
description: Generate a pull request description from recent commits and changes
---

Write a pull request description for the current branch.

1. Run `git log --oneline main..HEAD` to see all commits on this branch
2. Run `git diff --stat main..HEAD` to see which files changed
3. Read the most significantly changed files to understand the changes
4. Write a PR description with:
   - A one-sentence summary of what this PR does
   - A "Why" section explaining the motivation
   - A "What changed" section with bullet points for each significant change
   - A "How to test" section with specific steps for a reviewer
   - Any breaking changes or migration steps needed

Keep it factual and specific — avoid vague language like "various improvements".
```

**Usage:**
```
> /pr-description
```

---

## Skill Configuration Options

### `trigger` — Auto-invocation

Claude loads the skill automatically when it detects the trigger pattern:

```markdown
---
name: api-conventions
description: Project API design standards
trigger: api endpoint
---

When creating or modifying API endpoints, follow these conventions:
- Use plural nouns for collections: `/users`, `/orders`
- Use HTTP methods correctly: GET (read), POST (create), PUT (replace), PATCH (update), DELETE
- Return consistent response shapes: `{ data, error, meta }`
...
```

Now whenever you mention "api endpoint", Claude automatically applies these conventions.

### `disable-model-invocation` — Hidden skills

Skills with this flag are only invoked when explicitly called, not available to Claude as context:

```markdown
---
name: internal-notes
description: Internal team notes
disable-model-invocation: true
---
```

### `context: fork` — Run in isolation

Runs the skill in a separate subagent context:

```markdown
---
name: experiment
description: Try a risky approach in isolation
context: fork
---
```

---

## Organizing Skills

Each skill is a directory containing a `SKILL.md`. You can group related skills under subdirectories:

```
.claude/skills/
├── review/
│   ├── code-review/
│   │   └── SKILL.md
│   ├── security-review/
│   │   └── SKILL.md
│   └── performance-review/
│       └── SKILL.md
├── docs/
│   ├── changelog/
│   │   └── SKILL.md
│   └── readme-update/
│       └── SKILL.md
└── testing/
    ├── test-coverage/
    │   └── SKILL.md
    └── integration-tests/
        └── SKILL.md
```

All skills are discovered automatically regardless of nesting depth.

**Suggested organization for beginners:**
- Put personal workflow shortcuts in `~/.claude/skills/` (user-level)
- Put team/project standards in `.claude/skills/` (project-level, commit to git so teammates get them too)

---

## Viewing Available Skills

```
> /skills
```

Lists all available skills with their descriptions. Tab completion works — type `/` and press Tab to see all available skills.

---

## Sharing Skills via Plugins

Skills can be packaged and distributed as plugins. See [plugins documentation](#) for details on creating and sharing skill packages.

---

## Tips

- **Keep skills focused** — one skill, one purpose
- **Include examples** in the skill description for complex workflows
- **Use `trigger`** for conventions you always want applied (style guides, naming rules)
- **Project skills** for team standards, **user skills** for personal preferences
- Invoke with `/skill-name` — tab completion works for skills too
