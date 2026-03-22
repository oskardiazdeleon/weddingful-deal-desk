import { NextResponse } from "next/server";

/**
 * Auth middleware intentionally disabled for now.
 *
 * Previous HTTP Basic auth caused browser credential popups on public pages
 * due to route prefetching of protected dashboard URLs.
 *
 * TODO: Re-introduce dashboard auth with session/cookie-based protection
 * that does not trigger browser-level auth prompts.
 */
export function middleware() {
  return NextResponse.next();
}
