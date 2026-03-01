# Extended Thinking / Reasoning Mode

Imagine asking a colleague a tricky question. There are two ways they might answer: they could blurt out the first thing that comes to mind, or they could pause, think it through out loud, consider a few angles, and then give you a considered answer. Extended Thinking is the second approach — Claude works through the problem step-by-step before responding, rather than jumping straight to an answer.

Without thinking enabled, Claude generates a response in one pass, which works great for simple tasks. With thinking enabled, Claude reasons internally first — like writing notes on a scratchpad — then gives you a response built on that reasoning. The result is noticeably better quality on hard problems.

![Claude showing gray thinking text before the final answer](./images/thinking-mode-output.png)
> *What to expect: Before the main response, you'll see a collapsible gray section labeled "[thinking]" showing Claude's internal reasoning process — like watching someone work through a problem on a whiteboard.*

---

## What is Extended Thinking?

When thinking is enabled, Claude:
1. **Reasons internally** before responding (you can see this in verbose mode)
2. **Considers multiple approaches** and picks the best one
3. **Catches its own mistakes** before showing you the answer

It's especially useful for:
- Complex algorithmic problems
- Debugging tricky bugs
- Architecture decisions
- Multi-step planning
- Math and logic problems

---

## Before and After: The Same Question With and Without Thinking

Here's a concrete example of how thinking changes the quality of an answer.

**Without thinking (quick response):**
```
> Why is my React component re-rendering on every keystroke?

Answer: You probably have a state update in the wrong place. Move your
useState call to the top of the component.
```

**With thinking enabled (reasoned response):**
```
[thinking]
The user is describing re-renders on every keystroke. Let me think through
the common causes: state updates inside the render, unstable object/function
references passed as props, missing or incorrect useCallback/useMemo, context
changes, or parent re-renders cascading down. The keystroke detail suggests
an input field is involved. Most likely cause: the onChange handler is defined
inline as an arrow function, creating a new reference each render and causing
downstream effects to fire. Let me think about how to confirm this...

[answer]
The most likely cause is an inline arrow function in your onChange prop:

// This creates a new function reference on every render:
<input onChange={(e) => handleChange(e)} />

// Fix: define it with useCallback:
const handleChange = useCallback((e) => {
  setValue(e.target.value);
}, []);

// Or pass the reference directly (if no arguments needed):
<input onChange={handleChange} />

Also check: are you passing object/array literals directly as props to
child components? Those also get new references each render.
```

The thinking version catches more edge cases and gives more actionable advice.

---

## When Would a Beginner Actually Want This?

You don't need thinking mode for everything. Here's a practical guide:

**Turn thinking ON when:**
- You've been stuck on a bug for more than 15 minutes
- You're asking an architecture question ("should I use X or Y approach?")
- The problem involves multiple interacting systems or files
- You're asking Claude to design something from scratch
- The answer requires understanding trade-offs
- Math, logic puzzles, or algorithm design is involved

**Leave thinking OFF (or use low effort) when:**
- You're asking Claude to rename a variable or fix a typo
- You want a quick explanation of what a function does
- You're generating boilerplate code for a familiar pattern
- You're asking simple factual questions
- You're iterating quickly and want fast responses

---

## How to Enable/Disable

### Toggle in a session

**macOS:**
```bash
Option+T    # Toggle extended thinking on/off
```

**Linux (Ubuntu) / Windows (WSL):**
```bash
Alt+T       # Toggle extended thinking on/off
```

> **Note:** These keyboard shortcuts require `/terminal-setup` to be run first. If the shortcut doesn't work, run `/terminal-setup` once in your Claude Code session, then restart your terminal.

