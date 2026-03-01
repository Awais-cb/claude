# Context Management

Imagine a whiteboard in a meeting room. It's big, but it has a fixed amount of space. As the meeting goes on, you fill it with diagrams, notes, decisions, and code snippets. Eventually the whiteboard gets full — and when you need to write something new, you have to erase something old to make room. You choose carefully: erase the stuff from two hours ago that you've already acted on, keep the current plan clearly visible.

Claude's context window works the same way. Everything in your conversation — your messages, Claude's replies, files it read, command output — gets written onto this whiteboard. When it fills up, older information has to be erased or compressed to make room for new work. Understanding how to manage this whiteboard is the key to working on long, complex tasks without Claude losing important information.

Claude Code has a limited context window — the amount of conversation history and file content it can hold at once. Understanding and managing context helps you work on long tasks without losing important information.

---

## What is the Context Window?

Think of context as Claude's working memory. Everything in the current conversation (your messages, Claude's replies, files it read, command output) takes up space in the context window.

When it fills up, older information gets pushed out — Claude might "forget" things from earlier in the session.

### What are tokens?

If you've never heard the word "token" in this context, here's the plain-English version:

A **token** is a small chunk of text — roughly a word, or a common word fragment. The phrase "context window" is 2 tokens. A 100-line code file might be 500–1000 tokens. A full conversation after an hour of work might be 50,000–100,000 tokens.

```
"Hello, world!"   =  4 tokens  (Hello, comma, world, !)
A typical function =  50-200 tokens
A 200-line file   =  800-1500 tokens
This entire doc   =  ~3000 tokens
Claude's context  =  200,000+ tokens (varies by model)
```

The context window limit is how many tokens Claude can "see" at once. It's not about time — it's about volume of text.

---

## Visualizing the Context Window

```
Your Context Window (200,000 tokens)
┌──────────────────────────────────────────────────────────────────┐
│ ████████████████████████████████████████░░░░░░░░░░░░░░░░░░░░░░ │
│ ──────────────────────────────────────────────────────────────── │
│ Used: 140,000 tokens                      Free: 60,000 tokens   │
└──────────────────────────────────────────────────────────────────┘

Legend:
████  = Used (conversation history, files read, outputs)
░░░░  = Free (available for new messages and responses)

When it reaches ~95% full:
┌──────────────────────────────────────────────────────────────────┐
│ ██████████████████████████████████████████████████████████░░░░ │
│ Used: 190,000 tokens                      Free: 10,000 tokens   │
└──────────────────────────────────────────────────────────────────┘
→ Auto-compaction triggers here

What fills up context:
├── Your messages and Claude's replies
├── Files Claude has read (can be large!)
├── Terminal/command output
└── Tool call results (database queries, API responses, etc.)
```

---

## Visualizing Context Usage

```
> /context
```

Displays a colored grid showing how full your context window is:
- Green — plenty of space
- Yellow — getting full
- Red — nearly full, compaction recommended

![Context visualization](./images/context-visualization.png)
> What to expect: a visual grid of colored blocks representing how much of your context window is used. Green blocks are used-but-comfortable, yellow means you're getting near 70%, red means compaction is about to happen or is recommended now. A percentage number shows exactly how full the window is.

---

## Auto-Compaction

By default, Claude Code automatically compacts your conversation when it reaches **~95% capacity**.

Compaction summarizes the conversation history, keeping key decisions and context while freeing space. You usually won't notice — it just keeps working.

```
Before compaction (95% full):
┌──────────────────────────────────────────────────────────────────┐
│ [hour 1 messages] [hour 2 messages] [hour 3 messages] [current] │
│ 190,000 / 200,000 tokens                                         │
└──────────────────────────────────────────────────────────────────┘
                            │
                            │  Auto-compaction runs
                            │  (Summarizes old messages)
                            ▼
After compaction:
┌──────────────────────────────────────────────────────────────────┐
│ [SUMMARY: what was decided and built] [hour 3] [current]        │
│ 40,000 / 200,000 tokens                                          │
└──────────────────────────────────────────────────────────────────┘
```

### Trigger compaction earlier

If you want to compact before hitting 95%, set a lower threshold:

```bash
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70 claude
```

This compacts at 70% capacity instead of 95%.

**When to use:** On very long tasks (building a whole feature over several hours), compacting earlier means Claude never gets into the "context scramble" zone where important information starts competing for space.

