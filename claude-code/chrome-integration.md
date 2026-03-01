# Chrome Browser Integration

Claude Code can control a Chrome browser — filling forms, clicking buttons, extracting data, and automating web workflows. It's like Selenium or Playwright, but you describe what you want in plain English.

---

## Enabling Chrome Integration

```bash
# Start with Chrome enabled
claude --chrome

# Disable for a specific session
claude --no-chrome

# Enable from inside a session
> /chrome
```

---

## What You Can Do

### Test web apps

```
> go to http://localhost:3000
> log in with test@example.com and password "testpass"
> verify that the dashboard shows 5 recent orders
```

Claude opens Chrome, navigates to your local app, logs in, and verifies the content.

### Fill forms automatically

```
> fill out the user registration form with realistic test data
> submit it and capture the confirmation message
```

### Extract data from websites

```
> go to https://example.com/pricing
> extract all pricing plans into a JSON format
```

### Run end-to-end tests

```
> test the complete checkout flow:
  1. Add item to cart
  2. Proceed to checkout
  3. Enter test payment info (4242 4242 4242 4242)
  4. Complete order
  5. Verify confirmation email text appears
```

### Debug JavaScript

```
> open http://localhost:3000/app
> check the browser console for errors
> fix any JavaScript errors you find
```

### Generate demo recordings

```
> walk through the main features of the app and record a demo GIF
```

---

## Practical Examples

### Example 1: Automated smoke test

```
> Run a smoke test on the staging environment:
  1. Visit https://staging.myapp.com
  2. Verify the homepage loads (no errors)
  3. Log in with staging@test.com / testpass123
  4. Verify the dashboard loads with the user's name
  5. Create a new task called "smoke test item"
  6. Verify it appears in the list
  7. Delete it
  8. Log out
  Report pass/fail for each step
```

### Example 2: Data extraction

```
> Go to our competitor's pricing page at https://competitor.com/pricing
> Extract all plan names, prices, and features into a comparison table
> Save it as docs/competitor-pricing.md
```

### Example 3: Form automation

```
> I need to submit this bug report to our ticketing system 50 times with
  different test data. Here's the URL and the data to use:
  URL: http://internal.company.com/tickets/new
  Data: [list of test cases]
```

### Example 4: Screenshot testing

```
> Take screenshots of our app at these breakpoints:
  - 375px (mobile)
  - 768px (tablet)
  - 1440px (desktop)
> Save them to screenshots/ folder
> Compare with the baseline screenshots in screenshots/baseline/
> Report any visual differences
```

---

## Site Permissions

Configure Chrome permissions per site:

```
> /chrome
```

Opens the Chrome settings menu where you can configure:

| Permission | Options |
|------------|---------|
| Geolocation | Allow, Block, Ask |
| Camera | Allow, Block, Ask |
| Microphone | Allow, Block, Ask |
| Clipboard | Allow, Block, Ask |
| Notifications | Allow, Block |

You can set global defaults or per-domain rules.

---

## Debugging with Chrome

### See browser console logs

```
> open http://localhost:3000
> show me any JavaScript console errors
```

### Debug a specific interaction

```
> when I click the "Submit" button on the form, what happens in the network tab?
> are there any failed requests?
```

### Check for accessibility issues

```
> open the login page
> run an accessibility audit and list any WCAG violations
```

---

## Security Considerations

- Chrome integration only works with explicitly enabled sites
- Claude won't enter real credentials (use test accounts)
- Sensitive sites (banking, etc.) should be blocked in your Chrome integration settings
- Chrome runs in a controlled context — it can't access your regular browser profile

---

## Requirements

- **Chrome** must be installed
- Works on macOS, Windows, and Linux
- For CI/CD: use headless Chrome mode

### Headless Chrome in CI

```bash
# Claude handles this automatically, but you can force headless:
claude -p "test the login form" --chrome
```

In CI environments without a display, Claude automatically uses Chrome in headless mode.

---

## Combining with Code

The most powerful use: Claude finds a bug in the browser and fixes it in the code immediately.

```
> Open http://localhost:3000/checkout
> The "Place Order" button doesn't work — click it and see what errors appear
> Then find and fix the bug in the source code
> Reload and verify the fix works
```

Claude switches between the browser (observing behavior) and your code (making fixes) seamlessly.
