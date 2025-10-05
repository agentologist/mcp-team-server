# Riley MCP Client Integration Guide

## Overview

This guide explains how to integrate Riley's MCP client with the Content Tool MCP Server for programmatic access to all 15 research and content generation tools.

---

## Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   Riley     │  MCP    │  Content Tool    │  HTTP   │  AI Content      │
│   Server    │────────>│  MCP Server      │────────>│  Generator       │
│             │         │  (stdio/SSE)     │         │  Backend API     │
└─────────────┘         └──────────────────┘         └──────────────────┘
```

Riley connects to the MCP server, which then calls the AI Content Generator backend API.

---

## Connection Methods

### Option 1: stdio (Recommended for Same Server)

Use stdio transport when Riley and MCP server are on the same machine.

**Connection:**
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['/path/to/content-tool-mcp/dist/index.js'],
  env: {
    CONTENT_API_URL: 'http://localhost:3001'
  }
});

const client = new Client({
  name: 'riley-client',
  version: '1.0.0',
}, {
  capabilities: {}
});

await client.connect(transport);
```

### Option 2: SSE (For Remote Deployment)

Use Server-Sent Events when Riley and MCP server are on different machines.

**Note:** The current MCP server uses stdio. To support SSE, you'll need to add an SSE transport layer.

---

## Production Deployment (Railway)

### Architecture on Railway

**Recommended Setup: Same Container**

```
Railway Container:
├── AI Content Generator Backend (Port 3001)
│   └── /api/research/* endpoints
│   └── /api/mcp/* endpoints
├── Content Tool MCP Server (stdio)
│   └── Calls localhost:3001
└── Riley Server
    └── Connects to MCP via stdio
```

### Environment Variables

Set these in Riley's Railway environment:

```bash
# MCP Server Configuration
MCP_SERVER_PATH=/app/content-tool-mcp/dist/index.js
CONTENT_API_URL=http://localhost:3001

# Keywords Everywhere (if Riley needs to pass API keys)
KEYWORDS_EVERYWHERE_API_KEY=your_api_key_here
```

---

## Riley MCP Client Implementation

### 1. Install MCP SDK

```bash
npm install @modelcontextprotocol/sdk
```

### 2. Initialize MCP Client

**`riley/services/mcpClient.js`:**
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

class RileyMCPClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) return;

    const transport = new StdioClientTransport({
      command: 'node',
      args: [process.env.MCP_SERVER_PATH || '/app/content-tool-mcp/dist/index.js'],
      env: {
        CONTENT_API_URL: process.env.CONTENT_API_URL || 'http://localhost:3001'
      }
    });

    this.client = new Client({
      name: 'riley-mcp-client',
      version: '1.0.0',
    }, {
      capabilities: {}
    });

    await this.client.connect(transport);
    this.isConnected = true;
    console.log('✅ Riley connected to Content Tool MCP Server');
  }

  async listTools() {
    if (!this.isConnected) await this.connect();

    const response = await this.client.request({
      method: 'tools/list'
    }, {});

    return response.tools;
  }

  async callTool(toolName, args) {
    if (!this.isConnected) await this.connect();

    const response = await this.client.request({
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    }, {});

    return response.content;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('✅ Riley disconnected from MCP Server');
    }
  }
}

export const rileyMCP = new RileyMCPClient();
```

### 3. Use in Riley's Services

**Example: Keyword Research Service**

**`riley/services/keywordResearch.js`:**
```javascript
import { rileyMCP } from './mcpClient.js';

export class KeywordResearchService {
  /**
   * Get keyword data with volume and metrics
   */
  async getKeywordData(keywords, country = 'US') {
    const apiKey = process.env.KEYWORDS_EVERYWHERE_API_KEY;

    if (!apiKey) {
      throw new Error('Keywords Everywhere API key not configured');
    }

    const result = await rileyMCP.callTool('keyword_data', {
      keywords,
      country,
      apiKey
    });

    return this.parseToolResponse(result);
  }

  /**
   * Perform enhanced keyword research
   */
  async enhancedResearch(seedKeyword, options = {}) {
    const apiKey = process.env.KEYWORDS_EVERYWHERE_API_KEY;

    const result = await rileyMCP.callTool('enhanced_keyword_research', {
      seedKeyword,
      country: options.country || 'US',
      options: {
        includeAiGenerated: options.includeAiGenerated ?? true,
        includeLongTail: options.includeLongTail ?? true,
        includeQuestions: options.includeQuestions ?? true,
        maxResults: options.maxResults || 200
      },
      apiKey
    });

    return this.parseToolResponse(result);
  }

