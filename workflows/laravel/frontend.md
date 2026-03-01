# Laravel Frontend Developer Workflow

Claude as your frontend pair programmer in Laravel — for Blade templating, Livewire components, Alpine.js interactivity, Inertia.js + Vue/React, Vite asset compilation, and Tailwind CSS.

---

## Daily Session Setup

```bash
cd your-laravel-project/
claude --ide          # connects to VS Code
npm run dev           # Vite dev server in a separate terminal
```

Name your session per feature:
```
> /rename feat/TICKET-88-order-dashboard-ui
```

---

## 1. Blade Templating

### Read conventions before building

```
> read resources/views/layouts/ to understand our layout structure.
  Then read 2-3 pages in resources/views/pages/ to understand how
  sections, components, and includes are used.
  I'm about to build the order history page — what's the pattern I should follow?
```

### Build a new Blade page

```
> create the order history page at resources/views/pages/patient/order-history.blade.php.
  It should:
  - extend the main layout (@extends / @section pattern used in our codebase)
  - receive $orders (paginated collection from the controller)
  - show a table: order number, date, status badge, total, "View" button
  - show an empty state if no orders
  - include pagination links at the bottom using Laravel's $orders->links()

  Use our existing CSS classes and Bootstrap/Tailwind (check which we use in existing views).
```

### Reusable Blade components

```
> create a reusable Blade component StatusBadge.
  - Path: resources/views/components/status-badge.blade.php
  - Props: $status (string), $size ('sm' | 'md', default 'md')
  - Renders a pill badge with color based on status:
    pending=yellow, active=green, cancelled=red, completed=gray
  - Usage: <x-status-badge :status="$order->status" />

  Check resources/views/components/ for existing component examples.
```

### Blade partials and includes

```
> the order history page needs a filter bar (date range, status dropdown, search input).
  Extract it into a partial at resources/views/partials/order-filter-bar.blade.php.
  It should read the current filter values from request() and mark the active selection.
  Include it in the order history page with @include.
```

---

## 2. Livewire Components

### Orient Claude on your Livewire setup

```
> read app/Livewire/ and resources/views/livewire/ to understand how
  we structure Livewire components. Are we using Livewire 2 or 3?
  What naming conventions do we use? What's the folder structure?
```

### Create a Livewire component

```
> create a Livewire component OrderFilters for filtering the order list.
  - Class: app/Livewire/OrderFilters.php
  - View: resources/views/livewire/order-filters.blade.php
  - Properties: $status (string, default 'all'), $dateFrom, $dateTo, $search
  - Methods: updatedStatus(), applyFilters() — both emit a 'filtersUpdated' event
  - The parent Livewire component listens for 'filtersUpdated' and re-runs the query

  Use Livewire 3 syntax (wire:model.live, #[On], #[Reactive]).
  Follow the pattern in @app/Livewire/ for existing components.
```

### Real-time search with Livewire

```
> update the OrderList Livewire component to support real-time search.
  - Add a $search property bound to a text input with wire:model.debounce.300ms
  - When $search changes, re-run the query with a LIKE filter on order_number and customer name
  - Add a loading indicator (wire:loading) while the list refreshes
```

### Livewire modals

```
> create a Livewire modal component CancelOrderModal.
  - Opens when the user clicks "Cancel Order" on any order row
  - Accepts the order ID via a dispatch event
  - Shows the order number and asks for a cancellation reason (required, min 10 chars)
  - On confirm: calls OrderService::cancelOrder() and dispatches 'orderCancelled' event
  - On success: closes modal and shows a flash message
  - On error: shows the error message inline without closing

  Follow the existing modal components in @app/Livewire/ if any exist.
```

### Livewire pagination

```
> the OrderList component currently loads all orders. Add Livewire pagination:
  - Use Laravel's WithPagination trait
  - 20 items per page
  - Reset pagination when filters change (call $this->resetPage() in filter methods)
  - The view should use $this->render() returning the paginated query
```

---

## 3. Alpine.js

### Add Alpine.js interactivity to a Blade component

```
> add Alpine.js to the notification bell in resources/views/components/notification-bell.blade.php.
  - Toggle a dropdown panel open/close when the bell is clicked
  - Close the dropdown when clicking outside (using @click.outside)
  - Animate open/close with x-transition
  - Track open state with x-data="{ open: false }"
  Do not add a Livewire component — keep this pure Alpine.js.
```

### Alpine.js tabs

```
> add tab switching to the therapist profile page using Alpine.js.
  Tabs: "About", "Sessions", "Reviews", "Availability"
  - No page reload — switch content by showing/hiding sections
  - Active tab gets a highlighted style
  - Default to "About" tab
  - Use x-data, x-show, x-bind:class
```

### Form interactivity without Livewire

```
> the booking form at resources/views/pages/booking.blade.php needs:
  - Show/hide the "session notes" textarea based on session type dropdown (x-show)
  - Dynamically calculate and display the total price as the user selects package and quantity
  - Disable the submit button while form is submitting (x-bind:disabled on Axios submit)
  Use Alpine.js with Axios for the price calculation (GET /api/packages/{id}/price).
```

---

## 4. Inertia.js (Vue or React)

### Understand the Inertia setup

```
> read resources/js/ to understand if we're using Inertia.js with Vue or React.
  What's the page component folder structure? How are layouts defined?
  Read the first 3 page components to understand the conventions.
```

