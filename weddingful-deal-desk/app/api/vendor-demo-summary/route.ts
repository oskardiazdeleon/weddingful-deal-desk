import { NextRequest, NextResponse } from "next/server";
import {
  getVendorDemoSnapshots,
  getVendorInquiryById,
  saveVendorDemoSnapshot,
} from "@/lib/db";

const BOOKING_URL = process.env.BOOKING_URL || "https://calendly.com/your-team/demo";
const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL || "onboarding@resend.dev";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return { ok: false, reason: "missing_resend_api_key" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    return { ok: false, reason: err || "email_send_failed" };
  }

  return { ok: true };
}

export async function GET(req: NextRequest) {
  const leadId = req.nextUrl.searchParams.get("leadId") || "";
  if (!leadId) return NextResponse.json({ snapshots: [] });

  const snapshots = getVendorDemoSnapshots(leadId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  return NextResponse.json({ snapshots });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, scenario, score, transcript, sendEmailToLead } = body;

    if (!leadId || !scenario || typeof score !== "number" || !Array.isArray(transcript)) {
      return NextResponse.json({ error: "Missing or invalid payload" }, { status: 400 });
    }

    const normalizedTranscript = transcript
      .map((x: unknown) => String(x || "").trim())
      .filter(Boolean)
      .slice(0, 40);

    const snapshot = saveVendorDemoSnapshot({
      leadId,
      scenario,
      score,
      transcript: normalizedTranscript,
    });

    let email: { ok: boolean; reason?: string } | null = null;

    if (sendEmailToLead) {
      const inquiry = getVendorInquiryById(leadId);
      if (inquiry?.email) {
        const rows = normalizedTranscript
          .slice(0, 8)
          .map((line) => `<li style="margin-bottom:6px">${line}</li>`)
          .join("");

        email = await sendEmail(
          inquiry.email,
          `Your Weddingful live demo summary (${scenario})`,
          `
            <h2>Weddingful Voice Demo Summary</h2>
            <p><strong>Company:</strong> ${inquiry.company}</p>
            <p><strong>Scenario:</strong> ${scenario}</p>
            <p><strong>Score:</strong> ${score}/100</p>
            <p><strong>Key transcript moments:</strong></p>
            <ul>${rows}</ul>
            <p>Next step: <a href="${BOOKING_URL}">Book your onboarding call</a></p>
          `
        );
      } else {
        email = { ok: false, reason: "lead_email_not_found" };
      }
    }

    return NextResponse.json({ id: snapshot.id, email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
