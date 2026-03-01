# Settings and Configuration

Claude Code's behavior in VS Code is controlled through settings files and environment variables. Settings apply at different scopes — user-wide, project-wide, or local-only — so teams can share project-level config while keeping personal preferences separate.

Think of it like a layered system: the bottom layer is system defaults, then your personal preferences sit on top, then project-wide team settings, and finally your private local overrides on the very top. Each layer can add to or override what's below it.

---

## Settings File Locations

Claude Code reads settings from four locations, in order of priority (lower number = higher priority):

| Priority | File | Scope |
|----------|------|-------|
| 1 (lowest) | `/etc/claude-code/settings.json` | System-wide (managed by IT/admin) |
| 2 | `~/.claude/settings.json` | Your user account (all projects) |
| 3 | `.claude/settings.json` | This project (shared with team via git) |
| 4 (highest) | `.claude/settings.local.json` | This project, local only (not committed) |

Higher-priority settings override lower-priority ones.

### OS-specific paths

**macOS / Linux / WSL:**

```
/etc/claude-code/settings.json          (system-wide)
~/.claude/settings.json                 (user-level)
/path/to/project/.claude/settings.json  (project-level)
/path/to/project/.claude/settings.local.json  (local override)
```

**Windows (native):**

```
C:\ProgramData\claude-code\settings.json              (system-wide)
%USERPROFILE%\.claude\settings.json                   (user-level)
C:\path\to\project\.claude\settings.json              (project-level)
C:\path\to\project\.claude\settings.local.json        (local override)
```

Which typically looks like:
```
C:\Users\YourName\.claude\settings.json
```

**Windows (WSL):**

Settings live in the WSL Linux filesystem:
```
~/.claude/settings.json                 (user-level, at /home/yourname/.claude/)
.claude/settings.json                   (project-level)
```

---

## Opening and Editing Settings

### From inside a session (recommended for beginners)

```
> /config
```

Opens a visual, interactive settings editor. Navigate with arrow keys, toggle options, and save — no JSON editing required.

```
> /settings
```

Opens `settings.json` directly in your `$EDITOR`.

![Visual config editor](./images/config-visual-editor.png)
> What to expect: The `/config` command opens a full-screen terminal UI showing all settings grouped by category. Use arrow keys to navigate, Space or Enter to toggle/change values, and follow the on-screen prompts to save. No JSON knowledge required.

### Manually via terminal or editor

**macOS / Linux / WSL:**
```bash
# User-level settings
code ~/.claude/settings.json

# Project-level settings
code .claude/settings.json
```

**Windows (PowerShell):**
```powershell
# User-level settings
code "$env:USERPROFILE\.claude\settings.json"

# Project-level settings
code .claude\settings.json
```

---

## Key Settings

### Permissions

