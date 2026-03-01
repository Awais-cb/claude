# Cost Tracking & Usage Monitoring

Think of the cost meter like a taxi meter — you want to know what the ride costs before you get somewhere expensive. Claude Code shows you exactly how many tokens you have used and what it is costing you, so you can manage your usage, set limits, and avoid surprises on your bill.

Understanding costs also helps you make smarter choices: use a cheaper model for simple tasks, use a powerful model for hard problems, and compact the conversation when it gets long.

---

## What Are Tokens? (Plain English)

Before diving into pricing, it helps to understand what tokens actually are — because "units of text" is not very intuitive.

A **token** is roughly 3-4 characters of text, or about 0.75 words. Here is a rough feel for it:

| Content | Approximate tokens |
|---------|-------------------|
| One word | ~1-2 tokens |
| One sentence | ~15-20 tokens |
| One paragraph | ~80-100 tokens |
| One page of text | ~500 tokens |
| A short source file (50 lines) | ~500-800 tokens |
| A long source file (300 lines) | ~3,000-5,000 tokens |
| A full codebase exploration | ~20,000-100,000+ tokens |

Every time you send a message, Claude reads your message AND the entire conversation history so far (input tokens). Every time Claude responds, those words cost output tokens.

The longer your conversation goes, the more input tokens each new message costs — because Claude re-reads the whole conversation each time. This is why compacting helps.

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

Example output:
```
Session cost summary:
  Input tokens:  12,450  ($0.037)
  Output tokens:  3,280  ($0.049)
  ─────────────────────────────
  Total:                  $0.086

  Model: claude-sonnet-4-6
  Duration: 23 minutes
```

![The /cost command output in a Claude Code terminal session](./images/cost-command-output.png)
> *What to expect: A short summary table showing input tokens, output tokens, and the dollar total for the current session. Appears inline in your terminal.*

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

## Practical Cost Comparison

Here is a rough sense of what common tasks cost. These are estimates — actual cost depends on how large your files are and how many back-and-forth turns are involved.

| Task | Approximate cost (Sonnet) |
|------|--------------------------|
| Explain a function | < $0.01 |
| Fix a small bug | $0.01–0.05 |
| Add a new feature | $0.05–0.25 |
| Full code review | $0.10–0.50 |
| Refactor a module | $0.10–0.50 |
| Explore a new codebase | $0.25–1.00 |

### Real-world scenarios

- **Cheap**: "Rename this variable and update all references" — Claude reads one or two files, makes edits, done. Probably $0.01-0.03.
- **Medium**: "Add input validation to the registration form" — Claude reads a few files, writes a few hundred lines, maybe runs a test. Around $0.05-0.15.
- **Expensive**: "Understand how the auth system works across the whole codebase" — Claude reads 20+ files to build a mental model. Can be $0.50-1.00+.
- **Very expensive**: "Refactor the entire data layer to use a new ORM" — Claude reads and rewrites dozens of files, runs tests, iterates. Could be $1-5+.

---

## Setting a Budget Limit

In non-interactive (print) mode, stop if the cost exceeds a threshold:

**macOS / Linux (Ubuntu):**
```bash
claude -p "do this task" --max-budget-usd 0.50
```

**Windows (WSL):**
```bash
claude -p "do this task" --max-budget-usd 0.50
```

**Windows (PowerShell):**
```powershell
claude -p "do this task" --max-budget-usd 0.50
```

If Claude is mid-task and the estimated cost would exceed $0.50, it stops.

This is especially useful in CI pipelines, where you want to prevent a runaway task from spending $10 on a PR review that should cost $0.25.

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

Haiku is 60x cheaper than Opus for the same task.

**When to use Haiku:** Simple lookups, short explanations, small edits to a single file, quick questions.

**When to use Sonnet (default):** Most coding work — bugs, features, tests, reviews.

**When to use Opus:** Hard architectural decisions, complex debugging across many files, situations where you need Claude's best reasoning.

### 2. Use lower effort levels

**macOS / Linux (Ubuntu):**
```bash
CLAUDE_CODE_EFFORT_LEVEL=low claude    # Minimal thinking
CLAUDE_CODE_EFFORT_LEVEL=medium claude # Default
CLAUDE_CODE_EFFORT_LEVEL=high claude   # Maximum thinking
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_CODE_EFFORT_LEVEL = "low"
claude

$env:CLAUDE_CODE_EFFORT_LEVEL = "medium"
claude
```

Lower effort = fewer thinking tokens = lower cost. Use `low` for routine tasks where you do not need deep analysis.

### 3. Compact the conversation

When context gets long, compact it:
```
> /compact
```

Longer context = more input tokens per message = higher cost. Compacting keeps context lean by summarizing older parts of the conversation.

### 4. Be specific in requests

Vague requests lead to more back-and-forth:

Bad (expensive): "Make the code better"

Good (cheaper): "Reduce the cyclomatic complexity of calculateTotal() in billing.js"

The specific version lets Claude go straight to the answer without asking clarifying questions.

### 5. Avoid unnecessary file reads

Claude reads files to understand context. If you're asking about something specific:

Bad: "Read all files and tell me about the auth system"

Good: "Read src/auth/middleware.js and explain how token validation works"

Limiting file reads limits input tokens.

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
- 5x higher limits than Pro
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

## Monitoring Team Usage (Enterprise)

Admins can access usage analytics in the admin dashboard:

- Total tokens/cost by team member
- Sessions per day
- Tool use patterns
- Cost by project
- ROI metrics (PRs created, lines of code, etc.)

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

## Quick Cost-Saving Checklist

Before starting an expensive task, ask:

```
1. Is this a simple task? → Use --model haiku
2. Is the conversation very long? → /compact first
3. Is this for a CI pipeline? → Add --max-budget-usd 0.50
4. Am I asking Claude to read the whole codebase? → Narrow the scope
5. Do I have MCP servers connected I'm not using? → /mcp and disconnect them
```

Following this checklist can cut costs by 50-80% on large tasks.
