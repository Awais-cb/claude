# The VS Code Prompt Box

When Claude Code is connected to VS Code via `claude --ide`, a prompt panel appears inside your editor. This is the primary way to interact with Claude without leaving VS Code.

Imagine having a chat window embedded directly in your code editor — not in a separate browser tab, not in an external app, but right there alongside your code. You highlight a function, ask a question, and the answer appears a few inches away from what you're looking at. That's the prompt box.

---

## What It Is

The prompt box is a text input panel embedded in VS Code that sends messages directly to your Claude Code session. It behaves exactly like typing in the terminal, but lives inside the editor UI — so you never have to switch focus away from your code.

```
┌─────────────────────────────────────────────────┐
│   VS Code Editor                                │
│                                                 │
│   ┌──────────────────────┐                      │
│   │  your-file.ts        │                      │
│   │  ─────────────────── │                      │
│   │  function login() {  │                      │
│   │    ...               │                      │
│   │  }                   │                      │
│   └──────────────────────┘                      │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │  Claude Code                            │   │
│   │  ─────────────────────────────────────  │   │
│   │  Claude: The login function is missing  │   │
│   │  error handling. Here's what to add...  │   │
│   │                                         │   │
│   │  > [your prompt here]            [Send] │   │
│   └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

![Claude Code Prompt Box in VS Code](./images/prompt-box-overview.png)
> What to expect: The Claude Code panel appears as a docked panel at the bottom or side of VS Code. It shows Claude's responses above and a text input field at the bottom where you type your prompts.

---

## Opening the Prompt Panel

### Option 1: Command Palette

| OS | Shortcut |
|----|----------|
| macOS | `Cmd+Shift+P` |
| Windows / Linux | `Ctrl+Shift+P` |

Then type:
```
Claude Code
```

Select **Claude Code: Open Panel** (or similar) from the list.

### Option 2: Keyboard Shortcut

```
Ctrl+Shift+A
```

Opens a new Claude Code session directly. This shortcut works on all operating systems.

### Option 3: It Opens Automatically

When you run `claude --ide`, the panel opens automatically once the connection is established. On most setups this is instant — you'll see the panel appear within a second or two.

---

## Submitting Prompts

Type your message in the input field and press `Enter` to submit.

```
> Why is the calculateTotal function returning NaN?
> Add input validation to the registration form
> Explain how the middleware stack works in this project
```

### Multi-line input

Sometimes you need to write a longer prompt with line breaks — for example, describing a bug with multiple steps to reproduce. Here's how to insert a newline without submitting:

| OS | Method |
|----|--------|
| All (default) | `Shift+Enter` |
| Customized via keybindings | `Enter` (if you've swapped submit to `Ctrl+Enter`) |

**Setting up Shift+Enter in VS Code's terminal (if it's not working):**

The behavior of `Shift+Enter` depends on your terminal emulator settings. In VS Code's integrated terminal, it should work by default. If it doesn't:

1. Open VS Code settings (`Ctrl+,` / `Cmd+,`)
2. Search for "terminal integrated"
3. Look for keybinding configurations, or use `Ctrl+Shift+P` → "Open Keyboard Shortcuts (JSON)"

Alternatively, configure Claude Code's keybindings to use `Ctrl+Enter` for submit and `Enter` for newlines — see [keyboard-shortcuts.md](keyboard-shortcuts.md) for details.

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
| Paste screenshots | Ctrl+V (image) → `> What's causing this error?` |

---

## Realistic Prompt Examples

### Debugging

```
> I'm getting a "Cannot read property 'id' of undefined" error on line 47 of UserController.
  The request comes in with a valid body but something is null. What's happening?
```

### Explaining unfamiliar code

```
> I just joined this project and I'm looking at the payment service.
  @src/services/PaymentService.ts — can you walk me through how this works,
  what it depends on, and what could go wrong?
```

### Making a targeted change

```
> @src/api/users.ts — the GET /users endpoint returns all fields including
  password_hash and internal_id. Strip those out before returning the response.
```

### Code review before committing

```
> I've just finished implementing user registration. Before I commit,
  can you review what I've changed and flag anything that looks wrong?
  Focus on security and edge cases.
```

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
| Paste images from clipboard | Yes | Yes |

Both work identically for Claude's capabilities. The prompt box is more convenient if you prefer staying in the editor UI. The terminal is useful if you want to see raw output or combine Claude with other shell commands.

---

## Cancelling and Clearing

| Action | Shortcut |
|--------|----------|
| Cancel current operation | `Ctrl+C` |
| Clear input | `Ctrl+C` (when input is empty) |
| Exit session | `Ctrl+D` |
| Clear terminal screen | `Ctrl+L` |

---

## Pasting Content

- **Text**: Standard paste (`Ctrl+V` on Windows/Linux, `Cmd+V` on macOS)
- **Images/Screenshots**: Paste images from clipboard — Claude can analyze them

Pasting an image lets you ask Claude things like:

```
> [paste screenshot of an error message]
> What's causing this error and how do I fix it?
```

```
> [paste screenshot of a UI design mockup]
> Can you generate the HTML and CSS for this layout?
```

This works on all platforms as long as the image is in your clipboard. On macOS, `Cmd+Shift+4` takes a screenshot directly to clipboard. On Windows, `Win+Shift+S` does the same. On Linux, `Flameshot` or `scrot` can be configured similarly.

---

## Prompt History

Use the `↑` / `↓` arrow keys to navigate through previous prompts in the session, the same as in a terminal. This is handy for:
- Re-running a prompt with small modifications
- Repeating a frequently used command like `> run the tests`
- Going back to see what you asked earlier in a long session

---

## Tips

- **Keep the panel pinned** — drag it to a sidebar or bottom panel so it stays visible while you edit. Right-click the panel title bar for docking options.
- **Use the split view** — put code on the left, prompt box on the right for a side-by-side workflow. See [workflow-tips.md](workflow-tips.md) for layout setups.
- **The prompt box and terminal are the same session** — you can alternate between them freely. Typing in one affects the state of the other.
- **Select code before typing your prompt** — the selection context is captured at the moment you submit, so you can type your full question and then submit, not just at the moment you start typing.

---

## Related

- [file-references.md](file-references.md) — `@filename` autocomplete in the prompt box
- [selected-code-context.md](selected-code-context.md) — How highlighted code becomes context
- [keyboard-shortcuts.md](keyboard-shortcuts.md) — All shortcuts available in VS Code sessions
