#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ContentApiClient } from "./api-client.js";
import { RESEARCH_TOOLS } from "./research-tools.js";
import { ResearchHandlers } from "./research-handlers.js";

// Content generation tool definitions
const CONTENT_TOOLS: Tool[] = [
  {
    name: "generate_content",
    description: "Generate AI-powered content based on a prompt and content type",
    inputSchema: {
      type: "object",
      properties: {
        prompt: {
          type: "string",
          description: "The prompt or topic for content generation",
        },
        contentType: {
          type: "string",
          enum: ["blog", "article", "social", "email", "ad", "general"],
          description: "The type of content to generate",
        },
        tone: {
          type: "string",
          enum: ["professional", "casual", "friendly", "formal", "persuasive"],
          description: "The tone of the content (optional)",
        },
        length: {
          type: "string",
          enum: ["short", "medium", "long"],
          description: "The desired length of the content (optional)",
        },
      },
      required: ["prompt", "contentType"],
    },
  },
  {
    name: "refine_content",
    description: "Refine and improve existing content based on specific criteria",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The content to refine",
        },
        instructions: {
          type: "string",
          description: "Specific instructions for refinement (e.g., 'make it more concise', 'add more details')",
        },
      },
      required: ["content", "instructions"],
    },
  },
  {
    name: "analyze_content",
    description: "Analyze content for tone, readability, and provide suggestions",
    inputSchema: {
      type: "object",
      properties: {
        content: {
          type: "string",
          description: "The content to analyze",
        },
      },
      required: ["content"],
    },
  },
];

class ContentToolMCPServer {
  private server: Server;
  private apiClient: ContentApiClient;
  private researchHandlers: ResearchHandlers;

  constructor() {
    // Get API URL from environment or use default
    const apiUrl = process.env.CONTENT_API_URL || 'http://localhost:3001';
    this.apiClient = new ContentApiClient(apiUrl);
    this.researchHandlers = new ResearchHandlers(this.apiClient);

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
            return await this.handleGenerateContent(args);
          case "refine_content":
            return await this.handleRefineContent(args);
          case "analyze_content":
            return await this.handleAnalyzeContent(args);

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

  private async handleGenerateContent(args: any) {
    const { prompt, contentType, tone = "professional", length = "medium" } = args;

    const content = await this.apiClient.generateContent({
      prompt,
      contentType,
      tone,
      length,
    });

    return {
      content: [
        {
          type: "text",
          text: content,
        },
      ],
    };
  }

  private async handleRefineContent(args: any) {
    const { content, instructions } = args;

    const refined = await this.apiClient.refineContent({
      content,
      instructions,
    });

    return {
      content: [
        {
          type: "text",
          text: refined,
        },
      ],
    };
  }

  private async handleAnalyzeContent(args: any) {
    const { content } = args;

    const analysis = await this.apiClient.analyzeContent({ content });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(analysis, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Content Tool MCP server running on stdio");
  }
}

const server = new ContentToolMCPServer();
server.run().catch(console.error);
