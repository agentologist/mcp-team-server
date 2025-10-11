/**
 * Trend Headlines Handler for MCP Team Server
 */

import axios from 'axios';

const HEADLINE_SERVICE_URL = process.env.HEADLINE_SERVICE_URL || 'http://headline-trend-service.railway.internal:3005';

export interface TrendHeadlinesInput {
  focusKeyword: string;
}

/**
 * Generate trending headline ideas using real-world data from multiple sources
 * Aggregates Google News, GDELT, Reddit, and Google Trends data, then synthesizes headlines with AI
 */
export async function trendHeadlines(input: TrendHeadlinesInput) {
  const url = `${HEADLINE_SERVICE_URL}/api/research/trending`;

  try {
    console.log('📰 [Trend Headlines] Calling service:', {
      endpoint: url,
      focusKeyword: input.focusKeyword
    });

    const response = await axios.post(url, input, {
      timeout: 30000, // Longer timeout since it fetches from multiple sources
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = response.data;

    console.log('✅ [Trend Headlines] Success:', {
      focusKeyword: data.focusKeyword,
      headlineCount: data.headlines?.length || 0,
      influencerCount: data.influencers?.length || 0
    });

    // Format response for MCP
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(data, null, 2)
      }]
    };
  } catch (error: any) {
    console.error('❌ [Trend Headlines] Failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Return error in MCP format
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          error: 'Headline service unavailable',
          message: error.message,
          details: error.response?.data,
          fallback: true
        }, null, 2)
      }],
      isError: true
    };
  }
}
