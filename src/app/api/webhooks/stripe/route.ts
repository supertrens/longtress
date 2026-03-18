import { NextRequest, NextResponse } from "next/server";

// Passthrough for local dev: forwards Stripe webhooks to Convex HTTP action.
// In production, point Stripe directly to your Convex site URL:
//   https://<deployment>.convex.site/stripe-webhook
export async function POST(req: NextRequest) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

  if (!convexUrl) {
    console.error("NEXT_PUBLIC_CONVEX_SITE_URL is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(`${convexUrl}/stripe-webhook`, {
      method: "POST",
      headers: {
        "stripe-signature": signature,
        "content-type": req.headers.get("content-type") ?? "application/json",
      },
      body,
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook proxy error:", err);
    return NextResponse.json(
      { error: "Webhook proxy failed" },
      { status: 502 },
    );
  }
}
