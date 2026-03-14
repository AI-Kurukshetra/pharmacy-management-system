import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getApiActor, hasDomainAccess, type ApiActor } from "@/lib/api/authz";
import { decryptPatientPayload, encryptPatientPayload } from "@/lib/security/pii";
import { invokeEdgeFunction } from "@/lib/supabase/functions";

const DOMAIN_TABLES: Record<string, string> = {
  patients: "patients",
  medications: "medications",
  prescriptions: "prescriptions",
  inventory: "inventory_items",
  suppliers: "suppliers",
  "purchase-orders": "purchase_orders",
  claims: "claims",
  "prior-authorizations": "prior_authorizations",
  transactions: "transactions",
  notifications: "notifications",
  compliance: "compliance_records",
  pharmacies: "pharmacies",
  users: "profiles",
};

const PHARMACY_SCOPED_TABLES = new Set([
  "patients",
  "prescriptions",
  "inventory_items",
  "claims",
  "prior_authorizations",
  "transactions",
  "notifications",
  "compliance_records",
  "clinical_notes",
  "adherence_records",
  "lab_results",
  "iot_sensor_readings",
  "purchase_orders",
  "inventory_transactions",
  "controlled_substance_ledger",
  "price_schedules",
  "pharmacies",
]);

function isSuperadmin(actor: ApiActor) {
  return actor.role === "superadmin";
}

async function assertPharmacyRecordAccess(table: string, id: string, actor: ApiActor) {
  if (isSuperadmin(actor) || !PHARMACY_SCOPED_TABLES.has(table)) return true;
  const { data } = await createAdminClient().from(table).select("pharmacy_id").eq("id", id).maybeSingle();
  return !!data && data.pharmacy_id === actor.pharmacy_id;
}

function parsePagination(url: URL) {
  const page = Number(url.searchParams.get("page") ?? 1);
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20;
  return {
    page: safePage,
    limit: safeLimit,
    from: (safePage - 1) * safeLimit,
    to: safePage * safeLimit - 1,
  };
}

function castValue(raw: string) {
  if (raw === "true") return true;
  if (raw === "false") return false;
  const n = Number(raw);
  if (!Number.isNaN(n) && raw.trim() !== "") return n;
  return raw;
}

async function parseBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function applyCommonFilters(query: any, request: NextRequest, ignored: Set<string>) {
  const { searchParams } = new URL(request.url);
  for (const [key, value] of searchParams.entries()) {
    if (ignored.has(key) || value === "") continue;
    query = query.eq(key, castValue(value));
  }
  return query;
}

