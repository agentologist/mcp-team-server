#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { enhancedKeywordResearch } from "./handlers/keywordResearchHandler.js";
import { trendHeadlines } from "./handlers/headlineHandler.js";
import { keywordTools } from "./tools/keywordTools.js";
import { headlineTools } from "./tools/headlineTools.js";

/**
 * MCP Team Server
 *
 * Protocol layer that exposes microservices as tools for AI agents.
 *
 * Connected Tools:
 * - enhanced_keyword_research: Keyword research via Keywords Everywhere API
 * - trend_headlines: Trending headline generation via headline-trend-service
 */

class MCPTeamServer {
  private server: Server;
  private tools: any[] = [
    ...keywordTools,
    ...headlineTools,
    // Keep echo tool for testing
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

  constructor() {
    this.server = new Server(
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

    this.setupHandlers();
    this.logStartup();
  }

  private logStartup() {
    console.error(`✅ MCP Team Server started`);
    console.error(`✅ Loaded ${this.tools.length} tool definition(s)`);
    console.error(`📋 Available tools: ${this.tools.map(t => t.name).join(', ')}`); // Debug: Show tool names
    if (this.tools.length === 1 && this.tools[0].name === "echo") {
      console.error(`⚠️  Running with temporary 'echo' test tool`);
    }
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
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

        // Handle echo tool (test tool)
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
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MCP Team Server running on stdio");
  }
}

const server = new MCPTeamServer();
server.run().catch(console.error);
