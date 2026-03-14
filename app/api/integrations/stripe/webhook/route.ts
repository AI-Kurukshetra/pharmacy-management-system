import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/services/stripe";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  try {
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
    return NextResponse.json({ ok: true, type: event.type });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
