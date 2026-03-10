"use client";

import { useState } from "react";
import Link from "next/link";

type Step = "info" | "shipping" | "payment" | "confirm";

const STEPS_LIST: { id: Step; label: string }[] = [
  { id: "info", label: "Information" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "confirm", label: "Confirm" },
];

function Input({ label, placeholder, type = "text", half = false }: { label: string; placeholder?: string; type?: string; half?: boolean }) {
  return (
    <div className={half ? "input-half" : ""} style={{ flex: half ? "1 1 calc(50% - 8px)" : "1 1 100%" }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#9B6535", marginBottom: 6, letterSpacing: "0.03em" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: 12, fontSize: 14,
          border: "1px solid rgba(200,155,60,0.2)", background: "#fff",
          color: "#5C2A0A", outline: "none",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      />
    </div>
  );
}

function StepDot({ step, current }: { step: Step; current: Step }) {
  const order: Step[] = ["info", "shipping", "payment", "confirm"];
  const stepIdx = order.indexOf(step);
  const currentIdx = order.indexOf(current);
  const done = stepIdx < currentIdx;
  const active = step === current;

  return (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: done ? "#C89B3C" : active ? "#5C2A0A" : "rgba(92,42,10,0.08)",
      color: done ? "#5C2A0A" : active ? "#C89B3C" : "#9B6535",
      fontSize: 13, fontWeight: 700, flexShrink: 0,
      transition: "all 0.3s ease",
    }}>
      {done ? "✓" : order.indexOf(step) + 1}
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("info");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">("standard");

  const subtotal = 38;
  const shippingCost = shippingMethod === "express" ? 14.99 : 0;
  const tax = (subtotal + shippingCost) * 0.08;
  const total = subtotal + shippingCost + tax;

  const nextStep = () => {
    const order: Step[] = ["info", "shipping", "payment", "confirm"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const prevStep = () => {
    const order: Step[] = ["info", "shipping", "payment", "confirm"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  if (step === "confirm") {
    return (
      <div style={{ minHeight: "100vh", background: "#FBF6F0", fontFamily: "'Inter', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
        <header style={{ background: "#5C2A0A", padding: "0 24px" }}>
          <div style={{ maxWidth: 1024, margin: "0 auto", height: 64, display: "flex", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C89B3C", fontWeight: 700, fontSize: 22, letterSpacing: "0.1em" }}>LONGTRESS</span>
            </Link>
          </div>
        </header>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
          <div style={{ textAlign: "center", maxWidth: 480 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 28px",
              background: "linear-gradient(135deg, #C89B3C, #E8B848)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, boxShadow: "0 8px 32px rgba(200,155,60,0.35)",
            }}>✓</div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#5C2A0A", fontSize: 36, fontWeight: 700, marginBottom: 16 }}>
              Order Confirmed!
            </h1>
            <p style={{ color: "#9B6535", fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
              Thank you for your order. Your Longtress Haitian Hair Oil is on its way!
            </p>
            <p style={{ color: "#9B6535", fontSize: 14, marginBottom: 32 }}>
              Order #LT-{Math.floor(Math.random() * 90000 + 10000)} · A confirmation email has been sent.
            </p>
            <Link href="/" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 32px", borderRadius: 999, fontWeight: 600, fontSize: 15,
              background: "linear-gradient(135deg, #5C2A0A, #7A3C14)", color: "#C89B3C",
              textDecoration: "none",
            }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FBF6F0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#5C2A0A", padding: "0 24px" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C89B3C", fontWeight: 700, fontSize: 22, letterSpacing: "0.1em" }}>LONGTRESS</span>
          </Link>
          <div className="checkout-steps" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {STEPS_LIST.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <StepDot step={s.id} current={step} />
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: s.id === step ? "#C89B3C" : "rgba(249,243,232,0.4)",
                }}>
                  {s.label}
                </span>
                {i < STEPS_LIST.length - 1 && (
                  <div style={{ width: 24, height: 1, background: "rgba(200,155,60,0.2)", marginLeft: 4 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="checkout-grid" style={{ maxWidth: 1024, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        {/* Left: Form */}
        <div>
          {/* STEP: INFO */}
          {step === "info" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 26, fontWeight: 700, marginBottom: 28 }}>
                Contact Information
              </h2>
              <div className="checkout-card" style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.12)", boxShadow: "0 2px 16px rgba(92,42,10,0.05)", marginBottom: 24 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Input label="First Name" placeholder="Marie" half />
                  <Input label="Last Name" placeholder="Joseph" half />
                  <Input label="Email Address" placeholder="marie@example.com" type="email" />
                  <Input label="Phone Number" placeholder="+1 (555) 000-0000" type="tel" />
                </div>
              </div>

              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 26, fontWeight: 700, marginBottom: 28 }}>
                Shipping Address
              </h2>
              <div className="checkout-card" style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.12)", boxShadow: "0 2px 16px rgba(92,42,10,0.05)" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Input label="Address" placeholder="123 Main Street" />
                  <Input label="Apartment, suite, etc. (optional)" placeholder="Apt 4B" />
                  <Input label="City" placeholder="Miami" half />
                  <Input label="State" placeholder="FL" half />
                  <Input label="ZIP Code" placeholder="33101" half />
                  <Input label="Country" placeholder="United States" half />
                </div>
              </div>
            </div>
          )}

          {/* STEP: SHIPPING */}
          {step === "shipping" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 26, fontWeight: 700, marginBottom: 28 }}>
                Shipping Method
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { id: "standard" as const, name: "Standard Shipping", time: "5-7 business days", price: "FREE", note: "Free on orders over $60" },
                  { id: "express" as const, name: "Express Shipping", time: "2-3 business days", price: "$14.99", note: "Guaranteed delivery" },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    style={{
                      padding: 24, borderRadius: 20, cursor: "pointer",
                      background: shippingMethod === opt.id ? "rgba(200,155,60,0.06)" : "#fff",
                      border: `2px solid ${shippingMethod === opt.id ? "#C89B3C" : "rgba(200,155,60,0.15)"}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          border: `2px solid ${shippingMethod === opt.id ? "#C89B3C" : "rgba(92,42,10,0.2)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {shippingMethod === opt.id && (
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C89B3C" }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: "#5C2A0A", marginBottom: 2 }}>{opt.name}</div>
                          <div style={{ fontSize: 13, color: "#9B6535" }}>{opt.time} · {opt.note}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: opt.id === "standard" ? "#7A3C14" : "#5C2A0A" }}>
                        {opt.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP: PAYMENT */}
          {step === "payment" && (
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 26, fontWeight: 700, marginBottom: 28 }}>
                Payment
              </h2>
              <div className="checkout-card" style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.12)", boxShadow: "0 2px 16px rgba(92,42,10,0.05)" }}>
                {/* Stripe-style card UI */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, padding: "10px 16px", borderRadius: 12, background: "rgba(92,42,10,0.04)", border: "1px solid rgba(92,42,10,0.08)" }}>
                  <svg width="18" height="18" fill="none" stroke="#7A3C14" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span style={{ fontSize: 13, color: "#7A3C14", fontWeight: 500 }}>All transactions are secure and encrypted · Powered by Stripe</span>
                </div>

                {/* Card visual */}
                <div style={{
                  width: "100%", height: 160, borderRadius: 20, marginBottom: 28,
                  background: "linear-gradient(135deg, #5C2A0A, #7A3C14)",
                  padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between",
                  boxShadow: "0 8px 32px rgba(92,42,10,0.25)", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(200,155,60,0.1)" }} />
                  <div style={{ position: "absolute", top: 40, right: 20, width: 70, height: 70, borderRadius: "50%", background: "rgba(200,155,60,0.07)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", color: "#C89B3C", fontWeight: 700, fontSize: 16, letterSpacing: "0.1em" }}>LONGTRESS</span>
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                      <rect width="40" height="24" rx="4" fill="rgba(255,255,255,0.05)" />
                      <circle cx="16" cy="12" r="8" fill="#C89B3C" opacity="0.8" />
                      <circle cx="24" cy="12" r="8" fill="#E8B848" opacity="0.6" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: "rgba(249,243,232,0.4)", fontSize: 11, marginBottom: 4, letterSpacing: "0.1em" }}>CARD NUMBER</div>
                    <div style={{ color: "rgba(249,243,232,0.7)", fontSize: 15, letterSpacing: "0.2em", fontFamily: "monospace" }}>•••• •••• •••• ••••</div>
                  </div>
                  <div style={{ display: "flex", gap: 40 }}>
                    <div>
                      <div style={{ color: "rgba(249,243,232,0.4)", fontSize: 10, letterSpacing: "0.1em" }}>CARDHOLDER</div>
                      <div style={{ color: "rgba(249,243,232,0.75)", fontSize: 13 }}>Your Name</div>
                    </div>
                    <div>
                      <div style={{ color: "rgba(249,243,232,0.4)", fontSize: 10, letterSpacing: "0.1em" }}>EXPIRES</div>
                      <div style={{ color: "rgba(249,243,232,0.75)", fontSize: 13 }}>MM / YY</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Input label="Cardholder Name" placeholder="Marie Joseph" />
                  <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                  <div style={{ display: "flex", gap: 16 }}>
                    <Input label="Expiry Date" placeholder="MM / YY" half />
                    <Input label="Security Code (CVV)" placeholder="•••" half />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
            {step !== "info" ? (
              <button
                onClick={prevStep}
                style={{
                  padding: "12px 24px", borderRadius: 999, fontWeight: 500, fontSize: 14,
                  background: "none", border: "1px solid rgba(92,42,10,0.2)", color: "#9B6535", cursor: "pointer",
                }}
              >
                ← Back
              </button>
            ) : (
              <Link href="/cart" style={{
                padding: "12px 24px", borderRadius: 999, fontWeight: 500, fontSize: 14,
                border: "1px solid rgba(92,42,10,0.2)", color: "#9B6535",
                textDecoration: "none", display: "inline-block",
              }}>
                ← Back to Cart
              </Link>
            )}

            <button
              onClick={nextStep}
              style={{
                padding: "14px 36px", borderRadius: 999, fontWeight: 600, fontSize: 15, cursor: "pointer",
                background: "linear-gradient(135deg, #C89B3C, #E8B848)", color: "#5C2A0A",
                border: "none", boxShadow: "0 8px 24px rgba(200,155,60,0.35)",
              }}
            >
              {step === "payment" ? `Place Order — $${total.toFixed(2)}` : "Continue →"}
            </button>
          </div>
        </div>

        {/* Right: Order summary */}
        <div>
          <div style={{
            padding: 24, borderRadius: 20,
            background: "#fff", border: "1px solid rgba(200,155,60,0.12)",
            boxShadow: "0 2px 16px rgba(92,42,10,0.06)",
            position: "sticky", top: 80,
          }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              Order Summary
            </h3>

            {/* Product */}
            <div style={{ display: "flex", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(200,155,60,0.1)" }}>
              <div style={{
                width: 56, height: 70, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #5C2A0A, #7A3C14)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              }}>🌿</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#5C2A0A", marginBottom: 2 }}>Longtress Haitian Hair Oil</div>
                <div style={{ fontSize: 12, color: "#9B6535" }}>120 mL · Qty 1</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#5C2A0A" }}>$38.00</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9B6535" }}>
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9B6535" }}>
                <span>Shipping</span>
                <span style={{ color: shippingCost === 0 ? "#7A3C14" : "#9B6535", fontWeight: shippingCost === 0 ? 600 : 400 }}>
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#9B6535" }}>
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div style={{
              borderTop: "1px solid rgba(200,155,60,0.15)", paddingTop: 14,
              display: "flex", justifyContent: "space-between",
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#5C2A0A", fontSize: 16 }}>Total</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#5C2A0A", fontSize: 20 }}>${total.toFixed(2)}</span>
            </div>

            {/* Promo code */}
            <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
              <input
                placeholder="Promo code"
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10, fontSize: 13,
                  border: "1px solid rgba(200,155,60,0.2)", background: "rgba(249,243,232,0.5)", color: "#5C2A0A", outline: "none",
                }}
              />
              <button style={{
                padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: "#5C2A0A", color: "#C89B3C", border: "none",
              }}>
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-steps { display: none !important; }
        }
        @media (max-width: 640px) {
          .input-half { flex: 1 1 100% !important; }
          .checkout-grid { padding: 24px 16px !important; }
          .checkout-card { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
