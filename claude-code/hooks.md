# Hooks — Automate Actions on Events

Think of hooks like IFTTT or Zapier, but for your coding assistant. "When Claude edits a file, automatically run the formatter." "When Claude finishes responding, send me a desktop notification." "When Claude tries to run a dangerous command, block it." You define the trigger (the Claude Code event) and the action (a shell command), and it happens automatically every time.

Without hooks, you have to manually run your linter after Claude makes changes, manually check if files were formatted, manually remember to test after edits. With hooks, these things just happen — you stay in the flow.

```
Hook Lifecycle:

  Claude does something
         |
         v
   [Event fires]
   (e.g., PostToolUse)
         |
         v
   [Matcher checks]  <-- Does "Edit|Write" match the tool used?
         |
    YES  |  NO
         |   \
         v    \--> Skip hook, continue
   [Command runs]
   (your shell script)
         |
    +----+----+
    |         |
   PreToolUse  PostToolUse
   can BLOCK   result is
   the action  informational
```

---

## Prerequisites

Before writing complex hooks, make sure you have the relevant tools installed:

**For code formatting hooks:**

macOS (using Homebrew):
```bash
brew install prettier          # JavaScript/TypeScript formatter
brew install black             # Python formatter
```

Linux (Ubuntu):
```bash
npm install -g prettier
pip install black
```

Windows (WSL):
```bash
npm install -g prettier
pip install black
```

**For desktop notification hooks:**

macOS: `osascript` is built in — no install needed.

Linux (Ubuntu):
```bash
sudo apt install libnotify-bin   # Provides notify-send
```

Windows (WSL): For notifications that appear on the Windows desktop from WSL:
```bash
# Option 1: Use PowerShell from WSL
powershell.exe -Command "..."

# Option 2: Install a notification tool
# wsl-notify-send works well for WSL -> Windows notifications
```

**For HTTP hooks:** `curl` is usually pre-installed on macOS and Linux. On Windows, it's included in modern PowerShell.

---

## What Are Hooks?

Hooks are event listeners for Claude Code. Common uses:

- **Auto-format code** after Claude edits a file
- **Send a notification** when Claude needs your attention
- **Block dangerous operations** before they happen
- **Log everything** Claude does for auditing
- **Re-inject context** after conversation is compacted

---

## Hook Events

| Event | When it fires |
|-------|--------------|
| `PreToolUse` | Before any tool runs (can block the action) |
| `PostToolUse` | After a tool successfully completes |
| `PostToolUseFailure` | After a tool fails |
| `SessionStart` | When a session starts or resumes |
| `UserPromptSubmit` | Before Claude processes your message |
| `Stop` | When Claude finishes responding |
| `Notification` | When Claude needs your attention (waiting for input) |
| `SubagentStart` | When a subagent is spawned |
| `SubagentStop` | When a subagent finishes |
| `TaskCompleted` | When a task is marked complete |
| `PreCompact` | Before context compaction happens |
| `WorktreeCreate` | When a worktree is created |
| `WorktreeRemove` | When a worktree is removed |
| `ConfigChange` | When a config file changes |

---

## Hook Configuration

Hooks are configured in `settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "prettier --write {{file}}"
      }
    ]
  }
}
```

### Where to put hooks

**macOS / Linux (Ubuntu):**
```
~/.claude/settings.json          # User-wide (all projects)
.claude/settings.json            # Project-wide
.claude/settings.local.json      # Local only (not committed to git)
```

**Windows (native path):**
```
%USERPROFILE%\.claude\settings.json     # User-wide
.claude\settings.json                   # Project-wide
.claude\settings.local.json             # Local only
```

**Recommendation for beginners:**
- Start with `.claude/settings.local.json` in your project — it won't affect other projects and won't be accidentally committed.
- Once you're happy with a hook, move it to `.claude/settings.json` if the whole team should use it, or `~/.claude/settings.json` if it's a personal preference for all your projects.

---

## Environment Variables in Hooks

Claude Code passes these variables to hook commands. Here's what each one actually contains:

