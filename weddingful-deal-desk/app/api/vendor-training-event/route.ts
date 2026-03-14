import { NextRequest, NextResponse } from "next/server";
import { saveVendorTrainingEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, event, score, durationSec } = body;

    if (!leadId || !event) {
      return NextResponse.json({ error: "Missing leadId or event" }, { status: 400 });
    }
    if (!["sample_started", "sample_completed"].includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const saved = saveVendorTrainingEvent({
      leadId,
      event,
      score: typeof score === "number" ? score : undefined,
      durationSec: typeof durationSec === "number" ? durationSec : undefined,
    });

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
