import { ContentApiClient } from "./api-client.js";

/**
 * Research tool handlers for MCP server
 */
export class ResearchHandlers {
  constructor(private apiClient: ContentApiClient) {}

  // ==================== KEYWORD RESEARCH HANDLERS ====================

  async handleKeywordData(args: any) {
    const { keywords, country = 'US' } = args;

    const result = await this.apiClient.getKeywordData(keywords, country);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleRelatedKeywords(args: any) {
    const { keyword, country = 'US', limit = 100 } = args;

    const result = await this.apiClient.getRelatedKeywords(keyword, country, limit);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleEnhancedKeywordResearch(args: any) {
    const { seedKeyword, country = 'US', options = {} } = args;

    const result = await this.apiClient.performEnhancedKeywordResearch(
      seedKeyword,
      country,
      options
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleCategorizeKeywords(args: any) {
    const { keywords } = args;
    const result = await this.apiClient.categorizeKeywords(keywords);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleClusterKeywords(args: any) {
    const { keywords } = args;
    const result = await this.apiClient.clusterKeywords(keywords);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  // ==================== TOPIC & NEWS RESEARCH HANDLERS ====================

  async handleSearchNews(args: any) {
    const { query } = args;
    const result = await this.apiClient.searchNews(query);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleDeepResearchTopic(args: any) {
    const { title, link, snippet } = args;
    const result = await this.apiClient.deepResearchTopic(title, link, snippet);

    return {
      content: [
        {
          type: "text",
          text: typeof result.research === 'string' ? result.research : JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleAnalyzeViralPotential(args: any) {
    const { article } = args;
    const result = await this.apiClient.analyzeViralPotential(article);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleTrendingQuestions(args: any) {
    const { topic } = args;
    const result = await this.apiClient.getTrendingQuestions(topic);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleResearchHeadline(args: any) {
    const { headline } = args;
    const result = await this.apiClient.researchHeadline(headline);

    return {
      content: [
        {
          type: "text",
          text: typeof result.research === 'string' ? result.research : JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleEnhancedTopicSearch(args: any) {
    const { query } = args;
    const result = await this.apiClient.performEnhancedTopicSearch(query);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  async handleWebsiteContext(args: any) {
    const { urls } = args;
    const result = await this.apiClient.getWebsiteContext(urls);

    return {
      content: [
        {
          type: "text",
          text: typeof result.context === 'string' ? result.context : JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}
