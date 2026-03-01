# Context Management

Claude Code has a limited context window — the amount of conversation history and file content it can hold at once. Understanding and managing context helps you work on long tasks without losing important information.

---

## What is the Context Window?

Think of context as Claude's working memory. Everything in the current conversation (your messages, Claude's replies, files it read, command output) takes up space in the context window.

When it fills up, older information gets pushed out — Claude might "forget" things from earlier in the session.

---

## Visualizing Context Usage

```
> /context
```

Displays a colored grid showing how full your context window is:
- 🟢 Green — plenty of space
- 🟡 Yellow — getting full
- 🔴 Red — nearly full, compaction recommended

---

## Auto-Compaction

By default, Claude Code automatically compacts your conversation when it reaches **~95% capacity**.

Compaction summarizes the conversation history, keeping key decisions and context while freeing space. You usually won't notice — it just keeps working.

### Trigger compaction earlier

If you want to compact before hitting 95%, set a lower threshold:

```bash
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70 claude
```

This compacts at 70% capacity instead of 95%.

---

## Manual Compaction

```
> /compact
```

Summarizes the conversation immediately. You can give instructions:

```
> /compact keep only the decisions about the database schema and the code we wrote for authentication
```

This gives you control over what's preserved in the summary.

---

## Starting Fresh

```
> /clear
```

Wipes the entire conversation history. Use this when:
- You're starting a completely new task
- Context is full and compaction isn't enough
- You want a clean slate

---

## Checkpoints & Rewind

### Save a checkpoint

```
Esc Esc     # Opens rewind/checkpoint menu
```

Or:
```
> /checkpoint
```

This saves the current state of your code and conversation.

### Rewind to a checkpoint

```
Esc Esc     # Select a previous checkpoint to restore
```

Or:
```
> /rewind
```

**What gets restored:**
- Files are reverted to the state at checkpoint time
- Conversation history is rolled back
- You can continue from that point

**Use this when:**
- Claude went down a wrong path
- Changes made weren't what you wanted
- You want to try a different approach

---

## Context-Saving Strategies

### 1. Use CLAUDE.md instead of explaining each session

Instead of saying "we use TypeScript, run tests with npm test, never use var" every session — put it in CLAUDE.md. This information doesn't fill up your context window as conversation.

### 2. Use Memory for recurring context

Let Claude save important discoveries to memory:
```
> Remember that our API always returns { data, error, meta } shaped responses
```

Next session, Claude knows this without you repeating it.

### 3. Compact aggressively for long tasks

When working on a big feature over multiple hours:
```
> /compact save the authentication implementation decisions and the code structure we decided on
```

### 4. Start fresh for unrelated tasks

If you finish one task and start something unrelated:
```
> /clear
```

Don't carry irrelevant context forward.

### 5. Use subagents for parallel research

Instead of reading 20 files into your main context, use an Explore agent:
```
> Use the Explore agent to find all the places we handle user authentication
```

The agent does the reading, your main context only gets the summary.

---

## Pre-Compaction Hooks

You can inject notes right before compaction happens, ensuring key info survives:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "command": "cat $CLAUDE_PROJECT_DIR/.claude/always-remember.md"
      }
    ]
  }
}
```

Create `.claude/always-remember.md`:
```markdown
# Always Remember
- Database is PostgreSQL, not MySQL
- Authentication uses JWT in httpOnly cookies
- Never call db:seed in production
- Main API is at api.acme.com/v2
```

This gets injected every time the conversation compacts.

---

## Session vs Context

| | Session | Context Window |
|--|---------|---------------|
| **What it is** | The full conversation history on disk | What Claude can actively "see" |
| **Persistent?** | Yes — stored in `~/.claude/projects/` | No — temporary |
| **Size** | Unlimited (it's just a file) | Limited (model-dependent) |
| **After compaction** | Original kept, summary active | Freed up for new content |

You can **resume** a session even after context was compacted — the full history is still on disk, but Claude works from the compact summary.

---

## Large File Handling

When you ask Claude to read a very large file, it may partially read it or summarize sections to fit in context.

**Tips for large files:**
```
> read just the authentication-related functions in this 5000-line file
> show me only the first 100 lines of the migration file
> what's in the getUserById function in models/user.js? (not the whole file)
```

---

## Extended Context (1M tokens)

Some organizations have access to an extended 1M token context window. With this, you can:
- Load entire codebases into context
- Work on very long documents
- Keep weeks of conversation history

Contact your Anthropic admin to enable extended context for your organization.
