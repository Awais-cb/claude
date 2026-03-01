# MCP Servers — Model Context Protocol

Imagine your smartphone before you discovered the App Store. It could call, text, and browse the web — but that was it. Then you installed apps: a map, a bank, a camera with filters, a food delivery service. Suddenly it could do almost anything. MCP servers work the same way for Claude. Out of the box, Claude can read files, write code, and run terminal commands. But with MCP servers installed, it can query your live database, open GitHub pull requests, post to Slack, browse the web, and much more — each server gives Claude a new superpower.

MCP stands for **Model Context Protocol** — an open standard that defines how AI assistants communicate with external tools and data sources. You install an MCP server once, and Claude can use its capabilities in any conversation.

---

## What Can MCP Servers Do?

An MCP server can expose three types of capabilities:

- **Tools** — actions Claude can take (e.g., run a database query, send a Slack message, create a GitHub issue)
- **Resources** — data Claude can read on demand (e.g., a specific database table, a file on a remote server, an API response)
- **Prompts** — reusable prompt templates you can trigger with a slash command

```
Without MCP:                     With MCP (GitHub server):
─────────────────────────        ─────────────────────────────────────
Claude sees:                     Claude sees:
  • Your local files              • Your local files
  • Terminal output               • Terminal output
  • What you paste in             • All your GitHub issues and PRs
                                  • Commit history and diffs
                                  • Ability to open/close/comment PRs
```

---

## How MCP Servers Work (Plain English)

When you add an MCP server, Claude Code launches a small background process (or connects to a remote URL). That process acts as a bridge between Claude and the external service. When you ask Claude "how many open bugs do we have?", Claude calls the GitHub MCP server's tool, gets the answer, and tells you — without you having to leave the conversation.

```
You ask Claude a question
        │
        ▼
Claude decides it needs external data
        │
        ▼
Claude calls the MCP server (e.g., GitHub server)
        │
        ▼
MCP server talks to the real service (GitHub API)
        │
        ▼
MCP server returns structured data to Claude
        │
        ▼
Claude gives you a useful answer
```

---

## Setting Up MCP Servers

### The `claude mcp` CLI (Primary Method)

The fastest way to add, list, and remove MCP servers is the `claude mcp` CLI — no manual JSON editing required:

```bash
# Add a local (stdio) server, passing environment variables and the command
claude mcp add my-server -e API_KEY=abc123 -- /path/to/server args

# Add an HTTP or streamable-HTTP server
claude mcp add --transport http my-server https://example.com/mcp

# List all configured servers
claude mcp list

# Remove a server
claude mcp remove my-server
```

> **Note on SSE transport:** The `--transport sse` option is deprecated. Use `--transport http` (streamable-HTTP) instead for remote servers — it is faster, more reliable, and the current standard.

---

### How to Add Your First MCP Server in 3 Steps

**Step 1: Choose a server**

Pick one from the popular list below (e.g., the GitHub server).

**Step 2: Create the config file**

Create a file called `.mcp.json` in your project folder (for all projects, user-scope MCP config is stored in `~/.claude.json`):

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

**Step 3: Start Claude and verify**

```bash
claude
```

Then type `/mcp` to see connected servers and available tools.

---

### Method 1: Interactive setup

```
> /mcp
```

Opens the MCP management interface where you can add, configure, and test servers.

![MCP connection status panel](./images/mcp-status-panel.png)
> What to expect: a list of connected MCP servers, their status (connected/error), and the tools each server provides. Green indicators mean the server is reachable and ready.

### Method 2: Config file

Create `.mcp.json` in your project:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Method 3: CLI flag

```bash
claude --mcp-config ./mcp-servers.json
```

---

## MCP Config Locations

Config files are loaded in priority order. A project-level config overrides your user-wide config:

```
.mcp.json          ← Project root (highest priority, shared with team via git)
~/.claude.json     ← User-wide (all projects, personal)
```

> **Important:** User-scope MCP configuration is stored inside `~/.claude.json` — not in a separate `~/.claude/.mcp.json` file. Project-scope configuration lives in `.mcp.json` at your project root.

