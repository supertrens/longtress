"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect password. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#262322",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#C97D60",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: 4,
            }}
          >
            LONGTRESS
          </div>
          <div style={{ fontSize: 13, color: "#9B6B5A" }}>Admin Dashboard</div>
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#262322",
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Sign In
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#9B6B5A",
            textAlign: "center",
            marginBottom: 28,
          }}
        >
          Enter your admin password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#9B6B5A",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 12,
                fontSize: 15,
                border: `1px solid ${error ? "#DC2626" : "rgba(201,125,96,0.25)"}`,
                background: "#F2E5D7",
                color: "#262322",
                outline: "none",
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                fontSize: 13,
                color: "#DC2626",
                marginBottom: 16,
                padding: "10px 14px",
                borderRadius: 10,
                background: "rgba(239,68,68,0.07)",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              background: loading
                ? "rgba(201,125,96,0.5)"
                : "linear-gradient(135deg, #C97D60, #FFBCB5)",
              color: "#262322",
              border: "none",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}
