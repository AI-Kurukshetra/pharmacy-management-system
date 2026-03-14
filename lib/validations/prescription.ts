import { z } from "zod";

export const prescriptionSchema = z.object({
  patient_id: z.string().uuid(),
  physician_id: z.string().uuid(),
  medication_id: z.string().uuid(),
  quantity_prescribed: z.number().positive(),
  days_supply: z.number().int().positive(),
  directions: z.string().min(1),
});
