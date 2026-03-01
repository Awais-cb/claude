# Chrome Browser Integration

Think of Chrome integration like having Claude look over your shoulder while you browse — it can see what's on screen and help you interact with it. Instead of writing Selenium or Playwright automation scripts, you just describe what you want in plain English and Claude drives the browser.

This is powerful for testing web apps, extracting data from pages, automating repetitive form filling, and debugging frontend issues in a real browser environment.

![Claude Code controlling a Chrome browser window](./images/chrome-integration.png)
> *What to expect: A Chrome browser window opens (or runs invisibly in headless mode), Claude navigates to pages, clicks buttons, fills fields, and reports back what it sees.*

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

## Checking that Chrome is Installed

Before you start, make sure Chrome is installed on your system.

**macOS:**
```bash
# Check if Chrome is installed
ls /Applications/Google\ Chrome.app

# Or check the binary path
which google-chrome 2>/dev/null || which chromium 2>/dev/null || echo "Not in PATH"
```

If Chrome is not installed, download it from https://www.google.com/chrome/

**Linux (Ubuntu):**
```bash
# Check if Chrome is installed
google-chrome --version 2>/dev/null || chromium-browser --version 2>/dev/null || echo "Chrome not found"

# Install Chrome on Ubuntu if needed
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb

# Or install Chromium (open-source version)
sudo apt install chromium-browser
```

**Windows (WSL):**
```bash
# Chrome on Windows is accessible from WSL
# Check if the Chrome executable exists at the typical Windows path
ls /mnt/c/Program\ Files/Google/Chrome/Application/chrome.exe 2>/dev/null && echo "Chrome found" || echo "Chrome not found"
```

If Chrome is not found, install it in Windows (not inside WSL) from https://www.google.com/chrome/

**Windows (PowerShell):**
```powershell
# Check if Chrome is installed
Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe"

# Or check via registry
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" -ErrorAction SilentlyContinue
```

---

## Step-by-Step Setup

### macOS Setup

1. Install Chrome if needed (see above)
2. Open Terminal
3. Start Claude Code with Chrome:
   ```bash
   claude --chrome
   ```
4. Claude will open Chrome automatically when you ask it to browse

### Linux (Ubuntu) Setup

1. Install Chrome or Chromium (see above)
2. If you are running a headless server (no GUI), Claude automatically uses headless mode
3. If you have a desktop environment, Claude opens a visible browser window:
   ```bash
   claude --chrome
   ```

For servers without a display, set up a virtual display if you want to see the browser:
```bash
# Install virtual display
sudo apt install xvfb

# Run Claude with virtual display
Xvfb :99 -screen 0 1280x800x24 &
export DISPLAY=:99
claude --chrome
```

### Windows (WSL) Setup

1. Chrome must be installed on the Windows side (not inside WSL)
2. Claude Code running in WSL can use the Windows Chrome binary
3. Start Claude with Chrome:
   ```bash
   claude --chrome
   ```

### Windows (PowerShell) Setup

1. Install Chrome for Windows (see above)
2. Open PowerShell
3. Start Claude Code with Chrome:
   ```powershell
   claude --chrome
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

### Web scraping

```
> go to https://news.ycombinator.com
> extract the top 10 story titles and their URLs into a JSON array
> save the result to scripts/hn-top10.json
```

### Visual regression testing

```
> take screenshots of our app at:
  - http://localhost:3000/home
  - http://localhost:3000/dashboard
  - http://localhost:3000/settings
> compare each with the baseline screenshots in screenshots/baseline/
> report any layout differences
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

### Example 5: Extracting structured data

```
> Go to https://store.example.com/products
> Scroll through all pages (handle pagination)
> Extract product names, prices, and stock status into CSV
> Save to data/products.csv
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

## Troubleshooting Common Issues

### Chrome won't open

**macOS:**
```bash
# Make sure Chrome is in Applications
open /Applications/Google\ Chrome.app

# If Claude can't find it, specify the path
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
claude --chrome
```

**Linux (Ubuntu):**
```bash
# Test that Chrome runs directly
google-chrome --version

# If missing, reinstall
sudo apt install --reinstall google-chrome-stable

# On headless server, confirm virtual display is running
echo $DISPLAY
```

**Windows (WSL):**
```bash
# Confirm the Windows Chrome path is accessible from WSL
ls /mnt/c/Program\ Files/Google/Chrome/Application/chrome.exe
```

### "No display" error on Linux server

```bash
# Install and run a virtual framebuffer
sudo apt install xvfb
Xvfb :99 -screen 0 1280x800x24 &
export DISPLAY=:99
claude --chrome
```

### Chrome opens but Claude can't control it

This usually means another Chrome process is running with a conflicting user profile. Close all Chrome windows and try again:

**macOS / Linux:**
```bash
pkill -f chrome
claude --chrome
```

**Windows (PowerShell):**
```powershell
Stop-Process -Name chrome -Force
claude --chrome
```

### Slow performance

For automation tasks where you don't need to see the browser, Claude runs Chrome in headless mode automatically in CI. If you are running locally and want faster performance:

```bash
# Claude handles headless mode automatically in print mode
claude -p "test the login form" --chrome
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

```
Browser observation
      │
      ▼
Identify the error (console, network tab, visual)
      │
      ▼
Find the relevant source file
      │
      ▼
Edit the code
      │
      ▼
Reload browser and verify
      │
      ▼
Report result
```
