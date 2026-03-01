# Vision & Multimodal

Claude Code can see and analyze images. Paste screenshots, diagrams, mockups, or error screens directly into your session — Claude understands them.

---

## Pasting Images

### From clipboard

```bash
Ctrl+V      # Linux/Windows
Cmd+V       # macOS
Alt+V       # Alternative
```

Take a screenshot, then paste it directly into the Claude Code terminal.

### From a file

Just reference the file path:
```
> analyze this screenshot: /tmp/error-screenshot.png
> what's wrong with the UI in ~/Desktop/mockup.jpg?
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

```
Cmd+Click   # macOS — opens image in viewer
Ctrl+Click  # Linux/Windows
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
- **Annotate screenshots** with arrows/circles in Preview/Paint before pasting to highlight specific areas
- **System diagram photos** — Claude handles messy whiteboard photos surprisingly well
