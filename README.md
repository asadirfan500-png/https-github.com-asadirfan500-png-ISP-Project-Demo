# Review Desk | 33Seconds

Pre-client creative review demo for Citroën social content. Submit a caption (and optional image/reel); the app runs four checks via Claude when `ANTHROPIC_API_KEY` is set, or a rule-based simulator otherwise.

## Local setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and paste your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Import this repo (or push to the linked GitHub remote) and deploy as a Next.js project.
2. In the Vercel project: **Settings → Environment Variables**, add:
   - `ANTHROPIC_API_KEY` — your Anthropic key (Production, Preview, and Development)
   - `ANTHROPIC_MODEL` — optional; defaults to `claude-sonnet-4-6` in code
3. **Redeploy** after saving env vars (existing deployments do not pick up new secrets until redeployed).

Do **not** prefix the key with `NEXT_PUBLIC_` — it must stay server-only for `/api/evaluate`.

### Verify Claude is connected

After deploy, open:

`https://<your-deployment>/api/evaluate/status`

You should see:

```json
{ "claudeConfigured": true, "model": "claude-sonnet-4-6" }
```

If `claudeConfigured` is `false`, the key is missing or the app was not redeployed. Reviews then return `source: "rules"` (offline simulator) instead of Claude.

## Scripts

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # run production build locally
```