> **macOS vs Linux/Windows key difference:** On macOS, the modifier key is `Option` (also written as `Alt` on some keyboards, but it's the `⌥` key). On Linux and Windows, it's the standard `Alt` key. If you're on macOS and `Alt+T` doesn't work, try `Option+T` instead.

### Set as default

```
> /config
```

In the Settings tab, toggle **"Always use extended thinking"**.

Or in `~/.claude/settings.json`:

```json
{
  "alwaysThinkingEnabled": true
}
```

---

## Seeing the Thinking

Enable verbose mode to watch Claude reason:

```bash
Ctrl+O    # Toggle verbose output
```

You'll see the thinking displayed in **gray italic text** before the final answer:

```
[thinking]
Let me analyze the authentication flow...
The bug is likely in how we handle expired tokens...
Looking at line 47, I see the issue — the condition is inverted...

[answer]
Found the bug! On line 47 of auth.js, the condition `!isExpired` should
be `isExpired`. Here's the fix:
```

![Gray thinking block shown above the final answer in the terminal](./images/thinking-verbose-output.png)
> *What to expect: When verbose mode is on, the thinking section appears as gray/dimmed text above the regular response. It's collapsible — click or press a key to expand/collapse it. The final answer appears below in normal white text.*

---

## Effort Levels

On **Opus** models, you can control how much thinking Claude does.

### Set effort level

```
> /model
```

Use arrow keys to adjust effort: **low**, **medium** (default), **high**.

Or set via environment variable:

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_EFFORT_LEVEL=high claude
```

**Windows (WSL):**
```bash
CLAUDE_CODE_EFFORT_LEVEL=high claude
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_EFFORT_LEVEL="high"
claude
```

### When to use each level

| Level | Use for | Cost |
|-------|---------|------|
| **Low** | Simple questions, quick edits | Cheapest |
| **Medium** | Regular coding tasks (default) | Balanced |
| **High** | Complex architecture, tricky bugs, hard algorithms | Most expensive |

### Example: High effort for a hard problem

```bash
CLAUDE_CODE_EFFORT_LEVEL=high claude

> This sorting algorithm has incorrect output for arrays with duplicate values.
  I've been stuck on it for hours. Find the bug.
```

With high effort, Claude will deeply analyze every edge case before answering.

---

## Thinking Budget

You can limit how many tokens Claude spends on thinking:

**macOS / Linux (Ubuntu):**
```bash
MAX_THINKING_TOKENS=10000 claude
```

**Windows (WSL):**
```bash
MAX_THINKING_TOKENS=10000 claude
```

**Windows (PowerShell):**
```powershell
$env:MAX_THINKING_TOKENS="10000"
claude
```

Lower values = faster but potentially less thorough reasoning.
Higher values = deeper reasoning on complex problems.

Think of tokens like words: 10,000 tokens gives Claude roughly 7,500 words of internal thinking space. For most problems, the default is fine. For very hard algorithmic or architectural questions, raising this limit can help.

---

## Adaptive Thinking (Opus)

**Claude Opus** dynamically decides how much to think based on the task difficulty. Simple questions get quick responses; hard problems get deep analysis.

This is automatic — you don't need to configure it. Just set your effort level and Opus handles the rest.

**Other models** (Sonnet, Haiku) use a fixed thinking budget.

---

## Practical Examples

### Debugging a complex bug

```
[Thinking enabled, high effort]
> This function returns wrong results when input contains Unicode characters.
  I can't figure out why.

[Claude thinks through: encoding issues, byte vs character length,
Unicode normalization forms, comparison operators...]

Answer: The bug is in `str.length` on line 23 — in JavaScript, `length`
returns byte count for some Unicode chars, not character count.
Replace with `[...str].length` or use `Array.from(str).length`.
```

### Architecture decision

```
> Should I use event sourcing or CQRS for this feature?
  We have 10k writes/day and need audit logging.

[Claude thinks through trade-offs, your specific scale,
implementation complexity, team familiarity...]

Based on your scale (10k writes/day) and need for audit logging,
here's my recommendation: simple audit log table is sufficient...
```

### Algorithm design

```
[High effort]
> Design an algorithm to find all pairs of integers in an array
  that sum to a target, in O(n) time and O(1) space.

[Claude reasons through multiple approaches, constraints,
edge cases...]

This is actually impossible with O(1) space. Here's the best
achievable — O(n) time with O(n) space using a hash set...
```

### Beginner scenario: "Why doesn't my code work?"

```
[Thinking enabled, medium effort]
> My Express.js server crashes when I call POST /users but GET /users
  works fine. I can't figure out the difference.

[Claude thinks through: method-specific middleware, body parsing,
route order, async error handling in Express, missing error
boundaries for async route handlers...]

Answer: Express doesn't catch errors from async route handlers by
default. Your POST handler is async but throws an unhandled promise
rejection. Wrap it:

router.post('/users', async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    next(err);  // Pass to Express error handler
  }
});
```

---

## Thinking vs No Thinking: Speed Trade-off

| Mode | Speed | Quality on complex tasks |
|------|-------|------------------------|
| No thinking | Fastest | Good for simple tasks |
| Low effort | Fast | Better for moderately complex |
| Medium effort | Normal | Great for most coding tasks |
| High effort | Slower | Best for hard problems |

For simple edits (fix a typo, rename a variable), thinking adds unnecessary latency. For architectural decisions or hard bugs, it's worth the extra time.

---

## Disabling Adaptive Thinking

If you prefer the old fixed-budget behavior (not dynamic):

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=true claude
```

**Windows (WSL):**
```bash
CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=true claude
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING="true"
claude
```
