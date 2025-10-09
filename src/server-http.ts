#!/usr/bin/env node
/**
 * HTTP/SSE Server for MCP
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
import { ContentApiClient } from "./api-client.js";
import { RESEARCH_TOOLS } from "./research-tools.js";
import { ResearchHandlers } from "./research-handlers.js";
import { CONTENT_TOOLS, ContentToolHandlers } from "./content-tools.js";

const app = express();
const PORT = process.env.PORT || 3002;

const apiUrl = process.env.CONTENT_API_URL || 'http://localhost:3001';
const apiClient = new ContentApiClient(apiUrl);
const researchHandlers = new ResearchHandlers(apiClient);
const contentHandlers = new ContentToolHandlers(apiClient);
const sseTransports = new Map<string, SSEServerTransport>();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'content-tool-mcp', version: '0.2.0' });
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
      name: "agentologist-content-tool",
      version: "0.2.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Setup handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [...CONTENT_TOOLS, ...RESEARCH_TOOLS],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        // Content generation tools
        case "generate_content":
          return await contentHandlers.handleGenerate(args);
        case "refine_content":
          return await contentHandlers.handleRefine(args);
        case "analyze_content":
          return await contentHandlers.handleAnalyze(args);

        // Keyword research tools
        case "keyword_data":
          return await researchHandlers.handleKeywordData(args);
        case "related_keywords":
          return await researchHandlers.handleRelatedKeywords(args);
        case "enhanced_keyword_research":
          return await researchHandlers.handleEnhancedKeywordResearch(args);
        case "categorize_keywords":
          return await researchHandlers.handleCategorizeKeywords(args);
        case "cluster_keywords":
          return await researchHandlers.handleClusterKeywords(args);

        // Topic & news research tools
        case "search_news":
          return await researchHandlers.handleSearchNews(args);
        case "deep_research_topic":
          return await researchHandlers.handleDeepResearchTopic(args);
        case "analyze_viral_potential":
          return await researchHandlers.handleAnalyzeViralPotential(args);
        case "trending_questions":
          return await researchHandlers.handleTrendingQuestions(args);
        case "research_headline":
          return await researchHandlers.handleResearchHeadline(args);
        case "enhanced_topic_search":
          return await researchHandlers.handleEnhancedTopicSearch(args);
        case "website_context":
          return await researchHandlers.handleWebsiteContext(args);

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${errorMessage}` }],
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

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Content Tool MCP Server (HTTP/SSE)       ║');
  console.log(`║  Port: ${PORT.toString().padEnd(36)}║`);
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`📊 Endpoints:`);
  console.log(`  Health: http://localhost:${PORT}/health`);
  console.log(`  SSE: http://localhost:${PORT}/sse`);
  console.log('');
  console.log('🎯 Ready for connections!');
  console.log('');
});
