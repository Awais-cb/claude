# Remote Development

Claude Code works with all of VS Code's remote development modes — SSH, Dev Containers, WSL, and GitHub Codespaces. The key principle: **Claude Code runs where your code lives**, and the VS Code extension renders the output locally.

Think of it like a remote-controlled car: you hold the controller (VS Code on your local machine), but the car (Claude Code + your files) is running somewhere else. The extension is the radio signal connecting them.

---

## How Remote Development Works

In VS Code Remote setups, VS Code splits into two parts:

```
┌─────────────────────────────────────────────────────────┐
│              Your Local Machine                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │  VS Code UI (editor, panels, prompt box)        │    │
│  │  Claude Code extension (rendering responses)    │    │
│  └───────────────────────┬─────────────────────────┘    │
└──────────────────────────│──────────────────────────────┘
                           │  SSH / Container / WSL tunnel
┌──────────────────────────│──────────────────────────────┐
│              Remote Environment                         │
│                                                         │
│  ┌───────────────────────▼─────────────────────────┐    │
│  │  Files, terminal, processes                     │    │
│  │  Claude Code CLI (runs here)                    │    │
│  │  Node.js + npm                                  │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

- **Local**: VS Code UI (your screen, your keyboard)
- **Remote**: File system, terminal, running processes (the server/container/WSL)

Claude Code runs on the **remote side** — where your files are — and connects to the local VS Code window via the extension. This means Claude can read and edit your remote files without any manual file transfer.

---

## VS Code Remote SSH

### When to use this

You're developing on a remote Linux server (your company's dev server, a VPS, an EC2 instance, etc.) and want to use Claude Code with access to the files on that server.

### Setup

1. **Install the Remote-SSH extension in VS Code (local):**
   - Open Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
   - Search for "Remote - SSH" (published by Microsoft)
   - Install it

2. **Connect to your remote machine:**
   - `Ctrl+Shift+P` → **Remote-SSH: Connect to Host...**
   - Select or add your SSH host (format: `user@hostname`)

3. **VS Code opens a window connected to the remote machine.** The bottom-left status bar shows the remote name.

4. **Open the integrated terminal** (it opens on the remote machine automatically).

5. **Install Claude Code CLI on the remote machine:**

```bash
# On the remote machine (in VS Code's integrated terminal)
npm install -g @anthropic-ai/claude-code
claude auth login
```

6. **Start Claude Code:**

```bash
claude --ide
```

The prompt box in your local VS Code window connects to Claude running on the remote machine.

![Remote SSH connection in VS Code](./images/remote-ssh-status.png)
> What to expect: The bottom-left corner of VS Code shows a green indicator with "SSH: your-server-name". The integrated terminal opens a shell on the remote machine. Running `claude --ide` there connects it to your local VS Code window.

### Why SSH + Claude Code works well

- Claude reads files directly on the remote file system — no syncing or downloading needed
- You edit code locally in VS Code as normal, VS Code syncs changes automatically
- Claude sees your changes instantly
- Large files on the remote machine are read in place (no download to your laptop)
- Claude's API calls go out from the remote machine's network — useful if your local machine has restrictions

### Troubleshooting SSH

**"Cannot connect to host" error:**
- Check that SSH works from your terminal: `ssh user@hostname`
- Make sure your SSH key is set up: `ssh-keygen -t ed25519` and add the public key to `~/.ssh/authorized_keys` on the remote

**Claude can't find VS Code:**
- Make sure you opened VS Code via Remote-SSH (not just a regular window)
- Check the status bar — it should say "SSH: hostname"
- Then run `claude --ide` from within that window's integrated terminal

**API key not set on remote:**
```bash
# On the remote machine, add to ~/.bashrc:
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

---

## Dev Containers

### When to use this

Your project uses Docker and has a `devcontainer.json` — development happens inside a container to ensure consistent environments across the team. You want Claude Code to work inside that container.

### Setup

1. **Install the Dev Containers extension in VS Code (local):**
   - Open Extensions sidebar
   - Search for "Dev Containers" (published by Microsoft)
   - Install it

2. **Open a project with a `devcontainer.json`:**
   - When prompted, click **Reopen in Container**
   - Or: `Ctrl+Shift+P` → **Dev Containers: Reopen in Container**
   - Wait for the container to build (first time takes longer)

3. **Open the integrated terminal** (it runs inside the container).

4. **Install Claude Code inside the container if not pre-installed:**

