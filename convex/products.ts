import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    return products[0] ?? null;
  },
});

export const update = internalMutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined),
    );
    if (filtered.price !== undefined && (filtered.price as number) < 0) {
      throw new Error("Price cannot be negative");
    }
    if (filtered.stock !== undefined && (filtered.stock as number) < 0) {
      throw new Error("Stock cannot be negative");
    }
    await ctx.db.patch(id, filtered);
    return ctx.db.get(id);
  },
});

export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").first();
    if (existing) return existing._id;

    return ctx.db.insert("products", {
      productId: "LT-OIL-001",
      name: "Longtress Haitian Hair Oil",
      description:
        "Premium Haitian black castor oil, cold-pressed and traditionally crafted for maximum hair growth and scalp health.",
      price: 38.0,
      stock: 500,
      sku: "LT-OIL-001",
      size: "120 mL",
      status: "active",
    });
  },
});
