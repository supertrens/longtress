"use node";

import Stripe from "stripe";
import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";

export const fulfillCheckout = internalAction({
  args: {
    body: v.string(),
    signature: v.string(),
  },
  handler: async (ctx, args) => {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    const stripe = new Stripe(stripeSecretKey);
    const event = stripe.webhooks.constructEvent(
      args.body,
      args.signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};

      const qty = Number(meta.qty) || 1;
      const unitPrice = 38;
      const shippingCost = meta.shipping_method === "express" ? 14.99 : 0;
      const subtotal = unitPrice * qty;
      const tax = (subtotal + shippingCost) * 0.08;
      const total = subtotal + shippingCost + tax;

      const orderId = `LT-${Date.now().toString().slice(-5)}`;

      await ctx.runMutation(api.orders.create, {
        orderId,
        stripeSessionId: session.id,
        customerName: meta.customer_name ?? "",
        customerEmail: meta.customer_email ?? "",
        customerPhone: meta.customer_phone ?? "",
        shippingAddress: {
          line1: meta.address_line1 ?? "",
          apt: meta.address_apt || undefined,
          city: meta.address_city ?? "",
          state: meta.address_state ?? "",
          zip: meta.address_zip ?? "",
          country: meta.address_country ?? "",
        },
        items: [
          { name: "Longtress Haitian Hair Oil 120mL", qty, price: unitPrice },
        ],
        subtotal,
        shippingCost,
        tax,
        total,
        shippingMethod: meta.shipping_method ?? "standard",
        status: "Pending",
      });

      const resendKey = process.env.RESEND_API_KEY;
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ?? "noreply@mail.gopifresh.com";
      const bccEmail = process.env.RESEND_BCC_EMAIL;

      if (resendKey && resendKey !== "YOUR_RESEND_API_KEY") {
        const addressLine = [
          meta.address_line1,
          meta.address_apt,
          `${meta.address_city}, ${meta.address_state} ${meta.address_zip}`,
          meta.address_country,
        ]
          .filter(Boolean)
          .join("<br/>");

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://longtress.com";
        const trackUrl = `${baseUrl}/track`;

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: meta.customer_email,
            ...(bccEmail ? { bcc: bccEmail } : {}),
            subject: `Your Longtress Order is Confirmed — ${orderId}`,
            html: confirmationEmailHtml({
              customerName: meta.customer_name ?? "",
              orderId,
              qty,
              unitPrice,
              subtotal,
              shippingCost,
              shippingMethod: meta.shipping_method ?? "standard",
              tax,
              total,
              addressLine,
              trackUrl,
            }),
          }),
        });
      }
    }
  },
});

