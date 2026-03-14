-- Ensure policy helper functions always read public.profiles.
-- Without explicit schema/search_path, RLS queries can fail with schema lookup errors.

create or replace function public.auth_pharmacy_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.pharmacy_id
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

create or replace function public.auth_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role::text
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;
