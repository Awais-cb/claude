# Connecting Claude Code to VS Code

The Claude Code VS Code extension opens natively inside your editor — no terminal command required. Once the extension is installed, click the **Spark icon** in the Activity Bar (left sidebar) or click **"✱ Claude Code"** in the status bar to open the Claude Code panel directly.

The `--ide` flag is a separate, optional workflow for users who launch Claude from an **external terminal** (outside VS Code) and want that terminal session to connect to and communicate with their open VS Code editor. If you're working entirely within VS Code, you don't need `--ide` at all.

---

## The `--ide` Flag (For External Terminal Sessions)

```bash
claude --ide
```

Use this when you launch Claude from a terminal **outside** VS Code and want it to auto-connect to your open editor. Claude Code will:

1. Detect your running VS Code instance
2. Establish a bidirectional connection over a local socket
3. Activate the prompt box inside VS Code
4. Sync your editor's file context and selections in real time

---

## Step-by-Step: Connecting a Terminal Session to VS Code

This section covers how to connect an **external terminal session** to VS Code using `--ide`. If you're using Claude Code purely within VS Code (via the panel), you can skip this section.

### 1. Open your project in VS Code

**macOS:**
```bash
code ~/projects/my-app
```

**Linux:**
```bash
code ~/projects/my-app
```

**Windows (PowerShell):**
```powershell
code C:\projects\my-app
```

**Windows (WSL) — open from WSL terminal:**
```bash
code ~/projects/my-app
```
> WSL note: Running `code .` inside a WSL terminal automatically opens VS Code with the WSL Remote extension active. This is the recommended way to work on projects stored in the Linux filesystem.

Or open VS Code manually and use **File → Open Folder**.

### 2. Open the integrated terminal

| OS | Shortcut | Alternative |
|----|----------|-------------|
| macOS | Ctrl+` (backtick) | View → Terminal |
| Windows | Ctrl+` (backtick) | View → Terminal |
| Linux | Ctrl+` (backtick) | View → Terminal |

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

When the connection is successful, you'll notice:

- A **status indicator** appears in the VS Code status bar (bottom-left area) showing Claude Code is active
- The **Claude Code panel** becomes visible — either as a sidebar panel or a prompt box in the terminal
- Claude is now aware of your **currently open file** and any **text you select**

![Claude Code connected status bar](./images/status-bar-connected.png)
> What to expect: The bottom status bar of VS Code will show a Claude Code icon or label, indicating the extension is connected to a live session. It may show the current permission mode (Normal, Auto-Accept, or Plan-only).

---

## Auto-Connect on Every Terminal Session (Optional)

If you prefer launching Claude from an external terminal and want it to always connect to VS Code, you can avoid typing `claude --ide` every time by setting up an alias. The approach differs slightly per OS.

### Shell alias setup

**macOS (using zsh, the default shell since macOS Catalina):**

```bash
# Open your shell config:
nano ~/.zshrc

# Add this line:
alias cc='claude --ide'

# Reload:
source ~/.zshrc
```

**Linux / WSL (using bash):**

```bash
# Open your shell config:
nano ~/.bashrc

# Add this line:
alias cc='claude --ide'

# Reload:
source ~/.bashrc
```

**Windows (PowerShell profile):**

```powershell
# Find your PowerShell profile path:
$PROFILE

# Open it (create if it doesn't exist):
notepad $PROFILE

# Add this line:
Set-Alias cc "claude --ide"

# Reload:
. $PROFILE
```

After this, just type `cc` to start a Claude session connected to VS Code.

### VS Code Task (automatically runs when you open the project)

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
      },
      "runOptions": {
        "runOn": "folderOpen"
      }
    }
  ]
}
```

Run it manually via **Terminal → Run Task → Start Claude Code**, or with `runOn: folderOpen` it starts automatically every time you open the project.

---

## Combining with Other Flags

`--ide` works with any other Claude Code flags:

```bash
# Connect to IDE + allow access to a second directory
claude --ide --add-dir ../shared-lib

# Connect to IDE + start immediately with a task
claude --ide "review the changes in the auth module"

# Connect to IDE + resume the last session
claude --ide -c

# Connect to IDE + open a named session
claude --ide -r "my-feature"

# Connect to IDE + use a specific model
claude --ide --model claude-opus-4-6
```

---

## Multiple Instances

If you have multiple VS Code windows open, Claude Code connects to the **most recently focused** one. Here's how to target a specific window:

```
1. Click on the VS Code window you want Claude to connect to
2. Make sure it's in focus (active)
3. Run: claude --ide
```

You can verify which window Claude is connected to by checking the status bar — it will show the active connection only in the connected window.

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

To reconnect, simply run `claude --ide` again. The session history is preserved.

To reconnect AND resume your last conversation:

```bash
claude --ide -c
```

This is the recommended way to start each day — you pick up right where you left off, with full context intact.

---

## Without `--ide` (Terminal-Only Mode)

If you run `claude` in a terminal without `--ide`, Claude Code still works — it just runs without connecting to your VS Code editor. You lose:

- The VS Code prompt box
- Selected code as automatic context
- Clickable file links in responses
- IDE-aware file context (which tab you have open)

You can always add `--ide` later — even mid-project. Your session history persists regardless.

---

## Troubleshooting

### "Could not connect to VS Code" or no prompt box appears

**Possible causes and fixes:**

1. **VS Code is not running** — open VS Code first, then run `claude --ide`
2. **The extension is not installed** — install it: `code --install-extension anthropic.claude-code`
3. **The extension is disabled** — open Extensions sidebar, find Claude Code, click Enable
4. **Running `claude --ide` from outside VS Code's terminal** — try running it from VS Code's *integrated* terminal (Ctrl+`)

### macOS: Claude connects but the panel doesn't appear

Try opening it manually from the Command Palette:
```
Cmd+Shift+P → Claude Code: Open Panel
```

### Linux: `code` command not found when setting up alias

Verify VS Code is installed and in PATH:
```bash
which code
```
If not found, ensure VS Code is installed via the official .deb package or Snap, then open a new terminal.

### Windows (WSL): VS Code doesn't receive the connection

Make sure you opened VS Code *from within WSL* (using `code .` in the WSL terminal). If VS Code is opened from the Windows side and you run `claude --ide` in WSL, the connection may not bridge correctly. The fix is to use the "WSL: New WSL Window" command in VS Code, then run `claude --ide` in that window's integrated terminal.

---

## Remote and Container Development

For remote VS Code sessions (SSH, Dev Containers, Codespaces), run `claude --ide` on the **remote machine**, not locally. VS Code Remote tunnels the connection back to your local window automatically.

See [remote-development.md](remote-development.md) for full details on each remote scenario.

---

## Next Steps

- [prompt-box.md](prompt-box.md) — Using the VS Code prompt panel
- [selected-code-context.md](selected-code-context.md) — How editor selections become context
- [file-references.md](file-references.md) — Referencing files with `@`
