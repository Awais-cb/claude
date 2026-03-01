# Fast Mode

Think of Fast Mode like choosing express checkout at the grocery store versus the regular lane. You're buying the same items, paying the same prices (actually a bit more for the express convenience), but you get through the line much faster. Fast Mode gives you the same Claude Opus model with the same capabilities — just dramatically lower latency.

When you're in the middle of a debugging session and need answers quickly, waiting 25 seconds per response breaks your concentration. Fast Mode cuts that to roughly 4–12 seconds, keeping you in the flow.

> **Note: Research Preview** — Fast Mode is currently in research preview. Features, pricing, availability, and rate limits may change as the feature evolves. Check the official Claude Code documentation for the latest details before relying on it for production workflows.

---

## What is Fast Mode?

Normal Claude Code: Claude thinks, then responds in ~10–30 seconds.
Fast Mode: Same quality, same model, ~4–12 seconds.

**Same model. Just faster.**

---

## Toggle Fast Mode

```
> /fast          # Toggle on/off
> /fast on       # Turn on
> /fast off      # Turn off
```

Or use the keyboard shortcut (after `/terminal-setup`):

**macOS:**
```
Option+F    # Toggle Fast Mode on/off
```

**Linux (Ubuntu) / Windows (WSL):**
```
Alt+F       # Toggle Fast Mode on/off
```

> **Note on the shortcut:** The `Option` key on macOS is the same physical key as `Alt`, but macOS terminals sometimes handle it differently. If `Option+F` doesn't work, try running `/terminal-setup` first, then restart your terminal. On Linux and Windows, `Alt+F` works directly.

### Status indicator

When Fast Mode is on, you'll see a `↯` icon in the footer bar at the bottom of your terminal:

```
↯ claude-opus-4-6  •  Normal  •  $0.12
```

Without Fast Mode, the `↯` icon is absent:
```
claude-opus-4-6  •  Normal  •  $0.08
```

> **Windows/Linux note:** The status bar appears at the very bottom of your terminal window. If you don't see it, your terminal may need to be wider — try making the window at least 80 characters wide. On some Linux terminal emulators (like older versions of `xterm`), the footer may not render correctly; try using GNOME Terminal, Kitty, or Alacritty instead.

![The Claude Code footer showing the Fast Mode lightning bolt indicator](./images/fast-mode-status-bar.png)
> *What to expect: The bottom status bar shows a `↯` lightning bolt symbol to the left of the model name when Fast Mode is active. The indicator disappears when Fast Mode is off.*

---

## Fast Mode is Persistent

Once enabled, Fast Mode **stays on** across sessions until you turn it off. This is intentional — if you like it, you don't have to keep re-enabling it.

To make it the default in settings:

```json
{
  "fastMode": true
}
```

---

## Cost Comparison

| Mode | Input (per MTok) | Output (per MTok) |
|------|-----------------|------------------|
| Standard (< 200K) | $15 | $75 |
| Standard (> 200K) | $30 | $150 |
| **Fast (< 200K)** | **$30** | **$150** |
| **Fast (> 200K)** | **$60** | **$225** |

Fast Mode costs approximately 2× more per token. But for interactive work, the time savings are often worth it.

**What does "per MTok" mean?** MTok = million tokens. Tokens are roughly 3/4 of a word. A typical conversation exchange might use 2,000–5,000 tokens total. At those volumes, the difference between Standard and Fast is a fraction of a cent per message — the cost only becomes significant for very long autonomous tasks running for hours.

---

## Decision Flowchart: Which Mode to Use?

Use this to decide between Fast Mode, standard mode, or switching to Haiku:

```
Are you actively watching and waiting for responses?
|
+-- YES --> Do you need Opus-level quality?
|           |
|           +-- YES --> Use Fast Mode (speed + quality)
|           |
|           +-- NO  --> Is the task simple (rename, explain, quick edit)?
|                       |
|                       +-- YES --> Use Haiku (cheapest + fast)
|                       +-- NO  --> Use Fast Mode (balanced choice)
|
+-- NO  --> Is this a long unattended task (running for hours)?
            |
            +-- YES --> Use Standard mode (save money while you're away)
            +-- NO  --> Use Standard mode (you won't notice the wait)
```

---

## When to Use Fast Mode

### Great for:
- **Live debugging** — you want answers fast, not in 30 seconds
- **Rapid iteration** — making quick edits and checking results
- **Short questions** — "what does this function return?"
- **Real-time collaboration** — working interactively with a teammate watching
- **Time-sensitive work** — you're in a production incident

### Not ideal for:
- **Long autonomous tasks** — running for hours unattended
- **Batch processing** — analyzing many files sequentially
- **Cost-sensitive work** — when every token counts
- **Complex reasoning** — Fast Mode doesn't reduce thinking quality, but if you're not in a hurry, save the money

---

## Combining with Effort Level

You can combine Fast Mode with low effort for maximum speed:

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_EFFORT_LEVEL=low claude
# then inside the session:
> /fast on
```

**Windows (WSL):**
```bash
CLAUDE_CODE_EFFORT_LEVEL=low claude
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_EFFORT_LEVEL="low"
claude
# then inside the session:
> /fast on
```

This gives you:
- Low thinking budget (minimal reasoning overhead)
- Fast Mode API (lower latency)
- Result: near-instant responses

Use this for simple, repetitive tasks where speed matters most.

---

## Requirements

- **Account type**: Requires extra usage credits enabled
- **Model**: Only available on Opus models (not Sonnet/Haiku — those are already fast)
- **Cloud providers**: NOT available on AWS Bedrock, Google Vertex AI, or Azure Foundry

### Enable extra usage

```
> /extra-usage
```

Follow the prompts to add extra usage credits to your account.

**What are "extra usage credits"?** Claude Code subscriptions include a base amount of usage. Extra usage credits are an add-on that unlocks Fast Mode (among other premium features). Think of it like upgrading from a basic streaming plan to a premium one — same service, more capabilities. You purchase additional credits through the Claude Code settings or your account dashboard.

### Teams/Enterprise

Admins must enable Fast Mode in the admin dashboard before users can activate it.

---

## Fast Mode vs Haiku

| | Fast Mode (Opus) | Haiku |
|--|-----------------|-------|
| **Speed** | ~2.5× faster than standard Opus | Fastest model |
| **Quality** | Full Opus capability | Lower capability |
| **Cost** | Higher than Haiku | Cheapest |
| **Best for** | Complex tasks where you need speed + quality | Simple tasks |

Use **Fast Mode** when the task needs Opus-level reasoning but you want it fast.
Use **Haiku** when the task is simple and cost matters most.

---

## Disabling Fast Mode Globally

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_DISABLE_FAST_MODE=true claude
```

**Windows (WSL):**
```bash
CLAUDE_CODE_DISABLE_FAST_MODE=true claude
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_DISABLE_FAST_MODE="true"
claude
```

Or in settings:
```json
{
  "fastMode": false
}
```

---

## Rate Limits

Fast Mode uses a separate rate limit pool from standard mode. If you hit the Fast Mode rate limit, Claude automatically falls back to standard Opus — you won't see an error, just slightly slower responses.
