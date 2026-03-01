# Settings & Configuration

Think of Claude Code's settings like the Preferences panel in any app you use — your browser, your code editor, your email client. You open it once, set your preferences, and from then on the app behaves exactly the way you want without you having to re-explain yourself every time. Claude Code's `settings.json` works the same way: you define what commands Claude can run without asking, which files it should never touch, and how it should behave in your team's projects — and those rules apply automatically every time you open a session.

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

5. CLI flags            --model, --allowedTools, etc. (highest priority, session-only)
```

**Most developers use:**
- `~/.claude/settings.json` for personal preferences
- `.claude/settings.json` for project-specific settings (committed to git)
- `.claude/settings.local.json` for local overrides (not committed)

### Settings file paths by OS

| Level | macOS | Linux (Ubuntu) | Windows (WSL) |
|-------|-------|----------------|---------------|
| Enterprise policy | `/Library/Application Support/ClaudeCode/settings.json` | `/etc/claude-code/settings.json` | `C:\Program Files\ClaudeCode\settings.json` |
| User-wide | `~/.claude/settings.json` | `~/.claude/settings.json` | `~/.claude/settings.json` (inside WSL home) |
| Project | `.claude/settings.json` | `.claude/settings.json` | `.claude/settings.json` |
| Local override | `.claude/settings.local.json` | `.claude/settings.local.json` | `.claude/settings.local.json` |

### How to open your user settings

**macOS:**
```bash
# Create the directory if it doesn't exist, then open in your editor
mkdir -p ~/.claude && open -e ~/.claude/settings.json
# or with VS Code:
mkdir -p ~/.claude && code ~/.claude/settings.json
```

**Linux (Ubuntu):**
```bash
mkdir -p ~/.claude && nano ~/.claude/settings.json
# or with VS Code:
mkdir -p ~/.claude && code ~/.claude/settings.json
```

**Windows (WSL):**
```bash
mkdir -p ~/.claude && nano ~/.claude/settings.json
# To open in Windows Notepad from WSL:
mkdir -p ~/.claude && notepad.exe "$(wslpath -w ~/.claude/settings.json)"
```

---

## Settings Hierarchy (Which Settings Win)

When the same setting exists in multiple files, the more specific one wins. Think of it like CSS cascade — the most specific rule applies.

```
Priority (highest to lowest):
─────────────────────────────────────────────────────────────────────
5. CLI flags                        ← --model, --allowedTools, etc. (session-only)
         │  wins over
4. .claude/settings.local.json      ← YOU (local overrides, not committed)
         │  wins over
3. .claude/settings.json            ← PROJECT TEAM (committed to repo)
         │  wins over
2. ~/.claude/settings.json          ← YOU (all your projects)
         │  wins over
1. /etc/claude-code/settings.json   ← ENTERPRISE ADMIN (everyone)
─────────────────────────────────────────────────────────────────────

Example: If enterprise policy denies "Bash(sudo *)",
         no user or project setting can override that.

         If project settings allow "Bash(npm *)",
         you can still override it locally in settings.local.json
         without affecting your teammates.
