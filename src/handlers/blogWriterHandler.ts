/**
 * Blog Writer Service Handler for MCP Team Server
 *
 * Calls the blog-writer-service HTTP endpoint to generate blog content
 * Access: Casey (writing agent) only
 */

interface BlogWriterArgs {
  content_brief: {
    title: string;
    focus_keyword: string;
    topic_summary: string;
    research_notes?: string;
    word_count_target?: number;
    tone_style_suggestions?: string;
    external_links?: Array<{
      url: string;
      page_purpose: string;
      anchor_text_suggestion?: string;
    }>;
  };
  client_profile: {
    brand_voice_definition: string;
    knowledge_base?: string;
    industry_tags?: string[];
    region_served?: string;
    internal_link_map?: Array<{
      url: string;
      page_purpose: string;
      anchor_text_suggestion?: string;
    }>;
  };
}

const BLOG_WRITER_SERVICE_URL = process.env.BLOG_WRITER_SERVICE || 'http://localhost:3002';

export async function generateBlogContent(args: BlogWriterArgs): Promise<any> {
  const url = `${BLOG_WRITER_SERVICE_URL}/api/blog/generate`;

  console.log(`📝 Calling blog-writer-service for: "${args.content_brief.title}"`);
  console.log(`📝 Blog Writer URL: ${url}`);
  console.log(`📝 BLOG_WRITER_SERVICE env var: ${process.env.BLOG_WRITER_SERVICE || 'NOT SET'}`);

  try {
    // Blog writing can take 2-3 minutes for comprehensive 1500+ word content
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3-minute timeout

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Blog Writer Service error (${response.status}): ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    if (!data.blog_markdown) {
      throw new Error('Blog Writer Service returned empty content');
    }

    console.log(`✅ Blog content generated successfully (${Math.round(data.blog_markdown.split(/\s+/).length)} words)`);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            blog_markdown: data.blog_markdown,
            blog_html: data.blog_html, // TipTap-compatible HTML format
            metadata: {
              title: args.content_brief.title,
              focus_keyword: args.content_brief.focus_keyword,
              word_count: Math.round(data.blog_markdown.split(/\s+/).length),
              character_count: data.blog_markdown.length,
              html_length: data.blog_html?.length || 0,
              service: 'blog-writer-service',
              model: 'claude-sonnet-4-5-20250929'
            }
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    console.error('❌ Blog Writer Service error:', error);

    const isTimeout = error instanceof Error && error.name === 'AbortError';

    let errorMessage: string;
    let details: string;

    if (isTimeout) {
      errorMessage = 'Blog generation timed out after 3 minutes. The blog-writer-service may need optimization or the content brief may be too complex.';
      details = 'Timeout occurred while generating blog content. Consider simplifying the content brief or increasing timeout limits.';
    } else {
      errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      details = 'Failed to generate blog content. Please check that the blog-writer-service is running on port 3002.';
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            error: errorMessage,
            details: details
          }, null, 2)
        }
      ],
      isError: true
    };
  }
}