**macOS / Linux (Ubuntu):**
```bash
# For the current session only:
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70 claude

# To make it permanent, add to your shell profile:
echo 'export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70' >> ~/.zshrc  # macOS
echo 'export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70' >> ~/.bashrc  # Linux
```

**Windows (WSL):**
```bash
CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70 claude
# To make permanent:
echo 'export CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70' >> ~/.bashrc
source ~/.bashrc
```

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

**When to use:** Before starting a new sub-task within the same session. For example, you spent two hours designing a database schema, got it right, and now you're moving on to building the API. Compact, preserving the schema decisions, before diving into the API work.

---

## Starting Fresh

```
> /clear
```

Wipes the entire conversation history. Use this when:
- You're starting a completely new task
- Context is full and compaction isn't enough
- You want a clean slate

**Important:** `/clear` clears the active context, not the session on disk. If you need to go back, use `/rewind` instead.

---

## Signs Your Context is Getting Full

You may notice these symptoms before `/context` turns red:

| Symptom | What's happening |
|---------|-----------------|
| Claude forgets something you discussed an hour ago | Old messages were pushed out of context |
| Responses become shorter or less detailed | Claude is conserving space |
| Claude asks you to re-explain something it already knew | Earlier explanation was compacted or lost |
| Claude seems "confused" about the current state of the code | File contents it read earlier are no longer in context |
| Response quality drops noticeably | Context is very full and Claude is working in a constrained space |

**What to do when you notice these signs:**

```
Step 1: Check context usage
> /context

Step 2: Compact with instructions
> /compact keep the architecture decisions, the auth code, and the database schema

Step 3: Verify Claude still has what it needs
> Summarize what you know about this project so far

Step 4: If needed, clear and restart
> /clear
```

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

**When to use:** Before trying something risky or experimental. Like a game save point — if the experiment goes wrong, you can restore to exactly here.

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

**Real-world scenario:** You asked Claude to "refactor the authentication module" and after 20 minutes of changes, the result is worse than what you started with. Rather than manually undoing everything, you rewind to the checkpoint you made before the refactor, and try a different approach.

---

## Context-Saving Strategies

### 1. Use CLAUDE.md instead of explaining each session

Instead of saying "we use TypeScript, run tests with npm test, never use var" every session — put it in CLAUDE.md. This information doesn't fill up your context window as conversation.

```markdown
# CLAUDE.md

## Project conventions
- TypeScript only (never var, always const/let)
- Run tests with: npm test
- Database: PostgreSQL (never use raw SQL, always use our QueryBuilder)
- API responses always have { data, error, meta } shape
```

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

Don't carry irrelevant context forward. Starting fresh on a new task is faster than trying to work around a full context.

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

This gets injected every time the conversation compacts. Even after aggressive compaction, Claude will still know these critical facts.

---

## Session vs Context

| | Session | Context Window |
|--|---------|---------------|
| **What it is** | The full conversation history on disk | What Claude can actively "see" |
| **Persistent?** | Yes — stored in `~/.claude/projects/` | No — temporary |
| **Size** | Unlimited (it's just a file) | Limited (model-dependent) |
| **After compaction** | Original kept, summary active | Freed up for new content |

You can **resume** a session even after context was compacted — the full history is still on disk, but Claude works from the compact summary.

**Where sessions are stored:**

**macOS / Linux (Ubuntu):**
```bash
ls ~/.claude/projects/
# Each subfolder is a project; inside are session JSON files
```

**Windows (WSL):**
```bash
ls ~/.claude/projects/
```

---

## Large File Handling

When you ask Claude to read a very large file, it may partially read it or summarize sections to fit in context.

**Tips for large files:**
```
> read just the authentication-related functions in this 5000-line file
> show me only the first 100 lines of the migration file
> what's in the getUserById function in models/user.js? (not the whole file)
```

If you're regularly working with large files, consider:
1. Asking about specific functions rather than whole files
2. Using subagents to explore large codebases
3. Using MCP servers to query databases or APIs rather than loading data into chat

---

## Extended Context (1M tokens)

Some organizations have access to an extended 1M token context window. With this, you can:
- Load entire codebases into context
- Work on very long documents
- Keep weeks of conversation history

Contact your Anthropic admin to enable extended context for your organization.
