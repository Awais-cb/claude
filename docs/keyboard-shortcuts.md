# Keyboard Shortcuts

All hotkeys available in Claude Code sessions.

> **Tip:** Type `?` inside a session to see which shortcuts are active in your terminal.

---

## Essential Controls

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current action or clear input |
| `Ctrl+D` | Exit session (EOF) |
| `Ctrl+L` | Clear terminal screen |
| `Ctrl+O` | Toggle verbose output (see Claude's internal reasoning) |
| `Ctrl+R` | Reverse search through command history |

---

## Submitting & Input

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit message |
| `Shift+Enter` | New line (multi-line input) — requires terminal setup |
| `Option+Enter` | New line on macOS |
| `\` then `Enter` | New line (works in all terminals) |
| `Ctrl+J` | Line feed character |
| `Ctrl+G` | Open current input in your `$EDITOR` |

> **Configure multi-line:** Run `/terminal-setup` to set up `Shift+Enter` in your terminal.

### Example: Writing a multi-line prompt

```
> Here's what I need you to do:\
> 1. Read the auth module\
> 2. Find any security issues\
> 3. Fix them and write tests
```

---

## Mode Switching

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Cycle permission modes: Normal → Plan → Auto-Accept |
| `Alt+M` | Same as `Shift+Tab` |
| `Option+P` / `Alt+P` | Switch model without clearing your prompt |
| `Option+T` / `Alt+T` | Toggle extended thinking mode |

### Permission mode indicator
Look at the footer of your terminal — it shows which mode you're in:
- **Normal** — default, asks before risky actions
- **Plan** — read-only, no file edits
- **Auto-Accept** — approves everything automatically

---

## Text Editing

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

---

## Image & Clipboard

| Shortcut | Action |
|----------|--------|
| `Ctrl+V` | Paste image from clipboard |
| `Cmd+V` | Paste image from clipboard (macOS) |
| `Alt+V` | Paste image from clipboard (Linux) |
| `Cmd+Click` | Open image in viewer |
| `Ctrl+Click` | Open image in viewer (Linux/Windows) |

### Example: Paste a screenshot

1. Take a screenshot (`Cmd+Shift+4` on macOS)
2. Press `Ctrl+V` in Claude Code
3. Ask: "What's wrong with this UI?"

---

## Session & History

| Shortcut | Action |
|----------|--------|
| `Esc Esc` | Rewind/summarize conversation (undo last change) |
| `Ctrl+B` | Background a running task (keeps it running) |
| `Ctrl+T` | Toggle task list view |
| `Ctrl+F` | Kill background agents (press twice to confirm) |

---

## Vim Mode

Enable with `/vim`. Claude Code supports a subset of vim keybindings.

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

### Available actions (30+)
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
- And many more...

### Chord shortcuts (multi-key)

```json
[
  {
    "key": "ctrl+x ctrl+s",
    "action": "saveMemory"
  }
]
```

---

## Terminal Setup

Some shortcuts require terminal configuration. Run:

```
> /terminal-setup
```

This configures your terminal (iTerm2, Ghostty, WezTerm, Kitty, etc.) to support:
- `Shift+Enter` for new lines
- `Option` as Meta key (required for `Alt+` shortcuts on macOS)
- Correct escape sequences

### Terminals with best support
- **iTerm2** — Excellent support out of the box
- **Ghostty** — Full support
- **WezTerm** — Full support
- **Kitty** — Full support
- **macOS Terminal.app** — Limited (no `Shift+Enter` by default)
