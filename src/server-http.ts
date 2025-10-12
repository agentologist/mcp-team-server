#!/usr/bin/env node
/**
 * HTTP/SSE Server for MCP Team Server
 * Provides HTTP endpoints for server-to-server communication
 *
 * This is a clean protocol layer ready for tool definitions.
 * Tools will be added in the future as separate microservices are built.
 */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { enhancedKeywordResearch } from "./handlers/keywordResearchHandler.js";
import { trendHeadlines } from "./handlers/headlineHandler.js";
import { keywordTools } from "./tools/keywordTools.js";
import { headlineTools } from "./tools/headlineTools.js";

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// All available tools
const allTools: any[] = [
  ...keywordTools,
  ...headlineTools,
  {
    name: "echo",
    description: "Echo back the input text (test tool)",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text to echo back",
        },
      },
      required: ["text"],
    },
  },
];

const sseTransports = new Map<string, SSEServerTransport>();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    tools: allTools.length,
    server: 'mcp-team-server',
    version: '1.0.0',
  });
});

// SSE endpoint for MCP
app.get('/sse', async (req, res) => {
  console.log('📡 New SSE connection from', req.ip);

  const transport = new SSEServerTransport('/message', res);
  sseTransports.set(transport.sessionId, transport);
  transport.onclose = () => {
    sseTransports.delete(transport.sessionId);
  };

  const server = new Server(
    {
      name: "mcp-team-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Setup handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      // Handle keyword research tool
      if (name === "enhanced_keyword_research") {
        return await enhancedKeywordResearch(args as any);
      }

      // Handle trend headlines tool
      if (name === "trend_headlines") {
        return await trendHeadlines(args as any);
      }

      // Handle echo tool (temporary test tool)
      if (name === "echo") {
        return {
          content: [
            {
              type: "text",
              text: `Echo: ${(args as any)?.text || "no input"}`,
            },
          ],
        };
      }

      // Unknown tool
      return {
        content: [
          {
            type: "text",
            text: `Error: Unknown tool "${name}"`,
          },
        ],
        isError: true,
      };
    } catch (error) {
      console.error(`Error executing tool ${name}:`, error);
      return {
        content: [
          {
            type: "text",
            text: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });

  await server.connect(transport);
  console.log('✅ MCP server connected via SSE');

  req.on('close', () => {
    console.log('📡 SSE connection closed');
  });
});

// POST endpoint for messages
app.post('/message', express.json(), (req, res) => {
  const sessionId = typeof req.query.sessionId === 'string' ? req.query.sessionId : undefined;

  if (!sessionId) {
    res.status(400).send('Missing sessionId query parameter');
    return;
  }

  const transport = sseTransports.get(sessionId);

  if (!transport) {
    res.status(400).send('No transport found for sessionId');
    return;
  }

  return transport.handlePostMessage(req, res, req.body).catch((error) => {
    console.error('Failed to handle SSE message:', error);
  });
});

app.listen(PORT, '::' as any, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  MCP Team Server (HTTP/SSE)               ║');
  console.log(`║  Port: ${PORT.toString().padEnd(36)}║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ MCP Team Server started on port ${PORT}`);
  console.log(`✅ Loaded ${allTools.length} tool definitions`);
  if (allTools.length === 0) {
    console.log(`⚠️  No tools defined yet - server is ready for tool definitions`);
  }
  console.log(`📡 Binding to IPv6 (::) for Railway compatibility`);
  console.log('');
  console.log(`📊 Endpoints:`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  SSE: http://localhost:${PORT}/sse`);
  console.log('');
  console.log('🎯 Ready for connections!');
  console.log('');
});
