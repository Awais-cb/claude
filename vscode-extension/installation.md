# Installing the Claude Code VS Code Extension

The Claude Code extension is published by Anthropic on the VS Code Marketplace. Installation takes under a minute.

---

## Prerequisites

Before installing the extension, make sure you have:

- **VS Code** — any recent version (1.80+)
- **Node.js 18+** — required by the Claude Code CLI
- **Claude Code CLI** installed globally:

```bash
npm install -g @anthropic-ai/claude-code
```

- **Anthropic account** — sign up at [claude.ai](https://claude.ai) if you haven't yet

---

## Method 1: VS Code Marketplace (Recommended)

1. Open VS Code
2. Press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS) to open the Extensions sidebar
3. Search for **Claude Code**
4. Find the extension published by **Anthropic**
5. Click **Install**

The extension activates automatically — no restart needed.

---

## Method 2: Terminal (One-liner)

```bash
code --install-extension anthropic.claude-code
```

This works whether VS Code is open or closed. On macOS, make sure the `code` command is in your PATH (VS Code → Command Palette → "Shell Command: Install 'code' command in PATH").

---

## Method 3: VSIX File (Offline / Manual)

If you need to install without internet access or from a specific version:

1. Download the `.vsix` file from the Anthropic releases page
2. In VS Code, open the Extensions sidebar
3. Click the `···` menu (top-right of the sidebar)
4. Select **Install from VSIX...**
5. Pick the downloaded file

---

## Verify Installation

After installing, check that it's active:

1. Open the **Extensions** sidebar (`Ctrl+Shift+X`)
2. Search for "Claude Code" — you should see it listed as **Enabled**
3. Open the **Command Palette** (`Ctrl+Shift+P`) and type `Claude Code` — commands should appear

---

## Log In (First Time Only)

If you haven't already authenticated Claude Code CLI, do it now:

```bash
claude auth login
```

This opens a browser window to link your Anthropic account. The extension uses the same credentials as the CLI — you only log in once.

---

## Keeping It Updated

VS Code auto-updates extensions by default. To check for updates manually:

1. Open the Extensions sidebar
2. Click the `···` menu
3. Select **Check for Extension Updates**

To pin a specific version (useful in team environments):

1. Right-click the extension in the sidebar
2. Select **Install Another Version...**

---

## Uninstalling

```bash
code --uninstall-extension anthropic.claude-code
```

Or via the Extensions sidebar → right-click → **Uninstall**.

Uninstalling the extension does not remove the Claude Code CLI or your settings.

---

## Troubleshooting

### `code` command not found (macOS)
Open the Command Palette (`Cmd+Shift+P`) and run:
```
Shell Command: Install 'code' command in PATH
```

### Extension installed but not working
Make sure the CLI is installed and authenticated:
```bash
claude --version    # should print a version number
claude auth login   # re-authenticate if needed
```

### Extension not showing Claude Code commands
Try reloading VS Code:
```
Ctrl+Shift+P → Developer: Reload Window
```

---

## Next Step

With the extension installed, connect it to a live Claude Code session:

- [connecting-to-ide.md](connecting-to-ide.md) — Start Claude Code and link it to VS Code
