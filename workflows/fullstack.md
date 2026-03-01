# Fullstack Developer Workflow

End-to-end feature development with Claude — from database schema to UI, as a single developer owning the whole stack.

---

## Your Superpower as a Fullstack Dev

As a fullstack developer, you own a feature from end to end. Claude is best used to accelerate the full vertical slice: schema → API → frontend → tests, in one coherent session.

The key is keeping Claude oriented across all layers simultaneously. Use a single named session per feature so Claude builds up context across all layers as you work.

---

## Starting a Feature

### 1. Name your session
```
claude --ide
> /rename feat/TICKET-42-user-notifications
```

### 2. Orient Claude on the whole feature
```
> I'm building a notification system end-to-end. Here's the full spec:

  BACKEND:
  - DB: notifications table (id, user_id, type, title, body, read_at, created_at)
  - API: GET /api/notifications, PATCH /api/notifications/:id/read, DELETE /api/notifications/:id
  - Real-time: emit a WebSocket event when a new notification is created

  FRONTEND:
  - Bell icon in the navbar with unread count badge
  - Dropdown panel showing recent notifications
  - Click notification → mark as read + navigate to the relevant page
  - Real-time updates when new notifications arrive

  TECH STACK:
  - Backend: Express + Prisma (PostgreSQL)
  - Frontend: React + React Query + Socket.io-client
  - Testing: Vitest

  Let's work top-down: schema first, then API, then frontend.
  Start by reviewing the existing codebase to understand conventions.
```

---

## Phase 1: Database Schema

```
> first, analyze the existing Prisma schema at @prisma/schema.prisma
  and the existing models, then create the Notification model.
  Show me the schema addition before running any migration.
```

Review and iterate:
```
> add a `metadata` JSON field for storing context-specific data
  (e.g., orderId for order notifications, commentId for comment notifications).
  Also add an index on user_id + read_at for the "get unread" query.
```

Run when ready:
```
> looks good. run the migration with the name "add-notifications"
```

---

## Phase 2: Backend API

```
> now build the notifications API layer. check how similar resources
  are structured in @src/routes/ and @src/services/ first.

  Create:
  1. NotificationRepository — DB queries (getByUser, markRead, delete)
  2. NotificationService — business logic
  3. NotificationController — HTTP handlers
  4. Route file — GET, PATCH, DELETE endpoints with auth middleware
  5. Zod validation schemas
```

Validate the API:
```
> run the existing test suite to make sure nothing is broken.
  Then write unit tests for NotificationService covering:
  - getUnread returns only unread notifications for the requesting user
  - markRead only works for notifications belonging to the user (auth check)
  - delete only works for notifications belonging to the user
```

---

## Phase 3: Real-Time Layer

```
> add WebSocket support for real-time notifications.
  Check how WebSocket/Socket.io is set up in @src/server.ts.
  When a notification is created (anywhere in the app), emit a 'notification:new'
  event to the relevant user's socket room.

  The notification service should emit the event after insert.
  Don't change the HTTP API — WebSocket is additive.
```

---

## Phase 4: Frontend — API Integration

```
> now the frontend. Read @src/hooks/ to understand our data-fetching patterns.
  Create a useNotifications hook using React Query that:
  - fetches GET /api/notifications
  - provides markAsRead(id) and deleteNotification(id) mutations
  - connects to Socket.io for real-time updates (invalidate query on 'notification:new')
  - tracks unread count
  The socket client is in @src/lib/socket.ts
```

---

## Phase 5: Frontend — Components

```
> build the notification UI. reference @src/components/ui/ for existing components.

  1. NotificationBell — icon button with unread count badge (in the navbar)
  2. NotificationItem — single notification row (icon, title, body, time ago, read indicator)
  3. NotificationPanel — dropdown panel with list of NotificationItems, "Mark all read" button,
     empty state, loading skeleton

  Wire to the useNotifications hook.
  Use Framer Motion for the panel open/close animation (check if it's in package.json).
```

Integrate into the app:
```
> add the NotificationBell to the navbar at @src/components/layout/Navbar.tsx.
  It should appear on the right side, before the user avatar.
```

---

## Phase 6: Testing

```
> write tests for the notification feature:

  Backend (Vitest):
  - NotificationService: getUnread, markRead with wrong user (should fail), delete
  - NotificationController: GET returns 401 if no auth, GET returns filtered by user

  Frontend (Vitest + Testing Library):
  - NotificationBell: shows correct unread count, opens panel on click
  - NotificationPanel: shows notifications, mark as read updates the UI, empty state

  Use our test factories in @src/tests/factories/ for test data.
```

---

## Phase 7: Review and Ship

```
> /diff          # review all changes before committing
> /team-review   # run team code review skill
> /check         # lint + types + tests
> /pr            # commit + push + open PR
```

---

## Cross-Layer Debugging

When bugs span multiple layers:

```
> notifications are showing up in the database but the frontend count badge
  isn't updating in real time. The socket event is being emitted (I can see it in the server logs).

  Check:
  1. @src/lib/socket.ts — is the client subscribing to 'notification:new'?
  2. @src/hooks/useNotifications.ts — is the React Query cache being invalidated?
  3. Are there any CORS issues with the WebSocket connection?

  Trace the full event flow and find where it breaks.
```

---

## Managing Context Across a Long Feature

Long features = long sessions = context window fills up. Manage it:

```
> /compact keep the database schema we finalized, the API endpoint signatures,
  and the component structure we agreed on
```

Or create a checkpoint:
```
> /checkpoint   # save state before moving to the next phase
```

If you split across days:
```bash
claude -c              # resume yesterday's session
> what did we finish yesterday and what's left to do?
```

---

## Parallel Work with Subagents

For large features, delegate to subagents:

```
> I need to work on 3 things in parallel:
  1. Use the test-writer agent to write backend tests for NotificationService
  2. Use the explorer agent to find all places in the app that create notifications
     (so I know where to add the emit call)
  3. Meanwhile, I'll work with you on the frontend components

  Spawn agents 1 and 2 in the background, I'll check back on them.
```

---

## Prompt Library

| Phase | Prompt |
|-------|--------|
| Orient | `I'm building [feature] end to end. spec: [backend], [frontend]. stack: [tech]. review conventions first.` |
| Schema | `add a [Model] to @prisma/schema.prisma. show the change before running the migration.` |
| API layer | `build [resource] API: repository, service, controller, routes. check existing patterns in @src/` |
| Hook | `create a use[Resource] hook using React Query. provide mutations for [actions]. follow @src/hooks/` |
| Component | `build [Name] component. wire to use[Resource] hook. reuse @src/components/ui/ for primitives.` |
| Debug | `[symptom] — check [file1], [file2], and [file3]. trace the full flow and find where it breaks.` |
| Ship | `/diff → /team-review → /check → /pr` |

---

## Tips

- **One session per feature** — Claude builds context across all layers as you work; don't start a new session mid-feature
- **Always read before writing** — ask Claude to analyze existing conventions before building anything new
- **Top-down is cleaner** — schema → API → frontend avoids having to change types multiple times
- **Compact before switching layers** — `> /compact keep the [layer] decisions` before moving to the next layer
- **Use plan mode for cross-cutting concerns** — before adding a field that touches 10+ files, plan mode first
