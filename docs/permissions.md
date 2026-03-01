# Permissions & Safety

Claude Code gives you fine-grained control over what Claude is allowed to do. This ranges from simple "ask before every action" to "do everything automatically."

---

## The Three Permission Modes

Switch modes with `Shift+Tab` at any time during a session.

### 1. Normal Mode (default)

Claude asks for confirmation before:
- Running bash commands
- Deleting files
- Making network requests
- Any action that could have side effects

```
Claude wants to run: rm -rf ./dist
[Allow] [Deny] [Always allow]
```

**Best for:** Day-to-day work where you want to stay in the loop.

### 2. Plan Mode (read-only)

Claude can **only read** — no file edits, no commands, no changes of any kind. Use this to safely explore and plan before committing.

```bash
# Start in plan mode
claude --permission-mode plan

# Or toggle inside a session:
Shift+Tab
```

**Best for:** Understanding a codebase, reviewing architecture, planning a big refactor.

### 3. Auto-Accept Mode

Claude automatically approves all actions without prompting.

```bash
# Toggle with:
Shift+Tab  (cycle to Auto-Accept)
```

**Best for:** Trusted, fast iteration when you're confident about what Claude is doing.

> ⚠️ Use Auto-Accept carefully — Claude will make changes without asking first.

---

## Configuring Specific Tools

You can allow or deny specific tools regardless of mode.

### Allow specific tools without prompting

```bash
claude --allowedTools "Read,Glob,Grep,Bash(git *)"
```

### Deny specific tools entirely

```bash
claude --disallowedTools "Bash,Write"
```

### Restrict Claude to only certain tools

```bash
# Claude can only read files and search — nothing else
claude --tools "Read,Glob,Grep"
```

### Tool permission patterns

Use wildcards for fine-grained control:

```bash
# Allow all git commands
Bash(git *)

# Allow only git status and git log
Bash(git status),Bash(git log)

# Allow reading any file
Read(*)

# Allow reading only in src/
Read(src/*)
```

---

## Settings File Permissions

You can set permanent permissions in `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm test)",
      "Bash(npm run *)",
      "Read(*)",
      "Write(src/*)"
    ],
    "deny": [
      "Bash(rm *)",
      "Bash(sudo *)"
    ],
    "defaultMode": "normal"
  }
}
```

### Project-level permissions (`.claude/settings.json`)
Committed to the repo — shared with the team.

### Local-level permissions (`.claude/settings.local.json`)
Not committed — your personal overrides.

```json
{
  "permissions": {
    "allow": [
      "Bash(docker *)"
    ]
  }
}
```

---

## The Permission Prompt

When Claude wants to run an action that needs approval, you see:

```
Claude wants to: run `npm install lodash`

[y] Allow once
[a] Always allow this command
[n] Deny
[d] Deny and tell Claude why
```

- **Allow once** — approve just this time
- **Always allow** — add to your permanent allow list
- **Deny** — block this specific action
- **Deny and explain** — block and give Claude feedback on why

---

## Skip All Permissions (Dangerous)

```bash
claude --dangerously-skip-permissions
```

This disables ALL permission prompts. Every action is automatically approved.

> ⚠️ **Only use this in:** throwaway containers, CI/CD pipelines, sandboxed environments. Never on a machine with important data.

---

## Practical Permission Examples

### Safe exploration setup
```bash
# Read-only — Claude can look but not touch
claude --tools "Read,Glob,Grep,WebSearch"
```

### Developer workflow (common)
```bash
# Allow git and test commands automatically
claude --allowedTools "Bash(git *),Bash(npm test),Bash(npm run *)"
```

### CI/CD automation
```bash
# Non-interactive, no prompts, limited to code operations
claude -p "review the PR and add comments" \
  --dangerously-skip-permissions \
  --tools "Read,Bash(gh *),WebFetch"
```

### Protect sensitive files
```json
// .claude/settings.json
{
  "permissions": {
    "deny": [
      "Write(.env*)",
      "Write(config/secrets*)",
      "Bash(rm *)"
    ]
  }
}
```

---

## How Claude Handles Denied Actions

If Claude tries to do something and you deny it:

1. Claude is told the action was denied
2. Claude finds an alternative approach
3. Or Claude asks you for clarification

Example:
```
> Delete all log files

Claude wants to: rm -rf logs/
[Deny]

Claude: I couldn't delete the logs directory. Would you like me to:
1. Delete only .log files individually (rm logs/*.log)
2. Clear the contents without deleting the folder
3. Show you the files first so you can confirm?
```

---

## Sandboxing (Enterprise)

For organizations requiring strict isolation, Claude Code supports OS-level sandboxing:

- **Filesystem isolation** — restricted access to specific directories
- **Network isolation** — controlled external connections
- **Kernel-level enforcement** — not just software restrictions

```bash
# Enable sandbox mode
/sandbox
```

Contact your admin to configure organization-wide sandbox policies.

---

## Permission Mode vs Trust Level

| Scenario | Recommended Mode |
|----------|-----------------|
| First time in a new codebase | Plan Mode |
| Regular daily coding | Normal Mode |
| Running known-safe scripts | Auto-Accept |
| CI/CD pipeline | `--dangerously-skip-permissions` |
| Sensitive production systems | Normal + explicit deny rules |
