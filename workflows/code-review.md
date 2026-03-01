# Code Review Workflow

How to use Claude to review code before a human ever sees it — catching bugs, security issues, and style violations automatically.

---

## Why Review with Claude First?

Human code review is valuable but expensive — it takes focus, time, and another person's attention. Claude can catch 80% of common issues in seconds, so that human review can focus on architecture decisions and business logic.

The goal: **zero review comments about things Claude could have caught.**

---

## 1. Pre-Commit Review (Every Developer, Every Commit)

Run this before every `git add`:

### Quick check
```
> /diff
```
See all changes. Then:
```
> /team-review
```
Runs your team's code review skill (see [team-lead-setup.md](team-lead-setup.md) for how to set this up).

### Full pre-commit sequence
```
> /check          # lint + typecheck + tests
> /team-review    # team code review checklist
> /diff           # final visual review
> /pr             # commit + push + open PR
```

---

## 2. Self-Review Before Opening a PR

### General code quality
```
> review everything I've changed in this branch (compare to main).
  focus on:
  - logic errors and edge cases I might have missed
  - error handling gaps
  - performance concerns
  - anything that looks fragile or easy to break
  be specific with file names and line numbers.
```

### Security-focused review
```
> /security-review
```

Or a more targeted review:
```
> review the auth-related changes in this branch for security issues:
  - are JWT tokens validated correctly?
  - could any endpoint be accessed without proper authorization?
  - is user input validated before it reaches the database?
  - are there any SQL injection or XSS risks?
  check @src/middleware/auth.ts and all new route files.
```

### Architecture review
```
> review the architectural decisions in my changes:
  - am I putting business logic in the right layers? (controllers vs services vs repositories)
  - are there any circular dependencies?
  - is anything too tightly coupled?
  - does my approach align with the patterns in the rest of the codebase?
  compare against the conventions described in CLAUDE.md.
```

---

## 3. Reviewing a Pull Request (As the Reviewer)

### Review another developer's PR
```
> /review 247
```

Or with more context:
```
> review PR #247. context: this PR adds the coupon code feature to checkout.
  focus on:
  - the coupon validation logic in OrderService (is it airtight?)
  - race conditions (two users using the same coupon simultaneously)
  - security (can coupons be applied multiple times?)
  - test coverage (are edge cases tested?)
```

### Review PR comments and address them
```
> /pr-comments 247
```

Then:
```
> the reviewer left 4 comments on PR #247. read them and fix each one.
  explain what you're changing for each.
```

### Batch review (multiple small PRs)
```
> review these 3 PRs in parallel using subagents:
  - PR #241: bugfix for date formatting
  - PR #243: add caching to the products endpoint
  - PR #245: update user profile form validation
  give me a summary of each with any issues found.
```

---

## 4. Security Review

### Full security audit of a feature

```
> do a thorough security audit of the user authentication system:
  @src/routes/auth.ts — login, register, refresh, logout endpoints
  @src/middleware/auth.ts — JWT verification middleware
  @src/services/UserService.ts — password hashing and validation

  Check for:
  - brute force protection (rate limiting)
  - password hashing (algorithm, salt rounds)
  - JWT: algorithm, expiry, secret strength, token revocation
  - session fixation after login
  - timing attacks on password/token comparison
  - information leakage in error messages
  - missing auth on any endpoint that should be protected
```

### API security audit

```
> audit all API endpoints for authorization issues.
  read @src/routes/ and for each endpoint check:
  - does it require authentication?
  - does it verify the user can only access their own data?
  - are there any admin-only endpoints accessible to regular users?
  - is input validated before it reaches the DB?

  create a table: Endpoint | Auth Required | User Scoped | Input Validated | Issues
```

### Dependency security check

```
> run npm audit and analyze the results.
  for each vulnerability:
  - is it exploitable in our codebase? (does our code use the vulnerable function?)
  - what's the fix?
  - how critical is it to fix immediately vs next sprint?
  provide a prioritized remediation plan.
```

---

## 5. Performance Review

### Find performance issues in a file

```
> analyze @src/services/ReportService.ts for performance issues:
  - N+1 database queries
  - missing database indexes (suggest what to add)
  - expensive computations that could be cached
  - synchronous operations that should be async
  - large data sets loaded entirely into memory
```

### Analyze a slow endpoint

