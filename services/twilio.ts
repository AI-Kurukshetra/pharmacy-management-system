import Twilio from "twilio";

export const twilio = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function sendSms(to: string, body: string) {
  if (!process.env.TWILIO_FROM_NUMBER) return null;
  return twilio.messages.create({ from: process.env.TWILIO_FROM_NUMBER, to, body });
}
