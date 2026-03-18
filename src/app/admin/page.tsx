"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

type Tab = "overview" | "orders" | "product" | "customers";
type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  id: string;
  _convexId?: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; qty: number; price: number }[];
  address: { line1: string; city: string; state: string; zip: string };
  notes?: string;
};


const STATUS_STYLES: Record<OrderStatus | string, { bg: string; color: string }> = {
  Delivered: { bg: "rgba(34,197,94,0.1)", color: "#16A34A" },
  Shipped: { bg: "rgba(201,125,96,0.12)", color: "#A0614A" },
  Processing: { bg: "rgba(59,130,246,0.1)", color: "#2563EB" },
  Pending: { bg: "rgba(156,163,175,0.15)", color: "#6B7280" },
  Cancelled: { bg: "rgba(239,68,68,0.1)", color: "#DC2626" },
};

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function StatCard({
  icon,
  label,
  value,
  change,
  up,
}: {
  icon: string;
  label: string;
  value: string;
  change: string;
  up: boolean;
}) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: "#fff",
        border: "1px solid rgba(201,125,96,0.1)",
        boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 999,
            background: up ? "rgba(38,35,34,0.08)" : "rgba(239,68,68,0.08)",
            color: up ? "#63372C" : "#DC2626",
          }}
        >
          {up ? "↑" : "↓"} {change}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: "#262322",
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "#9B6B5A" }}>{label}</div>
    </div>
  );
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "product", label: "Product", icon: "🌿" },
  { id: "customers", label: "Customers", icon: "👥" },
];

