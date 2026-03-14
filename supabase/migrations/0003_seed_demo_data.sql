-- Deterministic demo data for all modules

-- Seed auth users directly (so profiles trigger can create rows)
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'f1000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'admin@pharmacy-platform.app',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Maria","last_name":"Chen"}',
    now(), now(), '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f1000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'pharmacist@pharmacy-platform.app',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Noah","last_name":"Kim"}',
    now(), now(), '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f1000000-0000-0000-0000-000000000003',
    'authenticated', 'authenticated', 'technician@pharmacy-platform.app',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Priya","last_name":"Shah"}',
    now(), now(), '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f1000000-0000-0000-0000-000000000004',
    'authenticated', 'authenticated', 'cashier@pharmacy-platform.app',
    extensions.crypt('ChangeMe123!', extensions.gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Alex","last_name":"Davis"}',
    now(), now(), '', '', ''
  )
on conflict (id) do nothing;

insert into pharmacies (id, name, address_line1, city, state, zip, phone, npi, dea_number, ncpdp_number, email, timezone)
values ('11111111-1111-1111-1111-111111111111', 'Smart Pharmacy Downtown', '100 Main St', 'New York', 'NY', '10001', '+1-212-555-1000', '1122334455', 'AB1234567', 'NCPDP001', 'ops@smartpharmacy.example', 'America/New_York')
on conflict (id) do update set name=excluded.name;

