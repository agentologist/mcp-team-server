/**
 * Keyword Research Handler for MCP Team Server
 *
 * Drop this file into: mcp-team-server/src/handlers/keywordResearchHandler.ts
 */

import axios from 'axios';

const KEYWORD_SERVICE_URL = process.env.KEYWORD_SERVICE_URL || 'http://keyword-service.railway.internal:3000';

export interface KeywordResearchInput {
  topic?: string;
  topics?: string[];
  country?: string;
  currency?: string;
  dataSource?: 'gkp' | 'cli';
  includeIntent?: boolean;
  includeComparison?: boolean;
}

/**
 * Enhanced keyword research using Keywords Everywhere API
 * Supports single keyword or batch research with intent classification
 */
export async function enhancedKeywordResearch(input: KeywordResearchInput) {
  const url = `${KEYWORD_SERVICE_URL}/api/research/enhanced`;

  try {
    console.log('🔍 [Keyword Research] Calling service:', {
      endpoint: url,
      hasTopics: !!input.topics,
      hasTopic: !!input.topic,
      country: input.country || 'us',
      includeIntent: input.includeIntent !== false,
      includeComparison: input.includeComparison || false
    });

    const response = await axios.post(url, input, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    console.log('✅ [Keyword Research] Success:', {
      success: data.success,
      keywordCount: data.keywords?.length || 0,
      creditsRemaining: data.credits?.remaining,
      processingTime: data.processingTime
    });

    // Format response for MCP
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2)
      }]
    };
  } catch (error: any) {
    console.error('❌ [Keyword Research] Failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Return error in MCP format
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Keyword service unavailable',
          message: error.message,
          details: error.response?.data,
          fallback: true
        }, null, 2)
      }],
      isError: true
    };
  }
}
