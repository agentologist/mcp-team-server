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
}
