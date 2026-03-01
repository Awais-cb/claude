# Laravel PR Review Workflow

How to use Claude Code to review pull requests in Laravel projects — catching Laravel-specific issues that generic code review misses: N+1 queries, unsafe migrations, mass assignment, missing ownership checks, and broken conventions.

---

## Why Review Laravel PRs with Claude First?

Human code review is valuable but limited by time. Claude catches the categories of bugs that are most common in Laravel:
- **N+1 queries** that look fine but destroy performance at scale
- **Missing `is_deleted` / `is_active` scope** on Eloquent queries
- **Mass assignment** vulnerabilities from a missing or too-broad `$fillable`
- **Missing ownership checks** — a user accessing another user's records
- **Unsafe migrations** — adding a NOT NULL column without a default on a live table
- **Broken service layer conventions** — exceptions thrown instead of `GenericResponse::fail()`
- **Queue jobs that aren't idempotent** — jobs that fail badly on retry

The goal: **zero review comments about things Claude could have caught.**

---

## 1. Quick PR Review (Before Opening the PR)

### Review your own changes

```
> compare my current branch to main using git diff.
  I've been working on the order cancellation feature.
  Review the changes for:
  - missing ownership checks (can a user cancel another user's order?)
  - N+1 queries in the controller or service
  - any column not in $fillable that's being mass-assigned
  - any thrown exceptions that should be GenericResponse::fail() instead
  - migrations that could fail on a live database
  Be specific with file names and line numbers. Rate each finding as CRITICAL / WARNING / SUGGESTION.
```

### Run the pre-review sequence

```bash
# Format code first
php artisan pint

# Run tests
php artisan test

# Then ask Claude to review
```

```
> /team-review
```

Or manually:
```
> review all my staged changes (git diff --cached).
  Apply the Laravel review checklist:
  1. Every model query on a user-owned resource must have a user_id WHERE clause
  2. All DB writes must be in transactions (beginTransaction/commit/rollBack)
  3. Services must return GenericResponse — never throw exceptions for business logic
  4. No raw DB queries with string interpolation (SQL injection risk)
  5. New migrations must have a working down() method
  Rate: CRITICAL / WARNING / SUGGESTION.
```

---

## 2. Reviewing a Colleague's PR

### Pull the PR and review it

```bash
# Using the GitHub CLI
gh pr checkout 247
```

```
> review this PR (branch: feat/order-cancellation).
  Context: this PR adds the ability for patients to cancel upcoming sessions.

  Read the changed files using: git diff main...HEAD

  Focus on:
  - Does the cancellation check that the session belongs to the requesting patient?
  - Is there a 24-hour cancellation window enforced, and is it tested?
  - Are any jobs/events dispatched for refunds or therapist notification?
  - Does the migration have a safe rollback?
  - Does the test cover the "wrong user" scenario?

  List findings as CRITICAL (must fix), WARNING (should fix), SUGGESTION (nice to have).
```

### Review multiple PRs in parallel

```
> review these 3 PRs in parallel using subagents:
  - PR #241: feat/coupon-system — adds coupon codes to checkout
  - PR #243: fix/notification-badge-count — fixes the unread badge not updating
  - PR #245: feat/therapist-availability-api — new API for fetching available slots

  For each:
  1. Run: gh pr diff [number]
  2. Apply the Laravel review checklist (ownership, N+1, GenericResponse, migrations, tests)
  3. Report: what it does, CRITICAL issues, WARNING issues, overall assessment

  Give me a summary table at the end.
```

---

## 3. Laravel-Specific Review Checklist

Use this checklist for every Laravel PR. Ask Claude to check each item:

```
> review PR #[number] against this Laravel-specific checklist:

  SECURITY:
  □ Ownership check: every query for user-owned data includes a WHERE user_id = auth()->id()
  □ Mass assignment: $fillable is explicitly defined (not $guarded = [])
  □ Input validation: all user input goes through a FormRequest or validated()
  □ No raw SQL with string interpolation — bindings only
  □ Auth middleware applied to all new routes that require it
  □ Role middleware applied where role-specific access is needed

  DATABASE:
  □ No N+1 queries — related models are eager loaded
  □ NotDeleted and IsActive scopes applied where appropriate
  □ New migrations have a complete and tested down() method
  □ Adding NOT NULL column to existing table → has a DEFAULT or is nullable first
  □ Large table migrations use chunking or are done without locking

  SERVICE LAYER:
  □ Services return GenericResponse — never throw exceptions for business logic
  □ DB writes are wrapped in DB::beginTransaction() / commit() / rollBack()
  □ SystemMessage is passed to GenericResponse::fail() for logging

  JOBS & QUEUES:
  □ Jobs implement ShouldQueue correctly
  □ Jobs are idempotent (safe to retry)
  □ Jobs have appropriate retry limits and backoff

  TESTS:
  □ New endpoint has a feature test covering happy path, validation errors, auth, and ownership
  □ New service method has a unit test covering happy path and failure cases
  □ Factories updated if new model columns were added

  CONVENTIONS:
  □ Controllers use JsonResponse class for all responses
  □ Models extend BaseModel and use DatabaseOperation
  □ Enums use UPPER_SNAKE_CASE with static accessor methods
  □ No logic in controllers that belongs in services
```

---

## 4. Focused Security Review

### Ownership and authorization audit

```
> read all new or changed controller methods in this PR (git diff main...HEAD -- app/Http/Controllers/).
  For each method:
  1. Does it fetch a model by ID? If so, does it verify the authenticated user owns it?
  2. Does it update or delete a record? Does it check ownership before modifying?
  3. Are there any admin-only operations that could be accessed by a regular user?
  Create a table: Method | Fetches By ID | Ownership Checked | Risk
```

### SQL injection check

```
> scan all changed PHP files for raw SQL queries.
  Find any DB::statement(), DB::select(), or whereRaw() calls that use string interpolation
  (e.g., "WHERE id = $id" or "WHERE id = " . $id).
  Flag each one as CRITICAL.
  Show the line and the safe fix using query bindings.
```

### Mass assignment audit

```
> read all Eloquent models added or changed in this PR.
  For each model:
  1. Is $fillable explicitly defined?
  2. Are there any sensitive fields (is_admin, role, balance, is_deleted) in $fillable?
  3. Is create() or update() called anywhere with unfiltered request data?
  Flag issues as CRITICAL.
```

---

## 5. Performance Review

### N+1 query detection

```
> read the controllers and services changed in this PR.
  Find any place where:
  - a loop calls a model method or relationship on each iteration
  - ->get() or ->all() is called and then relationships are accessed without eager loading
  - a Livewire component loads related models inside a loop

  For each N+1 found: show the problematic code and the fix using with() eager loading.
```

### Migration performance check

```
> read the new migration files in this PR.
  For each migration:
  1. Does it add an index to a column that will be queried?
  2. Does it modify a large table in a way that could lock it during deployment?
     (e.g., adding a NOT NULL column without a default, renaming a column)
  3. Is the operation safe to run on production during business hours?
  Flag any risky operations as WARNING with a suggested safe alternative.
```

---

## 6. Reading PR Comments and Fixing Them

### See what reviewers said

```bash
gh pr view 247 --comments
```

Then:

```
> the reviewer left these comments on PR #247:
  [paste comments from gh pr view output]

  Read the files mentioned and fix each comment.
  For each fix, explain what you changed and why.
  Don't change anything that isn't directly addressed by a comment.
```

### Address all comments at once

```bash
gh api repos/{owner}/{repo}/pulls/247/comments
```

```
> read all review comments on PR #247 (from the gh api output above).
  Group them by file. Fix each one in order.
  After fixing, list what was changed per comment.
```

---

## 7. Post-Review Summary

After a review, ask Claude to generate a structured summary you can post as a PR comment:

```
> I've reviewed PR #247 (feat/order-cancellation). Write a PR review comment
  that I can post on GitHub. Include:
  - 1-sentence summary of what the PR does
  - CRITICAL issues (blocking, must fix before merge)
  - WARNING issues (should fix, non-blocking)
  - SUGGESTIONS (optional improvements)
  - Overall assessment: Approve / Request Changes / Needs Discussion

  Be specific with file names and line numbers.
  Keep the tone constructive and professional.
```

Post it:

```bash
gh pr review 247 --comment --body "$(cat review.md)"
# or to formally request changes:
gh pr review 247 --request-changes --body "$(cat review.md)"
```

---

## 8. Making Review Part of the Laravel Team Culture

As a team lead, enforce Claude review as part of the PR process:

### PR template (`.github/pull_request_template.md`)

```markdown
## What this PR does
<!-- 1-2 sentences -->

## Pre-Review Checklist
- [ ] Ran `php artisan pint` — code formatted
- [ ] Ran `php artisan test` — all tests pass
- [ ] Ran Claude review — no CRITICAL findings unaddressed
- [ ] All new endpoints have feature tests (happy path + auth + ownership)
- [ ] Migrations have a working `down()` method
- [ ] No raw SQL with string interpolation

## Laravel Checklist
- [ ] Ownership checks on all user-owned resources
- [ ] Services return `GenericResponse` — no thrown exceptions
- [ ] DB writes wrapped in transactions
- [ ] No N+1 queries (eager loading used)
```

### Add a shared `/pr-review` skill

Create `.claude/skills/pr-review.md` in your project:

```markdown
---
name: pr-review
description: Reviews the current branch against main using the Laravel PR review checklist
---

Run: git diff main...HEAD

Review all changed files against this checklist:

CRITICAL (blocking):
- Missing ownership checks on user-owned resources
- Mass assignment with sensitive fields in $fillable
- Raw SQL with string interpolation
- Services throwing exceptions instead of returning GenericResponse::fail()
- Migrations adding NOT NULL without DEFAULT to existing tables

WARNING (should fix):
- N+1 queries (loops accessing unloaded relationships)
- Missing NotDeleted / IsActive scopes on Eloquent queries
- Jobs not idempotent (unsafe to retry)
- New endpoints without feature tests

SUGGESTION (nice to have):
- Missing eager loading optimizations
- Verbose code that could use existing helpers
- Inconsistent naming vs. codebase conventions

Report format:
1. Summary of changes
2. CRITICAL issues with file:line references
3. WARNING issues with file:line references
4. SUGGESTIONS
5. Overall: Approve / Request Changes
```

Then every developer runs:
```
> /pr-review
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| Self-review | `review git diff main...HEAD. apply Laravel checklist: ownership, N+1, GenericResponse, mass assignment, migrations.` |
| PR review | `review PR #[n]. context: [feature]. focus on: [areas]. rate CRITICAL/WARNING/SUGGESTION.` |
| Security audit | `read changed controllers. for each method: ownership checked? role enforced? raw SQL safe? rate as CRITICAL/WARNING.` |
| N+1 hunt | `find N+1 queries in changed controllers and services. show fix for each using with() eager loading.` |
| Migration check | `read new migrations. flag: NOT NULL without DEFAULT, missing down(), missing indexes, locking risk.` |
| Fix comments | `reviewer left comments: [comments]. read mentioned files and fix each. explain what changed.` |
| Post review | `write a professional PR review comment: summary, CRITICAL issues, WARNING issues, SUGGESTIONS, overall verdict.` |

---

## Tips

- **Always pull the branch before reviewing** — `gh pr checkout [n]` gives Claude the actual diff to read
- **Give context for every PR review** — "this PR adds coupon codes to checkout" gets better review than reviewing blind
- **Ask for severity ratings** — always include "rate as CRITICAL/WARNING/SUGGESTION" so the output is actionable
- **Run tests before asking Claude to review** — if tests are failing, fix them first; Claude's review focuses on logic, not broken builds
- **Use subagents for multiple PRs** — parallel review of 3-4 small PRs takes the same time as 1
- **Save reviews as comments** — post Claude's findings as a PR comment so the team sees the automated review
