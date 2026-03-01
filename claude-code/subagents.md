# Subagents — Parallel & Specialized Workers

Imagine you're a project manager with a big deliverable. You could do every task yourself — the research, the writing, the review, the testing — one by one, slowly. Or you could delegate: send the researcher off to gather information, the writer to draft content, and the tester to run tests, all at the same time. You check in when each finishes and combine the results.

That's exactly how subagents work in Claude Code. Your main Claude session acts as the project manager, spawning specialized Claude instances (subagents) to handle specific tasks — sometimes in parallel — and collecting their results.

```
                    Your Main Claude Session
                           |
           +---------------+---------------+
           |               |               |
     [Explore Agent]  [Plan Agent]  [Custom Agent]
     searches code    designs arch   writes tests
           |               |               |
           +---------------+---------------+
                           |
                    Results combined
                    back to main session
```

---

## Built-in Subagents

Claude Code ships with three built-in agents:

| Agent | Best for | Can edit files? |
|-------|----------|-----------------|
| **Explore** | Fast codebase search and exploration | No (read-only) |
| **Plan** | Research and design implementation plans | No (read-only) |
| **General-purpose** | Complex multi-step tasks | Yes |

Claude automatically picks the right agent based on your request. You can also request one explicitly:

```
> Use the Explore agent to find all the places we log errors in this codebase
```

---

## When to Use Subagents vs Just Asking Claude Directly

This is the most common beginner question. Here's a practical guide:

**Use subagents when:**
- You want multiple things done in parallel (saves real time)
- The task requires a specialist mindset (e.g., "only look, never touch")
- You want to isolate risky work (worktree isolation)
- The task is very large and would exceed Claude's context window if done inline
- You want a second opinion — run two agents with different approaches

**Just ask Claude directly when:**
- The task is simple and quick
- You want to stay in one conversation thread
- The task requires back-and-forth with you
- You're still figuring out what you want

**Real-world analogy:** You wouldn't hire a contractor to replace one lightbulb. But you would hire one to renovate a kitchen. Subagents are for the kitchen-sized jobs.

---

## Creating Custom Subagents

### Where to create them

**macOS / Linux (Ubuntu):**
```bash
~/.claude/agents/          # Available in all your projects (user-wide)
.claude/agents/            # Only for the current project
```

**Windows (WSL):**
```bash
~/.claude/agents/          # Translates to /home/yourname/.claude/agents/
.claude/agents/            # In your current project directory
```

**Windows (PowerShell / native path):**
```
%USERPROFILE%\.claude\agents\     # User-wide agents
.claude\agents\                   # Project-specific agents
```

> **Tip:** If the `agents/` folder doesn't exist yet, create it. On macOS/Linux: `mkdir -p ~/.claude/agents`. On Windows PowerShell: `New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\agents" -Force`.

### Agent file format

Create a `.md` file with YAML frontmatter:

```markdown
---
name: code-reviewer
description: Reviews code for security issues and best practices
model: opus
---

You are a strict code reviewer. When reviewing code:

1. Look for security vulnerabilities (SQL injection, XSS, etc.)
2. Check for performance issues
3. Verify error handling is complete
4. Ensure tests cover edge cases

Always be specific about line numbers and explain why each issue matters.
```

### Use your custom agent

```
> Use the code-reviewer agent to review the payment processing module
```

---

## Agent Configuration (Frontmatter)

```yaml
---
name: my-agent                    # Agent name (used to call it)
description: What this agent does # Shown in /agents list
model: opus                       # opus, sonnet, haiku, or inherit
tools:                            # Allowlist of tools
  - Read
  - Grep
  - Glob
  - WebSearch
disallowedTools:                  # Tools explicitly denied
  - Bash
  - Write
permissionMode: plan              # default, acceptEdits, bypassPermissions, plan, dontAsk
maxTurns: 20                      # Max agentic turns before stopping
memory: project                   # user, project, local, or omit
isolation: worktree               # Run in isolated git worktree
---
```

---

## Step-by-Step: Create Your First Subagent

Here's a beginner walkthrough to create a simple "file summarizer" agent.

**Step 1: Create the agents folder (if needed)**

**macOS / Linux (Ubuntu):**
```bash
mkdir -p ~/.claude/agents
```

**Windows (WSL):**
```bash
mkdir -p ~/.claude/agents
```

**Windows (PowerShell):**
```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude\agents" -Force
```

**Step 2: Create the agent file**

**macOS / Linux (Ubuntu):**
```bash
nano ~/.claude/agents/file-summarizer.md
```

**Windows (WSL):**
```bash
nano ~/.claude/agents/file-summarizer.md
```

**Windows (PowerShell):**
```powershell
notepad "$env:USERPROFILE\.claude\agents\file-summarizer.md"
```

**Step 3: Paste this content into the file:**

```markdown
---
name: file-summarizer
description: Reads files and produces concise plain-English summaries
model: haiku
tools:
  - Read
  - Glob
permissionMode: plan
---

You summarize files clearly and concisely. When given a file or folder:
1. Read the contents
2. Identify the main purpose
3. List the key functions, classes, or sections
4. Write a 3-5 sentence plain-English summary

Never modify any files. Just read and report.
```

