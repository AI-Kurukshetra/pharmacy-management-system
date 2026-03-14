-- Extensions
create extension if not exists pgcrypto;

-- 1. pharmacies
create table if not exists pharmacies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  zip text not null,
  phone text not null,
  fax text,
  npi text not null unique,
  dea_number text not null unique,
  ncpdp_number text unique,
  email text,
  is_active boolean not null default true,
  parent_id uuid references pharmacies(id),
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pharmacy_id uuid references pharmacies(id),
  role text not null check (role in ('superadmin','admin','pharmacist','technician','cashier','readonly')),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  license_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. physicians
create table if not exists physicians (
  id uuid primary key default gen_random_uuid(),
  npi text not null unique,
  first_name text not null,
  last_name text not null,
  specialty text,
  dea_number text unique,
  phone text,
  fax text,
  address_line1 text,
  city text,
  state text,
  zip text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. medications
create table if not exists medications (
  id uuid primary key default gen_random_uuid(),
  ndc text not null unique,
  name text not null,
  generic_name text,
  brand_name text,
  manufacturer text,
  drug_class text,
  schedule text check (schedule in ('II','III','IV','V','non-controlled')),
  dosage_form text,
  strength text,
  unit_of_measure text,
  route text,
  requires_refrigeration boolean default false,
  is_hazardous boolean default false,
  fdb_id text,
  requires_prior_auth boolean default false,
  is_specialty boolean default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. drug_interactions
create table if not exists drug_interactions (
  id uuid primary key default gen_random_uuid(),
  medication_id_a uuid not null references medications(id),
  medication_id_b uuid not null references medications(id),
  severity text not null check (severity in ('contraindicated','major','moderate','minor')),
  description text not null,
  clinical_effect text,
  management text,
  fdb_interaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint no_self_interaction check (medication_id_a <> medication_id_b)
);

-- 6. drug_disease_interactions
create table if not exists drug_disease_interactions (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references medications(id),
  icd10_code text not null,
  severity text not null check (severity in ('contraindicated','major','moderate','minor')),
  description text not null,
  management text,
  created_at timestamptz not null default now()
);

-- 7. patients
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  mrn text unique,
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  gender text check (gender in ('male','female','other','unknown')),
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  zip text,
  preferred_language text default 'en',
  hipaa_consent boolean not null default false,
  hipaa_consent_date timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. insurance_plans
create table if not exists insurance_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  payer_id text not null,
  bin_number text not null,
  pcn text,
  phone text,
  claim_type text check (claim_type in ('pharmacy','medical')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. patient_allergies
create table if not exists patient_allergies (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  allergen text not null,
  allergen_type text check (allergen_type in ('drug','food','environmental','other')),
  reaction text,
  severity text check (severity in ('mild','moderate','severe','unknown')),
  noted_date date,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 9. patient_insurance
create table if not exists patient_insurance (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  insurance_plan_id uuid references insurance_plans(id),
  bin_number text,
  pcn text,
  group_number text,
  member_id text not null,
  cardholder_name text,
  relationship text check (relationship in ('self','spouse','child','other')),
  effective_date date,
  termination_date date,
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 11. suppliers
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dea_number text,
  contact_name text,
  phone text,
  email text,
  address_line1 text,
  city text,
  state text,
  zip text,
  edi_capable boolean default false,
  account_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. purchase_orders + purchase_order_items
create table if not exists purchase_orders (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  supplier_id uuid not null references suppliers(id),
  po_number text not null unique,
  status text not null check (status in ('draft','submitted','acknowledged','partial','received','cancelled')),
  order_date date not null,
  expected_date date,
  received_date date,
  total_amount numeric(12,2),
  edi_transaction_id text,
  notes text,
  created_by uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  medication_id uuid not null references medications(id),
  ndc text not null,
  quantity_ordered numeric(12,3) not null,
  quantity_received numeric(12,3) not null default 0,
  unit_cost numeric(10,4),
  extended_cost numeric(12,4),
  lot_number text,
  expiration_date date,
  created_at timestamptz not null default now()
);

-- 13. inventory_items
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  medication_id uuid not null references medications(id),
  supplier_id uuid references suppliers(id),
  lot_number text,
  ndc text not null,
  quantity_on_hand numeric(12,3) not null default 0,
  quantity_reserved numeric(12,3) not null default 0,
  reorder_point numeric(12,3) not null default 0,
  reorder_quantity numeric(12,3) not null default 0,
  expiration_date date,
  acquisition_cost numeric(10,4),
  awp numeric(10,4),
  storage_location text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pharmacy_id, medication_id, lot_number)
);

-- 14. inventory_transactions
create table if not exists inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  inventory_item_id uuid not null references inventory_items(id),
  transaction_type text not null check (transaction_type in ('receive','dispense','return','adjustment','transfer','waste','recall')),
  quantity numeric(12,3) not null,
  quantity_before numeric(12,3) not null,
  quantity_after numeric(12,3) not null,
  reference_id uuid,
  reference_type text,
  unit_cost numeric(10,4),
  notes text,
  performed_by uuid not null references profiles(id),
  created_at timestamptz not null default now()
);

-- 15. controlled_substance_ledger
create table if not exists controlled_substance_ledger (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  medication_id uuid not null references medications(id),
  transaction_type text not null check (transaction_type in ('receive','dispense','return','waste','theft','loss','adjustment')),
  quantity numeric(12,3) not null,
  running_balance numeric(12,3) not null,
  prescription_id uuid,
  purchase_order_id uuid references purchase_orders(id),
  witnessed_by uuid references profiles(id),
  performed_by uuid not null references profiles(id),
  dea_form_number text,
  notes text,
  created_at timestamptz not null default now()
);

-- 16. price_schedules
create table if not exists price_schedules (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  medication_id uuid not null references medications(id),
  insurance_plan_id uuid references insurance_plans(id),
  price_type text not null check (price_type in ('cash','insurance','contract','awp_plus','mac')),
  price numeric(10,4) not null,
  effective_date date not null,
  expiration_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 17. prescriptions
create table if not exists prescriptions (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  patient_id uuid not null references patients(id),
  physician_id uuid not null references physicians(id),
  medication_id uuid not null references medications(id),
  rx_number text not null,
  status text not null check (status in ('received','on_hold','filling','verification','ready','dispensed','cancelled','transferred','returned')),
  origin text not null check (origin in ('written','electronic','phone','fax','transfer')),
  surescripts_id text,
  written_date date not null,
  fill_date date,
  dispense_date timestamptz,
  quantity_prescribed numeric(10,3) not null,
  quantity_dispensed numeric(10,3),
  days_supply integer not null,
  refills_authorized integer not null default 0,
  refills_remaining integer not null default 0,
  directions text not null,
  daw_code integer default 0,
  diagnosis_code text,
  notes text,
  is_controlled boolean not null default false,
  void_reason text,
  filled_by uuid references profiles(id),
  verified_by uuid references profiles(id),
  dispensed_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 18. prescription_refills
create table if not exists prescription_refills (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references prescriptions(id),
  refill_number integer not null,
  status text not null check (status in ('requested','approved','filled','dispensed','denied')),
  requested_at timestamptz not null default now(),
  filled_at timestamptz,
  dispensed_at timestamptz,
  quantity_dispensed numeric(10,3),
  days_supply integer,
  filled_by uuid references profiles(id),
  verified_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 19. prescription_labels
create table if not exists prescription_labels (
  id uuid primary key default gen_random_uuid(),
  prescription_id uuid not null references prescriptions(id),
  refill_id uuid references prescription_refills(id),
  label_data jsonb not null,
  storage_path text,
  printed_at timestamptz,
  printed_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 20. claims
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  prescription_id uuid not null references prescriptions(id),
  patient_insurance_id uuid not null references patient_insurance(id),
  claim_number text unique,
  status text not null check (status in ('pending','submitted','approved','rejected','reversed','resubmitted')),
  submission_date timestamptz,
  response_date timestamptz,
  amount_billed numeric(10,2),
  amount_approved numeric(10,2),
  copay_amount numeric(10,2),
  plan_pays numeric(10,2),
  patient_pays numeric(10,2),
  reject_codes text[],
  ncpdp_transaction jsonb,
  adjudication_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 21. prior_authorizations
create table if not exists prior_authorizations (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  prescription_id uuid not null references prescriptions(id),
  patient_id uuid not null references patients(id),
  insurance_plan_id uuid not null references insurance_plans(id),
  pa_number text,
  status text not null check (status in ('initiated','submitted','approved','denied','appeal','expired')),
  initiated_date timestamptz not null default now(),
  decision_date timestamptz,
  expiration_date date,
  denial_reason text,
  appeal_deadline date,
  notes text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 22. transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  prescription_id uuid references prescriptions(id),
  claim_id uuid references claims(id),
  transaction_type text not null check (transaction_type in ('prescription_sale','otc_sale','refund','copay','payment')),
  payment_method text check (payment_method in ('cash','credit','debit','insurance','check','other')),
  stripe_payment_id text,
  amount numeric(10,2) not null,
  tax_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null,
  status text not null check (status in ('pending','completed','refunded','failed')),
  cashier_id uuid references profiles(id),
  receipt_number text unique,
  created_at timestamptz not null default now()
);

-- 23. notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  patient_id uuid references patients(id),
  profile_id uuid references profiles(id),
  type text not null check (type in ('sms','email','in_app','push')),
  category text not null check (category in ('rx_ready','refill_reminder','refill_request','low_inventory','expiry_alert','compliance','general')),
  subject text,
  body text not null,
  status text not null check (status in ('pending','sent','delivered','failed','read')),
  twilio_sid text,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- 24. clinical_notes
create table if not exists clinical_notes (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  patient_id uuid not null references patients(id),
  prescription_id uuid references prescriptions(id),
  author_id uuid not null references profiles(id),
  note_type text check (note_type in ('counseling','mtm','adherence','clinical','followup')),
  note_text text not null,
  is_private boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 25. adherence_records
create table if not exists adherence_records (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  patient_id uuid not null references patients(id),
  prescription_id uuid not null references prescriptions(id),
  expected_fill_date date not null,
  actual_fill_date date,
  days_late integer,
  pdc_contribution numeric(5,4),
  is_gap boolean default false,
  created_at timestamptz not null default now()
);

-- 26. lab_results
create table if not exists lab_results (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  pharmacy_id uuid not null references pharmacies(id),
  test_name text not null,
  result_value text,
  result_unit text,
  reference_range text,
  result_date date not null,
  ordering_physician_id uuid references physicians(id),
  created_at timestamptz not null default now()
);

-- 27. patient_assistance_programs
create table if not exists patient_assistance_programs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id),
  medication_id uuid not null references medications(id),
  program_name text not null,
  manufacturer text,
  enrollment_date date,
  expiration_date date,
  copay_limit numeric(10,2),
  status text check (status in ('enrolled','pending','expired','denied')),
  created_at timestamptz not null default now()
);

-- 28. compliance_records
create table if not exists compliance_records (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  compliance_type text not null check (compliance_type in ('DEA','FDA','state','HIPAA','NABP')),
  regulation_code text,
  status text not null check (status in ('compliant','warning','violation','pending')),
  description text,
  due_date date,
  resolved_date date,
  assigned_to uuid references profiles(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 29. iot_sensor_readings
create table if not exists iot_sensor_readings (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references pharmacies(id),
  sensor_id text not null,
  sensor_type text check (sensor_type in ('temperature','humidity')),
  location text,
  reading_value numeric(8,3) not null,
  unit text,
  is_alert boolean default false,
  alert_threshold numeric(8,3),
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- 30. audit_logs
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid references pharmacies(id),
  actor_id uuid references profiles(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- 31. functions
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create or replace function deduct_inventory(
  p_inventory_item_id uuid,
  p_quantity numeric,
  p_prescription_id uuid,
  p_performed_by uuid
) returns void language plpgsql as $$
declare
  v_before numeric;
  v_after numeric;
begin
  select quantity_on_hand into v_before from inventory_items where id = p_inventory_item_id for update;
  if v_before < p_quantity then
    raise exception 'Insufficient inventory';
  end if;

  v_after := v_before - p_quantity;

  update inventory_items
  set quantity_on_hand = v_after, updated_at = now()
  where id = p_inventory_item_id;

  insert into inventory_transactions (
    pharmacy_id, inventory_item_id, transaction_type, quantity, quantity_before, quantity_after, reference_id, reference_type, performed_by
  )
  select pharmacy_id, p_inventory_item_id, 'dispense', p_quantity, v_before, v_after, p_prescription_id, 'prescription', p_performed_by
  from inventory_items where id = p_inventory_item_id;
end; $$;

create or replace function write_audit_log()
returns trigger language plpgsql security definer as $$
begin
  insert into audit_logs (pharmacy_id, actor_id, action, table_name, record_id, old_values, new_values)
  values (
    coalesce(new.pharmacy_id, old.pharmacy_id),
    auth.uid(),
    tg_op,
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op = 'DELETE' then row_to_json(old)::jsonb else null end,
    case when tg_op in ('INSERT','UPDATE') then row_to_json(new)::jsonb else null end
  );

  return coalesce(new, old);
end; $$;

create or replace function auth_pharmacy_id() returns uuid language sql stable as $$
  select pharmacy_id from profiles where id = auth.uid();
$$;

create or replace function auth_role() returns text language sql stable as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, first_name, last_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', 'New'),
    coalesce(new.raw_user_meta_data->>'last_name', 'User'),
    'technician'
  );
  return new;
end; $$;

-- Optional helper used by inventory module action
create or replace function adjust_inventory(
  inventory_item_id uuid,
  quantity_delta numeric,
  reason text
) returns void language plpgsql security definer as $$
declare
  current_qty numeric;
  after_qty numeric;
  current_pharmacy uuid;
begin
  select quantity_on_hand, pharmacy_id into current_qty, current_pharmacy
  from inventory_items
  where id = inventory_item_id
  for update;

  after_qty := current_qty + quantity_delta;

  update inventory_items
  set quantity_on_hand = after_qty,
      updated_at = now()
  where id = inventory_item_id;

  insert into inventory_transactions (
    pharmacy_id,
    inventory_item_id,
    transaction_type,
    quantity,
    quantity_before,
    quantity_after,
    reference_type,
    notes,
    performed_by
  ) values (
    current_pharmacy,
    inventory_item_id,
    'adjustment',
    quantity_delta,
    current_qty,
    after_qty,
    'manual',
    reason,
    auth.uid()
  );
end; $$;

-- 32. triggers
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();

create trigger prescriptions_audit after insert or update or delete on prescriptions
for each row execute procedure write_audit_log();
create trigger inventory_items_audit after insert or update or delete on inventory_items
for each row execute procedure write_audit_log();
create trigger controlled_substance_ledger_audit after insert or update or delete on controlled_substance_ledger
for each row execute procedure write_audit_log();
create trigger claims_audit after insert or update or delete on claims
for each row execute procedure write_audit_log();
create trigger patients_audit after insert or update or delete on patients
for each row execute procedure write_audit_log();
create trigger prior_authorizations_audit after insert or update or delete on prior_authorizations
for each row execute procedure write_audit_log();

create trigger trg_profiles_updated_at before update on profiles for each row execute procedure update_updated_at();
create trigger trg_pharmacies_updated_at before update on pharmacies for each row execute procedure update_updated_at();
create trigger trg_patients_updated_at before update on patients for each row execute procedure update_updated_at();
create trigger trg_patient_insurance_updated_at before update on patient_insurance for each row execute procedure update_updated_at();
create trigger trg_physicians_updated_at before update on physicians for each row execute procedure update_updated_at();
create trigger trg_medications_updated_at before update on medications for each row execute procedure update_updated_at();
create trigger trg_drug_interactions_updated_at before update on drug_interactions for each row execute procedure update_updated_at();
create trigger trg_inventory_items_updated_at before update on inventory_items for each row execute procedure update_updated_at();
create trigger trg_suppliers_updated_at before update on suppliers for each row execute procedure update_updated_at();
create trigger trg_purchase_orders_updated_at before update on purchase_orders for each row execute procedure update_updated_at();
create trigger trg_insurance_plans_updated_at before update on insurance_plans for each row execute procedure update_updated_at();
create trigger trg_claims_updated_at before update on claims for each row execute procedure update_updated_at();
create trigger trg_prior_auth_updated_at before update on prior_authorizations for each row execute procedure update_updated_at();
create trigger trg_clinical_notes_updated_at before update on clinical_notes for each row execute procedure update_updated_at();
create trigger trg_price_schedules_updated_at before update on price_schedules for each row execute procedure update_updated_at();
create trigger trg_compliance_records_updated_at before update on compliance_records for each row execute procedure update_updated_at();
create trigger trg_prescriptions_updated_at before update on prescriptions for each row execute procedure update_updated_at();

-- 33. indexes
create index if not exists idx_profiles_pharmacy_id on profiles(pharmacy_id);
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_pharmacies_parent_id on pharmacies(parent_id);
create index if not exists idx_pharmacies_npi on pharmacies(npi);
create index if not exists idx_patients_pharmacy_id on patients(pharmacy_id);
create index if not exists idx_patients_last_name on patients(last_name);
create index if not exists idx_patients_date_of_birth on patients(date_of_birth);
create index if not exists idx_patient_allergies_patient_id on patient_allergies(patient_id);
create index if not exists idx_patient_insurance_patient_id on patient_insurance(patient_id);
create index if not exists idx_physicians_npi on physicians(npi);
create index if not exists idx_physicians_last_name on physicians(last_name);
create index if not exists idx_medications_ndc on medications(ndc);
create index if not exists idx_medications_name on medications(name);
create index if not exists idx_medications_drug_class on medications(drug_class);
create index if not exists idx_medications_schedule on medications(schedule);
create index if not exists idx_drug_interactions_med_a on drug_interactions(medication_id_a);
create index if not exists idx_drug_interactions_med_b on drug_interactions(medication_id_b);
create index if not exists idx_drug_disease_med_id on drug_disease_interactions(medication_id);
create unique index if not exists idx_prescriptions_rx_number on prescriptions(rx_number);
create index if not exists idx_prescriptions_pharmacy_id on prescriptions(pharmacy_id);
create index if not exists idx_prescriptions_patient_id on prescriptions(patient_id);
create index if not exists idx_prescriptions_status on prescriptions(status);
create index if not exists idx_prescriptions_fill_date on prescriptions(fill_date);
create index if not exists idx_prescriptions_is_controlled on prescriptions(is_controlled);
create index if not exists idx_refills_prescription_id on prescription_refills(prescription_id);
create index if not exists idx_inventory_pharmacy_id on inventory_items(pharmacy_id);
create index if not exists idx_inventory_medication_id on inventory_items(medication_id);
create index if not exists idx_inventory_expiration_date on inventory_items(expiration_date);
create index if not exists idx_inventory_quantity_on_hand on inventory_items(quantity_on_hand);
create index if not exists idx_inv_tx_pharmacy_id on inventory_transactions(pharmacy_id);
create index if not exists idx_inv_tx_inventory_item_id on inventory_transactions(inventory_item_id);
create index if not exists idx_inv_tx_created_at on inventory_transactions(created_at);
create index if not exists idx_cs_ledger_pharmacy_id on controlled_substance_ledger(pharmacy_id);
create index if not exists idx_cs_ledger_medication_id on controlled_substance_ledger(medication_id);
create index if not exists idx_cs_ledger_created_at on controlled_substance_ledger(created_at);
create index if not exists idx_po_pharmacy_id on purchase_orders(pharmacy_id);
create index if not exists idx_po_supplier_id on purchase_orders(supplier_id);
create index if not exists idx_po_status on purchase_orders(status);
create index if not exists idx_insurance_plans_bin_number on insurance_plans(bin_number);
create index if not exists idx_claims_pharmacy_id on claims(pharmacy_id);
create index if not exists idx_claims_prescription_id on claims(prescription_id);
create index if not exists idx_claims_status on claims(status);
create index if not exists idx_claims_submission_date on claims(submission_date);
create index if not exists idx_pa_pharmacy_id on prior_authorizations(pharmacy_id);
create index if not exists idx_pa_prescription_id on prior_authorizations(prescription_id);
create index if not exists idx_pa_status on prior_authorizations(status);
create index if not exists idx_transactions_pharmacy_id on transactions(pharmacy_id);
create index if not exists idx_transactions_created_at on transactions(created_at);
create index if not exists idx_transactions_prescription_id on transactions(prescription_id);
create index if not exists idx_notifications_pharmacy_id on notifications(pharmacy_id);
create index if not exists idx_notifications_patient_id on notifications(patient_id);
create index if not exists idx_notifications_status on notifications(status);
create index if not exists idx_notifications_created_at on notifications(created_at);
create index if not exists idx_clinical_notes_patient_id on clinical_notes(patient_id);
create index if not exists idx_clinical_notes_pharmacy_id on clinical_notes(pharmacy_id);
create index if not exists idx_adherence_patient_id on adherence_records(patient_id);
create index if not exists idx_adherence_prescription_id on adherence_records(prescription_id);
create index if not exists idx_price_schedules_pharmacy_medication on price_schedules(pharmacy_id, medication_id);
create index if not exists idx_iot_pharmacy_id on iot_sensor_readings(pharmacy_id);
create index if not exists idx_iot_recorded_at on iot_sensor_readings(recorded_at);
create index if not exists idx_audit_pharmacy_id on audit_logs(pharmacy_id);
create index if not exists idx_audit_actor_id on audit_logs(actor_id);
create index if not exists idx_audit_table_name on audit_logs(table_name);
create index if not exists idx_audit_created_at on audit_logs(created_at);
create index if not exists idx_audit_record_id on audit_logs(record_id);
create index if not exists idx_compliance_pharmacy_id on compliance_records(pharmacy_id);
create index if not exists idx_compliance_type on compliance_records(compliance_type);
create index if not exists idx_compliance_status on compliance_records(status);

-- 34. RLS + policies
alter table pharmacies enable row level security;
alter table profiles enable row level security;
alter table physicians enable row level security;
alter table medications enable row level security;
alter table drug_interactions enable row level security;
alter table drug_disease_interactions enable row level security;
alter table patients enable row level security;
alter table patient_allergies enable row level security;
alter table patient_insurance enable row level security;
alter table insurance_plans enable row level security;
alter table suppliers enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_items enable row level security;
alter table inventory_items enable row level security;
alter table inventory_transactions enable row level security;
alter table controlled_substance_ledger enable row level security;
alter table price_schedules enable row level security;
alter table prescriptions enable row level security;
alter table prescription_refills enable row level security;
alter table prescription_labels enable row level security;
alter table claims enable row level security;
alter table prior_authorizations enable row level security;
alter table transactions enable row level security;
alter table notifications enable row level security;
alter table clinical_notes enable row level security;
alter table adherence_records enable row level security;
alter table lab_results enable row level security;
alter table patient_assistance_programs enable row level security;
alter table compliance_records enable row level security;
alter table iot_sensor_readings enable row level security;
alter table audit_logs enable row level security;

-- Generic pharmacy policy pattern on key pharmacy-scoped tables
create policy pharmacy_select_patients on patients for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_patients on patients for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_patients on patients for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_patients on patients for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_prescriptions on prescriptions for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_prescriptions on prescriptions for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_prescriptions on prescriptions for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_prescriptions on prescriptions for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_inventory_items on inventory_items for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_inventory_items on inventory_items for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_inventory_items on inventory_items for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_inventory_items on inventory_items for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_claims on claims for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_claims on claims for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_claims on claims for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_claims on claims for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_notifications on notifications for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_notifications on notifications for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_notifications on notifications for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_notifications on notifications for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

-- Sensitive table overrides
create policy audit_logs_select on audit_logs for select using (auth_role() in ('admin','superadmin'));

create policy cs_ledger_select on controlled_substance_ledger
for select using (
  auth_role() in ('pharmacist','admin','superadmin')
  and (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
);

create policy profiles_self_select on profiles for select using (id = auth.uid());
create policy profiles_self_update on profiles for update using (id = auth.uid());
create policy profiles_admin_select on profiles for select using (
  auth_role() = 'superadmin' or
  (auth_role() = 'admin' and pharmacy_id = auth_pharmacy_id())
);
create policy profiles_admin_update on profiles for update using (
  auth_role() = 'superadmin' or
  (auth_role() = 'admin' and pharmacy_id = auth_pharmacy_id())
);

create policy pharmacies_superadmin_all on pharmacies
for all using (auth_role() = 'superadmin') with check (auth_role() = 'superadmin');
create policy pharmacies_admin_select on pharmacies
for select using (auth_role() = 'admin' and id = auth_pharmacy_id());

create policy clinical_notes_select on clinical_notes
for select using (
  (is_private = false and (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin'))
  or author_id = auth.uid()
  or auth_role() in ('admin','superadmin')
);

-- No update/delete on audit/ledger
revoke update, delete on audit_logs from authenticated;
revoke update, delete on controlled_substance_ledger from authenticated;
