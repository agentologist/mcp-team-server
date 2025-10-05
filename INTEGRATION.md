# MCP Server Integration with AI Content Generator

## Overview

The Content Tool MCP Server now integrates with the AI Content Generator backend to provide real AI-powered content generation through the Model Context Protocol.

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Claude Desktop │  MCP    │  Content Tool    │  HTTP   │  AI Content      │
│                 │────────>│  MCP Server      │────────>│  Generator       │
│                 │         │  (Port: stdio)   │         │  Backend         │
└─────────────────┘         └──────────────────┘         │  (Port: 3001)    │
                                                           │                  │
                                                           │  ┌────────────┐  │
                                                           │  │  Gemini    │  │
                                                           │  │  AI API    │  │
                                                           │  └────────────┘  │
                                                           └──────────────────┘
```

## Components

### 1. MCP Server (content tool mcp/)
- **Location**: `/Users/grantgould/Vibe Coding/Agentologist/content tool mcp/`
- **Purpose**: Exposes content generation tools via MCP
- **Tools Provided**:
  - `generate_content` - Generate new content
  - `refine_content` - Refine existing content
  - `analyze_content` - Analyze content quality

### 2. Backend API Routes (ai-content-generator/backend/routes/mcp.js)
- **New Routes Added**:
  - `POST /api/mcp/generate` - Content generation endpoint
  - `POST /api/mcp/refine` - Content refinement endpoint
  - `POST /api/mcp/analyze` - Content analysis endpoint
  - `GET /api/mcp/health` - Health check endpoint

### 3. API Client (content tool mcp/src/api-client.ts)
- **Purpose**: HTTP client for communicating with AI Content Generator backend
- **Features**:
  - Type-safe request/response handling
  - Error handling with detailed messages
  - 60-second timeout for AI generation
  - Health check support

## Setup Steps

### Step 1: Start AI Content Generator Backend

```bash
cd /Users/grantgould/Vibe\ Coding/Agentologist/ai-content-generator
npm run backend:dev
```

This will start the backend on `http://localhost:3001`

**Important**: Make sure you have:
- A valid Gemini API key configured in the AI Content Generator
- Database connection (or it will use mock mode for development)

### Step 2: Build MCP Server

```bash
cd /Users/grantgould/Vibe\ Coding/Agentologist/content\ tool\ mcp
npm install
npm run build
```

### Step 3: Configure Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "content-tool": {
      "command": "node",
      "args": ["/Users/grantgould/Vibe Coding/Agentologist/content tool mcp/dist/index.js"],
      "env": {
        "CONTENT_API_URL": "http://localhost:3001"
      }
    }
  }
}
```

### Step 4: Restart Claude Desktop

Restart Claude Desktop to load the MCP server.

## Testing

### 1. Test Backend Health

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "database": "connected"
}
```

### 2. Test MCP Endpoint

```bash
curl http://localhost:3001/api/mcp/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "mcp-content-generation",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ"
}
```

### 3. Test Content Generation

```bash
curl -X POST http://localhost:3001/api/mcp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Benefits of meditation",
    "contentType": "blog",
    "tone": "professional",
    "length": "medium"
  }'
```

### 4. Test Content Analysis

```bash
curl -X POST http://localhost:3001/api/mcp/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a sample blog post about AI and machine learning. It explores the benefits and challenges of implementing AI solutions in modern businesses."
  }'
```

## Usage in Claude Desktop

Once configured, you can use the MCP tools in Claude Desktop:

**Generate Content:**
```
Use the generate_content tool to create a blog post about "The Future of AI"
with a professional tone and medium length.
```

**Refine Content:**
```
Use the refine_content tool to make this content more concise:
[paste your content]
```

**Analyze Content:**
```
Use the analyze_content tool to analyze this blog post:
[paste your content]
```

## Troubleshooting

### MCP Server Can't Connect to Backend

**Problem**: `Content generation failed: connect ECONNREFUSED`

**Solutions**:
1. Make sure AI Content Generator backend is running on port 3001
2. Check `.env` file has correct `CONTENT_API_URL`
3. Verify backend is healthy: `curl http://localhost:3001/health`

### Gemini API Key Not Found

**Problem**: `Gemini API key not configured`

**Solutions**:
1. Log into AI Content Generator web interface
2. Go to Admin Settings
3. Add your Gemini API key
4. Or set `GEMINI_API_KEY` environment variable in ai-content-generator/.env

### MCP Server Not Showing in Claude Desktop

**Problem**: Tools don't appear in Claude Desktop

**Solutions**:
1. Verify config path: `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Check JSON syntax is valid
3. Verify file paths in config are absolute and correct
4. Restart Claude Desktop completely
5. Check Claude Desktop logs for errors

### Content Generation Times Out

**Problem**: Requests timeout after 60 seconds

**Solutions**:
1. Check Gemini API is responding
2. Verify API key has sufficient quota
3. Try shorter/simpler prompts
4. Check backend logs for errors

## Development

### Watch Mode for MCP Server

```bash
cd /Users/grantgould/Vibe\ Coding/Agentologist/content\ tool\ mcp
npm run watch
```

### Backend Development Mode

```bash
cd /Users/grantgould/Vibe\ Coding/Agentologist/ai-content-generator
npm run backend:dev
```

This uses `node --watch` to automatically restart on file changes.

### Full Stack Development

Terminal 1 - Backend:
```bash
cd /Users/grantgould/Vibe\ Coding/Agentologist/ai-content-generator
npm run backend:dev
```

Terminal 2 - MCP Server Development:
```bash
cd /Users/grantgould/Vibe\ Coding/Agentologist/content\ tool\ mcp
npm run watch
```

## Files Modified/Created

### New Files
1. `content tool mcp/src/api-client.ts` - HTTP client
2. `content tool mcp/.env` - Environment configuration
3. `ai-content-generator/backend/routes/mcp.js` - MCP API routes
4. `content tool mcp/INTEGRATION.md` - This file

### Modified Files
1. `content tool mcp/src/index.ts` - Updated to use API client
2. `content tool mcp/README.md` - Updated documentation
3. `content tool mcp/.env.example` - Updated example config
4. `content tool mcp/package.json` - Added axios and dotenv dependencies
5. `ai-content-generator/backend/server.js` - Added MCP routes

## Security Notes

1. **API Keys**: The MCP server doesn't handle API keys directly - they're managed by the AI Content Generator backend
2. **Authentication**: MCP routes are currently public (no auth token required) - consider adding authentication in production
3. **CORS**: Backend has CORS configured for localhost ports by default
4. **Environment Variables**: Keep `.env` file out of version control

## Next Steps

1. ✅ Integration complete and ready for testing
2. Start both servers (backend and MCP)
3. Configure Claude Desktop
4. Test content generation tools
5. Consider adding:
   - Rate limiting for MCP endpoints
   - Authentication for MCP routes
   - Caching for frequently requested content
   - Metrics and logging
   - Production deployment configuration
