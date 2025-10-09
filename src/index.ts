#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ContentApiClient } from "./api-client.js";
import { RESEARCH_TOOLS } from "./research-tools.js";
import { ResearchHandlers } from "./research-handlers.js";
import { CONTENT_TOOLS, ContentToolHandlers } from "./content-tools.js";

class ContentToolMCPServer {
  private server: Server;
  private apiClient: ContentApiClient;
  private researchHandlers: ResearchHandlers;
  private contentHandlers: ContentToolHandlers;

  constructor() {
    // Get API URL from environment or use default
    const apiUrl = process.env.CONTENT_API_URL || 'http://localhost:3001';
    this.apiClient = new ContentApiClient(apiUrl);
    this.researchHandlers = new ResearchHandlers(this.apiClient);
    this.contentHandlers = new ContentToolHandlers(this.apiClient);

    this.server = new Server(
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

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools - combine content and research tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [...CONTENT_TOOLS, ...RESEARCH_TOOLS],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Content generation tools
          case "generate_content":
            return await this.contentHandlers.handleGenerate(args);
          case "refine_content":
            return await this.contentHandlers.handleRefine(args);
          case "analyze_content":
            return await this.contentHandlers.handleAnalyze(args);

          // Keyword research tools
          case "keyword_data":
            return await this.researchHandlers.handleKeywordData(args);
          case "related_keywords":
            return await this.researchHandlers.handleRelatedKeywords(args);
          case "enhanced_keyword_research":
            return await this.researchHandlers.handleEnhancedKeywordResearch(args);
          case "categorize_keywords":
            return await this.researchHandlers.handleCategorizeKeywords(args);
          case "cluster_keywords":
            return await this.researchHandlers.handleClusterKeywords(args);

          // Topic & news research tools
          case "search_news":
            return await this.researchHandlers.handleSearchNews(args);
          case "deep_research_topic":
            return await this.researchHandlers.handleDeepResearchTopic(args);
          case "analyze_viral_potential":
            return await this.researchHandlers.handleAnalyzeViralPotential(args);
          case "trending_questions":
            return await this.researchHandlers.handleTrendingQuestions(args);
          case "research_headline":
            return await this.researchHandlers.handleResearchHeadline(args);
          case "enhanced_topic_search":
            return await this.researchHandlers.handleEnhancedTopicSearch(args);
          case "website_context":
            return await this.researchHandlers.handleWebsiteContext(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Content Tool MCP server running on stdio");
  }
}

const server = new ContentToolMCPServer();
server.run().catch(console.error);
