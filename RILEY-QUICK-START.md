# Riley MCP Integration - Quick Start

## 1. Install MCP SDK in Riley

```bash
cd riley
npm install @modelcontextprotocol/sdk
```

## 2. Add Environment Variables

**`.env` or Railway config:**
```bash
MCP_SERVER_PATH=/app/content-tool-mcp/dist/index.js
CONTENT_API_URL=http://localhost:3001
KEYWORDS_EVERYWHERE_API_KEY=your_api_key_here
```

## 3. Create MCP Client Service

**`riley/services/mcpClient.js`:**
```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

class RileyMCPClient {
  constructor() {
    this.client = null;
  }

  async connect() {
    const transport = new StdioClientTransport({
      command: 'node',
      args: [process.env.MCP_SERVER_PATH],
      env: { CONTENT_API_URL: process.env.CONTENT_API_URL }
    });

    this.client = new Client({
      name: 'riley-mcp-client',
      version: '1.0.0',
    }, { capabilities: {} });

    await this.client.connect(transport);
  }

  async callTool(toolName, args) {
    const response = await this.client.request({
      method: 'tools/call',
      params: { name: toolName, arguments: args }
    }, {});
    return response.content;
  }
}

export const rileyMCP = new RileyMCPClient();
```

## 4. Use in Riley Code

**Example: Keyword Research**
```javascript
import { rileyMCP } from './services/mcpClient.js';

// Connect on startup
await rileyMCP.connect();

// Use tools
const result = await rileyMCP.callTool('enhanced_keyword_research', {
  seedKeyword: 'AI content writing',
  apiKey: process.env.KEYWORDS_EVERYWHERE_API_KEY,
  options: { maxResults: 100 }
});

const data = JSON.parse(result[0].text);
console.log(data);
```

## 5. All Available Tools

### Content Generation
- `generate_content` - Create content
- `refine_content` - Improve content
- `analyze_content` - Analyze quality

### Keyword Research (needs API key)
- `keyword_data` - Get volume/CPC
- `related_keywords` - Find variations
- `enhanced_keyword_research` - AI-powered research
- `categorize_keywords` - Classify by intent
- `cluster_keywords` - Group by topic

### Topic Research
- `search_news` - Search Google News
- `deep_research_topic` - Deep analysis
- `analyze_viral_potential` - Virality score
- `trending_questions` - Generate headlines
- `research_headline` - Validate headline
- `enhanced_topic_search` - Trend analysis
- `website_context` - Summarize URLs

## 6. Railway Deployment

**Same Container (Recommended):**
```
Railway Container:
├── AI Content Generator Backend (Port 3001)
├── Content Tool MCP Server (stdio)
└── Riley (Port 3002)
    └── Connects to MCP via stdio
```

**Start Command:**
```json
{
  "deploy": {
    "startCommand": "concurrently \"npm run backend\" \"npm run riley\""
  }
}
```

## Full Documentation

See [RILEY-INTEGRATION.md](RILEY-INTEGRATION.md) for complete implementation guide.

## Support

- Tools Reference: [TOOLS.md](TOOLS.md)
- Integration Guide: [RILEY-INTEGRATION.md](RILEY-INTEGRATION.md)
- Issues: https://github.com/agentologist/content-tool-mcp/issues