  /**
   * Find related keywords
   */
  async findRelatedKeywords(keyword, limit = 100) {
    const apiKey = process.env.KEYWORDS_EVERYWHERE_API_KEY;

    const result = await rileyMCP.callTool('related_keywords', {
      keyword,
      limit,
      apiKey
    });

    return this.parseToolResponse(result);
  }

  /**
   * Parse MCP tool response
   */
  parseToolResponse(content) {
    if (!content || content.length === 0) {
      throw new Error('Empty response from MCP server');
    }

    const text = content[0].text;

    // Try to parse as JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      // If not JSON, return as text
      return text;
    }
  }
}

export const keywordResearch = new KeywordResearchService();
```

**Example: Topic Research Service**

**`riley/services/topicResearch.js`:**
```javascript
import { rileyMCP } from './mcpClient.js';

export class TopicResearchService {
  /**
   * Search Google News
   */
  async searchNews(query) {
    const result = await rileyMCP.callTool('search_news', { query });
    return this.parseResponse(result);
  }

  /**
   * Deep research on topic
   */
  async deepResearch(title, link, snippet) {
    const result = await rileyMCP.callTool('deep_research_topic', {
      title,
      link,
      snippet
    });
    return this.parseResponse(result);
  }

  /**
   * Analyze viral potential
   */
  async analyzeViral(article) {
    const result = await rileyMCP.callTool('analyze_viral_potential', {
      article: {
        title: article.title,
        link: article.link,
        snippet: article.snippet
      }
    });
    return this.parseResponse(result);
  }

  /**
   * Generate trending questions
   */
  async getTrendingQuestions(topic) {
    const result = await rileyMCP.callTool('trending_questions', { topic });
    return this.parseResponse(result);
  }

  /**
   * Research headline
   */
  async researchHeadline(headline) {
    const result = await rileyMCP.callTool('research_headline', { headline });
    return this.parseResponse(result);
  }

  /**
   * Enhanced topic search
   */
  async enhancedSearch(query) {
    const result = await rileyMCP.callTool('enhanced_topic_search', { query });
    return this.parseResponse(result);
  }

  parseResponse(content) {
    const text = content[0].text;
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  }
}

export const topicResearch = new TopicResearchService();
```

**Example: Content Generation Service**

**`riley/services/contentGeneration.js`:**
```javascript
import { rileyMCP } from './mcpClient.js';

export class ContentGenerationService {
  /**
   * Generate content
   */
  async generateContent(prompt, contentType, tone = 'professional', length = 'medium') {
    const result = await rileyMCP.callTool('generate_content', {
      prompt,
      contentType,
      tone,
      length
    });

    return result[0].text;
  }

  /**
   * Refine content
   */
  async refineContent(content, instructions) {
    const result = await rileyMCP.callTool('refine_content', {
      content,
      instructions
    });

    return result[0].text;
  }

  /**
   * Analyze content
   */
  async analyzeContent(content) {
    const result = await rileyMCP.callTool('analyze_content', { content });

    const text = result[0].text;
    return JSON.parse(text);
  }
}

export const contentGeneration = new ContentGenerationService();
```

---

## Usage in Riley's Routes

**Example: Riley API Endpoint**

**`riley/routes/research.js`:**
```javascript
import express from 'express';
import { keywordResearch } from '../services/keywordResearch.js';
import { topicResearch } from '../services/topicResearch.js';
import { contentGeneration } from '../services/contentGeneration.js';

const router = express.Router();

