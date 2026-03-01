# Laravel Testing Workflow

Claude for writing and fixing tests in Laravel — Pest, PHPUnit, feature tests, unit tests, browser tests with Dusk, and all the Laravel testing helpers.

---

## The Core Principle

Claude writes significantly better Laravel tests when it can read your existing tests first:

```
> write tests for @app/Services/OrderService.php.
  Follow the exact patterns and style in @tests/Unit/Services/UserServiceTest.php
```

Always reference an existing test file. It eliminates guesswork about PHPUnit vs Pest, class structure, factory usage, and assertion style.

---

## 1. Feature Tests (HTTP Tests)

### Test a full API endpoint

```
> write feature tests for the POST /orders endpoint.
  The controller is @app/Http/Controllers/OrderController.php.
  Follow the test pattern in @tests/Feature/BookingTest.php.

  Test:
  - 201: authenticated user with valid data creates an order
  - 422: missing required fields returns validation errors
  - 422: quantity over 100 returns a validation error
  - 401: unauthenticated request returns 401 or redirects
  - 403: authenticated user cannot create an order for a different user

  Use factories for test data. Fake Mail and Queue.
```

### Test authenticated routes

```
> write feature tests for the patient order history page (GET /patient/orders).
  - Unauthenticated: redirects to /login
  - Authenticated patient: returns 200 and only shows that patient's orders (not others')
  - Authenticated therapist (wrong role): returns 403

  Use actingAs() with the correct factory user. Check existing tests for how we set up roles.
```

### Test with database

```
> write a feature test for order cancellation (DELETE /orders/{id}).
  The test should:
  - create a real order in the test database using the Order factory
  - act as the owner and send DELETE
  - assert: response is 200, order status is 'cancelled' in the database
  - act as a different user and assert they get 403

  Use RefreshDatabase. Read @tests/Feature/ for the setup pattern.
```

### Test file uploads

```
> write a feature test for the POST /therapist/documents endpoint.
  It should accept a PDF file (max 5MB).
  Test:
  - valid PDF upload stores the file and returns the file URL
  - file over 5MB returns a 422 validation error
  - non-PDF file returns a 422 validation error
  Use Storage::fake('gcs') or Storage::fake('local') to avoid real file storage.
```

---

## 2. Unit Tests

### Test a service class

```
> write unit tests for OrderService in @app/Services/OrderService.php.
  Follow the pattern in @tests/Unit/Services/UserServiceTest.php.

  Test each method:
  createOrder():
  - happy path: returns GenericResponse success with the created order
  - invalid product_id: returns GenericResponse::fail()
  - product out of stock: returns GenericResponse::fail() with correct message

  cancelOrder():
  - happy path: sets status to cancelled, returns success
  - wrong userId (not the owner): returns GenericResponse::fail()
  - already cancelled: returns GenericResponse::fail()

  Mock the Order model and any dependencies. Don't hit the real database.
```

### Test an Eloquent model scope

```
> write unit tests for the Coupon model's scopeValid() scope.
  It should only return coupons that are:
  - is_active = 1
  - is_deleted = 0
  - within valid_from and valid_until date range (or null = no limit)
  - uses_count < max_uses (or max_uses is null = unlimited)

  Create coupons using the factory with different states and assert the scope
  includes/excludes the right ones. Use RefreshDatabase.
```

### Test a custom validation rule

```
> write unit tests for the PhoneNumberFormat rule in @app/Rules/PhoneNumberFormat.php.
  Test valid inputs: +923001234567, +447700900000
  Test invalid inputs: 0300-1234567 (no +), 923001234567 (no +), 'abc', ''
  Use the rule's passes() / validate() method directly (not via a form request).
```

### Test an Eloquent accessor

```
> write unit tests for the Order model's getFormattedTotalAttribute() accessor.
  Test:
  - total of 125.00 → "£125.00"
  - total of 0 → "£0.00"
  - total of 1250.50 → "£1,250.50"
  Create Order instances using make() (no DB needed).
```

---

## 3. Mocking Laravel Services

### Fake mail, queues, and events

```
> update the POST /orders feature test to also assert side effects:
  - Mail::fake() then assert Mail::assertSent(OrderConfirmationMail::class, function ($mail) use ($user) {
      return $mail->hasTo($user->email);
    })
  - Queue::fake() then assert Queue::assertPushed(SendOrderConfirmationEmail::class)
  - Event::fake() then assert Event::assertDispatched(OrderCreated::class)
```

### Mock an external service

```
> OrderService calls StripeService::chargeCard() which makes a real API call.
  Write unit tests for OrderService that mock StripeService so no real charges happen.
  Test:
  - charge succeeds: order is created with status 'paid'
  - charge fails with 'card_declined': order gets status 'payment_failed', GenericResponse::fail() returned
  Use Mockery or Laravel's mock() helper. Read @tests/Unit/ for existing mock patterns.
```

### Fake storage

```
> write a test for the document upload service.
  Use Storage::fake('gcs') to prevent real GCS uploads.
  After the upload call, assert:
  - Storage::disk('gcs')->assertExists('documents/' . $fileName)
  - The DocumentService returns GenericResponse::ok() with the file URL
```

### Fake HTTP requests to external APIs

```
> OrderService::syncToCrm() calls the Freshworks CRM API.
  Write unit tests using Http::fake() to mock the API responses:
  - CRM API returns 201: service returns GenericResponse::ok()
  - CRM API returns 422: service returns GenericResponse::fail() with message
  - CRM API times out: service returns GenericResponse::fail() with timeout message
```

