import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").order("desc").collect();
    return orders;
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.id);
  },
});

export const getByOrderId = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("orderId"), args.orderId))
      .collect();
    return orders[0] ?? null;
  },
});

export const create = mutation({
  args: {
    orderId: v.string(),
    stripeSessionId: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    shippingAddress: v.object({
      line1: v.string(),
      apt: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
      country: v.string(),
    }),
    items: v.array(
      v.object({
        name: v.string(),
        qty: v.number(),
        price: v.number(),
      })
    ),
    subtotal: v.number(),
    shippingCost: v.number(),
    tax: v.number(),
    total: v.number(),
    shippingMethod: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("orders", args);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const updateStatusAndEmail = action({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(api.orders.getById, { id: args.id });
    if (!order) throw new Error("Order not found");

    await ctx.runMutation(api.orders.updateStatus, {
      id: args.id,
      status: args.status,
    });

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@mail.gopifresh.com";
    const bccEmail = process.env.RESEND_BCC_EMAIL;
    if (!resendKey || resendKey === "YOUR_RESEND_API_KEY") return;

    const statusMessages: Record<
      string,
      { headline: string; body: string; emoji: string }
    > = {
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

    const msg = statusMessages[args.status];
    if (!msg) return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: order.customerEmail,
        ...(bccEmail ? { bcc: bccEmail } : {}),
        subject: `${msg.emoji} Order ${order.orderId} — ${args.status} | Longtress`,
        html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
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
        <div style="font-size:12px;color:#9B6535;">Order <strong style="color:#5C2A0A;">${order.orderId}</strong> · $${order.total.toFixed(2)}</div>
      </div>
      <p style="font-size:13px;color:#9B6535;margin-top:32px;">
        Questions? <a href="mailto:support@longtress.com" style="color:#C89B3C;">support@longtress.com</a>
      </p>
    </div>
    <div style="background:#FBF6F0;padding:20px;text-align:center;border-top:1px solid rgba(200,155,60,0.1);">
      <div style="font-size:12px;color:#9B6535;">© 2025 Longtress · Haitian Hair Oil</div>
    </div>
  </div>
</body></html>`,
      }),
    });
  },
});

export const customers = query({
  args: {},
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();

    const byEmail = new Map<
      string,
      {
        email: string;
        name: string;
        phone: string;
        orderCount: number;
        totalSpent: number;
        lastOrderAt: number;
        firstOrderAt: number;
      }
    >();

    for (const o of allOrders) {
      const existing = byEmail.get(o.customerEmail);
      const ts = o._creationTime;
      if (existing) {
        existing.orderCount++;
        existing.totalSpent += o.total;
        if (ts > existing.lastOrderAt) {
          existing.lastOrderAt = ts;
          existing.name = o.customerName;
        }
        if (ts < existing.firstOrderAt) existing.firstOrderAt = ts;
      } else {
        byEmail.set(o.customerEmail, {
          email: o.customerEmail,
          name: o.customerName,
          phone: o.customerPhone,
          orderCount: 1,
          totalSpent: o.total,
          lastOrderAt: ts,
          firstOrderAt: ts,
        });
      }
    }

    const customers = Array.from(byEmail.values()).sort(
      (a, b) => b.lastOrderAt - a.lastOrderAt
    );

    const total = customers.length;
    const repeatBuyers = customers.filter((c) => c.orderCount >= 2).length;
    const repeatRate = total > 0 ? Math.round((repeatBuyers / total) * 100) : 0;

    return { customers, stats: { total, repeatBuyers, repeatRate } };
  },
});
