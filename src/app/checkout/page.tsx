"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

type Step = "info" | "shipping" | "payment";

const STEPS_LIST: { id: Step; label: string }[] = [
  { id: "info", label: "Information" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
];

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

function Input({
  label,
  placeholder,
  type = "text",
  half = false,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  half?: boolean;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div style={{ flex: half ? "1 1 calc(50% - 8px)" : "1 1 100%" }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: error ? "#dc2626" : "#9B6B5A",
          marginBottom: 6,
          letterSpacing: "0.03em",
        }}
      >
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: 12,
          fontSize: 14,
          border: `1px solid ${error ? "#dc2626" : "rgba(201,125,96,0.2)"}`,
          background: "#fff",
          color: "#262322",
          outline: "none",
          fontFamily: "'Inter', system-ui, sans-serif",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <div style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  );
}

function StepDot({ step, current }: { step: Step; current: Step }) {
  const order: Step[] = ["info", "shipping", "payment"];
  const stepIdx = order.indexOf(step);
  const currentIdx = order.indexOf(current);
  const done = stepIdx < currentIdx;
  const active = step === current;

  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: done
          ? "#C97D60"
          : active
            ? "#262322"
            : "rgba(38,35,34,0.08)",
        color: done ? "#262322" : active ? "#C97D60" : "#9B6B5A",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
        transition: "all 0.3s ease",
      }}
    >
      {done ? "✓" : order.indexOf(step) + 1}
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState<Step>("info");
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard",
  );
  const [qty] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const product = useQuery(api.products.get);
  const unitPrice = product?.price ?? 0;
  const productName = product?.name ?? "Longtress Haitian Hair Oil";
  const productSize = product?.size ?? "120 mL";

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const set = (field: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const subtotal = unitPrice * qty;
  const shippingCost = shippingMethod === "express" ? 14.99 : 0;
  const tax = (subtotal + shippingCost) * 0.08;
  const total = subtotal + shippingCost + tax;

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateInfo = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Valid email required";
    if (!form.address.trim()) errs.address = "Required";
    if (!form.city.trim()) errs.city = "Required";
    if (!form.state.trim()) errs.state = "Required";
    if (!form.zip.trim()) errs.zip = "Required";
    if (!form.country.trim()) errs.country = "Required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    const order: Step[] = ["info", "shipping", "payment"];
    const idx = order.indexOf(step);
    if (step === "info" && !validateInfo()) return;
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const prevStep = () => {
    const order: Step[] = ["info", "shipping", "payment"];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          apt: form.apt,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
          shippingMethod,
          qty,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F2E5D7",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header style={{ background: "#262322", padding: "0 24px" }}>
        <div
          style={{
            maxWidth: 1024,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#C97D60",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "0.1em",
              }}
            >
              LONGTRESS
            </span>
          </Link>
          <div
            className="checkout-steps"
            style={{ display: "flex", alignItems: "center", gap: 16 }}
          >
            {STEPS_LIST.map((s, i) => (
              <div
                key={s.id}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <StepDot step={s.id} current={step} />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: s.id === step ? "#C97D60" : "rgba(242,229,215,0.4)",
                  }}
                >
                  {s.label}
                </span>
                {i < STEPS_LIST.length - 1 && (
                  <div
                    style={{
                      width: 24,
                      height: 1,
                      background: "rgba(201,125,96,0.2)",
                      marginLeft: 4,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div
        className="checkout-grid"
        style={{
          maxWidth: 1024,
          margin: "0 auto",
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 32,
        }}
      >
        {/* Left: Form */}
        <div>
          {/* STEP: INFO */}
          {step === "info" && (
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#262322",
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 28,
                }}
              >
                Contact Information
              </h2>
              <div
                className="checkout-card"
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid rgba(201,125,96,0.12)",
                  boxShadow: "0 2px 16px rgba(38,35,34,0.05)",
                  marginBottom: 24,
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Input
                    label="First Name"
                    placeholder="Marie"
                    half
                    value={form.firstName}
                    onChange={set("firstName")}
                    error={fieldErrors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="Joseph"
                    half
                    value={form.lastName}
                    onChange={set("lastName")}
                    error={fieldErrors.lastName}
                    required
                  />
                  <Input
                    label="Email Address"
                    placeholder="marie@example.com"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    error={fieldErrors.email}
                    required
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
              </div>

              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#262322",
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 28,
                }}
              >
                Shipping Address
              </h2>
              <div
                className="checkout-card"
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid rgba(201,125,96,0.12)",
                  boxShadow: "0 2px 16px rgba(38,35,34,0.05)",
                }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Input
                    label="Address"
                    placeholder="123 Main Street"
                    value={form.address}
                    onChange={set("address")}
                    error={fieldErrors.address}
                    required
                  />
                  <Input
                    label="Apartment, suite, etc. (optional)"
                    placeholder="Apt 4B"
                    value={form.apt}
                    onChange={set("apt")}
                  />
                  <Input
                    label="City"
                    placeholder="Miami"
                    half
                    value={form.city}
                    onChange={set("city")}
                    error={fieldErrors.city}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="FL"
                    half
                    value={form.state}
                    onChange={set("state")}
                    error={fieldErrors.state}
                    required
                  />
                  <Input
                    label="ZIP Code"
                    placeholder="33101"
                    half
                    value={form.zip}
                    onChange={set("zip")}
                    error={fieldErrors.zip}
                    required
                  />
                  <Input
                    label="Country"
                    placeholder="United States"
                    half
                    value={form.country}
                    onChange={set("country")}
                    error={fieldErrors.country}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP: SHIPPING */}
          {step === "shipping" && (
            <div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#262322",
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 28,
                }}
              >
                Shipping Method
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  {
                    id: "standard" as const,
                    name: "Standard Shipping",
                    time: "5-7 business days",
                    price: "FREE",
                    note: "Free on all orders",
                  },
                  {
                    id: "express" as const,
                    name: "Express Shipping",
                    time: "2-3 business days",
                    price: "$14.99",
                    note: "Guaranteed delivery",
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setShippingMethod(opt.id)}
                    style={{
                      padding: 24,
                      borderRadius: 20,
                      cursor: "pointer",
                      background:
                        shippingMethod === opt.id
                          ? "rgba(201,125,96,0.06)"
                          : "#fff",
                      border: `2px solid ${shippingMethod === opt.id ? "#C97D60" : "rgba(201,125,96,0.15)"}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${shippingMethod === opt.id ? "#C97D60" : "rgba(38,35,34,0.2)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {shippingMethod === opt.id && (
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: "#C97D60",
                              }}
                            />
                          )}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 15,
                              color: "#262322",
                              marginBottom: 2,
                            }}
                          >
                            {opt.name}
                          </div>
                          <div style={{ fontSize: 13, color: "#9B6B5A" }}>
                            {opt.time} · {opt.note}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: opt.id === "standard" ? "#63372C" : "#262322",
                        }}
                      >
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
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#262322",
                  fontSize: 26,
                  fontWeight: 700,
                  marginBottom: 28,
                }}
              >
                Payment
              </h2>
              <div
                className="checkout-card"
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid rgba(201,125,96,0.12)",
                  boxShadow: "0 2px 16px rgba(38,35,34,0.05)",
                }}
              >
                {/* Security badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 28,
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "rgba(38,35,34,0.04)",
                    border: "1px solid rgba(38,35,34,0.08)",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    stroke="#63372C"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span
                    style={{ fontSize: 13, color: "#63372C", fontWeight: 500 }}
                  >
                    All transactions are secure and encrypted · Powered by
                    Stripe
                  </span>
                </div>

                {/* Stripe redirect info */}
                <div style={{ textAlign: "center", padding: "32px 24px" }}>
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      margin: "0 auto 20px",
                      background: "linear-gradient(135deg, #262322, #63372C)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      stroke="#C97D60"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <p
                    style={{
                      color: "#262322",
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    Pay Securely with Stripe
                  </p>
                  <p
                    style={{
                      color: "#9B6B5A",
                      fontSize: 14,
                      lineHeight: 1.7,
                      marginBottom: 28,
                    }}
                  >
                    You'll be redirected to Stripe's secure checkout to enter
                    your payment details. We never see or store your card
                    information.
                  </p>

                  {/* Card brand logos */}
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {[
                      "Visa",
                      "Mastercard",
                      "Amex",
                      "Apple Pay",
                      "Google Pay",
                    ].map((brand) => (
                      <div
                        key={brand}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          border: "1px solid rgba(201,125,96,0.2)",
                          color: "#9B6B5A",
                          background: "rgba(242,229,215,0.5)",
                        }}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total summary */}
                <div
                  style={{
                    borderTop: "1px solid rgba(201,125,96,0.15)",
                    paddingTop: 20,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "#9B6B5A", fontSize: 14 }}>
                    Total charged today
                  </span>
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      color: "#262322",
                      fontSize: 22,
                    }}
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>

                {error && (
                  <div
                    style={{
                      marginTop: 16,
                      padding: "12px 16px",
                      borderRadius: 10,
                      background: "rgba(220,38,38,0.06)",
                      border: "1px solid rgba(220,38,38,0.2)",
                      color: "#dc2626",
                      fontSize: 13,
                    }}
                  >
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 32,
            }}
          >
            {step !== "info" ? (
              <button
                onClick={prevStep}
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  fontWeight: 500,
                  fontSize: 14,
                  background: "none",
                  border: "1px solid rgba(38,35,34,0.2)",
                  color: "#9B6B5A",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
            ) : (
              <Link
                href="/cart"
                style={{
                  padding: "12px 24px",
                  borderRadius: 999,
                  fontWeight: 500,
                  fontSize: 14,
                  border: "1px solid rgba(38,35,34,0.2)",
                  color: "#9B6B5A",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                ← Back to Cart
              </Link>
            )}

            {step !== "payment" ? (
              <button
                onClick={nextStep}
                style={{
                  padding: "14px 36px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #C97D60, #FFBCB5)",
                  color: "#262322",
                  border: "none",
                  boxShadow: "0 8px 24px rgba(201,125,96,0.35)",
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                style={{
                  padding: "14px 36px",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "rgba(201,125,96,0.5)"
                    : "linear-gradient(135deg, #C97D60, #FFBCB5)",
                  color: "#262322",
                  border: "none",
                  boxShadow: loading
                    ? "none"
                    : "0 8px 24px rgba(201,125,96,0.35)",
                  transition: "all 0.2s ease",
                }}
              >
                {loading
                  ? "Redirecting to Stripe…"
                  : `Pay $${total.toFixed(2)} →`}
              </button>
            )}
          </div>
        </div>

        {/* Right: Order summary */}
        <div>
          <div
            style={{
              padding: 24,
              borderRadius: 20,
              background: "#fff",
              border: "1px solid rgba(201,125,96,0.12)",
              boxShadow: "0 2px 16px rgba(38,35,34,0.06)",
              position: "sticky",
              top: 80,
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#262322",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              Order Summary
            </h3>

            {/* Product */}
            <div
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 20,
                paddingBottom: 20,
                borderBottom: "1px solid rgba(201,125,96,0.1)",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 70,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: "linear-gradient(135deg, #262322, #63372C)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🌿
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#262322",
                    marginBottom: 2,
                  }}
                >
                  {productName}
                </div>
                <div style={{ fontSize: 12, color: "#9B6B5A" }}>
                  {productSize} · Qty {qty}
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#262322" }}>
                ${(unitPrice * qty).toFixed(2)}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#9B6B5A",
                }}
              >
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#9B6B5A",
                }}
              >
                <span>Shipping</span>
                <span
                  style={{
                    color: shippingCost === 0 ? "#63372C" : "#9B6B5A",
                    fontWeight: shippingCost === 0 ? 600 : 400,
                  }}
                >
                  {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "#9B6B5A",
                }}
              >
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(201,125,96,0.15)",
                paddingTop: 14,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: "#262322",
                  fontSize: 16,
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  color: "#262322",
                  fontSize: 20,
                }}
              >
                ${total.toFixed(2)}
              </span>
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
          .checkout-grid { padding: 24px 16px !important; }
          .checkout-card { padding: 20px !important; }
        }
      `}</style>
    </div>
  );
}
