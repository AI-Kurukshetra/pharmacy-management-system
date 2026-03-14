import { createClient } from "@/lib/supabase/server";

async function q(table: string, select = "*", orderCol = "created_at") {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select(select).order(orderCol as any, { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getDashboardData() {
  const [prescriptions, claims, inventory, patients, compliance, transactions] = await Promise.all([
    q("prescriptions"),
    q("claims"),
    q("inventory_items"),
    q("patients"),
    q("compliance_records"),
    q("transactions"),
  ]);

  const revenue = (transactions as any[]).reduce((sum, t) => sum + Number(t.total_amount || 0), 0);
  const queueSize = (prescriptions as any[]).filter((p) => ["received", "filling", "verification", "ready"].includes(p.status)).length;
  const lowStock = (inventory as any[]).filter((i) => Number(i.quantity_on_hand || 0) <= Number(i.reorder_point || 0)).length;
  const rejectedClaims = (claims as any[]).filter((c) => c.status === "rejected").length;
  const complianceAlerts = (compliance as any[]).filter((c) => c.status === "warning" || c.status === "violation").length;

  return {
    prescriptions,
    claims,
    inventory,
    patients,
    compliance,
    transactions,
    metrics: {
      queueSize,
      revenue,
      lowStock,
      rejectedClaims,
      complianceAlerts,
    },
  };
}

export async function getPatientsData() {
  return q("patients");
}

export async function getPatientById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("patients").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getPatientSubData(id: string) {
  const supabase = await createClient();
  const [prescriptions, allergies, insurance, adherence, clinical] = await Promise.all([
    supabase.from("prescriptions").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
    supabase.from("patient_allergies").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
    supabase.from("patient_insurance").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
    supabase.from("adherence_records").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
    supabase.from("clinical_notes").select("*").eq("patient_id", id).order("created_at", { ascending: false }),
  ]);

  return {
    prescriptions: prescriptions.data ?? [],
    allergies: allergies.data ?? [],
    insurance: insurance.data ?? [],
    adherence: adherence.data ?? [],
    clinical: clinical.data ?? [],
  };
}

export async function getPrescriptionsData() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*, patients(first_name,last_name), medications(name)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getPrescriptionById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prescriptions")
    .select("*, patients(*), physicians(*), medications(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getInventoryData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("inventory_items").select("*, medications(name)").order("updated_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getInventoryById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("inventory_items").select("*, medications(*), suppliers(*)").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getClaimsData() { return q("claims"); }

export async function getClaimById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("claims").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getPaData() { return q("prior_authorizations"); }

export async function getPaById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("prior_authorizations").select("*").eq("id", id).single();
  if (error) return null;
  return data;
}

export async function getTransactionsData() { return q("transactions"); }
export async function getNotificationsData() { return q("notifications"); }
export async function getComplianceData() { return q("compliance_records", "*", "updated_at"); }
export async function getAuditLogsData() { return q("audit_logs", "*", "created_at"); }
export async function getMedicationsData() { return q("medications", "*", "updated_at"); }
export async function getSuppliersData() { return q("suppliers", "*", "updated_at"); }
export async function getPurchaseOrdersData() { return q("purchase_orders", "*", "updated_at"); }
export async function getPharmaciesData() { return q("pharmacies", "*", "updated_at"); }
export async function getProfilesData() { return q("profiles", "*", "updated_at"); }
export async function getClinicalNotesData() { return q("clinical_notes", "*", "updated_at"); }
export async function getAdherenceData() { return q("adherence_records", "*", "created_at"); }
export async function getCsLedgerData() { return q("controlled_substance_ledger", "*", "created_at"); }
