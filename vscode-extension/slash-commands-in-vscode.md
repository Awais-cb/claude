# Slash Commands in VS Code

All Claude Code slash commands work inside VS Code sessions. Type them in the prompt box or the integrated terminal — they behave identically either way.

---

## How to Use Slash Commands

In the prompt box or terminal, type `/` followed by the command name:

```
> /help
> /diff
> /review
```

No special setup needed — all commands are available as soon as you're in a Claude Code session.

---

## Core Session Commands

| Command | What It Does |
|---------|-------------|
| `/help` | Show all available commands with descriptions |
| `/clear` | Clear the current conversation context (start fresh without ending the session) |
| `/compact` | Compress conversation history to free up context window space |
| `/status` | Show Claude Code version, model, and account info |
| `/doctor` | Diagnose issues with your Claude Code setup |

---

## Navigation & UI Commands

| Command | What It Does |
|---------|-------------|
| `/rename <name>` | Name the current session for easy resumption later |
| `/history` | Show the full conversation history for this session |
| `/vim` | Toggle vim editing mode for the prompt box |
| `/fast` | Toggle Fast Mode (2.5× faster responses) |
| `/model <name>` | Switch model — `opus`, `sonnet`, or `haiku` |
| `/desktop` | Move the session to the Claude Code desktop app |

---

## Configuration Commands

| Command | What It Does |
|---------|-------------|
| `/config` | Open the visual configuration interface |
| `/settings` | Open `settings.json` for editing |
| `/keybindings` | Edit keyboard shortcuts in `keybindings.json` |
| `/memory` | View and edit CLAUDE.md and memory files |
| `/permissions` | View and modify allowed/denied tool permissions |

---

## Code & Review Commands

| Command | What It Does |
|---------|-------------|
| `/diff` | Open interactive diff of recent changes |
| `/review` | Review a pull request (fetches PR diff and analyzes it) |
| `/pr-comments <number>` | Fetch review comments from a PR to address them |
| `/security-review` | Review all branch changes for security vulnerabilities |
| `/simplify` | Review changed code for quality, reuse, and efficiency |
| `/commit-push-pr` | Stage changes, commit, push, and open a pull request |

---

## Context Commands

| Command | What It Does |
|---------|-------------|
| `/context` | Visualize how much of the context window is being used |
| `/add-dir <path>` | Add an additional directory Claude can access |

---

## IDE Commands

| Command | What It Does |
|---------|-------------|
| `/ide` | Manage IDE connections (list connected IDEs, reconnect) |

Useful when you want to check whether VS Code is properly connected or switch between multiple editor instances.

---

## Integration Commands

| Command | What It Does |
|---------|-------------|
| `/mcp` | Manage MCP (Model Context Protocol) server connections |
| `/chrome` | Manage Chrome browser integration |
| `/install-github-app` | Set up Claude as a GitHub Actions bot for PR automation |

---

## Thinking & Mode Commands

| Command | What It Does |
|---------|-------------|
| `/think` | Activate extended thinking for the next response |
| `/think-hard` | Activate deeper thinking (more thorough analysis) |
| `/think-harder` | Maximum thinking depth for the most complex problems |

---

## Skill Commands

Skills are custom slash commands defined by users. Any skill you've created or installed appears here:

```
> /commit          # Stage, write message, commit
> /review-pr       # Full PR review workflow
> /deploy          # Custom deployment script
```

See `~/.claude/skills/` for available skills and [skills.md](../skills.md) for how to create them.

---

## Practical Examples in VS Code

### Quick code review before a commit

```
> /diff
```

See all changes you've made. Then:

```
> /security-review
```

Check for security issues. If all clear:

```
> /commit-push-pr
```

### Picking up where you left off

```
> /history
```

Scroll through what was discussed. Then continue.

### When the context feels cluttered

```
> /compact
```

Claude compresses old history, keeping the important parts but freeing up context window space.

### Switching to a faster model for simple tasks

```
> /model haiku
```

Haiku is significantly faster and cheaper for straightforward questions.

### Bringing in an MCP tool

```
> /mcp
```

Add or activate an MCP server (e.g., a database connection or Jira integration) without leaving VS Code.

---

## Tips

- **`/help` first** — if you're unsure what's available, `/help` lists everything
- **Slash commands work in both the prompt box and terminal** — no difference
- **Some commands open interactive UIs** — `/config` and `/memory` open visual editors
- **`/compact` is your friend in long sessions** — run it when responses start feeling less focused

---

## Related

- [../slash-commands.md](../slash-commands.md) — Full slash command reference
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [settings-configuration.md](settings-configuration.md) — Settings you can configure with `/config`
- [../skills.md](../skills.md) — Creating custom slash commands
