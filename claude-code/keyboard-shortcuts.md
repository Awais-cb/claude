# Keyboard Shortcuts

Keyboard shortcuts let you control Claude Code without typing commands. Instead of writing `/compact` or `/plan`, a key combination does it instantly.

> **Think of it like driving:** You don't tell the car "please activate the brakes" — you just press the pedal. Shortcuts are your pedals: fast, muscle-memory actions that don't interrupt your flow.

> **Tip:** Type `?` inside a session to see which shortcuts are active in your terminal.

---

## Essential Controls

These are the most important shortcuts to learn first. They work everywhere, in any situation.

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current action or clear input |
| `Ctrl+D` | Exit session (EOF) |
| `Ctrl+L` | Clear terminal screen |
| `Ctrl+O` | Toggle verbose output (see Claude's internal reasoning) |
| `Ctrl+R` | Reverse search through command history |

### `Ctrl+C` — The emergency stop

> **Analogy:** Like the Stop button on a printer. Press it when Claude is doing something and you want it to stop immediately.

```
[Claude is generating a long response or running a command]
→ Press Ctrl+C
[Claude stops immediately, cursor returns to you]
```

If there's text in the input box (you're mid-typing), `Ctrl+C` clears the input instead. Press it twice if Claude is actively working and you want to abort.

---

### `Ctrl+D` — Leave the session

> **Analogy:** Like closing a chat window. The conversation is saved — you can come back with `claude -c`.

Press `Ctrl+D` on an empty input line to exit Claude Code cleanly.

---

### `Ctrl+L` — Clean screen, same session

> **Analogy:** Like wiping a whiteboard. The conversation history isn't deleted — you just scroll up to see it again — but your screen gets clean.

Use this when the terminal feels cluttered and you want to see the current state clearly. It does NOT affect your conversation.

---

### `Ctrl+O` — Look inside Claude's head

> **Analogy:** Like turning on subtitles. Normally you just see Claude's output; with verbose mode on, you see what tools it's calling, what it's reading, and why.

```
→ Press Ctrl+O
[Every tool call, file read, and internal step now shows in real time]
```

Useful when something is taking a long time and you want to understand what Claude is actually doing.

---

## Submitting & Input