```
> the GET /api/dashboard endpoint takes 2-3 seconds.
  read @src/routes/dashboard.ts, @src/services/DashboardService.ts,
  and @src/repositories/DashboardRepository.ts.

  profile the code path mentally:
  - how many DB queries happen?
  - are there any N+1s?
  - what data is being loaded that might not be needed?
  - what could be cached?
  propose optimizations in order of expected impact.
```

### Frontend performance audit

```
> audit @src/pages/DashboardPage.tsx for render performance:
  - components that re-render unnecessarily
  - expensive operations in render (should be memoized)
  - large lists without virtualization
  - images without lazy loading
  - missing React.memo, useMemo, or useCallback where appropriate
  show the issue, explain why it matters, and provide the fix.
```

---

## 6. Code Quality Review

### Complexity review

```
> read @src/services/OrderService.ts and identify:
  - functions over 30 lines that should be split
  - nested if statements over 3 levels deep
  - functions doing more than one thing
  - duplicated logic that should be extracted
  suggest specific refactors for each.
```

### TypeScript quality

```
> audit @src/ for TypeScript quality issues:
  - uses of 'any' that could be typed properly
  - missing return types on exported functions
  - type assertions (as Type) that could be avoided with proper typing
  - overly broad types (string instead of union literals, object instead of interface)
  propose fixes in order of impact.
```

### Code consistency

```
> compare how error handling is done across our route files in @src/routes/.
  are there inconsistencies? some routes catch errors differently than others?
  propose a consistent pattern and identify what needs updating.
```

---

## 7. Review Checklist as a Skill

Create `.claude/skills/team-review.md` for your team's specific standards (see [team-lead-setup.md](team-lead-setup.md)). Then every developer can run:

```
> /team-review
```

And get a structured pass/fail report against your team's exact standards.

---

## 8. Post-Merge Review (Retrospective)

After a sprint, review what went into production:

```
> compare the main branch now vs 2 weeks ago (run git log --oneline --since="2 weeks ago").
  summarize what changed and identify:
  - any patterns of issues that came up repeatedly in these changes
  - areas of the codebase that changed most often (churn)
  - any technical debt that accumulated
  this is for our retrospective discussion.
```

---

## Review Severity Levels

When Claude reviews code, ask it to categorize findings:

```
> review @src/routes/payments.ts.
  categorize each finding as:
  - CRITICAL: must fix before merge (security issues, data loss risk, broken functionality)
  - WARNING: should fix before merge (performance, error handling gaps, unclear code)
  - SUGGESTION: nice to fix but can be a follow-up (style, minor improvements)
```

---

## Prompt Library

| Review type | Prompt |
|-------------|--------|
| Pre-commit | `/diff` then `/team-review` then `/check` |
| Full self-review | `review my branch changes vs main. focus on: logic errors, error handling, performance, fragility.` |
| Security | `/security-review` or `audit [files] for: [specific security concerns]` |
| PR as reviewer | `/review [PR#]` or `review PR #[n]. context: [feature]. focus: [areas]` |
| Address comments | `/pr-comments [PR#]` then `read and fix each comment` |
| Performance | `analyze @[file] for: N+1 queries, missing indexes, unnecessary computation, caching opportunities` |
| TypeScript | `audit @src/ for: any types, missing return types, type assertions, overly broad types` |
| Architecture | `review my changes for: layer violations, coupling, consistency with CLAUDE.md conventions` |
| Post-sprint | `summarize what changed in the last 2 weeks. identify patterns, churn, and accumulated debt.` |

---

## Making Review Part of the Culture

As a team lead, make Claude review part of the PR process:

1. **Every PR must pass `/check`** — add it to your PR template as a checklist item
2. **Every PR should run `/team-review`** — commit the skill to `.claude/skills/` so everyone has it
3. **Security changes must pass `/security-review`** — auth, payments, user data changes always
4. **PR description is Claude-generated** — `> /pr` writes a better PR description than most developers would manually

```markdown
<!-- PR template: .github/pull_request_template.md -->
## Pre-Review Checklist
- [ ] Ran `/check` — lint, types, and tests all pass
- [ ] Ran `/team-review` — no CRITICAL or WARNING findings unaddressed
- [ ] Ran `/security-review` (if auth/payments/user data was changed)
- [ ] PR description generated with `/pr` or manually matches the same standard
```
