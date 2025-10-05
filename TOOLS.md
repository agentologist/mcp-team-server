# MCP Tools Documentation

## Version 0.2.0

The Content Tool MCP Server now includes **15 tools** organized into three categories:

1. **Content Generation Tools** (3 tools)
2. **Keyword Research Tools** (5 tools)
3. **Topic & News Research Tools** (7 tools)

---

## Content Generation Tools

### 1. `generate_content`
Generate AI-powered content based on a prompt and content type.

**Parameters:**
- `prompt` (required): The topic or prompt for content generation
- `contentType` (required): Type of content - `blog`, `article`, `social`, `email`, `ad`, or `general`
- `tone` (optional): Tone - `professional`, `casual`, `friendly`, `formal`, or `persuasive`
- `length` (optional): Length - `short`, `medium`, or `long`

**Example:**
```json
{
  "prompt": "Benefits of meditation",
  "contentType": "blog",
  "tone": "professional",
  "length": "medium"
}
```

### 2. `refine_content`
Refine and improve existing content based on specific instructions.

**Parameters:**
- `content` (required): The content to refine
- `instructions` (required): Specific refinement instructions

**Example:**
```json
{
  "content": "Your blog post content here...",
  "instructions": "Make it more concise and add bullet points"
}
```

### 3. `analyze_content`
Analyze content for quality metrics and improvement suggestions.

**Parameters:**
- `content` (required): The content to analyze

**Returns:**
- Word count, character count, sentence count
- Paragraph count, average words per sentence
- Readability estimate
- Improvement suggestions

---

## Keyword Research Tools

### 4. `keyword_data`
Get search volume, CPC, and competition data from Keywords Everywhere API.

**Parameters:**
- `keywords` (required): Array of keywords to research
- `country` (optional): Country code (e.g., 'US', 'UK', 'CA'). Default: 'US'
- `apiKey` (required): Keywords Everywhere API key

**Example:**
```json
{
  "keywords": ["AI content generation", "SEO tools", "keyword research"],
  "country": "US",
  "apiKey": "your_api_key_here"
}
```

**Returns:**
```json
{
  "success": true,
  "keywords": [
    {
      "keyword": "AI content generation",
      "vol": 2400,
      "cpc": 3.50,
      "competition": 0.65,
      "trend": [...]
    }
  ]
}
```

### 5. `related_keywords`
Find related keywords, questions, and variations for a seed keyword.

**Parameters:**
- `keyword` (required): The seed keyword
- `country` (optional): Country code. Default: 'US'
- `limit` (optional): Maximum results. Default: 100
- `apiKey` (required): Keywords Everywhere API key

**Example:**
```json
{
  "keyword": "content marketing",
  "country": "US",
  "limit": 50,
  "apiKey": "your_api_key_here"
}
```

**Returns:**
- Seed keyword data
- Related keywords with volume/CPC
- Question keywords
- Total results count

### 6. `enhanced_keyword_research`
Comprehensive AI-powered keyword research combining Keywords Everywhere data with AI-generated semantic variations.

**Parameters:**
- `seedKeyword` (required): The seed keyword to expand from
- `country` (optional): Country code. Default: 'US'
- `options` (optional): Research options object
  - `includeAiGenerated` (boolean): Include AI-generated keywords
  - `includeLongTail` (boolean): Include long-tail variations
  - `includeQuestions` (boolean): Include question keywords
  - `includeCommercial` (boolean): Include commercial intent keywords
  - `maxResults` (number): Maximum results
- `apiKey` (required): Keywords Everywhere API key

**Example:**
```json
{
  "seedKeyword": "AI and WordPress",
  "country": "US",
  "options": {
    "includeAiGenerated": true,
    "includeLongTail": true,
    "includeQuestions": true,
    "maxResults": 200
  },
  "apiKey": "your_api_key_here"
}
```

**Returns:**
- AI-generated keyword variations
- Related keywords with volume data
- Long-tail keywords
- Question keywords
- Commercial keywords
- Topic clusters
- Research insights (opportunities, content gaps, recommended topics)

### 7. `categorize_keywords`
Categorize keywords by search intent.

**Parameters:**
- `keywords` (required): Array of keywords to categorize

**Returns:**
Keywords grouped by intent:
- `informational`: Learning/research queries
- `navigational`: Brand/website queries
- `transactional`: Purchase intent
- `commercial`: Product research

**Example:**
```json
{
  "keywords": [
    "what is SEO",
    "buy SEO tools",
    "Ahrefs login",
    "best SEO software"
  ]
}
```

### 8. `cluster_keywords`
Group keywords into topic clusters for content strategy.

**Parameters:**
- `keywords` (required): Array of keywords to cluster

**Returns:**
Keywords organized by topic clusters (e.g., "Getting Started", "Advanced Techniques", "Tools & Resources")

**Example:**
```json
{
  "keywords": [
    "SEO basics",
    "advanced SEO techniques",
    "SEO tools",
    "link building strategies"
  ]
}
```

---

## Topic & News Research Tools

### 9. `search_news`
Search Google News for recent articles using AI-powered grounding.

**Parameters:**
- `query` (required): The search query or topic

**Example:**
```json
{
  "query": "artificial intelligence trends 2024"
}
```

**Returns:**
- Overall summary
- Top 3-5 recent articles with title, link, and snippet
- Grounding sources