### Build an Inertia page

```
> create the Order History page as an Inertia + Vue component.
  - Path: resources/js/Pages/Patient/OrderHistory.vue
  - Props from controller: orders (paginated), filters (current filter values)
  - Show a table with: order number, date, status badge, total, "View" link
  - Add filter controls: status dropdown, date range, search — use Inertia's router.get()
    for filter changes so URL stays in sync (preserve scroll, preserve state)
  - Livewire-style empty state when no orders

  Read @resources/js/Pages/ for existing page component examples.
  Use @resources/js/Components/ for any existing UI components.
```

### Sharing data with Inertia

```
> I need to share the authenticated user and their unread notification count
  with every Inertia page without passing it from every controller.
  Read @app/Http/Middleware/HandleInertiaRequests.php — add these to share().
```

---

## 5. Vite & Asset Compilation

### Add a new CSS or JS entry point

```
> we need a separate JS bundle for the admin dashboard.
  Read @vite.config.js (or vite.config.ts) to see the current input configuration.
  Add resources/js/admin.js as a new entry point and include it in the admin layout.
```

### Import a new npm package

```
> I need to add the flatpickr date picker to the booking form.
  - Install it: npm install flatpickr
  - Import and initialize it in resources/js/pages/booking.js (or the relevant file)
  - Add the CSS import
  - Initialize it on the date input with options: minDate today, disable weekends
```

### Debugging Vite build errors

```
> running npm run build gives this error:
  [paste the error]
  Read @vite.config.js and identify what's misconfigured. Fix it.
```

---

## 6. Tailwind CSS

### Check the Tailwind setup first

```
> read tailwind.config.js and resources/css/app.css to understand our
  Tailwind configuration. What custom colors, fonts, or plugins are we using?
  What's in the base layer?
```

### Build a styled component

```
> style the OrderCard Blade component at resources/views/components/order-card.blade.php
  using Tailwind CSS.
  It should show: order number, status badge, date, total, and a "View Details" button.
  Use the color palette from our tailwind.config.js custom colors.
  The card should have a hover state and a border that changes color based on order status.
```

### Responsive layout

```
> make the order history table responsive.
  On mobile (< sm): show a card-based layout instead of a table.
  On tablet (sm–lg): show a compact table with fewer columns.
  On desktop (lg+): show the full table.
  Read the existing responsive patterns in resources/views/ first.
```

---

## 7. JavaScript & Axios

### Add an Axios request

```
> add an Axios call to the booking form that:
  - fires when the user selects a therapist from the dropdown
  - calls GET /api/therapists/{id}/available-slots?date={selectedDate}
  - populates the time slot radio buttons dynamically from the response
  - shows a loading spinner during the request
  - shows an error message if the request fails

  Read resources/js/ for how we configure Axios (baseURL, CSRF token header, etc.).
```

### Handle CSRF tokens correctly

```
> read @resources/js/bootstrap.js (or wherever Axios is configured).
  Is the CSRF token being sent as X-XSRF-TOKEN from the cookie?
  If not, fix the Axios default headers so all POST/PUT/DELETE requests include it.
```

---

## 8. Debugging Frontend Issues

### Tracing a Livewire bug

```
> the CancelOrderModal doesn't close after a successful cancellation.
  The success event fires (I can see it in the browser console).
  Check:
  1. @app/Livewire/CancelOrderModal.php — is the dispatch() or $this->dispatch() correct?
  2. @resources/views/livewire/cancel-order-modal.blade.php — is the event listener correct?
  3. Is the parent listening with the right event name?
```

### Debug a Blade rendering issue

```
> the order history page shows no orders even though the database has data.
  The controller passes $orders = Order::paginate(20).
  Read @resources/views/pages/patient/order-history.blade.php and
  @app/Http/Controllers/OrderController.php.
  Trace why the orders aren't rendering.
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| Blade page | `create [page] at resources/views/[path]. extends [layout]. receives [vars]. shows [content].` |
| Blade component | `create reusable component [Name]. props: [list]. renders [description]. usage: <x-[name] />.` |
| Livewire component | `create Livewire component [Name]. properties: [list]. methods: [list]. emits: [events]. Livewire 3 syntax.` |
| Alpine.js | `add Alpine.js to [component] for [interaction]. use x-data, [directives]. no Livewire.` |
| Inertia page | `create [Page].vue. props: [list]. show [content]. read @resources/js/Pages/ for conventions.` |
| Responsive | `make [component] responsive: mobile=[layout], tablet=[layout], desktop=[layout]. check existing patterns first.` |
| Axios call | `add Axios call to [form/component] that calls [endpoint], [behavior on success], [behavior on error].` |
| Debug Livewire | `[symptom]. check @[livewire class] and @[view]. trace the event flow.` |

---

## Tips

- **Read the views folder before creating anything** — Laravel projects have wildly different view structures; always ask Claude to read before writing
- **Specify Livewire version explicitly** — Livewire 2 and 3 have different syntax; always mention which you're using
- **One component per session** — for complex Livewire components, give Claude the full requirements upfront; mid-session pivots break the component structure
- **Use Alpine.js for pure UI state** — dropdowns, tabs, toggles don't need Livewire; keep Livewire for server state
- **Always check existing components first** — `read resources/views/components/ and tell me what UI components already exist before I build a new one`
