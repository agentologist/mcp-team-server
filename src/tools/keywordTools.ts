/**
 * Keyword Research Tool Definition for MCP Team Server
 *
 * Drop this file into: mcp-team-server/src/tools/keywordTools.ts
 */

export const keywordTools = [
  {
    name: 'enhanced_keyword_research',
    description: `Performs enhanced keyword research using the Keywords Everywhere API.

🎯 Key Features:
- Search volume, competition, and CPC data for keywords
- Automatic search intent classification (transactional, commercial, informational, navigational)
- 12-month historical trend data
- Smart comparison and opportunity scoring
- Supports single keyword or batch research (up to 100 keywords)

📊 Data Provided:
- Monthly search volume
- Competition score (0-1)
- Cost-per-click (CPC) in USD
- Search intent with confidence score
- 12-month trend history
- Opportunity scoring (when comparing multiple keywords)

💡 Use Cases:
- SEO keyword research and content planning
- Competitive keyword analysis
- Search intent analysis for content strategy
- Finding low-competition high-volume opportunities
- Trend analysis for seasonal content

📝 Examples:
- Single keyword: { "topic": "solar panels" }
- Multiple keywords: { "topics": ["solar panels", "wind energy", "home batteries"] }
- With comparison: { "topics": [...], "includeComparison": true }`,

    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'A single keyword to research. Use this OR topics (not both).',
          examples: ['solar panels', 'buy home staging kit', 'best seo tools']
        },
        topics: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 100,
          description: 'Array of keywords to research (1-100 keywords). Use this OR topic (not both).',
          examples: [
            ['solar panels', 'wind energy'],
            ['buy staging kit', 'home staging services', 'property styling']
          ]
        },
        country: {
          type: 'string',
          description: 'Country code for localized search data',
          default: 'us',
          examples: ['us', 'uk', 'ca', 'au', 'de']
        },
        currency: {
          type: 'string',
          description: 'Currency for CPC (cost-per-click) data',
          default: 'usd',
          examples: ['usd', 'gbp', 'cad', 'aud', 'eur']
        },
        dataSource: {
          type: 'string',
          enum: ['gkp', 'cli'],
          description: 'Data source: "gkp" (Google Keyword Planner - most accurate) or "cli" (Clickstream data)',
          default: 'gkp'
        },
        includeIntent: {
          type: 'boolean',
          description: 'Include AI-powered search intent classification with confidence scores',
          default: true
        },
        includeComparison: {
          type: 'boolean',
          description: 'Include competitive comparison analysis (only works with multiple keywords). Shows best opportunity, highest volume, lowest competition, etc.',
          default: false
        }
      },
      oneOf: [
        { required: ['topic'] },
        { required: ['topics'] }
      ]
    }
  }
];

export default keywordTools;
