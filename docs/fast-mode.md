# Fast Mode

Fast Mode makes Claude respond approximately 2.5× faster by using a different API configuration. It costs more per token but dramatically reduces latency — ideal for rapid iteration and live debugging.

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
```
Option+F    # macOS
Alt+F       # Linux/Windows
```

### Status indicator

When Fast Mode is on, you'll see a `↯` icon in the footer:
```
↯ claude-opus-4-6  •  Normal  •  $0.12
```

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

---

## When to Use Fast Mode

### ✅ Great for:
- **Live debugging** — you want answers fast, not in 30 seconds
- **Rapid iteration** — making quick edits and checking results
- **Short questions** — "what does this function return?"
- **Real-time collaboration** — working interactively with a teammate watching
- **Time-sensitive work** — you're in a production incident

### ❌ Not ideal for:
- **Long autonomous tasks** — running for hours unattended
- **Batch processing** — analyzing many files sequentially
- **Cost-sensitive work** — when every token counts
- **Complex reasoning** — Fast Mode doesn't reduce thinking quality, but if you're not in a hurry, save the money

---

## Combining with Effort Level

You can combine Fast Mode with low effort for maximum speed:

```bash
CLAUDE_CODE_EFFORT_LEVEL=low claude
# then:
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

```bash
CLAUDE_CODE_DISABLE_FAST_MODE=true claude
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
