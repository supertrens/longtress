"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "overview" | "orders" | "product" | "customers";

const MOCK_ORDERS = [
  { id: "LT-10482", customer: "Jasmine T.", email: "jasmine@email.com", date: "Mar 8, 2025", status: "Delivered", total: 38 },
  { id: "LT-10481", customer: "Monique B.", email: "monique@email.com", date: "Mar 7, 2025", status: "Shipped", total: 76 },
  { id: "LT-10480", customer: "Aaliyah R.", email: "aaliyah@email.com", date: "Mar 7, 2025", status: "Processing", total: 38 },
  { id: "LT-10479", customer: "Tanya M.", email: "tanya@email.com", date: "Mar 6, 2025", status: "Delivered", total: 114 },
  { id: "LT-10478", customer: "Simone D.", email: "simone@email.com", date: "Mar 5, 2025", status: "Delivered", total: 38 },
  { id: "LT-10477", customer: "Naomi K.", email: "naomi@email.com", date: "Mar 5, 2025", status: "Cancelled", total: 38 },
  { id: "LT-10476", customer: "Destiny F.", email: "destiny@email.com", date: "Mar 4, 2025", status: "Shipped", total: 76 },
];

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Delivered: { bg: "rgba(92,42,10,0.1)", color: "#7A3C14" },
  Shipped: { bg: "rgba(200,155,60,0.12)", color: "#A07828" },
  Processing: { bg: "rgba(59,130,246,0.1)", color: "#2563EB" },
  Cancelled: { bg: "rgba(239,68,68,0.1)", color: "#DC2626" },
};