| Variable | What it contains | Example value |
|----------|-----------------|---------------|
| `$CLAUDE_PROJECT_DIR` | Absolute path to the current working directory | `/home/alice/myproject` |
| `$CLAUDE_TOOL_NAME` | The name of the tool Claude just used | `Edit`, `Bash`, `Write`, `Read` |
| `$CLAUDE_TOOL_INPUT_FILE_PATH` | The full path of the file being edited or written | `/home/alice/myproject/src/utils.js` |
| `$CLAUDE_TOOL_INPUT_COMMAND` | The exact shell command Claude is about to run | `npm test -- --coverage` |
| `$CLAUDE_SESSION_ID` | A unique identifier for the current Claude session | `sess_abc123def456` |
| `$CLAUDE_NOTIFICATION_TYPE` | The category of notification being sent | `waiting_for_input`, `task_complete` |

---

## Practical Hook Examples

### 1. Auto-format code after edits

Run Prettier automatically after Claude edits any JS/TS file:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
      }
    ]
  }
}
```

**What this does:** Every time Claude saves a change to a file, Prettier reformats it automatically. You never have to manually run the formatter.

### 2. Desktop notification when Claude needs you

**macOS (built-in, no install required):**
```json
{
  "hooks": {
    "Notification": [
      {
        "command": "osascript -e 'display notification \"Claude needs your input\" with title \"Claude Code\"'"
      }
    ]
  }
}
```

**Linux (Ubuntu) — requires `libnotify-bin`:**
```json
{
  "hooks": {
    "Notification": [
      {
        "command": "notify-send 'Claude Code' 'Claude needs your input' --icon=dialog-information"
      }
    ]
  }
}
```

**Windows (WSL) — sends a Windows toast notification from WSL:**
```json
{
  "hooks": {
    "Notification": [
      {
        "command": "powershell.exe -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('Claude needs your input', 'Claude Code')\""
      }
    ]
  }
}
```

> **Tip for macOS:** The `osascript` notification only appears if your terminal app has notification permissions. Go to System Settings > Notifications > your terminal app and enable notifications if they don't appear.

> **Tip for Linux:** If `notify-send` shows an error, check that a notification daemon is running. On GNOME, this is usually automatic. On minimal setups, try `dunst` as a lightweight notification daemon.

### 3. Run linter after edits

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "cd $CLAUDE_PROJECT_DIR && npm run lint --fix"
      }
    ]
  }
}
```

### 4. Block edits to sensitive files

Prevent Claude from ever editing `.env` or credentials files:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "echo $CLAUDE_TOOL_INPUT_FILE_PATH | grep -qE '\\.(env|key|pem|cert)$' && echo '{\"decision\": \"block\", \"reason\": \"Cannot edit sensitive files\"}' || echo '{\"decision\": \"allow\"}'"
      }
    ]
  }
}
```

### 5. Log all commands Claude runs

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "echo \"[$(date)] Claude running: $CLAUDE_TOOL_INPUT_COMMAND\" >> ~/.claude/command-log.txt"
      }
    ]
  }
}
```

**macOS / Linux path:** `~/.claude/command-log.txt`

**Windows path (in WSL):** `~/.claude/command-log.txt` (inside WSL home)

### 6. Run tests after file changes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "cd $CLAUDE_PROJECT_DIR && npm test -- --passWithNoTests 2>/dev/null || true"
      }
    ]
  }
}
```

### 7. Re-inject important context after compaction

When Claude compacts the conversation, important notes might be lost. Re-inject them:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "command": "cat $CLAUDE_PROJECT_DIR/.claude/important-context.md"
      }
    ]
  }
}
```

---

## Hook Decision Control (PreToolUse)

`PreToolUse` hooks can **allow** or **block** an action by returning JSON:

```bash
#!/bin/bash
# Block rm -rf commands

COMMAND="$CLAUDE_TOOL_INPUT_COMMAND"

if echo "$COMMAND" | grep -q "rm -rf"; then
  echo '{"decision": "block", "reason": "Refusing to run rm -rf. Use rm with specific paths instead."}'
else
  echo '{"decision": "allow"}'
fi
```

Save this as a script file, then reference it in your hook:

**macOS / Linux (Ubuntu):**
```bash
chmod +x ~/.claude/hooks/check-dangerous-commands.sh
```

Configure it:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "command": "~/.claude/hooks/check-dangerous-commands.sh"
      }
    ]
  }
}
```

**Windows (WSL):**
```bash
chmod +x ~/.claude/hooks/check-dangerous-commands.sh
```

The hook path in `settings.json` should use the WSL path format (`~/.claude/hooks/...`) when Claude Code is running in WSL.

---

## Matchers — Filtering Which Tools Trigger

Use the `matcher` field to only fire on specific tools:

```json
{
  "matcher": "Edit"            // Only on Edit tool
  "matcher": "Edit|Write"      // Edit or Write
  "matcher": "Bash(git *)"     // Only git commands
  "matcher": "Bash(npm *)"     // Only npm commands
  "matcher": "Edit(src/*.ts)"  // Only TypeScript files in src/
}
```

---

## HTTP Hooks

Instead of shell commands, call an HTTP endpoint:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "http": {
          "url": "https://your-server.com/claude-hook",
          "method": "POST"
        }
      }
    ]
  }
}
```

