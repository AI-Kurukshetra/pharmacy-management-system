# Production Deployment (Step 16)

## 1. Prerequisites

1. Install/auth CLIs:
`npx supabase login`
`npx vercel login`

2. Prepare local env:
`cp .env.local.example .env.local`

3. Validate env values:
`npm run deploy:check`

## 2. Supabase (Production Project)

1. Link project:
`npx supabase link --project-ref <YOUR_SUPABASE_PROJECT_REF>`

2. Push DB schema:
`npm run supabase:db:push`

3. Deploy edge functions (in required order):
`npm run supabase:functions:deploy`

4. Post-deploy dashboard actions:
- Enable PITR.
- Configure PgBouncer transaction pooling.
- Create staging branch.
- Enable Realtime on `prescriptions`, `inventory_items`, `notifications`, `controlled_substance_ledger`.
- Create storage buckets from `supabase/README.md`.

## 3. Vercel

1. Link project:
`npx vercel link`

2. Set production env vars in Vercel project settings.

3. Deploy production:
`npm run deploy:vercel:prod`

4. Post-deploy:
- Configure custom domain + HTTPS.
- Enable Vercel Analytics.
- Configure alerts for edge-function failures and slow DB queries.

## 4. One-command sequence (after CLI login + project linking)

`npm run deploy:prod`
