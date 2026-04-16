import { Resend } from "resend";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[resend] Missing RESEND_API_KEY; email not sent.");
    return { ok: false as const, error: "Resend not configured" };
  }
  const resend = new Resend(key);
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Stratycs <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
  return { ok: true as const };
}
