#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * MCP Team Server
 *
 * This is a clean protocol layer ready for tool definitions.
 * Tools will be added in the future as separate microservices are built.
 *
 * To add tools:
 * 1. Create /src/tools/ directory
 * 2. Define tool schemas in tool files (e.g., keyword-research.ts)
 * 3. Import and register tools in this file
 */

class MCPTeamServer {
  private server: Server;
  // Temporary echo tool so server has at least 1 tool for testing
  private tools: any[] = [
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
      };
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
