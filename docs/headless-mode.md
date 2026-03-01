# Headless Mode — Non-Interactive / Automation

Headless mode (also called print mode) runs Claude without an interactive session. It's designed for scripts, CI/CD pipelines, automation, and any use case where you need Claude's output without a human in the loop.

---

## The `-p` Flag

Add `-p` (or `--print`) to make Claude run non-interactively:

```bash
claude -p "your prompt here"
```

Claude:
1. Runs the task
2. Prints the result
3. Exits

No waiting for input, no prompts, no session saved (unless you want it).

---

## Basic Examples

```bash
# Explain code
claude -p "explain what app.js does"

# Summarize a file
cat README.md | claude -p "give me a 3-line summary"

# Review code
git diff | claude -p "review these changes for bugs"

# Generate code
claude -p "write a Python function that validates email addresses"

# Answer questions
claude -p "what's the difference between PUT and PATCH in REST APIs?"
```

---

## Piping & Chaining

Claude works like any Unix command:

```bash
# Analyze logs
cat error.log | claude -p "identify the root cause of these errors"

# Review a diff
git diff HEAD~1 | claude -p "summarize what changed"

# Process API output
curl -s api.example.com/data | claude -p "format this JSON as a markdown table"

# Chain commands
git log --oneline -20 | claude -p "write release notes" >> CHANGELOG.md
```

---

## Output Formats

### Text (default)
```bash
claude -p "list the files in this project"
# Output: Plain text response
```

### JSON
```bash
claude -p "analyze auth.js" --output-format json
# Output: Full conversation as JSON array
```

### Stream JSON (real-time)
```bash
claude -p "review this code" --output-format stream-json
# Output: JSON objects streamed as generated
```

### Structured JSON with schema validation
```bash
claude -p "analyze this PR" --json-schema '{
  "type": "object",
  "properties": {
    "approved": {"type": "boolean"},
    "issues": {"type": "array", "items": {"type": "string"}}
  }
}'
# Output: Valid JSON matching the schema
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Review PR
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh pr diff ${{ github.event.pull_request.number }} | \
          claude -p "Review this PR diff. List any bugs, security issues, or improvements. Be concise." \
          --max-budget-usd 0.50 > review.txt

          gh pr comment ${{ github.event.pull_request.number }} --body "$(cat review.txt)"
```

### GitLab CI

```yaml
# .gitlab-ci.yml
claude-review:
  stage: test
  image: node:20
  script:
    - npm install -g @anthropic-ai/claude-code
    - git diff origin/main | claude -p "review for security issues" > review.txt
    - cat review.txt
  only:
    - merge_requests
```

---

## Controlling Execution

### Limit agentic turns

```bash
# Stop after 5 tool uses (reads, edits, commands)
claude -p "refactor auth.js" --max-turns 5
```

Prevents runaway execution on complex tasks.

### Set a budget cap

```bash
# Stop if cost exceeds $1.00
claude -p "analyze the codebase" --max-budget-usd 1.00
```

### Don't save the session

```bash
# One-off query, no session file saved
claude -p "quick question about React hooks" --no-session-persistence
```

---

## Using the Agent SDK

For programmatic integration in your own applications, use the Claude Agent SDK:

### TypeScript / Node.js

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function runClaude(prompt: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "";
}

// Usage
const result = await runClaude("Review this code for security issues");
console.log(result);
```

### Python

```python
import anthropic

client = anthropic.Anthropic()

def run_claude(prompt: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text

# Usage
result = run_claude("Explain this function")
print(result)
```

---

## Practical Automation Scripts

### Daily code quality check

```bash
#!/bin/bash
# Run nightly via cron

REPORT_FILE="reports/quality-$(date +%Y-%m-%d).md"

echo "# Code Quality Report — $(date +%Y-%m-%d)" > $REPORT_FILE

# Recent changes
git log --since="24 hours ago" --format="%H" | while read commit; do
  git show $commit | claude -p "rate this commit's code quality 1-10 and explain why" \
    --max-budget-usd 0.10 >> $REPORT_FILE
done

# Send report
cat $REPORT_FILE | mail -s "Daily Code Quality" team@company.com
```

### Automated documentation update

```bash
#!/bin/bash
# Update docs whenever source changes

for file in $(git diff --name-only HEAD~1 -- src/); do
  DOC_FILE="docs/$(basename $file .ts).md"
  cat $file | claude -p "write API documentation for this module" \
    --max-budget-usd 0.25 > $DOC_FILE
  echo "Updated: $DOC_FILE"
done
```

### Auto-generate test cases

```bash
#!/bin/bash
# Generate tests for new functions

NEW_FILES=$(git diff --name-only --diff-filter=A HEAD~1 -- src/)

for file in $NEW_FILES; do
  TEST_FILE="tests/$(basename $file .ts).test.ts"
  cat $file | claude -p "write comprehensive unit tests for all functions in this file" \
    --max-budget-usd 0.50 > $TEST_FILE
  echo "Created tests: $TEST_FILE"
done
```

### Pre-commit security check

```bash
#!/bin/bash
# .git/hooks/pre-commit

STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -n "$STAGED_FILES" ]; then
  echo "Running Claude security check..."

  RESULT=$(git diff --cached | claude -p \
    "Check for security issues: hardcoded secrets, SQL injection, XSS.
    Return JSON: {hasIssues: bool, issues: string[]}" \
    --output-format json \
    --max-budget-usd 0.25)

  HAS_ISSUES=$(echo $RESULT | python3 -c "
import json, sys
data = json.loads(sys.stdin.read())
content = data[-1]['content']
result = json.loads(content)
print('true' if result.get('hasIssues') else 'false')
")

  if [ "$HAS_ISSUES" = "true" ]; then
    echo "❌ Security issues detected. Please review before committing."
    exit 1
  fi
fi

exit 0
```

---

## Environment Setup for CI

```bash
# Required
export ANTHROPIC_API_KEY="sk-ant-..."

# Optional: disable interactive features
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=true  # No memory in CI
export CLAUDE_CODE_EFFORT_LEVEL=low          # Faster, cheaper in CI

# Run
claude -p "your task" --dangerously-skip-permissions
```

---

## Rate Limiting in Automation

When running many Claude requests in automation:

```bash
# Add delays between requests to avoid rate limits
for file in src/*.js; do
  cat $file | claude -p "review for bugs" >> review.txt
  sleep 2  # 2 second delay between requests
done
```

Or use `--max-budget-usd` as a natural limiter to prevent runaway costs.
