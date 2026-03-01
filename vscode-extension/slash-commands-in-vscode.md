# Slash Commands in VS Code

All Claude Code slash commands work inside VS Code sessions. Type them in the prompt box or the integrated terminal — they behave identically either way.

Slash commands are like keyboard shortcuts for common tasks. Instead of explaining to Claude what you want in natural language, you type a short command and it happens. `/diff` shows all your changes. `/review` reviews a PR. `/compact` cleans up a long conversation. They're the fastest way to trigger specific behaviors.

---

## How to Use Slash Commands

In the prompt box or terminal, type `/` followed by the command name:

```
> /help
> /diff
> /review
```

No special setup needed — all commands are available as soon as you're in a Claude Code session. You'll see autocomplete suggestions as you type `/`.

---

## Core Session Commands

| Command | What It Does |
|---------|-------------|
| `/help` | Show all available commands with descriptions |
| `/clear` | Clear the current conversation context (start fresh without ending the session) |
| `/compact` | Compress conversation history to free up context window space |
| `/status` | Show Claude Code version, model, and account info |
| `/doctor` | Diagnose issues with your Claude Code setup |

### When to use these

**`/help`** — Your first stop when you're unsure what's available. Prints a full list of commands with one-line descriptions.

**`/clear`** — Use this when you've finished one task and want to start a different one without ending your session. The session persists (you can still resume it later), but Claude's working memory resets. Good for switching topics.

**`/compact`** — Use this in long sessions when Claude's answers start to feel off-topic or you notice it forgetting earlier context. It summarizes old history into a condensed form and frees up space for new context.

**`/status`** — Quickly check which model you're using, your API status, and the current permission mode.

**`/doctor`** — Run this when something seems broken. It checks your setup (CLI version, auth status, extension connection) and tells you what's wrong.

---

## Navigation and UI Commands

| Command | What It Does |
|---------|-------------|
| `/rename <name>` | Name the current session for easy resumption later |
| `/history` | Show the full conversation history for this session |
| `/vim` | Toggle vim editing mode for the prompt box |
| `/fast` | Toggle Fast Mode (2.5x faster responses) |
| `/model <name>` | Switch model — `opus`, `sonnet`, or `haiku` |
| `/desktop` | Move the session to the Claude Code desktop app |

### When to use these

**`/rename`** — Do this immediately when starting a session: `> /rename payment-refactor`. Without a name, you'll have trouble finding the session later.

**`/history`** — When resuming a session after a break, use `/history` to scroll through what was discussed and remind yourself where you left off.

**`/vim`** — For vim users only. Enables vim keybindings in the prompt input.

**`/fast`** — Toggle on for quick questions or rapid iteration. Toggle off for complex multi-step tasks where thoroughness matters more than speed.

**`/model haiku`** — Switch to a faster, cheaper model for simple questions like "what does this function do?" Switch back with `/model opus` for complex tasks.

---

## Configuration Commands

| Command | What It Does |
|---------|-------------|
| `/config` | Open the visual configuration interface |
| `/settings` | Open `settings.json` for editing |
| `/keybindings` | Edit keyboard shortcuts in `keybindings.json` |
| `/memory` | View and edit CLAUDE.md and memory files |
| `/permissions` | View and modify allowed/denied tool permissions |

### When to use these

**`/config`** — The easiest way to change settings. Opens a visual UI (no JSON editing required). Navigate with arrow keys, toggle options, save.

**`/settings`** — Opens the raw `settings.json` in your `$EDITOR`. Use when you know exactly what you want to change and prefer editing JSON directly.

**`/memory`** — Opens the CLAUDE.md file for this project. Add things here that Claude should always know: project conventions, architecture decisions, testing patterns, etc.

**`/permissions`** — Check what Claude is and isn't allowed to do. Useful when Claude unexpectedly asks for permission on something you want to auto-approve.

---

## Code and Review Commands

| Command | What It Does |
|---------|-------------|
| `/diff` | Open interactive diff of recent changes |
| `/review` | Review a pull request (fetches PR diff and analyzes it) |
| `/pr-comments <number>` | Fetch review comments from a PR to address them |
| `/security-review` | Review all branch changes for security vulnerabilities |
| `/simplify` | Review changed code for quality, reuse, and efficiency |
| `/commit-push-pr` | Stage changes, commit, push, and open a pull request |

