import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing PINTEREST_ACCESS_TOKEN" }, { status: 500 });
  }

  const url = "https://api.pinterest.com/v5/boards?page_size=25";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
