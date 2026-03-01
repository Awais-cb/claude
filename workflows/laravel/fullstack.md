# Laravel Fullstack Developer Workflow

End-to-end feature development with Claude in a Laravel project — from database migration to Blade/Livewire/Inertia UI, as a single developer owning the whole stack.

---

## The Laravel Fullstack Advantage

Laravel's tight integration between layers (Eloquent, controllers, Blade, Livewire) makes it ideal for Claude-assisted full-vertical development. Claude can hold the entire feature context — schema, service logic, and view — simultaneously in one session.

**Principle**: one named session per feature, top-down: migration → model → service → controller → routes → frontend → tests.

---

## Starting a Feature

### 1. Name and orient the session

```bash
claude --ide
```

```
> /rename feat/TICKET-42-patient-notifications
```

### 2. Give Claude the full spec upfront

```
> I'm building a notification system end-to-end in Laravel. Here's the spec:

  BACKEND:
  - DB: notifications table (id, user_id, type, title, body, read_at, created_at)
  - Service: NotificationService with getUnread(), markRead(), deleteNotification()
  - Controller: NotificationController with RESTful endpoints
  - Events/Jobs: dispatch a NotificationCreated event when a notification is inserted

  FRONTEND:
  - Bell icon in the navbar with an unread count badge
  - Livewire component for the dropdown panel showing recent notifications
  - Click notification → mark as read + redirect to the relevant page
  - Real-time badge update via Livewire polling or Laravel Echo

  STACK: Laravel 11, Livewire 3, Alpine.js, Tailwind CSS, MySQL

  Start by reviewing the existing codebase conventions. Read:
  - app/Models/ for model patterns
  - app/Services/ for service layer patterns
  - app/Http/Controllers/ for controller patterns
  - resources/views/ for Blade/Livewire component structure
  Then let's go top-down: migration first.
```

---

## Phase 1: Database Migration

```
> look at the recent migrations in database/migrations/ to understand our naming
  and column conventions. Then create a migration for the notifications table:
  - id (bigIncrements)
  - user_id (foreign key → users)
  - type (string, e.g. 'appointment_reminder', 'message_received')
  - title (string)
  - body (text)
  - data (json, nullable — for context-specific payload like appointment_id)
  - read_at (timestamp, nullable)
  - timestamps()

  Show me the migration file before running anything.
```

Review and adjust, then:

```
> looks good. run the migration.
```

---

## Phase 2: Eloquent Model

```
> create the Notification model. Check app/Models/BaseModel.php for the base class
  and app/Components/Traits/DatabaseOperation.php for the cc* query methods.
  The model should:
  - extend BaseModel (or Authenticatable if applicable)
  - use DatabaseOperation trait
  - define $fillable for mass assignment
  - define the user() BelongsTo relationship
  - use IsActive and NotDeleted scope traits if they apply
  - include a fetchModel() static helper
  - add a scopeUnread() query scope
```

---

## Phase 3: Service Layer

```
> create NotificationService in app/Services/. Check other service classes
  (e.g. app/Services/BookingService.php) for the static method + GenericResponse pattern.

  Implement:
  - getUnread(int $userId): GenericResponse — returns unread notifications for user
  - markRead(int $notificationId, int $userId): GenericResponse — sets read_at, verifies ownership
  - deleteNotification(int $notificationId, int $userId): GenericResponse — verifies ownership before delete
  - createNotification(array $data): GenericResponse — inserts and dispatches NotificationCreated event

  Rules:
  - Never throw exceptions; return GenericResponse::fail() on error
  - Wrap DB writes in DB::beginTransaction() / DB::commit() / DB::rollBack()
  - Log system messages via the GenericResponse constructor
```

---

## Phase 4: Form Requests & Controller

```
> create the Form Request and Controller for notifications.

  Form Requests (in app/Http/Requests/):
  - CreateNotificationRequest: validate type (required, string), title, body, user_id, data (nullable array)

  Controller (app/Http/Controllers/NotificationController.php):
  - index(): list unread notifications for the authenticated user
  - markRead(int $id): mark a single notification as read
  - destroy(int $id): delete a notification

  Use the JsonResponse class (app/Components/Classes/JsonResponse.php) for all responses.
  Check other controllers for the exact pattern.
```

---

## Phase 5: Routes

```
> add the notification routes to routes/web/ (or the appropriate route file).
  Check routes/web.php and routes/web/ to find where authenticated user routes live.
  Apply the correct middleware (auth, role:patient, etc.) matching the pattern for similar routes.
  Use resource-style routes where they fit.
```

---

## Phase 6: Livewire Component (Frontend)

