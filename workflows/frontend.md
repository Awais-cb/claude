# Frontend Developer Workflow

Claude as your frontend pair programmer — for building components, implementing designs, managing state, and writing frontend tests.

---

## Daily Session Setup

```bash
cd your-project/
claude --ide          # connects to VS Code — lets Claude see your selected code
claude -c             # or resume yesterday's session
```

The VS Code extension is especially valuable for frontend work — you can highlight a component and ask about it without copy-pasting.

---

## 1. Building Components

### New component from a description
```
> create a ProductCard component:
  - props: { id, name, price, imageUrl, inStock, onAddToCart }
  - shows image, name, price (formatted as currency)
  - "Add to Cart" button, disabled and showing "Out of Stock" when inStock is false
  - follow the patterns in @src/components/ui/Card.tsx
  - use Tailwind CSS for styling
  - include TypeScript types
```

### Component from scratch with a spec
```
> I need a Pagination component:
  - shows page numbers with prev/next arrows
  - highlights current page
  - shows ellipsis for large page ranges (1 ... 4 5 6 ... 20)
  - props: { currentPage, totalPages, onPageChange }
  - accessible (keyboard navigable, aria-labels)
  - check @src/components/ for our existing component patterns
```

### Modify an existing component
```
[Select the component in VS Code]
> add a loading skeleton state to this component.
  while data is loading, show 3 placeholder cards with a pulse animation.
  use the Skeleton component from @src/components/ui/Skeleton.tsx
```

---

## 2. Styling & CSS

### Implement a design with Tailwind
```
> style this form to match these requirements:
  - card with white background, rounded-lg, shadow-md, p-6
  - label: text-sm font-medium text-gray-700 mb-1
  - input: full width, border border-gray-300, rounded-md, px-3 py-2, focus:ring-2 focus:ring-blue-500
  - error state: border-red-500, text-red-600 error message below input
  - submit button: full width, bg-blue-600 hover:bg-blue-700, text-white, py-2 rounded-md
```

### Responsive layout
```
> make @src/components/ProductGrid.tsx responsive:
  - mobile (< 640px): 1 column
  - tablet (640-1024px): 2 columns
  - desktop (> 1024px): 4 columns
  - maintain the same gap between items on all sizes
```

### Dark mode
```
> add dark mode support to @src/components/Navbar.tsx.
  use Tailwind's dark: prefix.
  the dark/light toggle is in @src/contexts/ThemeContext.tsx.
```

### Fix a layout issue
```
[Paste a screenshot of the UI bug]
> the card footer is overlapping the card content on mobile screens.
  here's a screenshot. @src/components/ui/Card.tsx is the component.
  fix it.
```

---

## 3. State Management

### Add state to a component
```
[Select the component]
> this component needs local state for:
  - which tab is active (tabs: "overview", "details", "reviews")
  - whether the image modal is open
  - the currently displayed image index (for the image gallery)
  Add useState hooks and wire up the UI.
```

### Create a context / store
```
> create a CartContext that:
  - stores cart items: { productId, quantity, price, name }
  - exposes: addItem, removeItem, updateQuantity, clearCart, total, itemCount
  - persists to localStorage
  - wraps the app (show me where to add the provider)
  Follow the pattern in @src/contexts/AuthContext.tsx
```

### React Query / data fetching
```
> add data fetching to @src/pages/ProductListPage.tsx:
  - fetch from GET /api/products?page=&per_page=20
  - show loading skeleton while fetching
  - show error state if the request fails (with retry button)
  - implement pagination using the API's page/per_page params
  Use React Query following the pattern in @src/hooks/useOrders.ts
```

### Fixing state bugs
```
> there's a race condition in @src/components/SearchBar.tsx —
  if the user types quickly, results from older searches appear after newer ones.
  fix it by cancelling the previous request when a new one starts.
```

---

## 4. Forms

