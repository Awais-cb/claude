# Slash Commands

Slash commands are typed inside an active Claude Code session (starting with `/`). They control Claude's behavior, settings, and tools.

Type `/` in any session to see the full list with search.

---

## How to Use

```
> /help          ← type this in a session
> /cost
> /clear
```

---

## Session Commands

| Command | Description |
|---------|-------------|
| `/clear` | Clear conversation history and start fresh |
| `/new` | Same as `/clear` — start a new conversation |
| `/reset` | Reset conversation to beginning |
| `/compact [instructions]` | Summarize conversation to free up context space |
| `/rename <name>` | Name the current session for easy resumption |
| `/resume <name>` | Resume a previous session by name or ID |
| `/continue` | Continue from the last message |
| `/fork` | Create a new session branching from this point |
| `/rewind` | Undo last change and restore previous state |
| `/checkpoint` | Save current state (so you can rewind to here) |

### Example: Compact and continue

```
> /compact keep only the decisions we made about the database schema
```

This summarizes the conversation with your note, freeing up context window space.

---

## Code Operations

| Command | Description |
|---------|-------------|
| `/review` | Review a pull request for quality, security, and tests |
| `/diff` | Show an interactive diff of recent changes |
| `/simplify` | Review changed code for quality and efficiency |
| `/debug` | Debug current session using the debug log |
| `/batch` | Plan and execute a large-scale change across multiple worktrees |
| `/pr-comments` | Fetch and display comments from a GitHub PR |
| `/security-review` | Analyze branch changes for security vulnerabilities |
| `/commit-push-pr` | Commit, push, and open a PR in one step |

### Example: Review a PR

```
> /review 123
```

Claude fetches PR #123 from GitHub and reviews it.

---

## Mode Switching

| Command | Description |
|---------|-------------|
| `/plan` | Switch to Plan Mode (read-only, no edits) |
| `/permission` | View or update permission settings |
| `/fast` | Toggle Fast Mode on/off (2.5× faster) |
| `/fast on` | Turn Fast Mode on |
| `/fast off` | Turn Fast Mode off |

---

## Model & Configuration

| Command | Description |
|---------|-------------|
| `/model` | Switch model (opus, sonnet, haiku) or adjust effort level |
| `/config` | Open visual configuration interface |
| `/settings` | View and edit settings.json |
| `/keybindings` | Edit keyboard shortcuts |
| `/agents` | Manage subagents (create, edit, delete) |
| `/skills` | List available skills (custom commands) |
| `/hooks` | Create and manage automation hooks |
| `/plugin` | Install, enable, or disable plugins |

### Example: Switch model mid-session

```
> /model
```

An interactive menu appears — select `opus`, `sonnet`, or `haiku`.

---

## Memory & Context

| Command | Description |
|---------|-------------|
| `/memory` | View and edit CLAUDE.md and memory files |
| `/init` | Auto-generate a CLAUDE.md for your project |
| `/context` | Visualize context window usage as a colored grid |

### Example: Initialize a CLAUDE.md

```
> /init
```

Claude analyzes your project and generates a CLAUDE.md file with project-specific instructions.

---

## Git & GitHub

| Command | Description |
|---------|-------------|
| `/install-github-app` | Set up Claude in GitHub Actions |
| `/install-slack-app` | Set up Claude in Slack |

---

## Integrations

| Command | Description |
|---------|-------------|
| `/mcp` | Manage MCP server connections |
| `/chrome` | Manage Chrome browser integration |
| `/ide` | Manage IDE integrations |
| `/desktop` | Continue session in the Claude Code desktop app |
| `/remote-control` / `/rc` | Enable remote control from claude.ai |

---

## Display & Themes

| Command | Description |
|---------|-------------|
| `/theme` | Change color theme |
| `/vim` | Toggle vim editing mode |
| `/terminal-setup` | Configure terminal keybindings (Shift+Enter, etc.) |
| `/statusline` | Configure the status line display |
| `/output-style` | Switch output style (default, explanatory, learning) |
| `/tasks` | View and manage background tasks |

### Example: Enable vim mode

```
> /vim
```

Now you can use `h/j/k/l`, `w/b/e`, `dd`, `yy`, `p`, and other vim motions to edit your input.

---

## Information & Monitoring

| Command | Description |
|---------|-------------|
| `/help` | Show all available commands |
| `/status` | Show version, model, and connection status |
| `/cost` | Show token usage and cost for this session |
| `/usage` | Show plan limits and rate limit status |
| `/stats` | Visualize daily usage, streaks, and model preferences |
| `/insights` | Usage insights and analytics |
| `/doctor` | Diagnose installation and configuration issues |
| `/release-notes` | View recent changelog |
| `/changelog` | Same as `/release-notes` |

### Example: Check your spending

```
> /cost
```

Shows input/output tokens used and estimated cost for the current session.

---

## Account

| Command | Description |
|---------|-------------|
| `/login` | Log in to Anthropic account |
| `/logout` | Log out |
| `/upgrade` | View upgrade options |
| `/privacy-settings` | Update privacy preferences |
| `/passes` | View usage passes |
| `/extra-usage` | Enable extra usage credits |

---

## Special Input Prefixes

These are not slash commands but special prefixes that change how input is handled:

| Prefix | Behavior |
|--------|----------|
| `/` | Opens command list |
| `!` | Run as raw bash command (no Claude interpretation) |
| `@` | Autocomplete file paths |

### Example: Run bash directly

```
> !ls -la
> !git status
> !npm test
```

The `!` prefix runs the command directly in bash without asking Claude to interpret it.

---

## Tips

- Type `/` and start typing to search/filter commands
- Most commands have tab completion
- `/help <command>` gives details on a specific command
- `Shift+Tab` quickly cycles permission modes (no need for `/plan`)