**Step 4: Use it in Claude Code**

```
> Use the file-summarizer agent to summarize everything in the src/ folder
```

That's it. Claude will spawn the agent, have it read the files, and return a summary.

---

## Practical Examples

### Example 1: Exploration agent

```markdown
---
name: explorer
description: Finds and summarizes code without making changes
model: haiku
tools:
  - Read
  - Grep
  - Glob
  - WebSearch
permissionMode: plan
---

You are a code exploration specialist. When asked to find or understand
code, you:
- Search systematically using Grep and Glob
- Read relevant files completely
- Summarize what you found clearly
- Never modify anything
```

**Usage:**
```
> Use the explorer agent to find all database queries that don't use
  parameterized inputs
```

### Example 2: Test writer agent

```markdown
---
name: test-writer
description: Writes unit and integration tests for existing code
model: sonnet
tools:
  - Read
  - Grep
  - Write
  - Bash(npm test)
---

You write comprehensive tests. For every function you test:
- Cover happy path
- Cover edge cases (null, empty, boundary values)
- Cover error cases
- Use the project's existing test framework and conventions

Always read existing tests first to match the style.
```

**Usage:**
```
> Use the test-writer agent to add tests for the OrderService class
```

### Example 3: Documentation agent

```markdown
---
name: doc-writer
description: Writes clear, beginner-friendly documentation
model: sonnet
tools:
  - Read
  - Glob
  - Write
---

You write documentation for developers. Your docs are:
- Clear and concise
- Include working code examples
- Explain the "why", not just the "what"
- Use consistent formatting
```

### Example 4: Realistic beginner scenario — refactoring safely

You want to refactor a large file but don't want to accidentally break other parts of the codebase. Here's how to use subagents safely:

```
> I want to refactor UserService.js. Before I do, use the explorer agent
  to find every file that imports or depends on UserService. Then use
  the test-writer agent to make sure those files have tests before
  I start changing anything.
```

Claude spawns both agents, the explorer maps all dependencies, the test writer adds missing tests, and then you can refactor with confidence.

---

## Running Agents in Parallel

One of the most powerful uses of subagents: running multiple tasks simultaneously.

```
> I need to:
  1. Find all API endpoints in the codebase
  2. Check if any have missing authentication
  3. Look up best practices for API security

Can you run these in parallel using subagents?
```

Claude spawns three agents simultaneously, then combines results — much faster than doing them sequentially.

```
Main Session
    |
    +---> [Agent 1] Find API endpoints -----> returns list of 23 routes
    |
    +---> [Agent 2] Check auth on routes ---> finds 3 unprotected
    |
    +---> [Agent 3] Research API security --> returns best practices
    |
    All three finish, main session combines into one report
```

---

## Worktree Isolation

You can run agents in isolated git worktrees — each agent works on its own copy of the repo:

```yaml
---
name: safe-experimenter
description: Experiments with code changes without affecting main work
isolation: worktree
---
```

This is useful for:
- Running multiple implementations in parallel to compare them
- Experimental changes that might not work out
- Keeping your main branch clean while exploring ideas

---

## Persistent Memory for Agents

Agents can build their own memory across sessions:

```yaml
---
name: security-reviewer
memory: project
---
```

Memory options:
- `user` — stored in `~/.claude/` (macOS/Linux) or `%USERPROFILE%\.claude\` (Windows), available across all projects
- `project` — stored in `.claude/`, scoped to this project
- `local` — stored locally, not committed to git

With `memory: project`, the security-reviewer agent remembers which files it's reviewed, what patterns it's seen before, and past vulnerabilities found.

---

## Managing Agents

```
> /agents
```

Opens an interactive menu to:
- **List** all available agents (user, project, CLI)
- **Create** a new agent
- **Edit** an existing agent
- **Delete** an agent
- **Test** an agent

![The /agents interactive menu showing a list of available agents](./images/agents-menu.png)
> *What to expect: Typing `/agents` opens a menu with all your configured agents listed by name and description. You can navigate with arrow keys, press Enter to select, and use the options to create, edit, or delete agents.*

---

## Foreground vs Background Agents

When Claude spawns an agent, it can run:

**Foreground** — Claude waits for the agent to finish before continuing:
```
> Research the best approach for this problem [blocks until done]
```

**Background** — Claude continues working while the agent runs:
```
> Run the test suite in the background while I keep coding
```

Check background tasks:
```
Ctrl+T       # Toggle task list
> /tasks     # List all tasks
```

---

## Tips

- **Use Haiku** for simple exploration tasks — much cheaper and fast
- **Use Opus** for agents doing complex reasoning or critical reviews
- **Restrict tools** to what the agent actually needs — safer and faster
- **Add `permissionMode: plan`** for any agent that shouldn't make changes
- **Custom descriptions** are important — Claude uses them to decide when to use which agent
