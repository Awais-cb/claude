# Settings & Configuration

Claude Code is configured through `settings.json` files and environment variables. This covers every available option.

---

## Settings File Locations

Settings are loaded in this order (later entries override earlier ones):

```
1. Managed policy       /etc/claude-code/settings.json (Linux)
                        /Library/Application Support/ClaudeCode/settings.json (macOS)
                        C:\Program Files\ClaudeCode\settings.json (Windows)

2. User settings        ~/.claude/settings.json

3. Project settings     .claude/settings.json

4. Local settings       .claude/settings.local.json  ← add to .gitignore
```

**Most developers use:**
- `~/.claude/settings.json` for personal preferences
- `.claude/settings.json` for project-specific settings (committed to git)
- `.claude/settings.local.json` for local overrides (not committed)

---

## Full Settings Reference

```json
{
  // ── Permissions ────────────────────────────────────────────────
  "permissions": {
    "allow": [
      "Bash(git *)",           // Auto-approve all git commands
      "Bash(npm test)",        // Auto-approve test runs
      "Read(*)",               // Auto-approve all file reads
      "Write(src/*)"           // Auto-approve writes in src/
    ],
    "deny": [
      "Bash(rm -rf *)",        // Block dangerous deletions
      "Bash(sudo *)",          // Block sudo commands
      "Write(.env*)"           // Block editing .env files
    ],
    "defaultMode": "normal"    // "normal", "plan", or "auto-accept"
  },

  // ── Hooks ──────────────────────────────────────────────────────
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
      }
    ],
    "Notification": [
      {
        "command": "osascript -e 'display notification \"Claude needs you\" with title \"Claude Code\"'"
      }
    ]
  },

  // ── Model & Behavior ───────────────────────────────────────────
  "alwaysThinkingEnabled": false,     // Extended thinking on by default
  "fastMode": false,                   // Fast mode on by default

  // ── Memory ─────────────────────────────────────────────────────
  "autoMemoryEnabled": true,           // Auto-save memories between sessions

  // ── CLAUDE.md ──────────────────────────────────────────────────
  "claudeMdExcludes": [
    "node_modules/*",                  // Skip CLAUDE.md files in these paths
    "vendor/*"
  ],

  // ── Plugins ────────────────────────────────────────────────────
  "enabledPlugins": [
    "my-plugin"
  ],
  "extraKnownMarketplaces": [
    "https://github.com/my-org/claude-plugins"
  ],
  "strictKnownMarketplaces": false,    // Only allow known marketplaces

  // ── Display ────────────────────────────────────────────────────
  "disableAllHooks": false,            // Disable all hooks globally

  // ── Session ────────────────────────────────────────────────────
  "cleanupPeriodDays": 30              // Auto-delete old sessions after N days
}
```

---

## Common Configuration Examples

### Developer workflow setup

```json
// ~/.claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(yarn *)",
      "Read(*)"
    ]
  },
  "alwaysThinkingEnabled": false,
  "autoMemoryEnabled": true
}
```

### Project-level setup (committed to repo)

```json
// .claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(php artisan *)",
      "Bash(composer *)",
      "Bash(npm run *)"
    ],
    "deny": [
      "Bash(php artisan migrate:fresh)",
      "Bash(php artisan migrate:rollback)",
      "Bash(php artisan db:seed)"
    ]
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "if [[ $CLAUDE_TOOL_INPUT_FILE_PATH == *.php ]]; then cd $CLAUDE_PROJECT_DIR && ./vendor/bin/pint \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null; fi"
      }
    ]
  }
}
```

### Team security setup

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "normal",
    "deny": [
      "Write(.env*)",
      "Write(config/secrets*)",
      "Bash(curl * | bash)",
      "Bash(wget * | sh)"
    ]
  }
}
```

---

## Environment Variables

Environment variables let you configure Claude Code without editing files.

### Key Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `CLAUDE_CODE_EFFORT_LEVEL` | Thinking effort: `low`, `medium`, `high` |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | Set to `true` to disable auto-memory |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | Set to `true` to disable fast mode |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | Context % before auto-compaction (default: 95) |
| `MAX_THINKING_TOKENS` | Cap on thinking token budget |
| `CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING` | Use fixed thinking budget (not dynamic) |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | Disable background task execution |
| `CLAUDE_CODE_TASK_LIST_ID` | Directory path for shared task lists |
| `CLAUDE_ENV_FILE` | Path to persistent env var file |
| `CLAUDE_CODE_SKILL_PATHS` | Extra directories to scan for skills |

### Example: Set thinking level for a session

```bash
CLAUDE_CODE_EFFORT_LEVEL=high claude
```

### Example: Persistent env vars

```bash
# Store in a file that Claude always loads
echo 'CLAUDE_CODE_EFFORT_LEVEL=high' >> ~/.claude/env
```

Then set:
```bash
CLAUDE_ENV_FILE=~/.claude/env claude
```

Or add `CLAUDE_ENV_FILE` to your shell profile.

---

## Settings for Specific Use Cases

### CI/CD (GitHub Actions)

```json
{
  "permissions": {
    "defaultMode": "auto-accept"
  },
  "autoMemoryEnabled": false,
  "cleanupPeriodDays": 1
}
```

### Security-conscious team

```json
{
  "permissions": {
    "defaultMode": "normal",
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(chmod *)",
      "Write(.env*)",
      "Write(*.pem)",
      "Write(*.key)"
    ]
  },
  "disableAllHooks": false
}
```

### Read-only code review

```json
{
  "permissions": {
    "defaultMode": "plan",
    "allow": ["Read(*)", "Glob(*)", "Grep(*)"],
    "deny": ["Write(*)", "Edit(*)", "Bash(*)"]
  }
}
```

---

## Editing Settings

### From inside a session

```
> /config
> /settings
```

### From the command line

```bash
# View current settings
cat ~/.claude/settings.json

# Edit with your editor
$EDITOR ~/.claude/settings.json
```

### Create settings interactively

```bash
claude --init
```

Runs an interactive setup wizard.

---

## Managed Policy (Enterprise)

Admins can set organization-wide policies that users can't override:

```
/Library/Application Support/ClaudeCode/settings.json  # macOS
/etc/claude-code/settings.json                         # Linux
```

Managed settings take precedence over all user/project settings. Use this to enforce security policies across a team.
