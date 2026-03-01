# Remote Development

Claude Code works with all of VS Code's remote development modes — SSH, Dev Containers, WSL, and GitHub Codespaces. The key principle: **Claude Code runs where your code lives**, and the VS Code extension renders the output locally.

---

## How Remote Development Works

In VS Code Remote setups, VS Code splits into two parts:

- **Local**: VS Code UI (your screen, your keyboard)
- **Remote**: File system, terminal, running processes (the server/container/WSL)

Claude Code runs on the **remote side** — where your files are — and connects to the local VS Code window via the extension. This means Claude can read and edit your remote files without any manual file transfer.

---

## VS Code Remote SSH

### Setup

1. Connect to your remote machine in VS Code:
   - `Ctrl+Shift+P` → **Remote-SSH: Connect to Host...**
   - Select or add your SSH host

2. VS Code opens a window connected to the remote machine

3. Open the integrated terminal (it opens on the remote machine)

4. Make sure Claude Code CLI is installed on the remote machine:

```bash
# On the remote machine
npm install -g @anthropic-ai/claude-code
claude auth login
```

5. Start Claude Code with IDE integration:

```bash
claude --ide
```

The prompt box in your local VS Code window connects to Claude running on the remote machine.

### Why this works well

- Claude reads files directly on the remote file system — no syncing needed
- You edit code locally in VS Code as normal
- Claude sees your changes instantly
- Large files on the remote machine are read in place (no download)

---

## Dev Containers

### Setup

1. Open a project with a `devcontainer.json` in VS Code
2. When prompted, click **Reopen in Container** (or use `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**)
3. Wait for the container to build
4. Open the integrated terminal (it runs inside the container)
5. Install Claude Code inside the container if not included in the image:

```bash
npm install -g @anthropic-ai/claude-code
```

6. Authenticate:

```bash
claude auth login
```

7. Start Claude Code:

```bash
claude --ide
```

### Adding Claude Code to your devcontainer

To have Claude Code pre-installed in your dev container, add it to `devcontainer.json`:

```json
{
  "postCreateCommand": "npm install -g @anthropic-ai/claude-code",
  "features": {}
}
```

Or add it to your `Dockerfile`:

```dockerfile
RUN npm install -g @anthropic-ai/claude-code
```

---

## WSL (Windows Subsystem for Linux)

### Setup

WSL lets you run a Linux environment inside Windows. Claude Code works in WSL with VS Code's WSL extension.

1. Install WSL and a Linux distribution (Ubuntu recommended)
2. Install the **WSL** extension in VS Code
3. Connect: `Ctrl+Shift+P` → **WSL: New WSL Window**
4. In the integrated terminal (which now runs in WSL):

```bash
# Install Node.js if not present
sudo apt install nodejs npm
npm install -g @anthropic-ai/claude-code
claude auth login
```

5. Start Claude Code:

```bash
claude --ide
```

### WSL-specific notes

- Claude Code runs in the Linux environment, accessing the Linux file system (`/home/user/...` not `C:\...`)
- If your project is on the Windows file system (`/mnt/c/...`), performance may be slower — prefer working from the Linux home directory
- The ANTHROPIC_API_KEY should be set in your WSL environment (add to `~/.bashrc` or `~/.zshrc`)

---

## GitHub Codespaces

Codespaces are VS Code Dev Containers hosted in the cloud. Claude Code works inside them.

### Setup

1. Open a repository on GitHub
2. Click the green **Code** button → **Codespaces** tab → **Create codespace on main**
3. The Codespace opens in VS Code (browser or desktop app)
4. Open the integrated terminal
5. Install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

6. Set your API key (Codespaces don't persist env vars between sessions by default):

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# Or add to ~/.bashrc for persistence within the session
```

7. Start:

```bash
claude --ide
```

### Making the API key persistent in Codespaces

Add it as a Codespace secret:
1. GitHub → Settings → Codespaces → Secrets
2. Add `ANTHROPIC_API_KEY` with your key
3. Grant it access to the relevant repositories

The secret is injected automatically when a Codespace starts.

### Adding Claude Code to your Codespace config

In `.devcontainer/devcontainer.json`:

```json
{
  "postCreateCommand": "npm install -g @anthropic-ai/claude-code"
}
```

---

## Remote + Additional Directories

When working remotely, you can give Claude access to paths beyond your current project:

```bash
# Grant access to a shared library on the remote machine
claude --ide --add-dir /opt/shared-libraries/my-lib
```

---

## Troubleshooting Remote Connections

### Claude Code can't find VS Code

Make sure VS Code is actually connected to the remote (check the bottom-left status bar — it should show the remote connection name). Then run `claude --ide` from within the remote terminal.

### API key not set in remote environment

```bash
# Add to ~/.bashrc or ~/.zshrc on the remote machine:
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Then `source ~/.bashrc` and restart the Claude Code session.

### Slow performance over SSH

This is normal if your network latency is high. Claude Code communicates with the API directly from the remote machine, so local network speed doesn't affect Claude's response time — only the display update is affected by SSH latency.

---

## Summary Table

| Setup | Where Claude Runs | Where Files Live | Notes |
|-------|-------------------|-----------------|-------|
| Local | Your machine | Your machine | Standard setup |
| Remote SSH | Remote server | Remote server | Install CLI on remote |
| Dev Container | Inside container | Inside container | Add to postCreateCommand |
| WSL | Linux subsystem | Linux FS (or /mnt/c/) | Use Linux FS for best perf |
| Codespaces | Cloud VM | Cloud VM | Set API key as secret |

---

## Related

- [connecting-to-ide.md](connecting-to-ide.md) — The `--ide` flag
- [installation.md](installation.md) — Installing the CLI and extension
- [settings-configuration.md](settings-configuration.md) — Environment variables including ANTHROPIC_API_KEY
