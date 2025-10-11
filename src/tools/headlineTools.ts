/**
 * Trend Headlines Tool Definition for MCP Team Server
 */

export const headlineTools = [
  {
    name: 'trend_headlines',
    description: `Generates up to 15 trending blog headline ideas containing a focus keyword by analyzing real-world trending data.

🎯 Key Features:
- Aggregates trending data from Google News, GDELT, Reddit, and Google Trends
- AI-synthesized headlines using Gemini
- Includes influential people/organizations related to the topic
- Headlines are creative, blog-style, and contain the exact focus keyword

📊 Data Sources:
- Google News RSS: Global news titles
- GDELT Document API: Influential persons and organizations
- Reddit: Conversational phrasing and community discussions
- Google Trends: Rising related queries

📝 Output Includes:
- 15 creative, blog-style headlines (each containing the focus keyword)
- Up to 10 influential people/organizations related to the topic
- All headlines are synthesized to be fresh, topical, and engaging

💡 Use Cases:
- Generate headline ideas after keyword selection
- Find trending angles for blog content
- Identify key influencers in a topic area
- Discover what's currently being discussed about a topic
- Create engaging, timely content titles

📋 Example:
Input: { "focusKeyword": "eco travel" }
Output: {
  "focusKeyword": "eco travel",
  "influencers": ["Greta Thunberg", "Airbnb", "National Geographic"],
  "headlines": [
    "How Greta Thunberg Made Eco Travel Mainstream in 2025",
    "Eco Travel Destinations You Can Visit Sustainably This Year",
    "Why Airbnb Is Betting Big on Eco Travel Experiences"
  ]
}`,

    inputSchema: {
      type: 'object',
      properties: {
        focusKeyword: {
          type: 'string',
          description: 'The keyword to build trending headlines around. Each headline will contain this exact phrase.',
          examples: [
            'eco travel',
            'home staging',
            'solar panels',
            'real estate investing',
            'content marketing'
          ]
        }
      },
      required: ['focusKeyword']
    }
  }
];

export default headlineTools;
