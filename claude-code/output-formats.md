# Output Formats & Styles

Claude Code offers multiple output formats for different use cases — from human-readable text in interactive sessions to structured JSON for automation and scripts.

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

---

## Piping & Scripting

Claude Code works as a standard Unix tool:

### Pipe input into Claude

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

### Save output to file

```bash
# Generate documentation
claude -p "write API documentation for routes/users.js" > docs/api/users.md

# Create a test file
claude -p "write unit tests for src/auth.js" > tests/auth.test.js

# Generate a report
claude -p "analyze the test results below and write a summary" < test-output.txt > test-report.md
```

### Use in shell scripts

```bash
#!/bin/bash

# Automated code review on every commit
DIFF=$(git diff HEAD~1)
REVIEW=$(echo "$DIFF" | claude -p "review this diff for security issues. Output JSON with fields: issues (array), severity (low/medium/high)" --output-format json)

# Parse the JSON
SEVERITY=$(echo $REVIEW | jq -r '.[-1].content' | jq -r '.severity')

if [ "$SEVERITY" = "high" ]; then
  echo "❌ High severity security issue found. Please review before merging."
  exit 1
fi
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

## Real-World Examples

### Generate a changelog

```bash
git log --oneline v1.0.0..HEAD | claude -p "write a changelog entry in Keep a Changelog format" > CHANGELOG_DRAFT.md
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

```bash
#!/bin/bash
# Run each morning
find src -name "*.ts" -newer last_check | \
  xargs cat | \
  claude -p "identify any code quality issues added in these files" \
  > ~/daily-code-review.txt

# Send via email/Slack
cat ~/daily-code-review.txt | mail -s "Daily Code Review" team@company.com
```
