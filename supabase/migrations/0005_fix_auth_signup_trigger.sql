create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.profiles (id, email, first_name, last_name, role)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'first_name', 'New'),
      coalesce(new.raw_user_meta_data->>'last_name', 'User'),
      'technician'
    )
    on conflict (id) do update
    set
      email = excluded.email,
      first_name = coalesce(excluded.first_name, public.profiles.first_name),
      last_name = coalesce(excluded.last_name, public.profiles.last_name),
      role = coalesce(public.profiles.role, excluded.role),
      updated_at = now();
  exception
    when others then
      -- Never block auth signup due to profile side-effects.
      null;
  end;

  return new;
end;
$$;

