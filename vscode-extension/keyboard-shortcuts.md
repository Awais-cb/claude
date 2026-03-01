# Keyboard Shortcuts

Two categories of shortcuts apply when using Claude Code in VS Code: **VS Code-level shortcuts** (open panels, start sessions) and **session-level shortcuts** (control Claude's behavior while it's running).

Learning these shortcuts is like learning your editor's keybindings — a small investment that pays back every time you use it. The most important ones to internalize: `Ctrl+Shift+A` to open a session, `Shift+Tab` to change permission mode, and `Esc Esc` to undo Claude's last change.

---

## VS Code-Level Shortcuts

These work anywhere in VS Code, even when Claude Code is not running:

| Action | macOS | Windows / Linux |
|--------|-------|-----------------|
| Open Command Palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Open new Claude Code session | `Cmd+Shift+A` | `Ctrl+Shift+A` |
| Open Extensions sidebar | `Cmd+Shift+X` | `Ctrl+Shift+X` |
| Open integrated terminal | `Ctrl+`` ` `` ` | `Ctrl+`` ` `` ` |
| New terminal panel | `Ctrl+Shift+`` ` `` ` | `Ctrl+Shift+`` ` `` ` |

### Opening specific Claude Code commands from the palette

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and type any of these:

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

| Action | Shortcut | Notes |
|--------|----------|-------|
| Submit prompt | `Enter` | Sends your message to Claude |
| New line without submitting | `Shift+Enter` | For multi-line prompts |
| Navigate prompt history (back) | `↑` | Cycles through previous prompts |
| Navigate prompt history (forward) | `↓` | Moves forward in history |
| Cancel current operation | `Ctrl+C` | Stops Claude mid-response |
| Clear input (when prompt is empty) | `Ctrl+C` | Same key, different context |
| Exit the session | `Ctrl+D` | Ends the session cleanly |
| Clear the terminal screen | `Ctrl+L` | Screen only; context preserved |

### Editing the prompt

| Action | macOS | Windows / Linux |
|--------|-------|-----------------|
| Open prompt in full editor | `Ctrl+G` | `Ctrl+G` |
| Paste from clipboard (text or image) | `Cmd+V` | `Ctrl+V` |

`Ctrl+G` opens your current prompt input in `$EDITOR` — very useful for long, multi-paragraph prompts where the one-line input feels cramped.

### Claude behavior

| Action | Shortcut | Notes |
|--------|----------|-------|
| Cycle permission modes | `Shift+Tab` | Normal → Auto-Accept → Plan-only |
| Toggle verbose output | `Ctrl+O` | Shows/hides Claude's internal reasoning steps |

### Undo / rewind

| Action | Shortcut |
|--------|----------|
| Rewind — undo the last change Claude made | `Esc Esc` (press twice quickly) |

This is one of the most useful shortcuts: if Claude's edit wasn't what you wanted, press `Esc Esc` and it reverts the last file operation. Much faster than `Ctrl+Z` in the editor if Claude touched multiple files.

---

## Permission Mode Cycling (Shift+Tab)

Pressing `Shift+Tab` cycles through three modes:

| Mode | What It Means | When to Use |
|------|--------------|-------------|
| **Normal** | Claude asks before risky actions (default) | Most situations — good for careful work |
| **Auto-Accept** | Claude does everything without asking — maximum speed | Trusted projects, rapid iteration |
| **Plan-only** | Read-only — Claude explores but makes no changes | Code review, exploration, learning a codebase |

The current mode is shown in the prompt indicator at the bottom of the session.

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

You can remap Claude Code's session shortcuts. The config file location depends on your OS:

**macOS / Linux / WSL:**
```
~/.claude/keybindings.json
```

**Windows (native):**
```
%USERPROFILE%\.claude\keybindings.json
```

Example — swap `Enter` and `Ctrl+Enter` (preferred by many chat tool users):

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

### Setting up `Ctrl+Enter` to submit on macOS

Open `~/.claude/keybindings.json`:

**macOS:**
```bash
nano ~/.claude/keybindings.json
```

Add:
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

This is popular for macOS users because `Ctrl+Enter` matches the behavior of tools like Notion, Linear, and Slack (on some configurations).

### Setting up `Ctrl+Enter` to submit on Windows (WSL or native)

Same approach — edit `~/.claude/keybindings.json` (WSL) or `%USERPROFILE%\.claude\keybindings.json` (native), and add the same JSON.

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

![Custom keybindings file](./images/keybindings-json.png)
> What to expect: The `/keybindings` command opens the keybindings.json file in your `$EDITOR`. You'll see the current bindings as a JSON array. Add entries for commands you want to remap. Save and close — the changes take effect immediately in the current session.

---

## Setting Up Terminal for Shift+Enter (OS-specific)

On some systems, `Shift+Enter` in the VS Code integrated terminal may not work as a newline by default. Here's how to fix it per OS.

### macOS

In most cases this works out of the box. If not, try adding this to your VS Code `settings.json`:

```json
{
  "terminal.integrated.allowChords": true
}
```

### Linux (Ubuntu)

If your terminal doesn't handle `Shift+Enter` as a newline in Claude Code, you may need to configure the keybinding in VS Code's keyboard shortcuts:

1. Open `Ctrl+Shift+P` → "Open Keyboard Shortcuts (JSON)"
2. Add:
```json
{
  "key": "shift+enter",
  "command": "workbench.action.terminal.sendSequence",
  "args": { "text": "\n" },
  "when": "terminalFocus"
}
```

### Windows (Native)

Same approach as Linux above — configure via VS Code's keyboard shortcuts JSON.

### Windows (WSL)

WSL terminals inside VS Code typically handle `Shift+Enter` correctly because they run a Unix shell. If it doesn't work, use the same VS Code keyboard shortcuts fix as above, or configure Claude Code to use `Ctrl+Enter` for submit (as described in the customization section).

---

## Reference Card

Cut this out and keep it handy:

```
┌─────────────────────────────────────────────────────────┐
│             Claude Code VS Code Shortcuts               │
├─────────────────────────┬───────────────────────────────┤
│ macOS                   │ Windows / Linux               │
├─────────────────────────┼───────────────────────────────┤
│ Cmd+Shift+A             │ Ctrl+Shift+A   New session    │
│ Cmd+Shift+P             │ Ctrl+Shift+P   Command palette│
├─────────────────────────┴───────────────────────────────┤
│              (All platforms)                            │
├─────────────────────────┬───────────────────────────────┤
│ Enter                   │ Submit                        │
│ Shift+Enter             │ New line (no submit)          │
│ Ctrl+C                  │ Cancel / clear                │
│ Ctrl+D                  │ Exit session                  │
│ Shift+Tab               │ Cycle permission mode         │
│ Esc Esc                 │ Undo last change              │
│ Ctrl+G                  │ Open in $EDITOR               │
│ Ctrl+V / Cmd+V          │ Paste (incl. images)          │
│ Ctrl+O                  │ Toggle verbose output         │
│ ↑ / ↓                   │ Prompt history                │
└─────────────────────────┴───────────────────────────────┘
```

---

## Related

- [prompt-box.md](prompt-box.md) — Using the VS Code prompt panel
- [../keyboard-shortcuts.md](../keyboard-shortcuts.md) — Full keyboard shortcut reference (all interfaces)
- [settings-configuration.md](settings-configuration.md) — Configuring keybindings in settings.json
