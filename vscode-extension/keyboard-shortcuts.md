# Keyboard Shortcuts

Two categories of shortcuts apply when using Claude Code in VS Code: **VS Code-level shortcuts** (open panels, start sessions) and **session-level shortcuts** (control Claude's behavior while it's running).

---

## VS Code-Level Shortcuts

These work anywhere in VS Code, even when Claude Code is not running:

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` → "Claude Code" | Open Command Palette filtered to Claude Code commands |
| `Ctrl+Shift+A` | Open a new Claude Code session |
| `Ctrl+Shift+X` | Open Extensions sidebar (to manage the extension) |

### Opening specific Claude Code commands from the palette

Press `Ctrl+Shift+P` and type any of these:

```
Claude Code: Open Panel
Claude Code: New Session
Claude Code: Resume Last Session
Claude Code: Open Settings
```

---

## Session-Level Shortcuts

These work while you're inside an active Claude Code session (in the prompt box or integrated terminal):

### Input control

| Shortcut | Action |
|----------|--------|
| `Enter` | Submit prompt |
| `Shift+Enter` | New line without submitting |
| `↑` / `↓` | Navigate prompt history |
| `Ctrl+C` | Cancel current operation / clear input |
| `Ctrl+D` | Exit the session |
| `Ctrl+L` | Clear the terminal screen |

### Editing the prompt

| Shortcut | Action |
|----------|--------|
| `Ctrl+G` | Open current input in `$EDITOR` (full editor for long prompts) |
| `Ctrl+V` | Paste from clipboard (text or image) |

### Claude behavior

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Cycle through permission modes (Normal → Auto-Accept → Plan-only) |
| `Ctrl+O` | Toggle verbose output |

### Undo / rewind

| Shortcut | Action |
|----------|--------|
| `Esc Esc` (press twice) | Rewind — undo the last change Claude made |

This is one of the most useful shortcuts: if Claude's edit wasn't what you wanted, press `Esc Esc` and it reverts the last file operation.

---

## Permission Mode Cycling (Shift+Tab)

Pressing `Shift+Tab` cycles through three modes:

| Mode | What It Means |
|------|--------------|
| **Normal** | Claude asks before risky actions (default) |
| **Auto-Accept** | Claude does everything without asking — maximum speed |
| **Plan-only** | Read-only — Claude explores but makes no changes |

The current mode is shown in the prompt indicator.

---

## Vim Mode Shortcuts

If you enable vim mode (`/vim` or in settings), additional shortcuts become available:

```
> /vim    # toggle vim mode on/off
```

In vim mode, the prompt box behaves like vim:

| Shortcut | Action |
|----------|--------|
| `i` | Enter insert mode |
| `Esc` | Return to normal mode |
| `v` | Visual selection |
| `y` / `p` | Yank / paste |
| Standard vim motions | Navigate and edit |

---

## Customizing Shortcuts

You can remap Claude Code's session shortcuts in `~/.claude/keybindings.json`:

```json
[
  {
    "command": "submit",
    "key": "ctrl+enter"
  },
  {
    "command": "new_line",
    "key": "enter"
  }
]
```

This is useful if you prefer `Ctrl+Enter` to submit (common in other chat tools) and plain `Enter` for newlines.

### Chord shortcuts

You can also define two-key chord shortcuts:

```json
[
  {
    "command": "toggle_plan_mode",
    "key": "ctrl+p p"
  }
]
```

Edit your keybindings from inside a session:

```
> /keybindings
```

---

## Reference Card

Cut this out and keep it handy:

```
┌─────────────────────────────────────────────┐
│        Claude Code VS Code Shortcuts        │
├──────────────────┬──────────────────────────┤
│ Ctrl+Shift+A     │ New session              │
│ Ctrl+Shift+P     │ Command palette          │
├──────────────────┼──────────────────────────┤
│ Enter            │ Submit                   │
│ Shift+Enter      │ New line                 │
│ Ctrl+C           │ Cancel / clear           │
│ Ctrl+D           │ Exit                     │
│ Shift+Tab        │ Cycle permission mode    │
│ Esc Esc          │ Undo last change         │
│ Ctrl+G           │ Open in $EDITOR          │
│ Ctrl+V           │ Paste (incl. images)     │
│ Ctrl+O           │ Toggle verbose           │
└──────────────────┴──────────────────────────┘
```

---

## Related

- [prompt-box.md](prompt-box.md) — Using the VS Code prompt panel
- [../keyboard-shortcuts.md](../keyboard-shortcuts.md) — Full keyboard shortcut reference (all interfaces)
- [settings-configuration.md](settings-configuration.md) — Configuring keybindings in settings.json
