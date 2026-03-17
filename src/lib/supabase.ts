import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser-safe client (anon key) — lazy so build works without env vars (e.g. on Vercel)
let _supabase: SupabaseClient | null = null;
export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required");
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// Server-only client (service role — bypasses RLS, for API routes only)
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  return createClient(url, key);
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
