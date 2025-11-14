/**
 * Social Post Writer Tool Definition for MCP Team Server
 *
 * This tool is RESTRICTED to Casey (writing agent) only
 */

export const socialPostWriterTools = [
  {
    name: 'generate_social_posts',
    description: `Generates platform-aware social media posts to promote blog content.

🎯 Key Features:
- Platform-specific post generation (LinkedIn, X, Facebook, Instagram, TikTok, YouTube, Threads)
- Up to 5 unique variants per social profile
- UTM parameter tracking for analytics
- Automatic variant deduplication
- Brand voice alignment and customization
- Hashtag optimization per platform

📊 Output:
- Multiple post variants per platform (1-5 posts each)
- Platform-optimized content (character limits, hashtag counts)
- UTM-tracked links for campaign analytics
- Readability metrics and metadata

⚙️ Platform-Specific Rules:
- LinkedIn: 120-300 words, professional, 1-3 hashtags
- X/Twitter: ≤280 chars, punchy, 0-2 hashtags
- Facebook: 40-80 words, friendly, 1-3 hashtags
- Instagram: 80-150 words, visual-first, 4-8 hashtags
- TikTok: 100-150 chars, energetic, 3-5 hashtags
- YouTube: 50-200 words, 1-2 paragraphs, 1-3 hashtags
- Threads: 40-100 words, conversational, 1-3 hashtags

🔒 Access: Casey (writing agent) only

📝 Example:
{
  "source": {
    "blog_id": "b_123",
    "title": "How to Ship MCP Tools",
    "summary": "A guide to wiring tools through an MCP server",
    "key_points": ["Expose JSON schemas", "Use SSE for agents"],
    "canonical_url": "https://example.com/blog/how-to-ship-mcp-tools"
  },
  "profiles": [
    {
      "platform": "linkedin",
      "profile_id": "lnk_001",
      "handle": "acme-dev",
      "voice": "helpful, technical, no hype",
      "goals": ["drive clicks", "position expertise"],
      "max_posts": 3
    }
  ],
  "constraints": {
    "include_utm": true,
    "utm_source": "social",
    "utm_medium": "organic",
    "utm_campaign": "blog-promo",
    "hashbank": ["#MCP", "#DevTools", "#LLMops"]
  }
}`,

    inputSchema: {
      type: 'object',
      properties: {
        source: {
          type: 'object',
          description: 'Blog post content to promote via social media',
          properties: {
            blog_id: {
              type: 'string',
              description: 'Unique identifier for the blog post'
            },
            blog_url: {
              type: 'string',
              description: 'URL of the blog post'
            },
            title: {
              type: 'string',
              description: 'Title of the blog post'
            },
            summary: {
              type: 'string',
              description: 'Brief summary of the blog content'
            },
            key_points: {
              type: 'array',
              items: { type: 'string' },
              description: 'Key takeaways or points from the blog'
            },
            canonical_url: {
              type: 'string',
              description: 'Canonical URL for UTM tracking'
            }
          },
          required: ['title']
        },
        profiles: {
          type: 'array',
          description: 'Social media profiles to generate posts for',
          items: {
            type: 'object',
            properties: {
              platform: {
                enum: ['linkedin', 'x', 'facebook', 'instagram', 'tiktok', 'youtube', 'threads'],
                description: 'Social media platform'
              },
              profile_id: {
                type: 'string',
                description: 'Unique identifier for the social profile'
              },
              handle: {
                type: 'string',
                description: 'Social media handle (without @)'
              },
              voice: {
                type: 'string',
                description: 'Voice/tone for this profile',
                examples: ['helpful, technical, no hype', 'friendly, enthusiastic']
              },
              goals: {
                type: 'array',
                items: { type: 'string' },
                description: 'Goals for this profile',
                examples: [['drive clicks', 'position expertise'], ['increase engagement']]
              },
              max_posts: {
                type: 'integer',
                minimum: 1,
                maximum: 5,
                default: 3,
                description: 'Maximum number of post variants to generate'
              }
            },
            required: ['platform', 'profile_id', 'handle']
          },
          minItems: 1
        },
        constraints: {
          type: 'object',
          description: 'Optional constraints for post generation',
          properties: {
            include_utm: {
              type: 'boolean',
              default: true,
              description: 'Whether to append UTM parameters to links'
            },
            utm_source: {
              type: 'string',
              default: 'social',
              description: 'UTM source parameter'
            },
            utm_medium: {
              type: 'string',
              default: 'organic',
              description: 'UTM medium parameter'
            },
            utm_campaign: {
              type: 'string',
              description: 'UTM campaign parameter'
            },
            hashbank: {
              type: 'array',
              items: { type: 'string' },
              description: 'Hashtag bank to choose from'
            },
            lang: {
              type: 'string',
              default: 'en-US',
              description: 'Language code'
            },
            style_overrides: {
              type: ['string', 'null'],
              description: 'Additional style guidance or overrides'
            }
          }
        },
        review: {
          type: 'object',
          description: 'Review metadata',
          properties: {
            status: {
              enum: ['draft', 'approved', 'rejected'],
              default: 'draft',
              description: 'Initial review status'
            },
            created_by_agent: {
              type: 'string',
              default: 'casey',
              description: 'Name of the agent creating these posts'
            }
          }
        }
      },
      required: ['source', 'profiles']
    },

    // Agent access control
    allowedAgents: ['casey'],

    // Service metadata
    serviceEndpoint: 'http://localhost:3004/api/social/generate',
    serviceType: 'http-post'
  }
];

export default socialPostWriterTools;
