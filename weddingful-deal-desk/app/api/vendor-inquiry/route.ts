import { NextRequest, NextResponse } from "next/server";
import { saveVendorInquiryToDB } from "@/lib/db";
import { triggerVendorLeadPhase1 } from "@/lib/vendor-outreach";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, vendorType, message } = body;

    if (!name || !email || !company || !vendorType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Vercel serverless note:
    // local JSON file writes may fail in read-only/runtime environments.
    // We fallback to a transient lead object so the form still works.
    let inquiry: any = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name,
      email,
      company,
      vendorType,
      message: message ?? "",
      status: "new" as const,
    };

    try {
      inquiry = saveVendorInquiryToDB({
        name,
        email,
        company,
        vendorType,
        message: message ?? "",
      });
    } catch {
      // keep fallback inquiry when file persistence is unavailable
    }

    const emailResult = await triggerVendorLeadPhase1(inquiry);

    return NextResponse.json({ id: inquiry.id, accepted: true, email: emailResult }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
