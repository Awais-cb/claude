# Output Formats & Styles

Think of output formats like choosing between reading a report yourself versus having it piped into a spreadsheet. The information is the same either way — but the format determines what you can do with it next. A human reading a summary wants clear prose. A script pulling data out of Claude wants structured JSON it can parse. Claude Code supports both, and everything in between.

This matters most when you move beyond interactive chat into automation: CI pipelines, shell scripts, daily reports, pre-commit hooks. The right output format is what makes Claude composable with the rest of your toolchain.

![Claude Code streaming output in a terminal session](./images/streaming-output.png)
> *What to expect: Text appearing progressively in the terminal as Claude generates it, with JSON delimiters visible when using stream-json mode.*

---

## Output Styles (Interactive)

In interactive sessions, you can change how Claude communicates:

```
> /output-style
```

| Style | Description |
|-------|-------------|
| **Default** | Standard helpful responses |
| **Explanatory** | Adds educational insights explaining *why* things work |
| **Learning** | Interactive mode with practice exercises |

### Explanatory Style Example

```
> /output-style explanatory

> add error handling to this function

Claude: I'll add error handling. Here's the updated code:

[code with try/catch]

Why I did this:
- Used try/catch instead of .catch() because async/await is already used
- The error is re-thrown after logging so callers know it failed
- Specific error types are checked first (NetworkError) before catching all
```

### Learning Style Example

```
> /output-style learning

> explain how promises work

Claude: Great topic! Let me teach you through a hands-on example.

First, try predicting the output of this code:
[code snippet]

What do you think will print? Think about it before scrolling...

[explanation]

Now try this challenge: Convert this callback-based code to use promises:
[exercise]
```

---

## Output Formats (Print Mode)

Used with the `-p` / `--print` flag for non-interactive/scripting use.

### When to use which format

| Format | Best for |
|--------|----------|
| **Text** (default) | Human reading, markdown docs, changelog drafts |
| **JSON** | Scripts that need the full conversation, post-processing |
| **Stream JSON** | Real-time dashboards, long tasks where you want progress |
| **Structured JSON** | When you need Claude to return data matching a schema |

```
Text        → Human reads it
JSON        → Script parses it (after Claude finishes)
Stream JSON → Script processes it as it arrives
Structured  → Script receives exactly the shape it expects
```

### Text (default)

```bash
claude -p "summarize README.md"
```

Returns plain text — Claude's response as-is.

```
README.md output:
The project is a task management API built with Node.js and PostgreSQL...
```

### JSON

```bash
claude -p "list all functions in app.js" --output-format json
```

Returns the full conversation as a JSON array:

```json
[
  {
    "role": "user",
    "content": "list all functions in app.js"
  },
  {
    "role": "assistant",
    "content": "Here are the functions in app.js:\n1. getUserById\n2. createUser..."
  }
]
```

### Stream JSON

```bash
claude -p "analyze this code" --output-format stream-json
```

Streams JSON objects as they're generated — useful for real-time processing:

```json
{"type": "message_start", "role": "assistant"}
{"type": "content_delta", "text": "Looking at the code..."}
{"type": "content_delta", "text": " I can see three issues."}
{"type": "message_stop"}
```

---

## Structured JSON Output

Get a response that matches a specific JSON schema:

```bash
claude -p "analyze this PR" --json-schema '{
  "type": "object",
  "properties": {
    "summary": {"type": "string"},
    "issues": {"type": "array", "items": {"type": "string"}},
    "approved": {"type": "boolean"}
  }
}'
```

Output:
```json
{
  "summary": "Adds user authentication with JWT tokens",
  "issues": [
    "Token expiry is hardcoded at 24h — should be configurable",
    "Missing rate limiting on /login endpoint"
  ],
  "approved": false
}
```

This is the most reliable format for machine-readable output because Claude is constrained to produce exactly the shape you defined.

---

## Piping & Scripting

Claude Code works as a standard Unix tool. Think of it as a command that reads from stdin and writes to stdout — it slots naturally into any pipeline.

### Pipe input into Claude

**macOS / Linux (Ubuntu):**
```bash
# Analyze a file
cat error.log | claude -p "what caused these errors?"

# Review git diff
git diff | claude -p "summarize the changes in plain English"

# Explain command output
ls -la | claude -p "which files are largest?"

# Analyze database output
psql -c "SELECT * FROM users WHERE created_at > NOW() - INTERVAL '7 days'" | claude -p "summarize this data"
```

**Windows (WSL):**
```bash
# Same commands work in WSL
cat error.log | claude -p "what caused these errors?"
git diff | claude -p "summarize the changes in plain English"
```

**Windows (PowerShell):**
```powershell
# Use Get-Content instead of cat
Get-Content error.log | claude -p "what caused these errors?"

# Git diff works the same
git diff | claude -p "summarize the changes in plain English"
```

### Save output to file