```bash
npm install -g @anthropic-ai/claude-code
```

5. **Authenticate:**

```bash
claude auth login
```

6. **Start Claude Code:**

```bash
claude --ide
```

![Dev Container status in VS Code](./images/dev-container-status.png)
> What to expect: The bottom-left status bar shows "Dev Container: your-container-name". The terminal prompt may look slightly different (container hostname). Claude Code runs inside the container, accessing the container's file system.

### Adding Claude Code to your devcontainer (pre-install)

To have Claude Code automatically available in your dev container, add it to `devcontainer.json`:

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

With this in place, every developer who opens the dev container gets Claude Code available automatically — no manual install needed.

### Setting the API key in dev containers

API keys should not be in your `devcontainer.json` (it may be committed to git). Instead:

**Option A — Environment variable on your local machine:**

On your host machine, set `ANTHROPIC_API_KEY`. Dev Containers can forward local environment variables:

```json
{
  "containerEnv": {
    "ANTHROPIC_API_KEY": "${localEnv:ANTHROPIC_API_KEY}"
  }
}
```

**macOS / Linux (set on host):**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# Add to ~/.zshrc or ~/.bashrc to make it persistent
```

**Windows (set in PowerShell before launching VS Code):**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

**Option B — Set inside the container session:**
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```
(Not persistent across container rebuilds — use Option A for that)

### Troubleshooting Dev Containers

**Container builds but Claude Code isn't found:**
- Run `npm install -g @anthropic-ai/claude-code` inside the container terminal
- Add to `postCreateCommand` in `devcontainer.json` so it installs automatically next time

**Container rebuilds lose the auth:**
- Use the `containerEnv` approach above to forward the API key from your local machine

---

## WSL (Windows Subsystem for Linux)

### When to use this

You're on Windows and want the best Claude Code experience. WSL gives you a real Linux environment inside Windows, which is the recommended setup for Claude Code on Windows.

### Why WSL is recommended for Windows users

Running Claude Code natively on Windows (in PowerShell or Command Prompt) works, but WSL provides:
- Better compatibility with Linux-targeted tools and npm packages
- Proper file permissions and symlinks
- Bash and standard Unix utilities that many dev tools expect
- The same experience as macOS/Linux development environments

### Full WSL Setup

**Step 1: Install WSL (if not already installed)**

Open PowerShell as Administrator:
```powershell
wsl --install
```

This installs Ubuntu by default. Restart when prompted.

**Step 2: Open Ubuntu and install Node.js via nvm**

Open the Ubuntu app from the Start menu (or search "Ubuntu"):

```bash
# Install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc

# Install Node.js LTS:
nvm install --lts
nvm use --lts
node --version  # should print v20.x.x or higher
```

**Step 3: Install Claude Code CLI**

```bash
npm install -g @anthropic-ai/claude-code
claude auth login
```

**Step 4: Install the WSL extension in VS Code**

On the Windows side:
- Open VS Code (Windows app)
- Open Extensions (`Ctrl+Shift+X`)
- Search for "WSL" (published by Microsoft)
- Install it

**Step 5: Connect VS Code to WSL**

```
Ctrl+Shift+P → WSL: New WSL Window
```

Or from your WSL terminal:
```bash
code .
```

VS Code opens a new window connected to WSL. The status bar shows "WSL: Ubuntu" (or your distro name).

**Step 6: Start Claude Code**

In the VS Code integrated terminal (which runs inside WSL):
```bash
cd ~/projects/my-app
claude --ide
```

![WSL connection in VS Code](./images/wsl-status.png)
> What to expect: The bottom-left status bar shows "WSL: Ubuntu" or your distribution name. The integrated terminal shows a Linux prompt. File paths use Linux format (`~/projects/...` not `C:\...`).

### WSL-specific notes

**File system performance:** Keep your projects in the Linux filesystem (`~/projects/`) rather than the Windows filesystem (`/mnt/c/Users/...`). Cross-filesystem access is significantly slower.

```bash
# Good: project in Linux filesystem
cd ~/projects/my-app
claude --ide

# Slower: project on Windows drive
cd /mnt/c/Users/YourName/projects/my-app
claude --ide
```

**Setting the API key in WSL:**

Add to your WSL shell profile so it persists:
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

**Accessing Windows files from WSL:**

Your Windows C drive is accessible at `/mnt/c/`. But for best performance, work from the Linux home directory.