Control what Claude is allowed to do without asking:

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Write(src/*)",
      "Bash(git *)",
      "Bash(npm test)",
      "Bash(npm run *)"
    ],
    "deny": [
      "Write(.env*)",
      "Write(secrets/*)",
      "Bash(rm -rf *)"
    ],
    "defaultMode": "acceptEdits"
  }
}
```

| Value for `defaultMode` | Meaning |
|------------------------|---------|
| *(unset)* | Ask mode — Claude asks before risky actions (default) |
| `"acceptEdits"` | Auto-approve file edits, ask for commands |
| `"bypassPermissions"` | Skip all prompts — auto-approve everything (use carefully) |
| `"plan"` | Plan-only — read-only, no modifications |

### Model preference

```json
{
  "model": "claude-opus-4-6"
}
```

Available models: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`

### Thinking mode

```json
{
  "alwaysThinkingEnabled": false
}
```

Set to `true` to always use extended thinking (slower but more thorough).

### Fast mode

Fast mode is not controlled by a settings key. To toggle it, use the `/fast` command inside a session, or set the environment variable `CLAUDE_CODE_DISABLE_FAST_MODE=true` to disable it system-wide.

### Auto-memory

```json
{
  "autoMemoryEnabled": true
}
```

Claude automatically extracts and saves key facts about your project to memory. Set to `false` to disable.

### Co-authorship in commits

Co-authorship attribution is configured via the `attribution` object:

```json
{
  "attribution": {
    "commit": true,
    "pr": true
  }
}
```

`attribution.commit` adds a `Co-Authored-By: Claude` line to commits Claude creates. `attribution.pr` adds a note to pull requests.

---

## Starter Settings by User Type

### Beginner (safe defaults, maximum guidance)

Save to `~/.claude/settings.json`:

```json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  },
  "model": "claude-sonnet-4-6",
  "autoMemoryEnabled": true,
  "attribution": {
    "commit": true,
    "pr": true
  }
}
```

This uses `acceptEdits` mode (Claude asks before running commands but auto-accepts file edits), a balanced model, and auto-memory to help Claude learn your project. Leave `defaultMode` unset entirely to use the default ask mode where Claude prompts before every action.

### Power user (speed-optimized for trusted personal projects)

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Write(src/*)",
      "Write(tests/*)",
      "Bash(npm *)",
      "Bash(git *)",
      "Bash(make *)"
    ],
    "deny": [
      "Write(.env*)",
      "Write(secrets/*)"
    ],
    "defaultMode": "acceptEdits"
  },
  "model": "claude-opus-4-6",
  "autoMemoryEnabled": true
}
```

Auto-accepts file edits, pre-approves common commands, but still protects sensitive files. To enable fast mode, use `/fast` inside a session or set `CLAUDE_CODE_DISABLE_FAST_MODE` in your environment.

### Team lead (shared project config)

Save to `.claude/settings.json` in your project root (commit this to git):

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Write(src/*)",
      "Write(tests/*)",
      "Write(docs/*)",
      "Bash(npm *)",
      "Bash(git *)",
      "Bash(php artisan *)"
    ],
    "deny": [
      "Write(.env*)",
      "Write(config/secrets*)",
      "Bash(rm -rf *)"
    ],
    "defaultMode": "acceptEdits"
  },
  "attribution": {
    "commit": true,
    "pr": true
  }
}
```

Each team member can add their personal preferences in `.claude/settings.local.json` (add this to `.gitignore`).

---

## Environment Variables

Set these in your shell profile or system environment. They override settings file values.

| Variable | Description | Example |
|----------|-------------|---------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) | `sk-ant-...` |
| `CLAUDE_CODE_EFFORT_LEVEL` | Thinking effort: `low`, `medium`, `high` | `medium` |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | Disable auto-memory | `true` |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | Disable fast mode | `true` |
| `ANTHROPIC_BASE_URL` | Custom API endpoint (for proxies) | `https://proxy.example.com` |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | Limit response length | `8000` |
| `EDITOR` | Editor for `/settings` and `Ctrl+G` | `vim`, `nano`, `code --wait` |

### Setting environment variables per OS

**macOS (add to `~/.zshrc`):**
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
export CLAUDE_CODE_EFFORT_LEVEL="high"
```

Then reload: `source ~/.zshrc`

**Linux / WSL (add to `~/.bashrc`):**
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
export CLAUDE_CODE_EFFORT_LEVEL="medium"
```

Then reload: `source ~/.bashrc`

**Windows (PowerShell — persistent across sessions):**
```powershell
[System.Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-your-key-here", "User")
```

Or add to your PowerShell profile (`$PROFILE`):
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-your-key-here"
```

**Windows (WSL):**
Same as Linux — add to `~/.bashrc`.

### Setting the API key for VS Code specifically

You can also set environment variables in `.env` at the project root (not committed to git). VS Code picks these up in the integrated terminal:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Add `.env` to your `.gitignore`:
```
.env
.claude/settings.local.json
```

---

## Project-Level Configuration (Team Setup)

Share settings with your team by committing `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Read(*)",
      "Write(src/*)",
      "Write(tests/*)",
      "Bash(npm *)",
      "Bash(git *)"
    ],
    "deny": [
      "Write(.env*)",
      "Write(config/secrets*)"
    ],
    "defaultMode": "acceptEdits"
  },
  "attribution": {
    "commit": true,
    "pr": true
  }
}
```

Keep personal preferences in `.claude/settings.local.json` (add to `.gitignore`):

```json
{
  "model": "claude-haiku-4-5-20251001"
}
```

---

## Keybindings Configuration

Edit `~/.claude/keybindings.json` to remap session shortcuts:

**macOS / Linux / WSL:**
```bash
code ~/.claude/keybindings.json
```

**Windows (PowerShell):**
```powershell
code "$env:USERPROFILE\.claude\keybindings.json"
```

Example keybindings:

```json
[
  {
    "command": "submit",
    "key": "ctrl+enter"
  },
  {
    "command": "new_line",
    "key": "enter"
  },
  {
    "command": "toggle_plan_mode",
    "key": "ctrl+p p"
  }
]
```

Edit from within a session:

```
> /keybindings
```

---

## Viewing Current Configuration

From inside a session:

```
> /status
```

Shows current model, mode, API key status, and active settings.

```
> /config
```

Visual overview of all current settings with the ability to change them interactively.

---

## Tips

- **Commit `.claude/settings.json`** to standardize Claude's behavior across your team
- **Add `.claude/settings.local.json` to `.gitignore`** so personal preferences don't interfere
- **Set `ANTHROPIC_API_KEY` in your shell profile** so you never have to set it per-project
- **Use `defaultMode: "acceptEdits"`** on trusted personal projects to skip edit confirmation prompts
- **Tighten permissions for sensitive repos** — add `deny` rules for config and secrets directories
- **Check `/status` if something feels off** — it shows exactly which model and mode you're in

---

## Related

- [../settings.md](../settings.md) — Full settings reference
- [../permissions.md](../permissions.md) — Deep dive into permission modes
- [keyboard-shortcuts.md](keyboard-shortcuts.md) — Keybindings configuration
- [slash-commands-in-vscode.md](slash-commands-in-vscode.md) — `/config`, `/settings`, `/permissions` commands
