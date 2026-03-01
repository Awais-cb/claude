# Laravel Backend Developer Workflow

Claude as your Laravel pair programmer — for building APIs, service layers, queue jobs, artisan commands, and everything server-side.

---

## Daily Session Setup

```bash
cd your-laravel-project/
claude --ide          # connects to VS Code
# or:
claude -c             # resume yesterday's session
```

Name each feature session:
```
> /rename feat/TICKET-123-order-processing
```

---

## 1. Building a New API Endpoint

### The full workflow

```
> I need a POST /api/orders endpoint that:
  - accepts { product_id, quantity, shipping_address }
  - validates input (quantity 1–100, address must have line1/city/zip/country)
  - creates an order in the database using OrderService
  - dispatches a SendOrderConfirmationEmail job
  - returns the created order as JSON with 201 status

  First read app/Http/Controllers/ and app/Services/ to understand our
  service layer and controller conventions. Then implement:
  1. CreateOrderRequest form request
  2. OrderService::createOrder()
  3. OrderController::store()
  4. Route in routes/web/ or routes/api/
```

### Adding to an existing endpoint

```
> the GET /api/orders endpoint needs cursor-based pagination.
  Read @app/Http/Controllers/OrderController.php for the current implementation.
  Match the pagination pattern used in @app/Http/Controllers/ProductController.php
```

### Resourceful API with all CRUD operations

```
> build a full resource API for Coupons:
  - GET /coupons (index, paginated)
  - POST /coupons (store, admin only)
  - GET /coupons/{id} (show)
  - PATCH /coupons/{id} (update, admin only)
  - DELETE /coupons/{id} (destroy, admin only — soft delete)

  Read app/Models/ and app/Services/ for conventions. Use:
  - CouponService for business logic
  - JsonResponse class for all responses
  - Role middleware for admin-only routes (check routes/dashboard/ for examples)
```

---

## 2. Service Layer

### Creating a service class

```
> create OrderService in app/Services/. Use static methods and GenericResponse.
  The GenericResponse pattern is at app/Dtos/GenericResponse.php.
  Implement:
  - createOrder(array $data): GenericResponse
  - cancelOrder(int $orderId, int $userId): GenericResponse — verify ownership first
  - getOrdersByUser(int $userId, array $filters): GenericResponse

  Never throw exceptions for business logic; return GenericResponse::fail().
  Wrap DB writes in DB::beginTransaction() / commit() / rollBack().
```

### Calling a service from a controller

```
> update OrderController::store() to:
  1. validate with CreateOrderRequest
  2. call OrderService::createOrder($request->validated())
  3. if $result->isFailed() → return JsonResponse::badRequest([], $result->message())
  4. if success → return JsonResponse::ok($result->dataArray(), $result->message())

  Read @app/Components/Classes/JsonResponse.php for the available methods.
```

---

## 3. Eloquent Models

### Creating a model with full conventions

```
> create the Order model. Read @app/Models/BaseModel.php for the base class
  and @app/Components/Traits/DatabaseOperation.php for cc* query methods.

  The model should:
  - extend BaseModel
  - use DatabaseOperation, HasFactory
  - use NotDeleted, IsActive scope traits
  - define $fillable
  - define relationships: user(), product(), coupon()
  - include a scopePending(), scopeCompleted() query scope
  - add a getFormattedTotalAttribute() accessor
```

### Defining complex relationships

```
> the Order model needs these relationships:
  - belongsTo User (via user_id)
  - hasMany OrderItem (via order_id)
  - hasOne ShippingAddress (via order_id)
  - belongsToMany Tag (via order_tags pivot table, with timestamps)

  Read @app/Models/PackagePurchase.php to see how we define relationships.
  Add all four with return type hints.
```

### Using the DatabaseOperation cc* methods

```
> rewrite the OrderRepository query to use the cc* methods from DatabaseOperation:
  - get orders where status = 'pending' AND created_at > 7 days ago
  - eager load: user, items, shippingAddress
  - order by created_at desc
  - paginate 20 per page

  Read @app/Components/Traits/DatabaseOperation.php for the clauses() format.
```

---

## 4. Form Requests & Validation

### Create a form request

```
> create CreateOrderRequest in app/Http/Requests/.
  Use the FailedValidationJsonResponse trait (for JSON endpoints).
  Validate:
  - product_id: required, integer, exists in products table
  - quantity: required, integer, min:1, max:100
  - shipping_address: required, array
  - shipping_address.line1: required, string, max:255
  - shipping_address.city: required, string
  - shipping_address.zip: required, string
  - coupon_code: nullable, string, exists in coupons table on code column

  Read @app/Http/Requests/ to find an existing example to follow.
```

### Custom validation rules

```
> create a custom validation rule PhoneNumberFormat in app/Rules/.
  It should accept Pakistani phone numbers in +923XXXXXXXXX format.
  Read @app/Rules/ to see how existing rules are structured.
```

---

## 5. Queue Jobs

### Create a job

```
> create a SendOrderConfirmationEmail job in app/Jobs/.
  - Accepts: int $orderId
  - In handle(): fetch the order with user relation, send email via Mail::to()
  - Implement ShouldQueue
  - Add retry logic: 3 attempts, backoff 60 seconds
  - Log success/failure via Log::info() / Log::error()

  Read @app/Jobs/ for existing job patterns.
```

### Dispatch a job from a service

