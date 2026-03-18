import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { orderId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("messages")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    orderId: v.string(),
    senderType: v.string(),
    senderName: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("messages", args);
  },
});
