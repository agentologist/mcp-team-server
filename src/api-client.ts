import axios, { AxiosInstance } from 'axios';

export interface GenerateContentRequest {
  prompt: string;
  contentType: 'blog' | 'article' | 'social' | 'email' | 'ad' | 'general';
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
}

export interface RefineContentRequest {
  content: string;
  instructions: string;
}

export interface AnalyzeContentRequest {
  content: string;
}

export interface ContentApiResponse {
  success: boolean;
  content?: string;
  refined?: string;
  analysis?: {
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    averageWordsPerSentence: number;
    readabilityEstimate: string;
    suggestions: string[];
  };
  error?: string;
  message?: string;
}

export class ContentApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 60000, // 60 second timeout for AI generation
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async generateContent(request: GenerateContentRequest): Promise<string> {
    try {
      const response = await this.client.post<ContentApiResponse>(
        '/api/mcp/generate',
        request
      );

      if (!response.data.success || !response.data.content) {
        throw new Error(response.data.error || 'Failed to generate content');
      }

      return response.data.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Content generation failed: ${message}`);
      }
      throw error;
    }
  }

  async refineContent(request: RefineContentRequest): Promise<string> {
    try {
      const response = await this.client.post<ContentApiResponse>(
        '/api/mcp/refine',
        request
      );

      if (!response.data.success || !response.data.refined) {
        throw new Error(response.data.error || 'Failed to refine content');
      }

      return response.data.refined;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Content refinement failed: ${message}`);
      }
      throw error;
    }
  }

  async analyzeContent(request: AnalyzeContentRequest): Promise<ContentApiResponse['analysis']> {
    try {
      const response = await this.client.post<ContentApiResponse>(
        '/api/mcp/analyze',
        request
      );

      if (!response.data.success || !response.data.analysis) {
        throw new Error(response.data.error || 'Failed to analyze content');
      }

      return response.data.analysis;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Content analysis failed: ${message}`);
      }
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/mcp/health');
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }

  // ==================== KEYWORD RESEARCH METHODS ====================

  async getKeywordData(keywords: string[], country: string = 'US'): Promise<any> {
    try {
      const response = await this.client.post('/api/research/keywords/data', {
        keywords,
        country,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Keyword data failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async getRelatedKeywords(keyword: string, country: string = 'US', limit: number = 100): Promise<any> {
    try {
      const response = await this.client.post('/api/research/keywords/related', {
        keyword,
        country,
        limit,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Related keywords failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async performEnhancedKeywordResearch(seedKeyword: string, country: string = 'US', options: any = {}): Promise<any> {
    try {
      const response = await this.client.post('/api/research/keywords/enhanced', {
        seedKeyword,
        country,
        options,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Enhanced keyword research failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async categorizeKeywords(keywords: string[]): Promise<any> {
    try {
      const response = await this.client.post('/api/research/keywords/categorize', {
        keywords,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Keyword categorization failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async clusterKeywords(keywords: string[]): Promise<any> {
    try {
      const response = await this.client.post('/api/research/keywords/cluster', {
        keywords,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Keyword clustering failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  // ==================== TOPIC & NEWS RESEARCH METHODS ====================

  async searchNews(query: string): Promise<any> {
    try {
      const response = await this.client.post('/api/research/news/search', {
        query,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`News search failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async deepResearchTopic(title: string, link: string, snippet?: string): Promise<any> {
    try {
      const response = await this.client.post('/api/research/topic/deep-research', {
        title,
        link,
        snippet,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Deep research failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async analyzeViralPotential(article: { title: string; link?: string; snippet?: string }): Promise<any> {
    try {
      const response = await this.client.post('/api/research/article/viral-analysis', {
        article,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Viral analysis failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async getTrendingQuestions(topic: string): Promise<any> {
    try {
      const response = await this.client.post('/api/research/topic/trending-questions', {
        topic,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Trending questions failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async researchHeadline(headline: string): Promise<any> {
    try {
      const response = await this.client.post('/api/research/headline/research', {
        headline,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Headline research failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async performEnhancedTopicSearch(query: string): Promise<any> {
    try {
      const response = await this.client.post('/api/research/topic/enhanced-search', {
        query,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Enhanced topic search failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async getWebsiteContext(urls: string[]): Promise<any> {
    try {
      const response = await this.client.post('/api/research/website/context', {
        urls,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Website context failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }
}
