import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  action,
  internalAction,
} from "./_generated/server";
import { internal, api } from "./_generated/api";

const VALID_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;
type Status = (typeof VALID_STATUSES)[number];

// --- Public queries (safe: read-only, scoped) ---

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getByOrderId = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("orders")
      .withIndex("by_orderId", (q) => q.eq("orderId", args.orderId))
      .unique();
  },
});

export const lookup = query({
  args: { email: v.optional(v.string()), orderId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.orderId) {
      const upper = args.orderId.trim().toUpperCase();
      const order = await ctx.db
        .query("orders")
        .withIndex("by_orderId", (q) => q.eq("orderId", upper))
        .unique();
      return order ? [order] : [];
    }
    if (args.email) {
      const lower = args.email.trim().toLowerCase();
      return ctx.db
        .query("orders")
        .withIndex("by_email", (q) => q.eq("customerEmail", lower))
        .order("desc")
        .collect();
    }
    return [];
  },
});

// --- Internal mutations (only callable from other Convex functions) ---

export const create = internalMutation({
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
      v.object({ name: v.string(), qty: v.number(), price: v.number() }),
    ),
    subtotal: v.number(),
    shippingCost: v.number(),
    tax: v.number(),
    total: v.number(),
    shippingMethod: v.union(v.literal("standard"), v.literal("express")),
    status: v.union(
      v.literal("Pending"),
      v.literal("Processing"),
      v.literal("Shipped"),
      v.literal("Delivered"),
      v.literal("Cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_stripeSession", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId),
      )
      .unique();
    if (existing) return existing._id;

    return ctx.db.insert("orders", args);
  },
});

export const updateStatus = internalMutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Processing"),
      v.literal("Shipped"),
      v.literal("Delivered"),
      v.literal("Cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new Error("Order not found");
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// --- Admin-facing queries/actions (called from admin page, gated by middleware) ---

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("orders").order("desc").take(500);
  },
});

export const customers = query({
  args: {},
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").order("desc").take(2000);

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

    const customersList = Array.from(byEmail.values()).sort(
      (a, b) => b.lastOrderAt - a.lastOrderAt,
    );

    const total = customersList.length;
    const repeatBuyers = customersList.filter((c) => c.orderCount >= 2).length;
    const repeatRate = total > 0 ? Math.round((repeatBuyers / total) * 100) : 0;

    return {
      customers: customersList,
      stats: { total, repeatBuyers, repeatRate },
    };
  },
});

export const updateStatusAndEmail = internalAction({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("Pending"),
      v.literal("Processing"),
      v.literal("Shipped"),
      v.literal("Delivered"),
      v.literal("Cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.runQuery(api.orders.get, { id: args.id });
    if (!order) throw new Error("Order not found");

    await ctx.runMutation(internal.orders.updateStatus, {
      id: args.id,
      status: args.status,
    });

    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@longtress.com";
    const bccEmail = process.env.RESEND_BCC_EMAIL;
    if (!resendKey || resendKey === "YOUR_RESEND_API_KEY") return;

    const statusConfig: Record<
      string,
      {
        subject: string;
        headline: string;
        body: string;
        icon: string;
        accent: string;
        tip?: string;
      }
    > = {
      Processing: {
        subject: `Preparing Your Order — ${order.orderId}`,
        icon: "&#9881;",
        accent: "#D4A574",
        headline: "We're Preparing Your Order",
        body: `${order.customerName}, your Longtress Haitian Hair Oil is being carefully packaged. We'll notify you the moment it ships.`,
      },
      Shipped: {
        subject: `Your Longtress Order Has Shipped — ${order.orderId}`,
        icon: "&#128230;",
        accent: "#7BA68C",
        headline: "Your Order is On Its Way",
        body: `${order.customerName}, your Longtress Haitian Hair Oil has shipped and is en route to you. Keep an eye on your doorstep.`,
        tip: "While you wait, prepare for your first application: wash and towel-dry your hair so the oil can absorb deeply into your scalp.",
      },
      Delivered: {
        subject: `Your Longtress Has Arrived — ${order.orderId}`,
        icon: "&#10024;",
        accent: "#D4A574",
        headline: "Your Longtress Has Arrived",
        body: `${order.customerName}, your order has been delivered. Your journey to healthier, stronger hair starts today.`,
        tip: "For best results, apply 2\u20133 times per week to your scalp and ends. Consistent use over 4\u20138 weeks delivers the most transformative results.",
      },
      Cancelled: {
        subject: `Order Cancelled — ${order.orderId} | Longtress`,
        icon: "&mdash;",
        accent: "#A67C6B",
        headline: "Order Cancelled",
        body: `${order.customerName}, your order has been cancelled. If this was a mistake or you have questions, please reach out \u2014 we're here to help.`,
      },
    };

    const cfg = statusConfig[args.status];
    if (!cfg) return;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://longtress.com";
    const trackUrl = `${baseUrl}/track`;

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: order.customerEmail,
          ...(bccEmail ? { bcc: bccEmail } : {}),
          subject: cfg.subject,
          html: statusEmailHtml({
            headline: cfg.headline,
            body: cfg.body,
            icon: cfg.icon,
            accent: cfg.accent,
            orderId: order.orderId,
            total: order.total,
            status: args.status,
            trackUrl,
            tip: cfg.tip,
          }),
        }),
      });
      if (!res.ok) {
        console.error(`Resend email failed (${res.status}):`, await res.text());
      }
    } catch (err) {
      console.error("Failed to send status email:", err);
    }
  },
});

