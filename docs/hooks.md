# Hooks — Automate Actions on Events

Hooks let you run shell commands, scripts, or HTTP requests automatically when Claude Code events happen — like before Claude edits a file, after Claude runs a command, or when a session starts.

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

```
~/.claude/settings.json          ← User-wide (all projects)
.claude/settings.json            ← Project-wide
.claude/settings.local.json      ← Local only (not committed)
```

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

### 2. Desktop notification when Claude needs you

Get a macOS notification when Claude is waiting for input:

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

For Linux (using `notify-send`):
```json
{
  "hooks": {
    "Notification": [
      {
        "command": "notify-send 'Claude Code' 'Claude needs your input'"
      }
    ]
  }
}
```

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

---

## Environment Variables in Hooks

Claude Code passes these variables to hook commands:

| Variable | Value |
|----------|-------|
| `$CLAUDE_PROJECT_DIR` | Current working directory |
| `$CLAUDE_TOOL_NAME` | Tool being called (Edit, Bash, etc.) |
| `$CLAUDE_TOOL_INPUT_FILE_PATH` | File being edited (for Edit/Write/Read) |
| `$CLAUDE_TOOL_INPUT_COMMAND` | Command being run (for Bash) |
| `$CLAUDE_SESSION_ID` | Current session ID |
| `$CLAUDE_NOTIFICATION_TYPE` | Type of notification (for Notification event) |

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
