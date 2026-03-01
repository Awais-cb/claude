# Installing the Claude Code VS Code Extension

The Claude Code extension is published by Anthropic on the VS Code Marketplace. Installation takes under a minute.

> **Note:** The extension bundles the Claude Code CLI. You don't need to install Node.js or the CLI separately to use the extension. If you only want to use Claude Code through VS Code, skip straight to [Step 1: Install the VS Code Extension](#step-1-install-the-vs-code-extension). The Node.js and CLI installation steps below are only needed if you also want to use the Claude Code CLI directly in your terminal.

---

## Prerequisites

Before installing the extension, make sure you have:

| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| VS Code | 1.98.0+ | `code --version` to check |
| Anthropic account | — | [claude.ai](https://claude.ai) |
| Node.js *(CLI only)* | 18+ | Only needed for terminal CLI use; not required for the extension |
| npm *(CLI only)* | 8+ | Only needed for terminal CLI use |

---

## CLI-Only Installation (Optional)

The steps in this section — installing Node.js and the Claude Code CLI via npm — are only required if you want to use the Claude Code CLI directly in your terminal. **If you only plan to use Claude Code through the VS Code extension, skip to [Step 1: Install the VS Code Extension](#step-1-install-the-vs-code-extension).** The extension bundles everything it needs.

### Install Node.js (CLI use only)

Node.js powers the Claude Code CLI. Here's how to install it on each OS.

### macOS

**Option A — Homebrew (recommended if you already use brew):**

```bash
# Install Homebrew first if you don't have it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js:
brew install node
```

**Option B — nvm (recommended for managing multiple Node versions):**

```bash
# Install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell config:
source ~/.zshrc   # or source ~/.bashrc

# Install the latest LTS version of Node.js:
nvm install --lts
nvm use --lts
```

**Option C — Official installer:**

Download from [nodejs.org](https://nodejs.org) and run the `.pkg` file.

### Linux (Ubuntu / Debian)

**Option A — nvm (recommended):**

```bash
# Install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell:
source ~/.bashrc

# Install the latest LTS:
nvm install --lts
nvm use --lts
```

**Option B — apt (simpler but may give an older version):**

```bash
# Add the NodeSource repository for Node.js 20:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install:
sudo apt-get install -y nodejs
```

**Verify:**
```bash
node --version   # e.g., v20.12.0
npm --version    # e.g., 10.5.0
```

### Windows — Native (PowerShell)

**Option A — nvm-windows (recommended for managing versions):**

1. Download the installer from [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases) — get `nvm-setup.exe`
2. Run the installer
3. Open a new PowerShell window (as administrator if needed)

```powershell
nvm install lts
nvm use lts
node --version
```

**Option B — Official installer:**

Download the Windows installer from [nodejs.org](https://nodejs.org) (choose the LTS version).

### Windows — WSL (Recommended for Windows users)

WSL (Windows Subsystem for Linux) gives you a full Linux environment inside Windows. This is the smoothest way to use Claude Code on Windows because it avoids common path and permission issues.

**Why WSL?** The Claude Code CLI is built for Unix-style environments. WSL means you get bash, proper file permissions, symlinks that actually work, and better compatibility with Linux-targeted npm packages.

**Step 1: Install WSL (if you haven't already):**

Open PowerShell as Administrator:
```powershell
wsl --install
```

This installs Ubuntu by default. Restart your computer when prompted.

**Step 2: Open your Ubuntu terminal and install nvm:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
node --version
```

---

### Install the Claude Code CLI (CLI use only)

Once Node.js is installed, install the Claude Code CLI globally for terminal access:

**macOS / Linux / WSL:**
```bash
npm install -g @anthropic-ai/claude-code
```

**Windows (PowerShell):**
```powershell
npm install -g @anthropic-ai/claude-code
```

Verify it's installed:
```bash
claude --version
```

You should see a version number like `1.2.3`. If you get "command not found," see the Troubleshooting section at the bottom of this page.

---

## Step 1: Install the VS Code Extension

### Method 1: VS Code Marketplace (Recommended for beginners)

1. Open VS Code
2. Open the Extensions sidebar:
   - **macOS**: `Cmd+Shift+X`
   - **Windows / Linux**: `Ctrl+Shift+X`
3. Search for **Claude Code**
4. Find the extension published by **Anthropic**
5. Click **Install**

The extension activates automatically — no restart needed.

![Claude Code in VS Code Marketplace](./images/marketplace-search.png)
> What to expect: You'll see the Claude Code extension card with the Anthropic publisher name, a blue Install button, and a star rating. Make sure the publisher says "Anthropic" before clicking Install.

### Method 2: Terminal One-liner (For command-line fans)

**macOS / Linux / WSL:**
```bash
code --install-extension anthropic.claude-code
```

**Windows (PowerShell):**
```powershell
code --install-extension anthropic.claude-code
```

This works whether VS Code is open or closed.

> **macOS note:** If `code` is not found, open VS Code → `Cmd+Shift+P` → type "Shell Command: Install 'code' command in PATH" → press Enter. Then try the command again.

### Method 3: VSIX File (Offline / Manual)

If you need to install without internet access or from a specific version:

1. Download the `.vsix` file from the Anthropic releases page
2. In VS Code, open the Extensions sidebar
3. Click the `···` menu (top-right of the sidebar)
4. Select **Install from VSIX...**
5. Pick the downloaded file

---

## Step 2: Authenticate

If you haven't already authenticated Claude Code CLI, do it now:

**macOS / Linux / WSL:**
```bash
claude auth login
```

**Windows (PowerShell):**
```powershell
claude auth login
```

This opens a browser window to link your Anthropic account. The extension uses the same credentials as the CLI — you only log in once. Once authenticated, the `ANTHROPIC_API_KEY` is stored in your Claude Code config and reused automatically.

---

## Verify Everything Works

After installing, run this checklist:

1. **Check the extension is enabled:**
   - Open the Extensions sidebar (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search for "Claude Code" — it should show as **Enabled**

2. **Check the CLI is accessible:**
   ```bash
   claude --version
   ```

3. **Check the Command Palette has Claude commands:**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS)
   - Type "Claude Code" — commands like "Open Panel" and "New Session" should appear

4. **Test the full connection:**
   ```bash
   # In VS Code's integrated terminal:
   claude --ide
   ```
   The prompt box should appear in VS Code.

---

## Keeping It Updated

VS Code auto-updates extensions by default. To check for updates manually:

1. Open the Extensions sidebar
2. Click the `···` menu
3. Select **Check for Extension Updates**

To update the CLI:

**macOS / Linux / WSL:**
```bash
npm update -g @anthropic-ai/claude-code
```

**Windows (PowerShell):**
```powershell
npm update -g @anthropic-ai/claude-code
```

To pin a specific extension version (useful in team environments):

1. Right-click the extension in the sidebar
2. Select **Install Another Version...**

---

## Uninstalling

**Via terminal:**

**macOS / Linux / WSL:**
```bash
code --uninstall-extension anthropic.claude-code
```

**Windows (PowerShell):**
```powershell
code --uninstall-extension anthropic.claude-code
```

**Via sidebar:** Extensions sidebar → right-click the extension → **Uninstall**.

Uninstalling the extension does not remove the Claude Code CLI or your settings. To also remove the CLI:

```bash
npm uninstall -g @anthropic-ai/claude-code
```

---

## Troubleshooting

### `code` command not found (macOS)

Open the Command Palette (`Cmd+Shift+P`) and run:
```
Shell Command: Install 'code' command in PATH
```

Then close and reopen your terminal.

### `code` command not found (Linux)

If you installed VS Code via Snap:
```bash
# The code command may be called 'code' or 'code-insiders'
which code || which code-insiders
```

If installed via apt or the official .deb package, `code` should already be in your PATH. Try opening a new terminal.

### `code` command not found (Windows)

Make sure VS Code was added to PATH during installation. Reinstall VS Code and check the "Add to PATH" option during setup. Alternatively, use the full path:
```powershell
& "C:\Users\YourName\AppData\Local\Programs\Microsoft VS Code\bin\code" --install-extension anthropic.claude-code
```

### `npm install -g` fails with permission error (macOS / Linux)

This typically means npm's global directory is owned by root. Fix it:

```bash
# Create a directory for global packages in your home folder:
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to your ~/.zshrc or ~/.bashrc:
export PATH=~/.npm-global/bin:$PATH

# Reload shell:
source ~/.zshrc   # or ~/.bashrc

# Now install:
npm install -g @anthropic-ai/claude-code
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

### `claude --version` not found after npm install (WSL)

nvm may not be loading properly. Add these lines to your `~/.bashrc`:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Then run `source ~/.bashrc` and try again.

### Windows: `claude` command works in WSL but not in PowerShell

You have two separate environments. Install the CLI in both if you want to use it from both:

**In WSL:**
```bash
npm install -g @anthropic-ai/claude-code
```

**In PowerShell:**
```powershell
npm install -g @anthropic-ai/claude-code
```

---

## Next Step

With the extension installed, connect it to a live Claude Code session:

- [connecting-to-ide.md](connecting-to-ide.md) — Start Claude Code and link it to VS Code
