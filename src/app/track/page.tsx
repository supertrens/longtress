"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const STATUS_STEPS = ["Pending", "Processing", "Shipped", "Delivered"] as const;

function StatusTimeline({ current }: { current: string }) {
  const idx = STATUS_STEPS.indexOf(current as (typeof STATUS_STEPS)[number]);
  const cancelled = current === "Cancelled";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", margin: "28px 0 8px" }}>
      {STATUS_STEPS.map((step, i) => {
        const done = !cancelled && i <= idx;
        const isActive = !cancelled && i === idx;
        return (
          <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 14,
                  right: "50%",
                  width: "100%",
                  height: 3,
                  background: done ? "linear-gradient(90deg, #C97D60, #D4956E)" : "#E8DDD4",
                  borderRadius: 2,
                  zIndex: 0,
                }}
              />
            )}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: cancelled
                  ? "#E8DDD4"
                  : done
                    ? "linear-gradient(135deg, #C97D60, #A85D42)"
                    : "#F2E5D7",
                border: done ? "none" : "2px solid #E0CFC2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: done ? "#fff" : "#C4AE9B",
                zIndex: 1,
                position: "relative",
                boxShadow: isActive ? "0 0 0 4px rgba(201,125,96,0.2)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {done ? "✓" : i + 1}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                color: done ? "#262322" : "#B8A294",
                marginTop: 8,
                letterSpacing: "0.02em",
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: {
  orderId: string;
  status: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  shippingAddress: { line1: string; city: string; state: string; zip: string };
  shippingMethod: string;
  _creationTime: number;
}}) {
  const date = new Date(order._creationTime).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "32px 28px",
        boxShadow: "0 2px 20px rgba(38,35,34,0.06)",
        border: "1px solid rgba(201,125,96,0.1)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#B8A294", textTransform: "uppercase", letterSpacing: "0.08em" }}>Order</span>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: "#262322", margin: "2px 0 0" }}>
            {order.orderId}
          </h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#B8A294", textTransform: "uppercase", letterSpacing: "0.08em" }}>Placed</span>
          <div style={{ fontSize: 14, color: "#5C4033", marginTop: 2 }}>{date}</div>
        </div>
      </div>

      <StatusTimeline current={order.status} />

      {order.status === "Cancelled" && (
        <div style={{ background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 10, padding: "10px 16px", marginTop: 16, fontSize: 13, color: "#9B2C2C", fontWeight: 500 }}>
          This order has been cancelled.
        </div>
      )}

      <div style={{ marginTop: 24, borderTop: "1px solid #F0E6DD", paddingTop: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#B8A294", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Items</div>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #F2E5D7, #E8D5C4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                🧴
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#262322" }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#B8A294" }}>Qty: {item.qty}</div>
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#262322" }}>${(item.qty * item.price).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 160, background: "#FBF6F0", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#B8A294", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Shipping To</div>
          <div style={{ fontSize: 13, color: "#5C4033", lineHeight: 1.6 }}>
            {order.customerName}<br />
            {order.shippingAddress.line1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </div>
        </div>
        <div style={{ minWidth: 120, background: "#FBF6F0", borderRadius: 12, padding: "14px 16px", textAlign: "right" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#B8A294", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Total</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: "#262322" }}>
            ${order.total.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: "#B8A294", marginTop: 2 }}>
            {order.shippingMethod === "express" ? "Express" : "Standard"} shipping
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState<{ email?: string; orderId?: string } | null>(null);

  const results = useQuery(
    api.orders.lookup,
    searchTerm ?? "skip"
  );

  const loading = searchTerm !== null && results === undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed.toUpperCase().startsWith("LT-")) {
      setSearchTerm({ orderId: trimmed });
    } else {
      setSearchTerm({ email: trimmed.toLowerCase() });
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F2E5D7", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <header style={{ background: "#262322", padding: "0 24px" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C97D60", fontWeight: 700, fontSize: 22, letterSpacing: "0.1em" }}>
              LONGTRESS
            </span>
          </Link>
          <Link href="/" style={{ fontSize: 13, color: "#9B8578", textDecoration: "none", fontWeight: 500 }}>
            ← Back to Shop
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "48px 20px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#C97D60", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
            Order Tracking
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 700, color: "#262322", margin: "0 0 12px" }}>
            Track Your Order
          </h1>
          <p style={{ color: "#9B6B5A", fontSize: 15, lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
            Enter your email address or order ID to view your order status and details.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, marginBottom: 40 }}>
          <input
            type="text"
            placeholder="Email or Order ID (e.g. LT-12345)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: 12,
              border: "1px solid #E0CFC2",
              background: "#fff",
              fontSize: 15,
              color: "#262322",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C97D60")}
            onBlur={(e) => (e.target.style.borderColor = "#E0CFC2")}
          />
          <button
            type="submit"
            style={{
              padding: "14px 28px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #262322, #4A332A)",
              color: "#C97D60",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              whiteSpace: "nowrap",
              fontFamily: "inherit",
              transition: "opacity 0.2s",
            }}
          >
            Track
          </button>
        </form>

        {loading && (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div style={{ width: 32, height: 32, border: "3px solid #E0CFC2", borderTopColor: "#C97D60", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ color: "#9B6B5A", fontSize: 14 }}>Looking up your order...</p>
          </div>
        )}

        {results !== undefined && results.length === 0 && searchTerm && (
          <div style={{ textAlign: "center", padding: "48px 20px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 20px rgba(38,35,34,0.04)" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#262322", fontSize: 20, margin: "0 0 8px" }}>
              No orders found
            </h3>
            <p style={{ color: "#9B6B5A", fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: "0 auto" }}>
              Double-check the email address or order ID you entered. Orders may take a few minutes to appear after checkout.
            </p>
          </div>
        )}

        {results && results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {results.length > 1 && (
              <p style={{ fontSize: 13, color: "#9B6B5A", fontWeight: 500 }}>
                {results.length} order{results.length > 1 ? "s" : ""} found
              </p>
            )}
            {results.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 56, padding: "24px 0", borderTop: "1px solid rgba(201,125,96,0.12)" }}>
          <p style={{ fontSize: 13, color: "#B8A294", lineHeight: 1.8 }}>
            Need help? Contact us at{" "}
            <a href="mailto:support@longtress.com" style={{ color: "#C97D60", fontWeight: 500, textDecoration: "none" }}>
              support@longtress.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
