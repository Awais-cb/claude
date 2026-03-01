# Clickable File Links in Responses

When Claude Code is connected to VS Code, every file and line number Claude mentions in a response becomes a clickable link. Click it — VS Code jumps directly to that file and line. No searching, no manual navigation.

---

## What It Looks Like

Claude's response:

```
The bug is in auth.ts:47 — the condition is inverted.
The token check should be `!isValid` instead of `isValid`.

I also noticed a related issue in middleware/session.ts:112 where
the expiry check is missing.
```

In VS Code, `auth.ts:47` and `middleware/session.ts:112` are clickable. One click takes you there.

---

## Why It Matters

Without IDE integration, you'd have to:
1. Read Claude's response
2. Remember the file name
3. Manually navigate to it in VS Code
4. Find the specific line

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

Click each link → jump to the exact line → fix it → move to the next.

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

Click each line → fix → done.

### Understanding a codebase

```
> how does the payment flow work from start to finish?
```

```
The payment flow starts in PaymentController.php:34 where the intent
is created, then passes through PaymentService.php:78 for validation,
calls the Stripe gateway in StripeGateway.php:102, and finally
records the transaction in Transaction.php:55.
```

Follow the flow by clicking through each link in order.

---

## Tips

- **Read first, click after** — skim Claude's full response to understand the scope, then use the links to navigate systematically
- **Links work in both the panel and the terminal** — whether you're using the VS Code prompt box or the integrated terminal, links are clickable
- **VS Code highlights the target line** — when you jump to a link, VS Code scrolls the line into view and highlights it momentarily
- **Use with `/review`** — code review becomes much faster when every issue links directly to the relevant line
- **Combine with selected code** — click a link to see the problem, select the code, ask Claude to fix it

---

## Troubleshooting

### Links are not clickable

Make sure Claude Code is connected via `claude --ide`. Without the IDE connection, file references are plain text.

### Link opens the wrong file

This can happen if there are multiple files with the same name. Claude uses the full path when possible — if the response only shows a short name, you may need to navigate manually or ask Claude to clarify the path.

---

## Related

- [selected-code-context.md](selected-code-context.md) — Send code back to Claude from links you've navigated to
- [file-references.md](file-references.md) — Reference files in your prompts with `@`
- [prompt-box.md](prompt-box.md) — The VS Code prompt panel where responses appear
