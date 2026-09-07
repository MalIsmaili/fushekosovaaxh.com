import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail(to: string, subject: string, text: string) {
  if (!resend) {
    console.log(`[email:dev] to=${to} subject="${subject}"\n${text}\n`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Coach Notifications <onboarding@resend.dev>",
      to,
      subject,
      text,
    });
    if (error) console.error(`[email] Resend rejected send to ${to}:`, error);
  } catch (err) {
    console.error(`[email] Resend request failed for ${to}:`, err);
  }
}
