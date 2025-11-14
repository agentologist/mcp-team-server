/**
 * Social Post Writer Service Handler for MCP Team Server
 *
 * Calls the social-post-writer-service HTTP endpoint to generate social media posts
 * Access: Casey (writing agent) only
 */

interface SocialPostWriterArgs {
  source: {
    blog_id?: string;
    blog_url?: string;
    title: string;
    summary?: string;
    key_points?: string[];
    canonical_url?: string;
  };
  profiles: Array<{
    platform: 'linkedin' | 'x' | 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'threads';
    profile_id: string;
    handle: string;
    voice?: string;
    goals?: string[];
    max_posts?: number;
  }>;
  constraints?: {
    include_utm?: boolean;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    hashbank?: string[];
    lang?: string;
    style_overrides?: string | null;
  };
  review?: {
    status?: 'draft' | 'approved' | 'rejected';
    created_by_agent?: string;
  };
}

const SOCIAL_POST_WRITER_SERVICE_URL = process.env.SOCIAL_POST_WRITER_SERVICE || 'http://localhost:3004';
const SOCIAL_POST_WRITER_TIMEOUT_MS = parseInt(process.env.SOCIAL_POST_WRITER_TIMEOUT_MS || '120000', 10); // 2 minutes

export async function generateSocialPosts(args: SocialPostWriterArgs): Promise<any> {
  const url = `${SOCIAL_POST_WRITER_SERVICE_URL}/api/social/generate`;

  console.log(`📱 Calling social-post-writer-service for: "${args.source.title}"`);
  console.log(`📱 Social Post Writer URL: ${url}`);
  console.log(`📱 Generating posts for ${args.profiles.length} profile(s)`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SOCIAL_POST_WRITER_TIMEOUT_MS);

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
      throw new Error(`Social Post Writer Service error (${response.status}): ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    if (!data.assets || data.assets.length === 0) {
      throw new Error('Social Post Writer Service returned no posts');
    }

    console.log(`✅ Generated ${data.assets.length} social post(s) across ${data.stats.profiles_processed} profile(s)`);
    if (data.stats.deduped_variants > 0) {
      console.log(`   Removed ${data.stats.deduped_variants} duplicate variant(s)`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: true,
            job_id: data.job_id,
            source_blog_id: data.source_blog_id,
            assets: data.assets,
            stats: data.stats,
            service: 'social-post-writer-service'
          }, null, 2)
        }
      ]
    };

  } catch (error) {
    console.error('❌ Social Post Writer Service error:', error);

    const isTimeout = error instanceof Error && error.name === 'AbortError';
    const timeoutSeconds = Math.round(SOCIAL_POST_WRITER_TIMEOUT_MS / 1000);

    let errorMessage: string;
    let details: string;

    if (isTimeout) {
      errorMessage = `Social post generation timed out after ${timeoutSeconds} seconds. The social-post-writer-service may be unavailable.`;
      details = `Timeout occurred while generating social posts (limit ${SOCIAL_POST_WRITER_TIMEOUT_MS}ms). Check service status.`;
    } else {
      errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      details = 'Failed to generate social posts. Please check that the social-post-writer-service is running on port 3004.';
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