function confirmationEmailHtml(p: {
  customerName: string;
  orderId: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
  tax: number;
  total: number;
  addressLine: string;
  trackUrl: string;
}) {
  const shippingLabel = p.shippingMethod === "express" ? "Express (2–3 days)" : "Standard (5–7 days)";
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#1A1412;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:600px;margin:0 auto;">

  <!-- Header -->
  <div style="background:#1A1412;padding:48px 40px 36px;text-align:center;">
    <div style="font-size:13px;letter-spacing:0.3em;color:#8B7355;text-transform:uppercase;margin-bottom:8px;">est. 2025 &middot; Haiti</div>
    <div style="font-size:32px;font-weight:700;letter-spacing:0.15em;color:#D4A574;">LONGTRESS</div>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#8B7355,transparent);margin:16px auto 0;"></div>
  </div>

  <!-- Confirmation Banner -->
  <div style="background:linear-gradient(135deg,#2A1F18,#3D2B1E);padding:40px;text-align:center;border-top:1px solid rgba(212,165,116,0.15);">
    <div style="width:64px;height:64px;border-radius:50%;border:2px solid #D4A574;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
      <span style="font-size:28px;color:#D4A574;">&#10003;</span>
    </div>
    <h1 style="font-size:28px;font-weight:400;color:#F5EDE3;margin:0 0 10px;letter-spacing:0.02em;">Order Confirmed</h1>
    <p style="font-size:15px;color:#BFA88A;margin:0;line-height:1.6;">
      Thank you, ${p.customerName}. Your journey to healthier, stronger hair begins now.
    </p>
  </div>

  <!-- Order ID -->
  <div style="background:#221A14;padding:20px 40px;border-top:1px solid rgba(212,165,116,0.1);border-bottom:1px solid rgba(212,165,116,0.1);display:flex;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8B7355;">Order No.</td>
      <td style="text-align:right;font-size:18px;font-weight:700;color:#D4A574;letter-spacing:0.06em;">${p.orderId}</td>
    </tr></table>
  </div>

  <!-- Items -->
  <div style="background:#1A1412;padding:32px 40px;">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8B7355;margin-bottom:20px;">Your Order</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr style="border-bottom:1px solid rgba(212,165,116,0.1);">
        <td style="padding:16px 0;">
          <div style="font-size:16px;color:#F5EDE3;font-weight:400;">Longtress Haitian Hair Oil</div>
          <div style="font-size:13px;color:#8B7355;margin-top:4px;">120 mL &middot; Cold-Pressed &middot; Qty: ${p.qty}</div>
        </td>
        <td style="padding:16px 0;text-align:right;font-size:16px;color:#D4A574;font-weight:600;">$${(p.qty * p.unitPrice).toFixed(2)}</td>
      </tr>
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#8B7355;">Subtotal</td>
        <td style="padding:6px 0;font-size:14px;color:#BFA88A;text-align:right;">$${p.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#8B7355;">Shipping (${shippingLabel})</td>
        <td style="padding:6px 0;font-size:14px;color:#BFA88A;text-align:right;">${p.shippingCost === 0 ? "Complimentary" : "$" + p.shippingCost.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:#8B7355;">Tax</td>
        <td style="padding:6px 0;font-size:14px;color:#BFA88A;text-align:right;">$${p.tax.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding-top:12px;border-top:1px solid rgba(212,165,116,0.15);"></td>
      </tr>
      <tr>
        <td style="padding:8px 0;font-size:18px;color:#F5EDE3;">Total</td>
        <td style="padding:8px 0;font-size:22px;font-weight:700;color:#D4A574;text-align:right;">$${p.total.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <!-- Shipping Address -->
  <div style="background:#221A14;padding:28px 40px;border-top:1px solid rgba(212,165,116,0.1);">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8B7355;margin-bottom:12px;">Shipping To</div>
    <div style="font-size:14px;color:#BFA88A;line-height:1.8;">${p.addressLine}</div>
  </div>

  <!-- Track Order CTA -->
  <div style="background:#1A1412;padding:36px 40px;text-align:center;border-top:1px solid rgba(212,165,116,0.1);">
    <a href="${p.trackUrl}" style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#D4A574,#C4915E);color:#1A1412;font-size:14px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:4px;">Track Your Order</a>
    <p style="font-size:13px;color:#6B5B4A;margin:20px 0 0;">
      Or enter your order ID at <a href="${p.trackUrl}" style="color:#D4A574;text-decoration:underline;">${p.trackUrl.replace(/https?:\/\//, "")}</a>
    </p>
  </div>

  <!-- What to Expect -->
  <div style="background:#221A14;padding:32px 40px;border-top:1px solid rgba(212,165,116,0.1);">
    <div style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#8B7355;margin-bottom:16px;text-align:center;">What to Expect</div>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:8px 16px 8px 0;font-size:20px;vertical-align:top;width:36px;">&#9758;</td>
        <td style="padding:8px 0;">
          <div style="font-size:14px;color:#F5EDE3;font-weight:600;">Apply to scalp &amp; ends</div>
          <div style="font-size:13px;color:#8B7355;margin-top:2px;">2&ndash;3 times per week for best results</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px 8px 0;font-size:20px;vertical-align:top;">&#10024;</td>
        <td style="padding:8px 0;">
          <div style="font-size:14px;color:#F5EDE3;font-weight:600;">See results in 1&ndash;2 weeks</div>
          <div style="font-size:13px;color:#8B7355;margin-top:2px;">Noticeable moisture, shine &amp; reduced breakage</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 16px 8px 0;font-size:20px;vertical-align:top;">&#128170;</td>
        <td style="padding:8px 0;">
          <div style="font-size:14px;color:#F5EDE3;font-weight:600;">Full transformation in 4&ndash;8 weeks</div>
          <div style="font-size:13px;color:#8B7355;margin-top:2px;">Thicker, stronger, longer hair</div>
        </td>
      </tr>
    </table>
  </div>

  <!-- Footer -->
  <div style="background:#1A1412;padding:32px 40px;text-align:center;border-top:1px solid rgba(212,165,116,0.08);">
    <p style="font-size:13px;color:#6B5B4A;margin:0 0 12px;">
      Questions? <a href="mailto:support@longtress.com" style="color:#D4A574;text-decoration:none;">support@longtress.com</a>
    </p>
    <div style="width:40px;height:1px;background:rgba(212,165,116,0.2);margin:16px auto;"></div>
    <div style="font-size:11px;color:#4A3F35;letter-spacing:0.1em;">&copy; 2025 LONGTRESS &middot; Haitian Hair Oil</div>
    <div style="font-size:11px;color:#3A332D;margin-top:4px;">Crafted with care in Haiti</div>
  </div>

</div>
</body></html>`;
}
