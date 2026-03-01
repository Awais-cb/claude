# Figma to Frontend Workflow

How to use Claude's vision capabilities to convert Figma designs into production-ready components — accurately and fast.

---

## How It Works

Claude can see images. You screenshot a Figma frame, paste it into Claude, and ask it to build the component. Claude analyzes the layout, spacing, colors, typography, and interactions, then generates matching code.

> **This is not magic** — the output quality depends on the screenshot quality, how specific your instructions are, and how well Claude knows your component library. The workflow below makes all three as good as possible.

---

## Setup: What Claude Needs to Know First

Before any Figma-to-code work, make sure Claude has context about your design system. Add this to your `CLAUDE.md` or say it at the start of the session:

```
> Before we start building from Figma, here's our design system:
  - UI library: Tailwind CSS + our custom components in @src/components/ui/
  - Color palette: defined in tailwind.config.ts (primary, secondary, neutral, danger, success)
  - Typography: Inter font, size scale: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
  - Spacing: Tailwind's default scale (4px base unit)
  - Border radius: rounded (4px), rounded-md (6px), rounded-lg (8px), rounded-full
  - Shadows: shadow-sm, shadow, shadow-md, shadow-lg
  - Components to reuse: Button, Input, Card, Badge, Avatar in @src/components/ui/
  - Icons: Heroicons (import from @heroicons/react)
```

---

## Step 1: Get a Clean Screenshot

### From Figma (best quality)