---

## 4. Pest Syntax

### Convert PHPUnit tests to Pest

```
> convert this PHPUnit test to Pest syntax:
  [paste PHPUnit test]
  Use Pest's it(), expect(), beforeEach() equivalents.
  Check @tests/ to confirm we're using Pest and what version.
```

### Write a new test in Pest style

```
> write a Pest feature test for the coupon validation endpoint (POST /coupons/validate).
  Use describe() to group related tests.
  Use beforeEach() to create a test user and act as them.
  Test: valid coupon, expired coupon, already-used coupon, coupon below minimum cart value.
  Follow the Pest style in @tests/Feature/ if we're using Pest.
```

### Pest datasets (data providers)

```
> write a Pest test for PhoneNumberFormat using a dataset:
  dataset of valid phone numbers → expects passes = true
  dataset of invalid phone numbers → expects passes = false
  Use Pest's it()->with() or dataset() for parameterized tests.
```

---

## 5. Browser Tests (Laravel Dusk)

### Install and set up Dusk

```
> check if Laravel Dusk is installed (composer.json / tests/Browser/).
  If not, guide me through: composer require laravel/dusk --dev
  Then set up the DuskTestCase and configure the .env.dusk.local.
```

### Write a browser test

```
> write a Dusk test for the patient booking flow:
  1. navigate to /login, fill email + password, submit
  2. navigate to /therapists
  3. click the first therapist's "Book Session" button
  4. select a date on the calendar
  5. select a time slot
  6. click "Confirm Booking"
  7. assert we land on the confirmation page with a booking reference number

  Create a user and therapist in setUp() using factories.
  Read @tests/Browser/ for existing Dusk test patterns.
```

### Screenshot on failure

```
> update the DuskTestCase.php to automatically take a screenshot when a test fails.
  Store screenshots in tests/Browser/screenshots/ with a timestamp in the filename.
```

---

## 6. Test Database Setup

### Refresh vs transaction strategy

```
> read @tests/TestCase.php (or the base test class) to understand how we handle
  the test database. Are we using RefreshDatabase or DatabaseTransactions?
  What are the tradeoffs for our test suite? Should we switch?
```

### Test factories with relationships

```
> I need to set up this test scenario:
  - 1 therapist (user with role 'therapist', linked to a provider record)
  - 1 patient (user with role 'patient')
  - 3 booked sessions between them (status: 'completed')
  - 1 pending session

  Write the factory calls to create this scenario cleanly using factory states
  and the existing User and Provider factories. Read @database/factories/ first.
```

---

## 7. Running Tests

### Run specific tests

```bash
# Run all tests
php artisan test

# Run a specific test file
php artisan test tests/Feature/OrderTest.php

# Run a specific test method
php artisan test --filter="test_patient_can_cancel_order"

# Run with coverage
php artisan test --coverage --min=80

# Run tests in parallel (faster)
php artisan test --parallel
```

### Ask Claude to fix failing tests

```
> run php artisan test and show me all failures.
  Then fix them one at a time, starting with the simplest.
  For each fix, explain what was wrong and what you changed.
```

### Fix a specific failing test

```
> this test is failing:
  [paste the test output / stack trace]

  The test is in @tests/Feature/OrderTest.php line 47.
  The relevant service is @app/Services/OrderService.php.
  Read both files, explain why it's failing, and fix it.
```

---

## 8. Coverage Gaps

```
> run php artisan test --coverage and report:
  - which files in app/Services/ are below 70% coverage?
  - which files in app/Http/Controllers/ have no tests at all?
  Prioritize which to address based on business criticality (payments > notifications).
```

```
> @app/Services/PaymentService.php has 40% coverage.
  Read the file and the existing tests in @tests/Unit/Services/PaymentServiceTest.php.
  Write additional tests covering:
  - the refund logic (lines 78-95)
  - the webhook signature verification (lines 110-130)
  - the retry on timeout logic (lines 145-160)
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| Feature test | `write feature tests for [endpoint]. test: [status codes + scenarios]. use factories. follow @tests/Feature/[example].` |
| Auth/role test | `test that [endpoint]: unauthenticated → redirect/401, wrong role → 403, correct role → 200.` |
| Unit test | `write unit tests for @[service]. mock [dependencies]. test each method: [list]. follow @tests/Unit/[example].` |
| Mail/Queue/Event | `add Mail::fake()/Queue::fake()/Event::fake() to [test]. assert [mail/job/event] was dispatched.` |
| Dusk test | `write Dusk test for [user journey]: [steps]. create test data in setUp(). follow @tests/Browser/[example].` |
| Fix failing | `this test is failing: [output]. read @[test file] and @[implementation file]. explain and fix.` |
| Coverage | `run test coverage. list files below 70% in [directory]. write tests to cover [specific lines].` |
| Convert to Pest | `convert [PHPUnit test] to Pest syntax with describe(), it(), expect().` |

---

## Tips

- **Always reference an existing test** — `follow @tests/Feature/BookingTest.php` produces dramatically better output
- **Specify PHPUnit vs Pest explicitly** — they have different syntax; always confirm which you're using
- **Fake everything external** — Mail, Queue, Event, Storage, Http — never let tests touch real external services
- **Use factories, not hardcoded data** — factories make tests resilient to schema changes; hardcoded IDs break
- **RefreshDatabase for feature tests, no DB for unit tests** — unit tests should mock models and never touch the database
- **Run tests after every change** — `> run php artisan test and fix failures` prevents accumulated failures
