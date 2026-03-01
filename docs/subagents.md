# Subagents — Parallel & Specialized Workers

Subagents are specialized Claude instances that your main Claude session can spawn to handle specific tasks. They run independently, have their own tools and permissions, and report results back to the main session.

Think of subagents like hiring specialists: instead of one generalist doing everything, you can delegate research to an Explore agent, planning to a Plan agent, and run multiple tasks in parallel.

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

## Creating Custom Subagents

### Where to create them

```
~/.claude/agents/          ← Available in all your projects
.claude/agents/            ← Project-specific agents
```

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
permissionMode: plan              # plan, auto-accept, or normal
maxTurns: 20                      # Max agentic turns before stopping
memory: project                   # user, project, local, or omit
isolation: worktree               # Run in isolated git worktree
---
```

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
- `user` — stored in `~/.claude/`, available across all projects
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

---

## Agent Teams (Experimental)

For very complex tasks, you can have multiple Claude sessions working as a team:

```
> /team
```

Each "teammate" is a full Claude Code session with:
- Its own context window
- Access to a shared task list
- The ability to communicate with other teammates
- Parallel execution

**Example use case:** Implementing a large feature where three teammates simultaneously work on the backend, frontend, and tests.

> **Note:** Agent Teams is an experimental feature. Enable it in settings first.

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
