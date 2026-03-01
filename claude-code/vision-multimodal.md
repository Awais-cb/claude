# Vision & Multimodal

Think of this like sending a photo to a knowledgeable friend and asking "what do you think?" — except Claude can actually analyze what it sees in technical detail. You can take a screenshot of a broken UI, a whiteboard diagram, a design mockup, or a wall of error messages and paste it directly into your Claude Code session. Claude will look at the image and respond as if it has eyes.

This changes the way you work. Instead of typing out a long description of what is wrong with your layout, you just show it. Instead of explaining what a diagram says, you paste it and ask Claude to generate code from it.

![Image being pasted into a Claude Code terminal session](./images/image-paste-demo.png)
> *What to expect: After copying a screenshot, pressing Ctrl+V in the terminal pastes the image inline. Claude acknowledges it and begins analyzing the visual content.*

---

## Pasting Images

### Taking a screenshot and pasting it

The workflow is: take a screenshot, then paste it into Claude Code.

**macOS:**

Take the screenshot:
```
Cmd+Shift+4         # Select a region (saves to Desktop)
Cmd+Shift+4, Space  # Click a window to capture just that window
Cmd+Shift+3         # Capture the full screen
Cmd+Ctrl+Shift+4    # Capture region to clipboard (no file saved)
```

Paste into Claude Code:
```
Ctrl+V
```

**Linux (Ubuntu):**

Take the screenshot (several tools available):
```bash
# gnome-screenshot (GNOME desktop)
gnome-screenshot -a           # Select a region (saves to Pictures)
gnome-screenshot -a -c        # Select a region, copy to clipboard

# scrot (lightweight, any desktop)
scrot -s /tmp/screenshot.png  # Select a region and save

# Flameshot (feature-rich, supports annotation)
flameshot gui                 # Opens GUI selector with annotation tools
```

Paste into Claude Code:
```
Ctrl+V
```

**Windows (WSL / PowerShell):**

Take the screenshot:
```
Win+Shift+S     # Snipping Tool — select a region (copies to clipboard)
Win+PrtSc       # Full screen to clipboard
Alt+PrtSc       # Active window to clipboard
```

Or use the Snipping Tool app for more control (search "Snipping Tool" in Start).

Paste into Claude Code:
```
Ctrl+V
```

> Note: When using WSL, make sure you are running Claude Code in a terminal that supports image paste (such as Windows Terminal). The clipboard is shared between Windows and WSL.

### From a file

Just reference the file path:
```
> analyze this screenshot: /tmp/error-screenshot.png
> what's wrong with the UI in ~/Desktop/mockup.jpg?
```

**macOS / Linux (Ubuntu):**
```
> analyze this screenshot: /Users/yourname/Desktop/bug.png
> what's wrong with the UI in /home/yourname/mockup.jpg?
```

**Windows (WSL):**
```
> analyze this screenshot: /mnt/c/Users/yourname/Desktop/bug.png
```

Or drag-and-drop the image file into your terminal (works in most modern terminals).

---

## What You Can Do With Images

### Debug UI issues

```
[Paste screenshot of broken layout]
> Why is the sidebar overlapping the content area?
```

### Implement designs

```
[Paste a Figma mockup or design screenshot]
> Implement this UI in React with Tailwind CSS
```

### Analyze error screens

```
[Paste a screenshot of an error dialog]
> What caused this error and how do I fix it?
```

### Understand architecture diagrams

```
[Paste a system architecture diagram]
> Explain this architecture and identify potential bottlenecks
```

### Decode screenshots of code

```
[Paste a photo of code on a whiteboard]
> Transcribe and explain this code
```

### Read charts and data visualizations

```
[Paste a performance graph]
> What trends does this graph show? What should I investigate?
```

---

## When to Use Vision Instead of Text

```
Situation                          Approach
─────────────────────────────────────────────────────
UI looks wrong / broken            Paste a screenshot
Error message on screen            Paste a screenshot (faster than typing it)
Design to implement                Paste the mockup
Diagram to understand              Paste the diagram
Whiteboard from a meeting          Photograph it and paste
Console errors in browser          Screenshot DevTools and paste
Test output with visual gaps       Screenshot and paste
Database schema diagram            Paste ER diagram image
```

