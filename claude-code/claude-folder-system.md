# The `.claude` Folder System

Claude Code uses a layered folder system to let you configure behavior at three distinct levels: your whole machine, a specific project, and personal overrides within a project. Think of it like CSS inheritance — more specific levels override broader ones, and each level serves a different purpose.

Understanding this system means you can write an instruction once and have it apply everywhere it's relevant, share team settings without exposing personal preferences, and lock down behavior for your whole organisation without touching individual projects.

---

## The Three Levels at a Glance

```
/etc/claude-code/              ← System-wide  (managed by IT/admin, highest priority)
~/.claude/                     ← User-wide    (your personal config, all projects)
your-project/.claude/          ← Project      (team-shared, committed to git)
your-project/CLAUDE.local.md   ← Local        (your personal project overrides, not committed)
```

When the same setting exists at multiple levels, this priority order decides which wins:

```
Priority (highest → lowest):
──────────────────────────────────────────────────────────────────
1. Managed policy   /etc/claude-code/  or  C:\Program Files\ClaudeCode\
         │  wins over
2. Local override   .claude/settings.local.json  (you, this repo only)
         │  wins over
3. Project          .claude/settings.json  (whole team, committed)
         │  wins over
4. User-wide        ~/.claude/settings.json  (you, all projects)
```

---

## Full Feature Map by Level

| Feature | System (managed) | User `~/.claude/` | Project `.claude/` | Local |
|---------|:----------------:|:-----------------:|:------------------:|:-----:|
| Settings (`settings.json`) | `managed-settings.json` | `settings.json` | `settings.json` | `settings.local.json` |
| Project instructions | `CLAUDE.md` | `CLAUDE.md` | `CLAUDE.md` or `../CLAUDE.md` | `../CLAUDE.local.md` |
| Scoped rules | — | `rules/` | `rules/` | — |
| Hooks | via `managed-settings.json` | via `settings.json` | via `settings.json` | via `settings.local.json` |
| MCP servers | `managed-mcp.json` | `~/.claude.json` | `.mcp.json` | `~/.claude.json` (per-project) |
| Skills / commands | via managed settings | `skills/` | `skills/` | — |
| Subagents | — | `agents/` | `agents/` | — |
| Auto memory | — | `projects/<repo>/memory/` | — | — |
| Permissions | via `managed-settings.json` | via `settings.json` | via `settings.json` | via `settings.local.json` |

---

## System Level (Managed Policy)

The system level is for organisations that need to enforce configuration across all developer machines. These files are deployed by IT/DevOps using MDM, Group Policy, Ansible, or similar tools. Individual users cannot override them.

### File paths

| OS | Directory |
|----|-----------|
| macOS | `/Library/Application Support/ClaudeCode/` |
| Linux / WSL | `/etc/claude-code/` |
| Windows | `C:\Program Files\ClaudeCode\` |

### What lives here

**`managed-settings.json`** — organisation-wide settings that no user can override. Everything in the regular `settings.json` format is valid here: permissions, hooks, allowed tools, environment variables.

```json
{
  "permissions": {
    "deny": ["Bash(rm -rf *)"]
  },
  "env": {
    "CLAUDE_DISABLE_TELEMETRY": "1"
  }
}
```

**`managed-mcp.json`** — a fixed list of MCP servers. When this file exists, users cannot add, modify, or remove any MCP server. It uses the same format as `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```

**`CLAUDE.md`** — organisation-wide instructions that load in every session and cannot be excluded by any user-level setting. Use it for company coding standards, security policies, or compliance requirements.

> **Who this is for:** Platform/DevOps teams rolling out Claude Code across an engineering org. Individual developers don't create files here.

---

## User Level (`~/.claude/`)

The user level lives in your home directory and applies to every project you open — your personal defaults that follow you everywhere. Nothing here is committed to a repo, so it stays private.

```
~/.claude/
├── settings.json           # Your personal settings for all projects
├── CLAUDE.md               # Instructions that apply across all your projects
├── rules/                  # Personal rules loaded in every session
│   ├── preferences.md
│   └── workflows.md
├── skills/                 # Personal custom commands available everywhere
│   └── my-skill/
│       └── SKILL.md
├── agents/                 # Personal custom subagent definitions
│   └── my-agent.md
└── projects/               # Auto memory, one folder per git repo
    └── my-project/
        └── memory/
            ├── MEMORY.md
            └── debugging.md
```

### `~/.claude/settings.json`

Your personal defaults. Good place for theme preferences, editor settings, and tools you always want available:

```json
{
  "theme": "dark",
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allow": ["Bash(git *)"]
  }
}
```

### `~/.claude/CLAUDE.md`

Instructions Claude reads at the start of every session across all your projects. Useful for personal coding style preferences, shortcuts, or workflows that aren't project-specific:

```markdown
# My Preferences

