#!/usr/bin/env node
/* global process, console */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRole, { auth: { autoRefreshToken: false, persistSession: false } });

const IDS = {
  pharmacy: "11111111-1111-1111-1111-111111111111",
  physicians: [
    "22222222-2222-2222-2222-222222222221",
    "22222222-2222-2222-2222-222222222222",
  ],
  medications: [
    "33333333-3333-3333-3333-333333333331",
    "33333333-3333-3333-3333-333333333332",
    "33333333-3333-3333-3333-333333333333",
    "33333333-3333-3333-3333-333333333334",
  ],
  insurance: ["44444444-4444-4444-4444-444444444441"],
  suppliers: ["55555555-5555-5555-5555-555555555551", "55555555-5555-5555-5555-555555555552"],
  patients: [
    "66666666-6666-6666-6666-666666666661",
    "66666666-6666-6666-6666-666666666662",
    "66666666-6666-6666-6666-666666666663",
    "66666666-6666-6666-6666-666666666664",
  ],
  po: "77777777-7777-7777-7777-777777777771",
  inventory: [
    "88888888-8888-8888-8888-888888888881",
    "88888888-8888-8888-8888-888888888882",
    "88888888-8888-8888-8888-888888888883",
    "88888888-8888-8888-8888-888888888884",
  ],
  prescriptions: [
    "99999999-9999-9999-9999-999999999991",
    "99999999-9999-9999-9999-999999999992",
    "99999999-9999-9999-9999-999999999993",
    "99999999-9999-9999-9999-999999999994",
  ],
  claims: [
    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
  ],
  pas: ["bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"],
};

const users = [
  { email: "admin@pharmacy-platform.app", password: "ChangeMe123!", role: "admin", first: "Maria", last: "Chen" },
  { email: "pharmacist@pharmacy-platform.app", password: "ChangeMe123!", role: "pharmacist", first: "Noah", last: "Kim" },
  { email: "technician@pharmacy-platform.app", password: "ChangeMe123!", role: "technician", first: "Priya", last: "Shah" },
  { email: "cashier@pharmacy-platform.app", password: "ChangeMe123!", role: "cashier", first: "Alex", last: "Davis" },
];

async function getOrCreateUser(u) {
  const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const found = list.data.users.find((x) => x.email?.toLowerCase() === u.email.toLowerCase());
  if (found) return found.id;

  const created = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { first_name: u.first, last_name: u.last },
  });

  if (created.error) { console.error("createUser failed", u.email, created.error); throw created.error; }
  return created.data.user.id;
}

