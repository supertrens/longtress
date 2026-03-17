import { createClient } from "@supabase/supabase-js";

// Browser-safe client (anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-only client (service role — bypasses RLS, for API routes only)
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  stripe_session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    line1: string;
    apt?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_method: "standard" | "express";
  status: OrderStatus;
  notes?: string;
  created_at: string;
};
