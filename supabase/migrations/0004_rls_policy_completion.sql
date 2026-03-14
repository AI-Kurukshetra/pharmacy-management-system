-- Complete RLS policy coverage for remaining domain tables

-- Remove restrictive defaults if previously absent/partial
drop policy if exists pharmacy_select_purchase_orders on purchase_orders;
drop policy if exists pharmacy_insert_purchase_orders on purchase_orders;
drop policy if exists pharmacy_update_purchase_orders on purchase_orders;
drop policy if exists pharmacy_delete_purchase_orders on purchase_orders;

drop policy if exists pharmacy_select_prior_authorizations on prior_authorizations;
drop policy if exists pharmacy_insert_prior_authorizations on prior_authorizations;
drop policy if exists pharmacy_update_prior_authorizations on prior_authorizations;
drop policy if exists pharmacy_delete_prior_authorizations on prior_authorizations;

drop policy if exists pharmacy_select_transactions on transactions;
drop policy if exists pharmacy_insert_transactions on transactions;
drop policy if exists pharmacy_update_transactions on transactions;
drop policy if exists pharmacy_delete_transactions on transactions;

drop policy if exists pharmacy_select_compliance_records on compliance_records;
drop policy if exists pharmacy_insert_compliance_records on compliance_records;
drop policy if exists pharmacy_update_compliance_records on compliance_records;
drop policy if exists pharmacy_delete_compliance_records on compliance_records;

drop policy if exists pharmacy_select_iot_sensor_readings on iot_sensor_readings;
drop policy if exists pharmacy_insert_iot_sensor_readings on iot_sensor_readings;
drop policy if exists pharmacy_update_iot_sensor_readings on iot_sensor_readings;
drop policy if exists pharmacy_delete_iot_sensor_readings on iot_sensor_readings;

drop policy if exists pharmacy_select_price_schedules on price_schedules;
drop policy if exists pharmacy_insert_price_schedules on price_schedules;
drop policy if exists pharmacy_update_price_schedules on price_schedules;
drop policy if exists pharmacy_delete_price_schedules on price_schedules;

drop policy if exists pharmacy_select_inventory_transactions on inventory_transactions;
drop policy if exists pharmacy_insert_inventory_transactions on inventory_transactions;
drop policy if exists pharmacy_update_inventory_transactions on inventory_transactions;
drop policy if exists pharmacy_delete_inventory_transactions on inventory_transactions;

drop policy if exists pharmacy_insert_cs_ledger on controlled_substance_ledger;

drop policy if exists patient_allergies_select on patient_allergies;
drop policy if exists patient_allergies_insert on patient_allergies;
drop policy if exists patient_allergies_update on patient_allergies;
drop policy if exists patient_allergies_delete on patient_allergies;

drop policy if exists patient_insurance_select on patient_insurance;
drop policy if exists patient_insurance_insert on patient_insurance;
drop policy if exists patient_insurance_update on patient_insurance;
drop policy if exists patient_insurance_delete on patient_insurance;

drop policy if exists adherence_select on adherence_records;
drop policy if exists adherence_insert on adherence_records;
drop policy if exists adherence_update on adherence_records;
drop policy if exists adherence_delete on adherence_records;

drop policy if exists lab_results_select on lab_results;
drop policy if exists lab_results_insert on lab_results;
drop policy if exists lab_results_update on lab_results;
drop policy if exists lab_results_delete on lab_results;

drop policy if exists pap_select on patient_assistance_programs;
drop policy if exists pap_insert on patient_assistance_programs;
drop policy if exists pap_update on patient_assistance_programs;
drop policy if exists pap_delete on patient_assistance_programs;

drop policy if exists refills_select on prescription_refills;
drop policy if exists refills_insert on prescription_refills;
drop policy if exists refills_update on prescription_refills;
drop policy if exists refills_delete on prescription_refills;

