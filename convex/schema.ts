import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
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
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_email", ["customerEmail"])
    .index("by_stripeSession", ["stripeSessionId"]),

  products: defineTable({
    productId: v.string(),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    stock: v.number(),
    sku: v.string(),
    size: v.string(),
    status: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_sku", ["sku"]),

  messages: defineTable({
    orderId: v.string(),
    senderType: v.string(),
    senderName: v.string(),
    body: v.string(),
  }).index("by_order", ["orderId"]),
});
