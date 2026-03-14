import { getStripeClient } from "@/services/stripe";

export async function createPaymentIntent(amountCents: number) {
  const stripe = getStripeClient();
  return stripe.paymentIntents.create({ amount: amountCents, currency: "usd" });
}
