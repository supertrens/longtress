import { NextRequest, NextResponse } from "next/server";

// Stripe webhooks are now handled by Convex HTTP actions.
// Point your Stripe webhook URL to:
//   https://<your-convex-deployment>.convex.site/stripe-webhook
//
// This route is kept as a passthrough for local development with
// the Stripe CLI, which forwards to localhost:3000.
export async function POST(req: NextRequest) {
  const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
    ".cloud",
    ".site"
  );

  if (!convexSiteUrl) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const res = await fetch(`${convexSiteUrl}/stripe-webhook`, {
    method: "POST",
    headers,
    body,
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