### When to use these

**`/diff`** — Before committing, run `/diff` to see a summary of all your changes. Claude can then tell you if anything looks off.

**`/review 47`** — Review PR #47 from GitHub. Claude fetches the diff, analyzes it, and gives you a structured review with specific feedback. File links in the response let you navigate directly to any issue.

**`/security-review`** — Run before merging any code that touches authentication, payments, or user data. Claude checks specifically for security vulnerabilities.

**`/commit-push-pr`** — The "I'm done" command. Stages your changes, writes a commit message, pushes the branch, and opens a pull request — all in one go.

---

## Context Commands

| Command | What It Does |
|---------|-------------|
| `/context` | Visualize how much of the context window is being used |
| `/add-dir <path>` | Add an additional directory Claude can access |

### When to use these

**`/context`** — Run when sessions feel sluggish or Claude seems to be losing track of earlier details. It shows a visual bar of how full the context window is.

**`/add-dir ../shared-lib`** — When your project depends on code in a sibling directory, this gives Claude read access to it without restarting the session.

---

## IDE Commands

| Command | What It Does |
|---------|-------------|
| `/ide` | Manage IDE connections (list connected IDEs, reconnect) |

Useful when you want to check whether VS Code is properly connected or switch between multiple editor instances.

```
> /ide

Connected IDE: VS Code
Window: my-project — src/services/UserService.ts
Status: Active
```

---

## Integration Commands

| Command | What It Does |
|---------|-------------|
| `/mcp` | Manage MCP (Model Context Protocol) server connections |
| `/chrome` | Manage Chrome browser integration |
| `/install-github-app` | Set up Claude as a GitHub Actions bot for PR automation |

### When to use these

**`/mcp`** — Use when you want to connect a database, API, or external tool to your Claude session. MCP servers extend Claude's abilities beyond just your local files.

**`/install-github-app`** — One-time setup to enable Claude Code to automatically review PRs and respond to GitHub comments. Great for teams.

---

## Thinking and Mode Commands

| Command | What It Does |
|---------|-------------|
| `/think` | Activate extended thinking for the next response |
| `/think-hard` | Activate deeper thinking (more thorough analysis) |
| `/think-harder` | Maximum thinking depth for the most complex problems |

### When to use these

Use the thinking commands before asking Claude about genuinely complex problems:
- Architectural decisions with many tradeoffs
- Debugging an obscure issue that involves multiple interacting systems
- Designing a system that needs to handle edge cases carefully

```
> /think-hard
> How should I design the retry logic for our payment processor to handle
  network failures, duplicate charges, and idempotency correctly?
```

The response will be slower but significantly more thorough.

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

Scroll through what was discussed. Then continue where you left off.

### When the context feels cluttered

```
> /compact
```

Claude compresses old history, keeping the important parts but freeing up context window space.

### Switching to a faster model for simple tasks

```
> /model haiku
```

Haiku is significantly faster and cheaper for straightforward questions. Switch back:

```
> /model opus
```

### Bringing in an MCP tool

```
> /mcp
```

Add or activate an MCP server (e.g., a database connection or Jira integration) without leaving VS Code.

### Checking setup health

```
> /doctor
```

Runs a diagnostic check and prints a report of your Claude Code setup — version, auth status, API connectivity, extension connection.

---

## Tips

- **`/help` first** — if you're unsure what's available, `/help` lists everything
- **Slash commands work in both the prompt box and terminal** — no difference
- **Some commands open interactive UIs** — `/config` and `/memory` open visual editors
- **`/compact` is your friend in long sessions** — run it when responses start feeling less focused
- **Tab autocomplete works for slash commands** — type `/` and press Tab to see all options

---

## Related

- [../slash-commands.md](../slash-commands.md) — Full slash command reference
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [settings-configuration.md](settings-configuration.md) — Settings you can configure with `/config`
- [../skills.md](../skills.md) — Creating custom slash commands
