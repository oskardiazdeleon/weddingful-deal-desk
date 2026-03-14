import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing PINTEREST_ACCESS_TOKEN" }, { status: 500 });
  }

  const res = await fetch("https://api.pinterest.com/v5/user_account", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
