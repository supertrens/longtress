import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();

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
  } = body;

  const quantity = Number(qty) || 1;
  const unitPrice = 38_00; // cents
  const shippingCost = shippingMethod === "express" ? 14_99 : 0;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Longtress Haitian Hair Oil",
            description: "120 mL · Cold-pressed · Traditional Haitian formula",
            images: [],
          },
          unit_amount: unitPrice,
        },
        quantity,
      },
      ...(shippingCost > 0
        ? [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "Express Shipping (2–3 business days)" },
                unit_amount: shippingCost,
              },
              quantity: 1,
            },
          ]
        : []),
    ],
    metadata: {
      customer_name: `${firstName} ${lastName}`,
      customer_email: email,
      customer_phone: phone ?? "",
      address_line1: address,
      address_apt: apt ?? "",
      address_city: city,
      address_state: state,
      address_zip: zip,
      address_country: country,
      shipping_method: shippingMethod,
      qty: String(quantity),
    },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}
