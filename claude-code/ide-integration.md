# IDE Integration

Picture having a brilliant colleague sitting at a second monitor right next to you. They can see exactly what file you have open, what code you've highlighted, and what you're working on — and you can talk to them in plain English without switching screens. That's what Claude Code's IDE integration provides. The Claude Code CLI runs in your terminal (or a panel inside your editor), while the IDE plugin creates a live connection so Claude always knows your current context: which file you're in, what you've selected, and where errors are appearing.

Claude Code integrates directly with VS Code and JetBrains IDEs, letting you use Claude alongside your editor without switching windows.

---

## How IDE Integration Works (Visual Overview)

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Screen                              │
│                                                             │
│  ┌──────────────────────────┐  ┌───────────────────────┐   │
│  │     VS Code / JetBrains  │  │   Claude Code Panel   │   │
│  │                          │  │   (Terminal or UI)    │   │
│  │  src/auth/login.ts       │  │                       │   │
│  │  ──────────────────────  │  │  > Why is this slow?  │   │
│  │  function validateToken( │◄─┼──                     │   │
│  │    token: string         │  │  Claude sees your     │   │
│  │  ) {                     │  │  highlighted code     │   │
│  │    [YOU SELECTED THIS]   │  │  automatically        │   │
│  │  }                       │  │                       │   │
│  └──────────────────────────┘  └───────────────────────┘   │
│                                                             │
│           Connected via  claude --ide                       │
└─────────────────────────────────────────────────────────────┘
```

Without `--ide`, Claude can still read files — but it doesn't automatically know which file you're currently looking at, or what you've highlighted.

---

## VS Code Extension

### Install — macOS

1. Open VS Code
2. Press `Cmd+Shift+X` to open Extensions
3. Search for **"Claude Code"**
4. Click Install

Or from the terminal:

**macOS:**
```bash
code --install-extension anthropic.claude-code
```

### Install — Linux (Ubuntu)

1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for **"Claude Code"**
4. Click Install

**Linux (Ubuntu):**
```bash
code --install-extension anthropic.claude-code
```

If `code` is not found, install VS Code first:
```bash
sudo snap install code --classic
# or
sudo apt install code
```

### Install — Windows

**Option A: Native Windows VS Code** (simplest if you're not using WSL)

1. Download VS Code from [code.visualstudio.com](https://code.visualstudio.com)
2. Open VS Code, press `Ctrl+Shift+X`
3. Search for **"Claude Code"** and install

**Option B: VS Code with WSL extension** (recommended for developers using WSL)

**Windows (WSL):**
```bash
# In your WSL terminal — VS Code Remote connects automatically
# First, install the VS Code WSL extension from within VS Code
# Then open your WSL project folder:
code .
# VS Code opens with the WSL Remote extension active
```

Then install the Claude Code extension from within VS Code (it installs into the WSL environment automatically).

---

### Auto-connect on startup

```bash
claude --ide
```

Claude Code automatically connects to your open VS Code instance. You'll see a connection indicator in the VS Code status bar.

![VS Code Claude Code panel](./images/vscode-panel.png)
> What to expect: a Claude Code panel appears in the sidebar or bottom panel of VS Code. There's a connection status indicator (green = connected), a prompt input box, and conversation history. Files Claude mentions are clickable links that jump to the exact line in your editor.

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
| `Cmd+Shift+P` → "Claude Code" (macOS) | Open Claude Code panel |
| `Cmd+Shift+A` (macOS) | Open new Claude session |

### Multiple sessions in VS Code

You can run multiple Claude sessions simultaneously in VS Code — one per terminal panel. This is useful when you want one Claude session debugging a bug while another writes tests.

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

### Install — macOS

1. Open your JetBrains IDE
2. Go to **IntelliJ IDEA → Settings → Plugins** (or `Cmd+,` then Plugins)
3. Click the **Marketplace** tab
4. Search for **"Claude Code"**
5. Click Install and restart the IDE

**macOS (alternative via Toolbox):**
```bash
# If using JetBrains Toolbox, plugins are managed per-IDE from within the IDE settings
open -a "IntelliJ IDEA"
# Then navigate: IntelliJ IDEA menu → Settings → Plugins → Marketplace → Claude Code
```

### Install — Linux (Ubuntu)

1. Open your JetBrains IDE
2. Go to **File → Settings → Plugins** (or `Ctrl+Alt+S` then Plugins)
3. Click the **Marketplace** tab
4. Search for **"Claude Code"**
5. Click Install and restart the IDE

**Linux (Ubuntu) — verify plugin directory if manual install needed:**
```bash
# JetBrains plugin directory location
ls ~/.local/share/JetBrains/IntelliJIdea*/plugins/
# or for the snap install:
ls ~/snap/intellij-idea-community/current/.IntelliJIdea*/config/plugins/
```

### Install — Windows (Native)

1. Open your JetBrains IDE
2. Go to **File → Settings → Plugins** (`Ctrl+Alt+S` then Plugins)
3. Click the **Marketplace** tab
4. Search for **"Claude Code"**
5. Click Install and restart

### Install — Windows (WSL)

When your code lives in WSL but you're using a Windows JetBrains IDE, there's a bridge:

**Windows (WSL):**
1. In your JetBrains IDE, go to **File → Settings** (`Ctrl+Alt+S`)
2. Navigate to **Tools → Claude Code**
3. Enable **"Use WSL"**
4. Select your WSL distribution from the dropdown (e.g., `Ubuntu-22.04`)
5. Click Apply

Then in your WSL terminal:
```bash
claude --ide
```

The JetBrains IDE on Windows will detect the Claude Code instance running inside WSL and connect to it automatically.

![JetBrains Claude Code panel](./images/jetbrains-panel.png)
> What to expect: a Claude Code tool window appears at the bottom of your JetBrains IDE (similar to the Terminal or Git panels). You can type prompts directly into it, and Claude's responses appear inline. File references link directly to the editor.

### Auto-connect

```bash
claude --ide
```

### WSL Configuration (Detailed)

Windows users often run their development environment inside WSL (Windows Subsystem for Linux) but use a Windows-native IDE. Here's the full setup:

```
Windows Machine
┌─────────────────────────────────────────────────────┐
│                                                     │
│  JetBrains IDE (Windows native)                     │
│  ┌──────────────────────────┐                       │
│  │  Claude Code Plugin      │                       │
│  │  [Use WSL: Ubuntu-22.04] │                       │
│  └──────────┬───────────────┘                       │
│             │  Plugin bridges to WSL                │
│             ▼                                       │
│  WSL2 (Ubuntu)                                      │
│  ┌──────────────────────────┐                       │
│  │  $ claude --ide          │                       │
│  │  (Claude Code CLI)       │                       │
│  └──────────────────────────┘                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Windows (WSL) — full setup checklist:**
```bash
# 1. Install Claude Code in WSL
npm install -g @anthropic-ai/claude-code

# 2. Verify it's working
claude --version

# 3. Start Claude Code with IDE flag (from inside WSL)
claude --ide

# 4. In JetBrains (Windows): Settings → Tools → Claude Code → Enable WSL
#    Select your distro (Ubuntu-22.04 or similar)
```