---

## Async Hooks

Run hooks in the background without blocking Claude:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "command": "run-slow-linter.sh",
        "async": true
      }
    ]
  }
}
```

---

## Managing Hooks

```
> /hooks
```

Opens an interactive interface to:
- View all configured hooks
- Create new hooks
- Edit existing hooks
- Enable/disable hooks
- Test hooks

---

## Disable All Hooks

For debugging or one-off sessions:

```json
{
  "disableAllHooks": true
}
```

---

## Troubleshooting Common Hook Failures

**Problem: Hook command not found**

Symptoms: The hook silently fails or you see "command not found" in logs.

Cause: Hooks run in a non-interactive shell that may not have your PATH set up the same way your terminal does.

Fix: Use absolute paths to commands in your hook:

```json
{
  "command": "/usr/local/bin/prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
}
```

Find the absolute path with `which prettier` (macOS/Linux) or `Get-Command prettier` (PowerShell).

---

**Problem: Hook fires but does nothing visible**

Symptoms: The hook runs (no error) but the expected effect doesn't happen.

Cause: The command is running but in the wrong directory, or the file path variable isn't expanding correctly.

Fix: Test your hook command manually in your terminal, substituting real values for the environment variables:

```bash
# Manually simulate what the hook will do:
CLAUDE_TOOL_INPUT_FILE_PATH="/path/to/your/file.js"
prettier --write "$CLAUDE_TOOL_INPUT_FILE_PATH"
```

---

**Problem: PreToolUse hook not blocking actions**

Symptoms: You expect the hook to block an action but Claude proceeds anyway.

Cause: The JSON output from your hook is malformed, or the script exits with an error before printing the JSON.

Fix: Test your blocking script directly. The output must be exactly valid JSON:

```bash
# Good - this will block:
echo '{"decision": "block", "reason": "Not allowed"}'

# Bad - extra whitespace or quotes around the JSON will fail:
echo "{ decision: block }"
```

---

**Problem: macOS notifications don't appear**

Symptoms: The `osascript` command runs without error but no notification appears.

Cause: Your terminal app doesn't have notification permissions.

Fix: Go to System Settings > Notifications > find your terminal app (Terminal, iTerm2, etc.) > enable "Allow Notifications".

---

**Problem: Linux `notify-send` fails**

Symptoms: `notify-send: No notification servers are available` error.

Cause: No notification daemon is running.

Fix:
```bash
# Check if dunst is installed:
which dunst

# Install and start dunst if not present:
sudo apt install dunst
dunst &

# Or for GNOME: ensure gnome-shell is running (it includes a notification daemon)
```

---

**Problem: Hooks slow down every Claude response**

Symptoms: There's noticeable lag after every file edit.

Cause: A `PostToolUse` hook is running a slow command synchronously.

Fix: Add `"async": true` to the hook so it runs in the background:

```json
{
  "matcher": "Edit|Write",
  "command": "npm run lint",
  "async": true
}
```

---

## Complete Real-World Setup

Here's a complete `.claude/settings.json` for a Node.js project:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "command": "if [[ $CLAUDE_TOOL_INPUT_FILE_PATH == *.ts || $CLAUDE_TOOL_INPUT_FILE_PATH == *.js ]]; then npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\" 2>/dev/null; fi"
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash(rm *)",
        "command": "echo '{\"decision\": \"block\", \"reason\": \"Use trash-cli instead of rm\"}'"
      }
    ],
    "Notification": [
      {
        "command": "terminal-notifier -title 'Claude Code' -message 'Waiting for input' 2>/dev/null || true"
      }
    ],
    "SessionStart": [
      {
        "command": "echo \"Session started at $(date)\" >> ~/.claude/session-log.txt"
      }
    ]
  }
}
```

> **Note on `terminal-notifier`:** This is a macOS-specific tool installable via `brew install terminal-notifier`. The `2>/dev/null || true` at the end means it fails silently on Linux/Windows where the tool isn't available — safe to leave in a shared `settings.json` if the team uses mixed OS.
