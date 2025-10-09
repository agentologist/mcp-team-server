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
  private tools: any[] = []; // Empty until tools are defined

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
    console.error(`✅ Loaded ${this.tools.length} tool definitions`);
    if (this.tools.length === 0) {
      console.error(`⚠️  No tools defined yet - server is ready for tool definitions`);
    }
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.tools,
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MCP Team Server running on stdio");
  }
}

const server = new MCPTeamServer();
server.run().catch(console.error);
