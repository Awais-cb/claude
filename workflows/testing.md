# Testing Workflow

How to use Claude to write, run, and improve tests across your entire stack — unit, integration, end-to-end, and test-driven development.

---

## The Core Principle

Claude writes better tests when it can read both the code being tested **and** your existing test examples. Always reference both:

```
> write tests for @src/services/OrderService.ts.
  follow the patterns and style in @src/tests/services/UserService.test.ts
```

---

## 1. Unit Testing

### Test a new function

```
> write unit tests for the calculateDiscount function in @src/utils/pricing.ts.
  cover:
  - 10% discount for orders over $100
  - 20% discount for orders over $500
  - no discount for orders under $100
  - discount cannot exceed the order total
  - throws if quantity is negative
  use Vitest, follow the style in @src/tests/utils/
```

### Test a service class

```
> write unit tests for @src/services/NotificationService.ts.
  mock dependencies: NotificationRepository, EmailService, SocketService.
  test each public method:
  - createNotification: happy path, invalid userId, email failure (should still save)
  - markAsRead: success, wrong user (should throw AuthError), already read (idempotent)
  - deleteNotification: success, not found, wrong user
  use Vitest + vi.mock(). follow @src/tests/services/UserService.test.ts
```

### Test a React component

```
> write unit tests for @src/components/features/orders/OrderCard.tsx.
  test:
  - renders order number, status, and total correctly
  - "Cancel" button only shows for orders with status "pending"
  - clicking "Cancel" calls the onCancel prop with the order id
  - shows a loading spinner when isCancelling is true
  - formats the date correctly (use a fixed date in tests)
  use Vitest + React Testing Library + @testing-library/user-event
```

### Test a custom hook

```
> write tests for @src/hooks/useCart.ts.
  test:
  - addItem adds a new item to the cart
  - addItem increases quantity if item already exists
  - removeItem removes the item
  - updateQuantity changes quantity (min 1, max 99)
  - total is calculated correctly
  - cart persists to localStorage and reloads on init
  use Vitest + renderHook from @testing-library/react
```

---

## 2. Integration Testing

### API endpoint test

```
> write integration tests for POST /api/orders using Supertest.
  set up a test database that gets reset between tests.
  test:
  - 201: valid request creates an order and returns it
  - 400: missing required fields returns validation errors
  - 401: missing JWT token returns 401
  - 403: valid token but wrong user can't access another user's cart
  - 422: product out of stock returns a clear error

  use our test setup from @src/tests/setup.ts and factories from @src/tests/factories/
```

### Database integration test

```
> write integration tests for OrderRepository in @src/repositories/OrderRepository.ts.
  use the test database (TEST_DATABASE_URL from env).
  test:
  - findByUser returns only the requesting user's orders
  - findByUser paginates correctly (page 2, per_page 5)
  - create inserts and returns the full order with relations
  - updateStatus throws if order doesn't exist
  clean up test data after each test.
```

### Frontend + API integration test

```
> write integration tests for the checkout flow using msw to mock API calls.
  test the full user journey:
  1. user adds item to cart → cart count updates
  2. user goes to checkout → form renders with cart items
  3. user fills in shipping info → validation works
  4. user submits → loading state shows, then success page
  5. API error → error message shows with retry option

  mock these endpoints with msw:
  - POST /api/orders → 201 with order data
  - POST /api/orders → 422 with validation error
  use @src/tests/mocks/handlers.ts for the msw setup
```

---

## 3. End-to-End Testing (Playwright)

### Create an E2E test

```
> write a Playwright test for the user registration and first purchase flow:
  1. navigate to /register
  2. fill in name, email, password
  3. submit and verify redirect to /dashboard
  4. navigate to /products
  5. click the first product
  6. click "Add to Cart"
  7. navigate to /cart
  8. click "Checkout"
  9. fill in shipping address
  10. click "Place Order"
  11. verify order confirmation page

  use page objects. create @e2e/pages/RegisterPage.ts, ProductPage.ts, CheckoutPage.ts.
  use test data from @e2e/fixtures/users.ts.
  follow the patterns in @e2e/tests/login.spec.ts
```

### Test a critical user path

```
> write an E2E test for the password reset flow:
  1. click "Forgot password" on the login page
  2. enter email and submit
  3. mock receiving the email (intercept the API call)
  4. navigate to the reset link
  5. enter new password and confirm
  6. verify redirect to login with success message
  7. log in with new password and verify it works
```

### Visual regression test

