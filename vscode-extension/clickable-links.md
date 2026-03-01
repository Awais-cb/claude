# Clickable File Links in Responses

When Claude Code is connected to VS Code, every file and line number Claude mentions in a response becomes a clickable link. Click it — VS Code jumps directly to that file and line. No searching, no manual navigation.

Think of it like footnotes in a research paper that, when you click them, teleport you directly to the exact paragraph being cited. Claude can review dozens of files and give you a list of issues, and you navigate to each one with a single click.

---

## What It Looks Like

Claude's response:

```
The bug is in auth.ts:47 — the condition is inverted.
The token check should be `!isValid` instead of `isValid`.

I also noticed a related issue in middleware/session.ts:112 where
the expiry check is missing.
```

In VS Code, `auth.ts:47` and `middleware/session.ts:112` appear as underlined or colored links. One click takes you there.

![Clickable links in Claude response](./images/clickable-links-response.png)
> What to expect: File references in Claude's responses appear as clickable hyperlinks (usually underlined or tinted in your theme's link color). Hovering over them may show a preview tooltip. Clicking navigates VS Code directly to that file and line number.

---

## Why It Matters

Without IDE integration, you'd have to:
1. Read Claude's response
2. Remember the file name
3. Manually navigate to it in VS Code (Ctrl+P or the file explorer)
4. Find the specific line (Ctrl+G or Ctrl+F)

With clickable links:
1. Read Claude's response
2. Click the link

This is especially useful when Claude reviews code across many files — you can follow along in the editor without losing your place in the response.

---

## What Makes a Link Clickable

Any of these patterns in Claude's response become navigable links when the extension is active:

| Pattern | Example |
|---------|---------|
| `filename.ext:line` | `auth.ts:47` |
| `path/to/file.ext:line` | `src/auth/auth.ts:47` |
| `path/to/file.ext` | `src/utils/helpers.php` (opens the file) |
| Markdown links | `[auth.ts:47](src/auth/auth.ts#L47)` |

Claude automatically formats references this way when it knows you're in an IDE session.

---

## When Links Appear

Links appear whenever Claude talks about specific places in your codebase. Common scenarios include:

- **Code review output** — Claude lists issues and their exact locations
- **Bug explanations** — Claude traces a bug through multiple files
- **Architecture explanations** — Claude walks you through a flow step by step
- **Refactoring suggestions** — Claude points to related code that also needs updating
- **Test results** — Claude reports failing tests and the source lines that triggered them
- **Security audits** — Claude identifies vulnerabilities with precise file/line references

---

## Real-World Scenarios

### Bug found during code review

```
> /review
```

Claude reviews your branch and responds:

```
Found 3 issues:

1. src/api/users.ts:88 — Missing await before async call
2. src/api/payments.ts:134 — Possible null dereference
3. tests/auth.test.ts:22 — Test doesn't clean up after itself
```

Click each link → jump to the exact line → fix it → move to the next. No tab-switching, no searching.

### Security review

```
> check the login flow for security issues
```

```
Potential issues found:

- auth/login.ts:45 — Password compared without constant-time check
- auth/session.ts:91 — Session token not rotated after login
- middleware/csrf.ts:12 — CSRF token not validated on state-changing routes
```

Click each line → fix → done. You've reviewed three files without once using `Ctrl+P` or the file explorer.

### Understanding a codebase you've just joined

```
> how does the payment flow work from start to finish?
```

```
The payment flow starts in PaymentController.php:34 where the intent
is created, then passes through PaymentService.php:78 for validation,
calls the Stripe gateway in StripeGateway.php:102, and finally
records the transaction in Transaction.php:55.
```

Follow the flow by clicking through each link in order. It's like a guided tour of the codebase.

### Tracing a bug across files

```
> the order confirmation email is not sending. What's wrong?
```

```
I found the issue. The email job is dispatched in OrderController.php:156,
but it references the wrong queue name. In config/queue.php:23, the
"notifications" queue is defined, but the job in SendOrderConfirmation.php:44
dispatches to "emails" (which doesn't exist). Change the queue name to
"notifications" in the job file.
```

Three links. Three clicks. Problem traced.

---

## Tips

- **Read first, click after** — skim Claude's full response to understand the scope, then use the links to navigate systematically
- **Links work in both the panel and the terminal** — whether you're using the VS Code prompt box or the integrated terminal, links are clickable
- **VS Code highlights the target line** — when you jump to a link, VS Code scrolls the line into view and may highlight it momentarily
- **Use with `/review`** — code review becomes much faster when every issue links directly to the relevant line
- **Combine with selected code** — click a link to see the problem, select that code, ask Claude to fix it
- **Middle-click to open in a new tab** — if you want to keep your current file open while also seeing the linked file, middle-click the link (behavior may vary by OS and VS Code version)

---

## Troubleshooting

### Links are not clickable

Make sure Claude Code is connected via `claude --ide`. Without the IDE connection, file references are plain text.

Check the connection:
```
> /ide
```

This shows whether VS Code is currently connected. If not, exit and restart with `claude --ide`.

### Link opens the wrong file

This can happen if there are multiple files with the same name in different directories. Claude uses the full path when possible — if the response only shows a short name like `helpers.ts`, there may be ambiguity. To fix:

```
> Which exact helpers.ts did you mean — src/utils/helpers.ts or lib/helpers.ts?
```

Claude will clarify and provide the full path.

### Links appear as plain text (no underline/color)

This is a theme or terminal rendering issue. Try:
1. Using the VS Code prompt panel instead of the terminal
2. Switching to a theme that renders links visually (most popular themes do)
3. Updating the Claude Code extension to the latest version

---

## Related

- [selected-code-context.md](selected-code-context.md) — Send code back to Claude from links you've navigated to
- [file-references.md](file-references.md) — Reference files in your prompts with `@`
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel where responses appear