**Troubleshooting WSL connection issues:**
```bash
# Check if the WSL distribution name matches what JetBrains shows
wsl --list --verbose

# Ensure Claude Code is installed in the correct WSL distro
wsl -d Ubuntu-22.04 -- which claude
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

**Real-world scenario:** You're looking at a complex SQL-building function in your editor. You highlight the whole function, then type "is this vulnerable to SQL injection?" — Claude sees exactly what you highlighted, no copy-pasting needed.

### File references with `@`

In the Claude Code prompt box or terminal:

```
> @src/components/LoginForm.tsx — add form validation
> @package.json — what testing framework are we using?
> @src/services/ — summarize what each service does
```

### Clickable links in responses

When Claude mentions files, the links are clickable in VS Code:

```
The bug is in [auth.ts:47](src/auth/auth.ts#L47) — the condition is inverted.
```

Click the link — VS Code jumps to that exact line.

---

## Remote Development

Claude Code works with remote development setups:

### VS Code Remote (SSH, Containers, WSL)

When working on a remote machine via VS Code Remote, Claude Code runs on the remote machine and connects to the local VS Code window.

```bash
# On the remote machine (after VS Code Remote connects)
claude --ide
```

**macOS / Linux (Ubuntu) — SSH remote:**
```bash
# SSH into the remote machine
ssh yourserver.com

# Install Claude Code on the remote machine
npm install -g @anthropic-ai/claude-code

# Start with IDE flag — it connects back to your local VS Code
claude --ide
```

### GitHub Codespaces

Claude Code works inside GitHub Codespaces:

1. Open your Codespace
2. Open a terminal in the Codespace
3. Run `claude --ide`

**Linux (Ubuntu) inside Codespace:**
```bash
# Codespaces run Linux — same commands as Linux/Ubuntu
npm install -g @anthropic-ai/claude-code
claude --ide
```

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

- Run `claude --ide` as an alias — add it to your shell profile for easy access:

**macOS / Linux (Ubuntu):**
```bash
echo 'alias cc="claude --ide"' >> ~/.zshrc  # or ~/.bashrc
source ~/.zshrc
```

**Windows (WSL):**
```bash
echo 'alias cc="claude --ide"' >> ~/.bashrc
source ~/.bashrc
```

- The IDE extension shows a status indicator when Claude Code is connected
- File saves in the IDE are immediately visible to Claude in the same session
- Use the VS Code terminal split view to have Claude Code on one side and your code on the other
- In JetBrains, drag the Claude Code tool window to the right side panel for a side-by-side layout
