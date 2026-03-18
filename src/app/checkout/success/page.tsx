import Link from "next/link";

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const displayId = session_id
    ? `LT-${session_id.slice(-5).toUpperCase()}`
    : "LT-XXXXX";

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
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              margin: "0 auto 28px",
              background: "linear-gradient(135deg, #C97D60, #FFBCB5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              boxShadow: "0 8px 32px rgba(201,125,96,0.35)",
            }}
          >
            ✓
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#262322",
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Order Confirmed!
          </h1>

          <p
            style={{
              color: "#9B6B5A",
              fontSize: 15,
              lineHeight: 1.8,
              marginBottom: 8,
            }}
          >
            Thank you for your order. Your Longtress Haitian Hair Oil is on its
            way!
          </p>

          <p style={{ color: "#9B6B5A", fontSize: 14, marginBottom: 12 }}>
            Order reference:{" "}
            <strong style={{ color: "#262322" }}>{displayId}</strong>
          </p>

          <p style={{ color: "#C97D60", fontSize: 13, marginBottom: 36 }}>
            A confirmation email with your full order details has been sent.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/track"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                background: "linear-gradient(135deg, #262322, #63372C)",
                color: "#C97D60",
                textDecoration: "none",
              }}
            >
              Track Your Order
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 15,
                background: "transparent",
                color: "#9B6B5A",
                textDecoration: "none",
                border: "1px solid #D5C4B7",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
