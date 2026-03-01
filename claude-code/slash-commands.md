# Slash Commands

Slash commands are special instructions you type inside an active Claude Code session. They start with `/` and control how Claude behaves — like a set of buttons on a dashboard that change what Claude is doing or how it's set up.

> **Think of it like a chat app:** In WhatsApp or Slack, you type your message and hit send. Slash commands are the *settings* behind that chat — they let you clear the conversation, switch modes, check costs, or connect new tools, all without leaving the chat.

---

## How to Use

Type `/` at the prompt and a searchable list of commands appears. Start typing to filter it:

```
> /          ← shows all commands
> /cl        ← filters to /clear, /clone, /changelog...
> /clear     ← runs the clear command
```

```
> /help          ← see everything available
> /cost          ← check how much you've spent
> /clear         ← wipe the conversation and start fresh
```

![Slash command autocomplete menu](./images/slash-commands-menu.png)
> 📷 *What to expect: a searchable dropdown appears when you type `/`*

---

## Session Commands

These control the conversation itself — when to start over, when to save your place, and how to manage memory.

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

### `/clear` — The fresh start

> **Analogy:** Like opening a new browser tab. The old tab (conversation) is gone, but you're still using the same browser (Claude Code).

Use this when:
- Claude seems confused or stuck and giving irrelevant answers
- You've finished one task and want to start a completely different one
- The conversation has gone off track

```
> /clear
```

Claude forgets everything from this session. You start with a clean slate.

---

### `/compact` — Free up memory without losing everything

> **Analogy:** Like summarizing a long email thread. Instead of forwarding 50 messages, you write "here's what we've decided so far" and continue from there.

Claude Code has a context window — a limit on how much it can "hold in mind" at once. In a long session, it can fill up and Claude starts forgetting earlier details. `/compact` summarizes the conversation intelligently so you can keep going.

```
> /compact
```

Or give it a hint about what to keep:

```
> /compact keep the database schema decisions and the list of files we've already edited
```

**When to use it:** If Claude starts giving vague or less relevant answers in a long session, run `/compact`. You'll notice responses get sharper again.

---

### `/rename` and `/resume` — Save and continue later

> **Analogy:** Like bookmarking a browser tab. Give it a name so you can find it again.

```
> /rename payment-refactor
```

Next time you start Claude Code:

```bash
claude -r "payment-refactor"
```

Or inside a session:

```
> /resume payment-refactor
```

Claude reloads the full conversation exactly where you left off.

---

### `/rewind` and `/checkpoint` — Undo and save-points

> **Analogy:** Like Save Game in a video game. `/checkpoint` saves your progress; `/rewind` takes you back to the last save.

```
> /checkpoint           ← save the current state
> /rewind               ← go back to the last checkpoint
```

Use `/checkpoint` before asking Claude to do something risky or experimental. If the result isn't what you wanted, `/rewind` puts things back.

---

### `/fork` — Branch the conversation

> **Analogy:** Like duplicating a document to try a different version without changing the original.

```
> /fork
```

Creates a new session that starts from this exact point in the conversation. Useful when you want to explore two different approaches to the same problem without losing either.

---

## Code Operations

These are the commands for actual development work — reviewing code, making commits, running diffs.

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

### `/diff` — See what changed

> **Analogy:** Like Track Changes in Microsoft Word — shows exactly what was added, removed, or modified.

```
> /diff
```

An interactive view appears showing every file Claude has changed, with green for additions and red for removals. Navigate with arrow keys.

**Use this before every commit** to double-check Claude's work.

---

### `/review` — Code review on any PR

> **Analogy:** Like asking a senior developer to read through a pull request and give feedback, but in seconds.

```
> /review 123
```

Claude fetches PR #123 from GitHub, reads all the changed files, and gives structured feedback on correctness, security, test coverage, and code quality. It includes specific line references so you know exactly where to look.

---

### `/security-review` — Find vulnerabilities in your changes

> **Analogy:** Like a security audit, but automated. Looks for the kinds of bugs that could be exploited.

```
> /security-review
```

Claude reviews everything changed on the current branch versus `main` and flags potential issues: SQL injection, missing auth checks, exposed credentials, unvalidated user input, etc.

---

### `/commit-push-pr` — Ship in one command

> **Analogy:** Like a "Deploy" button that does the whole release process for you.

```
> /commit-push-pr
```

Claude will:
1. Look at all changed files
2. Write a descriptive commit message
3. Push to the remote branch
4. Open a pull request with a title and summary

---

### `/batch` — Large-scale changes across many files

> **Analogy:** Like a find-and-replace that understands code — but for complex refactors, not just text substitution.

```
> /batch
```

Claude plans the change first, then executes it in parallel across multiple copies of your repo (worktrees). Good for renaming a function used in 50 files, updating an API contract, or migrating a pattern across a whole codebase.

---

## Mode Switching

These change what Claude is *allowed* to do.

| Command | Description |
|---------|-------------|
| `/plan` | Switch to Plan Mode (read-only, no edits) |
| `/permission` | View or update permission settings |
| `/fast` | Toggle Fast Mode on/off (2.5× faster) |
| `/fast on` | Turn Fast Mode on |
| `/fast off` | Turn Fast Mode off |