How you get your message to Claude.

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit message |
| `Shift+Enter` | New line (multi-line input) — requires terminal setup |
| `Option+Enter` | New line on macOS |
| `\` then `Enter` | New line (works in all terminals) |
| `Ctrl+J` | Line feed character |
| `Ctrl+G` | Open current input in your `$EDITOR` |

### Writing multi-line prompts

For complex tasks, a well-structured multi-line prompt gets better results than a single rushed sentence.

**Method 1:** Use `\` at the end of each line (works in every terminal):

```
> Here's what I need:\
> 1. Read the auth module\
> 2. Find any security issues\
> 3. Fix them and write tests
```

**Method 2:** Set up `Shift+Enter` (recommended for regular use):

```
> /terminal-setup
```

This configures your terminal so `Shift+Enter` adds a new line, while plain `Enter` submits. Much more natural.

**Method 3:** `Ctrl+G` — write in your full editor:

> **Analogy:** Like drafting an email in Word instead of the email client's input box — more space, full editing features.

Press `Ctrl+G` and your current prompt opens in whatever editor you have set as `$EDITOR` (vim, nano, VS Code, etc.). Write as much as you want, save, and close — the text comes back to Claude Code ready to submit.

---

## Mode Switching

Change what Claude is allowed to do without opening any menu.

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Cycle permission modes: Normal → Auto-Accept → Plan |
| `Alt+M` | Same as `Shift+Tab` |
| `Option+P` / `Alt+P` | Switch model without clearing your prompt |
| `Option+T` / `Alt+T` | Toggle extended thinking mode |

### `Shift+Tab` — The permission dial

> **Analogy:** Like a camera mode dial: Auto → Manual → Burst. Each mode gives you a different level of control vs. speed.

```
Normal → Auto-Accept → Plan → Normal → ...
```

The current mode is shown in the footer at the bottom of your terminal:

```
┌────────────────────────────────────────────────┐
│ > _                                            │
│                                                │
│  [Normal Mode]  tokens: 1,204  cost: $0.02    │
└────────────────────────────────────────────────┘
```

![Permission mode indicator in footer](./images/permission-mode-footer.png)
> 📷 *The footer shows your current mode. Press Shift+Tab to cycle through.*

| Mode | What it means | When to use it |
|------|--------------|---------------|
| **Normal** | Claude asks before risky actions | Day-to-day work |
| **Plan** | Read-only — no edits at all | Exploring code, understanding a codebase |
| **Auto-Accept** | Does everything without asking | Trusted tasks, rapid iteration |

---

### `Alt+P` — Swap models on the fly

> **Analogy:** Like switching from a calculator to a full spreadsheet app without closing your work.

Press `Alt+P` (or `Option+P` on Mac) while you have a prompt typed. A model picker appears and you can switch to Opus, Sonnet, or Haiku. Your typed prompt stays in the input box.

---

## Text Editing

Shortcuts for editing what you've typed in the input prompt — especially useful for long, complex prompts.

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Delete from cursor to end of line |
| `Ctrl+U` | Delete entire current line |
| `Ctrl+Y` | Paste last deleted text |
| `Alt+Y` | Cycle through paste history |
| `Alt+B` | Move cursor back one word |
| `Alt+F` | Move cursor forward one word |
| `Up Arrow` | Previous command in history |
| `Down Arrow` | Next command in history |
| `Left/Right Arrow` | Cycle dialog tabs (in menus) |

### The most useful text editing shortcuts

**`Ctrl+U`** — wipe the whole line and start over. Much faster than holding Backspace.

**`Ctrl+K`** — delete everything from your cursor to the end of the line. Good for rewriting the end of a prompt without deleting the beginning.

**`Ctrl+Y`** — paste back what you just deleted with `Ctrl+U` or `Ctrl+K`. It's like an undo for deletions.

**`Alt+B` / `Alt+F`** — jump backward/forward one word at a time instead of pressing the arrow key 20 times.

**`Up Arrow`** — retrieve your last prompt. Essential when Claude misunderstood and you want to tweak and resend.

---

## Image & Clipboard

Claude can see images. Paste them directly from your clipboard.

| Shortcut | Action |
|----------|--------|
| `Ctrl+V` | Paste image from clipboard |
| `Cmd+V` | Paste image from clipboard (macOS) |
| `Ctrl+V` | Paste image from clipboard (Linux) |
| `Cmd+Click` | Open image in viewer |
| `Ctrl+Click` | Open image in viewer (Linux/Windows) |

### How to ask Claude about a screenshot

> **Analogy:** Like sending a photo to a friend and asking "what do you think?" — except Claude can actually analyze and respond to what it sees.

1. Take a screenshot — `Cmd+Shift+4` on macOS, `PrintScreen` on Windows/Linux
2. Press `Ctrl+V` (or `Cmd+V`) in Claude Code
3. Ask your question:

```
> [image pasted]
> Why is the login button not showing up?
```

```
> [image pasted]
> This is the error I'm getting. What's causing it?
```

```
> [image pasted]
> Can you recreate this UI layout in HTML/CSS?
```

Claude sees the image exactly as you see it and can describe, analyze, or act on it.

---

## Session & History

Shortcuts for managing what's happening in the background.

| Shortcut | Action |
|----------|--------|
| `Esc Esc` | Rewind/summarize conversation (undo last change) |
| `Ctrl+B` | Background a running task (keeps it running) |
| `Ctrl+T` | Toggle task list view |
| `Ctrl+F` | Kill background agents (press twice to confirm) |

### `Esc Esc` — Undo Claude's last action

> **Analogy:** Like Ctrl+Z for Claude's edits. If Claude changed a file and the result wasn't what you wanted, `Esc Esc` reverts it.

```
[Claude edits 3 files]
→ Press Esc Esc
[The edits are reverted, you're back to before]
```

This is different from `/rewind` (which goes back to a checkpoint) — `Esc Esc` specifically undoes the most recent file change.

---

### `Ctrl+B` — Keep Claude working in the background

> **Analogy:** Like minimizing an app that's still running. Claude keeps working while you do something else.

```
[Claude is running tests or building something long]
→ Press Ctrl+B
[Task runs in background, you get your prompt back]
→ Press Ctrl+T to check on it
```

---

## Vim Mode

If you're a vim user, you can enable vim keybindings for the input prompt:

```
> /vim
```

This does **not** affect files you open in your editor — it only changes how you type prompts into Claude Code's input box.

> **Not a vim user?** Skip this section entirely. It's purely optional.

### What vim mode looks like

```
┌─────────────────────────────────┐
│ [NORMAL]                        │
│ > Here is my prompt_            │
└─────────────────────────────────┘
```

The mode indicator `[NORMAL]` or `[INSERT]` shows in the prompt.

### Switching Modes

| Key | Action |
|-----|--------|
| `Esc` | Enter NORMAL mode |
| `i` | Insert before cursor |
| `I` | Insert at beginning of line |
| `a` | Insert after cursor |
| `A` | Insert at end of line |
| `o` | Insert new line below |
| `O` | Insert new line above |

### Navigation (NORMAL mode)

| Key | Action |
|-----|--------|
| `h` | Move left |
| `j` | Move down |
| `k` | Move up |
| `l` | Move right |
| `w` | Next word |
| `b` | Previous word |
| `e` | End of word |
| `0` | Start of line |
| `$` | End of line |
| `gg` | Beginning of text |
| `G` | End of text |
| `f<char>` | Jump to next occurrence of `<char>` |
| `F<char>` | Jump to previous occurrence of `<char>` |

### Editing (NORMAL mode)

| Key | Action |
|-----|--------|
| `x` | Delete character |
| `dd` | Delete line |
| `D` | Delete to end of line |
| `yy` / `Y` | Copy line |
| `p` | Paste after |
| `P` | Paste before |
| `J` | Join line with next |
| `>>` | Indent right |
| `<<` | Indent left |
| `.` | Repeat last action |

### Text Objects (NORMAL mode)

| Key | Action |
|-----|--------|
| `iw` / `aw` | Inner/outer word |
| `i"` / `a"` | Inner/outer quotes |
| `i(` / `a(` | Inner/outer parentheses |
| `i[` / `a[` | Inner/outer brackets |
| `i{` / `a{` | Inner/outer braces |

---

## Custom Keybindings

You can define your own shortcuts in `~/.claude/keybindings.json`.

> **Analogy:** Like remapping keys on a gaming keyboard. You decide which physical key triggers which action.

Run `/keybindings` to open the editor, or edit the file directly:

```json
[
  {
    "key": "ctrl+shift+r",
    "action": "runTests"
  },
  {
    "key": "ctrl+shift+f",
    "action": "formatCode"
  }
]
```

### Common actions to remap

- `submitMessage` — Submit current input
- `clearInput` — Clear input box
- `openEditor` — Open input in $EDITOR
- `toggleVimMode` — Toggle vim mode
- `toggleFastMode` — Toggle fast mode
- `toggleThinking` — Toggle extended thinking
- `cyclePermissionMode` — Cycle through permission modes
- `showHelp` — Show help
- `clearHistory` — Clear conversation history
- `compact` — Compact conversation
- `newLine` — Insert new line

### Chord shortcuts (two keys in sequence)

```json
[
  {
    "key": "ctrl+x ctrl+s",
    "action": "saveMemory"
  }
]
```

Press `Ctrl+X`, release, then press `Ctrl+S` — like emacs-style chording.

---

## Terminal Setup

Some shortcuts require one-time terminal configuration. Run:

```
> /terminal-setup
```

This guides you through configuring your terminal to support:
- `Shift+Enter` for new lines (instead of submitting)
- `Option` as Meta key on macOS (required for `Alt+` shortcuts)
- Correct escape sequences for special keys

### Terminals with best support

| Terminal | Support level | Notes |
|----------|-------------|-------|
| **iTerm2** | Excellent | Best for macOS |
| **Ghostty** | Full | Great modern option |
| **WezTerm** | Full | Cross-platform |
| **Kitty** | Full | GPU-accelerated |
| **macOS Terminal.app** | Limited | No `Shift+Enter` by default |
| **Windows Terminal** | Good | Run `/terminal-setup` first |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│           Essential Shortcuts                   │
├──────────────────┬──────────────────────────────┤
│ Ctrl+C           │ Cancel / stop Claude         │
│ Ctrl+D           │ Exit session                 │
│ Ctrl+L           │ Clear screen (not history)   │
│ Shift+Tab        │ Cycle permission mode        │
│ Esc Esc          │ Undo last change             │
│ Ctrl+V           │ Paste image                  │
│ Ctrl+G           │ Open in $EDITOR              │
│ Ctrl+O           │ Toggle verbose output        │
│ Up Arrow         │ Previous prompt              │
│ Ctrl+U           │ Delete whole line            │
└──────────────────┴──────────────────────────────┘
```
