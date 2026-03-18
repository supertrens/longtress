import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

const MAX_QTY = 10;
const EXPRESS_SHIPPING_CENTS = 14_99;

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    apt,
    city,
    state,
    zip,
    country,
    shippingMethod,
    qty,
  } = body as Record<string, string>;

  const errors: string[] = [];
  if (!firstName?.trim()) errors.push("First name is required");
  if (!lastName?.trim()) errors.push("Last name is required");
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Valid email is required");
  if (!address?.trim()) errors.push("Address is required");
  if (!city?.trim()) errors.push("City is required");
  if (!state?.trim()) errors.push("State is required");
  if (!zip?.trim()) errors.push("ZIP code is required");
  if (!country?.trim()) errors.push("Country is required");

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
  }

  const quantity = Math.min(Math.max(Math.round(Number(qty) || 1), 1), MAX_QTY);

  const product = await fetchQuery(api.products.get);
  if (!product || product.status !== "active") {
    return NextResponse.json(
      { error: "Product is currently unavailable" },
      { status: 400 },
    );
  }

  const unitPriceCents = Math.round(product.price * 100);
  const shippingCost =
    shippingMethod === "express" ? EXPRESS_SHIPPING_CENTS : 0;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl && process.env.NODE_ENV === "production") {
    console.error("NEXT_PUBLIC_BASE_URL is not set in production");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }
  const resolvedBaseUrl = baseUrl ?? "http://localhost:3000";

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email.trim(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `${product.size} · Cold-pressed · Traditional Haitian formula`,
            },
            unit_amount: unitPriceCents,
          },
          quantity,
        },
        ...(shippingCost > 0
          ? [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "Express Shipping (2–3 business days)",
                  },
                  unit_amount: shippingCost,
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      metadata: {
        customer_name: `${firstName.trim()} ${lastName.trim()}`,
        customer_email: email.trim().toLowerCase(),
        customer_phone: (phone ?? "").trim(),
        address_line1: address.trim(),
        address_apt: (apt ?? "").trim(),
        address_city: city.trim(),
        address_state: state.trim(),
        address_zip: zip.trim(),
        address_country: country.trim(),
        shipping_method: shippingMethod === "express" ? "express" : "standard",
        qty: String(quantity),
      },
      success_url: `${resolvedBaseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${resolvedBaseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json(
      { error: "Unable to create checkout session. Please try again." },
      { status: 500 },
    );
  }
}
