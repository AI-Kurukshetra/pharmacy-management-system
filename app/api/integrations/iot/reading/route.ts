import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const supabase = createAdminClient();

  const payload = {
    pharmacy_id: body.pharmacy_id as string,
    sensor_id: body.sensor_id as string,
    sensor_type: (body.sensor_type as string) ?? "temperature",
    location: (body.location as string) ?? null,
    reading_value: Number(body.reading_value ?? 0),
    unit: (body.unit as string) ?? null,
    is_alert: Boolean(body.is_alert ?? false),
    alert_threshold: body.alert_threshold ? Number(body.alert_threshold) : null,
    recorded_at: (body.recorded_at as string) ?? new Date().toISOString(),
  };

  const { data, error } = await supabase.from("iot_sensor_readings").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
