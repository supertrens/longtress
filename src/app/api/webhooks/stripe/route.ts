import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendOrderConfirmation } from "@/lib/resend";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata ?? {};

    const qty = Number(meta.qty) || 1;
    const unitPrice = 38;
    const shippingCost = meta.shipping_method === "express" ? 14.99 : 0;
    const subtotal = unitPrice * qty;
    const tax = (subtotal + shippingCost) * 0.08;
    const total = subtotal + shippingCost + tax;

    // Generate order ID
    const orderId = `LT-${Date.now().toString().slice(-5)}`;

    const order = {
      id: orderId,
      stripe_session_id: session.id,
      customer_name: meta.customer_name,
      customer_email: meta.customer_email,
      customer_phone: meta.customer_phone,
      shipping_address: {
        line1: meta.address_line1,
        apt: meta.address_apt || undefined,
        city: meta.address_city,
        state: meta.address_state,
        zip: meta.address_zip,
        country: meta.address_country,
      },
      items: [{ name: "Longtress Haitian Hair Oil 120mL", qty, price: unitPrice }],
      subtotal,
      shipping_cost: shippingCost,
      tax,
      total,
      shipping_method: meta.shipping_method,
      status: "Pending",
    };

    const db = supabaseAdmin();
    const { error } = await db.from("orders").insert(order);
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // Send confirmation email
    try {
      await sendOrderConfirmation({
        id: orderId,
        customerName: meta.customer_name,
        customerEmail: meta.customer_email,
        items: order.items,
        subtotal,
        shippingCost,
        tax,
        total,
        shippingMethod: meta.shipping_method,
        address: order.shipping_address,
      });
    } catch (emailErr) {
      console.error("Resend error:", emailErr);
      // Don't fail the webhook — order is already saved
    }
  }

  return NextResponse.json({ received: true });
}
