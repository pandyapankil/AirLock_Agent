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

## Setup

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Environment Variables

Create a `.env.local` file with:

```env
# Auth0 (Token Vault)
AUTH0_SECRET=your-secret-at-least-32-chars
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Z.ai GLM API (for intent parsing)
OPENAI_API_KEY=your-zai-api-key

# Google OAuth (for real actions)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Local Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

## Deployment to Google Cloud Run

1. **Build and push Docker image:**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/airlock-agent
   ```

2. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy airlock-agent \
     --image gcr.io/PROJECT_ID/airlock-agent \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars AUTH0_SECRET=...,AUTH0_BASE_URL=...,etc
   ```

Or use the provided `Dockerfile` with your preferred CI/CD.

## Architecture

- `src/` - Main Next.js landing page
- `airlock-agent/app/` - Agent API routes and demo UI
  - `api/intent/` - Parses AI action requests (uses Z.ai GLM)
  - `api/consent/` - Handles user approval/denial
  - `api/action-log/` - Logs all actions
  - `dashboard/` - View action history
  - `simulate/` - Try the consent flow

## Tech Stack

- **Next.js 16** - Web framework
- **Auth0** - Token Vault for secure OAuth token storage
- **Z.ai GLM API** - Intent parsing
- **Google APIs** - Calendar, Gmail integration
- **Google Cloud Run** - Deployment target
