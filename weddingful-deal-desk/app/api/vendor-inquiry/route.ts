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

    const inquiry = saveVendorInquiryToDB({ name, email, company, vendorType, message: message ?? "" });
    await triggerVendorLeadPhase1(inquiry);

    return NextResponse.json({ id: inquiry.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
