# Permissions & Safety

## What are Permissions?

Think of Claude's permissions like the access badge you give a new employee on their first day. A junior contractor might only get a key to their desk — they can look at things but can't modify production systems. A trusted senior developer gets broader access, but you'd still want to know before they push to main. A fully automated CI bot might have unrestricted access to run scripts — but only in a sandboxed environment where nothing important can break.

Claude works the same way. By default, it asks for your approval before doing anything that could have consequences — running commands, editing files, making network requests. As you build trust, you can expand its access. And you can always restrict specific actions, no matter what mode you're in.

```
New employee (day 1)         Trusted dev (6 months in)    Automated CI bot
────────────────────         ─────────────────────────    ─────────────────
"Can I delete this file?"    Just does it, tells you      Runs everything,
"Should I run npm install?"  after                        no supervision
"Is this the right DB?"
     ↓                              ↓                           ↓
  Normal Mode               Auto-Accept Mode            --dangerously-skip-permissions
```

---

## The Three Permission Modes

Switch modes with `Shift+Tab` at any time during a session. The cycle order is: **Normal → Auto-Accept → Plan**.

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

> Use Auto-Accept carefully — Claude will make changes without asking first.

---

## The Three Modes at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                    Permission Mode Comparison                   │
├──────────────────┬──────────────────┬───────────────────────────┤
│   Normal Mode    │   Plan Mode      │   Auto-Accept Mode        │
│   (default)      │   (read-only)    │                           │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Reads files: YES │ Reads files: YES │ Reads files: YES          │
│ Edits files: ASK │ Edits files: NO  │ Edits files: YES          │
│ Runs commands: ASK│ Runs commands: NO│ Runs commands: YES       │
│ Network: ASK     │ Network: YES     │ Network: YES              │
├──────────────────┼──────────────────┼───────────────────────────┤
│ Use when:        │ Use when:        │ Use when:                 │
│ Daily coding     │ Exploring code   │ You trust the task        │
│ New codebase     │ Planning refactor│ Rapid prototyping         │
│ Risky tasks      │ Reviewing design │ Known-safe scripts        │
└──────────────────┴──────────────────┴───────────────────────────┘
         Switch between modes with: Shift+Tab
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

![Claude permission prompt in terminal](./images/permission-prompt.png)
> What to expect: a prompt like the one above appears in your terminal whenever Claude wants to take an action that could have side effects. You choose how to respond before anything happens.

---

## What Happens When You Deny

Denying an action doesn't end the conversation. Claude is told the action was denied and immediately looks for another way to help.

**Example 1: Denying a destructive command**
```
> Delete all log files

Claude wants to: rm -rf logs/
[Deny]

Claude: I couldn't delete the logs directory. Would you like me to:
1. Delete only .log files individually (rm logs/*.log)
2. Clear the contents without deleting the folder
3. Show you the files first so you can confirm?
```

**Example 2: Denying a file write**
```
> Update the database config

Claude wants to: Write to config/database.php
[Deny]

Claude: I can't write to that file. I can show you the exact changes
you'd need to make manually — want me to do that instead?
```

**Example 3: Denying and explaining**
```
> Install the lodash package

Claude wants to: run npm install lodash
[Deny and explain: we don't add dependencies without discussing it first]

Claude: Understood — I'll always discuss dependency choices before
installing anything. For this task I can use native JS array methods
instead of lodash. Here's how...
```

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

## OS-Specific Notes

### macOS / Linux
File paths use forward slashes. Wildcard patterns in settings work directly:
```json
"deny": ["Write(.env*)", "Write(config/secrets*)"]
```

### Windows (WSL)
When running Claude Code inside WSL, paths follow Linux conventions (forward slashes), even though your files are on a Windows filesystem. Use Linux-style paths in your settings files:
```json
"deny": ["Write(.env*)", "Write(config/secrets*)"]
```

If you're running Claude Code in native PowerShell (less common), paths use backslashes in the filesystem but still use forward slashes in Claude's tool patterns.

### Windows (PowerShell)
To create the settings directory and file:
```powershell
New-Item -ItemType Directory -Force .claude
New-Item -ItemType File .claude\settings.json
```

---

## Skip All Permissions (Dangerous)

```bash
claude --dangerously-skip-permissions
```

This disables ALL permission prompts. Every action is automatically approved.

> **Only use this in:** throwaway containers, CI/CD pipelines, sandboxed environments. Never on a machine with important data.

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
