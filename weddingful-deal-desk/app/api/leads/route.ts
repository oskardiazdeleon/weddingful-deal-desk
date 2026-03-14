import { NextRequest, NextResponse } from "next/server";
import { saveCoupleLeadToDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, weddingDateStart, weddingDateEnd, destination, budget, guestCount } = body;

    // Basic validation
    if (!email || !weddingDateStart || !weddingDateEnd || !destination || !budget || !guestCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (Number(budget) < 1000) {
      return NextResponse.json({ error: "Budget must be at least $1,000" }, { status: 400 });
    }

    const lead = saveCoupleLeadToDB({
      email,
      weddingDateStart,
      weddingDateEnd,
      destination,
      budget: Number(budget),
      guestCount: Number(guestCount),
    });

    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
