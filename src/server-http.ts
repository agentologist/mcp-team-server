#!/usr/bin/env node
/**
 * HTTP/SSE Server for MCP Team Server
 * Provides HTTP endpoints for server-to-server communication
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
import { deepTopicResearch } from "./handlers/researchHandler.js";
import { generateBlogContent } from "./handlers/blogWriterHandler.js";
import { generateSocialPosts } from "./handlers/socialPostWriterHandler.js";
import { keywordTools } from "./tools/keywordTools.js";
import { headlineTools } from "./tools/headlineTools.js";
import { researchTools } from "./tools/researchTools.js";
import { blogWriterTools } from "./tools/blogWriterTools.js";
import { socialPostWriterTools } from "./tools/socialPostWriterTools.js";

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// All available tools
const allTools: any[] = [
  ...keywordTools,
  ...headlineTools,
  ...researchTools,
  ...blogWriterTools,
  ...socialPostWriterTools
];

const sseTransports = new Map<string, SSEServerTransport>();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    tools: allTools.length,
    toolNames: allTools.map((t: any) => t.name),
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

      // Handle deep topic research tool
      if (name === "deep_topic_research") {
        return await deepTopicResearch(args as any);
      }

      // Handle blog writer service tool
      if (name === "blog_writer_service") {
        return await generateBlogContent(args as any);
      }

      // Handle social post writer service tool
      if (name === "generate_social_posts") {
        return await generateSocialPosts(args as any);
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
  console.log(`📋 Available tools: ${allTools.map((t: any) => t.name).join(', ')}`);
  console.log(`📡 Binding to IPv6 (::) for Railway compatibility`);
  console.log('');
  console.log(`📊 Endpoints:`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  SSE: http://localhost:${PORT}/sse`);
  console.log('');
  console.log('🎯 Ready for connections!');
  console.log('');
});
