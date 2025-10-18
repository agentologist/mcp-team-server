/**
 * Blog Writer Tool Definition for MCP Team Server
 *
 * This tool is RESTRICTED to Casey (writing agent) only
 */

export const blogWriterTools = [
  {
    name: 'blog_writer_service',
    description: `Generates high-quality, SEO-optimized blog content using Claude Sonnet 4.5.

🎯 Key Features:
- AI-powered blog content generation with exceptional writing quality
- SEO optimization (keyword density, proper heading structure)
- Brand voice alignment and knowledge base integration
- Internal linking (2-4 contextual links)
- External linking (exactly 2 authoritative sources)
- Conversational, story-driven tone with CTAs

📊 Output:
- Complete blog article in Markdown format
- SEO-friendly with 1%+ keyword density
- Engaging narratives with actionable insights
- Professional formatting with H1, H2, H3 structure

⚠️ NOT Included (handled by separate services):
- Meta titles and descriptions → SEO Optimizer Service
- Featured images → Image Generator Service

💡 Use Cases:
- Generate comprehensive blog posts (300-5000 words)
- Create SEO-optimized content for client websites
- Produce brand-aligned articles with specific tone
- Build content with internal/external linking strategy

🔒 Access: Casey (writing agent) only

📝 Example:
{
  "content_brief": {
    "title": "10 Tips for First-Time Home Buyers",
    "focus_keyword": "first-time home buyers",
    "topic_summary": "Guide for purchasing first property",
    "word_count_target": 1500,
    "external_links": [
      {
        "url": "https://www.consumerfinance.gov/owning-a-home/",
        "page_purpose": "CFPB homebuying guide"
      }
    ]
  },
  "client_profile": {
    "brand_voice_definition": "Professional yet approachable",
    "knowledge_base": "Real estate expertise in Austin area",
    "industry_tags": ["real estate"],
    "internal_link_map": [
      {
        "url": "https://example.com/mortgage-calculator",
        "page_purpose": "Mortgage calculator tool"
      }
    ]
  }
}`,

    inputSchema: {
      type: 'object',
      properties: {
        content_brief: {
          type: 'object',
          description: 'Content specifications for the blog article (from Riley research agent)',
          properties: {
            title: {
              type: 'string',
              description: 'The blog article title',
              examples: ['10 Essential Tips for First-Time Home Buyers in 2025']
            },
            focus_keyword: {
              type: 'string',
              description: 'Primary SEO keyword to optimize for',
              examples: ['first-time home buyers', 'solar panels installation']
            },
            topic_summary: {
              type: 'string',
              description: 'Overview of the topic to be covered',
              examples: ['A comprehensive guide helping first-time home buyers navigate the complex process of purchasing their first property']
            },
            research_notes: {
              type: 'string',
              description: 'Supporting research notes and key points to include (optional)'
            },
            word_count_target: {
              type: 'number',
              description: 'Target word count for the article (300-5000 words)',
              minimum: 300,
              maximum: 5000,
              default: 1000
            },
            tone_style_suggestions: {
              type: 'string',
              description: 'Additional tone or style guidance (optional)',
              examples: ['Encouraging and empowering', 'Professional but conversational']
            },
            external_links: {
              type: 'array',
              description: 'External links to include in the article (exactly 2 recommended for SEO)',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL of the external authoritative source'
                  },
                  page_purpose: {
                    type: 'string',
                    description: 'Description of what the external page is about'
                  },
                  anchor_text_suggestion: {
                    type: 'string',
                    description: 'Suggested anchor text for the link (optional)'
                  }
                },
                required: ['url', 'page_purpose']
              }
            }
          },
          required: ['title', 'focus_keyword', 'topic_summary']
        },
        client_profile: {
          type: 'object',
          description: 'Client brand information and preferences (from Rowan orchestrator)',
          properties: {
            brand_voice_definition: {
              type: 'string',
              description: 'Description of the client\'s brand voice and personality',
              examples: ['Professional yet approachable, like a knowledgeable friend']
            },
            knowledge_base: {
              type: 'string',
              description: 'Client-specific facts, policies, services, and information (optional)'
            },
            industry_tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Industry categories the client operates in',
              examples: [['real estate', 'residential'], ['solar energy', 'home improvement']]
            },
            region_served: {
              type: 'string',
              description: 'Geographic region the client serves (optional)',
              examples: ['Austin, TX', 'Pacific Northwest']
            },
            internal_link_map: {
              type: 'array',
              description: 'Internal links to include in the article (2-4 recommended)',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL of the internal page'
                  },
                  page_purpose: {
                    type: 'string',
                    description: 'Description of what the page is about'
                  },
                  anchor_text_suggestion: {
                    type: 'string',
                    description: 'Suggested anchor text for the link (optional)'
                  }
                },
                required: ['url', 'page_purpose']
              }
            }
          },
          required: ['brand_voice_definition']
        }
      },
      required: ['content_brief', 'client_profile']
    },

    // Agent access control
    allowedAgents: ['casey'],

    // Service metadata
    serviceEndpoint: 'http://localhost:3002/api/blog/generate',
    serviceType: 'http-post'
  }
];

export default blogWriterTools;
