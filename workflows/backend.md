# Backend Developer Workflow

Claude as your backend pair programmer — for building APIs, managing databases, writing tests, and debugging server-side issues.

---

## Daily Session Setup

```bash
cd your-project/
claude --ide          # connects to VS Code
# or just:
claude -c             # resume yesterday's session
```

Start each feature with a named session:
```
> /rename feat/TICKET-123-user-auth
```

---

## 1. Building a New API Endpoint

### The workflow
```
> I need a POST /api/orders endpoint that:
  - accepts { productId, quantity, shippingAddress }
  - validates input (quantity must be 1-100, address must have street/city/zip)
  - creates an order in the database
  - sends a confirmation email via our EmailService
  - returns the created order with 201 status
  Check how similar endpoints are built in src/routes/ first, then implement.
```

Claude will:
1. Read your existing endpoint patterns
2. Create the route, controller, service, and repository layers
3. Add Zod validation schema
4. Write the handler following your conventions

### After implementation
```
> run the tests for the orders module and fix any failures
> /team-review           # run your team's code review skill
```

### Adding to an existing endpoint
```
> the GET /api/users endpoint needs pagination.
  add ?page and ?per_page query params (default 20, max 100).
  @src/routes/users.ts is the current implementation.
  Match the pagination pattern used in @src/routes/products.ts
```

---

## 2. Database Migrations

### Create a new migration
```
> I need to add a `last_login_at` timestamp column (nullable) to the users table.
  Create a Prisma migration for this. Don't run it yet — show me the schema change first.
```

Review it, then:
```
> looks good, run the migration
```

Claude runs `npx prisma migrate dev --name add-last-login-at`.

### Complex schema changes
```
> I need to refactor the orders table:
  1. Split `address` (single string) into address_line1, address_line2, city, zip, country
  2. The existing data needs to be migrated
  Create the migration with a data migration step. Show the plan before running anything.
```

Use plan mode for risky migrations:
```bash
claude --permission-mode plan
> what would happen if we changed the User.email field from String to String?
  how many places in the codebase reference it?
```

### Seeding data
```
> create a seed script that populates test data:
  - 5 users (1 admin, 4 regular)
  - 20 products across 3 categories
  - 10 orders in various states
  Use our factory pattern from src/tests/factories/
```

---

## 3. Debugging

### Fixing a reported bug
```
> Users are getting a 500 error when they try to update their profile
  with a phone number that contains spaces. The error is:
  "invalid input syntax for type integer"

  The relevant code is in @src/routes/users.ts and @src/services/UserService.ts.
  Find the bug and fix it.
```

### Debugging a slow query
```
> this query is taking 3+ seconds on production:
  [paste the query or the Prisma call]

  Analyze why it's slow and suggest fixes.
  Check if we have indexes on the relevant columns.
```

### Tracing a request
```
> trace the full lifecycle of a POST /api/orders request through our codebase —
  from the route definition to the database write and the response.
  I want to understand all the middleware and services it passes through.
```

### Reading error logs
```bash
cat logs/error.log | claude -p "summarize the last 20 errors, group by type, identify the most frequent"
```

---

## 4. Authentication & Security

### Add auth to an endpoint
```
> add JWT authentication to the POST /api/orders route.
  Check how auth is applied to other protected routes in @src/middleware/
  and apply the same pattern.
```

### Security audit
```
> /security-review
```

Then for a deeper audit:
```
> audit the authentication flow for security issues:
  - JWT validation in @src/middleware/auth.ts
  - Token refresh in @src/routes/auth.ts
  - Password hashing in @src/services/UserService.ts

  Look for: timing attacks, token leakage, missing expiry checks,
  brute force vulnerabilities.
```

### Add rate limiting
```
> add rate limiting to the auth endpoints (/api/auth/login, /api/auth/register):
  - 10 requests per minute per IP for login
  - 5 requests per minute per IP for register
  Use the express-rate-limit library (check if it's already installed).
```

---

## 5. Writing Tests

### Unit test for a service
```
> write unit tests for @src/services/OrderService.ts.
  Mock the OrderRepository and EmailService.
  Cover: happy path, invalid product ID, out-of-stock, email failure.
  Follow the test patterns in @src/tests/services/UserService.test.ts
```

### Integration test for an endpoint
```
> write an integration test for POST /api/orders.
  Use our test database setup in @src/tests/setup.ts.
  Test: successful order, validation errors, unauthorized access, duplicate order.
```

### Running tests
```
> run npm test -- --reporter=verbose and fix any failing tests
```

### Coverage report
```
> run tests with coverage and tell me which files have less than 80% coverage.
  Prioritize which ones to address first based on business criticality.
```

---

## 6. Refactoring

### Extract a service
```
> the UserController is doing too much — it's handling both profile updates
  and authentication directly. Extract authentication logic into AuthService.
  @src/controllers/UserController.ts is the current file.
  Show me your plan before making any changes.
```

### Add error handling
```
> @src/routes/products.ts is missing error handling on several endpoints.
  Add proper try/catch blocks that use our AppError class from @src/lib/errors.ts
  and return consistent error responses.
```

### Optimize N+1 queries
```
> the GET /api/users endpoint is making N+1 database queries.
  @src/services/UserService.ts is the service.
  Find the N+1 and fix it using Prisma's include/select.
```

---

## 7. Documentation

### Document an API
```
> document the orders API endpoints in OpenAPI 3.0 format.
  Read @src/routes/orders.ts and generate the YAML spec.
  Include request/response schemas, error responses, and examples.
```

### Generate JSDoc
```
> add JSDoc comments to all exported functions in @src/services/OrderService.ts.
  Include: description, @param with types, @returns, @throws.
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| New endpoint | `create a [METHOD] /api/[path] endpoint that [requirements]. check existing patterns first.` |
| Fix 500 error | `users get a 500 when [action]. error: [message]. relevant files: @[files]. find and fix.` |
| Add validation | `add Zod validation to @[file]. rules: [requirements]. match the pattern in @[example].` |
| Add auth | `protect [endpoint] with JWT auth. use the pattern from @src/middleware/auth.ts` |
| Migration | `create a Prisma migration to [change]. show the schema change before running.` |
| Unit tests | `write unit tests for @[file]. mock [dependencies]. cover: happy path, [edge cases].` |
| Slow query | `this query is slow: [query]. analyze and suggest optimizations. check indexes.` |
| Refactor | `@[file] is too large. extract [logic] into [new file]. show plan first.` |

---

## Tips

- **Always name your sessions** — `> /rename fix/TICKET-456` makes it easy to resume the next day
- **Use plan mode for migrations** — `claude --permission-mode plan` before touching the schema
- **Pipe logs to Claude** — `cat error.log | claude -p "what's happening?"` is faster than reading logs yourself
- **Run `/check` before every commit** — catches lint/type/test failures before code review
- **Reference specific files with `@`** — `@src/services/OrderService.ts` gets better results than "the order service"
