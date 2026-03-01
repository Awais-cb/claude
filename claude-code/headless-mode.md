# Headless Mode — Non-Interactive / Automation

Think of headless mode like setting up an automatic assembly line. You define the steps once — "take this input, run Claude on it, produce this output" — and it runs without anyone watching, pressing buttons, or waiting at a prompt. This is how you integrate Claude Code into scripts, scheduled jobs, CI pipelines, and any other system where there is no human in the loop.

The opposite of headless mode is the interactive terminal session where you type back and forth with Claude. Headless mode is for when you want Claude to be a tool your other tools call.

![CI pipeline output showing Claude Code running in a GitHub Actions job](./images/ci-pipeline-output.png)
> *What to expect: In a CI log, you will see Claude Code run, output its result as text or JSON, and exit with a success or failure code — just like any other CLI tool in your pipeline.*

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

**macOS / Linux (Ubuntu):**
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

**Windows (WSL):**
```bash
# Same commands work in WSL
cat error.log | claude -p "identify the root cause of these errors"
git diff HEAD~1 | claude -p "summarize what changed"
```

**Windows (PowerShell):**
```powershell
# Use Get-Content instead of cat
Get-Content error.log | claude -p "identify the root cause of these errors"

# Review a diff
git diff HEAD~1 | claude -p "summarize what changed"

# Append to a file
git log --oneline -20 | claude -p "write release notes" | Add-Content CHANGELOG.md
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

This is a complete working example you can drop into your repository:

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

> Security note: Never hardcode your `ANTHROPIC_API_KEY` in the YAML file. Always use repository secrets (`Settings > Secrets and variables > Actions`) and reference them as `${{ secrets.ANTHROPIC_API_KEY }}`.

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

> Security note: Set `ANTHROPIC_API_KEY` as a masked CI/CD variable in GitLab (`Settings > CI/CD > Variables`). Never put the key directly in the `.gitlab-ci.yml` file.

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any

    environment {
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')  // Jenkins credential
    }

    stages {
        stage('Install Claude') {
            steps {
                sh 'npm install -g @anthropic-ai/claude-code'
            }
        }

        stage('Code Review') {
            steps {
                sh '''
                    git diff origin/main | \
                    claude -p "review for bugs and security issues" \
                    --max-budget-usd 0.50 > review.txt
                '''
                archiveArtifacts 'review.txt'
            }
        }
    }
}
```

---

## Windows-Specific Scripting

### Windows Batch Script (.bat)

```batch
@echo off
REM Run Claude on a file and save output
REM Usage: review.bat myfile.js

set FILE=%1
if "%FILE%"=="" (
    echo Usage: review.bat ^<filename^>
    exit /b 1
)

type "%FILE%" | claude -p "review this code for bugs" > review.txt
echo Review saved to review.txt
```

### Windows PowerShell Script (.ps1)

```powershell
# daily-review.ps1 — Run via Task Scheduler each morning

$reportFile = "reports\quality-$(Get-Date -Format 'yyyy-MM-dd').md"

# Get files changed in the last 24 hours
$changedFiles = Get-ChildItem -Path src -Filter "*.ts" -Recurse |
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) }

if ($changedFiles.Count -eq 0) {
    Write-Host "No changed files in the last 24 hours."
    exit 0
}

# Concatenate all changed file contents
$content = $changedFiles | Get-Content | Out-String

# Ask Claude to review
$review = $content | claude -p "identify code quality issues in these recently changed files"

# Save report
Set-Content -Path $reportFile -Value $review
Write-Host "Report saved to $reportFile"
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

**macOS / Linux (Ubuntu):**
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

**Windows (PowerShell):**
```powershell
# Run via Task Scheduler
$reportFile = "reports\quality-$(Get-Date -Format 'yyyy-MM-dd').md"
"# Code Quality Report - $(Get-Date -Format 'yyyy-MM-dd')" | Set-Content $reportFile

git log --since="24 hours ago" --format="%H" | ForEach-Object {
    $commitContent = git show $_
    $review = $commitContent | claude -p "rate this commit's code quality 1-10" --max-budget-usd 0.10
    Add-Content $reportFile $review
}
```

### Automated documentation update

**macOS / Linux (Ubuntu):**
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

**macOS / Linux (Ubuntu):**
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

**macOS / Linux (Ubuntu):**
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
    echo "Security issues detected. Please review before committing."
    exit 1
  fi
fi

exit 0
```

---

## Environment Setup for CI

```bash
# Required: your Anthropic API key
# Set this as a secret in your CI system — never hardcode it
export ANTHROPIC_API_KEY="sk-ant-..."

# Optional: disable interactive features
export CLAUDE_CODE_DISABLE_AUTO_MEMORY=true  # No memory in CI
export CLAUDE_CODE_EFFORT_LEVEL=low          # Faster, cheaper in CI

# Run
claude -p "your task" --dangerously-skip-permissions
```

### How to set secrets in each CI system

| CI System | How to set secrets |
|-----------|-------------------|
| GitHub Actions | Repository Settings > Secrets and variables > Actions > New secret |
| GitLab CI | Project Settings > CI/CD > Variables > Add variable |
| Jenkins | Manage Jenkins > Credentials > Add credentials |
| CircleCI | Project Settings > Environment Variables |
| Bitbucket Pipelines | Repository Settings > Repository variables |

---

## Rate Limiting in Automation

When running many Claude requests in automation:

**macOS / Linux (Ubuntu):**
```bash
# Add delays between requests to avoid rate limits
for file in src/*.js; do
  cat $file | claude -p "review for bugs" >> review.txt
  sleep 2  # 2 second delay between requests
done
```

**Windows (PowerShell):**
```powershell
Get-ChildItem src -Filter "*.js" | ForEach-Object {
    Get-Content $_.FullName | claude -p "review for bugs" | Add-Content review.txt
    Start-Sleep -Seconds 2
}
```

Or use `--max-budget-usd` as a natural limiter to prevent runaway costs.

---

## Assembly Line Mental Model

```
Input (file, git diff, log, API response)
          │
          ▼
    claude -p "task description"
          │
     ┌────┴────┐
     │  Claude  │  ← runs without interaction
     └────┬────┘
          │
          ▼
   Output (text, JSON, stream-json)
          │
          ▼
Next step (file, email, PR comment, database, dashboard)
```

Each step is composable. Claude is just another command in the pipeline.