function OrderDetailPanel({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(38,35,34,0.18)",
          zIndex: 40,
        }}
      />
      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 420,
          background: "#fff",
          boxShadow: "-4px 0 40px rgba(38,35,34,0.12)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: "24px 28px",
            borderBottom: "1px solid rgba(201,125,96,0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#262322",
              }}
            >
              {order.id}
            </div>
            <div style={{ fontSize: 12, color: "#9B6B5A", marginTop: 2 }}>
              {order.date}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(38,35,34,0.06)",
              border: "none",
              borderRadius: 10,
              width: 36,
              height: 36,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9B6B5A",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Panel body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {/* Status */}
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              borderRadius: 14,
              background: "#F2E5D7",
              border: "1px solid rgba(201,125,96,0.15)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#9B6B5A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              Order Status
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 13,
                  padding: "5px 14px",
                  borderRadius: 999,
                  fontWeight: 600,
                  background: STATUS_STYLES[order.status]?.bg,
                  color: STATUS_STYLES[order.status]?.color,
                }}
              >
                {order.status}
              </span>
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="#9B6B5A"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <select
                value={order.status}
                onChange={(e) =>
                  onStatusChange(order.id, e.target.value as OrderStatus)
                }
                style={{
                  flex: 1,
                  padding: "7px 12px",
                  borderRadius: 10,
                  fontSize: 13,
                  border: "1px solid rgba(201,125,96,0.25)",
                  background: "#fff",
                  color: "#262322",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer */}
          <Section title="Customer">
            <Row label="Name" value={order.customer} />
            <Row label="Email" value={order.email} />
            <Row label="Phone" value={order.phone} />
          </Section>

          {/* Shipping */}
          <Section title="Shipping Address">
            <Row label="Street" value={order.address.line1} />
            <Row
              label="City"
              value={`${order.address.city}, ${order.address.state} ${order.address.zip}`}
            />
          </Section>

          {/* Items */}
          <Section title="Items Ordered">
            {order.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom:
                    i < order.items.length - 1
                      ? "1px solid rgba(201,125,96,0.08)"
                      : "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#262322" }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#9B6B5A" }}>
                    Qty: {item.qty} × ${item.price}
                  </div>
                </div>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#262322" }}
                >
                  ${(item.qty * item.price).toFixed(2)}
                </div>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 12,
                marginTop: 4,
                borderTop: "2px solid rgba(201,125,96,0.15)",
              }}
            >
              <span
                style={{ fontSize: 14, fontWeight: 700, color: "#262322" }}
              >
                Total
              </span>
              <span
                style={{ fontSize: 16, fontWeight: 700, color: "#C97D60" }}
              >
                ${order.total.toFixed(2)}
              </span>
            </div>
          </Section>

          {/* Notes */}
          {order.notes && (
            <Section title="Notes">
              <p
                style={{
                  fontSize: 13,
                  color: "#9B6B5A",
                  fontStyle: "italic",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {order.notes}
              </p>
            </Section>
          )}
        </div>

        {/* Panel footer */}
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid rgba(201,125,96,0.12)",
            flexShrink: 0,
            display: "flex",
            gap: 10,
          }}
        >
          <a
            href={`mailto:${order.email}`}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: "rgba(201,125,96,0.1)",
              color: "#A0614A",
              border: "1px solid rgba(201,125,96,0.2)",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            ✉ Email Customer
          </a>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: "linear-gradient(135deg, #C97D60, #FFBCB5)",
              color: "#262322",
              border: "none",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#9B6B5A",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          borderRadius: 12,
          border: "1px solid rgba(201,125,96,0.12)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "12px 16px" }}>{children}</div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "7px 0",
        borderBottom: "1px solid rgba(201,125,96,0.07)",
      }}
    >
      <span style={{ fontSize: 12, color: "#9B6B5A" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "#262322" }}>
        {value}
      </span>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", price: "", stock: "", description: "" });
  const [productFormInit, setProductFormInit] = useState(false);

  const rawOrders = useQuery(api.orders.list);
  const product = useQuery(api.products.get);
  const customersData = useQuery(api.orders.customers);
  const updateProductMut = useMutation(api.products.update);
  const seedProductMut = useMutation(api.products.seed);
  const updateStatusAction = useAction(api.orders.updateStatusAndEmail);

  const loadingOrders = rawOrders === undefined;
  const loadingProduct = product === undefined;
  const loadingCustomers = customersData === undefined;

  useEffect(() => {
    if (product === null) {
      seedProductMut().catch(console.error);
    }
  }, [product, seedProductMut]);

  const customers = customersData?.customers ?? [];
  const customerStats = customersData?.stats ?? { total: 0, repeatBuyers: 0, repeatRate: 0 };

  const orders: Order[] = (rawOrders ?? []).map((o) => ({
    id: o.orderId,
    _convexId: o._id,
    customer: o.customerName,
    email: o.customerEmail,
    phone: o.customerPhone,
    date: new Date(o._creationTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: o.status as OrderStatus,
    total: o.total,
    items: o.items,
    address: {
      line1: o.shippingAddress.line1,
      city: o.shippingAddress.city,
      state: o.shippingAddress.state,
      zip: o.shippingAddress.zip,
    },
    notes: o.notes,
  }));

  useEffect(() => {
    if (product && !productFormInit) {
      setProductForm({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description,
      });
      setProductFormInit(true);
    }
  }, [product, productFormInit]);

  async function handleSaveProduct() {
    if (!product) return;
    setSavingProduct(true);
    try {
      await updateProductMut({
        id: product._id,
        name: productForm.name,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        description: productForm.description,
      });
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setSavingProduct(false);
    }
  }

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.status.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  async function handleStatusChange(id: string, status: OrderStatus) {
    const order = orders.find((o) => o.id === id);
    if (!order?._convexId) return;
    try {
      await updateStatusAction({ id: order._convexId as Id<"orders">, status });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EBE0",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
      }}
    >
      {/* Order detail panel */}
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          background: "#262322",
          padding: "0 0 24px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "sticky",
          top: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "28px 24px 24px",
            borderBottom: "1px solid rgba(242,229,215,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#C97D60",
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: "0.08em",
            }}
          >
            LONGTRESS
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(242,229,215,0.35)",
              marginTop: 2,
            }}
          >
            Admin Dashboard
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                borderRadius: 12,
                marginBottom: 4,
                cursor: "pointer",
                border: "none",
                background:
                  tab === t.id ? "rgba(201,125,96,0.15)" : "transparent",
                color: tab === t.id ? "#C97D60" : "rgba(242,229,215,0.55)",
                fontWeight: tab === t.id ? 600 : 400,
                fontSize: 14,
                textAlign: "left",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
              {t.id === "orders" && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "rgba(201,125,96,0.2)",
                    color: "#C97D60",
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 7px",
                    borderRadius: 999,
                  }}
                >
                  {orders.filter((o) => o.status === "Pending" || o.status === "Processing").length}
                </span>
              )}
              {tab === t.id && t.id !== "orders" && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#C97D60",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* View store link */}
        <div style={{ padding: "0 12px" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 12px",
              borderRadius: 12,
              background: "rgba(201,125,96,0.08)",
              color: "#C97D60",
              fontSize: 13,
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(201,125,96,0.2)",
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            View Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "32px 32px", overflowY: "auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#262322",
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {tab === "overview" && "Dashboard Overview"}
              {tab === "orders" && "Orders"}
              {tab === "product" && "Product Management"}
              {tab === "customers" && "Customers"}
            </h1>
            <p style={{ color: "#9B6B5A", fontSize: 13 }}>
              {tab === "overview" && "Your store performance at a glance"}
              {tab === "orders" && "Manage and track customer orders"}
              {tab === "product" && "Manage your Longtress Hair Oil listing"}
              {tab === "customers" && "View and manage customer accounts"}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#9B6B5A" }}>Mar 8, 2025</div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #C97D60, #FFBCB5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#262322",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              A
            </div>
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 20,
                marginBottom: 32,
              }}
            >
              <StatCard
                icon="💰"
                label="Total Revenue"
                value={`$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                change="—"
                up
              />
              <StatCard
                icon="📦"
                label="Total Orders"
                value={totalOrders.toLocaleString()}
                change="—"
                up
              />
              <StatCard
                icon="👥"
                label="Customers"
                value={customerStats.total.toLocaleString()}
                change={`${customerStats.repeatRate}% repeat`}
                up
              />
              <StatCard
                icon="📦"
                label="In Stock"
                value={product ? `${product.stock} units` : "—"}
                change={product && product.stock < 100 ? "Low!" : "Good"}
                up={!product || product.stock >= 100}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: 20,
              }}
            >
              {/* Revenue chart */}
              <div
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid rgba(201,125,96,0.1)",
                  boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#262322",
                      fontSize: 18,
                      fontWeight: 700,
                    }}
                  >
                    Revenue
                  </h3>
                  <select
                    style={{
                      fontSize: 12,
                      color: "#9B6B5A",
                      border: "1px solid rgba(201,125,96,0.2)",
                      borderRadius: 8,
                      padding: "4px 8px",
                      background: "#fff",
                    }}
                  >
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 8,
                        height: 160,
                      }}
                    >
                      {data.map((d) => (
                        <div
                          key={d.day}
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            height: "100%",
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              display: "flex",
                              alignItems: "flex-end",
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                borderRadius: "6px 6px 0 0",
                                height: `${(d.val / max) * 100}%`,
                                background:
                                  d.day === "Sat"
                                    ? "linear-gradient(135deg, #C97D60, #FFBCB5)"
                                    : "rgba(201,125,96,0.2)",
                                minHeight: 8,
                              }}
                            />
                          </div>
                          <span style={{ fontSize: 11, color: "#9B6B5A" }}>
                            {d.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Recent orders mini */}
              <div
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background: "#fff",
                  border: "1px solid rgba(201,125,96,0.1)",
                  boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
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
                  Recent Orders
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {orders.slice(0, 5).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => { setSelectedOrder(o); setTab("orders"); }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px 0",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 13,
                            color: "#262322",
                          }}
                        >
                          {o.id}
                        </div>
                        <div style={{ fontSize: 11, color: "#9B6B5A" }}>
                          {o.customer}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: "#262322",
                          }}
                        >
                          ${o.total}
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: STATUS_STYLES[o.status]?.bg,
                            color: STATUS_STYLES[o.status]?.color,
                            fontWeight: 600,
                          }}
                        >
                          {o.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setTab("orders")}
                  style={{
                    marginTop: 20,
                    width: "100%",
                    padding: "10px",
                    borderRadius: 10,
                    fontSize: 13,
                    background: "rgba(201,125,96,0.08)",
                    color: "#C97D60",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 600,
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
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#9B6B5A"
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders, customers, email..."
                  style={{
                    width: "100%",
                    padding: "11px 14px 11px 40px",
                    borderRadius: 12,
                    fontSize: 14,
                    border: "1px solid rgba(201,125,96,0.2)",
                    background: "#fff",
                    color: "#262322",
                    outline: "none",
                  }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "11px 16px",
                  borderRadius: 12,
                  fontSize: 14,
                  border: "1px solid rgba(201,125,96,0.2)",
                  background: "#fff",
                  color: "#262322",
                  cursor: "pointer",
                }}
              >
                <option value="All">All Statuses</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                style={{
                  padding: "11px 20px",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #C97D60, #FFBCB5)",
                  color: "#262322",
                  border: "none",
                }}
              >
                Export CSV
              </button>
            </div>

            {/* Table */}
            <div
              style={{
                borderRadius: 20,
                background: "#fff",
                border: "1px solid rgba(201,125,96,0.1)",
                boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
                overflow: "hidden",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr
                    style={{
                      background: "rgba(38,35,34,0.03)",
                      borderBottom: "1px solid rgba(201,125,96,0.12)",
                    }}
                  >
                    {[
                      "Order ID",
                      "Customer",
                      "Date",
                      "Status",
                      "Total",
                      "",
                    ].map((h, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#9B6B5A",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o, i) => (
                    <tr
                      key={o.id}
                      onClick={() => setSelectedOrder(o)}
                      style={{
                        borderBottom:
                          i < filtered.length - 1
                            ? "1px solid rgba(201,125,96,0.08)"
                            : "none",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(201,125,96,0.03)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#262322",
                        }}
                      >
                        {o.id}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#262322",
                          }}
                        >
                          {o.customer}
                        </div>
                        <div style={{ fontSize: 12, color: "#9B6B5A" }}>
                          {o.email}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 13,
                          color: "#9B6B5A",
                        }}
                      >
                        {o.date}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            padding: "4px 12px",
                            borderRadius: 999,
                            fontWeight: 600,
                            background: STATUS_STYLES[o.status]?.bg,
                            color: STATUS_STYLES[o.status]?.color,
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "16px 20px",
                          fontSize: 15,
                          fontWeight: 700,
                          color: "#262322",
                        }}
                      >
                        ${o.total.toFixed(2)}
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(o);
                          }}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: "pointer",
                            background: "rgba(201,125,96,0.1)",
                            color: "#C97D60",
                            border: "none",
                          }}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {loadingOrders && (
                <div style={{ padding: 48, textAlign: "center", color: "#9B6B5A", fontSize: 14 }}>
                  Loading orders…
                </div>
              )}
              {!loadingOrders && filtered.length === 0 && (
                <div
                  style={{
                    padding: 48,
                    textAlign: "center",
                    color: "#9B6B5A",
                    fontSize: 14,
                  }}
                >
                  No orders found matching your search.
                </div>
              )}
            </div>

            {/* Count */}
            <div style={{ marginTop: 12, fontSize: 12, color: "#9B6B5A" }}>
              Showing {filtered.length} of {orders.length} orders
            </div>
          </div>
        )}

        {/* ── PRODUCT TAB ── */}
        {tab === "product" && (
          <>
            {loadingProduct && (
              <div style={{ padding: 48, textAlign: "center", color: "#9B6B5A", fontSize: 14 }}>
                Loading product…
              </div>
            )}
            {!loadingProduct && !product && (
              <div style={{ padding: 48, textAlign: "center", color: "#9B6B5A", fontSize: 14 }}>
                No product found.
              </div>
            )}
            {!loadingProduct && product && (
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
              >
                {/* Product card */}
                <div
                  style={{
                    padding: 28,
                    borderRadius: 20,
                    background: "#fff",
                    border: "1px solid rgba(201,125,96,0.1)",
                    boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
                  }}
                >
                  <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                    <div
                      style={{
                        width: 80,
                        height: 100,
                        borderRadius: 14,
                        flexShrink: 0,
                        background: "linear-gradient(135deg, #262322, #63372C)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 30,
                      }}
                    >
                      🌿
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: "#262322",
                          fontSize: 20,
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        {product.name}
                      </h3>
                      <div
                        style={{ fontSize: 13, color: "#9B6B5A", marginBottom: 8 }}
                      >
                        SKU: {product.sku} · {product.size}
                      </div>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 12px",
                          borderRadius: 999,
                          background: product.stock > 0 ? "rgba(38,35,34,0.08)" : "rgba(239,68,68,0.1)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: product.stock > 0 ? "#63372C" : "#DC2626",
                        }}
                      >
                        ● {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                  >
                    {[
                      { label: "Price", value: `$${Number(product.price).toFixed(2)}` },
                      { label: "Stock", value: `${product.stock} units` },
                      { label: "Total Orders", value: `${totalOrders} orders` },
                      { label: "Status", value: product.status },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingBottom: 12,
                          borderBottom: "1px solid rgba(201,125,96,0.08)",
                        }}
                      >
                        <span style={{ fontSize: 13, color: "#9B6B5A" }}>
                          {row.label}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#262322",
                          }}
                        >
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit form */}
                <div
                  style={{
                    padding: 28,
                    borderRadius: 20,
                    background: "#fff",
                    border: "1px solid rgba(201,125,96,0.1)",
                    boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: "#262322",
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: 24,
                    }}
                  >
                    Edit Product
                  </h3>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 16 }}
                  >
                    {[
                      { label: "Product Name", key: "name" as const },
                      { label: "Price ($)", key: "price" as const },
                      { label: "Stock Quantity", key: "stock" as const },
                    ].map((f) => (
                      <div key={f.label}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#9B6B5A",
                            marginBottom: 6,
                          }}
                        >
                          {f.label}
                        </label>
                        <input
                          value={productForm[f.key]}
                          onChange={(e) => setProductForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          style={{
                            width: "100%",
                            padding: "11px 14px",
                            borderRadius: 10,
                            fontSize: 14,
                            border: "1px solid rgba(201,125,96,0.2)",
                            background: "#F2E5D7",
                            color: "#262322",
                            outline: "none",
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 500,
                          color: "#9B6B5A",
                          marginBottom: 6,
                        }}
                      >
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={productForm.description}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                        style={{
                          width: "100%",
                          padding: "11px 14px",
                          borderRadius: 10,
                          fontSize: 14,
                          border: "1px solid rgba(201,125,96,0.2)",
                          background: "#F2E5D7",
                          color: "#262322",
                          outline: "none",
                          resize: "vertical",
                          fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSaveProduct}
                      disabled={savingProduct}
                      style={{
                        padding: "13px",
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: savingProduct ? "not-allowed" : "pointer",
                        background: "linear-gradient(135deg, #C97D60, #FFBCB5)",
                        color: "#262322",
                        border: "none",
                        opacity: savingProduct ? 0.6 : 1,
                      }}
                    >
                      {savingProduct ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>

                {/* Inventory alert */}
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: 20,
                    borderRadius: 16,
                    background: product.stock < 100 ? "rgba(239,68,68,0.08)" : "rgba(201,125,96,0.08)",
                    border: product.stock < 100 ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(201,125,96,0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{product.stock < 100 ? "🚨" : "⚠️"}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: product.stock < 100 ? "#DC2626" : "#A0614A",
                        fontSize: 14,
                        marginBottom: 2,
                      }}
                    >
                      {product.stock < 100 ? "Low Stock Warning" : "Low Stock Alert Threshold"}
                    </div>
                    <div style={{ fontSize: 13, color: product.stock < 100 ? "#DC2626" : "#9B6B5A" }}>
                      {product.stock < 100
                        ? `Stock is below 100 units! Current stock: ${product.stock} units — reorder soon!`
                        : `You have set an alert when stock falls below 100 units. Current stock: ${product.stock} units — you are good!`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CUSTOMERS TAB ── */}
        {tab === "customers" && (
          <>
            {loadingCustomers && (
              <div style={{ padding: 48, textAlign: "center", color: "#9B6B5A", fontSize: 14 }}>
                Loading customers…
              </div>
            )}
            {!loadingCustomers && (
              <div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 20,
                    marginBottom: 24,
                  }}
                >
                  {[
                    {
                      icon: "👥",
                      label: "Total Customers",
                      value: customerStats.total.toLocaleString(),
                      note: `${customers.length} with orders`,
                    },
                    {
                      icon: "🔁",
                      label: "Repeat Buyers",
                      value: `${customerStats.repeatRate}%`,
                      note: "Order 2+ times",
                    },
                    {
                      icon: "⭐",
                      label: "Active Customers",
                      value: customers.length.toLocaleString(),
                      note: "With at least one order",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        padding: 24,
                        borderRadius: 20,
                        background: "#fff",
                        border: "1px solid rgba(201,125,96,0.1)",
                        boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 12 }}>{s.icon}</div>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#262322",
                          marginBottom: 4,
                        }}
                      >
                        {s.value}
                      </div>
                      <div
                        style={{ fontSize: 13, color: "#9B6B5A", fontWeight: 500 }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: 12, color: "#C97D60", marginTop: 4 }}>
                        {s.note}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer list */}
                <div
                  style={{
                    borderRadius: 20,
                    background: "#fff",
                    border: "1px solid rgba(201,125,96,0.1)",
                    boxShadow: "0 2px 12px rgba(38,35,34,0.05)",
                    overflow: "hidden",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr
                        style={{
                          background: "rgba(38,35,34,0.03)",
                          borderBottom: "1px solid rgba(201,125,96,0.12)",
                        }}
                      >
                        {[
                          "Customer",
                          "Orders",
                          "Spent",
                          "Last Order",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "14px 20px",
                              textAlign: "left",
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#9B6B5A",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c, i) => (
                        <tr
                          key={c.email}
                          style={{
                            borderBottom:
                              i < customers.length - 1
                                ? "1px solid rgba(201,125,96,0.08)"
                                : "none",
                          }}
                        >
                          <td style={{ padding: "16px 20px" }}>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "#262322",
                              }}
                            >
                              {c.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#9B6B5A" }}>
                              {c.email}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              fontSize: 14,
                              color: "#262322",
                              fontWeight: 600,
                            }}
                          >
                            {c.orderCount}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              fontSize: 14,
                              fontWeight: 700,
                              color: "#262322",
                            }}
                          >
                            ${Number(c.totalSpent).toFixed(2)}
                          </td>
                          <td
                            style={{
                              padding: "16px 20px",
                              fontSize: 13,
                              color: "#9B6B5A",
                            }}
                          >
                            {new Date(c.lastOrderAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            {c.orderCount >= 3 ? (
                              <span
                                style={{
                                  fontSize: 12,
                                  padding: "3px 10px",
                                  borderRadius: 999,
                                  fontWeight: 600,
                                  background: "rgba(201,125,96,0.12)",
                                  color: "#A0614A",
                                }}
                              >
                                ⭐ VIP
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 12,
                                  padding: "3px 10px",
                                  borderRadius: 999,
                                  fontWeight: 600,
                                  background: "rgba(38,35,34,0.06)",
                                  color: "#9B6B5A",
                                }}
                              >
                                Regular
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: 48, textAlign: "center", color: "#9B6B5A", fontSize: 14 }}>
                            No customers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