```
> update OrderService::createOrder() to dispatch SendOrderConfirmationEmail
  after the order is created. Dispatch on the 'emails' queue.
  Use ::dispatch() not ::dispatchNow().
```

### Create a scheduled command

```
> create an artisan command SendDailyReports that:
  - runs daily at 8am via the scheduler (app/Console/Kernel.php)
  - queries orders from the past 24 hours
  - sends a summary email to the admin email from config('mail.admin_address')
  - logs the count of orders processed

  Read @app/Console/Commands/ for existing command patterns.
```

---

## 6. Middleware

### Create custom middleware

```
> create middleware EnsureOrderBelongsToUser in app/Http/Middleware/.
  - reads {order} route parameter
  - checks if the authenticated user owns that order
  - returns JsonResponse::forbidden() if not
  - registers it as 'order-owner' in the middleware aliases

  Read @app/Http/Middleware/ for the handle() pattern and how we return JsonResponse.
```

### Apply middleware to routes

```
> read routes/web/orders.php and apply the 'order-owner' middleware
  to the show, update, and destroy routes. Show me the diff first.
```

---

## 7. Authentication & Security

### Add Sanctum API token auth

```
> add API token authentication to the orders API routes.
  Check config/auth.php and existing middleware in app/Http/Middleware/ to
  understand the current auth setup.
  Use Laravel Sanctum with the 'auth:sanctum' middleware.
```

### Security audit of a feature

```
> audit the order creation flow for security issues:
  - @app/Http/Requests/CreateOrderRequest.php — is all input validated?
  - @app/Services/OrderService.php — could an attacker create orders for other users?
  - @app/Http/Controllers/OrderController.php — is ownership checked before every action?
  - Are there any SQL injection risks in raw DB queries?
  - Is the coupon code check timing-attack safe?
  List findings as CRITICAL / WARNING / SUGGESTION.
```

### Mass assignment protection

```
> audit all models in app/Models/ for mass assignment vulnerabilities.
  Check that $fillable is explicitly defined (not $guarded = []).
  Flag any model where sensitive fields like is_admin, role, or balance
  could be mass-assigned through user input.
```

---

## 8. Debugging

### Tracing a request

```
> trace the full lifecycle of POST /orders through the codebase.
  From the route → middleware → form request → controller → service → model → job.
  List every file it touches in order.
```

### Fixing a 500 error

```
> users are getting a 500 error when placing an order with a coupon code that's expired.
  The error is: "Call to a member function discount() on null"
  Relevant files: @app/Services/OrderService.php, @app/Models/Coupon.php
  Find the null reference and fix it. Also add a proper GenericResponse::fail() for expired coupons.
```

### Reading Laravel logs

```bash
tail -f storage/logs/laravel.log | claude -p "summarize errors as they appear, group by type"
```

Or:
```bash
cat storage/logs/laravel.log | claude -p "find all errors from the last hour, group by exception type, show the most frequent"
```

### Debugging an N+1 query

```
> enable query logging and run the GET /orders endpoint:
  DB::enableQueryLog(); // then fetch orders; dd(DB::getQueryLog());
  Read @app/Http/Controllers/OrderController.php and @app/Services/OrderService.php.
  Identify the N+1 and fix it with eager loading.
```

---

## 9. Artisan Commands

### Scaffold quickly

```bash
# Have Claude run these with context
> create the migration, model, factory, seeder, controller, and form request for a Coupon resource.
  Run: php artisan make:model Coupon -mfsc --requests
  Then open each file and fill in the implementation.
```

### Explain what a command does

```
> read @app/Console/Commands/SyncGoogleCalendarEvents.php and explain
  what this command does, what external services it calls, and what could go wrong.
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| New endpoint | `create [METHOD] /[path]. validate with form request. call [Service]. use JsonResponse. check existing patterns first.` |
| Service method | `add [methodName]() to [Service]. use GenericResponse. wrap DB writes in transaction. never throw exceptions.` |
| Model | `create [Model] extending BaseModel with DatabaseOperation. $fillable, relationships: [list], scopes: [list].` |
| Form request | `create [Name]Request with FailedValidationJsonResponse. rules: [list]. read @app/Http/Requests/ first.` |
| Job | `create [Name]Job. ShouldQueue. accepts: [params]. handle(): [logic]. 3 retries, 60s backoff.` |
| Fix 500 | `users get 500 when [action]. error: [message]. check @[file1] and @[file2]. find and fix.` |
| Security audit | `audit [feature] for: ownership checks, mass assignment, SQL injection, input validation. rate as CRITICAL/WARNING/SUGGESTION.` |
| N+1 fix | `the [endpoint] has N+1 queries. read @[controller] and @[service]. find and fix with eager loading.` |
| Slow query | `this query is slow: [query or method]. check indexes on [table]. suggest optimizations.` |

---

## Tips

- **Always name sessions** — `> /rename feat/TICKET-123` makes it easy to resume the next morning
- **Reference the GenericResponse pattern by file** — `read @app/Dtos/GenericResponse.php first` gets you consistent service methods
- **Use plan mode before schema changes** — `claude --permission-mode plan` to find all files affected before any migration
- **Pipe logs to Claude** — `cat storage/logs/laravel.log | claude -p "what's wrong?"` beats reading logs manually
- **Always check existing patterns first** — ask Claude to read a similar file before creating a new one; it prevents convention drift
