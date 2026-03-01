# Laravel Database Workflow

Claude for migrations, Eloquent models, relationships, seeders, factories, and query optimization in Laravel projects.

---

## 1. Migrations

### Always read before creating

```
> read the last 5 migrations in database/migrations/ (sorted by date) to understand
  our column naming conventions, index patterns, and foreign key style.
  I'm about to create a migration for [table].
```

### Create a new table migration

```
> create a migration to add a coupons table with:
  - id (bigIncrements)
  - code (string, unique, uppercase)
  - type (enum: 'percentage', 'flat')
  - value (decimal 8,2)
  - min_cart_value (decimal 8,2, nullable)
  - max_uses (integer, nullable — null means unlimited)
  - uses_count (integer, default 0)
  - valid_from (timestamp, nullable)
  - valid_until (timestamp, nullable)
  - is_active (tinyint, default 1)
  - is_deleted (tinyint, default 0)
  - timestamps()
  - index on code, index on is_active+is_deleted

  Show me the file before running it.
```

### Add columns to an existing table

```
> create a migration to add these columns to the orders table:
  - coupon_id (foreign key → coupons, nullable)
  - discount_amount (decimal 8,2, default 0)
  - notes (text, nullable)

  Show me the migration file. Then run: php artisan migrate
```

### Rename or modify columns safely

```
> I need to rename the 'address' column to 'shipping_address' on the orders table.
  First check if any other migrations reference this column name.
  Then create a migration that renames it safely without data loss.
  Use Schema::table() with ->renameColumn().
```

### Risky migrations — use plan mode first

```bash
claude --permission-mode plan
```

```
> I want to change the users.phone column from nullable to not-null.
  How many rows in the table currently have a null phone?
  What's the safest migration strategy — add a default, backfill first, or handle nulls?
  What other code references this column?
  Don't generate any files yet — just analyze and advise.
```

### Migration rollback safety

```
> create a migration that adds the coupon_id column to orders AND write
  a proper down() method that removes it cleanly.
  Also check if we need to drop the foreign key constraint before the column.
```

---

## 2. Eloquent Models

### Create a model with full conventions

```
> create the Coupon model. Read @app/Models/BaseModel.php and
  @app/Components/Traits/DatabaseOperation.php first.

  Model should:
  - extend BaseModel
  - use DatabaseOperation, HasFactory
  - use IsActive, NotDeleted scope traits
  - $fillable: [code, type, value, min_cart_value, max_uses, uses_count, valid_from, valid_until]
  - $hidden: []
  - casts(): type to string, value to decimal, valid_from/valid_until to datetime
  - relationships: orders() HasMany
  - scope: scopeValid() — active, not deleted, within valid date range, has remaining uses
  - static fetchModel() helper
```

### Define relationships correctly

```
> the Order model needs these relationships with proper return types:
  - user(): BelongsTo User via user_id
  - items(): HasMany OrderItem via order_id
  - coupon(): BelongsTo Coupon via coupon_id (nullable)
  - shippingAddress(): HasOne ShippingAddress via order_id
  - tags(): BelongsToMany Tag via order_tags pivot (with timestamps on pivot)

  Read @app/Models/ for 2-3 existing model examples to match the style.
```

### Accessors and mutators

```
> add these accessors to the Order model:
  - getFormattedTotalAttribute() — returns total formatted as currency (e.g., "£125.00")
  - getStatusLabelAttribute() — returns a human-readable label for each status enum value
  - getIsExpiredAttribute() — returns true if the order's return window has passed (>30 days)

  Use Laravel 9+ accessor syntax (Attribute::make()) if that's what the project uses.
  Check existing accessors in @app/Models/ first.
```

### Observers

```
> create a CouponObserver in app/Observers/ that:
  - on created: logs the creation with Log::info()
  - on updating: if is_active is being set to 0, set valid_until to now
  - on updated: dispatch a CouponUpdated event if the value or type changed

  Register it in a service provider. Read @app/Observers/ for existing patterns.
```

---

## 3. The DatabaseOperation Trait (cc* Methods)

### Using the ccGetByWhere method

```
> rewrite this Eloquent query to use the ccGetByWhere method from DatabaseOperation:

  Order::where('status', 'pending')
       ->where('created_at', '>', now()->subDays(7))
       ->with(['user', 'items'])
       ->orderBy('created_at', 'desc')
       ->paginate(20);

  Show me the equivalent using the clauses() format from DatabaseOperation.
  Read @app/Components/Traits/DatabaseOperation.php to get the exact format.
```

### Complex where clauses

```
> write the clauses() array for a query that fetches:
  - orders where status IN ('pending', 'processing')
  - AND user_id = $userId
  - AND created_at BETWEEN $startDate AND $endDate
  - AND coupon_id IS NOT NULL
  - AND is_deleted = 0

  Use the where_in, where_between, where_null, where formats from DatabaseOperation.
```

