import { NextRequest, NextResponse } from "next/server";

function toErrorString(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value) return "Unknown error";
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || "agent_4801kf4jnhneet6tscp3zt0f76er";

export async function POST(req: NextRequest) {
  try {
    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "Missing ELEVENLABS_API_KEY on server." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const agentId = body?.agentId || DEFAULT_AGENT_ID;

    const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(
      agentId
    )}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        {
          error: toErrorString(data?.detail || data?.message || data || "Failed to create signed URL"),
        },
        { status: res.status }
      );
    }

    return NextResponse.json({ signedUrl: data?.signed_url || null, raw: data });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
