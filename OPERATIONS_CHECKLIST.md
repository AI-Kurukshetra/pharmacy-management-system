# Operations Checklist (Plan Step 16/15)

## Completed
- Vercel production deploy configured and live.
- Supabase project linked and migrations applied.
- Edge Functions deployed.
- Basic security headers configured in `next.config.ts`.
- API contract verification script available: `npm run verify:prod`.

## Manual/Platform Tasks Still Required
- Enable Supabase PITR in project settings.
- Confirm PgBouncer mode and connection pooling settings.
- Configure Supabase staging branch workflow and branch protections.
- Configure Vercel Analytics + Supabase logs alerts.
- Configure incident alert routing for Edge Function failures.
- Verify Stripe webhook secret rotation process.
- Verify Surescripts signing key rotation and audit procedures.

## Validation Commands
- `npm run lint`
- `npx next build --webpack`
- `npm run verify:prod`
- `npx supabase db push`
- `bash scripts/deploy-functions.sh`
- `npx vercel --prod --yes`

