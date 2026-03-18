import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const updateProduct = action({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args): Promise<void> => {
    await ctx.runMutation(internal.products.update, args);
  },
});

export const seedProduct = action({
  args: {},
  handler: async (ctx): Promise<void> => {
    await ctx.runMutation(internal.products.seed, {});
  },
});

export const updateOrderStatus = action({
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
  handler: async (ctx, args): Promise<void> => {
    await ctx.runAction(internal.orders.updateStatusAndEmail, args);
  },
});