---

## 4. Factories & Seeders

### Create a factory

```
> create OrderFactory in database/factories/OrderFactory.php.
  Use Faker to generate realistic data:
  - user_id: random existing user
  - status: random from ['pending', 'processing', 'completed', 'cancelled']
  - total: fake()->randomFloat(2, 10, 500)
  - created_at: random date in the last 90 days

  Add states: pending(), completed(), cancelled() that set the status.
  Read @database/factories/ for existing factory examples.
```

### Create a seeder

```
> create OrderSeeder in database/seeders/OrderSeeder.php.
  Seed 50 orders:
  - 30 completed, 10 pending, 10 cancelled
  - Each order should have 1-4 OrderItems
  - 20% of orders should have a coupon applied

  Call it from DatabaseSeeder. Read @database/seeders/ for the pattern.
```

### Using factories in tests

```
> show me how to use the Order factory in a feature test:
  - create 3 pending orders for a specific user
  - create 1 completed order for a different user (to test that it's excluded)
  - use the correct Pest / PHPUnit syntax matching @tests/Feature/ examples
```

---

## 5. Query Optimization

### Detect N+1 queries

```
> I think the GET /orders endpoint has N+1 queries.
  Read @app/Http/Controllers/OrderController.php and @app/Services/OrderService.php.
  Identify any loops that trigger additional queries and fix them with eager loading.
  Show me the before and after.
```

### Eager loading strategy

```
> the OrderList page loads orders with user, items, and coupon relations.
  Currently it's doing: Order::all() with no eager loading.
  Rewrite it to:
  - eager load user (only name and email columns)
  - eager load items (only product_id, quantity, price)
  - eager load coupon (only code and type)
  Use with(['relation:columns']) syntax.
```

### Add database indexes

```
> analyze the orders table queries in @app/Services/OrderService.php.
  Identify which columns are used in WHERE clauses, ORDER BY, and JOINs
  that don't have indexes. Write a migration to add the missing indexes.
```

### Chunking large datasets

```
> the GenerateMonthlyReport command loads all orders for a month into memory.
  Read @app/Console/Commands/GenerateMonthlyReport.php.
  Rewrite the query to use chunk(500) to process records in batches.
  Ensure the memory usage stays constant regardless of dataset size.
```

### Raw queries safely

```
> I need a complex aggregation query that Eloquent can't express cleanly:
  - count orders grouped by day for the last 30 days
  - include days with 0 orders (using a date series)
  Write this as a DB::select() with a raw SQL query.
  Ensure the date range is passed as bindings (not interpolated) to prevent SQL injection.
```

---

## 6. Database Debugging

### Check what queries are running

```
> add temporary query logging to OrderService::getOrdersForDashboard() so I can see
  exactly what SQL is being generated. Use DB::enableQueryLog() and DB::getQueryLog().
  Wrap just that method call and dump the results.
```

### Explain a slow query

```
> this MySQL query is taking 3+ seconds on production (from the slow query log):
  [paste query]
  Explain what it's doing, why it's slow, and how to fix it.
  Also write the migration to add any indexes you recommend.
```

### Find orphaned records

```
> write a query (or tinker script) to find:
  - orders that reference a user_id that no longer exists
  - order_items that reference an order_id that no longer exists
  Show counts only — don't delete anything.
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| New migration | `create a migration for [table] with [columns, indexes, foreign keys]. show before running.` |
| Modify table | `add [columns] to [table]. show migration. include proper down() for rollback.` |
| Model | `create [Model] extending BaseModel with DatabaseOperation. $fillable, casts, relationships: [list].` |
| Relationships | `add relationships to [Model]: [list with types and foreign keys]. match style in @app/Models/.` |
| Factory | `create [Model]Factory. fake: [columns]. add states: [list].` |
| Seeder | `create [Model]Seeder seeding [n] records with [distribution]. call from DatabaseSeeder.` |
| N+1 fix | `[endpoint] has N+1 queries. read @[controller] and @[service]. find and fix with eager loading.` |
| Index | `analyze queries in @[file]. identify missing indexes on [table]. write migration to add them.` |
| Chunking | `rewrite @[command/service] to process [model] in chunks of [n] instead of loading all at once.` |

---

## Tips

- **Always show migration before running** — add "show me the file before running" to every migration prompt; it prevents irreversible mistakes
- **Use plan mode for risky schema changes** — `claude --permission-mode plan` for any change that touches a heavily-used table
- **Seed with factories, not hardcoded data** — factories produce realistic variability; hardcoded seeds break tests
- **Name your indexes** — always specify `->name('idx_orders_user_id_status')` so you can drop them cleanly in down()
- **Never use `DB::statement()` with interpolated variables** — always use bindings; ask Claude to flag any raw SQL that uses string interpolation
