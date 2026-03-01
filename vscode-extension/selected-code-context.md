# Selected Code as Context

When Claude Code is connected to VS Code, any code you highlight in the editor is automatically sent to Claude as context. You don't need to copy-paste, reference a file with `@`, or describe what you're looking at — Claude just sees it.

Think of it like showing your colleague something on your screen by pointing at it. Normally you'd have to describe it or paste it into a chat. With IDE integration, you just highlight the code and ask your question — Claude already has eyes on what you're pointing at.

---

## How It Works

1. **Select code** in your VS Code editor (click and drag, or use keyboard selection)
2. **Ask Claude anything** in the prompt box
3. Claude receives your selection as part of the prompt automatically

```
[You highlight a 40-line function in payment.ts]

> Why does this throw an error when the currency is EUR?

Claude analyzes the selected function and answers directly.
```

No extra steps. No copying. The selection is the context.

---

## How to Select Code

### macOS

| Method | How |
|--------|-----|
| Click and drag | Click at the start, drag to end |
| Keyboard selection | Hold `Shift` + arrow keys |
| Select a line | `Cmd+Shift+K` selects the line; or click line number |
| Select a block | `Option+Shift+Click` for column selection |
| Select matching | `Cmd+D` to select word, repeat for next match |
| Select all in file | `Cmd+A` |

### Windows / Linux

| Method | How |
|--------|-----|
| Click and drag | Click at the start, drag to end |
| Keyboard selection | Hold `Shift` + arrow keys |
| Select a line | `Ctrl+Shift+K` selects/deletes a line |
| Select a block | `Alt+Shift+Click` for column selection |
| Select matching | `Ctrl+D` to select word, repeat for next match |
| Select all in file | `Ctrl+A` |

### Efficient selection techniques for code

- **Select a function**: Place cursor inside it, then use `Ctrl+Shift+[` (or `Cmd+Shift+[` on macOS) to collapse/expand, or manually select from the function signature to its closing brace
- **Select a block by indentation**: Click the opening line, then `Shift+Click` the closing line
- **Select to end of line**: `Shift+End` (Windows/Linux) or `Shift+Cmd+Right` (macOS)

---

## What Gets Sent

When you have a selection active:
- **The selected text** is included verbatim
- **The file name and path** are included (so Claude knows where the code lives)
- **Your prompt** is combined with the selection

If you have no active selection, Claude falls back to the **currently open file** as context.

```
┌──────────────────────────────────────────────────┐
│  What Claude receives when you ask a question    │
│                                                  │
│  ┌──────────────────────────────────────────┐    │
│  │  File: src/services/PaymentService.ts    │    │
│  │  Lines: 45-82 (your selection)           │    │
│  │                                          │    │
│  │  [selected code appears here]            │    │
│  └──────────────────────────────────────────┘    │
│  +                                               │
│  ┌──────────────────────────────────────────┐    │
│  │  Your prompt: "Why does this throw..."   │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

![Selected code as context in VS Code](./images/selected-code-context.png)
> What to expect: When you highlight code in the editor, the VS Code extension automatically includes it as context in your next prompt. You'll see the selection highlighted in blue (or your theme's highlight color), and Claude's response will reference the specific lines you selected.

---

## Practical Use Cases

### Debug a specific piece of code

```
[Select the problematic function]
> This is throwing a NaN — what's wrong?
```

### Get an explanation

```
[Select an unfamiliar block of code]
> Explain what this does in plain English
```

### Ask for improvements

```
[Select a function]
> How would you refactor this to be more readable?
```

### Write a test for selected code

```
[Select a function]
> Write a unit test for this
```

### Check for bugs or edge cases

```
[Select a function]
> What edge cases does this not handle?
```

### Ask about performance

```
[Select a loop or query]
> Is this efficient? How could it be faster?
```

### Get security feedback

```
[Select form handling or auth code]
> Is there any security issue with this?
```

### Translate a pattern to another approach

```
[Select a callback-based function]
> Rewrite this using async/await instead of callbacks
```

### Ask Claude to document it

```
[Select a function with no comments]
> Write JSDoc comments for this function
```

---

## No Selection? Claude Uses the Open File

If nothing is selected, Claude is still IDE-aware — it knows which file you have open and can use that as context:

```
[No selection, auth.ts is your active tab]
> What does this file do?
> Add error handling to the login function
```

Claude reads the file directly, but having a selection focuses it on exactly what you care about. Think of the difference between asking "what's in this room?" versus pointing at a specific drawer and asking "what's in here?"

---

## Selections Work Across Files

If you switch files mid-session, Claude picks up the new context. The most recently active selection or file is what Claude sees.

```
1. Select code in auth.ts → ask a question → Claude sees auth.ts code
2. Switch to UserController.php → select a method → ask a question → Claude sees UserController.php code
```

---

## Combining Selection with `@` References

You can use both at once for richer context:

```
[Select a function in UserController.php]
> @app/Models/User.php — refactor this function to use the User model's existing methods
```

Claude has:
- Your selected code (the function you highlighted)
- The `@` referenced file (the User model)

This is particularly powerful when you want Claude to understand how two parts of the codebase relate to each other, without switching away from the file you're editing.

---

## Tips

- **Select tightly** — highlight the exact lines you're asking about, not the whole file. Claude gives better answers with focused context.
- **Select, then type** — the selection stays active while you type in the prompt box. You don't lose it when you click the prompt.
- **Use it for code review** — select a function, ask `> any issues with this?` for a quick sanity check as you write code.
- **Works during refactors** — select the old version of a function and ask `> rewrite this to be async` — Claude makes the change in context.
- **Visual indicator**: On most themes, your selection will remain highlighted while you type your prompt — a good visual confirmation that Claude will see it.

---

## Related

- [file-references.md](file-references.md) — Reference files explicitly with `@`
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [clickable-links.md](clickable-links.md) — Navigate to files and lines from Claude's responses