- Always prefer functional patterns over classes when both work
- When writing tests, use the Arrange/Act/Assert pattern
- My local dev server runs on port 3000
```

### `~/.claude/rules/`

Personal rules that load in every session. Unlike the main CLAUDE.md, rules can be scoped to specific file types using YAML frontmatter:

```markdown
---
paths:
  - "**/*.test.ts"
---

# My Testing Preferences

- Use `describe`/`it` blocks, not `test()`
- Always assert on the specific value, not just `toBeTruthy()`
```

Rules without a `paths` field load unconditionally. Rules in subdirectories are discovered recursively.

### `~/.claude/skills/`

Personal custom `/commands` available in every project. Each skill is a directory containing a `SKILL.md`:

```
~/.claude/skills/
├── explain-code/
│   └── SKILL.md        → /explain-code command
└── daily-standup/
    └── SKILL.md        → /daily-standup command
```

### `~/.claude/agents/`

Personal subagent definitions available in every project. Each agent is a markdown file:

```
~/.claude/agents/
└── reviewer.md         → an agent Claude can spawn for code reviews
```

### `~/.claude/projects/<repo>/memory/`

Auto memory is stored here — notes Claude writes for itself as it works with you. Each git repository gets its own subdirectory, so memories don't bleed across projects.

```
~/.claude/projects/my-project/memory/
├── MEMORY.md           # Concise index (first 200 lines loaded each session)
├── debugging.md        # Detailed debugging notes
└── api-conventions.md  # API design patterns Claude observed
```

You never need to create these files manually. Claude manages them automatically. The `/memory` command lets you browse what's been saved.

---

## Project Level (`.claude/`)

The project `.claude/` directory lives at the root of your repository and gets committed to git. It's shared with your whole team and defines how Claude behaves for anyone working on that project.

```
your-project/
├── CLAUDE.md               # Team-shared project instructions (alternative to .claude/CLAUDE.md)
├── CLAUDE.local.md         # Your personal overrides (add to .gitignore)
├── .mcp.json               # Team-shared MCP server list
└── .claude/
    ├── settings.json       # Team-shared project settings
    ├── settings.local.json # Your personal local overrides
    ├── CLAUDE.md           # Alternative location for project instructions
    ├── rules/              # Scoped instruction files
    │   ├── testing.md
    │   ├── api-design.md
    │   └── security.md
    ├── skills/             # Project-specific custom commands
    │   └── deploy/
    │       └── SKILL.md
    └── agents/             # Project-specific subagent definitions
        └── reviewer.md
```

### `.claude/settings.json`

Settings that apply to everyone on the team. Commit this file to version control:

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)"],
    "deny": ["Bash(npm publish)"]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npm run lint --fix" }]
      }
    ]
  }
}
```

### `CLAUDE.md` or `.claude/CLAUDE.md`

Project instructions shared with the whole team. Both locations work identically — use whichever fits your project structure. Run `/init` to auto-generate a starting file from your codebase.

Common things to include:
- Build and test commands
- Project architecture overview
- Coding standards and naming conventions
- Which patterns to use or avoid
- Common workflows (how to add a feature, run migrations, etc.)

```markdown
# My Project

## Commands
- `npm run dev` — start dev server on port 5173
- `npm test` — run the test suite
- `npm run build` — production build

## Architecture
- Routes → Controllers → Services → Models
- Services return `Result<T, Error>` — never throw for business logic
- All DB queries go through the repository layer in `src/repositories/`
```

### `.claude/rules/`

Modular instruction files for larger projects. Split your instructions by topic and optionally scope them to specific file types:

```
.claude/rules/
├── code-style.md       # General style (no paths, always loads)
├── testing.md          # Test conventions (no paths, always loads)
├── api-handlers.md     # Scoped to src/api/**/*.ts
└── migrations.md       # Scoped to database/migrations/**/*.ts
```

Example of a path-scoped rule:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Handler Rules

- Every handler must validate request input before processing
- Use the standard `{ success, data, error }` response envelope
- Log all 4xx and 5xx responses with request ID
```

> **Tip:** Path-scoped rules only load into context when Claude works with matching files, saving context space compared to loading everything at once.

### `.mcp.json`

Team-shared MCP server configuration, committed to git. This file is created automatically when you run `claude mcp add --scope project`:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "database": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@bytebase/dbhub", "--dsn", "${DATABASE_URL}"]
    }
  }
}
```

Claude Code prompts for approval before using project-scoped MCP servers from `.mcp.json` for security. Use `${ENV_VAR}` syntax to reference environment variables so secrets stay out of the file.

### `.claude/skills/`

Project-specific custom `/commands`. Only available when working in this repo:

```
.claude/skills/
├── deploy/
│   └── SKILL.md        → /deploy
├── review-pr/
│   └── SKILL.md        → /review-pr
└── seed-db/
    └── SKILL.md        → /seed-db
```

### `.claude/agents/`

