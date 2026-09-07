import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendEmail(to: string, subject: string, text: string) {
  console.log(`[EMAIL_MARKER] sendEmail called, hasResendKey=${!!process.env.RESEND_API_KEY}, to=${to}`);

  if (!resend) {
    console.log(`[email:dev] to=${to} subject="${subject}"\n${text}\n`);
    return;
  }

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Coach Notifications <onboarding@resend.dev>",
      to,
      subject,
      text,
    });
    console.log(`[EMAIL_MARKER] resend.emails.send result: ${JSON.stringify(result)}`);
  } catch (err) {
    console.error(`[EMAIL_MARKER] resend.emails.send threw:`, err);
  }
}
