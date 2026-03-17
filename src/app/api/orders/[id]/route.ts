import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendStatusUpdate } from "@/lib/resend";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status } = await req.json();

  const db = supabaseAdmin();

  // Fetch order first (for email)
  const { data: order, error: fetchError } = await db
    .from("orders")
    .select("id, customer_name, customer_email, total")
    .eq("id", id)
    .single();

  if (fetchError || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Update status
  const { error } = await db
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send status email
  try {
    await sendStatusUpdate({
      id: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      status,
      total: order.total,
    });
  } catch (emailErr) {
    console.error("Resend status email error:", emailErr);
    // Non-fatal — status was updated
  }

  return NextResponse.json({ success: true });
}