async function upsert(table, values, onConflict = "id") {
  const { error } = await supabase.from(table).upsert(values, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
}

async function seed() {
  const userIds = {};
  for (const u of users) userIds[u.role] = await getOrCreateUser(u);

  await upsert("pharmacies", [{
    id: IDS.pharmacy,
    name: "Smart Pharmacy Downtown",
    address_line1: "100 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
    phone: "+1-212-555-1000",
    npi: "1122334455",
    dea_number: "AB1234567",
    ncpdp_number: "NCPDP001",
    email: "ops@smartpharmacy.example",
    timezone: "America/New_York",
  }]);

  await upsert("profiles", users.map((u) => ({
    id: userIds[u.role],
    pharmacy_id: IDS.pharmacy,
    role: u.role,
    first_name: u.first,
    last_name: u.last,
    email: u.email,
    is_active: true,
  })));

  await upsert("physicians", [
    { id: IDS.physicians[0], npi: "9000000001", first_name: "Amelia", last_name: "Hart", specialty: "Cardiology", dea_number: "AH4455667", is_active: true },
    { id: IDS.physicians[1], npi: "9000000002", first_name: "Ravi", last_name: "Menon", specialty: "Internal Medicine", dea_number: "RM3344556", is_active: true },
  ]);

  await upsert("medications", [
    { id: IDS.medications[0], ndc: "0002-3227", name: "Atorvastatin 20mg", generic_name: "Atorvastatin", drug_class: "Statin", schedule: "non-controlled", dosage_form: "tablet", strength: "20mg", route: "oral", is_active: true },
    { id: IDS.medications[1], ndc: "5486-1120", name: "Metformin 500mg", generic_name: "Metformin", drug_class: "Antidiabetic", schedule: "non-controlled", dosage_form: "tablet", strength: "500mg", route: "oral", is_active: true },
    { id: IDS.medications[2], ndc: "0054-0011", name: "Lisinopril 10mg", generic_name: "Lisinopril", drug_class: "ACE inhibitor", schedule: "non-controlled", dosage_form: "tablet", strength: "10mg", route: "oral", is_active: true },
    { id: IDS.medications[3], ndc: "5931-4401", name: "Apixaban 5mg", generic_name: "Apixaban", drug_class: "Anticoagulant", schedule: "non-controlled", dosage_form: "tablet", strength: "5mg", route: "oral", is_active: true },
  ], "ndc");

  await upsert("insurance_plans", [{ id: IDS.insurance[0], name: "Aetna Gold", payer_id: "AETNA", bin_number: "004336", pcn: "ADV", claim_type: "pharmacy", is_active: true }]);

  await upsert("suppliers", [
    { id: IDS.suppliers[0], name: "Cardinal Health", edi_capable: true, is_active: true },
    { id: IDS.suppliers[1], name: "McKesson", edi_capable: true, is_active: true },
  ]);

  await upsert("patients", [
    { id: IDS.patients[0], pharmacy_id: IDS.pharmacy, mrn: "MRN-1001", first_name: "Ava", last_name: "Thompson", date_of_birth: "1979-11-14", gender: "female", phone: "+1-555-902-1140", hipaa_consent: true },
    { id: IDS.patients[1], pharmacy_id: IDS.pharmacy, mrn: "MRN-1002", first_name: "Noah", last_name: "Kim", date_of_birth: "1968-04-03", gender: "male", phone: "+1-555-245-7781", hipaa_consent: true },
    { id: IDS.patients[2], pharmacy_id: IDS.pharmacy, mrn: "MRN-1003", first_name: "Olivia", last_name: "Singh", date_of_birth: "1990-01-27", gender: "female", phone: "+1-555-190-9921", hipaa_consent: true },
    { id: IDS.patients[3], pharmacy_id: IDS.pharmacy, mrn: "MRN-1004", first_name: "Liam", last_name: "Patel", date_of_birth: "1957-08-30", gender: "male", phone: "+1-555-610-4421", hipaa_consent: true },
  ], "mrn");

  await upsert("patient_allergies", [
    { id: "c1111111-1111-1111-1111-111111111111", patient_id: IDS.patients[0], allergen: "Penicillin", allergen_type: "drug", severity: "severe", reaction: "Rash" },
    { id: "c1111111-1111-1111-1111-111111111112", patient_id: IDS.patients[0], allergen: "NSAIDs", allergen_type: "drug", severity: "moderate", reaction: "GI upset" },
  ]);

  await upsert("patient_insurance", [
    { id: "d1111111-1111-1111-1111-111111111111", patient_id: IDS.patients[0], insurance_plan_id: IDS.insurance[0], member_id: "AET-229001", is_primary: true, bin_number: "004336", pcn: "ADV" },
    { id: "d1111111-1111-1111-1111-111111111112", patient_id: IDS.patients[1], insurance_plan_id: IDS.insurance[0], member_id: "AET-229002", is_primary: true, bin_number: "004336", pcn: "ADV" },
  ], "member_id");

  await upsert("purchase_orders", [{
    id: IDS.po,
    pharmacy_id: IDS.pharmacy,
    supplier_id: IDS.suppliers[0],
    po_number: "PO-7701",
    status: "submitted",
    order_date: new Date().toISOString().slice(0, 10),
    total_amount: 3440,
    created_by: userIds.admin,
  }], "po_number");

  await upsert("purchase_order_items", [
    { id: "e1111111-1111-1111-1111-111111111111", purchase_order_id: IDS.po, medication_id: IDS.medications[0], ndc: "0002-3227", quantity_ordered: 200, quantity_received: 100, unit_cost: 0.42 },
    { id: "e1111111-1111-1111-1111-111111111112", purchase_order_id: IDS.po, medication_id: IDS.medications[3], ndc: "5931-4401", quantity_ordered: 120, quantity_received: 60, unit_cost: 2.91 },
  ]);

  await upsert("inventory_items", [
    { id: IDS.inventory[0], pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[0], supplier_id: IDS.suppliers[0], lot_number: "LOT-A92", ndc: "0002-3227", quantity_on_hand: 54, reorder_point: 80, reorder_quantity: 200, expiration_date: "2026-05-14", storage_location: "A-02", is_active: true },
    { id: IDS.inventory[1], pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[1], supplier_id: IDS.suppliers[1], lot_number: "LOT-K11", ndc: "5486-1120", quantity_on_hand: 21, reorder_point: 40, reorder_quantity: 120, expiration_date: "2026-04-01", storage_location: "B-14", is_active: true },
    { id: IDS.inventory[2], pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[2], supplier_id: IDS.suppliers[0], lot_number: "LOT-L77", ndc: "0054-0011", quantity_on_hand: 98, reorder_point: 50, reorder_quantity: 100, expiration_date: "2027-01-20", storage_location: "A-08", is_active: true },
    { id: IDS.inventory[3], pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[3], supplier_id: IDS.suppliers[0], lot_number: "LOT-P55", ndc: "5931-4401", quantity_on_hand: 12, reorder_point: 30, reorder_quantity: 90, expiration_date: "2026-03-30", storage_location: "CS-01", is_active: true },
  ], "pharmacy_id,medication_id,lot_number");

  await upsert("prescriptions", [
    { id: IDS.prescriptions[0], pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[0], physician_id: IDS.physicians[0], medication_id: IDS.medications[0], rx_number: "RX-10344", status: "verification", origin: "electronic", written_date: "2026-03-14", quantity_prescribed: 30, quantity_dispensed: 30, days_supply: 30, refills_authorized: 3, refills_remaining: 2, directions: "Take 1 tablet daily", filled_by: userIds.technician, verified_by: userIds.pharmacist },
    { id: IDS.prescriptions[1], pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[1], physician_id: IDS.physicians[1], medication_id: IDS.medications[1], rx_number: "RX-10345", status: "filling", origin: "electronic", written_date: "2026-03-14", quantity_prescribed: 60, days_supply: 30, refills_authorized: 2, refills_remaining: 2, directions: "Take 1 tablet twice daily", filled_by: userIds.technician },
    { id: IDS.prescriptions[2], pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[2], physician_id: IDS.physicians[1], medication_id: IDS.medications[2], rx_number: "RX-10346", status: "ready", origin: "electronic", written_date: "2026-03-13", quantity_prescribed: 30, quantity_dispensed: 30, days_supply: 30, refills_authorized: 1, refills_remaining: 1, directions: "Take 1 tablet daily", filled_by: userIds.technician, verified_by: userIds.pharmacist },
    { id: IDS.prescriptions[3], pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[3], physician_id: IDS.physicians[0], medication_id: IDS.medications[3], rx_number: "RX-10347", status: "received", origin: "electronic", written_date: "2026-03-14", quantity_prescribed: 60, days_supply: 30, refills_authorized: 2, refills_remaining: 2, directions: "Take 1 tablet twice daily" },
  ], "rx_number");

  await upsert("claims", [
    { id: IDS.claims[0], pharmacy_id: IDS.pharmacy, prescription_id: IDS.prescriptions[0], patient_insurance_id: "d1111111-1111-1111-1111-111111111111", claim_number: "CLM-9012", status: "rejected", amount_billed: 124, amount_approved: 0, copay_amount: 20, reject_codes: ["79"] },
    { id: IDS.claims[1], pharmacy_id: IDS.pharmacy, prescription_id: IDS.prescriptions[1], patient_insurance_id: "d1111111-1111-1111-1111-111111111112", claim_number: "CLM-9013", status: "submitted", amount_billed: 88 },
    { id: IDS.claims[2], pharmacy_id: IDS.pharmacy, prescription_id: IDS.prescriptions[2], patient_insurance_id: "d1111111-1111-1111-1111-111111111111", claim_number: "CLM-9014", status: "approved", amount_billed: 62, amount_approved: 49.6, copay_amount: 12.4 },
  ], "claim_number");

  await upsert("prior_authorizations", [
    { id: IDS.pas[0], pharmacy_id: IDS.pharmacy, prescription_id: IDS.prescriptions[3], patient_id: IDS.patients[3], insurance_plan_id: IDS.insurance[0], pa_number: "PA-4421", status: "submitted", notes: "Awaiting payer response" },
    { id: IDS.pas[1], pharmacy_id: IDS.pharmacy, prescription_id: IDS.prescriptions[0], patient_id: IDS.patients[0], insurance_plan_id: IDS.insurance[0], pa_number: "PA-4422", status: "appeal", notes: "Appeal packet filed" },
  ], "pa_number");

  await upsert("transactions", [
    { id: "f1111111-1111-1111-1111-111111111111", pharmacy_id: IDS.pharmacy, prescription_id: IDS.prescriptions[2], claim_id: IDS.claims[2], transaction_type: "prescription_sale", payment_method: "credit", amount: 12.4, tax_amount: 0.5, total_amount: 12.9, status: "completed", cashier_id: userIds.cashier, receipt_number: "RCP-2201" },
    { id: "f1111111-1111-1111-1111-111111111112", pharmacy_id: IDS.pharmacy, transaction_type: "otc_sale", payment_method: "cash", amount: 12, tax_amount: 1, total_amount: 13, status: "completed", cashier_id: userIds.cashier, receipt_number: "RCP-2202" },
  ], "receipt_number");

  await upsert("notifications", [
    { id: "11112222-3333-4444-5555-666677778881", pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[0], profile_id: userIds.pharmacist, type: "in_app", category: "rx_ready", body: "RX-10346 is ready for pickup", status: "pending" },
    { id: "11112222-3333-4444-5555-666677778882", pharmacy_id: IDS.pharmacy, profile_id: userIds.admin, type: "in_app", category: "low_inventory", body: "Apixaban 5mg below reorder point", status: "pending" },
  ]);

  await upsert("clinical_notes", [
    { id: "12121212-1212-1212-1212-121212121211", pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[0], prescription_id: IDS.prescriptions[0], author_id: userIds.pharmacist, note_type: "counseling", note_text: "Reviewed statin adherence and monitoring plan." },
    { id: "12121212-1212-1212-1212-121212121212", pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[3], prescription_id: IDS.prescriptions[3], author_id: userIds.pharmacist, note_type: "mtm", note_text: "Discussed anticoagulant bleeding precautions." },
  ]);

  await upsert("adherence_records", [
    { id: "13131313-1313-1313-1313-131313131311", pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[0], prescription_id: IDS.prescriptions[0], expected_fill_date: "2026-03-10", actual_fill_date: "2026-03-11", days_late: 1, pdc_contribution: 0.93, is_gap: false },
    { id: "13131313-1313-1313-1313-131313131312", pharmacy_id: IDS.pharmacy, patient_id: IDS.patients[1], prescription_id: IDS.prescriptions[1], expected_fill_date: "2026-03-10", actual_fill_date: "2026-03-14", days_late: 4, pdc_contribution: 0.78, is_gap: true },
  ]);

  await upsert("compliance_records", [
    { id: "14141414-1414-1414-1414-141414141411", pharmacy_id: IDS.pharmacy, compliance_type: "DEA", regulation_code: "21 CFR 1304", status: "warning", due_date: "2026-03-18", assigned_to: userIds.admin, description: "Weekly controlled reconciliation due" },
    { id: "14141414-1414-1414-1414-141414141412", pharmacy_id: IDS.pharmacy, compliance_type: "HIPAA", regulation_code: "164.308", status: "compliant", due_date: "2026-06-01", assigned_to: userIds.admin, description: "Security training complete" },
  ]);

  await upsert("inventory_transactions", [
    { id: "15151515-1515-1515-1515-151515151511", pharmacy_id: IDS.pharmacy, inventory_item_id: IDS.inventory[3], transaction_type: "dispense", quantity: 2, quantity_before: 14, quantity_after: 12, reference_id: IDS.prescriptions[3], reference_type: "prescription", performed_by: userIds.technician },
  ]);

  await upsert("controlled_substance_ledger", [
    { id: "16161616-1616-1616-1616-161616161611", pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[3], transaction_type: "dispense", quantity: 2, running_balance: 12, prescription_id: IDS.prescriptions[3], performed_by: userIds.pharmacist, notes: "Routine dispense" },
  ]);

  await upsert("price_schedules", [
    { id: "17171717-1717-1717-1717-171717171711", pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[0], insurance_plan_id: IDS.insurance[0], price_type: "insurance", price: 4.13, effective_date: "2026-01-01", is_active: true },
    { id: "17171717-1717-1717-1717-171717171712", pharmacy_id: IDS.pharmacy, medication_id: IDS.medications[3], price_type: "cash", price: 125.0, effective_date: "2026-01-01", is_active: true },
  ]);

  await upsert("lab_results", [
    { id: "18181818-1818-1818-1818-181818181811", patient_id: IDS.patients[0], pharmacy_id: IDS.pharmacy, test_name: "LDL", result_value: "82", result_unit: "mg/dL", result_date: "2026-03-10", ordering_physician_id: IDS.physicians[0] },
  ]);

  await upsert("patient_assistance_programs", [
    { id: "19191919-1919-1919-1919-191919191911", patient_id: IDS.patients[3], medication_id: IDS.medications[3], program_name: "CoPay Assist", manufacturer: "Demo Pharma", status: "enrolled" },
  ]);

  await upsert("iot_sensor_readings", [
    { id: "20202020-2020-2020-2020-202020202011", pharmacy_id: IDS.pharmacy, sensor_id: "COLD-1", sensor_type: "temperature", location: "Fridge A", reading_value: 4.2, unit: "C", recorded_at: new Date().toISOString() },
  ]);

  console.log("Supabase seed completed successfully.");
}

seed().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
