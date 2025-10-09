import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Keyword Research Tools
export const KEYWORD_RESEARCH_TOOLS: Tool[] = [
  {
    name: "keyword_data",
    description: "Get keyword search volume, CPC, and competition data from Keywords Everywhere API",
    inputSchema: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Array of keywords to research",
        },
        country: {
          type: "string",
          description: "Country code (e.g., 'US', 'UK', 'CA'). Default: 'US'",
        },
      },
      required: ["keywords"],
    },
  },
  {
    name: "related_keywords",
    description: "Find related keywords, questions, and variations for a seed keyword",
    inputSchema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          description: "The seed keyword to find variations for",
        },
        country: {
          type: "string",
          description: "Country code. Default: 'US'",
        },
        limit: {
          type: "number",
          description: "Maximum number of results. Default: 100",
        },
      },
      required: ["keyword"],
    },
  },
  {
    name: "enhanced_keyword_research",
    description: "Perform comprehensive AI-powered keyword research combining Keywords Everywhere data with AI-generated semantic variations and clustering",
    inputSchema: {
      type: "object",
      properties: {
        seedKeyword: {
          type: "string",
          description: "The seed keyword to expand from",
        },
        country: {
          type: "string",
          description: "Country code. Default: 'US'",
        },
        options: {
          type: "object",
          properties: {
            includeAiGenerated: { type: "boolean" },
            includeLongTail: { type: "boolean" },
            includeQuestions: { type: "boolean" },
            includeCommercial: { type: "boolean" },
            maxResults: { type: "number" },
          },
        },
      },
      required: ["seedKeyword"],
    },
  },
  {
    name: "categorize_keywords",
    description: "Categorize keywords by search intent (informational, navigational, transactional, commercial)",
    inputSchema: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Array of keywords to categorize",
        },
      },
      required: ["keywords"],
    },
  },
  {
    name: "cluster_keywords",
    description: "Group keywords into topic clusters for content strategy",
    inputSchema: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Array of keywords to cluster",
        },
      },
      required: ["keywords"],
    },
  },
];

// Topic & News Research Tools
export const TOPIC_RESEARCH_TOOLS: Tool[] = [
  {
    name: "search_news",
    description: "Search Google News for recent articles on a topic using AI-powered grounding",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query or topic",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "deep_research_topic",
    description: "Perform deep research on a specific article or topic, including search intent analysis and key findings",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The article title or topic",
        },
        link: {
          type: "string",
          description: "URL of the article",
        },
        snippet: {
          type: "string",
          description: "Brief description or snippet (optional)",
        },
      },
      required: ["title", "link"],
    },
  },
  {
    name: "analyze_viral_potential",
    description: "Analyze an article's potential to go viral, including engagement score and content angles",
    inputSchema: {
      type: "object",
      properties: {
        article: {
          type: "object",
          properties: {
            title: { type: "string" },
            link: { type: "string" },
            snippet: { type: "string" },
          },
          required: ["title"],
          description: "Article object with title, link, and snippet",
        },
      },
      required: ["article"],
    },
  },
  {
    name: "trending_questions",
    description: "Generate trending questions and headline ideas for a topic",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The topic or focus keyword",
        },
      },
      required: ["topic"],
    },
  },
  {
    name: "research_headline",
    description: "Research and validate a headline idea with market analysis and content opportunities",
    inputSchema: {
      type: "object",
      properties: {
        headline: {
          type: "string",
          description: "The headline to research",
        },
      },
      required: ["headline"],
    },
  },
  {
    name: "enhanced_topic_search",
    description: "Perform enhanced topic search with trend analysis, grounding sources, and content opportunities",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "website_context",
    description: "Generate concise summaries of website pages from URLs for context understanding",
    inputSchema: {
      type: "object",
      properties: {
        urls: {
          type: "array",
          items: { type: "string" },
          description: "Array of URLs to analyze",
        },
      },
      required: ["urls"],
    },
  },
];

// All research tools combined
export const RESEARCH_TOOLS: Tool[] = [
  ...KEYWORD_RESEARCH_TOOLS,
  ...TOPIC_RESEARCH_TOOLS,
];
