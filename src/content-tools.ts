import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ContentApiClient } from "./api-client.js";

/**
 * Shared content tool definitions used by both stdio and HTTP/SSE servers.
 */
export const CONTENT_TOOLS: Tool[] = [
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
          description:
            "Specific instructions for refinement (e.g., 'make it more concise', 'add more details')",
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

export class ContentToolHandlers {
  constructor(private apiClient: ContentApiClient) {}

  async handleGenerate(args: any) {
    const { prompt, contentType, tone = "professional", length = "medium" } = args ?? {};

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

  async handleRefine(args: any) {
    const { content, instructions } = args ?? {};

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

  async handleAnalyze(args: any) {
    const { content } = args ?? {};

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
}
