import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USERNAME;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Weddingful Admin", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  const protectedPath = req.nextUrl.pathname.startsWith("/admin") || req.nextUrl.pathname.startsWith("/brand");
  if (!protectedPath) return NextResponse.next();

  if (!ADMIN_USER || !ADMIN_PASS) {
    return new NextResponse("Admin auth is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD.", {
      status: 503,
    });
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  try {
    const encoded = auth.split(" ")[1] || "";
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(":");

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      return NextResponse.next();
    }
  } catch {
    // fallthrough to unauthorized
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/brand/:path*"],
};
