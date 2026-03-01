# Selected Code as Context

When Claude Code is connected to VS Code, any code you highlight in the editor is automatically sent to Claude as context. You don't need to copy-paste, reference a file with `@`, or describe what you're looking at — Claude just sees it.

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

## What Gets Sent

When you have a selection active:
- **The selected text** is included verbatim
- **The file name and path** are included (so Claude knows where the code lives)
- **Your prompt** is combined with the selection

If you have no active selection, Claude falls back to the **currently open file** as context.

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

---

## No Selection? Claude Uses the Open File

If nothing is selected, Claude is still IDE-aware — it knows which file you have open and can use that as context:

```
[No selection, auth.ts is your active tab]
> What does this file do?
> Add error handling to the login function
```

Claude reads the file directly, but having a selection focuses it on exactly what you care about.

---

## Selections Work Across Files

If you switch files mid-session, Claude picks up the new context. The most recently active selection or file is what Claude sees.

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

---

## Tips

- **Select tightly** — highlight the exact lines you're asking about, not the whole file. Claude gives better answers with focused context.
- **Select, then type** — the selection stays active while you type in the prompt box. You don't lose it when you click the prompt.
- **Use it for code review** — select a function, ask `> any issues with this?` for a quick sanity check as you write code.
- **Works during refactors** — select the old version of a function and ask `> rewrite this to be async` — Claude makes the change in context.

---

## Related

- [file-references.md](file-references.md) — Reference files explicitly with `@`
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [clickable-links.md](clickable-links.md) — Navigate to files and lines from Claude's responses
