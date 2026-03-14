-- Step 5/11/14/15 operational additions

create extension if not exists pg_cron;

-- Realtime publication coverage
alter publication supabase_realtime add table prescriptions;
alter publication supabase_realtime add table inventory_items;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table controlled_substance_ledger;

-- Storage buckets
insert into storage.buckets (id, name, public)
values
  ('prescription-labels', 'prescription-labels', false),
  ('patient-documents', 'patient-documents', false),
  ('reports', 'reports', false),
  ('audit-exports', 'audit-exports', false),
  ('supplier-invoices', 'supplier-invoices', false)
on conflict (id) do nothing;

-- Storage object RLS policies for pharmacy-scoped paths: {pharmacy_id}/...
create policy "storage_select_same_pharmacy" on storage.objects
for select to authenticated
using (
  bucket_id in ('prescription-labels','patient-documents','reports','audit-exports','supplier-invoices')
  and (
    split_part(name, '/', 1) = auth_pharmacy_id()::text
    or auth_role() = 'superadmin'
  )
);

create policy "storage_insert_same_pharmacy" on storage.objects
for insert to authenticated
with check (
  bucket_id in ('prescription-labels','patient-documents','reports','audit-exports','supplier-invoices')
  and (
    split_part(name, '/', 1) = auth_pharmacy_id()::text
    or auth_role() = 'superadmin'
  )
);

create policy "storage_update_same_pharmacy" on storage.objects
for update to authenticated
using (
  bucket_id in ('prescription-labels','patient-documents','reports','audit-exports','supplier-invoices')
  and (
    split_part(name, '/', 1) = auth_pharmacy_id()::text
    or auth_role() = 'superadmin'
  )
)
with check (
  bucket_id in ('prescription-labels','patient-documents','reports','audit-exports','supplier-invoices')
  and (
    split_part(name, '/', 1) = auth_pharmacy_id()::text
    or auth_role() = 'superadmin'
  )
);

create policy "storage_delete_same_pharmacy_admin" on storage.objects
for delete to authenticated
using (
  bucket_id in ('prescription-labels','patient-documents','reports','audit-exports','supplier-invoices')
  and (
    (split_part(name, '/', 1) = auth_pharmacy_id()::text and auth_role() in ('admin','superadmin'))
    or auth_role() = 'superadmin'
  )
);

-- Cron job SQL wrappers (DB-native implementation for scheduled processing)
create or replace function public.inventory_reorder_check_job()
returns void language plpgsql security definer as $$
begin
  insert into notifications (pharmacy_id, type, category, subject, body, status)
  select i.pharmacy_id, 'in_app', 'low_inventory', 'Inventory reorder check',
         'Item below reorder point: ' || i.ndc, 'pending'
  from inventory_items i
  where i.quantity_on_hand <= i.reorder_point;
end;
$$;

create or replace function public.expiry_alert_job()
returns void language plpgsql security definer as $$
begin
  insert into notifications (pharmacy_id, type, category, subject, body, status)
  select i.pharmacy_id, 'in_app', 'expiry_alert', 'Expiry alert',
         'Inventory item expiring within 30 days: ' || i.ndc, 'pending'
  from inventory_items i
  where i.expiration_date is not null
    and i.expiration_date <= (current_date + interval '30 days');
end;
$$;

create or replace function public.refill_reminder_job()
returns void language plpgsql security definer as $$
begin
  insert into notifications (pharmacy_id, patient_id, type, category, subject, body, status)
  select p.pharmacy_id, p.patient_id, 'in_app', 'refill_reminder', 'Refill reminder',
         'Your refill may be due soon for Rx ' || p.rx_number, 'pending'
  from prescriptions p
  where p.status in ('ready','dispensed')
    and p.refills_remaining > 0;
end;
$$;

create or replace function public.compliance_report_job()
returns void language plpgsql security definer as $$
begin
  insert into notifications (pharmacy_id, profile_id, type, category, subject, body, status)
  select p.pharmacy_id, p.id, 'in_app', 'compliance', 'Weekly compliance summary',
         'Weekly compliance report generated.', 'pending'
  from profiles p
  where p.role in ('admin','superadmin');
end;
$$;

-- Idempotent schedules
select cron.unschedule(jobid)
from cron.job
where jobname in (
  'inventory-reorder-check',
  'expiry-alert-job',
  'refill-reminder-job',
  'compliance-report-job'
);

select cron.schedule('inventory-reorder-check', '0 6 * * *', $$select public.inventory_reorder_check_job();$$);
select cron.schedule('expiry-alert-job', '0 7 * * *', $$select public.expiry_alert_job();$$);
select cron.schedule('refill-reminder-job', '0 8 * * *', $$select public.refill_reminder_job();$$);
select cron.schedule('compliance-report-job', '0 9 * * 1', $$select public.compliance_report_job();$$);
