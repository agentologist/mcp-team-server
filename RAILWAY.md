# Railway Deployment Guide

## Overview

This MCP server will be deployed to Railway in the **same container** as the AI Content Generator backend. This allows the MCP server to communicate with the backend via localhost, avoiding external network calls.

## Architecture on Railway

```
Railway Container:
├── AI Content Generator Backend (Port 3001)
│   └── /api/mcp/* endpoints
└── Content Tool MCP Server (stdio)
    └── Calls localhost:3001
```

## Deployment Steps

### 1. Repository Setup

The repository is already created at: https://github.com/agentologist/content-tool-mcp

Push the code:
```bash
git remote add origin https://github.com/agentologist/content-tool-mcp.git
git add .
git commit -m "Initial commit: MCP server with AI Content Generator integration"
git push -u origin main
```

### 2. Railway Configuration

Since this will run in the same container as the AI Content Generator, you'll need to:

#### Option A: Add to Existing Procfile (Recommended for same container)

In the AI Content Generator repository, create/update `Procfile`:

```
web: node backend/server.js
mcp: node ../content-tool-mcp/dist/index.js
```

Then in `railway.json` or Railway dashboard, set the build command:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd ai-content-generator && npm install && cd ../content-tool-mcp && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "node ai-content-generator/backend/server.js"
  }
}
```

#### Option B: Separate Service (If running as separate Railway service)

If deploying as a separate Railway service:

1. Link this repository to Railway
2. Set environment variables:
   - `CONTENT_API_URL` = Internal URL of AI Content Generator service
3. Railway will use the `railway.json` configuration automatically

### 3. Environment Variables

Set these in Railway:

**For Same Container Deployment:**
- `CONTENT_API_URL=http://localhost:3001` (uses internal localhost)
- All other env vars from AI Content Generator (Gemini API key, etc.)

**For Separate Service Deployment:**
- `CONTENT_API_URL=https://your-ai-content-generator.railway.app` (uses Railway internal networking)

### 4. Internal Networking (Separate Services)

If deploying as separate services, use Railway's internal networking:

1. In Railway dashboard, go to AI Content Generator service
2. Copy the internal service URL (looks like: `servicename.railway.internal`)
3. Set `CONTENT_API_URL` to use this internal URL for faster communication

### 5. Health Check

The MCP server doesn't expose HTTP endpoints (uses stdio), so health checks should be done through the AI Content Generator backend:

```bash
curl https://your-app.railway.app/api/mcp/health
```

## Same Container Deployment (Recommended)

Since the MCP server is designed to work alongside the backend, deploying in the same container is recommended:

### Step 1: Clone both repositories in Railway build

Create a Railway build script in AI Content Generator:

**`build.sh`:**
```bash
#!/bin/bash
set -e

# Install AI Content Generator
npm install

# Clone and build MCP server (if not already in monorepo)
if [ ! -d "../content-tool-mcp" ]; then
  cd ..
  git clone https://github.com/agentologist/content-tool-mcp.git
  cd content-tool-mcp
  npm install
  npm run build
  cd ../ai-content-generator
fi
```

### Step 2: Update AI Content Generator's railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "chmod +x build.sh && ./build.sh"
  },
  "deploy": {
    "startCommand": "node backend/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 3: Environment Variables

In Railway dashboard for AI Content Generator:
- `CONTENT_API_URL=http://localhost:3001`
- `GEMINI_API_KEY=your_key`
- `DATABASE_URL=your_db_url`
- `NODE_ENV=production`
- `PORT=3001`

## Testing Deployment

### 1. Test Backend Health
```bash
curl https://your-app.railway.app/health
```

### 2. Test MCP Endpoints
```bash
curl https://your-app.railway.app/api/mcp/health
```

### 3. Test Content Generation
```bash
curl -X POST https://your-app.railway.app/api/mcp/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Benefits of meditation",
    "contentType": "blog",
    "tone": "professional",
    "length": "medium"
  }'
```

## Monorepo Structure (Alternative)

If you want to manage both in a single repository:

```
agentologist-platform/
├── ai-content-generator/
│   ├── backend/
│   ├── frontend/
│   └── package.json
├── content-tool-mcp/
│   ├── src/
│   ├── dist/
│   └── package.json
├── package.json (root)
└── railway.json
```

Root `package.json`:
```json
{
  "name": "agentologist-platform",
  "scripts": {
    "build": "cd ai-content-generator && npm install && cd ../content-tool-mcp && npm install && npm run build",
    "start": "cd ai-content-generator && npm start"
  }
}
```

## Using with Claude Desktop

Once deployed, you can still use the MCP server locally by connecting to your Railway deployment:

**`~/Library/Application Support/Claude/claude_desktop_config.json`:**
```json
{
  "mcpServers": {
    "content-tool": {
      "command": "node",
      "args": ["/path/to/content-tool-mcp/dist/index.js"],
      "env": {
        "CONTENT_API_URL": "https://your-app.railway.app"
      }
    }
  }
}
```

## Troubleshooting

### MCP Server Can't Connect to Backend

**Problem:** Connection refused when MCP tries to reach backend

**Solutions:**
- Verify `CONTENT_API_URL` is set correctly
- If same container: use `http://localhost:3001`
- If separate services: use Railway internal URL
- Check backend is running: `curl https://your-app.railway.app/health`

### Build Fails

**Problem:** TypeScript compilation errors

**Solutions:**
- Ensure all dependencies are in `package.json` (not devDependencies for production builds)
- Check Node version compatibility
- Verify `tsconfig.json` is correct

### Runtime Errors

**Problem:** Server crashes on startup

**Solutions:**
- Check Railway logs for specific errors
- Verify all environment variables are set
- Test locally first with production-like environment
- Ensure `dist/` folder is built correctly

## Next Steps

1. ✅ Push code to GitHub repository
2. Configure Railway deployment (same container recommended)
3. Set environment variables
4. Test endpoints
5. Update Claude Desktop config to use production URL if needed
