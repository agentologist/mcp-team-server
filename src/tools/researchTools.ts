/**
 * Deep Topic Research Tool Definition for MCP Team Server
 *
 * Drop this file into: mcp-team-server/src/tools/researchTools.ts
 */

export const researchTools = [
  {
    name: 'deep_topic_research',
    description: `Generates comprehensive, structured research briefs for content marketing and blog creation using AI (Gemini/OpenAI).

🎯 Key Features:
- Executive summary (5-6 sentences)
- Search intent analysis (Informational, Navigational, Commercial, Transactional)
- Key findings with bullet points
- Supporting data & statistics (verifiable and citable)
- Expert opinions & quotes (with sources)
- Common questions from "People Also Ask"
- Implications & impact analysis
- Actionable insights for content creation
- Related topics to explore (4-6 areas)

📊 Data Sources:
- Wikipedia API for background information
- News API for recent articles (optional)
- SERP data placeholders
- AI synthesis (Google Gemini or OpenAI GPT-4)

💡 Use Cases:
- Content marketing research
- Blog post preparation
- SEO content strategy
- Topic validation and market analysis
- Competitive research
- Content angle identification

⚡ Performance:
- Response time: 10-30 seconds
- Output format: Markdown
- AI Provider: Google Gemini (FREE) or OpenAI GPT-4

📝 Example:
{
  "keyword": "AI content marketing",
  "headline": "How AI is Revolutionizing Content Marketing in 2025"
}`,

    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: 'The main focus keyword or topic to research (e.g., "AI SEO optimization", "content marketing automation")',
          examples: ['AI content marketing', 'blockchain technology', 'remote work trends']
        },
        headline: {
          type: 'string',
          description: 'The article headline or title to research (e.g., "How AI is Transforming Content Marketing")',
          examples: [
            'How AI is Revolutionizing Content Marketing in 2025',
            'The Complete Guide to Blockchain for Beginners',
            'Remote Work: The Future of Employment'
          ]
        }
      },
      required: ['keyword', 'headline']
    },

    // Agent access control - Riley only
    allowedAgents: ['riley']
  }
];

export default researchTools;