---

## Practical Examples

### Example 1: Fix a visual bug

```
[You paste a screenshot showing text overlapping a button]

> The "Submit" button is being covered by the error message.
  Fix the CSS.

Claude: I can see the issue — the error message has `position: absolute`
but the button doesn't have proper z-index. Here's the fix...
```

### Example 2: Build from a design

```
[You paste a screenshot of a login page design]

> Build this login form in HTML + CSS. Match the design exactly.

Claude: Looking at the design, I can see:
- White card with 24px border radius
- Email and password fields with gray borders
- Blue "Sign In" button
- "Forgot password?" link below...

Here's the implementation:
```

### Example 3: Debug a console error

```
[You paste a screenshot of browser DevTools with red error messages]

> Fix these JavaScript errors

Claude: I can see three errors:
1. TypeError: Cannot read property 'map' of undefined
   → In UserList.jsx, the `users` prop is undefined on first render
2. ...
```

### Example 4: Read a diagram

```
[You paste an ER diagram from a whiteboard photo]

> Generate SQL CREATE TABLE statements from this ER diagram

Claude: I can see 4 entities in the diagram:
- users (id, email, name, created_at)
- orders (id, user_id, total, status)
...
```

### Example 5: Recreate a competitor's UI

```
[You paste a screenshot of a competitor's dashboard]

> Recreate this dashboard layout in our app using our existing
  component library. Match the structure but use our brand colors.

Claude: I can see a three-column layout with:
- Left nav with icons
- Center feed with cards
- Right sidebar with summary stats
Here's how to implement this...
```

### Example 6: Read a terminal error screenshot

```
[You paste a screenshot of a red stack trace in the terminal]

> What caused this and how do I fix it?

Claude: I can read the stack trace. The root cause is:
  TypeError: Cannot read properties of null (reading 'user')
  at middleware.js:47
The problem is that req.session is null when the session
middleware hasn't run yet. Here's the fix...
```

---

## Annotating Screenshots Before Pasting

On each platform you can annotate (draw arrows, circles, labels) before pasting to highlight exactly what you want Claude to look at:

**macOS:**
- Open the screenshot in Preview (double-click the file)
- Use the Markup toolbar (pencil icon) to draw shapes and arrows
- Copy (Cmd+C) and paste into Claude Code

**Linux (Ubuntu):**
- Use Flameshot: `flameshot gui` — it has built-in annotation tools
- Or open the image in GIMP and use the drawing tools

**Windows:**
- Open the screenshot in the Photos app and use Edit > Draw
- Or use Paint (search "Paint" in Start) to add arrows and shapes
- Or use Snipping Tool's built-in pen tool right after capturing

---

## Multiple Images

You can include multiple images in a single message:

```
[Paste image 1]
[Paste image 2]

> Compare these two UI versions and tell me which has better UX
```

---

## Images in Context

Images persist in the conversation context:

```
[Paste a wireframe]

> Implement this wireframe as a React component

[Claude implements it]

> Now make the button red like in the original design

Claude still has the image in context and refers back to it.
```

---

## Opening Images from Responses

When Claude references an image it created or analyzed:

**macOS:**
```
Cmd+Click   # Opens image in viewer
```

**Linux (Ubuntu) / Windows (WSL):**
```
Ctrl+Click  # Opens image in viewer
```

---

## Limitations

- **Max image size**: Depends on model (typically up to 5MB per image)
- **Formats supported**: PNG, JPEG, GIF, WebP
- **PDFs**: Not supported as images (use text extraction instead)
- **Image generation**: Claude Code cannot generate images, only analyze them

---

## Tips

- **Screenshots are gold** — instead of describing a bug, just show it
- **Paste design mockups** to get accurate implementations
- **Annotate screenshots** with arrows/circles in Preview/Paint/Flameshot before pasting to highlight specific areas
- **System diagram photos** — Claude handles messy whiteboard photos surprisingly well
- **Browser DevTools screenshots** save a lot of typing when debugging frontend errors
- **Multiple images** can be pasted in one message to ask for a comparison or combined analysis
