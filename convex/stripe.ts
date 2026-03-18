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

        const itemRow = `<tr>
          <td style="padding:10px 0;color:#5C2A0A;font-size:14px;">Longtress Haitian Hair Oil 120mL</td>
          <td style="padding:10px 0;color:#9B6535;font-size:14px;text-align:center;">&times;${qty}</td>
          <td style="padding:10px 0;color:#5C2A0A;font-size:14px;text-align:right;font-weight:600;">$${(qty * unitPrice).toFixed(2)}</td>
        </tr>`;

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
            subject: `Order Confirmed — ${orderId} | Longtress`,
            html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FBF6F0;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(92,42,10,0.08);">
    <div style="background:#5C2A0A;padding:32px;text-align:center;">
      <div style="font-family:Georgia,serif;color:#C89B3C;font-size:24px;font-weight:700;letter-spacing:0.1em;">LONGTRESS</div>
      <div style="color:rgba(249,243,232,0.5);font-size:12px;margin-top:4px;">Haitian Hair Oil</div>
    </div>
    <div style="padding:40px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#C89B3C,#E8B848);display:inline-flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px;">&#10003;</div>
        <h1 style="font-family:Georgia,serif;color:#5C2A0A;font-size:26px;margin:0 0 8px;">Order Confirmed!</h1>
        <p style="color:#9B6535;font-size:14px;margin:0;">Hi ${meta.customer_name}, your order is on its way.</p>
      </div>
      <div style="background:#FBF6F0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:12px;color:#9B6535;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Order ID</div>
        <div style="font-size:18px;font-weight:700;color:#5C2A0A;">${orderId}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr style="border-bottom:1px solid rgba(200,155,60,0.15);">
          <th style="text-align:left;padding-bottom:8px;font-size:11px;color:#9B6535;text-transform:uppercase;letter-spacing:0.06em;">Item</th>
          <th style="text-align:center;padding-bottom:8px;font-size:11px;color:#9B6535;text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
          <th style="text-align:right;padding-bottom:8px;font-size:11px;color:#9B6535;text-transform:uppercase;letter-spacing:0.06em;">Price</th>
        </tr>
        ${itemRow}
        <tr style="border-top:1px solid rgba(200,155,60,0.15);">
          <td colspan="2" style="padding:8px 0;font-size:13px;color:#9B6535;">Subtotal</td>
          <td style="padding:8px 0;font-size:13px;color:#9B6535;text-align:right;">$${subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px 0;font-size:13px;color:#9B6535;">Shipping (${meta.shipping_method})</td>
          <td style="padding:4px 0;font-size:13px;color:#9B6535;text-align:right;">${shippingCost === 0 ? "FREE" : "$" + shippingCost.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px 0;font-size:13px;color:#9B6535;">Tax</td>
          <td style="padding:4px 0;font-size:13px;color:#9B6535;text-align:right;">$${tax.toFixed(2)}</td>
        </tr>
        <tr style="border-top:2px solid rgba(200,155,60,0.2);">
          <td colspan="2" style="padding:12px 0;font-size:16px;font-weight:700;color:#5C2A0A;font-family:Georgia,serif;">Total</td>
          <td style="padding:12px 0;font-size:18px;font-weight:700;color:#C89B3C;text-align:right;">$${total.toFixed(2)}</td>
        </tr>
      </table>
      <div style="border:1px solid rgba(200,155,60,0.15);border-radius:12px;padding:16px 20px;margin-bottom:32px;">
        <div style="font-size:11px;color:#9B6535;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Shipping To</div>
        <div style="font-size:14px;color:#5C2A0A;line-height:1.7;">${addressLine}</div>
      </div>
      <p style="font-size:13px;color:#9B6535;line-height:1.7;text-align:center;">
        Questions? Reply to this email or contact us at<br/>
        <a href="mailto:support@longtress.com" style="color:#C89B3C;">support@longtress.com</a>
      </p>
    </div>
    <div style="background:#FBF6F0;padding:24px;text-align:center;border-top:1px solid rgba(200,155,60,0.1);">
      <div style="font-size:12px;color:#9B6535;">&copy; 2025 Longtress &middot; Haitian Hair Oil</div>
    </div>
  </div>
</body></html>`,
          }),
        });
      }
    }
  },
});