### Create a form
```
> create a registration form with:
  - fields: name (required), email (required, valid email), password (required, min 8 chars),
    confirm password (must match password)
  - show inline validation errors on blur
  - disable submit while submitting
  - on success: redirect to /dashboard
  - on error: show API error message above the form
  Use React Hook Form + Zod for validation.
  Follow the pattern in @src/forms/LoginForm.tsx
```

### Add validation to an existing form
```
[Select the form component]
> add client-side validation to this form.
  Rules:
  - phone: required, must be a valid UK mobile number (starts with 07, 11 digits)
  - postcode: required, valid UK postcode format
  - date of birth: required, must be 18+ years old
  Show errors inline below each field after the user has touched it.
```

---

## 5. Performance

### Find and fix performance issues
```
> @src/pages/DashboardPage.tsx is re-rendering too often.
  analyze it for:
  - unnecessary re-renders (missing memo/useCallback/useMemo)
  - expensive computations that should be memoized
  - components that could be lazy-loaded
  Suggest fixes with explanations.
```

### Code splitting
```
> add code splitting to the router in @src/router.tsx.
  lazy-load all page components.
  add loading fallbacks.
```

### Image optimization
```
> audit @src/components/ProductCard.tsx for image performance.
  add: lazy loading, proper width/height to prevent layout shift,
  srcset for responsive images, WebP with JPEG fallback.
```

---

## 6. Accessibility

### Audit a component
```
[Select the component]
> audit this component for accessibility issues:
  - missing aria labels
  - keyboard navigation gaps
  - color contrast issues
  - focus management
  Fix all issues you find.
```

### Add keyboard navigation
```
> @src/components/Dropdown.tsx doesn't support keyboard navigation.
  add: open with Enter/Space, navigate with arrows, close with Escape,
  trap focus while open, correct aria-expanded/aria-haspopup attributes.
```

---

## 7. Frontend Testing

### Component test
```
> write tests for @src/components/ProductCard.tsx using Vitest + Testing Library.
  test:
  - renders product name, price, and image
  - shows "Out of Stock" and disables button when inStock is false
  - calls onAddToCart with the product id when button is clicked
  - price is formatted correctly ($1,234.56)
```

### Integration test for a page
```
> write tests for @src/pages/CheckoutPage.tsx:
  - user can fill in all fields
  - validation errors show for empty required fields
  - form submits and calls the API
  - success redirects to /order-confirmation
  - API error shows an error message
  Mock the API calls using msw.
```

### Snapshot test review
```
> the snapshot for @src/components/Button.tsx is failing after I added a size prop.
  update the snapshot and make sure the new size variants are tested.
```

---

## Prompt Library

| Task | Prompt |
|------|--------|
| New component | `create a [Name] component with props: [props]. styling: [requirements]. follow @[example].` |
| Responsive | `make @[file] responsive: mobile [x] col, tablet [x] col, desktop [x] col.` |
| Form validation | `add validation to this form: [rules]. show errors inline on blur.` |
| State bug | `[select code] this has a bug where [symptom]. fix it.` |
| Perf audit | `analyze @[file] for unnecessary re-renders and expensive computations.` |
| Accessibility | `audit [selected component] for a11y issues and fix them.` |
| Component tests | `write tests for @[file]. test: [scenarios]. use Vitest + Testing Library.` |
| Dark mode | `add dark mode to [selected component] using Tailwind dark: prefix.` |

---

## Tips

- **Use the VS Code extension** — open Claude Code in the VS Code panel to highlight code and ask about it without referencing files manually. You can also launch from a terminal with `claude --ide` to auto-connect to your open editor
- **Paste screenshots directly** — `Ctrl+V` in the prompt box sends images; great for UI bugs and design mockups
- **Reference your existing components with `@`** — Claude matches your patterns instead of inventing new ones
- **For complex state bugs, enable thinking** — `Alt+T` / `Option+T` before asking about race conditions or complex re-render issues
- **Test as you build** — after each component, ask Claude to write tests before moving on; it's faster while the code is fresh
