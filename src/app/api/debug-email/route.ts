import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!process.env.AUTH_SECRET || token !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY ?? "";
  const emailFrom = process.env.EMAIL_FROM ?? null;

  const info: Record<string, unknown> = {
    resendKeySet: Boolean(apiKey),
    resendKeyPrefix: apiKey ? apiKey.slice(0, 8) : null,
    resendKeyLength: apiKey.length,
    emailFrom,
    maintenanceMode: process.env.MAINTENANCE_MODE ?? null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  };

  if (request.nextUrl.searchParams.get("send") === "1") {
    if (!apiKey) {
      info.sendResult = { skipped: "no api key" };
    } else {
      const resend = new Resend(apiKey);
      try {
        const result = await resend.emails.send({
          from: emailFrom ?? "Coach Notifications <onboarding@resend.dev>",
          to: "malismaili99@gmail.com",
          subject: "DIAGNOSTIC - live server test",
          text: "This is a live diagnostic test sent directly from the deployed Vercel function.",
        });
        info.sendResult = result;
      } catch (err) {
        info.sendError = err instanceof Error ? err.message : String(err);
      }
    }
  }

  return NextResponse.json(info);
}
