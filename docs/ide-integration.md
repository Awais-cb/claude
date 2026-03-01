# IDE Integration

Claude Code integrates directly with VS Code and JetBrains IDEs, letting you use Claude alongside your editor without switching windows.

---

## VS Code Extension

### Install

1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on macOS)
3. Search for **"Claude Code"**
4. Click Install

Or from the terminal:
```bash
code --install-extension anthropic.claude-code
```

### Auto-connect on startup

```bash
claude --ide
```

Claude Code automatically connects to your open VS Code instance.

### What the VS Code Extension Adds

- **Prompt box** — submit prompts directly from VS Code UI
- **File references** — `@filename` autocomplete for referencing files
- **Folder references** — reference entire directories
- **Session resumption** — continue previous sessions from within VS Code
- **Clickable file links** — Claude's responses include links to files/lines
- **IDE-aware context** — Claude knows what file you're editing
- **Selected code context** — highlighted code is automatically sent as context

### VS Code Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` → "Claude Code" | Open Claude Code panel |
| `Ctrl+Shift+A` | Open new Claude session |

### Multiple sessions in VS Code

You can run multiple Claude sessions simultaneously in VS Code — one per terminal panel.

---

## JetBrains IDEs

Supported IDEs:
- IntelliJ IDEA
- PyCharm
- WebStorm
- CLion
- GoLand
- RubyMine
- PhpStorm
- DataGrip
- Rider

### Install

1. Open your JetBrains IDE
2. Go to **Settings → Plugins**
3. Search for **"Claude Code"**
4. Install and restart

### Auto-connect

```bash
claude --ide
```

### WSL Configuration

If using Windows Subsystem for Linux (WSL):

1. In JetBrains IDE settings, find Claude Code plugin settings
2. Enable **"Use WSL"**
3. Specify your WSL distribution

```bash
# In WSL, auto-connect:
claude --ide
```

### ESC Key Configuration

For a better experience in JetBrains, configure the ESC key:

Go to **Settings → Tools → Claude Code → Configure ESC key**

This prevents ESC from closing the Claude Code terminal panel when you're editing in vim mode.

---

## How IDE Integration Works

### Selected code as context

When you highlight code in your editor and then ask Claude something, the selected code is automatically included as context:

```
[You select a function in VS Code]

> Why is this function slow?

Claude sees your selection and analyzes it directly.
```

### File references with `@`

In the Claude Code prompt box or terminal:

```
> @src/components/LoginForm.tsx — add form validation
> @package.json — what testing framework are we using?
```

### Clickable links in responses

When Claude mentions files, the links are clickable in VS Code:

```
The bug is in [auth.ts:47](src/auth/auth.ts#L47) — the condition is inverted.
```

Click the link → VS Code jumps to that exact line.

---

## Remote Development

Claude Code works with remote development setups:

### VS Code Remote (SSH, Containers, WSL)

When working on a remote machine via VS Code Remote, Claude Code runs on the remote machine and connects to the local VS Code window.

```bash
# On the remote machine
claude --ide
```

### GitHub Codespaces

Claude Code works inside GitHub Codespaces:

1. Open your Codespace
2. Open a terminal
3. `claude --ide`

---

## Switching to Terminal Mode

At any time, you can leave the IDE and continue in a regular terminal:

```
> /desktop     # Move to Claude Code desktop app
```

Or just open a new terminal window and run `claude -c` to resume.

---

## IDE Commands from Claude

Claude can interact with your editor indirectly through file operations:

```
> open the LoginForm component and add error boundary handling
```

Claude will:
1. Read the LoginForm file
2. Make the changes
3. The file updates appear in your editor automatically (VS Code auto-reloads changed files)

---

## Tips

- Run `claude --ide` as an alias — add it to your shell profile for easy access
- The IDE extension shows a status indicator when Claude Code is connected
- File saves in the IDE are immediately visible to Claude in the same session
- Use the VS Code terminal split view to have Claude Code on one side and your code on the other
