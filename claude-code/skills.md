# Skills — Custom Slash Commands

Skills let you create your own `/commands` in Claude Code. A skill is a markdown file with instructions — when you type `/skill-name`, Claude loads and executes those instructions.

Think of skills as reusable macros or playbooks for things you do repeatedly.

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

### 1. Create the skill file

```bash
# User-level (all projects)
~/.claude/skills/my-skill.md

# Project-level (this project only)
.claude/skills/my-skill.md
```

### 2. Add frontmatter + instructions

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

## Skill File Format

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

You can organize skills into subdirectories:

```
.claude/skills/
├── review/
│   ├── code-review.md
│   ├── security-review.md
│   └── performance-review.md
├── docs/
│   ├── changelog.md
│   └── readme-update.md
└── testing/
    ├── test-coverage.md
    └── integration-tests.md
```

All skills are discovered automatically regardless of nesting.

---

## Viewing Available Skills

```
> /skills
```

Lists all available skills with their descriptions.

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
