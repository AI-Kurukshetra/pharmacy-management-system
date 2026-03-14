export function buildEdi850(poNumber: string, items: Array<{ ndc: string; quantity: number }>) {
  return {
    transaction: "850",
    po_number: poNumber,
    items,
  };
}

export function parseEdiAcknowledgment(payload: unknown) {
  return { transaction: "997", acknowledged: true, payload };
}