function StatCard({ icon, label, value, change, up }: { icon: string; label: string; value: string; change: string; up: boolean }) {
  return (
    <div style={{
      padding: 24, borderRadius: 20, background: "#fff",
      border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 999,
          background: up ? "rgba(92,42,10,0.08)" : "rgba(239,68,68,0.08)",
          color: up ? "#7A3C14" : "#DC2626",
        }}>
          {up ? "↑" : "↓"} {change}
        </span>
      </div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#5C2A0A", marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#9B6535" }}>{label}</div>
    </div>
  );
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "product", label: "Product", icon: "🌿" },
  { id: "customers", label: "Customers", icon: "👥" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [orderSearch, setOrderSearch] = useState("");

  const filtered = MOCK_ORDERS.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.status.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F0EBE0", fontFamily: "'Inter', system-ui, sans-serif", display: "flex" }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: "#5C2A0A",
        padding: "0 0 24px", display: "flex", flexDirection: "column",
        minHeight: "100vh", position: "sticky", top: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "28px 24px 24px", borderBottom: "1px solid rgba(249,243,232,0.08)" }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C89B3C", fontWeight: 700, fontSize: 20, letterSpacing: "0.08em" }}>
            LONGTRESS
          </div>
          <div style={{ fontSize: 11, color: "rgba(249,243,232,0.35)", marginTop: 2 }}>Admin Dashboard</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", width: "100%", alignItems: "center", gap: 10,
                padding: "11px 12px", borderRadius: 12, marginBottom: 4, cursor: "pointer", border: "none",
                background: tab === t.id ? "rgba(200,155,60,0.15)" : "transparent",
                color: tab === t.id ? "#C89B3C" : "rgba(249,243,232,0.55)",
                fontWeight: tab === t.id ? 600 : 400, fontSize: 14, textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
              {tab === t.id && <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#C89B3C" }} />}
            </button>
          ))}
        </nav>

        {/* View store link */}
        <div style={{ padding: "0 12px" }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "11px 12px", borderRadius: 12,
            background: "rgba(200,155,60,0.08)", color: "#C89B3C", fontSize: 13, fontWeight: 500,
            textDecoration: "none", border: "1px solid rgba(200,155,60,0.2)",
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px 32px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              {tab === "overview" && "Dashboard Overview"}
              {tab === "orders" && "Orders"}
              {tab === "product" && "Product Management"}
              {tab === "customers" && "Customers"}
            </h1>
            <p style={{ color: "#9B6535", fontSize: 13 }}>
              {tab === "overview" && "Your store performance at a glance"}
              {tab === "orders" && "Manage and track customer orders"}
              {tab === "product" && "Manage your Longtress Hair Oil listing"}
              {tab === "customers" && "View and manage customer accounts"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#9B6535" }}>Mar 8, 2025</div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #C89B3C, #E8B848)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#5C2A0A", fontWeight: 700, fontSize: 14,
            }}>A</div>
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
              <StatCard icon="💰" label="Total Revenue" value="$91,200" change="12.4%" up />
              <StatCard icon="📦" label="Total Orders" value="2,400" change="8.1%" up />
              <StatCard icon="👥" label="Customers" value="1,847" change="15.2%" up />
              <StatCard icon="🔄" label="Return Rate" value="2.3%" change="0.5%" up={false} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
              {/* Revenue chart */}
              <div style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 18, fontWeight: 700 }}>Revenue</h3>
                  <select style={{ fontSize: 12, color: "#9B6535", border: "1px solid rgba(200,155,60,0.2)", borderRadius: 8, padding: "4px 8px", background: "#fff" }}>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>

                {/* Chart bars */}
                {(() => {
                  const data = [
                    { day: "Mon", val: 760 },
                    { day: "Tue", val: 1140 },
                    { day: "Wed", val: 912 },
                    { day: "Thu", val: 1520 },
                    { day: "Fri", val: 1368 },
                    { day: "Sat", val: 1900 },
                    { day: "Sun", val: 1216 },
                  ];
                  const max = Math.max(...data.map((d) => d.val));
                  return (
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160 }}>
                      {data.map((d) => (
                        <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                            <div style={{
                              width: "100%", borderRadius: "6px 6px 0 0",
                              height: `${(d.val / max) * 100}%`,
                              background: d.day === "Sat" ? "linear-gradient(135deg, #C89B3C, #E8B848)" : "rgba(200,155,60,0.2)",
                              minHeight: 8,
                            }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#9B6535" }}>{d.day}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Recent orders mini */}
              <div style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recent Orders</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {MOCK_ORDERS.slice(0, 5).map((o) => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#5C2A0A" }}>{o.id}</div>
                        <div style={{ fontSize: 11, color: "#9B6535" }}>{o.customer}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#5C2A0A" }}>${o.total}</div>
                        <span style={{
                          fontSize: 10, padding: "2px 8px", borderRadius: 999,
                          background: STATUS_STYLES[o.status]?.bg,
                          color: STATUS_STYLES[o.status]?.color,
                          fontWeight: 600,
                        }}>{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setTab("orders")}
                  style={{
                    marginTop: 20, width: "100%", padding: "10px", borderRadius: 10, fontSize: 13,
                    background: "rgba(200,155,60,0.08)", color: "#C89B3C", border: "none", cursor: "pointer", fontWeight: 600,
                  }}
                >
                  View All Orders →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            {/* Search + filter */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <svg width="16" height="16" fill="none" stroke="#9B6535" viewBox="0 0 24 24" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders, customers..."
                  style={{
                    width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12, fontSize: 14,
                    border: "1px solid rgba(200,155,60,0.2)", background: "#fff", color: "#5C2A0A", outline: "none",
                  }}
                />
              </div>
              <select style={{
                padding: "11px 16px", borderRadius: 12, fontSize: 14,
                border: "1px solid rgba(200,155,60,0.2)", background: "#fff", color: "#5C2A0A",
              }}>
                <option>All Statuses</option>
                <option>Delivered</option>
                <option>Shipped</option>
                <option>Processing</option>
                <option>Cancelled</option>
              </select>
              <button style={{
                padding: "11px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
                background: "linear-gradient(135deg, #C89B3C, #E8B848)", color: "#5C2A0A", border: "none",
              }}>
                Export CSV
              </button>
            </div>

            {/* Table */}
            <div style={{ borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(92,42,10,0.03)", borderBottom: "1px solid rgba(200,155,60,0.12)" }}>
                    {["Order ID", "Customer", "Date", "Status", "Total", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#9B6535", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(200,155,60,0.08)" : "none" }}>
                      <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#5C2A0A" }}>{o.id}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#5C2A0A" }}>{o.customer}</div>
                        <div style={{ fontSize: 12, color: "#9B6535" }}>{o.email}</div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: "#9B6535" }}>{o.date}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600,
                          background: STATUS_STYLES[o.status]?.bg,
                          color: STATUS_STYLES[o.status]?.color,
                        }}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 15, fontWeight: 700, color: "#5C2A0A" }}>
                        ${o.total.toFixed(2)}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <button style={{
                          padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          background: "rgba(200,155,60,0.1)", color: "#C89B3C", border: "none",
                        }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div style={{ padding: 48, textAlign: "center", color: "#9B6535", fontSize: 14 }}>
                  No orders found matching your search.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCT TAB ── */}
        {tab === "product" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Product card */}
            <div style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)" }}>
              <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 100, borderRadius: 14, flexShrink: 0,
                  background: "linear-gradient(135deg, #5C2A0A, #7A3C14)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30,
                }}>🌿</div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
                    Longtress Haitian Hair Oil
                  </h3>
                  <div style={{ fontSize: 13, color: "#9B6535", marginBottom: 8 }}>SKU: LT-OIL-001 · 120 mL</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(92,42,10,0.08)", fontSize: 12, fontWeight: 600, color: "#7A3C14" }}>
                    ● In Stock
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Price", value: "$38.00" },
                  { label: "Stock", value: "847 units" },
                  { label: "Total Sold", value: "2,400 units" },
                  { label: "Rating", value: "⭐ 4.9 (2,400 reviews)" },
                ].map((row) => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 12, borderBottom: "1px solid rgba(200,155,60,0.08)" }}>
                    <span style={{ fontSize: 13, color: "#9B6535" }}>{row.label}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#5C2A0A" }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit form */}
            <div style={{ padding: 28, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#5C2A0A", fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Edit Product</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Product Name", value: "Longtress Haitian Hair Oil" },
                  { label: "Price ($)", value: "38.00" },
                  { label: "Stock Quantity", value: "847" },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#9B6535", marginBottom: 6 }}>{f.label}</label>
                    <input
                      defaultValue={f.value}
                      style={{
                        width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
                        border: "1px solid rgba(200,155,60,0.2)", background: "#FBF6F0", color: "#5C2A0A", outline: "none",
                      }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#9B6535", marginBottom: 6 }}>Description</label>
                  <textarea
                    rows={4}
                    defaultValue="Premium Haitian black castor oil, cold-pressed and traditionally crafted..."
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10, fontSize: 14,
                      border: "1px solid rgba(200,155,60,0.2)", background: "#FBF6F0", color: "#5C2A0A", outline: "none", resize: "vertical",
                      fontFamily: "'Inter', system-ui, sans-serif",
                    }}
                  />
                </div>
                <button style={{
                  padding: "13px", borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: "pointer",
                  background: "linear-gradient(135deg, #C89B3C, #E8B848)", color: "#5C2A0A", border: "none",
                }}>
                  Save Changes
                </button>
              </div>
            </div>

            {/* Inventory alert */}
            <div style={{
              gridColumn: "1 / -1", padding: 20, borderRadius: 16,
              background: "rgba(200,155,60,0.08)", border: "1px solid rgba(200,155,60,0.2)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, color: "#A07828", fontSize: 14, marginBottom: 2 }}>Low Stock Alert Threshold</div>
                <div style={{ fontSize: 13, color: "#9B6535" }}>
                  You have set an alert when stock falls below 100 units. Current stock: 847 units — you are good!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {tab === "customers" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
              {[
                { icon: "👥", label: "Total Customers", value: "1,847", note: "+15% this month" },
                { icon: "🔁", label: "Repeat Buyers", value: "62%", note: "Order 2+ times" },
                { icon: "⭐", label: "Avg. Rating", value: "4.9", note: "From verified buyers" },
              ].map((s) => (
                <div key={s.label} style={{ padding: 24, borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)" }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "#5C2A0A", marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#9B6535", fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "#C89B3C", marginTop: 4 }}>{s.note}</div>
                </div>
              ))}
            </div>

            {/* Customer list */}
            <div style={{ borderRadius: 20, background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(92,42,10,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(92,42,10,0.03)", borderBottom: "1px solid rgba(200,155,60,0.12)" }}>
                    {["Customer", "Orders", "Spent", "Last Order", "Status"].map((h) => (
                      <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#9B6535", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_ORDERS.map((o, i) => (
                    <tr key={o.id} style={{ borderBottom: i < MOCK_ORDERS.length - 1 ? "1px solid rgba(200,155,60,0.08)" : "none" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: "linear-gradient(135deg, #5C2A0A, #7A3C14)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#C89B3C", fontWeight: 700, fontSize: 13, flexShrink: 0,
                          }}>
                            {o.customer[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: "#5C2A0A" }}>{o.customer}</div>
                            <div style={{ fontSize: 12, color: "#9B6535" }}>{o.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600, color: "#5C2A0A" }}>
                        {Math.ceil(o.total / 38)}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 700, color: "#5C2A0A" }}>
                        ${o.total}
                      </td>
                      <td style={{ padding: "16px 20px", fontSize: 13, color: "#9B6535" }}>{o.date}</td>
                      <td style={{ padding: "16px 20px" }}>
                        <span style={{
                          fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600,
                          background: STATUS_STYLES[o.status]?.bg, color: STATUS_STYLES[o.status]?.color,
                        }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