```
> now build the frontend. First read resources/views/ to understand our Blade
  component and Livewire structure.

  Create a Livewire component: NotificationBell
  - Shows bell icon with unread count badge (using data from NotificationService::getUnread())
  - Opens a dropdown panel listing recent notifications
  - "Mark all read" button
  - Each notification row: icon, title, body, time-ago, read indicator
  - Clicking a notification marks it read and redirects based on type
  - Poll every 30 seconds to update the badge count (Livewire wire:poll)

  Use Tailwind CSS for styling. Check existing Livewire components in
  app/Livewire/ and resources/views/livewire/ for conventions.
```

Integrate into the layout:

```
> add the NotificationBell component to the main navbar.
  Read resources/views/layouts/ to find the correct layout file.
  Place it on the right side of the nav, before the user avatar.
```

---

## Phase 7: Events & Broadcasting (Optional Real-Time)

```
> add real-time notification delivery using Laravel Echo + Pusher (or Reverb).
  Check config/broadcasting.php and .env for the current broadcast driver.

  Create a NotificationCreated event that:
  - implements ShouldBroadcast
  - broadcasts on a private channel: "notifications.{userId}"
  - sends the notification payload

  In the Livewire component, listen for this event and refresh the list
  without a page reload.
```

---

## Phase 8: Testing

```
> write tests for the notification feature.

  Feature Tests (tests/Feature/):
  - NotificationTest.php: GET /notifications returns 200 and only the user's notifications
  - NotificationTest.php: PATCH /notifications/{id}/read marks as read and returns 200
  - NotificationTest.php: DELETE /notifications/{id} deletes and returns 200
  - NotificationTest.php: unauthenticated requests return 401/redirect

  Unit Tests (tests/Unit/):
  - NotificationServiceTest.php: getUnread returns only unread notifications
  - NotificationServiceTest.php: markRead fails if userId doesn't own the notification
  - NotificationServiceTest.php: createNotification dispatches NotificationCreated event

  Use database factories (Database\Factories\NotificationFactory) and
  Laravel's Mail::fake(), Event::fake(), Queue::fake() where needed.
  Check tests/ for existing test patterns.
```

---

## Phase 9: Review & Ship

```bash
# Review all changes before committing
git diff

# Run the test suite
php artisan test

# Format with Pint
php artisan pint
```

Then use Claude:
```
> review all my changes in this branch vs main. focus on:
  - any missing ownership checks (user can only access their own notifications)
  - N+1 queries in the controller or Livewire component
  - missing validation or edge cases
  - anything that doesn't follow the existing service/controller/model conventions
  be specific with file names and line numbers.
```

---

## Cross-Layer Debugging

When a bug spans multiple layers:

```
> the unread count badge isn't updating after marking a notification as read.
  The markRead API call succeeds (I can see it in the network tab).

  Check:
  1. NotificationController@markRead — is it returning the right response?
  2. The Livewire component — is it re-fetching after the action?
  3. Is the Livewire wire:model or wire:click wired correctly?
  4. Is the NotificationService actually setting read_at?

  Trace the full flow and find where the state isn't refreshing.
```

---

## Managing Long Feature Sessions

When context gets large:

```
> /compact keep: the notifications table schema, the GenericResponse pattern,
  the service method signatures, and the Livewire component structure we agreed on.
```

Resume across days:

```bash
claude -c    # resume yesterday's session
> what did we finish and what's left to build?
```

---

## Prompt Library

| Phase | Prompt |
|-------|--------|
| Orient | `I'm building [feature]. spec: [backend], [frontend]. stack: Laravel 11, [frontend stack]. read conventions first.` |
| Migration | `create a migration for [table] with [columns]. show the file before running.` |
| Model | `create the [Model]. extend BaseModel, use DatabaseOperation, define $fillable, add [relationships].` |
| Service | `create [Name]Service using GenericResponse. implement: [methods]. never throw; return GenericResponse::fail().` |
| Controller | `create [Name]Controller. use JsonResponse class. form request for validation. follow @[existing controller].` |
| Livewire | `create Livewire component [Name]. data from [Service]. actions: [list]. Tailwind CSS. follow @[existing component].` |
| Debug | `[symptom]. check [file1], [file2], [file3]. trace the full flow.` |
| Ship | `review my branch changes. focus on: ownership checks, N+1s, missing validation, convention violations.` |

---

## Tips

- **One session per feature** — Claude accumulates context across all layers; starting fresh mid-feature loses that
- **Read before writing** — always ask Claude to read existing service/controller/model conventions before creating new ones
- **Top-down is cleaner** — migration → model → service → controller → view avoids changing types multiple times
- **Use plan mode for schema changes** — `claude --permission-mode plan` before touching migrations that affect many models
- **Compact before switching layers** — `> /compact keep the [layer] decisions` before moving to the next layer
- **Reference the GenericResponse pattern explicitly** — mention it in every service prompt so Claude uses it consistently