-- Ensure seeded profiles are linked and role-correct
insert into profiles (id, pharmacy_id, role, first_name, last_name, email, is_active)
values
  ('f1000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'admin', 'Maria', 'Chen', 'admin@pharmacy-platform.app', true),
  ('f1000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'pharmacist', 'Noah', 'Kim', 'pharmacist@pharmacy-platform.app', true),
  ('f1000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'technician', 'Priya', 'Shah', 'technician@pharmacy-platform.app', true),
  ('f1000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'cashier', 'Alex', 'Davis', 'cashier@pharmacy-platform.app', true)
on conflict (id) do update
set pharmacy_id=excluded.pharmacy_id, role=excluded.role, first_name=excluded.first_name, last_name=excluded.last_name, email=excluded.email;

insert into physicians (id, npi, first_name, last_name, specialty, dea_number, is_active)
values
  ('22222222-2222-2222-2222-222222222221', '9000000001', 'Amelia', 'Hart', 'Cardiology', 'AH4455667', true),
  ('22222222-2222-2222-2222-222222222222', '9000000002', 'Ravi', 'Menon', 'Internal Medicine', 'RM3344556', true)
on conflict (id) do nothing;

insert into medications (id, ndc, name, generic_name, drug_class, schedule, dosage_form, strength, route, is_active)
values
  ('33333333-3333-3333-3333-333333333331', '0002-3227', 'Atorvastatin 20mg', 'Atorvastatin', 'Statin', 'non-controlled', 'tablet', '20mg', 'oral', true),
  ('33333333-3333-3333-3333-333333333332', '5486-1120', 'Metformin 500mg', 'Metformin', 'Antidiabetic', 'non-controlled', 'tablet', '500mg', 'oral', true),
  ('33333333-3333-3333-3333-333333333333', '0054-0011', 'Lisinopril 10mg', 'Lisinopril', 'ACE inhibitor', 'non-controlled', 'tablet', '10mg', 'oral', true),
  ('33333333-3333-3333-3333-333333333334', '5931-4401', 'Apixaban 5mg', 'Apixaban', 'Anticoagulant', 'non-controlled', 'tablet', '5mg', 'oral', true)
on conflict (id) do nothing;

insert into insurance_plans (id, name, payer_id, bin_number, pcn, claim_type, is_active)
values ('44444444-4444-4444-4444-444444444441', 'Aetna Gold', 'AETNA', '004336', 'ADV', 'pharmacy', true)
on conflict (id) do nothing;

insert into suppliers (id, name, edi_capable, is_active)
values
  ('55555555-5555-5555-5555-555555555551', 'Cardinal Health', true, true),
  ('55555555-5555-5555-5555-555555555552', 'McKesson', true, true)
on conflict (id) do nothing;

insert into patients (id, pharmacy_id, mrn, first_name, last_name, date_of_birth, gender, phone, hipaa_consent)
values
  ('66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 'MRN-1001', 'Ava', 'Thompson', '1979-11-14', 'female', '+1-555-902-1140', true),
  ('66666666-6666-6666-6666-666666666662', '11111111-1111-1111-1111-111111111111', 'MRN-1002', 'Noah', 'Kim', '1968-04-03', 'male', '+1-555-245-7781', true),
  ('66666666-6666-6666-6666-666666666663', '11111111-1111-1111-1111-111111111111', 'MRN-1003', 'Olivia', 'Singh', '1990-01-27', 'female', '+1-555-190-9921', true),
  ('66666666-6666-6666-6666-666666666664', '11111111-1111-1111-1111-111111111111', 'MRN-1004', 'Liam', 'Patel', '1957-08-30', 'male', '+1-555-610-4421', true)
on conflict (id) do nothing;

insert into patient_allergies (id, patient_id, allergen, allergen_type, reaction, severity)
values
  ('c1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', 'Penicillin', 'drug', 'Rash', 'severe'),
  ('c1111111-1111-1111-1111-111111111112', '66666666-6666-6666-6666-666666666661', 'NSAIDs', 'drug', 'GI upset', 'moderate')
on conflict (id) do nothing;

insert into patient_insurance (id, patient_id, insurance_plan_id, member_id, is_primary, bin_number, pcn)
values
  ('d1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', 'AET-229001', true, '004336', 'ADV'),
  ('d1111111-1111-1111-1111-111111111112', '66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444441', 'AET-229002', true, '004336', 'ADV')
on conflict (id) do nothing;

insert into purchase_orders (id, pharmacy_id, supplier_id, po_number, status, order_date, total_amount, created_by)
values ('77777777-7777-7777-7777-777777777771', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555551', 'PO-7701', 'submitted', current_date, 3440, 'f1000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into purchase_order_items (id, purchase_order_id, medication_id, ndc, quantity_ordered, quantity_received, unit_cost)
values
  ('e1111111-1111-1111-1111-111111111111', '77777777-7777-7777-7777-777777777771', '33333333-3333-3333-3333-333333333331', '0002-3227', 200, 100, 0.42),
  ('e1111111-1111-1111-1111-111111111112', '77777777-7777-7777-7777-777777777771', '33333333-3333-3333-3333-333333333334', '5931-4401', 120, 60, 2.91)
on conflict (id) do nothing;

insert into inventory_items (id, pharmacy_id, medication_id, supplier_id, lot_number, ndc, quantity_on_hand, reorder_point, reorder_quantity, expiration_date, storage_location, is_active)
values
  ('88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '55555555-5555-5555-5555-555555555551', 'LOT-A92', '0002-3227', 54, 80, 200, '2026-05-14', 'A-02', true),
  ('88888888-8888-8888-8888-888888888882', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333332', '55555555-5555-5555-5555-555555555552', 'LOT-K11', '5486-1120', 21, 40, 120, '2026-04-01', 'B-14', true),
  ('88888888-8888-8888-8888-888888888883', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555551', 'LOT-L77', '0054-0011', 98, 50, 100, '2027-01-20', 'A-08', true),
  ('88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333334', '55555555-5555-5555-5555-555555555551', 'LOT-P55', '5931-4401', 12, 30, 90, '2026-03-30', 'CS-01', true)
on conflict (id) do nothing;

insert into prescriptions (id, pharmacy_id, patient_id, physician_id, medication_id, rx_number, status, origin, written_date, quantity_prescribed, quantity_dispensed, days_supply, refills_authorized, refills_remaining, directions, filled_by, verified_by)
values
  ('99999999-9999-9999-9999-999999999991', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333331', 'RX-10344', 'verification', 'electronic', '2026-03-14', 30, 30, 30, 3, 2, 'Take 1 tablet daily', 'f1000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000002'),
  ('99999999-9999-9999-9999-999999999992', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666662', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333332', 'RX-10345', 'filling', 'electronic', '2026-03-14', 60, null, 30, 2, 2, 'Take 1 tablet twice daily', 'f1000000-0000-0000-0000-000000000003', null),
  ('99999999-9999-9999-9999-999999999993', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666663', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'RX-10346', 'ready', 'electronic', '2026-03-13', 30, 30, 30, 1, 1, 'Take 1 tablet daily', 'f1000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000002'),
  ('99999999-9999-9999-9999-999999999994', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666664', '22222222-2222-2222-2222-222222222221', '33333333-3333-3333-3333-333333333334', 'RX-10347', 'received', 'electronic', '2026-03-14', 60, null, 30, 2, 2, 'Take 1 tablet twice daily', null, null)
on conflict (id) do nothing;

insert into claims (id, pharmacy_id, prescription_id, patient_insurance_id, claim_number, status, amount_billed, amount_approved, copay_amount, reject_codes)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999991', 'd1111111-1111-1111-1111-111111111111', 'CLM-9012', 'rejected', 124, 0, 20, '{79}'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999992', 'd1111111-1111-1111-1111-111111111112', 'CLM-9013', 'submitted', 88, null, null, null),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999993', 'd1111111-1111-1111-1111-111111111111', 'CLM-9014', 'approved', 62, 49.6, 12.4, null)
on conflict (id) do nothing;

insert into prior_authorizations (id, pharmacy_id, prescription_id, patient_id, insurance_plan_id, pa_number, status, notes)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999994', '66666666-6666-6666-6666-666666666664', '44444444-4444-4444-4444-444444444441', 'PA-4421', 'submitted', 'Awaiting payer response'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999991', '66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', 'PA-4422', 'appeal', 'Appeal packet filed')
on conflict (id) do nothing;

insert into transactions (id, pharmacy_id, prescription_id, claim_id, transaction_type, payment_method, amount, tax_amount, total_amount, status, cashier_id, receipt_number)
values
  ('f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999993', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'prescription_sale', 'credit', 12.4, 0.5, 12.9, 'completed', 'f1000000-0000-0000-0000-000000000004', 'RCP-2201'),
  ('f1111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', null, null, 'otc_sale', 'cash', 12, 1, 13, 'completed', 'f1000000-0000-0000-0000-000000000004', 'RCP-2202')
on conflict (id) do nothing;

insert into notifications (id, pharmacy_id, patient_id, profile_id, type, category, body, status)
values
  ('11112222-3333-4444-5555-666677778881', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', 'f1000000-0000-0000-0000-000000000002', 'in_app', 'rx_ready', 'RX-10346 is ready for pickup', 'pending'),
  ('11112222-3333-4444-5555-666677778882', '11111111-1111-1111-1111-111111111111', null, 'f1000000-0000-0000-0000-000000000001', 'in_app', 'low_inventory', 'Apixaban 5mg below reorder point', 'pending')
on conflict (id) do nothing;

insert into clinical_notes (id, pharmacy_id, patient_id, prescription_id, author_id, note_type, note_text)
values
  ('12121212-1212-1212-1212-121212121211', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', '99999999-9999-9999-9999-999999999991', 'f1000000-0000-0000-0000-000000000002', 'counseling', 'Reviewed statin adherence and monitoring plan.'),
  ('12121212-1212-1212-1212-121212121212', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666664', '99999999-9999-9999-9999-999999999994', 'f1000000-0000-0000-0000-000000000002', 'mtm', 'Discussed anticoagulant bleeding precautions.')
on conflict (id) do nothing;

insert into adherence_records (id, pharmacy_id, patient_id, prescription_id, expected_fill_date, actual_fill_date, days_late, pdc_contribution, is_gap)
values
  ('13131313-1313-1313-1313-131313131311', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666661', '99999999-9999-9999-9999-999999999991', '2026-03-10', '2026-03-11', 1, 0.93, false),
  ('13131313-1313-1313-1313-131313131312', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666662', '99999999-9999-9999-9999-999999999992', '2026-03-10', '2026-03-14', 4, 0.78, true)
on conflict (id) do nothing;

insert into compliance_records (id, pharmacy_id, compliance_type, regulation_code, status, due_date, assigned_to, description)
values
  ('14141414-1414-1414-1414-141414141411', '11111111-1111-1111-1111-111111111111', 'DEA', '21 CFR 1304', 'warning', '2026-03-18', 'f1000000-0000-0000-0000-000000000001', 'Weekly controlled reconciliation due'),
  ('14141414-1414-1414-1414-141414141412', '11111111-1111-1111-1111-111111111111', 'HIPAA', '164.308', 'compliant', '2026-06-01', 'f1000000-0000-0000-0000-000000000001', 'Security training complete')
on conflict (id) do nothing;

insert into inventory_transactions (id, pharmacy_id, inventory_item_id, transaction_type, quantity, quantity_before, quantity_after, reference_id, reference_type, performed_by)
values
  ('15151515-1515-1515-1515-151515151511', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888884', 'dispense', 2, 14, 12, '99999999-9999-9999-9999-999999999994', 'prescription', 'f1000000-0000-0000-0000-000000000003')
on conflict (id) do nothing;

insert into controlled_substance_ledger (id, pharmacy_id, medication_id, transaction_type, quantity, running_balance, prescription_id, performed_by, notes)
values
  ('16161616-1616-1616-1616-161616161611', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333334', 'dispense', 2, 12, '99999999-9999-9999-9999-999999999994', 'f1000000-0000-0000-0000-000000000002', 'Routine dispense')
on conflict (id) do nothing;

insert into price_schedules (id, pharmacy_id, medication_id, insurance_plan_id, price_type, price, effective_date, is_active)
values
  ('17171717-1717-1717-1717-171717171711', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333331', '44444444-4444-4444-4444-444444444441', 'insurance', 4.13, '2026-01-01', true),
  ('17171717-1717-1717-1717-171717171712', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333334', null, 'cash', 125.00, '2026-01-01', true)
on conflict (id) do nothing;

insert into lab_results (id, patient_id, pharmacy_id, test_name, result_value, result_unit, result_date, ordering_physician_id)
values ('18181818-1818-1818-1818-181818181811', '66666666-6666-6666-6666-666666666661', '11111111-1111-1111-1111-111111111111', 'LDL', '82', 'mg/dL', '2026-03-10', '22222222-2222-2222-2222-222222222221')
on conflict (id) do nothing;

insert into patient_assistance_programs (id, patient_id, medication_id, program_name, manufacturer, status)
values ('19191919-1919-1919-1919-191919191911', '66666666-6666-6666-6666-666666666664', '33333333-3333-3333-3333-333333333334', 'CoPay Assist', 'Demo Pharma', 'enrolled')
on conflict (id) do nothing;

insert into iot_sensor_readings (id, pharmacy_id, sensor_id, sensor_type, location, reading_value, unit, recorded_at)
values ('20202020-2020-2020-2020-202020202011', '11111111-1111-1111-1111-111111111111', 'COLD-1', 'temperature', 'Fridge A', 4.2, 'C', now())
on conflict (id) do nothing;

insert into audit_logs (id, pharmacy_id, actor_id, action, table_name, record_id, created_at)
values
  ('21212121-2121-2121-2121-212121212111', '11111111-1111-1111-1111-111111111111', 'f1000000-0000-0000-0000-000000000001', 'UPDATE', 'prescriptions', '99999999-9999-9999-9999-999999999991', now()),
  ('21212121-2121-2121-2121-212121212112', '11111111-1111-1111-1111-111111111111', 'f1000000-0000-0000-0000-000000000002', 'INSERT', 'claims', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', now())
on conflict (id) do nothing;