### Where to find these files by OS

**macOS:**

| Scope | Path |
|-------|------|
| All projects (user-wide) | `~/.claude.json` (e.g., `/Users/yourname/.claude.json`) |
| Current project only | `.mcp.json` in your project root |
| Enterprise policy | `/Library/Application Support/ClaudeCode/mcp.json` |

**Linux (Ubuntu):**

| Scope | Path |
|-------|------|
| All projects (user-wide) | `~/.claude.json` (e.g., `/home/yourname/.claude.json`) |
| Current project only | `.mcp.json` in your project root |
| Enterprise policy | `/etc/claude-code/mcp.json` |

**Windows (WSL):**

| Scope | Path |
|-------|------|
| All projects (user-wide) | `~/.claude.json` inside your WSL home (e.g., `/home/yourname/.claude.json`) |
| Current project only | `.mcp.json` in your project root (inside WSL filesystem) |
| Windows native path | `%APPDATA%\ClaudeCode\mcp.json` (if using native Windows Claude) |

The easiest way to manage user-wide servers is with the CLI (see above). To edit the file directly:

**macOS / Linux (Ubuntu):**
```bash
$EDITOR ~/.claude.json
```

**Windows (WSL):**
```bash
nano ~/.claude.json
```

---

## Popular MCP Servers

### GitHub

**When to use:** When you want Claude to read issues, manage pull requests, review code changes, or search repository contents without copy-pasting things manually.

Query issues, PRs, repos, and files on GitHub:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

**Real-world scenario:** You just fixed a bug. Instead of opening a browser, navigating to GitHub, and manually creating a PR, you just say:

```
> List all open issues labeled "bug" in my repository
> Create a PR from the current branch to main
> What files changed in PR #47?
> Summarize the discussion on issue #23
```

**How to get a GitHub token:** Go to GitHub Settings > Developer settings > Personal access tokens > Generate new token. Select the `repo` scope.

---

### PostgreSQL / Database

**When to use:** When you want to explore your data, run ad-hoc queries, or understand your database schema without writing SQL manually.

Query your database directly:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost/mydb"
      }
    }
  }
}
```

**Real-world scenario:** Your product manager asks "how many users signed up last week and which plan did most of them choose?" Instead of switching to a DB client, you ask:

```
> How many users registered in the last 30 days?
> Show me the top 10 most purchased products
> Find all orders where payment_status is 'pending'
> What's the average session length for premium users?
```

**Security note:** Only connect to databases with read-only credentials when possible, especially on shared machines.

---

### Filesystem (Extended)

**When to use:** When your project references files outside the current directory — like shared config files, a documentation folder in another location, or a shared scripts directory.

Access files beyond the current directory:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/you/Documents"]
    }
  }
}
```

**macOS:**
```bash
# Replace /Users/yourname/Documents with the directory you want Claude to access
npx @modelcontextprotocol/server-filesystem /Users/yourname/Documents
```

**Linux (Ubuntu):**
```bash
npx @modelcontextprotocol/server-filesystem /home/yourname/Documents
```

**Windows (WSL):**
```bash
npx @modelcontextprotocol/server-filesystem /mnt/c/Users/yourname/Documents
```

---

### Slack

**When to use:** When you want Claude to draft and post summaries, deployment notes, or updates to Slack channels automatically as part of your workflow.

Read channels and send messages:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-...",
        "SLACK_TEAM_ID": "T..."
      }
    }
  }
}
```

**Real-world scenario:** After deploying, you run:

```
> Post a summary of today's changes to #deployments
> What was discussed in #engineering this week?
> Draft a message to #backend about the API change we just made
```

---

### Google Drive

**When to use:** When your team stores specs, requirements, or documentation in Google Docs and you want Claude to reference them directly.

Access Google Docs, Sheets, and Drive:

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"]
    }
  }
}
```

---

## Using MCP Tools in a Session

Once configured, MCP tools are available automatically:

```
> Search GitHub for issues related to "memory leak"
> Query the database for the top 10 users by session count
> Post "Deployment complete" to the #releases Slack channel
```