```

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
    "ask": [
      "Bash(git push *)"       // Always prompt before pushing
    ],
    "deny": [
      "Bash(rm -rf *)",        // Block dangerous deletions
      "Bash(sudo *)",          // Block sudo commands
      "Write(.env*)"           // Block editing .env files
    ],
    "defaultMode": "normal",   // "normal", "plan", or "auto-accept"
    "additionalDirectories": [ // Extra directories Claude can access
      "../shared-lib"
    ]
  },

  // ── Model ──────────────────────────────────────────────────────
  "model": "claude-sonnet-4-6",       // Default model for this scope
  "availableModels": [                 // Restrict which models users can pick
    "claude-sonnet-4-6",
    "claude-haiku-4-5-20251001"
  ],

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

  // ── Environment Variables ──────────────────────────────────────
  "env": {
    "NODE_ENV": "development",         // Set env vars for every session
    "MY_CUSTOM_VAR": "value"
  },

  // ── Language & Attribution ─────────────────────────────────────
  "language": "en",                    // Preferred response language
  "attribution": {
    "gitAuthorName": "Claude Code",    // Name in git commits
    "gitAuthorEmail": "noreply@example.com"
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

## Starter Settings for a New Developer

If you're just getting started with Claude Code, here's a solid settings file that gives Claude useful freedoms without opening security risks. Copy this to `~/.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(yarn *)",
      "Bash(npx *)",
      "Read(*)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(grep *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo rm *)",
      "Write(.env*)",
      "Write(*.pem)",
      "Write(*.key)"
    ],
    "defaultMode": "normal"
  },
  "autoMemoryEnabled": true,
  "cleanupPeriodDays": 30
}
```

**What this does:**
- Lets Claude run git, npm, yarn, and basic shell commands without asking each time
- Lets Claude read any file freely (it can't do much without this)
- Blocks Claude from deleting things recursively or editing your secrets files
- Keeps normal mode (Claude still asks before anything risky)
- Enables memory so Claude remembers things between sessions

**macOS:**
```bash
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm *)", "Bash(yarn *)", "Read(*)"],
    "deny": ["Bash(rm -rf *)", "Write(.env*)"],
    "defaultMode": "normal"
  },
  "autoMemoryEnabled": true
}
EOF
```

**Linux (Ubuntu):**
```bash
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm *)", "Bash(yarn *)", "Read(*)"],
    "deny": ["Bash(rm -rf *)", "Write(.env*)"],
    "defaultMode": "normal"
  },
  "autoMemoryEnabled": true
}
EOF
```

**Windows (WSL):**
```bash
mkdir -p ~/.claude
cat > ~/.claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": ["Bash(git *)", "Bash(npm *)", "Bash(yarn *)", "Read(*)"],
    "deny": ["Bash(rm -rf *)", "Write(.env*)"],
    "defaultMode": "normal"
  },
  "autoMemoryEnabled": true
}
EOF
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

Environment variables let you configure Claude Code without editing files. They're also useful for setting per-session options that you don't want saved permanently.

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

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_EFFORT_LEVEL=high claude
```

**Windows (WSL):**
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

**macOS (add to ~/.zshrc):**
```bash
echo 'export CLAUDE_ENV_FILE=~/.claude/env' >> ~/.zshrc
source ~/.zshrc
```

**Linux (Ubuntu) (add to ~/.bashrc):**
```bash
echo 'export CLAUDE_ENV_FILE=~/.claude/env' >> ~/.bashrc
source ~/.bashrc
```

**Windows (WSL) (add to ~/.bashrc):**
```bash
echo 'export CLAUDE_ENV_FILE=~/.claude/env' >> ~/.bashrc
source ~/.bashrc
```

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

**When to use:** In automated pipelines where there's no human to approve prompts. `auto-accept` lets Claude execute everything without pausing.

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

**When to use:** When you want Claude to analyze and explain code, but you absolutely don't want it making any changes. Useful for security audits or getting a second opinion.

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

---

## Troubleshooting: My Settings Aren't Being Applied

If Claude keeps prompting for permissions you thought you allowed, or isn't using the settings you configured, here's how to diagnose it:

**1. Check which settings file is being read**

Run this inside a Claude session:

```
> /settings
```

This shows the merged effective settings — what Claude is actually using.

**2. Verify JSON is valid**

Invalid JSON silently causes the file to be ignored.

**macOS / Linux (Ubuntu):**
```bash
cat ~/.claude/settings.json | python3 -m json.tool
# If it prints the JSON back, it's valid.
# If it shows an error, find and fix the JSON syntax issue.
```

**Windows (WSL):**
```bash
cat ~/.claude/settings.json | python3 -m json.tool
```

**3. Check file permissions**

The settings file must be readable by your user.

**macOS / Linux (Ubuntu):**
```bash
ls -la ~/.claude/settings.json
# Should show something like: -rw-r--r-- 1 yourname yourname
chmod 644 ~/.claude/settings.json  # Fix if needed
```

**4. Confirm you're editing the right file**

If you have both `~/.claude/settings.json` (user) and `.claude/settings.json` (project), the project one wins. Make sure you're editing whichever applies.

**5. Restart Claude after changes**

Settings are read at startup. Changes to `settings.json` take effect next time you run `claude`.
