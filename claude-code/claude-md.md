# CLAUDE.md — Project Instructions

`CLAUDE.md` is a special markdown file that Claude Code reads automatically when you start a session in your project. Use it to teach Claude about your project so it doesn't need to re-learn everything each time.

---

## What is CLAUDE.md?

Think of it as a README for Claude — instructions that get injected into every conversation automatically.

Without CLAUDE.md, you'd have to tell Claude things like "we use TypeScript", "run tests with `npm test`", or "never use `var`" every single time. With CLAUDE.md, Claude knows all of this from the start.

---

## Quick Start

### Generate one automatically

```
> /init
```

Claude analyzes your project and generates a CLAUDE.md for you.

### Or create one manually

```bash
touch CLAUDE.md
```

Then add instructions:

```markdown
# My Project

## Tech Stack
- TypeScript + React frontend
- Node.js + Express backend
- PostgreSQL database

## Commands
- `npm test` — run tests
- `npm run build` — build for production
- `npm run lint` — lint code

## Coding Rules
- Always use TypeScript (never plain JS)
- Use `async/await`, not `.then()` chains
- All functions must have return type annotations
```

---

## Where Claude Looks for CLAUDE.md

Claude loads CLAUDE.md files from multiple locations, in order of priority:

```
~/.claude/CLAUDE.md           ← Your personal rules (all projects)
./CLAUDE.md                   ← Project root (most common)
./.claude/CLAUDE.md           ← Hidden project config
./CLAUDE.local.md             ← Local overrides (add to .gitignore)
```

**Sub-directory CLAUDE.md files** are loaded on demand — when Claude accesses files in that folder.

```
my-project/
├── CLAUDE.md                 ← Main project instructions
├── frontend/
│   └── CLAUDE.md             ← Frontend-specific rules
├── backend/
│   └── CLAUDE.md             ← Backend-specific rules
```

---

## What to Put in CLAUDE.md

### 1. Project Overview

```markdown
## Project
E-commerce platform built with Next.js and Prisma.
Main entry: `src/app/page.tsx`
```

### 2. Tech Stack

```markdown
## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM + PostgreSQL
- Tailwind CSS
- Vitest for testing
```

### 3. Common Commands

```markdown
## Commands
- `npm run dev` — start dev server (port 3000)
- `npm test` — run Vitest tests
- `npx prisma migrate dev` — run DB migrations
- `npm run lint` — ESLint
```

### 4. Coding Conventions

```markdown
## Conventions
- 2-space indentation
- Single quotes for strings
- Named exports only (no default exports)
- Filename: kebab-case for files, PascalCase for components
```

### 5. Things to Avoid

```markdown
## Do Not
- Never use `console.log` in production code (use the `logger` utility)
- Don't use `any` type in TypeScript
- Don't commit `.env` files
```

### 6. Project Structure

```markdown
## Key Files
- `src/lib/db.ts` — database client
- `src/lib/auth.ts` — authentication helpers
- `src/components/ui/` — reusable UI components
- `src/app/api/` — API route handlers
```

---

## Including Other Files

Use `@` to import another file's content into CLAUDE.md:

```markdown
# My Project

@docs/architecture.md
@docs/api-conventions.md
```

This is useful for keeping documentation in separate files while making it all available to Claude.

---

## CLAUDE.md vs .claude/rules/

For more granular control, you can use `.claude/rules/` to apply instructions only to specific files:

```
.claude/
└── rules/
    ├── frontend.md       ← Rules for frontend files
    ├── backend.md        ← Rules for backend files
    └── tests.md          ← Rules for test files
```

Each rules file has a YAML frontmatter that specifies which files it applies to:

```markdown
---
globs: ["src/components/**/*.tsx", "src/pages/**/*.tsx"]
---

# Frontend Rules
- Use Tailwind classes, never inline styles
- All components must have a `className` prop
```

---

## User-Level CLAUDE.md

Put personal instructions that apply to ALL your projects in:

```
~/.claude/CLAUDE.md
```

Example:

```markdown
# My Personal Rules

- I prefer verbose, well-commented code
- Always ask before deleting files
- My name is Alex — address me by name
- I use a Mac with iTerm2
```

---

## Local CLAUDE.md (gitignored)

For instructions you don't want to commit (personal preferences, secrets):

```bash
echo "CLAUDE.local.md" >> .gitignore
touch CLAUDE.local.md
```

```markdown
# Local Overrides

- My local database is on port 5433 (not default 5432)
- Use the test Stripe key: sk_test_...
```

---

## Real-World Example

Here's a complete, practical CLAUDE.md:

```markdown
# Acme Shop — Developer Guide for Claude

## Project Overview
Online store built with Laravel + Vue.js. Serves B2C customers in the UK.
Admin panel at `/admin`, customer-facing at `/`.

## Tech Stack
- PHP 8.2, Laravel 11
- Vue 3 (Composition API) + Vite
- MySQL 8, Redis
- PHPUnit for testing

## Getting Started
```bash
composer install
npm install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```

## Coding Conventions
- PHP: PSR-12, 4-space indent
- Vue: `<script setup>` syntax, no Options API
- Avoid raw SQL — use Eloquent ORM
- Service classes in `app/Services/` for business logic
- Return `ApiResponse::ok()` / `ApiResponse::error()` from API controllers

## Key Files
- `app/Services/OrderService.php` — all order logic
- `app/Http/Controllers/Api/` — REST API endpoints
- `resources/js/stores/` — Pinia state stores
- `routes/api.php` — API routes
- `routes/web.php` — web routes

## Testing
- Run: `php artisan test`
- Feature tests go in `tests/Feature/`
- Unit tests go in `tests/Unit/`
- Use factories: `User::factory()->create()`

## Do Not
- Never run `php artisan migrate:fresh` — it drops all data
- Don't commit `.env` or any credentials
- Don't use jQuery — project uses Vue
```

---

## Tips

- **Keep it concise** — Claude reads the whole file every session; don't make it a novel
- **Update it as the project evolves** — outdated instructions are worse than none
- **Use `/memory` to edit** — quick way to update CLAUDE.md from inside a session
- **Test it with `/init`** — see what Claude thinks is worth documenting about your project