1. Select the frame or component in Figma
2. Make sure you're viewing at **100%** zoom for accurate dimensions
3. Export as PNG (or use the Figma desktop app's right-click → Copy as PNG)
4. For multi-state components (hover, active, error) — screenshot each state separately

### Screenshot shortcuts by OS

| OS | Shortcut | What it captures |
|----|----------|-----------------|
| **macOS** | `Cmd+Shift+4` then drag | Selection |
| **macOS** | `Cmd+Shift+4` then `Space` → click window | Window |
| **Windows** | `Win+Shift+S` | Selection (copies to clipboard) |
| **Windows** | Snipping Tool (`Win+S` → search "snip") | Selection |
| **Linux** | `gnome-screenshot -a` or Flameshot | Selection |

> **Tip:** For complex designs, annotate the screenshot in Figma with notes about interactions, hover states, and non-obvious behavior before screenshotting.

---

## Step 2: Paste and Describe

```
[Paste screenshot with Ctrl+V / Cmd+V in Claude's prompt box]

> Build this component as a React + TypeScript component using Tailwind CSS.

  Component name: ProductCard
  Location: src/components/features/products/ProductCard.tsx

  From the design I can see:
  - Card with white background, subtle shadow, 16px padding, 8px border radius
  - Product image (16:9 ratio) at the top
  - Badge in the top-right corner of the image (color depends on category)
  - Product name in text-lg font-semibold
  - Star rating (1-5) with filled/empty stars
  - Price in text-xl font-bold text-primary-600
  - "Add to Cart" button full width at the bottom

  Props needed:
  - id: string
  - name: string
  - price: number (display as formatted currency)
  - imageUrl: string
  - imageAlt: string
  - rating: number (0-5, support decimals)
  - reviewCount: number
  - category: 'new' | 'sale' | 'bestseller' | null
  - onAddToCart: (id: string) => void

  Reuse: Button from @src/components/ui/Button.tsx, Badge from @src/components/ui/Badge.tsx
  Icons: use Heroicons for the star icons
```

---

## Step 3: Iterate

After Claude generates the component, check it visually:

### If the layout is wrong
```
[Select the generated component in VS Code]
> the layout isn't matching the design. specifically:
  - the image is square but should be 16:9 aspect ratio
  - the badge is positioned inside the card padding, should be absolute top-right of the image
  - the rating and review count should be on the same line
  here's the original design again: [paste screenshot]
```

### If spacing is off
```
> the spacing doesn't match the design:
  - gap between image and content should be 16px (gap-4), currently looks like 8px
  - padding inside the card should be 16px on all sides
  - margin between name and rating should be 8px
```

### If colors are wrong
```
> update the colors to match our design system:
  - the "sale" badge should use our danger-500 color (bg-danger-500 text-white)
  - the price text should be primary-700, not primary-600
  - the star icons: filled = text-yellow-400, empty = text-gray-200
```

### If behavior is missing
```
> add the hover/interactive states I can see in the design:
  - card: slight scale up on hover (scale-[1.02]) with transition
  - button: bg-primary-700 on hover
  - entire card is clickable (links to /products/{id}) but the button click is separate
```

---

## Step 4: Multi-State Components

For components with multiple states, screenshot each one:

```
I have 4 states for the OrderStatus badge:
[paste screenshot 1] — pending state
[paste screenshot 2] — processing state
[paste screenshot 3] — shipped state
[paste screenshot 4] — delivered state

Build a StatusBadge component with a `status` prop that handles all 4 states.
Each has different background color, text color, and icon.
```

---

## Step 5: Full Page Layouts

For full pages, break them into sections:

```
[paste screenshot of the full page]

> This is the product listing page. Break it down into these components:
  1. PageHeader — with breadcrumbs and page title
  2. FilterSidebar — with category filters, price range, and rating filter
  3. ProductGrid — responsive grid of ProductCard components
  4. Pagination — at the bottom

  Let's build them in order. Start with the PageHeader.
```

Then tackle each component:
```
> now let's do the FilterSidebar.
  [paste screenshot of just the sidebar]
```

---

## Step 6: Responsive Designs

If Figma has mobile and desktop frames:

```
[paste mobile screenshot]
[paste desktop screenshot]

> this component needs to be responsive. I've pasted both the mobile (375px)
  and desktop (1280px) designs.

  Mobile: single column, image full width, all text visible
  Desktop: image on left (40%), content on right (60%), side by side

  Build it mobile-first using Tailwind responsive prefixes.
```

---

## Step 7: Animation & Transitions

For animated designs (Figma prototypes):

```
> the design has these animations (I can't screenshot these directly):
  - modal: fades in + scales from 95% to 100% (150ms ease-out)
  - dropdown: slides down from the trigger point (200ms ease-out)
  - toast notification: slides in from right, auto-dismisses after 3s with fade out
  - button loading state: text changes to spinner icon

  Add these transitions to the [component name] component.
  Use Tailwind's transition utilities where possible, CSS keyframes for the rest.
```

---

## Step 8: Design Tokens

If your design system uses tokens that should stay in sync with Figma:

```
> looking at this design [paste screenshot], identify all the color values used.
  Check if they match our design tokens in @tailwind.config.ts.
  Flag any colors in the design that don't exist in our token system,
  and suggest the closest existing token or whether we need to add a new one.
```

---

## Figma Variables to Code

If you use Figma variables:

```
> our Figma design uses these variable values for this component:
  background: {colors/surface/primary} = #FFFFFF
  border: {colors/border/default} = #E5E7EB
  text-primary: {colors/text/primary} = #111827
  text-secondary: {colors/text/secondary} = #6B7280
  spacing-md: {spacing/md} = 16px

  Map these to our Tailwind tokens when building the component.
```

---

## Common Figma-to-Code Prompt Patterns

| Situation | Prompt pattern |
|-----------|---------------|
| Basic component | `[screenshot] build this as a React + TS component using Tailwind. name: [Name], props: [list]` |
| Fix wrong layout | `[screenshot] the layout is wrong: [specific issues]. original design: [re-paste]` |
| Multiple states | `[screenshots of each state] build [Name] with a status prop handling all states` |
| Full page | `[screenshot] break this page into components and build them one at a time, starting with [name]` |
| Responsive | `[mobile screenshot] [desktop screenshot] build mobile-first with breakpoints at [sizes]` |
| Animations | `add these transitions: [describe each animation with timing]` |
| Token audit | `[screenshot] identify colors used and check against @tailwind.config.ts` |

---

## Tips for Better Results

- **One component at a time** — don't paste a full page and ask for everything at once
- **Name your props** — telling Claude what the props should be gives better TypeScript output
- **Reference your existing components** — `reuse Button from @src/components/ui/Button.tsx` prevents Claude from inventing a new one
- **Screenshot at 1x or 2x** — 3x Retina screenshots are large and don't add accuracy
- **Annotate in Figma first** — add sticky notes to the design for interactions Claude can't see in a static screenshot
- **Keep Figma and VS Code side by side** — compare Claude's output visually against the design as you iterate
