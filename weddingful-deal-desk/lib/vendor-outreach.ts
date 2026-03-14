import { saveVendorFollowups, type VendorInquiry } from "@/lib/db";

const BOOKING_URL = process.env.BOOKING_URL || "https://calendly.com/your-team/demo";
const FROM_EMAIL = process.env.OUTREACH_FROM_EMAIL || "ops@weddingful.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return { skipped: true };

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
    throw new Error(`Email send failed: ${err}`);
  }

  return res.json();
}

export async function triggerVendorLeadPhase1(lead: VendorInquiry) {
  const now = new Date();

  const followups = [
    {
      leadId: lead.id,
      email: lead.email,
      company: lead.company,
      step: "day0" as const,
      scheduledFor: now.toISOString(),
      status: "pending" as const,
      subject: "Your Weddingful pilot access + demo booking",
    },
    {
      leadId: lead.id,
      email: lead.email,
      company: lead.company,
      step: "day2" as const,
      scheduledFor: addDays(now, 2).toISOString(),
      status: "pending" as const,
      subject: "Quick follow-up: ready to run your voice concierge demo?",
    },
    {
      leadId: lead.id,
      email: lead.email,
      company: lead.company,
      step: "day5" as const,
      scheduledFor: addDays(now, 5).toISOString(),
      status: "pending" as const,
      subject: "Last follow-up: reserve your pilot onboarding slot",
    },
  ];

  saveVendorFollowups(followups);

  const introHtml = `
    <h2>Welcome to Weddingful Voice Concierge</h2>
    <p>Thanks for registering <strong>${lead.company}</strong>.</p>
    <p>Your demo training environment is ready. You can also book a pilot setup call here:</p>
    <p><a href="${BOOKING_URL}">Book your 15-minute onboarding call</a></p>
    <p>We’ll also send a couple of follow-up reminders over the next few days.</p>
    <p>— Weddingful</p>
  `;

  try {
    await sendEmail(lead.email, "Your Weddingful pilot access + demo booking", introHtml);
  } catch {
    // non-blocking for MVP
  }
}
