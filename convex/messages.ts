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
    senderType: v.union(v.literal("admin"), v.literal("customer")),
    senderName: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.body.trim().length === 0) {
      throw new Error("Message body cannot be empty");
    }
    if (args.body.length > 5000) {
      throw new Error("Message body too long (max 5000 characters)");
    }
    if (args.senderName.trim().length === 0) {
      throw new Error("Sender name is required");
    }
    return ctx.db.insert("messages", {
      orderId: args.orderId,
      senderType: args.senderType,
      senderName: args.senderName.trim(),
      body: args.body.trim(),
    });
  },
});