function statusEmailHtml(p: {
  headline: string;
  body: string;
  icon: string;
  accent: string;
  orderId: string;
  total: number;
  status: string;
  trackUrl: string;
  tip?: string;
}) {
  const steps = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIdx = steps.indexOf(p.status);
  const cancelled = p.status === "Cancelled";

  const progressHtml = steps
    .map((step, i) => {
      const done = !cancelled && i <= currentIdx;
      const dotColor = done ? p.accent : "#3A332D";
      const lineColor =
        !cancelled && i > 0 && i <= currentIdx ? p.accent : "#2A2420";
      return `<td style="text-align:center;padding:0 2px;">
        ${i > 0 ? `<div style="height:2px;background:${lineColor};margin-bottom:6px;border-radius:1px;"></div>` : `<div style="height:2px;margin-bottom:6px;"></div>`}
        <div style="width:10px;height:10px;border-radius:50%;background:${dotColor};margin:0 auto;${done ? "box-shadow:0 0 8px " + p.accent + "40;" : ""}"></div>
        <div style="font-size:10px;color:${done ? "#BFA88A" : "#4A3F35"};margin-top:6px;letter-spacing:0.05em;">${step}</div>
      </td>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#1A1412;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#1A1412;padding:48px 40px 24px;text-align:center;">
    <div style="font-size:13px;letter-spacing:0.3em;color:#8B7355;text-transform:uppercase;margin-bottom:8px;">est. 2025 &middot; Haiti</div>
    <div style="font-size:32px;font-weight:700;letter-spacing:0.15em;color:#D4A574;">LONGTRESS</div>
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#8B7355,transparent);margin:16px auto 0;"></div>
  </div>
  <div style="background:linear-gradient(135deg,#2A1F18,#3D2B1E);padding:40px;text-align:center;border-top:1px solid rgba(212,165,116,0.15);">
    <div style="width:64px;height:64px;border-radius:50%;border:2px solid ${p.accent};display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
      <span style="font-size:28px;color:${p.accent};">${p.icon}</span>
    </div>
    <h1 style="font-size:26px;font-weight:400;color:#F5EDE3;margin:0 0 12px;letter-spacing:0.02em;">${p.headline}</h1>
    <p style="font-size:15px;color:#BFA88A;margin:0;line-height:1.7;max-width:440px;display:inline-block;">${p.body}</p>
  </div>
  ${
    !cancelled
      ? `<div style="background:#221A14;padding:28px 40px;border-top:1px solid rgba(212,165,116,0.1);">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>${progressHtml}</tr></table>
  </div>`
      : ""
  }
  <div style="background:#1A1412;padding:24px 40px;border-top:1px solid rgba(212,165,116,0.1);">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8B7355;">Order No.</td>
      <td style="text-align:right;font-size:16px;font-weight:700;color:#D4A574;letter-spacing:0.06em;">${p.orderId}</td>
    </tr><tr>
      <td style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8B7355;padding-top:8px;">Total</td>
      <td style="text-align:right;font-size:16px;font-weight:700;color:#F5EDE3;padding-top:8px;">$${p.total.toFixed(2)}</td>
    </tr></table>
  </div>
  ${
    p.tip
      ? `<div style="background:#221A14;padding:24px 40px;border-top:1px solid rgba(212,165,116,0.1);">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:18px;padding-right:14px;vertical-align:top;color:#D4A574;">&#9758;</td>
      <td>
        <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#8B7355;margin-bottom:4px;">Pro Tip</div>
        <div style="font-size:14px;color:#BFA88A;line-height:1.7;">${p.tip}</div>
      </td>
    </tr></table>
  </div>`
      : ""
  }
  <div style="background:#1A1412;padding:32px 40px;text-align:center;border-top:1px solid rgba(212,165,116,0.1);">
    <a href="${p.trackUrl}" style="display:inline-block;padding:14px 44px;background:linear-gradient(135deg,#D4A574,#C4915E);color:#1A1412;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:4px;">Track Order</a>
  </div>
  <div style="background:#1A1412;padding:28px 40px;text-align:center;border-top:1px solid rgba(212,165,116,0.08);">
    <p style="font-size:13px;color:#6B5B4A;margin:0 0 12px;">
      Questions? <a href="mailto:support@longtress.com" style="color:#D4A574;text-decoration:none;">support@longtress.com</a>
    </p>
    <div style="width:40px;height:1px;background:rgba(212,165,116,0.2);margin:12px auto;"></div>
    <div style="font-size:11px;color:#4A3F35;letter-spacing:0.1em;">&copy; 2025 LONGTRESS &middot; Haitian Hair Oil</div>
  </div>
</div>
</body></html>`;
}
