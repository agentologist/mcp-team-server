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

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Empty tool list - tools will be added when microservices are built
const allTools: any[] = [];

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
    const { name } = request.params;

    // No tools defined yet
    return {
      content: [
        {
          type: "text",
          text: `Error: No tools are defined yet. Tool "${name}" does not exist.`,
        },
      ],
    };
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
