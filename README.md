# Airlock Agent

AI agent with consent-based access control for executing privileged actions.

## Prerequisites

- Node.js 18+
- Bun (or npm/yarn/pnpm)

## Setup

```bash
bun install
bun dev
```

Open [http://localhost:8788](http://localhost:8788) to view the demo.

## Environment Variables

Create a `.env.local` file with:

```env
AUTH0_SECRET=your-secret
AUTH0_BASE_URL=http://localhost:8788
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Architecture

- `src/` - Main Next.js app
- `airlock-agent/` - Agent API routes and utilities

## Deployment

Deploy to Cloudflare Pages with `bun run build`.