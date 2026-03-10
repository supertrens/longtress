"use client";

import { useState } from "react";
import Link from "next/link";

function BottleSVG() {
  return (
    <svg width="80" height="120" viewBox="0 0 140 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="10" width="36" height="22" rx="6" fill="#C89B3C" />
      <rect x="56" y="8" width="28" height="6" rx="3" fill="#A07828" />
      <rect x="58" y="30" width="24" height="20" rx="4" fill="#7A3C14" />
      <path d="M50 50 Q38 62 36 80 H104 Q102 62 90 50 Z" fill="#7A3C14" />
      <rect x="30" y="78" width="80" height="112" rx="16" fill="#7A3C14" />
      <rect x="38" y="95" width="64" height="80" rx="8" fill="rgba(249,243,232,0.08)" stroke="rgba(200,155,60,0.35)" strokeWidth="1.5" />
      <text x="70" y="118" textAnchor="middle" fill="#C89B3C" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">LONGTRESS</text>
      <text x="70" y="132" textAnchor="middle" fill="rgba(249,243,232,0.6)" fontSize="7" fontFamily="Arial, sans-serif" letterSpacing="2">HAITIAN OIL</text>
      <rect x="30" y="188" width="80" height="4" rx="2" fill="#5C2A0A" />
    </svg>
  );
}

export default function CartPage() {
  const [qty, setQty] = useState(1);
  const price = 38;
  const subtotal = price * qty;
  const shipping = subtotal >= 60 ? 0 : 7.99;
  const total = subtotal + shipping;

  return (
    <div style={{ minHeight: "100vh", background: "#FBF6F0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#5C2A0A", padding: "0 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C89B3C", fontWeight: 700, fontSize: 22, letterSpacing: "0.1em" }}>LONGTRESS</span>
          </Link>
          <Link href="/" style={{ color: "rgba(249,243,232,0.55)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 1024, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#5C2A0A", fontSize: 36, fontWeight: 700, marginBottom: 40 }}>
          Your Cart
        </h1>

        <div className="cart-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
          {/* Cart items */}
          <div>
            {/* Item */}
            <div className="cart-item-card" style={{
              display: "flex", gap: 24, padding: 28, borderRadius: 20,
              background: "#fff", border: "1px solid rgba(200,155,60,0.12)",
              boxShadow: "0 2px 16px rgba(92,42,10,0.06)", marginBottom: 16,
            }}>
              {/* Image */}
              <div style={{
                width: 100, height: 120, borderRadius: 16, flexShrink: 0,
                background: "linear-gradient(135deg, #5C2A0A, #7A3C14)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BottleSVG />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <div className="cart-item-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                      Longtress Haitian Hair Oil
                    </h3>
                    <p style={{ color: "#9B6535", fontSize: 13 }}>120 mL · Cold-Pressed Black Castor Oil</p>
                  </div>
                  <div style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 22, fontWeight: 700 }}>
                    ${(price * qty).toFixed(2)}
                  </div>
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Qty */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    border: "1px solid rgba(200,155,60,0.3)", borderRadius: 999,
                    overflow: "hidden",
                  }}>
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      style={{ width: 36, height: 40, background: "none", border: "none", color: "#C89B3C", fontSize: 18, cursor: "pointer" }}
                    >−</button>
                    <span style={{ width: 28, textAlign: "center", color: "#5C2A0A", fontWeight: 500 }}>{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      style={{ width: 36, height: 40, background: "none", border: "none", color: "#C89B3C", fontSize: 18, cursor: "pointer" }}
                    >+</button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => setQty(0)}
                    style={{ background: "none", border: "none", color: "#C89B3C", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Free shipping notice */}
            {subtotal < 60 && (
              <div style={{
                padding: "14px 20px", borderRadius: 12,
                background: "rgba(200,155,60,0.08)", border: "1px solid rgba(200,155,60,0.2)",
                fontSize: 13, color: "#9B6535", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span>🚚</span>
                <span>Add <strong style={{ color: "#C89B3C" }}>${(60 - subtotal).toFixed(2)}</strong> more for free shipping!</span>
              </div>
            )}
            {subtotal >= 60 && (
              <div style={{
                padding: "14px 20px", borderRadius: 12,
                background: "rgba(92,42,10,0.06)", border: "1px solid rgba(92,42,10,0.12)",
                fontSize: 13, color: "#7A3C14", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span>✓</span>
                <span style={{ fontWeight: 600 }}>You qualify for free shipping!</span>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div style={{
              padding: 28, borderRadius: 20,
              background: "#fff", border: "1px solid rgba(200,155,60,0.12)",
              boxShadow: "0 2px 16px rgba(92,42,10,0.06)",
              position: "sticky", top: 80,
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9B6535" }}>
                  <span>Subtotal ({qty} item{qty !== 1 ? "s" : ""})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9B6535" }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#7A3C14" : "#9B6535", fontWeight: shipping === 0 ? 600 : 400 }}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#9B6535" }}>
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div style={{
                borderTop: "1px solid rgba(200,155,60,0.15)",
                paddingTop: 16, marginBottom: 24,
                display: "flex", justifyContent: "space-between",
              }}>
                <span style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 18, fontWeight: 700 }}>Total</span>
                <span style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 22, fontWeight: 700 }}>${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" style={{
                display: "block", textAlign: "center",
                padding: "14px 24px", borderRadius: 999, fontWeight: 600, fontSize: 15,
                background: "linear-gradient(135deg, #C89B3C, #E8B848)", color: "#5C2A0A",
                textDecoration: "none", boxShadow: "0 8px 24px rgba(200,155,60,0.35)",
                marginBottom: 14,
              }}>
                Proceed to Checkout →
              </Link>

              <div style={{ textAlign: "center", fontSize: 12, color: "#9B6535" }}>
                🔒 Secure checkout · Powered by Stripe
              </div>

              {/* Payment icons */}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
                {["Visa", "MC", "AMEX", "GPay"].map((p) => (
                  <div key={p} style={{
                    padding: "4px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
                    background: "rgba(92,42,10,0.06)", color: "#9B6535", border: "1px solid rgba(92,42,10,0.1)",
                  }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .cart-item-card { padding: 16px !important; gap: 14px !important; }
          .cart-item-header { flex-direction: column !important; justify-content: flex-start !important; gap: 6px !important; }
        }
      `}</style>
    </div>
  );
}
