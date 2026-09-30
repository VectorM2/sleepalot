# SleepALot — vulnerable build

A deliberately **insecure** e-commerce demo (Next.js + Supabase) used for a web
application security assignment. It intentionally contains SQL Injection, Stored
XSS, IDOR, Broken Authentication, and Security Misconfiguration.

> ⚠️ **Do not use real data and do not leave this deployed long-term.** It is
> insecure by design. Use a throwaway Supabase project and take the deployment
> down after you've captured your evidence. Its secure counterpart is
> **sleepalotharder**.

## Stack
- Next.js 14 (App Router), React
- Supabase (PostgreSQL, Auth, auto REST API)
- Deploys cleanly to Netlify or Vercel

## 1. Create the Supabase project
1. Create a new project at https://supabase.com/dashboard.
2. **SQL Editor** → run, in order:
   - `supabase/01_schema.sql`
   - `supabase/02_vulnerable_state.sql`  (disables RLS, public bucket — the insecure state)
3. **Authentication → Providers → Email** → turn **off** “Confirm email”.
4. **Project Settings → API** → copy the Project URL, the `anon` key, and the
   `service_role` key.

## 2. Seed data + test users
```bash
cd seed
cp .env.example .env      # set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm install
npm run seed              # products, reviews, orders, demo customers
node add_users.mjs        # adds vectorm@sleepalot.test and mathabela@sleepalot.test
```
All demo accounts use the password `Password123!`.
(Already seeded with the old random images? Run `supabase/04_update_images.sql`.)

## 3. Run locally
```bash
cp .env.local.example .env.local   # set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev                        # http://localhost:3000
```

## 4. Deploy (Netlify or Vercel)
1. Push this folder to a GitHub repo and import it.
2. Framework: Next.js (auto-detected). Build: `next build`.
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Make sure the Supabase project is in the vulnerable state
   (`02_vulnerable_state.sql` applied).
