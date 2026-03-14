"use client";

import { useState } from "react";

export function usePharmacy() {
  const [pharmacyId, setPharmacyId] = useState<string | null>(null);
  return { pharmacyId, setPharmacyId };
}
