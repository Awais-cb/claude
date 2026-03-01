# Cost Tracking & Usage Monitoring

Claude Code shows you exactly how many tokens you've used and what it's costing you, so you can manage your usage.

---

## Checking Your Costs

### Current session cost

```
> /cost
```

Shows:
- Input tokens used
- Output tokens used
- Estimated cost for this session
- Breakdown by model (if you switched models)

### Account usage & limits

```
> /usage
```

Shows:
- Your plan's monthly limits
- How much you've used this billing period
- Rate limit status

### Usage statistics

```
> /stats
```

Shows visual charts of:
- Daily usage over time
- Sessions per day
- Model preferences
- Usage streaks

---

## Token Pricing (Approximate)

| Model | Input | Output |
|-------|-------|--------|
| **Opus** (standard) | $15/MTok | $75/MTok |
| **Opus** (Fast Mode) | $30/MTok | $150/MTok |
| **Sonnet** | $3/MTok | $15/MTok |
| **Haiku** | $0.25/MTok | $1.25/MTok |

*MTok = million tokens. Prices may change — check anthropic.com for current rates.*

**Example:** A typical coding session (10,000 input + 3,000 output tokens with Sonnet) costs about **$0.075**.

---

## Setting a Budget Limit

In non-interactive (print) mode, stop if the cost exceeds a threshold:

```bash
claude -p "do this task" --max-budget-usd 0.50
```

If Claude is mid-task and the estimated cost would exceed $0.50, it stops.

---

## Reducing Costs

### 1. Use the right model for the task

```bash
# For simple tasks (rename a variable, explain a line)
claude --model haiku

# For most coding work
claude --model sonnet   # default

# For complex reasoning (hard bugs, architecture)
claude --model opus
```

Haiku is 60× cheaper than Opus for the same task.

### 2. Use lower effort levels

```bash
CLAUDE_CODE_EFFORT_LEVEL=low claude    # Minimal thinking
CLAUDE_CODE_EFFORT_LEVEL=medium claude # Default
CLAUDE_CODE_EFFORT_LEVEL=high claude   # Maximum thinking
```

Lower effort = fewer thinking tokens = lower cost.

### 3. Compact the conversation

When context gets long, compact it:
```
> /compact
```

Longer context = more input tokens per message = higher cost. Compacting keeps context lean.

### 4. Be specific in requests

Vague requests lead to more back-and-forth:

❌ Expensive: "Make the code better"
✅ Cheaper: "Reduce the cyclomatic complexity of calculateTotal() in billing.js"

### 5. Avoid unnecessary file reads

Claude reads files to understand context. If you're asking about something specific:

❌ "Read all files and tell me about the auth system"
✅ "Read src/auth/middleware.js and explain how token validation works"

### 6. Disconnect unused MCP servers

MCP server tool descriptions take up context space even when not used:

```
> /mcp
```

Disconnect servers you're not actively using in the current session.

### 7. Use skills for reference content

Instead of pasting long style guides or API docs into the conversation, create a skill:

```markdown
---
name: api-reference
description: Internal API reference documentation
trigger: api
---
[Full API reference content here...]
```

This loads only when needed, not every message.

---

## Monitoring Team Usage (Enterprise)

Admins can access usage analytics in the admin dashboard:

- Total tokens/cost by team member
- Sessions per day
- Tool use patterns
- Cost by project
- ROI metrics (PRs created, lines of code, etc.)

---

## Free vs Paid Usage

### Free tier
- Limited monthly tokens
- Access to Claude Sonnet
- No Fast Mode

### Pro ($20/month)
- Higher limits
- All models including Opus
- Privacy settings control

### Max ($100/month)
- 5× higher limits than Pro
- Priority access
- Fast Mode available

### Teams/Enterprise
- Per-seat pricing
- Admin controls
- Usage analytics
- SSO support

### Extra usage

If you exceed plan limits:
```
> /extra-usage
```

Enables pay-as-you-go tokens on top of your plan.

---

## Cost Insights

```
> /insights
```

Shows deeper analytics:
- Most expensive sessions
- Cost per type of task
- Efficiency trends over time
- Recommendations for reducing costs

---

## Practical Cost Estimates

| Task | Approximate cost (Sonnet) |
|------|--------------------------|
| Explain a function | < $0.01 |
| Fix a small bug | $0.01–0.05 |
| Add a new feature | $0.05–0.25 |
| Full code review | $0.10–0.50 |
| Refactor a module | $0.10–0.50 |
| Explore a new codebase | $0.25–1.00 |

These are rough estimates — actual cost depends on code size and complexity.