async function listRecords(table: string, request: NextRequest, actor: ApiActor) {
  const url = new URL(request.url);
  const { from, to } = parsePagination(url);
  const ignored = new Set(["page", "limit", "search", "date_from", "date_to"]);
  let query = createAdminClient().from(table).select("*", { count: "exact" });

  query = applyCommonFilters(query, request, ignored);

  const search = url.searchParams.get("search");
  if (search && (table === "patients" || table === "medications")) {
    if (table === "patients") {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,mrn.ilike.%${search}%`);
    } else {
      query = query.or(`name.ilike.%${search}%,generic_name.ilike.%${search}%,ndc.ilike.%${search}%`);
    }
  }

  const dateFrom = url.searchParams.get("date_from");
  const dateTo = url.searchParams.get("date_to");
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);
  if (!isSuperadmin(actor) && PHARMACY_SCOPED_TABLES.has(table) && actor.pharmacy_id) {
    query = query.eq("pharmacy_id", actor.pharmacy_id);
  }

  const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const rows = (data ?? []).map((row: any) => (table === "patients" ? decryptPatientPayload(row) : row));
  return NextResponse.json({ data: rows, count: count ?? 0 });
}

async function getRecord(table: string, id: string, actor: ApiActor) {
  if (!(await assertPharmacyRecordAccess(table, id, actor))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { data, error } = await createAdminClient().from(table).select("*").eq("id", id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data: table === "patients" ? decryptPatientPayload(data as any) : data });
}

async function createRecord(table: string, request: NextRequest, actor: ApiActor) {
  const body = await parseBody(request);
  if (!isSuperadmin(actor) && PHARMACY_SCOPED_TABLES.has(table)) {
    body.pharmacy_id = actor.pharmacy_id;
  }
  const payload = table === "patients" ? encryptPatientPayload(body as any) : body;
  const { data, error } = await createAdminClient().from(table).insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: table === "patients" ? decryptPatientPayload(data as any) : data }, { status: 201 });
}

async function updateRecord(table: string, id: string, request: NextRequest, actor: ApiActor) {
  if (!(await assertPharmacyRecordAccess(table, id, actor))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await parseBody(request);
  if (!isSuperadmin(actor) && PHARMACY_SCOPED_TABLES.has(table)) {
    delete body.pharmacy_id;
  }
  const payload = table === "patients" ? encryptPatientPayload(body as any) : body;
  const { data, error } = await createAdminClient().from(table).update(payload).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: table === "patients" ? decryptPatientPayload(data as any) : data });
}

async function deleteRecord(table: string, id: string, actor: ApiActor) {
  if (!(await assertPharmacyRecordAccess(table, id, actor))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { error } = await createAdminClient().from(table).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

async function handlePrescriptionActions(path: string[], request: NextRequest, actor: ApiActor) {
  const supabase = createAdminClient();
  if (request.method === "GET" && path[0] === "queue") {
    let query = supabase
      .from("prescriptions")
      .select("*")
      .in("status", ["received", "filling", "verification", "ready"])
      .order("created_at", { ascending: false });
    if (!isSuperadmin(actor) && actor.pharmacy_id) {
      query = query.eq("pharmacy_id", actor.pharmacy_id);
    }
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? [] });
  }

  if (path.length === 2 && request.method === "PATCH" && path[1] === "status") {
    if (!(await assertPharmacyRecordAccess("prescriptions", path[0], actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const body = await parseBody(request);
    const { data, error } = await supabase
      .from("prescriptions")
      .update({ status: body.status, notes: body.notes ?? null })
      .eq("id", path[0])
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }

  if (path.length === 2 && request.method === "GET" && path[1] === "label") {
    if (!(await assertPharmacyRecordAccess("prescriptions", path[0], actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { data, error } = await supabase
      .from("prescription_labels")
      .select("*")
      .eq("prescription_id", path[0])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ label_url: data?.storage_path ?? null, label_data: data?.label_data ?? null });
  }

  if (path.length === 3 && request.method === "POST" && path[1] === "label" && path[2] === "print") {
    if (!(await assertPharmacyRecordAccess("prescriptions", path[0], actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const body = await parseBody(request);
    const { data, error } = await supabase
      .from("prescription_labels")
      .insert({
        prescription_id: path[0],
        label_data: body.label_data ?? { printed: true },
        printed_at: new Date().toISOString(),
        printed_by: body.printed_by ?? null,
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  }

  if (path.length !== 2 || request.method !== "POST") return null;
  const [id, action] = path;
  if (!(await assertPharmacyRecordAccess("prescriptions", id, actor))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = await parseBody(request);

  if (action === "fill") {
    const { quantity_dispensed, inventory_item_id } = body as { quantity_dispensed?: number; inventory_item_id?: string };
    if (inventory_item_id && quantity_dispensed) {
      await supabase.rpc("deduct_inventory", {
        p_inventory_item_id: inventory_item_id,
        p_quantity: quantity_dispensed,
        p_prescription_id: id,
        p_performed_by: body.performed_by ?? null,
      });
    }
    const { data, error } = await supabase
      .from("prescriptions")
      .update({ status: "filling", quantity_dispensed })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }

  if (action === "verify" || action === "dispense" || action === "void") {
    const updates =
      action === "verify"
        ? { status: "verification", verified_by: body.verified_by ?? null }
        : action === "dispense"
          ? { status: "dispensed", dispensed_by: body.dispensed_by ?? null, dispense_date: new Date().toISOString() }
          : { status: "cancelled", void_reason: body.void_reason ?? "voided" };
    const { data, error } = await supabase.from("prescriptions").update(updates).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    if (action === "dispense") {
      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          pharmacy_id: data.pharmacy_id,
          prescription_id: data.id,
          transaction_type: "prescription_sale",
          payment_method: body.payment_method ?? "other",
          amount: Number(body.amount ?? data.copay_amount ?? 0),
          tax_amount: Number(body.tax_amount ?? 0),
          total_amount: Number(body.total_amount ?? body.amount ?? data.copay_amount ?? 0),
          status: "completed",
          cashier_id: body.cashier_id ?? null,
          receipt_number: body.receipt_number ?? `RCP-${Date.now()}`,
        })
        .select("*")
        .single();
      return NextResponse.json({ data, transaction: tx ?? null });
    }
    return NextResponse.json({ data });
  }

  if (action === "refill") {
    const { data: existing, error: rxError } = await supabase
      .from("prescriptions")
      .select("refills_remaining")
      .eq("id", id)
      .single();
    if (rxError) return NextResponse.json({ error: rxError.message }, { status: 404 });
    const nextRemaining = Math.max(0, Number(existing.refills_remaining ?? 0) - 1);
    const { data, error } = await supabase
      .from("prescription_refills")
      .insert({ prescription_id: id, refill_number: body.refill_number ?? 1, status: "requested" })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await supabase.from("prescriptions").update({ refills_remaining: nextRemaining }).eq("id", id);
    return NextResponse.json({ data });
  }

  return null;
}

async function handlePatientActions(path: string[], request: NextRequest, actor: ApiActor) {
  const supabase = createAdminClient();
  if (path.length < 2) return null;
  const [patientId, section, sectionId] = path;
  if (!isSuperadmin(actor)) {
    const { data: p } = await supabase.from("patients").select("pharmacy_id").eq("id", patientId).maybeSingle();
    if (!p || p.pharmacy_id !== actor.pharmacy_id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
  }

  if (section === "allergies") {
    if (request.method === "GET") {
      const { data, error } = await supabase.from("patient_allergies").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data: data ?? [] });
    }
    if (request.method === "POST") {
      const body = await parseBody(request);
      const { data, error } = await supabase.from("patient_allergies").insert({ ...body, patient_id: patientId }).select("*").single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data }, { status: 201 });
    }
    if (request.method === "DELETE" && sectionId) {
      const { error } = await supabase.from("patient_allergies").delete().eq("id", sectionId).eq("patient_id", patientId);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ success: true });
    }
  }

  if (section === "insurance") {
    if (request.method === "GET") {
      const { data, error } = await supabase.from("patient_insurance").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data: data ?? [] });
    }
    if (request.method === "POST") {
      const body = await parseBody(request);
      const { data, error } = await supabase.from("patient_insurance").insert({ ...body, patient_id: patientId }).select("*").single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data }, { status: 201 });
    }
    if (request.method === "PATCH" && sectionId) {
      const body = await parseBody(request);
      const { data, error } = await supabase
        .from("patient_insurance")
        .update(body)
        .eq("id", sectionId)
        .eq("patient_id", patientId)
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data });
    }
  }

  if (section === "prescriptions" && request.method === "GET") {
    const url = new URL(request.url);
    let query = supabase.from("prescriptions").select("*", { count: "exact" }).eq("patient_id", patientId);
    const status = url.searchParams.get("status");
    if (status) query = query.eq("status", status);
    const { from, to } = parsePagination(url);
    const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? [], count: count ?? 0 });
  }

  if (section === "adherence" && request.method === "GET") {
    const url = new URL(request.url);
    let query = supabase.from("adherence_records").select("*").eq("patient_id", patientId);
    const startDate = url.searchParams.get("start_date");
    const endDate = url.searchParams.get("end_date");
    if (startDate) query = query.gte("expected_fill_date", startDate);
    if (endDate) query = query.lte("expected_fill_date", endDate);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const rows = data ?? [];
    const pdcScore = rows.length ? rows.reduce((sum, r) => sum + Number(r.pdc_contribution ?? 0), 0) / rows.length : 0;
    return NextResponse.json({ data: rows, pdc_score: pdcScore });
  }

  if (section === "clinical-notes") {
    if (request.method === "GET") {
      const { data, error } = await supabase.from("clinical_notes").select("*").eq("patient_id", patientId).order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data: data ?? [] });
    }
    if (request.method === "POST") {
      const body = await parseBody(request);
      const { data, error } = await supabase
        .from("clinical_notes")
        .insert({ ...body, patient_id: patientId })
        .select("*")
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data }, { status: 201 });
    }
  }

  if (section === "lab-results") {
    if (request.method === "GET") {
      const { data, error } = await supabase.from("lab_results").select("*").eq("patient_id", patientId).order("result_date", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data: data ?? [] });
    }
    if (request.method === "POST") {
      const body = await parseBody(request);
      const { data, error } = await supabase.from("lab_results").insert({ ...body, patient_id: patientId }).select("*").single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ data }, { status: 201 });
    }
  }

  return null;
}

async function handleMedicationActions(path: string[], request: NextRequest) {
  const supabase = createAdminClient();

  if (request.method === "POST" && path[0] === "ndc-lookup") {
    const body = await parseBody(request);
    if (!body.ndc) return NextResponse.json({ error: "ndc is required" }, { status: 400 });
    const { data, error } = await supabase.from("medications").select("*").eq("ndc", body.ndc).maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? null });
  }

  if (request.method === "GET" && path.length === 2 && path[1] === "interactions") {
    const medId = path[0];
    const { data, error } = await supabase
      .from("drug_interactions")
      .select("*")
      .or(`medication_id_a.eq.${medId},medication_id_b.eq.${medId}`);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? [] });
  }

  return null;
}

async function handleInventoryActions(path: string[], request: NextRequest, actor: ApiActor) {
  if (request.method === "GET" && path[0] === "transactions") {
    return listRecords("inventory_transactions", request, actor);
  }
  if (request.method === "POST" && path.length === 2 && path[1] === "adjust") {
    const body = await parseBody(request);
    const { data, error } = await createAdminClient().rpc("adjust_inventory", {
      p_inventory_item_id: path[0],
      p_quantity: body.quantity ?? 0,
      p_transaction_type: body.transaction_type ?? "adjustment",
      p_notes: body.notes ?? null,
      p_performed_by: body.performed_by ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }
  return null;
}

async function handleClaimsActions(path: string[], request: NextRequest, actor: ApiActor) {
  const supabase = createAdminClient();
  if (request.method === "POST" && path[0] === "verify-eligibility") {
    const body = await parseBody(request);
    const edge = await invokeEdgeFunction<{ ncpdp_response?: { adjudication?: { copay?: number } } }>(
      "claims-submission",
      {
        patient_insurance_id: body.patient_insurance_id,
        prescription_id: body.prescription_id,
        medication_id: body.medication_id,
        amount_billed: body.amount_billed ?? 100,
      },
    );
    const copay = edge?.ncpdp_response?.adjudication?.copay ?? 15.0;
    return NextResponse.json({
      eligible: true,
      copay,
      coverage_details: { patient_insurance_id: body.patient_insurance_id, medication_id: body.medication_id },
    });
  }

  if (request.method === "POST" && path.length === 2) {
    const [id, action] = path;
    if (!(await assertPharmacyRecordAccess("claims", id, actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const status =
      action === "submit" ? "submitted" :
      action === "reverse" ? "reversed" :
      action === "resubmit" ? "resubmitted" : null;
    if (!status) return null;
    const edge = action === "submit" || action === "resubmit"
      ? await invokeEdgeFunction<{ ncpdp_response?: unknown }>("claims-submission", {
          claim_id: id,
          action,
        })
      : null;
    const { data, error } = await supabase.from("claims").update({ status, response_date: new Date().toISOString() }).eq("id", id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data, ncpdp_response: edge?.ncpdp_response ?? { status } });
  }
  return null;
}

async function handlePaActions(path: string[], request: NextRequest, actor: ApiActor) {
  if (request.method === "PATCH" && path.length === 1) {
    return updateRecord("prior_authorizations", path[0], request, actor);
  }
  return null;
}

async function handleTransactionsActions(path: string[], request: NextRequest, actor: ApiActor) {
  const supabase = createAdminClient();
  if (request.method === "GET" && path[0] === "daily-summary") {
    const url = new URL(request.url);
    const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
    let query = supabase
      .from("transactions")
      .select("*")
      .gte("created_at", `${date}T00:00:00.000Z`)
      .lte("created_at", `${date}T23:59:59.999Z`);
    if (!isSuperadmin(actor) && actor.pharmacy_id) {
      query = query.eq("pharmacy_id", actor.pharmacy_id);
    }
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const rows = data ?? [];
    const totalSales = rows.reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0);
    const totalRefunds = rows.filter((r) => r.transaction_type === "refund").reduce((sum, r) => sum + Number(r.total_amount ?? 0), 0);
    const paymentBreakdown = rows.reduce<Record<string, number>>((acc, r) => {
      const key = r.payment_method ?? "other";
      acc[key] = (acc[key] ?? 0) + Number(r.total_amount ?? 0);
      return acc;
    }, {});
    return NextResponse.json({ total_sales: totalSales, total_refunds: totalRefunds, payment_breakdown: paymentBreakdown });
  }
  if (request.method === "POST" && path.length === 2 && path[1] === "refund") {
    if (!(await assertPharmacyRecordAccess("transactions", path[0], actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { data, error } = await supabase.from("transactions").update({ status: "refunded", transaction_type: "refund" }).eq("id", path[0]).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }
  return null;
}

async function handlePurchaseOrderActions(path: string[], request: NextRequest, actor: ApiActor) {
  const supabase = createAdminClient();
  if (path.length !== 2) return null;
  const [poId, action] = path;

  if (request.method === "PATCH" && action === "receive") {
    if (!(await assertPharmacyRecordAccess("purchase_orders", poId, actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const body = await parseBody(request);
    const items = Array.isArray(body.items) ? body.items : [];
    for (const item of items) {
      if (!item.id) continue;
      await supabase
        .from("purchase_order_items")
        .update({
          quantity_received: item.quantity_received ?? 0,
          lot_number: item.lot_number ?? null,
          expiration_date: item.expiration_date ?? null,
        })
        .eq("id", item.id)
        .eq("purchase_order_id", poId);
    }
    const { data, error } = await supabase
      .from("purchase_orders")
      .update({ status: "received", received_date: new Date().toISOString().slice(0, 10) })
      .eq("id", poId)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }

  if (request.method === "POST" && action === "submit-edi") {
    if (!(await assertPharmacyRecordAccess("purchase_orders", poId, actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const ediTransactionId = crypto.randomUUID();
    const { data, error } = await supabase
      .from("purchase_orders")
      .update({ status: "submitted", edi_transaction_id: ediTransactionId })
      .eq("id", poId)
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ edi_transaction_id: ediTransactionId, data });
  }

  return null;
}

async function handleNotificationsActions(path: string[], request: NextRequest, actor: ApiActor) {
  const supabase = createAdminClient();
  if (request.method === "PATCH" && path.length === 2 && path[1] === "read") {
    if (!(await assertPharmacyRecordAccess("notifications", path[0], actor))) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { data, error } = await supabase
      .from("notifications")
      .update({ status: "read", read_at: new Date().toISOString() })
      .eq("id", path[0])
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }
  if (request.method === "POST" && path[0] === "bulk-send") {
    const body = await parseBody(request);
    const patientIds = Array.isArray(body.patient_ids) ? body.patient_ids : [];
    if (patientIds.length === 0) return NextResponse.json({ sent_count: 0, failed_count: 0 });
    const rows = patientIds.map((patient_id: string) => ({
      pharmacy_id: isSuperadmin(actor) ? body.pharmacy_id : actor.pharmacy_id,
      patient_id,
      type: body.type ?? "in_app",
      category: body.category ?? "general",
      body: body.body ?? "",
      subject: body.subject ?? null,
      status: "pending",
    }));
    const { error } = await supabase.from("notifications").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await Promise.all(
      rows.map((row: any) =>
        invokeEdgeFunction("notification-dispatch", {
          type: row.type,
          subject: row.subject,
          body: row.body,
          to: row.patient_id,
        }),
      ),
    );
    return NextResponse.json({ sent_count: rows.length, failed_count: 0 });
  }
  return null;
}

async function handleClinicalActions(path: string[], request: NextRequest) {
  const supabase = createAdminClient();
  if (request.method === "POST" && path[0] === "interaction-check") {
    const body = await parseBody(request);
    const { data: allergies } = await supabase.from("patient_allergies").select("*").eq("patient_id", body.patient_id);
    const edge = await invokeEdgeFunction<{ alerts?: Array<{ severity: string; description: string; medications: string[] }> }>(
      "drug-interaction-check",
      {
        patient_id: body.patient_id,
        medication_id: body.medication_id,
        allergies: allergies ?? [],
        active_medications: body.active_medications ?? [],
        diagnoses: body.diagnoses ?? [],
      },
    );
    const alerts = edge?.alerts ?? (allergies ?? []).map((a: any) => ({
      severity: a.severity ?? "moderate",
      description: `Allergy check: ${a.allergen}`,
      medications: [body.medication_id],
    }));
    return NextResponse.json({ alerts });
  }
  if (request.method === "GET" && path[0] === "mtm-candidates") {
    const { data, error } = await supabase.from("patients").select("*").eq("is_active", true).limit(25);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? [] });
  }
  if (request.method === "POST" && path[0] === "mtm-session") {
    const body = await parseBody(request);
    const { data, error } = await supabase
      .from("clinical_notes")
      .insert({
        pharmacy_id: body.pharmacy_id,
        patient_id: body.patient_id,
        author_id: body.author_id,
        note_type: "mtm",
        note_text: body.notes ?? "",
      })
      .select("*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }
  if (request.method === "GET" && path[0] === "outcomes") {
    const { data, error } = await supabase.from("adherence_records").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data: data ?? [] });
  }
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

async function handleComplianceActions(path: string[], request: NextRequest, actor: ApiActor) {
  if (request.method === "GET" && path[0] === "controlled-substances" && path[1] === "ledger") {
    return listRecords("controlled_substance_ledger", request, actor);
  }
  if (request.method === "GET" && path[0] === "audit-logs") {
    return listRecords("audit_logs", request, actor);
  }
  return null;
}

async function handleUserActions(path: string[], request: NextRequest) {
  if (request.method !== "POST" || path[0] !== "invite") return null;
  const body = await parseBody(request);
  const email = body.email as string | undefined;
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password: `Temp#${Math.random().toString(36).slice(2)}Aa1!`,
    email_confirm: true,
    user_metadata: {
      first_name: body.first_name ?? "Invited",
      last_name: body.last_name ?? "User",
    },
  });

  if (createErr) {
    return NextResponse.json({ error: createErr.message }, { status: 400 });
  }

  if (created.user) {
    await admin
      .from("profiles")
      .update({
        role: body.role ?? "technician",
        pharmacy_id: body.pharmacy_id ?? null,
        is_active: true,
      })
      .eq("id", created.user.id);
  }

  return NextResponse.json({ message: "User invited", user_id: created.user?.id ?? null });
}