// Keyword research endpoint
router.post('/keywords/research', async (req, res) => {
  try {
    const { seedKeyword, options } = req.body;

    const result = await keywordResearch.enhancedResearch(seedKeyword, options);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Topic research endpoint
router.post('/topic/research', async (req, res) => {
  try {
    const { query } = req.body;

    const newsResults = await topicResearch.searchNews(query);
    const trendingQuestions = await topicResearch.getTrendingQuestions(query);

    res.json({
      success: true,
      data: {
        news: newsResults,
        questions: trendingQuestions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Content generation endpoint
router.post('/content/generate', async (req, res) => {
  try {
    const { prompt, contentType, tone, length } = req.body;

    const content = await contentGeneration.generateContent(
      prompt,
      contentType,
      tone,
      length
    );

    res.json({
      success: true,
      content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
```

---

## Riley Startup Script

**`riley/startup.js`:**
```javascript
import { rileyMCP } from './services/mcpClient.js';
import express from 'express';
import researchRoutes from './routes/research.js';

const app = express();
app.use(express.json());

// Initialize MCP connection on startup
async function startup() {
  try {
    // Connect to MCP server
    await rileyMCP.connect();

    // List available tools
    const tools = await rileyMCP.listTools();
    console.log(`✅ Connected to MCP server with ${tools.length} tools available`);

    // Mount routes
    app.use('/api/research', researchRoutes);

    // Start server
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`✅ Riley server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start Riley:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await rileyMCP.disconnect();
  process.exit(0);
});

startup();
```

---

## Railway Deployment Configuration

### 1. Update Railway Build Script

**In AI Content Generator's `railway.json`:**
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && cd ../content-tool-mcp && npm install && npm run build && cd ../riley && npm install"
  },
  "deploy": {
    "startCommand": "concurrently \"npm run backend\" \"npm run riley\"",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 2. Update package.json Scripts

**Root `package.json`:**
```json
{
  "scripts": {
    "backend": "cd ai-content-generator && node backend/server.js",
    "riley": "cd riley && node startup.js",
    "start": "concurrently \"npm run backend\" \"npm run riley\""
  },
  "dependencies": {
    "concurrently": "^8.0.0"
  }
}
```

### 3. Set Railway Environment Variables

```bash
# AI Content Generator
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_gemini_key
CONTENT_API_URL=http://localhost:3001
PORT=3001

# Riley
MCP_SERVER_PATH=/app/content-tool-mcp/dist/index.js
CONTENT_API_URL=http://localhost:3001
KEYWORDS_EVERYWHERE_API_KEY=your_kw_api_key
PORT=3002
```

---

## Testing Riley Integration

### 1. Test Locally

```bash
# Terminal 1: Start AI Content Generator backend
cd ai-content-generator
npm run backend:dev

# Terminal 2: Start Riley with MCP
cd riley
node startup.js
```

### 2. Test MCP Connection

```bash
# Test keyword research
curl -X POST http://localhost:3002/api/research/keywords/research \
  -H "Content-Type: application/json" \
  -d '{
    "seedKeyword": "AI content writing",
    "options": {
      "maxResults": 50
    }
  }'
```

### 3. Test Topic Research

```bash
# Test news search
curl -X POST http://localhost:3002/api/research/topic/research \
  -H "Content-Type: application/json" \
  -d '{
    "query": "AI trends 2024"
  }'
```

---

## Error Handling

### Connection Errors

```javascript
try {
  await rileyMCP.connect();
} catch (error) {
  if (error.message.includes('ENOENT')) {
    console.error('MCP server executable not found. Check MCP_SERVER_PATH');
  } else if (error.message.includes('ECONNREFUSED')) {
    console.error('Backend API not running. Start AI Content Generator backend');
  } else {
    console.error('MCP connection error:', error);
  }
  throw error;
}
```

### Tool Call Errors

```javascript
try {
  const result = await rileyMCP.callTool('keyword_data', args);
} catch (error) {
  if (error.message.includes('API key')) {
    console.error('Keywords Everywhere API key missing or invalid');
  } else if (error.message.includes('timeout')) {
    console.error('Tool call timed out. Backend may be slow or down');
  } else {
    console.error('Tool call error:', error);
  }
  throw error;
}
```

---

## Available Tools for Riley

Riley has access to all **15 tools**:

### Content Generation (3)
- `generate_content`
- `refine_content`
- `analyze_content`

### Keyword Research (5)
- `keyword_data`
- `related_keywords`
- `enhanced_keyword_research`
- `categorize_keywords`
- `cluster_keywords`

### Topic Research (7)
- `search_news`
- `deep_research_topic`
- `analyze_viral_potential`
- `trending_questions`
- `research_headline`
- `enhanced_topic_search`
- `website_context`

See [TOOLS.md](TOOLS.md) for complete documentation.

---

## Workflow Examples

### Complete Content Research Workflow

```javascript
async function completeContentResearch(topic) {
  // 1. Search news
  const news = await topicResearch.searchNews(topic);

  // 2. Get trending questions
  const questions = await topicResearch.getTrendingQuestions(topic);

  // 3. Research keywords
  const keywords = await keywordResearch.enhancedResearch(topic);

  // 4. Analyze top article for viral potential
  if (news.result.articles.length > 0) {
    const viral = await topicResearch.analyzeViral(news.result.articles[0]);
  }

  // 5. Generate content
  const content = await contentGeneration.generateContent(
    questions.questions[0],
    'blog',
    'professional',
    'long'
  );

  return {
    news,
    questions,
    keywords,
    content
  };
}
```

---

## Support

For issues:
- **MCP Server**: https://github.com/agentologist/content-tool-mcp/issues
- **Integration Help**: See [TOOLS.md](TOOLS.md) and [INTEGRATION.md](INTEGRATION.md)

---

**Version**: 0.2.0
**Last Updated**: October 5, 2025