### 10. `deep_research_topic`
Perform deep research on a specific article or topic.

**Parameters:**
- `title` (required): The article title or topic
- `link` (required): URL of the article
- `snippet` (optional): Brief description

**Example:**
```json
{
  "title": "The Future of AI in Content Creation",
  "link": "https://example.com/article",
  "snippet": "AI is transforming how we create content..."
}
```

**Returns:**
- Executive summary
- Search intent analysis
- Key findings
- Related topics
- Content recommendations
- SEO opportunities

### 11. `analyze_viral_potential`
Analyze an article's potential to go viral.

**Parameters:**
- `article` (required): Article object with:
  - `title` (required)
  - `link` (optional)
  - `snippet` (optional)

**Example:**
```json
{
  "article": {
    "title": "10 AI Tools That Will Change Your Life",
    "link": "https://example.com/article",
    "snippet": "Discover the most innovative AI tools..."
  }
}
```

**Returns:**
- Engagement score (0-100)
- Sentiment analysis
- Key takeaways
- Potential angles for viral content

### 12. `trending_questions`
Generate trending questions and headline ideas for a topic.

**Parameters:**
- `topic` (required): The focus keyword or topic

**Example:**
```json
{
  "topic": "AI content marketing"
}
```

**Returns:**
Array of 15 trending headline ideas covering various formats (how-to, listicles, comparisons, etc.)

### 13. `research_headline`
Research and validate a headline idea with market analysis.

**Parameters:**
- `headline` (required): The headline to research

**Example:**
```json
{
  "headline": "How AI is Revolutionizing Content Creation in 2024"
}
```

**Returns:**
- Topic validation & market analysis
- Current landscape analysis
- Content angle opportunities
- Competitive analysis
- Content structure recommendations
- SEO optimization tips

### 14. `enhanced_topic_search`
Perform enhanced topic search with trend analysis and grounding sources.

**Parameters:**
- `query` (required): The search query

**Example:**
```json
{
  "query": "AI chatbots for customer service"
}
```

**Returns:**
- Articles with grounding sources
- Trend analysis (score, direction, reasoning)
- Content opportunities
- Related topics
- Competitive landscape

### 15. `website_context`
Generate concise summaries of website pages from URLs.

**Parameters:**
- `urls` (required): Array of URLs to analyze

**Example:**
```json
{
  "urls": [
    "https://example.com/about",
    "https://example.com/services",
    "https://example.com/blog/post-1"
  ]
}
```

**Returns:**
Context summaries for each URL (useful for internal linking and content planning)

---

## Usage Examples

### In Claude Desktop

Once the MCP server is configured, you can use these tools naturally:

**Keyword Research:**
```
Use the enhanced_keyword_research tool to find keywords related to "AI content writing"
with my Keywords Everywhere API key: sk_xxx123
```

**News Research:**
```
Use the search_news tool to find recent articles about "GPT-4 applications"
```

**Content Strategy:**
```
Use the trending_questions tool to generate headline ideas for "email marketing automation"
```

**Viral Analysis:**
```
Use the analyze_viral_potential tool to assess this article:
Title: "5 AI Tools Every Marketer Needs"
Link: https://example.com/article
```

### Tool Combinations

You can chain tools for comprehensive research:

1. `search_news` → Find recent articles on a topic
2. `deep_research_topic` → Deep dive on the most relevant article
3. `trending_questions` → Generate headline ideas based on the research
4. `enhanced_keyword_research` → Find keywords for the headlines
5. `generate_content` → Create the blog post
6. `analyze_content` → Review and refine

---

## API Key Requirements

### Keywords Everywhere API Key

Required for these tools:
- `keyword_data`
- `related_keywords`
- `enhanced_keyword_research`

**Get your API key:**
1. Sign up at https://keywordseverywhere.com
2. Purchase credits
3. Get your API key from the dashboard
4. Pass it as the `apiKey` parameter

### Gemini API Key

Required for:
- All other tools (configured in the AI Content Generator backend)

The Gemini API key is managed by the AI Content Generator backend - you don't need to pass it with each request.

---

## Error Handling

All tools return errors in this format:

```json
{
  "content": [{
    "type": "text",
    "text": "Error: [error message]"
  }]
}
```

Common errors:
- **Keywords Everywhere**: Invalid API key, out of credits, rate limit exceeded
- **Network**: Connection timeout, backend not running
- **Validation**: Missing required parameters

---

## Performance Notes

- **Keywords Everywhere tools**: ~2-5 seconds (depends on keyword count)
- **Enhanced keyword research**: ~10-30 seconds (AI + API calls)
- **News search**: ~5-10 seconds (Google Search grounding)
- **Deep research**: ~15-30 seconds (comprehensive analysis)
- **Content generation**: ~30-60 seconds (depends on length)

---

## Version History

### 0.2.0 (Current)
- Added 12 new research tools
- Keyword research integration (Keywords Everywhere)
- AI-enhanced keyword expansion
- News & topic research tools
- Viral potential analysis
- Headline research and validation

### 0.1.0
- Initial release
- 3 content generation tools

---

## Support

For issues or questions:
- GitHub: https://github.com/agentologist/content-tool-mcp/issues
- Documentation: README.md, INTEGRATION.md, RAILWAY.md
