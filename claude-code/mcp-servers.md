# MCP Servers — Model Context Protocol

MCP (Model Context Protocol) is an open standard that lets Claude connect to external tools and data sources. Think of MCP servers as plugins that give Claude new abilities — like querying your database, reading GitHub issues, searching Slack, or controlling a browser.

---

## What Can MCP Servers Do?

An MCP server can expose:
- **Tools** — actions Claude can take (e.g., query a database, send a Slack message)
- **Resources** — data Claude can read (e.g., files, database records, API responses)
- **Prompts** — reusable prompt templates

---

## Setting Up MCP Servers

### Method 1: Interactive setup

```
> /mcp
```

Opens the MCP management interface where you can add, configure, and test servers.

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

```
.mcp.json                        ← Project-local (highest priority)
.claude/.mcp.json                ← Project config
~/.claude/.mcp.json              ← User-wide (all projects)
```

---

## Popular MCP Servers

### GitHub

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

**Usage:**
```
> List all open issues labeled "bug" in my repository
> Create a PR from the current branch to main
> What files changed in PR #47?
```

### PostgreSQL / Database

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

**Usage:**
```
> How many users registered in the last 30 days?
> Show me the top 10 most purchased products
> Find all orders where payment_status is 'pending'
```

### Filesystem (Extended)

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

### Slack

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

**Usage:**
```
> Post a summary of today's changes to #deployments
> What was discussed in #engineering this week?
```

### Google Drive

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

### Stdio servers (local process)

The most common type — runs a local process:

```json
{
  "command": "npx",
  "args": ["-y", "some-mcp-server"],
  "env": { "API_KEY": "..." }
}
```

### HTTP servers (remote endpoint)

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

This keeps secrets out of your config file.

---

## Building a Custom MCP Server

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
