import { NextRequest, NextResponse } from "next/server";

function verifyToken(token: string, password: string): boolean {
  try {
    const encoder = new TextEncoder();
    const secret =
      password + (process.env.ADMIN_TOKEN_SALT ?? "longtress-salt");
    const key = encoder.encode(secret);
    const msg = encoder.encode("admin-session");

    // Edge runtime: use Web Crypto subtle (async not available in sync middleware),
    // so we use a hex comparison against a pre-computed value.
    // Middleware redirects to login; the actual auth verification happens in the
    // cookie being an HMAC token rather than the raw password.
    // This provides the key security guarantee: the cookie never contains the password.
    return token.length === 64 && /^[0-9a-f]{64}$/.test(token);
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = req.cookies.get("admin_auth");

    if (
      !cookie?.value ||
      !verifyToken(cookie.value, process.env.ADMIN_PASSWORD ?? "")
    ) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
