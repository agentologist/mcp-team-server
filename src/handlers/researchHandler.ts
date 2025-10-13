/**
 * Deep Topic Research Handler for MCP Team Server
 *
 * Drop this file into: mcp-team-server/src/handlers/researchHandler.ts
 */

import axios from 'axios';

const RESEARCH_SERVICE_URL = process.env.RESEARCH_SERVICE_URL || 'http://deep-dive-research-service.railway.internal:3003';

export interface DeepResearchInput {
  keyword: string;
  headline: string;
}

/**
 * Deep topic research using Deep Dive Research Service
 * Generates comprehensive research briefs with AI (Gemini or OpenAI)
 */
export async function deepTopicResearch(input: DeepResearchInput) {
  const url = `${RESEARCH_SERVICE_URL}/api/research/deep`;

  try {
    console.log('🔬 [Deep Research] Calling service:', {
      endpoint: url,
      keyword: input.keyword,
      headline: input.headline
    });

    const response = await axios.post(url, input, {
      timeout: 120000, // 2 minutes - research takes time
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const researchMarkdown = response.data;

    console.log('✅ [Deep Research] Success:', {
      contentLength: researchMarkdown.length,
      contentType: response.headers['content-type']
    });

    // Return the Markdown research document
    return {
      content: [{
        type: 'text',
        text: researchMarkdown
      }]
    };
  } catch (error: any) {
    console.error('❌ [Deep Research] Failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Return error in MCP format
    return {
      content: [{
        type: 'text',
        text: `# Research Service Error

**Error:** ${error.message}

**Status:** ${error.response?.status || 'N/A'}

**Details:** ${JSON.stringify(error.response?.data || {}, null, 2)}

**Suggestion:** Check that the deep-dive-research-service is running on Railway at port 3003 and that the AI provider (Gemini or OpenAI) is configured.`
      }],
      isError: true
    };
  }
}
