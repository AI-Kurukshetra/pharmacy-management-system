# Production Readiness Checklist

Last updated: 2026-03-14

## Automated Verifications

Run in this order:

1. `npm run verify:prod`
2. `npm run verify:security`
3. `npm run verify:rls`

Record command output in release notes.

## Completed

- Next.js production deployment on Vercel (`pharmacy-platform-coral.vercel.app`)
- Supabase schema + migrations + RLS policies applied
- Supabase edge functions deployed
- Auth + RBAC + domain API checks passing
- CSV export and signed URL flow passing
- Webhook signature negative-path checks automated
- Baseline RLS probes automated

## Manual Operations Required (Supabase/Vercel Console)

1. Supabase PITR confirmation:
- Supabase dashboard -> Project Settings -> Database -> Point in Time Recovery = enabled.
- Capture screenshot and date in release record.

2. Connection pooling (PgBouncer) confirmation:
- Supabase dashboard -> Database settings -> Connection pooling enabled.
- App env vars using pooler/transaction endpoint where applicable.

3. Database branching strategy:
- Define production/staging branch policy in Supabase.
- Document migration promotion process and rollback owner.

4. Monitoring and alerting:
- Vercel project analytics enabled.
- Supabase alerts enabled for:
  - Edge function errors
  - DB slow queries
  - Auth anomalies
- Alert destination configured (email/Slack/PagerDuty).

## Security Evidence Pack

For each release, archive:

1. `verify:prod` output
2. `verify:security` output
3. `verify:rls` output
4. Vercel deployment URL and timestamp
5. Supabase migration revision and function deploy logs
6. PITR/pooling/alerts dashboard screenshots