**Running both WSL and Windows Claude Code:**

If you install Claude Code both in WSL and Windows PowerShell, they are completely separate installations. Set the API key in both environments.

### Troubleshooting WSL

**`code` command not found in WSL:**

After installing VS Code on Windows and the WSL extension, run this in WSL:
```bash
# This should automatically work once the WSL extension is installed
# If not, manually add VS Code to PATH in ~/.bashrc:
echo 'export PATH="$PATH:/mnt/c/Users/YourName/AppData/Local/Programs/Microsoft VS Code/bin"' >> ~/.bashrc
source ~/.bashrc
```

**nvm not found after installing:**

nvm modifies `~/.bashrc` during installation. If it's not found after install, close and reopen your WSL terminal, or run:
```bash
source ~/.bashrc
```

**Claude Code not connecting to VS Code from WSL:**

Make sure you opened VS Code *from WSL* (using `code .` or "WSL: New WSL Window"), not just opened the Windows VS Code and then used an integrated terminal. The WSL extension needs to be active for the connection to work.

---

## GitHub Codespaces

### When to use this

You want to work on a project from any browser or VS Code without any local setup. Codespaces runs a cloud VM that VS Code connects to.

### Setup

1. **Open a repository on GitHub**
2. Click the green **Code** button → **Codespaces** tab → **Create codespace on main**
3. The Codespace opens in your browser (or VS Code desktop if you choose)
4. Open the integrated terminal
5. Install Claude Code:

```bash
npm install -g @anthropic-ai/claude-code
```

6. Set your API key:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# For persistence within this codespace session, add to ~/.bashrc:
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
```

7. Start Claude Code:

```bash
claude --ide
```

![GitHub Codespace with Claude Code](./images/codespace-setup.png)
> What to expect: The Codespace opens in a VS Code-like interface in your browser (or the VS Code desktop app). The status bar shows "Codespace: your-codespace-name". You can run Claude Code in the integrated terminal just like a local setup.

### Making the API key persistent in Codespaces

Secrets set per-session are lost when the Codespace restarts. Use GitHub's Codespace secrets for persistence:

1. GitHub → **Settings** → **Codespaces** → **Secrets**
2. Click **New secret**
3. Name: `ANTHROPIC_API_KEY`, Value: your API key
4. Grant it access to the relevant repositories

The secret is injected as an environment variable automatically when a Codespace starts. You don't need to set it manually.

### Adding Claude Code to your Codespace config

In `.devcontainer/devcontainer.json`:

```json
{
  "postCreateCommand": "npm install -g @anthropic-ai/claude-code"
}
```

With this, every new Codespace for your repository has Claude Code pre-installed.

### Troubleshooting Codespaces

**API key lost after Codespace restart:**
- Use GitHub Codespace secrets (as described above) for persistent API key injection

**Claude Code installs but is slow:**
- Codespace VMs vary in performance. The default (2-core) Codespace may feel slower for Claude Code than a local machine. Consider upgrading to a 4-core machine type in the Codespace settings.

**Browser Codespace vs. VS Code desktop:**
- Both work. The VS Code desktop app tends to have better support for extensions and terminal features. To switch: in the browser Codespace, press `Shift+Ctrl+P` → "Open in VS Code Desktop"

---

## Remote + Additional Directories

When working remotely, you can give Claude access to paths beyond your current project:

```bash
# Grant access to a shared library on the remote machine
claude --ide --add-dir /opt/shared-libraries/my-lib

# Grant access to a sibling directory
claude --ide --add-dir ../shared-utils
```

---

## Summary Table

| Setup | Where Claude Runs | Where Files Live | Install CLI On |
|-------|-------------------|-----------------|----------------|
| Local | Your machine | Your machine | Your machine |
| Remote SSH | Remote server | Remote server | The remote server |
| Dev Container | Inside container | Inside container | The container (via postCreateCommand) |
| WSL | Linux subsystem | Linux FS or /mnt/c/ | WSL Linux environment |
| Codespaces | Cloud VM | Cloud VM | Cloud VM (via postCreateCommand) |

**Rule of thumb:** Claude Code goes wherever your files are. Install it there, run it there.

---

## Related

- [connecting-to-ide.md](connecting-to-ide.md) — The `--ide` flag
- [installation.md](installation.md) — Installing the CLI and extension
- [settings-configuration.md](settings-configuration.md) — Environment variables including ANTHROPIC_API_KEY
