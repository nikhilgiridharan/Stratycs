import twilio from "twilio";

export async function sendSms(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !from) {
    console.warn("[twilio] Missing env; SMS not sent.");
    return { ok: false as const, error: "Twilio not configured" };
  }
  const client = twilio(sid, token);
  await client.messages.create({ to, from, body });
  return { ok: true as const };
}
