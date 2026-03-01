# The VS Code Prompt Box

When Claude Code is connected to VS Code via `claude --ide`, a prompt panel appears inside your editor. This is the primary way to interact with Claude without leaving VS Code.

---

## What It Is

The prompt box is a text input panel embedded in VS Code that sends messages directly to your Claude Code session. It behaves exactly like typing in the terminal, but lives inside the editor UI — so you never have to switch focus away from your code.

---

## Opening the Prompt Panel

### Option 1: Command Palette

Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS), then type:

```
Claude Code
```

Select **Claude Code: Open Panel** (or similar) from the list.

### Option 2: Keyboard Shortcut

```
Ctrl+Shift+A
```

Opens a new Claude Code session directly.

### Option 3: It Opens Automatically

When you run `claude --ide`, the panel opens automatically once the connection is established.

---

## Submitting Prompts

Type your message and press `Enter` to submit.

```
> Why is the calculateTotal function returning NaN?
> Add input validation to the registration form
> Explain how the middleware stack works in this project
```

### Multi-line input

To add a newline without submitting, use `Shift+Enter` (depending on your terminal configuration inside VS Code).

---

## What You Can Do from the Prompt Box

Everything you can do in the terminal, you can do from the prompt box:

| Action | Example |
|--------|---------|
| Ask questions | `> What does the auth middleware do?` |
| Request edits | `> Refactor this function to use async/await` |
| Reference files | `> @src/api/users.ts — add pagination support` |
| Run slash commands | `> /diff` |
| Ask about selections | Select code → `> Why is this slow?` |
| Request commits | `> commit the changes with a descriptive message` |
| Run tests | `> run the test suite and fix failures` |

---

## The Prompt Box vs. the Terminal

| Feature | Prompt Box | Terminal |
|---------|-----------|----------|
| Send prompts | Yes | Yes |
| Selected code as context | Yes (automatic) | Yes (automatic if `--ide` used) |
| File references with `@` | Yes, with autocomplete | Yes |
| Clickable links in responses | Yes | Yes (in VS Code terminal) |
| IDE status indicator | Yes | No |
| Can see Claude's output | In the panel | In the terminal |
| Slash commands | Yes | Yes |

Both work identically for Claude's capabilities. The prompt box is just more convenient if you prefer staying in the editor UI.

---

## Cancelling and Clearing

| Action | Shortcut |
|--------|----------|
| Cancel current operation | `Ctrl+C` |
| Clear input | `Ctrl+C` (when input is empty) |
| Exit session | `Ctrl+D` |

---

## Pasting Content

- **Text**: Standard paste (`Ctrl+V`)
- **Images/Screenshots**: `Ctrl+V` pastes images from clipboard — Claude can analyze them

Pasting an image lets you ask Claude things like:

```
> [paste screenshot of an error]
> What's causing this error and how do I fix it?
```

---

## Prompt History

Use the `↑` / `↓` arrow keys to navigate through previous prompts in the session, the same as in a terminal.

---

## Tips

- **Keep the panel pinned** — drag it to a sidebar or bottom panel so it stays visible while you edit
- **Use the split view** — put code on the left, prompt box on the right for a side-by-side workflow
- **The prompt box and terminal are the same session** — you can alternate between them freely

---

## Related

- [file-references.md](file-references.md) — `@filename` autocomplete in the prompt box
- [selected-code-context.md](selected-code-context.md) — How highlighted code becomes context
- [keyboard-shortcuts.md](keyboard-shortcuts.md) — All shortcuts available in VS Code sessions
