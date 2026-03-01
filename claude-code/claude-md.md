# CLAUDE.md — Project Instructions

## What is CLAUDE.md?

Think of it like the briefing note you hand to a new contractor before their first day. You wouldn't want them to discover your coding standards by accident, or waste time asking "how do I run the tests?" You'd write it all down — tech stack, commands, rules, quirks — and hand it over so they can hit the ground running.

CLAUDE.md is exactly that. It's a plain text file that Claude reads automatically every time you start a session in your project. Without it, Claude starts fresh each time. With it, Claude already knows your stack, your conventions, and your preferences before you type a single word.

```
Without CLAUDE.md:                With CLAUDE.md:
> we use TypeScript               > fix the login bug
> tests run with npm test
> never use var, always const     Claude: [already knows all this]
> fix the login bug               [fixes the bug correctly]
```

---

## Quick Start

### Generate one automatically

```
> /init
```

Claude analyzes your project and generates a CLAUDE.md for you.

### Or create one manually

**macOS / Linux / WSL:**
```bash
touch CLAUDE.md
```

**Windows (PowerShell):**
```powershell
New-Item CLAUDE.md -ItemType File
# or simply:
echo $null > CLAUDE.md
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

**macOS / Linux / WSL:**
```
~/.claude/CLAUDE.md           ← Your personal rules (all projects)
./CLAUDE.md                   ← Project root (most common)
./.claude/CLAUDE.md           ← Hidden project config
./CLAUDE.local.md             ← Local overrides (add to .gitignore)
```

**Windows (PowerShell / WSL):**
```
C:\Users\YourName\.claude\CLAUDE.md    ← Personal rules (all projects)
.\CLAUDE.md                            ← Project root
.\.claude\CLAUDE.md                    ← Hidden project config
.\CLAUDE.local.md                      ← Local overrides
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
paths: ["src/components/**/*.tsx", "src/pages/**/*.tsx"]
---

# Frontend Rules
- Use Tailwind classes, never inline styles
- All components must have a `className` prop
```

---

## User-Level CLAUDE.md

Put personal instructions that apply to ALL your projects in:

**macOS / Linux / WSL:**
```
~/.claude/CLAUDE.md
```

**Windows:**
```
C:\Users\YourName\.claude\CLAUDE.md
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

For instructions you don't want to commit (personal preferences, local config, secrets):

**macOS / Linux / WSL:**
```bash
echo "CLAUDE.local.md" >> .gitignore
touch CLAUDE.local.md
```

**Windows (PowerShell):**
```powershell
Add-Content .gitignore "CLAUDE.local.md"
New-Item CLAUDE.local.md -ItemType File
```

```markdown
# Local Overrides

- My local database is on port 5433 (not default 5432)
- Use the test Stripe key: sk_test_...
```

---

## Real-World Examples by Project Type

### React + TypeScript App

```markdown
# Acme Dashboard — Claude Instructions

## Project
Internal admin dashboard. React 18 + TypeScript. No backend — calls external APIs.

## Tech Stack
- React 18, TypeScript 5
- Vite for bundling
- React Query for data fetching
- Zustand for global state
- Tailwind CSS + shadcn/ui components

## Commands
- `npm run dev` — start Vite dev server (port 5173)
- `npm test` — Vitest unit tests
- `npm run build` — production build
- `npm run storybook` — component development

## Conventions
- All components in `src/components/` — PascalCase filenames
- Pages in `src/pages/` — each page has its own folder
- Named exports only — no default exports
- Always type props with an interface, never inline
- Use `cn()` from `src/lib/utils` for conditional Tailwind classes

## Do Not
- Don't use `any` — use `unknown` and narrow the type
- Don't use `useEffect` for data fetching — use React Query
- Don't import from `@mui/material` — we use shadcn/ui only
```

### Python Django API

```markdown
# Acme API — Claude Instructions

## Project
REST API for a logistics platform. Django 4.2 + Django REST Framework.

## Tech Stack
- Python 3.11, Django 4.2, DRF 3.14
- PostgreSQL 15 (via psycopg2)
- Celery + Redis for async tasks
- pytest + pytest-django for testing

## Commands
- `python manage.py runserver` — dev server
- `pytest` — run tests
- `python manage.py migrate` — apply migrations
- `python manage.py makemigrations` — create new migrations
- `celery -A config worker -l info` — start task queue

## Conventions
- Views: use class-based views (CBV) — not function-based
- Serializers live in `app/serializers.py`
- Business logic goes in `app/services.py` — keep views thin
- All dates/times in UTC — convert at serialization time
- Use `get_object_or_404()` in views — never manual try/except

## Do Not
- Never run `python manage.py flush` — drops all data
- Don't put business logic in models — use services
- Don't expose stack traces in API error responses
```

### React Native Mobile App

```markdown
# Acme Mobile — Claude Instructions

## Project
iOS + Android app for a food delivery service. React Native + Expo.

## Tech Stack
- React Native 0.73, Expo SDK 50
- TypeScript
- React Navigation 6
- Zustand for state
- React Native Paper for UI components

## Commands
- `npx expo start` — start Metro bundler
- `npx expo start --ios` — open iOS simulator
- `npx expo start --android` — open Android emulator
- `npm test` — Jest tests

## Conventions
- Screens in `src/screens/` — one file per screen
- Shared components in `src/components/`
- Navigation types defined in `src/navigation/types.ts`
- Always use `StyleSheet.create()` — no inline styles
- Platform-specific code: use `.ios.ts` / `.android.ts` extensions

## Do Not
- Don't use web-only APIs (localStorage, window, document)
- Don't hardcode pixel values — use `useWindowDimensions()` for responsive sizing
- Don't commit `*.keystore` or `*.p12` files
```

---

## Real-World Example (Full)

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

## Common Mistakes

**Mistake 1: Making it too long**

Claude reads the whole CLAUDE.md on every session start. A 500-line file slows things down and dilutes the important stuff. Keep it under 100 lines. Link to other docs with `@` imports if you need more detail.

**Mistake 2: Letting it go stale**

An outdated CLAUDE.md is worse than none. If it says "we use Redux" but you migrated to Zustand six months ago, Claude will confidently write Redux code. Update CLAUDE.md whenever the project changes.

```
# Quick update from inside a session:
> /memory
# This opens your CLAUDE.md for editing
```

**Mistake 3: Vague instructions**

```markdown
# Bad:
- Write clean code

# Good:
- Max 40 lines per function
- Every function must have a JSDoc comment
- No nested ternaries
```

**Mistake 4: Forgetting local config**

If your local environment differs from the project defaults (different port, local test credentials, etc.), put that in `CLAUDE.local.md` and gitignore it. Don't pollute the shared CLAUDE.md with machine-specific settings.

**Mistake 5: Not using subdirectory CLAUDE.md files**

In a large monorepo, different parts of the codebase have very different rules. Put a CLAUDE.md in `frontend/`, `backend/`, and `infra/` with rules specific to each area. Claude loads them automatically when working in those directories.

---

## Tips

- **Keep it concise** — Claude reads the whole file every session; don't make it a novel
- **Update it as the project evolves** — outdated instructions are worse than none
- **Use `/memory` to edit** — quick way to update CLAUDE.md from inside a session
- **Test it with `/init`** — see what Claude thinks is worth documenting about your project
