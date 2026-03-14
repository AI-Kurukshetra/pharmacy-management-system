import { DataTable } from "@/components/shared/DataTable";

export function AuditLogTable() {
  return <DataTable columns={["Action", "Table", "Timestamp"]} rows={[["UPDATE", "prescriptions", new Date().toISOString()]]} />;
}