drop policy if exists labels_select on prescription_labels;
drop policy if exists labels_insert on prescription_labels;
drop policy if exists labels_update on prescription_labels;
drop policy if exists labels_delete on prescription_labels;

drop policy if exists poi_select on purchase_order_items;
drop policy if exists poi_insert on purchase_order_items;
drop policy if exists poi_update on purchase_order_items;
drop policy if exists poi_delete on purchase_order_items;

drop policy if exists medications_select_all_roles on medications;
drop policy if exists medications_manage_admin_only on medications;
drop policy if exists physicians_select_all_roles on physicians;
drop policy if exists physicians_manage_admin_only on physicians;
drop policy if exists insurance_plans_select_all_roles on insurance_plans;
drop policy if exists insurance_plans_manage_admin_only on insurance_plans;
drop policy if exists suppliers_select_all_roles on suppliers;
drop policy if exists suppliers_manage_admin_only on suppliers;
drop policy if exists drug_interactions_select_roles on drug_interactions;
drop policy if exists drug_disease_interactions_select_roles on drug_disease_interactions;

-- Generic pharmacy-scoped tables
create policy pharmacy_select_purchase_orders on purchase_orders for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_purchase_orders on purchase_orders for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_purchase_orders on purchase_orders for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_purchase_orders on purchase_orders for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_prior_authorizations on prior_authorizations for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_prior_authorizations on prior_authorizations for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_prior_authorizations on prior_authorizations for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_prior_authorizations on prior_authorizations for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_transactions on transactions for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_transactions on transactions for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_transactions on transactions for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_transactions on transactions for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_compliance_records on compliance_records for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_compliance_records on compliance_records for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_compliance_records on compliance_records for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_compliance_records on compliance_records for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_iot_sensor_readings on iot_sensor_readings for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_iot_sensor_readings on iot_sensor_readings for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_iot_sensor_readings on iot_sensor_readings for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_iot_sensor_readings on iot_sensor_readings for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_price_schedules on price_schedules for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_price_schedules on price_schedules for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_price_schedules on price_schedules for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_price_schedules on price_schedules for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_select_inventory_transactions on inventory_transactions for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_insert_inventory_transactions on inventory_transactions for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_update_inventory_transactions on inventory_transactions for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy pharmacy_delete_inventory_transactions on inventory_transactions for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pharmacy_insert_cs_ledger on controlled_substance_ledger
for insert
with check (
  auth_role() in ('pharmacist','admin','superadmin')
  and (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
);

-- Child tables derive pharmacy scope from parent relationship
create policy patient_allergies_select on patient_allergies for select using (
  exists (
    select 1 from patients p
    where p.id = patient_allergies.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy patient_allergies_insert on patient_allergies for insert with check (
  exists (
    select 1 from patients p
    where p.id = patient_allergies.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy patient_allergies_update on patient_allergies for update using (
  exists (
    select 1 from patients p
    where p.id = patient_allergies.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy patient_allergies_delete on patient_allergies for delete using (
  exists (
    select 1 from patients p
    where p.id = patient_allergies.patient_id
      and ((p.pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin')
  )
);

create policy patient_insurance_select on patient_insurance for select using (
  exists (
    select 1 from patients p
    where p.id = patient_insurance.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy patient_insurance_insert on patient_insurance for insert with check (
  exists (
    select 1 from patients p
    where p.id = patient_insurance.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy patient_insurance_update on patient_insurance for update using (
  exists (
    select 1 from patients p
    where p.id = patient_insurance.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy patient_insurance_delete on patient_insurance for delete using (
  exists (
    select 1 from patients p
    where p.id = patient_insurance.patient_id
      and ((p.pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin')
  )
);

create policy adherence_select on adherence_records for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy adherence_insert on adherence_records for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy adherence_update on adherence_records for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy adherence_delete on adherence_records for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy lab_results_select on lab_results for select using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy lab_results_insert on lab_results for insert with check (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy lab_results_update on lab_results for update using (pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin');
create policy lab_results_delete on lab_results for delete using ((pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin');

create policy pap_select on patient_assistance_programs for select using (
  exists (
    select 1 from patients p
    where p.id = patient_assistance_programs.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy pap_insert on patient_assistance_programs for insert with check (
  exists (
    select 1 from patients p
    where p.id = patient_assistance_programs.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy pap_update on patient_assistance_programs for update using (
  exists (
    select 1 from patients p
    where p.id = patient_assistance_programs.patient_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy pap_delete on patient_assistance_programs for delete using (
  exists (
    select 1 from patients p
    where p.id = patient_assistance_programs.patient_id
      and ((p.pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin')
  )
);

create policy refills_select on prescription_refills for select using (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_refills.prescription_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy refills_insert on prescription_refills for insert with check (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_refills.prescription_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy refills_update on prescription_refills for update using (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_refills.prescription_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy refills_delete on prescription_refills for delete using (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_refills.prescription_id
      and ((p.pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin')
  )
);

create policy labels_select on prescription_labels for select using (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_labels.prescription_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy labels_insert on prescription_labels for insert with check (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_labels.prescription_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy labels_update on prescription_labels for update using (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_labels.prescription_id
      and (p.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy labels_delete on prescription_labels for delete using (
  exists (
    select 1 from prescriptions p
    where p.id = prescription_labels.prescription_id
      and ((p.pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin')
  )
);

create policy poi_select on purchase_order_items for select using (
  exists (
    select 1 from purchase_orders po
    where po.id = purchase_order_items.purchase_order_id
      and (po.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy poi_insert on purchase_order_items for insert with check (
  exists (
    select 1 from purchase_orders po
    where po.id = purchase_order_items.purchase_order_id
      and (po.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy poi_update on purchase_order_items for update using (
  exists (
    select 1 from purchase_orders po
    where po.id = purchase_order_items.purchase_order_id
      and (po.pharmacy_id = auth_pharmacy_id() or auth_role() = 'superadmin')
  )
);
create policy poi_delete on purchase_order_items for delete using (
  exists (
    select 1 from purchase_orders po
    where po.id = purchase_order_items.purchase_order_id
      and ((po.pharmacy_id = auth_pharmacy_id() and auth_role() in ('admin','superadmin')) or auth_role() = 'superadmin')
  )
);

-- Master/reference table policies
create policy medications_select_all_roles on medications for select using (auth_role() in ('superadmin','admin','pharmacist','readonly','technician','cashier'));
create policy medications_manage_admin_only on medications for all using (auth_role() in ('superadmin','admin')) with check (auth_role() in ('superadmin','admin'));

create policy physicians_select_all_roles on physicians for select using (auth_role() in ('superadmin','admin','pharmacist','technician','readonly'));
create policy physicians_manage_admin_only on physicians for all using (auth_role() in ('superadmin','admin')) with check (auth_role() in ('superadmin','admin'));

create policy insurance_plans_select_all_roles on insurance_plans for select using (auth_role() in ('superadmin','admin','pharmacist','technician','readonly'));
create policy insurance_plans_manage_admin_only on insurance_plans for all using (auth_role() in ('superadmin','admin')) with check (auth_role() in ('superadmin','admin'));

create policy suppliers_select_all_roles on suppliers for select using (auth_role() in ('superadmin','admin','pharmacist','technician','readonly'));
create policy suppliers_manage_admin_only on suppliers for all using (auth_role() in ('superadmin','admin')) with check (auth_role() in ('superadmin','admin'));

create policy drug_interactions_select_roles on drug_interactions for select using (auth_role() in ('superadmin','admin','pharmacist','technician','readonly'));
create policy drug_disease_interactions_select_roles on drug_disease_interactions for select using (auth_role() in ('superadmin','admin','pharmacist','technician','readonly'));