**macOS / Linux (Ubuntu):**
```bash
# Generate documentation
claude -p "write API documentation for routes/users.js" > docs/api/users.md

# Create a test file
claude -p "write unit tests for src/auth.js" > tests/auth.test.js

# Generate a report
claude -p "analyze the test results below and write a summary" < test-output.txt > test-report.md
```

**Windows (PowerShell):**
```powershell
# Redirect output to a file
claude -p "write API documentation for routes/users.js" | Out-File docs/api/users.md

# Or use > (works in PowerShell 7+)
claude -p "write unit tests for src/auth.js" > tests/auth.test.js
```

### Use in shell scripts

**macOS / Linux (Ubuntu):**
```bash
#!/bin/bash

# Automated code review on every commit
DIFF=$(git diff HEAD~1)
REVIEW=$(echo "$DIFF" | claude -p "review this diff for security issues. Output JSON with fields: issues (array), severity (low/medium/high)" --output-format json)

# Parse the JSON
SEVERITY=$(echo $REVIEW | jq -r '.[-1].content' | jq -r '.severity')

if [ "$SEVERITY" = "high" ]; then
  echo "High severity security issue found. Please review before merging."
  exit 1
fi
```

**Windows (PowerShell):**
```powershell
# Automated code review on every commit
$diff = git diff HEAD~1
$review = $diff | claude -p "review this diff for security issues. Output JSON with fields: issues (array), severity (low/medium/high)" --output-format json

# Parse JSON with PowerShell
$parsed = $review | ConvertFrom-Json
$severity = $parsed[-1].content | ConvertFrom-Json | Select-Object -ExpandProperty severity

if ($severity -eq "high") {
    Write-Host "High severity security issue found. Please review before merging."
    exit 1
}
```

---

## Controlling Claude's Response

### Limit turns in print mode

```bash
# Stop after 3 agentic turns (reads + actions)
claude -p "refactor auth.js" --max-turns 3
```

### Set a cost limit

```bash
# Stop if estimated cost exceeds $1
claude -p "analyze the entire codebase" --max-budget-usd 1.00
```

### Don't save the session

```bash
# One-off query, don't save to session history
claude -p "what is JWT?" --no-session-persistence
```

---

## Input Formats

### Text (default)

Standard text input:

```bash
claude -p "explain what this file does" < source.js
```

### Stream JSON input

For programmatic control, send conversation turns as JSON:

```bash
echo '[{"role": "user", "content": "Hello"}]' | claude -p --input-format stream-json
```

---

## Decision Guide: Which Format Should I Use?

```
Are you a human reading the output?
  YES → Use text (default). It's readable and nicely formatted.

Are you a script processing the output?
  Does the script need the full conversation history?
    YES → Use --output-format json
  Does the script need results as they stream in?
    YES → Use --output-format stream-json
  Does the script need a guaranteed data structure?
    YES → Use --json-schema with your schema definition
```

---

## Real-World Examples

### Generate a changelog

**macOS / Linux (Ubuntu):**
```bash
git log --oneline v1.0.0..HEAD | claude -p "write a changelog entry in Keep a Changelog format" > CHANGELOG_DRAFT.md
```

**Windows (PowerShell):**
```powershell
git log --oneline v1.0.0..HEAD | claude -p "write a changelog entry in Keep a Changelog format" | Out-File CHANGELOG_DRAFT.md
```

### Automated PR review in CI

```bash
# .github/workflows/review.yml
- name: Claude Review
  run: |
    gh pr diff ${{ github.event.pull_request.number }} | \
    claude -p "review this diff. Return JSON: {issues: [], suggestions: [], approved: bool}" \
    --output-format json \
    --max-budget-usd 0.50 > review.json

    cat review.json | jq '.[-1].content'
```

### Daily code quality report

**macOS / Linux (Ubuntu):**
```bash
#!/bin/bash
# Run each morning via cron
find src -name "*.ts" -newer last_check | \
  xargs cat | \
  claude -p "identify any code quality issues added in these files" \
  > ~/daily-code-review.txt

# Send via email/Slack
cat ~/daily-code-review.txt | mail -s "Daily Code Review" team@company.com
```

**Windows (PowerShell):**
```powershell
# Run each morning via Task Scheduler
$files = Get-ChildItem -Path src -Filter "*.ts" -Recurse |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) }

$content = $files | Get-Content | Out-String
$content | claude -p "identify any code quality issues added in these files" |
    Out-File "$env:USERPROFILE\daily-code-review.txt"
```

### CI pipeline: structured output for automated gating

```yaml
# .github/workflows/quality-gate.yml
- name: Quality Gate
  run: |
    git diff origin/main | claude -p "analyze code quality" --json-schema '{
      "type": "object",
      "properties": {
        "passed": {"type": "boolean"},
        "score": {"type": "number"},
        "blockers": {"type": "array", "items": {"type": "string"}}
      }
    }' > result.json

    # Block merge if quality score is below 7
    python3 -c "
    import json, sys
    r = json.load(open('result.json'))
    if r['score'] < 7:
        print('Quality gate failed:', r['blockers'])
        sys.exit(1)
    "
```