async function handleReports(path: string[], request: NextRequest) {
  const supabase = createAdminClient();
  const report = path[0];
  if (request.method === "GET" && !report) {
    return NextResponse.json({
      available_reports: ["financial", "operational", "clinical", "inventory", "controlled-substances", "compliance"],
    });
  }
  if (request.method === "POST" && report === "export") {
    const body = await parseBody(request);
    const reportType = body.report_type ?? "financial";
    const format = (body.format ?? "csv").toLowerCase();
    const pharmacyId = body.pharmacy_id ?? "global";
    const exportPath =
      format === "pdf"
        ? `/api/reports/export/pdf?report_type=${encodeURIComponent(reportType)}&pharmacy_id=${encodeURIComponent(pharmacyId)}`
        : `/api/reports/export/csv?report_type=${encodeURIComponent(reportType)}&pharmacy_id=${encodeURIComponent(pharmacyId)}`;
    const res = await fetch(new URL(exportPath, request.url), {
      headers: { authorization: request.headers.get("authorization") ?? "" },
      cache: "no-store",
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(payload, { status: res.status });
    return NextResponse.json({ download_url: payload.download_url ?? null, path: payload.path ?? null });
  }
  if (request.method !== "GET") return NextResponse.json({ error: "method not allowed" }, { status: 405 });

  if (report === "financial") {
    const { data } = await supabase.from("transactions").select("*");
    const rows = data ?? [];
    const revenue = rows.reduce((s, r) => s + Number(r.total_amount ?? 0), 0);
    return NextResponse.json({ revenue, cost: 0, margin: revenue, by_day: rows });
  }
  if (report === "operational") {
    const [{ count: rxCount }, { count: claimCount }, { count: approvedCount }] = await Promise.all([
      supabase.from("prescriptions").select("*", { count: "exact", head: true }),
      supabase.from("claims").select("*", { count: "exact", head: true }),
      supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", "approved"),
    ]);
    const rate = claimCount ? Number(((approvedCount ?? 0) / claimCount * 100).toFixed(2)) : 0;
    return NextResponse.json({ avg_fill_time: 0, throughput: rxCount ?? 0, claim_acceptance_rate: rate });
  }
  if (report === "clinical") {
    const { data } = await supabase.from("adherence_records").select("*");
    const rows = data ?? [];
    const adherenceRate = rows.length ? rows.reduce((s, r) => s + Number(r.pdc_contribution ?? 0), 0) / rows.length : 0;
    return NextResponse.json({ adherence_rate: adherenceRate, pdc_scores: rows, mtm_interventions: 0 });
  }
  if (report === "inventory") {
    const { data } = await supabase.from("inventory_items").select("*");
    const rows = data ?? [];
    const stockout = rows.filter((r) => Number(r.quantity_on_hand ?? 0) <= 0).length;
    return NextResponse.json({ turnover_rate: 0, waste_cost: 0, stockout_events: stockout });
  }
  if (report === "controlled-substances") {
    const { data } = await supabase.from("controlled_substance_ledger").select("*").order("created_at", { ascending: false });
    return NextResponse.json({ ledger_entries: data ?? [], reconciliation_status: "pending_review" });
  }
  if (report === "compliance") {
    const { data } = await supabase.from("compliance_records").select("*").order("due_date", { ascending: true });
    const rows = data ?? [];
    return NextResponse.json({
      compliance_records: rows,
      violations: rows.filter((r) => r.status === "violation"),
      due_soon: rows.filter((r) => !!r.due_date),
    });
  }
  return NextResponse.json({ error: "unknown report" }, { status: 404 });
}

async function handleAnalytics(path: string[], request: NextRequest) {
  if (request.method !== "GET" || path[0] !== "dashboard") {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const supabase = createAdminClient();
  const [{ count: rx }, { count: patients }, { count: lowStock }, { count: pendingClaims }] = await Promise.all([
    supabase.from("prescriptions").select("*", { count: "exact", head: true }),
    supabase.from("patients").select("*", { count: "exact", head: true }),
    supabase.from("inventory_items").select("*", { count: "exact", head: true }).lte("quantity_on_hand", 20),
    supabase.from("claims").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);
  return NextResponse.json({
    kpis: {
      prescriptions: rx ?? 0,
      patients: patients ?? 0,
      low_stock_items: lowStock ?? 0,
      pending_claims: pendingClaims ?? 0,
    },
    charts: {},
  });
}

export async function handleDomainRequest(domain: string, request: NextRequest, params?: string[]) {
  let actor: ApiActor;
  try {
    actor = await getApiActor(request);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
  if (!hasDomainAccess(domain, request.method, actor.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const path = params ?? [];
  const table = DOMAIN_TABLES[domain];

  if (domain === "reports") return handleReports(path, request);
  if (domain === "analytics") return handleAnalytics(path, request);

  if (domain === "patients") {
    const out = await handlePatientActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "medications") {
    const out = await handleMedicationActions(path, request);
    if (out) return out;
  }
  if (domain === "prescriptions") {
    const out = await handlePrescriptionActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "inventory") {
    const out = await handleInventoryActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "claims") {
    const out = await handleClaimsActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "prior-authorizations") {
    const out = await handlePaActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "transactions") {
    const out = await handleTransactionsActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "notifications") {
    const out = await handleNotificationsActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "purchase-orders") {
    const out = await handlePurchaseOrderActions(path, request, actor);
    if (out) return out;
  }
  if (domain === "users") {
    const out = await handleUserActions(path, request);
    if (out) return out;
  }
  if (domain === "clinical") return handleClinicalActions(path, request);
  if (domain === "compliance") {
    const out = await handleComplianceActions(path, request, actor);
    if (out) return out;
  }

  if (!table) return NextResponse.json({ error: "unknown domain" }, { status: 404 });

  if (request.method === "GET" && path.length === 0) return listRecords(table, request, actor);
  if (request.method === "POST" && path.length === 0) return createRecord(table, request, actor);
  if (request.method === "GET" && path.length === 1) return getRecord(table, path[0], actor);
  if (request.method === "PATCH" && path.length === 1) return updateRecord(table, path[0], request, actor);
  if (request.method === "DELETE" && path.length === 1) return deleteRecord(table, path[0], actor);

  return NextResponse.json({ error: "not found" }, { status: 404 });
}
