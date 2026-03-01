# File References with `@`

The `@` syntax lets you reference specific files or folders in your prompts. VS Code autocompletes the paths as you type, so you can point Claude at exactly the right code without copy-pasting paths or opening files first.

Think of it like tagging someone in a message. When you type `@src/services/AuthService.ts`, you're saying "hey Claude, look at *this specific file* when answering." Without `@`, Claude uses whatever context it currently has — which might be enough, but `@` makes it precise.

---

## Basic Usage

In the prompt box or terminal, type `@` followed by a file path:

```
> @src/components/LoginForm.tsx — add form validation
> @package.json — what testing framework are we using?
> @routes/web.php — list all GET routes
```

Claude reads the referenced file and uses it as context for the response.

---

## Autocomplete

When you type `@` in the VS Code prompt box, a file picker autocomplete dropdown appears. Navigate with:

- **Arrow keys** to move through suggestions
- **Tab** or **Enter** to select
- **Type more characters** to filter the list

This works for any file in your current workspace.

**Fuzzy matching** is supported — you don't need to type the exact filename. Typing `@auth` can match `auth.js`, `AuthService.ts`, `useAuth.tsx`, and so on. Claude Code ranks matches by relevance, so the most likely file appears at the top.

![@ autocomplete dropdown](./images/file-reference-autocomplete.png)
> What to expect: As soon as you type `@` followed by a few letters, a dropdown appears showing matching files from your project. Files are sorted by recent activity, so the files you've been working with appear near the top.

---

## Line Range References

To reference a specific range of lines within a file, press `Option+K` (Mac) or `Alt+K` (Windows/Linux) when the cursor is in the prompt box. This inserts an @-mention with the line range included, for example:

```
@src/app.ts#5-10
```

This tells Claude to look specifically at lines 5 through 10 of `app.ts`, rather than the entire file. This is especially useful for large files where you want to focus Claude on a precise location — a particular function, a route definition, or a block of config.

---

## Path Separators: A Note for Windows Users

On macOS and Linux, file paths use forward slashes:
```
@src/components/LoginForm.tsx
```

On Windows, the native path separator is a backslash (`\`), but when working with VS Code and Claude Code — especially in WSL — you should use **forward slashes** in `@` references:
```
@src/components/LoginForm.tsx    ✓ Works everywhere
@src\components\LoginForm.tsx    ✗ May cause issues
```

**Windows (WSL):** Since WSL uses the Linux filesystem, paths look like:
```
@home/user/projects/my-app/src/components/LoginForm.tsx
```
But because you're running from your project root, you typically just use the relative path:
```
@src/components/LoginForm.tsx
```

**Windows (Native PowerShell):** Use forward slashes in `@` references even when on Windows:
```
@src/components/LoginForm.tsx
```
Claude Code normalizes these paths internally.

---

## Referencing Folders

You can reference an entire directory. When referencing folders, include a **trailing slash** to make clear you're pointing at a directory rather than a file prefix:

```
> @src/services/ — which service handles payment processing?
> @tests/ — what's the test coverage strategy here?
> @app/Models/ — list all Eloquent models and their relationships
```

Claude reads the directory contents and uses all relevant files as context.

---

## Multiple References in One Prompt

Chain multiple `@` references in a single message:

```
> @src/auth/login.ts and @src/auth/register.ts — these two files have
  duplicated validation logic, consolidate it into a shared helper
```

```
> @package.json @tsconfig.json — are there any version conflicts I should know about?
```

```
> @app/Http/Controllers/UserController.php @app/Models/User.php @app/Services/UserService.php
  — trace how a user creation request flows through these three layers
```

---

## When to Use `@` vs. Just Asking

**Use `@`** when:
- You want Claude to focus on a specific file (not guess which one)
- The file isn't currently open in your editor
- You're referencing a config or dependency file that provides context
- You want to mention multiple specific files

**Just ask naturally** when:
- The file is currently open and selected — Claude already sees it
- You've highlighted the relevant code — Claude has it as context
- You want Claude to search for the right file itself

**Combine both** when you want maximum precision:
```
[Select a function in UserController.php]
> @app/Models/User.php — refactor this function to use the User model's methods
```

---

## Practical Examples

### Explain a specific file

```
> @src/middleware/auth.js — walk me through what this middleware does step by step
```

### Modify a file with precise context

```
> @app/Http/Controllers/UserController.php — add a method to export users as CSV
```

### Compare two files

```
> @config/payment.php @config/payment.staging.php — what's different between these two configs?
```

### Use a config file as context

```
> @.env.example — which of these environment variables am I missing in my .env?
```

### Reference a folder for a holistic task

```
> @database/migrations/ — summarize what schema changes have been made in the last 10 migrations
```

### Onboard Claude on a new codebase

```
> @src/ — I'm new to this project. Give me a guided tour: what does each major folder do,
  what are the key patterns used, and what should I understand before making changes?
```

### Cross-reference two related files

```
> @src/api/endpoints.ts @src/api/middleware.ts — the middleware applies rate limiting,
  but I think the POST /auth/login endpoint is exempt. Can you confirm and show me why?
```

---

## `@` in the Terminal

The `@` reference syntax works in the terminal too (not just the VS Code prompt box):

```bash
claude --ide
> @src/utils/helpers.ts — are there any functions here that could be replaced with native JS?
```

---

## Tips

- **Paths are relative to your project root** — you don't need to type the full absolute path
- **Autocomplete shows recently edited files first** — so your active files are always at the top
- **You can mix `@` references with natural language** — write prompts as you normally would, and drop in `@file` where specific context helps
- **Folder references are great for onboarding** — `@src/ — give me an overview of this codebase` is a quick way to orient Claude on a new project
- **Use `@` for files outside your current tab** — if you're editing `UserController.php` but need Claude to also check `UserService.php`, use `@` to pull in the service file without switching tabs

---

## Related

- [selected-code-context.md](selected-code-context.md) — Send highlighted code as context without `@`
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [clickable-links.md](clickable-links.md) — Click links in Claude's responses to navigate to files
