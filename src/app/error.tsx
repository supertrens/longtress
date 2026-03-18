"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F2E5D7",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ background: "#262322", padding: "0 24px" }}>
        <div
          style={{
            maxWidth: 1024,
            margin: "0 auto",
            height: 64,
            display: "flex",
            alignItems: "center",
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
        </div>
      </header>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#262322",
              fontSize: 28,
              fontWeight: 600,
              margin: "0 0 12px",
            }}
          >
            Something Went Wrong
          </h1>
          <p
            style={{
              color: "#9B6B5A",
              fontSize: 15,
              lineHeight: 1.7,
              marginBottom: 32,
            }}
          >
            We're sorry for the inconvenience. Please try again or return to the
            home page.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                padding: "14px 32px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                background: "linear-gradient(135deg, #262322, #63372C)",
                color: "#C97D60",
                border: "none",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
            <Link
              href="/"
              style={{
                padding: "14px 32px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                background: "transparent",
                color: "#9B6B5A",
                textDecoration: "none",
                border: "1px solid #D5C4B7",
                display: "inline-block",
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
