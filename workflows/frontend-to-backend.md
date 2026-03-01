# Frontend to Backend Integration Workflow

How to use Claude when connecting your frontend to your backend — API contracts, type sharing, error handling, and integration testing.

---

## The Integration Problem

Frontend and backend live in separate worlds. The most common integration bugs are:
- Frontend sends a field the backend doesn't expect (or vice versa)
- Error responses aren't handled gracefully in the UI
- Types get out of sync between layers
- The API contract changes and nobody updates the other side

Claude helps bridge all of these.

---

## 1. Understanding an Existing API Before Building UI

Before building a frontend feature, understand the API:

```
> read @src/routes/orders.ts and @src/controllers/OrderController.ts
  and tell me:
  - what endpoints exist for orders
  - what request body/params each endpoint accepts
  - what response shape each returns (success and error)
  - what authentication is required
  I'm about to build the frontend for the order management section.
```

Or if you have an OpenAPI spec:
```
> @docs/openapi.yaml — summarize all the endpoints I'd need to build
  the checkout flow: browsing products, adding to cart, and placing an order.
  Focus on request/response shapes and error codes.
```

---

## 2. Type Sharing Between Frontend and Backend

### Generate shared types from backend

```
> look at the Prisma schema in @prisma/schema.prisma and the API responses
  in @src/controllers/OrderController.ts.
  Generate TypeScript types for the frontend to use when consuming these APIs.
  Create them in @src/types/api.ts.

  Include:
  - Request body types for each endpoint
  - Response types (success and error)
  - Enum types that match the backend's enums
```

### Keep types in sync after backend changes

```
> the backend just changed the Order response shape — it now returns
  `customer` as a nested object { id, name, email } instead of just `customerId`.
  Find everywhere in the frontend that uses the old shape and update it.
  Start by reading @src/types/api.ts, then check all components that use orders.
```

### Using a monorepo / shared package

```
> we want to share types between @packages/api and @packages/web.
  Look at our monorepo structure and suggest how to set up a @packages/shared
  package that both can import from.
  Show the package.json, tsconfig.json changes needed, and how to import in each package.
```

---

## 3. Building the API Client Layer

### Create a typed API client

```
> create a typed API client for the orders API.
  Base URL comes from VITE_API_URL env var.
  Every request should:
  - attach the JWT from localStorage (if present)
  - handle 401 by redirecting to /login
  - handle network errors gracefully
  - return typed responses using our types from @src/types/api.ts

  Create it at @src/lib/api/orders.ts following the pattern in @src/lib/api/users.ts
```

### Add request/response interceptors

```
> our API client in @src/lib/api/client.ts needs:
  - request interceptor: add Authorization header from auth context
  - response interceptor: if 401, clear auth state and redirect to /login
  - response interceptor: if 429, show a toast "Too many requests, please wait"
  - response interceptor: if 5xx, log to our error tracking service
  Use axios interceptors.
```

### Error handling

```
> right now API errors in @src/hooks/useOrders.ts just log to console.
  Update error handling to:
  - validation errors (422): extract field errors and return them for inline form display
  - not found (404): redirect to 404 page
  - server error (500): show a toast notification
  - network error: show "Connection lost, please check your internet" toast
  Use our ToastContext from @src/contexts/ToastContext.tsx
```

---

## 4. Building Integration-Aware Components

### Connect a component to the real API

```
> @src/components/features/orders/OrderList.tsx currently uses mock data.
  Connect it to the real API:
  - use the useOrders hook from @src/hooks/useOrders.ts
  - show a loading skeleton while fetching (use @src/components/ui/Skeleton.tsx)
  - show an error state with retry button on failure
  - show empty state when no orders exist
  The API endpoint is GET /api/orders and the response type is in @src/types/api.ts
```

### Optimistic updates

```
> when a user clicks "Cancel Order" in @src/components/features/orders/OrderCard.tsx,
  implement an optimistic update:
  1. immediately show the order as "cancelled" in the UI
  2. call DELETE /api/orders/{id} in the background
  3. if the API call fails, revert the UI and show an error toast
  Use React Query's optimistic update pattern.
```

### Real-time data

