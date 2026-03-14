export const ROLES = [
  "superadmin",
  "admin",
  "pharmacist",
  "technician",
  "cashier",
  "readonly",
] as const;

export const PRESCRIPTION_STATUSES = [
  "received",
  "on_hold",
  "filling",
  "verification",
  "ready",
  "dispensed",
  "cancelled",
  "transferred",
  "returned",
] as const;

export const INTERACTION_SEVERITIES = [
  "contraindicated",
  "major",
  "moderate",
  "minor",
] as const;

export type Role = (typeof ROLES)[number];
