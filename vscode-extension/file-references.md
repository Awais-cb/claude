# File References with `@`

The `@` syntax lets you reference specific files or folders in your prompts. VS Code autocompletes the paths as you type, so you can point Claude at exactly the right code without copy-pasting paths or opening files first.

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

---

## Referencing Folders

You can reference an entire directory:

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
> @src/auth/login.ts and @src/auth/register.ts — these two files have duplicated validation logic, consolidate it into a shared helper
```

```
> @package.json @tsconfig.json — are there any version conflicts I should know about?
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

---

## Related

- [selected-code-context.md](selected-code-context.md) — Send highlighted code as context without `@`
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel
- [clickable-links.md](clickable-links.md) — Click links in Claude's responses to navigate to files
