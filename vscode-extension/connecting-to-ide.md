# Connecting Claude Code to VS Code

The `--ide` flag is the bridge between the Claude Code CLI and your VS Code editor. Without it, Claude Code runs in a standalone terminal with no awareness of your editor. With it, Claude gets full context of what you're working on.

---

## The `--ide` Flag

```bash
claude --ide
```

Run this from your project directory in VS Code's integrated terminal (or any terminal where the project is open). Claude Code will:

1. Detect your running VS Code instance
2. Establish a bidirectional connection
3. Activate the prompt box inside VS Code
4. Sync your editor's file context and selections

---

## Step-by-Step

### 1. Open your project in VS Code

```bash
code ~/projects/my-app
```

Or open VS Code manually and use **File → Open Folder**.

### 2. Open the integrated terminal

`Ctrl+`` ` `` (backtick) — or **View → Terminal**

### 3. Navigate to your project root (if not already there)

```bash
cd ~/projects/my-app
```

### 4. Start Claude Code with IDE integration

```bash
claude --ide
```

The prompt box appears in VS Code. Claude is now connected.

---

## What "Connected" Looks Like

- A status indicator in the VS Code status bar shows Claude Code is active
- The prompt box is visible in the Claude Code panel
- Claude knows which file you have open and what you've selected

---

## Auto-Connect on Every Session (Recommended)

Instead of typing `claude --ide` every time, make it your default:

### Add a shell alias

```bash
# In ~/.bashrc or ~/.zshrc:
alias cc='claude --ide'
```

Then just type `cc` to start a session.

### Or set as a VS Code task

Create `.vscode/tasks.json` in your project:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Claude Code",
      "type": "shell",
      "command": "claude --ide",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

Run it via **Terminal → Run Task → Start Claude Code**.

---

## Combining with Other Flags

`--ide` works with any other Claude Code flags:

```bash
# Connect to IDE + allow access to a second directory
claude --ide --add-dir ../shared-lib

# Connect to IDE + start immediately with a task
claude --ide "review the changes in the auth module"

# Connect to IDE + open a named session
claude --ide -r "my-feature"
```

---

## Multiple Instances

If you have multiple VS Code windows open, Claude Code connects to the **most recently focused** one. To target a specific window, activate it first (click on it), then run `claude --ide`.

---

## Disconnecting and Reconnecting

To disconnect cleanly, exit the Claude Code session:

```
Ctrl+D
```

or type:

```
exit
```

To reconnect, simply run `claude --ide` again. Use `claude --ide -c` to reconnect and resume the last session.

---

## Without `--ide` (Fallback Mode)

If you run `claude` without `--ide`, Claude Code still works — it just runs in the terminal without editor integration. You lose:

- The VS Code prompt box
- Selected code as automatic context
- Clickable file links in responses
- IDE-aware file context

You can always add `--ide` later — even mid-project.

---

## Remote and Container Development

For remote VS Code sessions (SSH, Dev Containers, Codespaces), run `claude --ide` on the **remote machine**, not locally. VS Code Remote tunnels the connection back to your local window.

See [remote-development.md](remote-development.md) for full details.

---

## Next Steps

- [prompt-box.md](prompt-box.md) — Using the VS Code prompt panel
- [selected-code-context.md](selected-code-context.md) — How editor selections become context
- [file-references.md](file-references.md) — Referencing files with `@`