### Reference MCP resources with `@`

```
> @github:issues/47  what's the status of this issue?
> @postgres:users    show me the table schema
```

### Use MCP prompts as commands

```
/mcp__github__create-pr
/mcp__slack__summarize-channel
```

---

## Server Types

There are three ways MCP servers run. Most beginners will use stdio servers (local process), but remote HTTP servers are useful for shared team setups.

### Stdio servers (local process)

The most common type — runs a local process on your machine:

```json
{
  "command": "npx",
  "args": ["-y", "some-mcp-server"],
  "env": { "API_KEY": "..." }
}
```

```
Your Machine
┌─────────────────────────────────┐
│  Claude Code                    │
│       │                         │
│       ▼                         │
│  MCP Server Process             │
│  (npx some-mcp-server)          │
│       │                         │
│       ▼                         │
│  External API / Database        │
└─────────────────────────────────┘
```

### HTTP servers (remote endpoint)

**When to use:** When your team runs a shared MCP server that everyone connects to, hosted on a server rather than each person's laptop.

Connect to a remote MCP server:

```json
{
  "url": "https://mcp.example.com/api",
  "headers": {
    "Authorization": "Bearer your-token"
  }
}
```

### SSE servers (server-sent events)

```json
{
  "url": "https://mcp.example.com/sse"
}
```

---

## Environment Variables in MCP Config

Use `${VAR_NAME}` to reference environment variables:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

This keeps secrets out of your config file. Set the actual values in your shell:

**macOS / Linux (Ubuntu):**
```bash
export GITHUB_TOKEN="ghp_your_actual_token"
# Add this line to ~/.zshrc or ~/.bashrc to make it permanent
```

**Windows (WSL):**
```bash
export GITHUB_TOKEN="ghp_your_actual_token"
# Add to ~/.bashrc in WSL
echo 'export GITHUB_TOKEN="ghp_your_actual_token"' >> ~/.bashrc
```

---

## Building a Custom MCP Server

**When to use:** When your company has internal tools, proprietary APIs, or databases that don't have a public MCP server yet. Building your own takes about 30 minutes for a simple server.

You can build your own MCP server for any internal tool or API.

### Simple Node.js MCP server

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "my-company-tools",
  version: "1.0.0"
});

// Add a tool
server.tool(
  "get-employee",
  "Fetch employee information by ID",
  {
    employee_id: { type: "string", description: "Employee ID" }
  },
  async ({ employee_id }) => {
    const employee = await fetchFromHR(employee_id);
    return {
      content: [{ type: "text", text: JSON.stringify(employee) }]
    };
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

Configure it:

```json
{
  "mcpServers": {
    "company-tools": {
      "command": "node",
      "args": ["./mcp-servers/company-tools.js"]
    }
  }
}
```

**Usage:**
```
> Get information about employee E-12345
```

---

## MCP Security

Claude Code has protections for MCP:

- **Tool search** — by default, tools beyond 10% of context are deferred to avoid prompt injection
- **Permission prompts** — MCP tool calls respect permission mode settings
- **Admin control** — Enterprise admins can allowlist/denylist MCP servers

### Strict MCP config

Only use explicitly configured MCP servers (ignore any others):

```bash
claude --strict-mcp-config --mcp-config ./safe-servers.json
```

**When to use strict mode:** In CI/CD pipelines, or any environment where you want to guarantee that only pre-approved servers are used, regardless of what might be in project config files.

---

## Debugging MCP

```
> /mcp
```

The MCP interface shows:
- Connected servers
- Available tools from each server
- Connection status
- Error messages

Or use debug mode:
```bash
claude --debug mcp
```

**Common issues:**

| Problem | Likely cause | Fix |
|---------|-------------|-----|
| Server shows "disconnected" | Bad API token | Double-check your token in the `env` section |
| "command not found" error | `npx` not installed | Run `npm install -g npx` first |
| Tools don't appear | Config file not found | Check the file path and JSON syntax |
| Server connects but queries fail | Wrong connection string | Test the connection string directly in a DB client |