Project-specific subagent definitions for specialised tasks:

```
.claude/agents/
├── backend-reviewer.md     → reviews backend code against project patterns
└── migration-writer.md     → writes database migrations following project conventions
```

---

## Local Overrides

Two mechanisms let you have personal project-specific config that's not committed to git.

### `CLAUDE.local.md`

Personal instructions for a specific project. Automatically excluded from git (Claude adds it to `.gitignore`). Use it for sandbox URLs, personal test data, or anything you don't want to share:

```markdown
# My Local Notes

- My local DB is on port 5433 (not the default 5432)
- Test account: dev@example.com / password123
- My local dev API key is in ~/.env.local
```

### `.claude/settings.local.json`

Personal project settings that override the committed `.claude/settings.json` without changing it:

```json
{
  "permissions": {
    "allow": ["Bash(docker *)"]
  },
  "claudeMdExcludes": [
    "**/legacy-service/CLAUDE.md"
  ]
}
```

> **Always add `.claude/settings.local.json` and `CLAUDE.local.md` to your `.gitignore`.**

---

## How Each Feature Resolves Across Levels

### Settings

The most specific level wins for scalar values. For arrays (permission lists, allowed domains), values **merge** across all levels — so a permission allowed at user level stays allowed even if the project settings don't mention it.

```
Managed → cannot be overridden by anyone
Local   → overrides Project
Project → overrides User
User    → baseline defaults
```

### CLAUDE.md Files

All CLAUDE.md files in the hierarchy load — they don't override each other, they stack. Claude reads the managed policy file, your user-level file, the project file, and any local file, combining them all as context.

More specific files take precedence when instructions conflict.

### Skills

When skills share the same name at multiple levels, the higher-priority location wins:

```
Managed → Enterprise (overrides all)
User    → Personal  (~/.claude/skills/)
Project → Team      (.claude/skills/)
```

Plugin skills use a `plugin-name:skill-name` namespace and never conflict with the above.

### MCP Servers

When servers with the same name exist at multiple scopes, local takes precedence over project, which takes precedence over user:

```
Managed  (managed-mcp.json)    → exclusive control, users cannot add servers
Local    (~/.claude.json)       → your override for this project
Project  (.mcp.json)            → team-shared
User     (~/.claude.json)       → your personal servers, all projects
```

### Hooks

Hooks are defined inside `settings.json` at any level. They don't merge — the most specific level's hooks for a given event take effect. User-level hooks run for all projects unless the project defines hooks for the same event.

---

## Quick Reference: What to Put Where

| What you want to configure | Where to put it |
|---------------------------|-----------------|
| Company coding standards enforced everywhere | System: `managed-settings.json` + `CLAUDE.md` |
| Your personal code style across all projects | User: `~/.claude/CLAUDE.md` |
| Team-shared project architecture notes | Project: `CLAUDE.md` |
| Your personal sandbox URLs and test data | Local: `CLAUDE.local.md` |
| Allow a tool for all your projects | User: `~/.claude/settings.json` → `permissions.allow` |
| Restrict a tool for the whole team | Project: `.claude/settings.json` → `permissions.deny` |
| Auto-format on every file edit (team) | Project: `.claude/settings.json` → `hooks` |
| Your preferred model | User: `~/.claude/settings.json` → `model` |
| Connect to a shared team database | Project: `.mcp.json` |
| Connect to a personal API you use everywhere | User scope: `claude mcp add --scope user ...` |
| A `/deploy` command for the team | Project: `.claude/skills/deploy/SKILL.md` |
| A `/my-review` command just for you | User: `~/.claude/skills/my-review/SKILL.md` |
| Rules for API files only | Project: `.claude/rules/api.md` with `paths:` frontmatter |

---

## Practical Setup for a New Project

Here's a typical setup when starting a project:

```bash
# 1. Generate a starting CLAUDE.md from your codebase
claude "/init"

# 2. Add team MCP servers to .mcp.json
claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/

# 3. Create a project settings file
cat > .claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": ["Bash(npm run *)"]
  }
}
EOF

# 4. Add local overrides file to .gitignore
echo "CLAUDE.local.md" >> .gitignore
echo ".claude/settings.local.json" >> .gitignore

# 5. Create your personal local instructions
cat > CLAUDE.local.md << 'EOF'
# My Local Notes
- Local DB on port 5433
- Dev server: http://localhost:3001
EOF
```

---

## Related Docs

- [claude-md.md](claude-md.md) — writing effective CLAUDE.md files
- [settings.md](settings.md) — full settings reference
- [hooks.md](hooks.md) — automating workflows with hooks
- [mcp-servers.md](mcp-servers.md) — connecting Claude to external tools
- [skills.md](skills.md) — building custom `/commands`
- [memory-system.md](memory-system.md) — auto memory and MEMORY.md
- [permissions.md](permissions.md) — controlling what Claude can do