### `/plan` — Look before you leap

> **Analogy:** Like an architect drawing blueprints before construction starts. Claude describes exactly what it would do, but doesn't touch anything yet.

```
> /plan
```

In Plan Mode, Claude can read files, search the codebase, and explain its approach — but it cannot edit any files or run commands. Switch back to normal mode with `Shift+Tab`.

**Use it when:**
- You're about to do something big and want to understand the impact first
- You're exploring an unfamiliar codebase
- You want Claude's opinion before it starts changing things

---

### `/fast` — Speed vs. depth trade-off

> **Analogy:** Like choosing between a detailed expert answer and a quick reply from a knowledgeable friend. Fast mode gives you the quick reply.

```
> /fast       ← toggles it on or off
> /fast on    ← explicitly turn on
> /fast off   ← explicitly turn off
```

Fast mode is great for:
- Simple questions ("what does this function do?")
- Quick lookups ("what's the syntax for array destructuring?")
- Rapid iteration where you're giving lots of small instructions

Turn it off for complex tasks that need more careful reasoning.

---

## Model & Configuration

These switch which AI model Claude uses or open the settings.

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

### `/model` — Choose your AI brain

> **Analogy:** Like choosing a vehicle for a trip. A bicycle (Haiku) is fast and cheap for short trips. A car (Sonnet) handles most things well. A plane (Opus) is overkill for short trips but worth it for long ones.

```
> /model
```

An interactive menu appears. Choose:

| Model | Best for | Speed | Cost |
|-------|----------|-------|------|
| **opus** | Hard problems, architecture decisions | Slower | Higher |
| **sonnet** | Everyday coding tasks (default) | Balanced | Balanced |
| **haiku** | Simple questions, quick lookups | Fastest | Cheapest |

You can switch models mid-session — Claude keeps the conversation history.

---

### `/config` and `/settings` — Adjust how Claude behaves

```
> /config      ← visual editor with toggles and menus
> /settings    ← opens the raw settings.json file
```

`/config` is friendlier for beginners — it shows all options with descriptions and lets you change them with arrow keys. `/settings` is for power users who know what they want to edit directly.

---

## Memory & Context

These help Claude understand your project better and remember things across sessions.

| Command | Description |
|---------|-------------|
| `/memory` | View and edit CLAUDE.md and memory files |
| `/init` | Auto-generate a CLAUDE.md for your project |
| `/context` | Visualize context window usage as a colored grid |

### `/init` — Teach Claude about your project

> **Analogy:** Like writing an onboarding guide for a new hire. Instead of explaining your project from scratch in every session, you write it once and Claude reads it every time.

```
> /init
```

Claude analyzes your codebase — reads your file structure, package.json, existing README, and patterns — then generates a `CLAUDE.md` file with project-specific instructions. Future sessions automatically load this file.

---

### `/memory` — What Claude remembers about you

```
> /memory
```

Opens an editor showing:
- Your project's `CLAUDE.md`
- Auto-saved memories from previous sessions (things Claude noticed and saved automatically)

You can read, edit, or delete any of these. This is useful when Claude has learned something wrong or outdated.

---

### `/context` — Is the memory getting full?

> **Analogy:** Like checking how full a notebook is. The context window is Claude's "working memory" — when it's full, older parts of the conversation get pushed out.

```
> /context
```

Shows a colored grid of the current session's context usage. If it's nearly full, run `/compact`.

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

### `/mcp` — Connect Claude to external tools

> **Analogy:** Like installing apps on your phone. Each MCP server gives Claude a new ability — access to your database, a design tool, a project management system, etc.

```
> /mcp
```

Lists connected MCP servers and lets you add or remove them. See [mcp-servers.md](mcp-servers.md) for details.

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

### `/output-style` — How Claude explains things

> **Analogy:** Like choosing between a textbook explanation and a conversation with a friend.

```
> /output-style
```

Options:
- **default** — concise, practical
- **explanatory** — more detail, explains reasoning
- **learning** — step-by-step, teaches as it goes (great for beginners)

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

### `/cost` — Check your spending

```
> /cost
```

Shows exactly how many tokens were used (input + output) and the estimated cost for the current session. Useful for understanding what kinds of tasks are expensive.

> **Tip:** Long files cost more to read. Use `@specific-file.js` instead of giving Claude access to an entire folder when you only need one file.

### `/doctor` — Something's not working?

```
> /doctor
```

Runs a self-diagnosis and checks for common issues: missing API key, outdated version, broken MCP connections, terminal misconfiguration. Start here when something feels off.

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

### `!` — Run a terminal command directly

> **Analogy:** Like stepping out of a conversation to do something yourself, then stepping back in.

```
> !ls -la
> !git status
> !npm test
```

The `!` prefix runs the command directly in bash — Claude doesn't interpret it or add any of its own behavior. The output is shown to you and also visible to Claude (so you can ask "what does that output mean?" right after).

---

## Tips

- Type `/` and start typing to search/filter commands — you don't need to memorize anything
- `/help <command>` gives details on a specific command, e.g. `/help compact`
- `Shift+Tab` quickly cycles permission modes without typing a command
- Start every new project with `/init` to give Claude instant context about your codebase
