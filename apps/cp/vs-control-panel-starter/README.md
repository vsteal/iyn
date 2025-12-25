
# VS Control Panel (Starter)

A minimal Control Panel for VS/IYN using Next.js (App Router) + Supabase.

## What’s included
- Supabase Auth (email/password) login + signup
- Notes (rich HTML via contenteditable) stored in Postgres
- Web Links CRUD
- Dashboard cards (counts) and placeholders
- Controls (stub): log "agent runs" and view history
- Form Report (stub): view submissions and totals
- API route: `/api/agent-run` to create `agent_runs` rows

## Quickstart

1. Install deps
```bash
npm install
```

2. Env vars (Vercel → Settings → Environment Variables)
```
NEXT_PUBLIC_SITE_URL=YOUR_VERCEL_URL
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

3. Supabase SQL (run in Supabase SQL editor)
See `supabase-schema.sql`

4. Dev
```bash
npm run dev
```
Open http://localhost:3000

## Pages
- `/` → Login / Signup
- `/dashboard` → Dashboard + Notes, Web Links, Controls, Form Report

## Notes
- This is intentionally minimal. You can swap the Notes editor for TipTap/Plate later.
- Protecting routes is currently client-checked. For stronger SSR protection, add middleware using Supabase server client.
- The "contacts" count is a placeholder; add a `contacts` table or wire to your CRM API.
