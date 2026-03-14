# Supabase Setup Notes

1. Enable Email/Password auth provider.
2. Set JWT expiry to 3600s and enable refresh token rotation.
3. Enable email confirmation for new users.
4. Enable Realtime for: prescriptions, inventory_items, notifications, controlled_substance_ledger.
5. Create private buckets:
   - prescription-labels
   - patient-documents
   - reports
   - audit-exports
   - supplier-invoices
6. Apply migration SQL from `migrations/0001_initial_schema.sql`.
7. Configure pg_cron schedules:
   - inventory-reorder-check: daily 06:00 UTC
   - expiry-alert-job: daily 07:00 UTC
   - refill-reminder-job: daily 08:00 UTC
   - compliance-report-job: Monday 09:00 UTC