```
> the order status needs to update in real time on the OrderDetail page.
  The backend has a WebSocket endpoint at ws://api/orders/{id}/status.
  Add a WebSocket connection that updates the order status display without
  requiring a page refresh.
  Handle reconnection if the connection drops.
```

---

## 5. API Contract Testing

### Generate contract tests

```
> look at the frontend's API usage in @src/hooks/ and @src/lib/api/
  and generate API contract tests that verify:
  - every endpoint we call exists on the backend
  - the response shapes match our TypeScript types
  - error responses match what we handle in the frontend

  Use msw (Mock Service Worker) to intercept requests in tests.
  Put tests in @src/tests/contracts/
```

### Test against the real API

```
> write an integration test that tests the full order creation flow
  against the real development API (http://localhost:3001):
  1. POST /api/auth/login to get a token
  2. POST /api/cart/items to add a product
  3. POST /api/orders to create an order
  4. GET /api/orders/{id} to verify the order was created

  Use the test user credentials from @src/tests/fixtures/users.ts
```

---

## 6. Handling API Changes

### When the backend changes an endpoint

```
> the backend team changed POST /api/orders:
  - old: { productId, quantity, address }
  - new: { items: [{ productId, quantity }], shippingAddressId }

  Find all frontend code that calls this endpoint and update it.
  Also update the TypeScript types in @src/types/api.ts and any mocks in tests.
```

### Deprecation handling

```
> the backend is deprecating GET /api/products/{id} in favor of GET /api/v2/products/{id}.
  The new endpoint returns extra fields but is otherwise compatible.
  Update all frontend usage to use v2, and update types to include the new fields.
  Find all usages with @src/
```

---

## 7. Environment & Configuration

### Set up API environments

```
> we need 3 API environments: local, staging, production.
  Create a config system in @src/lib/config.ts that:
  - reads VITE_API_URL from env vars
  - exports typed config (not process.env strings everywhere)
  - shows a console warning if no API URL is set in development

  Also create @.env.example, @.env.development, and @.env.staging template files.
```

### CORS debugging

```
> the frontend gets a CORS error when calling POST /api/orders from localhost:5173.
  The backend is at localhost:3001.
  Read @src/server.ts and @src/middleware/ on the backend and tell me:
  - is CORS configured?
  - what origins are allowed?
  - what's missing for this to work?
  Then fix it.
```

---

## 8. End-to-End Feature Integration

For a complete feature spanning frontend and backend:

```
> I need to implement the "Save to Wishlist" feature end to end.
  Backend: @src/routes/, @src/models/
  Frontend: @src/components/, @src/hooks/

  Plan:
  1. What backend endpoints are needed?
  2. What database changes are needed?
  3. What frontend components need to be created or updated?
  4. What types need to be added?

  Give me the full plan before writing any code.
```

Then execute step by step:
```
> let's start with the backend. create the Prisma model and migration for wishlists.
```
```
> now create the API endpoints following the plan.
```
```
> now the frontend — connect the heart icon on ProductCard to the wishlist API.
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| Understand API | `read @[routes file] and describe all endpoints, request/response shapes, and auth requirements` |
| Generate types | `generate TypeScript types for the frontend from @[backend files]. put in @src/types/api.ts` |
| Build API client | `create a typed API client for [resource]. follow @[existing client]. handle errors: [list]` |
| Connect component | `connect @[component] to the real API using @[hook]. add loading, error, and empty states` |
| Handle API change | `the backend changed [endpoint]: old [shape] → new [shape]. find and update all frontend usage` |
| Contract test | `write contract tests for our API usage in @src/hooks/. use msw. put in @src/tests/contracts/` |
| Optimistic update | `implement optimistic update for [action] in @[component]. revert on API failure` |

---

## Tips

- **Always read the backend code before building the frontend** — `@src/routes/[resource].ts` gives you the actual contract, not assumptions
- **Generate types from the source** — have Claude read the backend models and generate frontend types; don't write them by hand
- **Test the error cases** — ask Claude to handle every API error code, not just 200
- **Use plan mode for cross-cutting changes** — when an API changes, use `claude --permission-mode plan` to find all affected files before changing anything
- **Keep a session per feature** — `> /rename feat/wishlist-integration` so you can resume across multiple work sessions
