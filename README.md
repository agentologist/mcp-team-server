# Content Tool MCP Server

[![Build Status](https://github.com/agentologist/content-tool-mcp/workflows/Build%20and%20Test/badge.svg)](https://github.com/agentologist/content-tool-mcp/actions)

AI Content Generator MCP (Model Context Protocol) Server for Agentologist.

> **Note**: This MCP server integrates with the [AI Content Generator](https://github.com/agentologist/ai-content-generator) backend to provide AI-powered content generation through Claude Desktop.

## Overview

This MCP server provides AI-powered content generation tools that can be used by AI agents through the Model Context Protocol. It exposes three main tools:

1. **generate_content** - Generate new content based on prompts
2. **refine_content** - Refine and improve existing content
3. **analyze_content** - Analyze content for quality and suggestions

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

### Available Tools

#### 1. generate_content

Generate AI-powered content based on a prompt and content type.

**Parameters:**
- `prompt` (required): The topic or prompt for content generation
- `contentType` (required): Type of content - `blog`, `article`, `social`, `email`, `ad`, or `general`
- `tone` (optional): Tone of content - `professional`, `casual`, `friendly`, `formal`, or `persuasive`
- `length` (optional): Length - `short`, `medium`, or `long`

#### 2. refine_content

Refine and improve existing content based on specific instructions.

**Parameters:**
- `content` (required): The content to refine
- `instructions` (required): Specific refinement instructions

#### 3. analyze_content

Analyze content for tone, readability, and get improvement suggestions.

**Parameters:**
- `content` (required): The content to analyze

## Configuration

### Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "content-tool": {
      "command": "node",
      "args": ["/path/to/agentologist/content tool mcp/dist/index.js"]
    }
  }
}
```

### AI Service Integration

This MCP server connects to the **AI Content Generator** backend application to provide real AI-powered content generation.

**Prerequisites:**
1. The AI Content Generator app must be running on `http://localhost:3001` (or your configured URL)
2. The AI Content Generator backend must have a valid Gemini API key configured

**Configuration:**

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your AI Content Generator backend URL:
   ```
   CONTENT_API_URL=http://localhost:3001
   ```

3. Make sure the AI Content Generator backend is running:
   ```bash
   cd ../ai-content-generator
   npm run backend:dev
   ```

## Project Structure

```
content tool mcp/
├── src/
│   ├── index.ts          # Main MCP server implementation
│   └── api-client.ts     # HTTP client for AI Content Generator API
├── dist/                 # Compiled JavaScript output
├── .env                  # Environment configuration (create from .env.example)
├── .env.example          # Example environment configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env to set CONTENT_API_URL if different from default
```

### 4. Start the AI Content Generator Backend
Make sure the AI Content Generator backend is running:
```bash
cd ../ai-content-generator
npm run backend:dev
```

### 5. Add MCP Server to Claude Desktop Config
Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

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

### 6. Restart Claude Desktop
Restart Claude Desktop to load the MCP server.

## Testing

You can test the MCP server locally:

```bash
npm run dev
```

Or test individual components:

```bash
# Test the API health endpoint
curl http://localhost:3001/api/mcp/health
```

## Deployment

See [RAILWAY.md](RAILWAY.md) for Railway deployment instructions.

For local development and integration details, see [INTEGRATION.md](INTEGRATION.md).

## Repository

- **GitHub**: https://github.com/agentologist/content-tool-mcp
- **Related**: [AI Content Generator](https://github.com/agentologist/ai-content-generator)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For issues and questions:
- GitHub Issues: https://github.com/agentologist/content-tool-mcp/issues
- Documentation: See [README.md](README.md), [INTEGRATION.md](INTEGRATION.md), and [RAILWAY.md](RAILWAY.md)