```
> add a visual regression test for the ProductCard component.
  screenshot it in 3 states:
  - normal: in-stock product
  - out-of-stock: disabled button state
  - sale badge: with "SALE" badge visible
  use Playwright's screenshot comparison.
  save baselines in @e2e/screenshots/baselines/
```

---

## 4. Test-Driven Development (TDD)

Claude is excellent at TDD. Write the test first, then the implementation:

### Red → Green → Refactor

```
> I want to use TDD to build a coupon code validation feature.
  Start by writing the tests for validateCouponCode(code, cartTotal) in
  @src/tests/utils/coupon.test.ts. Don't write the implementation yet.

  Tests should cover:
  - valid code "SAVE10" gives 10% off (min $50 cart)
  - valid code "FLAT20" gives $20 off (min $100 cart)
  - expired code throws CouponExpiredError
  - already-used code throws CouponUsedError
  - unknown code throws CouponNotFoundError
  - cart below minimum throws CouponMinimumError
```

Then make them pass:
```
> now write the implementation for validateCouponCode in @src/utils/coupon.ts
  that makes all these tests pass. use the CouponRepository to look up codes.
```

Then refactor:
```
> the tests are passing. refactor the implementation for clarity:
  - extract the minimum cart check into a private helper
  - extract the usage check into a private helper
  - make sure all edge cases are still covered
```

---

## 5. Fixing Failing Tests

### Diagnose failures

```
> run npm test and show me the failures. then fix them one by one.
```

### Investigate a specific failure

```
> this test is failing:
  [paste the test output]

  the test is in @src/tests/services/OrderService.test.ts line 47.
  read the test and the implementation in @src/services/OrderService.ts
  and explain why it's failing. then fix it.
```

### Flaky tests

```
> the test in @src/tests/components/SearchBar.test.ts is flaky —
  it passes about 70% of the time and fails with a timeout the rest.
  read the test and find the root cause of the flakiness. fix it.
```

---

## 6. Test Coverage

### Find gaps

```
> run the test suite with coverage (npm test -- --coverage) and report:
  - which files are below 70% line coverage?
  - which critical paths (auth, payments, orders) have the worst coverage?
  - which branches are most commonly untested?
  sort by coverage percentage ascending.
```

### Fill coverage gaps

```
> @src/services/PaymentService.ts has 45% coverage. read the file and the
  existing tests in @src/tests/services/PaymentService.test.ts.
  write additional tests to cover:
  - all error branches (lines 34, 67, 89)
  - the retry logic (lines 102-118)
  - the webhook signature verification (lines 145-160)
```

---

## 7. Performance Testing

### Benchmark a function

```
> write a benchmark for the generateReport function in @src/utils/reports.ts.
  compare:
  - current implementation
  - with the caching optimization I'm about to add

  use Vitest bench (vitest.bench.ts).
```

### Load test an endpoint

```
> write a k6 load test script for POST /api/orders that:
  - ramps from 0 to 50 users over 30 seconds
  - holds at 50 users for 2 minutes
  - ramps down
  - tracks: p95 response time < 500ms, error rate < 1%
  save to @load-tests/orders.js
```

---

## The `/check` Skill (Run Before Every PR)

Add this skill to `.claude/skills/check.md` and run it before every commit:

```
> /check
```

It runs: typecheck → lint → unit tests → reports pass/fail for each. Catches issues before code review.

---

## Prompt Library

| Task | Prompt |
|------|--------|
| Unit test | `write unit tests for @[file]. cover: [scenarios]. follow @[example test].` |
| Service test | `test @[service]. mock: [dependencies]. test each method: [list]. use vi.mock().` |
| Component test | `write tests for @[component]. test: [scenarios]. use Vitest + RTL + user-event.` |
| API test | `write integration tests for [endpoint]. test: [status codes + scenarios]. use @[setup].` |
| E2E test | `write Playwright test for [user journey]: [steps]. use page objects. follow @[example].` |
| Fix failures | `run npm test, show failures, fix them one by one.` |
| Coverage | `run tests with coverage. which files are below 70%? focus on [critical paths].` |
| TDD | `write tests first for [feature]: [scenarios]. don't write implementation yet.` |

---

## Tips

- **Always reference an existing test** — `follow the style in @src/tests/services/UserService.test.ts` gets dramatically better output than no reference
- **Run tests after every change** — `> run npm test and fix failures` keeps you from accumulating broken tests
- **Test behavior, not implementation** — ask Claude to test what the function does, not how it does it; this makes tests more maintainable
- **Write tests immediately** — ask Claude to write tests right after implementing a feature, while Claude still has full context of what was built
- **Use TDD for complex business logic** — especially for validation, pricing, and auth logic where edge cases matter most
