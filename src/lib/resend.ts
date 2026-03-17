import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = process.env.RESEND_FROM_EMAIL ?? "orders@longtress.com";

export async function sendOrderConfirmation(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
  address: {
    line1: string;
    apt?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}) {
  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:10px 0;color:#5C2A0A;font-size:14px;">${i.name}</td>
          <td style="padding:10px 0;color:#9B6535;font-size:14px;text-align:center;">×${i.qty}</td>
          <td style="padding:10px 0;color:#5C2A0A;font-size:14px;text-align:right;font-weight:600;">$${(i.qty * i.price).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const addressLine = [
    order.address.line1,
    order.address.apt,
    `${order.address.city}, ${order.address.state} ${order.address.zip}`,
    order.address.country,
  ]
    .filter(Boolean)
    .join("<br/>");

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.id} | Longtress`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FBF6F0;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(92,42,10,0.08);">
    <!-- Header -->
    <div style="background:#5C2A0A;padding:32px;text-align:center;">
      <div style="font-family:Georgia,serif;color:#C89B3C;font-size:24px;font-weight:700;letter-spacing:0.1em;">LONGTRESS</div>
      <div style="color:rgba(249,243,232,0.5);font-size:12px;margin-top:4px;">Haitian Hair Oil</div>
    </div>
    <!-- Body -->
    <div style="padding:40px 32px;">
      <div style="text-align:center;margin-bottom:32px;">
        <div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#C89B3C,#E8B848);display:inline-flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px;">✓</div>
        <h1 style="font-family:Georgia,serif;color:#5C2A0A;font-size:26px;margin:0 0 8px;">Order Confirmed!</h1>
        <p style="color:#9B6535;font-size:14px;margin:0;">Hi ${order.customerName}, your order is on its way.</p>
      </div>

      <div style="background:#FBF6F0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <div style="font-size:12px;color:#9B6535;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Order ID</div>
        <div style="font-size:18px;font-weight:700;color:#5C2A0A;">${order.id}</div>
      </div>

      <!-- Items -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr style="border-bottom:1px solid rgba(200,155,60,0.15);">
          <th style="text-align:left;padding-bottom:8px;font-size:11px;color:#9B6535;text-transform:uppercase;letter-spacing:0.06em;">Item</th>
          <th style="text-align:center;padding-bottom:8px;font-size:11px;color:#9B6535;text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
          <th style="text-align:right;padding-bottom:8px;font-size:11px;color:#9B6535;text-transform:uppercase;letter-spacing:0.06em;">Price</th>
        </tr>
        ${itemRows}
        <tr style="border-top:1px solid rgba(200,155,60,0.15);">
          <td colspan="2" style="padding:8px 0;font-size:13px;color:#9B6535;">Subtotal</td>
          <td style="padding:8px 0;font-size:13px;color:#9B6535;text-align:right;">$${order.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px 0;font-size:13px;color:#9B6535;">Shipping (${order.shippingMethod})</td>
          <td style="padding:4px 0;font-size:13px;color:#9B6535;text-align:right;">${order.shippingCost === 0 ? "FREE" : `$${order.shippingCost.toFixed(2)}`}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:4px 0;font-size:13px;color:#9B6535;">Tax</td>
          <td style="padding:4px 0;font-size:13px;color:#9B6535;text-align:right;">$${order.tax.toFixed(2)}</td>
        </tr>
        <tr style="border-top:2px solid rgba(200,155,60,0.2);">
          <td colspan="2" style="padding:12px 0;font-size:16px;font-weight:700;color:#5C2A0A;font-family:Georgia,serif;">Total</td>
          <td style="padding:12px 0;font-size:18px;font-weight:700;color:#C89B3C;text-align:right;">$${order.total.toFixed(2)}</td>
        </tr>
      </table>

      <!-- Shipping address -->
      <div style="border:1px solid rgba(200,155,60,0.15);border-radius:12px;padding:16px 20px;margin-bottom:32px;">
        <div style="font-size:11px;color:#9B6535;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Shipping To</div>
        <div style="font-size:14px;color:#5C2A0A;line-height:1.7;">${addressLine}</div>
      </div>

      <p style="font-size:13px;color:#9B6535;line-height:1.7;text-align:center;">
        Questions? Reply to this email or contact us at<br/>
        <a href="mailto:support@longtress.com" style="color:#C89B3C;">support@longtress.com</a>
      </p>
    </div>
    <!-- Footer -->
    <div style="background:#FBF6F0;padding:24px;text-align:center;border-top:1px solid rgba(200,155,60,0.1);">
      <div style="font-size:12px;color:#9B6535;">© 2025 Longtress · Haitian Hair Oil</div>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendStatusUpdate(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
}) {
  const statusMessages: Record<string, { headline: string; body: string; emoji: string }> = {
    Processing: {
      emoji: "⚙️",
      headline: "Your order is being processed",
      body: "We're preparing your Longtress Hair Oil and will ship it soon.",
    },
    Shipped: {
      emoji: "📦",
      headline: "Your order has shipped!",
      body: "Your Longtress Hair Oil is on its way. You'll receive it in the next few days.",
    },
    Delivered: {
      emoji: "✅",
      headline: "Your order has been delivered!",
      body: "We hope you love your Longtress Haitian Hair Oil. Thank you for your support!",
    },
    Cancelled: {
      emoji: "❌",
      headline: "Your order has been cancelled",
      body: "Your order has been cancelled. If you have questions, please contact us.",
    },
  };

  const msg = statusMessages[order.status];
  if (!msg) return; // Don't send for statuses with no message defined

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `${msg.emoji} Order ${order.id} — ${order.status} | Longtress`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FBF6F0;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(92,42,10,0.08);">
    <div style="background:#5C2A0A;padding:32px;text-align:center;">
      <div style="font-family:Georgia,serif;color:#C89B3C;font-size:24px;font-weight:700;letter-spacing:0.1em;">LONGTRESS</div>
    </div>
    <div style="padding:40px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:16px;">${msg.emoji}</div>
      <h1 style="font-family:Georgia,serif;color:#5C2A0A;font-size:24px;margin:0 0 12px;">${msg.headline}</h1>
      <p style="color:#9B6535;font-size:14px;line-height:1.7;margin:0 0 24px;">
        Hi ${order.customerName}, ${msg.body}
      </p>
      <div style="background:#FBF6F0;border-radius:12px;padding:16px 20px;display:inline-block;">
        <div style="font-size:12px;color:#9B6535;">Order <strong style="color:#5C2A0A;">${order.id}</strong> · $${order.total.toFixed(2)}</div>
      </div>
      <p style="font-size:13px;color:#9B6535;margin-top:32px;">
        Questions? <a href="mailto:support@longtress.com" style="color:#C89B3C;">support@longtress.com</a>
      </p>
    </div>
    <div style="background:#FBF6F0;padding:20px;text-align:center;border-top:1px solid rgba(200,155,60,0.1);">
      <div style="font-size:12px;color:#9B6535;">© 2025 Longtress · Haitian Hair Oil</div>
    </div>
  </div>
</body>
</html>`,
  });
}
