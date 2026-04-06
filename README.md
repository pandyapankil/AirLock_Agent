# Airlock Agent

A secure intermediary architecture for local-first AI agents that performs authenticated external actions (email, calendar, CRM) on behalf of users with explicit consent.

## What It Does

Airlock solves a critical problem: AI agents need access to your accounts (email, calendar, CRM) to be useful, but giving them your credentials is risky.

**Instead of giving the AI your credentials:**
1. Connect your accounts via OAuth (Google, Microsoft, etc.)
2. Auth0 Token Vault securely stores your access tokens
3. When the AI wants to do something (send email, create calendar event), it asks Airlock
4. Airlock shows you exactly what the AI wants to do and asks for permission
5. Only after you approve does Airlock execute the action using your stored tokens

## Key Features

- **Token Vault Integration** - OAuth tokens stored securely in Auth0, never touch the AI directly
- **Explicit Consent** - Every action requires user approval before execution
- **Scoped Access** - Fine-grained OAuth scope control limits what the agent can do
- **Action Logging** - Full visibility into all actions the agent attempts

## Demo

The demo simulates an AI agent requesting actions without needing real OAuth setup:
- Try the "Simulate" page to see consent flow in action
- View the dashboard to see action history

## Setup

```bash
bun install
bun dev
```

Open [http://localhost:8788](http://localhost:8788) to view.

## Environment Variables

Create a `.env.local` file with:

```env
# Auth0
AUTH0_SECRET=your-secret-at-least-32-chars
AUTH0_BASE_URL=http://localhost:8788
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# OpenAI (for intent parsing)
OPENAI_API_KEY=sk-...

# Google OAuth (for real actions)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Architecture

- `src/` - Main Next.js landing page
- `airlock-agent/app/` - Agent API routes and demo UI
  - `api/intent/` - Parses AI action requests
  - `api/consent/` - Handles user approval/denial
  - `api/action-log/` - Logs all actions
  - `dashboard/` - View action history
  - `simulate/` - Try the consent flow

## Deployment

Deploy to Cloudflare Pages:
```bash
bun run build
```

Built for the Auth0 "Authorized to Act" Hackathon.