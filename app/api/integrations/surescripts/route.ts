import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const sig = request.headers.get("x-surescripts-signature") || "";
  const secret = process.env.SURESCRIPTS_WEBHOOK_SECRET || "";
  if (!secret) {
    return NextResponse.json({ error: "surescripts webhook secret is not configured" }, { status: 503 });
  }

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (sig !== expected) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, source: "surescripts" });
}
