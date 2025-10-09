# MCP Team Server

**Version 1.0.0** - Clean Gateway Ready for Tool Development

## Overview

The **MCP Team Server** is a clean, minimal gateway that provides the infrastructure for tool microservices. It's a pure protocol layer with **NO tools defined yet**.

**Architecture:**
```
[Rowan] → [Riley] → [MCP Team Server] → (Future: Tool Microservices)
```

### Current State

⚠️ **NO TOOLS EXIST YET** - This is an empty gateway ready for tool development.

When you start the server, you'll see:
```
✅ MCP Team Server started on port 3001
✅ Loaded 0 tool definitions
⚠️  No tools defined yet - server is ready for tool definitions
```

## Installation

```bash
npm install
npm run build
```

## Running

### HTTP/SSE Server (Production)
```bash
npm start
```

### Local Development
```bash
npm run dev:http  # HTTP/SSE mode
npm run dev       # STDIO mode
```

## Configuration

Copy `.env.example` to `.env`:

```env
PORT=3001
NODE_OPTIONS=--dns-result-order=ipv4first
ROWAN_URL=http://rowan.railway.internal:3000
```

## Health Check

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "tools": 0,
  "server": "mcp-team-server",
  "version": "1.0.0"
}
```

## Project Structure

```
mcp-team-server/
├── src/
│   ├── index.ts          # STDIO server (no tools)
│   └── server-http.ts    # HTTP/SSE server (no tools)
├── dist/                 # Build output
├── .env
├── package.json
└── README.md
```

## Adding Tools (Future)

When ready to add tools:

1. **Create structure:**
   ```bash
   mkdir -p src/tools src/handlers
   ```

2. **Define tool schema** in `src/tools/your-tool.ts`:
   ```typescript
   import { Tool } from "@modelcontextprotocol/sdk/types.js";

   export const yourTools: Tool[] = [{
     name: "your_tool",
     description: "What it does",
     inputSchema: { /* JSON schema */ }
   }];

   export async function handleYourTool(args: any) {
     // Call your microservice here
   }
   ```

3. **Register handlers** in `src/handlers/index.ts`:
   ```typescript
   import { handleYourTool } from "../tools/your-tool.js";

   export const toolHandlers = {
     your_tool: handleYourTool,
   };
   ```

4. **Import in servers** (`src/index.ts` and `src/server-http.ts`):
   ```typescript
   import { yourTools } from "./tools/your-tool.js";
   import { toolHandlers } from "./handlers/index.js";

   const tools = [...yourTools];
   ```

## Connecting Riley

In Riley's `.env`:
```env
MCP_SERVER_URL=http://mcp-team-server.railway.internal:3001/sse
NODE_OPTIONS=--dns-result-order=ipv4first
```

Riley will connect successfully but receive 0 tools until you add them.

## Railway Deployment

The server is configured for Railway:
- Binds to IPv6 (`::`)
- Uses `railway.json` for build/deploy config
- Health endpoint at `/health`

## Architecture Principles

✅ **What this server does:**
- Pure MCP protocol layer
- SSE and STDIO transport
- Tool routing (when tools exist)
- Health checks

❌ **What this server doesn't do:**
- No tool implementations
- No business logic
- No external API calls
- No data processing

**All tool logic belongs in separate microservices.**

## License

MIT
