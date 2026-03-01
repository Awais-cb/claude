# Extended Thinking / Reasoning Mode

Extended Thinking lets Claude reason through complex problems before responding. Instead of jumping straight to an answer, Claude works through the problem step-by-step internally — like a scratchpad — producing better results on hard tasks.

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

## How to Enable/Disable

### Toggle in a session

```bash
Option+T    # macOS
Alt+T       # Linux/Windows
```

> **Note:** Requires `/terminal-setup` to be run first for the shortcut to work.

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

---

## Effort Levels

On **Opus** models, you can control how much thinking Claude does.

### Set effort level

```
> /model
```

Use arrow keys to adjust effort: **low**, **medium** (default), **high**.

Or set via environment variable:

```bash
CLAUDE_CODE_EFFORT_LEVEL=high claude
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

```bash
MAX_THINKING_TOKENS=10000 claude
```

Lower values = faster but potentially less thorough reasoning.
Higher values = deeper reasoning on complex problems.

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

```bash
CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING=true claude
```
