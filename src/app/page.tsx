"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Benefits", href: "#benefits" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "How to Use", href: "#how-to-use" },
  { label: "FAQ", href: "#faq" },
  { label: "Reviews", href: "#reviews" },
];

const BENEFITS = [
  {
    icon: "🌿",
    title: "Deep Nourishment",
    desc: "Rich in omega-9 fatty acids and vitamins that penetrate deep into the hair shaft to restore moisture and vitality.",
  },
  {
    icon: "💪",
    title: "Strengthens & Grows",
    desc: "Centuries-old Haitian tradition combined with natural ricinoleic acid to stimulate scalp circulation and boost hair growth.",
  },
  {
    icon: "✨",
    title: "Natural Shine",
    desc: "Seals the hair cuticle for a brilliant, healthy shine without silicones, sulfates, or harsh chemicals.",
  },
  {
    icon: "🛡️",
    title: "Scalp Protection",
    desc: "Anti-inflammatory and antifungal properties keep your scalp healthy, balanced, and free from irritation.",
  },
];

const INGREDIENTS = [
  { name: "Haitian Black Castor Oil", note: "The hero ingredient — cold-pressed, traditionally roasted" },
  { name: "Coconut Oil", note: "Deeply moisturizing, seals in nutrients" },
  { name: "Moringa Leaf Extract", note: "Rich in vitamins A, C, E for hair strength" },
  { name: "Hibiscus Extract", note: "Promotes growth and conditions the scalp" },
  { name: "Ylang-Ylang Essential Oil", note: "Balances scalp oil production, adds fragrance" },
  { name: "Vitamin E", note: "Antioxidant protection for healthy hair cells" },
];

const FAQS = [
  {
    q: "How often should I use Longtress?",
    a: "For best results, apply 2–3 times per week as a scalp treatment or leave-in. You can also use it daily on dry ends as a moisturizer — it absorbs without feeling greasy.",
  },
  {
    q: "Will it work on my hair type?",
    a: "Yes. Longtress is formulated for all hair types and textures — from straight to 4C coily. It's especially effective for natural, transitioning, color-treated, and low-porosity hair.",
  },
  {
    q: "How long before I see results?",
    a: "Most customers notice improved moisture and shine within the first week. Significant growth and thickness results typically appear after 4–8 weeks of consistent use.",
  },
  {
    q: "Is it safe for colored or chemically treated hair?",
    a: "Absolutely. Longtress contains no harsh chemicals, sulfates, or parabens — it's gentle enough for color-treated, relaxed, and bleached hair. It actually helps restore moisture lost from chemical processes.",
  },
  {
    q: "What's your shipping policy?",
    a: "We offer free shipping on all orders over $60. Standard shipping (3–5 business days) is $7.99 for orders under $60. We ship to the US, Canada, and internationally.",
  },
  {
    q: "Do you offer a guarantee?",
    a: "Yes — we offer a 30-day satisfaction guarantee. If you're not happy with your results for any reason, contact us for a full refund. No questions asked.",
  },
];

const STEPS = [
  { num: "01", title: "Warm It Up", desc: "Place a small amount in your palm and rub hands together to warm the oil for better absorption." },
  { num: "02", title: "Apply to Scalp", desc: "Use fingertips to massage oil directly into the scalp using circular motions for 2-3 minutes." },
  { num: "03", title: "Work Through Hair", desc: "Distribute remaining oil from roots to ends, focusing on dry or damaged areas." },
  { num: "04", title: "Style or Sleep", desc: "Leave in as a treatment overnight or style as usual. Use 2-3x per week for best results." },
];

const REVIEWS = [
  {
    name: "Jasmine T.",
    rating: 5,
    hairType: "4C Coily",
    weeksUsed: 12,
    result: "3 inches of new growth",
    resultIcon: "📏",
    resultColor: "#2D5240",
    resultBg: "rgba(45,82,64,0.12)",
    tags: ["Edge regrowth", "Less breakage"],
    text: "My hair has never been this thick and healthy. I've been using Longtress for 3 months and I can already see so much new growth. The oil is lightweight — no greasy residue at all.",
    phase: "After 12 weeks",
  },
  {
    name: "Monique B.",
    rating: 5,
    hairType: "3B Curly",
    weeksUsed: 6,
    result: "Scalp issues gone",
    resultIcon: "🌿",
    resultColor: "#8B6914",
    resultBg: "rgba(200,155,60,0.12)",
    tags: ["Scalp health", "Shine boost"],
    text: "After 6 weeks my scalp is completely clear — no flaking, no irritation. My curls are more defined and the moisture retention is insane. I apply it every wash day.",
    phase: "After 6 weeks",
  },
  {
    name: "Aaliyah R.",
    rating: 5,
    hairType: "4A Kinky",
    weeksUsed: 4,
    result: "Edges visibly filled in",
    resultIcon: "✨",
    resultColor: "#1E3A2F",
    resultBg: "rgba(30,58,47,0.12)",
    tags: ["Edges back", "Thicker density"],
    text: "After just 4 weeks my edges are filling back in from stress-related loss. I apply it at night before braiding. The results are real — my stylist noticed before I even told her.",
    phase: "After 4 weeks",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="#C89B3C">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Reusable scroll-triggered fade-up wrapper
function FadeUp({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

function BottleSVG({ width = 140, height = 220 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 140 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="52" y="10" width="36" height="22" rx="6" fill="#C89B3C" />
      <rect x="56" y="8" width="28" height="6" rx="3" fill="#A07828" />
      <rect x="58" y="30" width="24" height="20" rx="4" fill="#2D5240" />
      <path d="M50 50 Q38 62 36 80 H104 Q102 62 90 50 Z" fill="#2D5240" />
      <rect x="30" y="78" width="80" height="112" rx="16" fill="#2D5240" />
      <rect x="38" y="95" width="64" height="80" rx="8" fill="rgba(249,243,232,0.08)" stroke="rgba(200,155,60,0.35)" strokeWidth="1.5" />
      <text x="70" y="118" textAnchor="middle" fill="#C89B3C" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">LONGTRESS</text>
      <text x="70" y="132" textAnchor="middle" fill="rgba(249,243,232,0.6)" fontSize="7" fontFamily="Arial, sans-serif" letterSpacing="2">HAITIAN OIL</text>
      <ellipse cx="70" cy="150" rx="14" ry="5" fill="none" stroke="rgba(200,155,60,0.5)" strokeWidth="1" />
      <line x1="70" y1="145" x2="70" y2="155" stroke="rgba(200,155,60,0.5)" strokeWidth="1" />
      <text x="70" y="168" textAnchor="middle" fill="rgba(249,243,232,0.4)" fontSize="7" fontFamily="Arial, sans-serif">120 mL / 4 fl oz</text>
      <rect x="30" y="188" width="80" height="4" rx="2" fill="#1E3A2F" />
      <rect x="36" y="82" width="10" height="100" rx="5" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ padding: "96px 24px", background: "#F0E8D4" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Got Questions?</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: "clamp(32px, 4vw, 48px)", marginTop: 12 }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.07}>
              <motion.div
                style={{
                  borderRadius: 16, overflow: "hidden",
                  background: "#fff", border: "1px solid rgba(200,155,60,0.15)",
                  boxShadow: "0 2px 12px rgba(30,58,47,0.05)",
                }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 24px", background: "none", border: "none", cursor: "pointer",
                    textAlign: "left", gap: 16,
                  }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: 16, fontWeight: 600 }}>
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: "#C89B3C", fontSize: 24, flexShrink: 0, lineHeight: 1 }}>
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: "hidden" }}>
                      <div style={{ padding: "0 24px 20px", color: "#3A6B52", fontSize: 14, lineHeight: 1.8, borderTop: "1px solid rgba(200,155,60,0.1)" }}>
                        <div style={{ paddingTop: 16 }}>{faq.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAddToCart = () => {
    setCartCount((c) => c + qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div style={{ background: "#F9F3E8", color: "#1E3A2F", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "rgba(30,58,47,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.2)" : "none",
        transition: "all 0.3s ease",
      }}>
        {/* Announcement bar */}
        {!scrolled && (
          <div style={{
            background: "linear-gradient(90deg, #C89B3C, #E8B84B)",
            color: "#1E3A2F", textAlign: "center", fontSize: 12, fontWeight: 600,
            padding: "8px 24px", letterSpacing: "0.03em",
          }}>
            🌿 Free shipping on orders $60+ &nbsp;·&nbsp; Use <strong>GROW10</strong> for 10% off &nbsp;·&nbsp; 30-day money-back guarantee
          </div>
        )}
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="#" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#C89B3C", fontWeight: 700, fontSize: 24, letterSpacing: "0.1em" }}>
              LONGTRESS
            </span>
          </a>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} style={{
                color: scrolled ? "#E8B84B" : "#F9F3E8",
                textDecoration: "none", fontSize: 13, fontWeight: 500, letterSpacing: "0.05em",
              }}>
                {l.label}
              </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Link href="/cart" style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#C89B3C", color: "#1E3A2F",
              padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600,
              textDecoration: "none", position: "relative",
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Cart
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  width: 20, height: 20, borderRadius: 999,
                  background: "#1E3A2F", color: "#F9F3E8",
                  fontSize: 11, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden",
        background: "linear-gradient(160deg, #1E3A2F 0%, #2D5240 55%, #1a3228 100%)",
      }}>
        {/* Dot pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 2px 2px, #C89B3C 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: 80, right: 40, width: 280, height: 280, borderRadius: "50%", background: "#C89B3C", opacity: 0.08, filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: 80, left: 40, width: 200, height: 200, borderRadius: "50%", background: "#E8B84B", opacity: 0.08, filter: "blur(60px)" }} />

        <div className="hero-grid" style={{ position: "relative", maxWidth: 1152, margin: "0 auto", padding: "96px 24px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          {/* Text column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 500, marginBottom: 24,
                background: "rgba(200,155,60,0.15)", color: "#E8B84B", border: "1px solid rgba(200,155,60,0.3)",
              }}>
              🇭🇹 Rooted in Haitian Tradition
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "#F9F3E8", fontWeight: 700,
                fontSize: "clamp(42px, 6vw, 72px)", lineHeight: 1.1, marginBottom: 24,
              }}>
              Hair Oil That{" "}
              <em style={{ fontStyle: "italic", background: "linear-gradient(135deg, #C89B3C, #E8B84B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Nourishes
              </em>{" "}
              From Root to Tip
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ color: "rgba(249,243,232,0.72)", fontSize: 18, lineHeight: 1.7, marginBottom: 32, fontWeight: 300, maxWidth: 480 }}>
              Premium Haitian black castor oil, cold-pressed and traditionally crafted.
              Strengthen, grow, and restore your hair — the way our grandmothers always knew how.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <StarRating count={5} />
              <span style={{ color: "rgba(249,243,232,0.55)", fontSize: 13 }}>4.9 · Over 2,400 reviews</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <motion.a
                href="#order"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 32px", borderRadius: 999, fontWeight: 600, fontSize: 15,
                  background: "linear-gradient(135deg, #C89B3C, #E8B84B)", color: "#1E3A2F",
                  textDecoration: "none", boxShadow: "0 8px 32px rgba(200,155,60,0.4)",
                }}>
                Shop Now — $38
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href="#benefits"
                whileHover={{ scale: 1.03, background: "rgba(249,243,232,0.1)" }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "14px 28px", borderRadius: 999, fontWeight: 500, fontSize: 15,
                  color: "#F9F3E8", textDecoration: "none", border: "1px solid rgba(249,243,232,0.2)",
                }}>
                Learn More
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
              {["🌿 100% Natural", "✓ Cruelty-Free", "🚫 No Sulfates", "♻️ Eco Packaging"].map((b, i) => (
                <motion.span
                  key={b}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.08 }}
                  style={{ fontSize: 12, padding: "6px 12px", borderRadius: 999, background: "rgba(249,243,232,0.07)", color: "rgba(249,243,232,0.6)" }}>
                  {b}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Lifestyle photo column */}
          <motion.div
            className="hero-bottle"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: 400, height: 500 }}>
              {/* Background frame — simulates lifestyle product photography */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "46% 54% 58% 42% / 42% 46% 54% 58%",
                background: "linear-gradient(145deg, #1a0d05 0%, #0d1408 50%, #0a1a10 100%)",
                overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -40, right: -40, width: 320, height: 320, background: "radial-gradient(ellipse, rgba(200,155,60,0.28) 0%, transparent 68%)", filter: "blur(28px)" }} />
                <div style={{ position: "absolute", bottom: -20, left: -20, width: 220, height: 220, background: "radial-gradient(ellipse, rgba(10,30,18,0.7) 0%, transparent 70%)", filter: "blur(20px)" }} />
                {/* Botanical leaf SVGs */}
                <svg style={{ position: "absolute", top: 16, left: 8, opacity: 0.18 }} width="110" height="170" viewBox="0 0 110 170" fill="none">
                  <path d="M55 8 C18 36, 4 76, 14 124 C19 152, 46 168, 55 168 C64 168, 91 152, 96 124 C106 76, 92 36, 55 8Z" fill="#C89B3C"/>
                  <line x1="55" y1="8" x2="55" y2="168" stroke="#C89B3C" strokeWidth="1.2" opacity="0.5"/>
                  {[35,55,75,95,115,135].map(y => (
                    <line key={y} x1="55" y1={y} x2="20" y2={y} stroke="#C89B3C" strokeWidth="0.8" opacity="0.4"/>
                  ))}
                </svg>
                <svg style={{ position: "absolute", bottom: 24, right: 12, opacity: 0.12, transform: "scaleX(-1) rotate(15deg)" }} width="80" height="120" viewBox="0 0 110 170" fill="none">
                  <path d="M55 8 C18 36, 4 76, 14 124 C19 152, 46 168, 55 168 C64 168, 91 152, 96 124 C106 76, 92 36, 55 8Z" fill="#C89B3C"/>
                </svg>
              </div>

              {/* Bottle — floating */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -52%)", zIndex: 2 }}>
                <div style={{ position: "absolute", inset: -40, background: "radial-gradient(circle, rgba(200,155,60,0.22), transparent 68%)", filter: "blur(24px)", borderRadius: "50%" }} />
                <BottleSVG width={170} height={270} />
              </motion.div>

              {/* Floating review card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{
                  position: "absolute", bottom: 36, left: -28, zIndex: 3,
                  background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)",
                  borderRadius: 18, padding: "14px 18px",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)",
                  maxWidth: 210,
                }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#C89B3C", fontSize: 11 }}>★</span>)}
                </div>
                <p style={{ fontSize: 12, color: "#1E3A2F", lineHeight: 1.55, marginBottom: 8, fontStyle: "italic" }}>
                  "My edges are completely back after 4 weeks!"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, #C89B3C, #E8B84B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1E3A2F", flexShrink: 0 }}>A</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1E3A2F" }}>Aaliyah R.</div>
                    <div style={{ fontSize: 10, color: "#3A6B52" }}>✓ Verified Purchase</div>
                  </div>
                </div>
              </motion.div>

              {/* Rating badge */}
              <motion.div
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: -8 }}
                transition={{ delay: 0.9, duration: 0.5, type: "spring", stiffness: 180 }}
                style={{
                  position: "absolute", top: 32, right: -20, zIndex: 3,
                  background: "linear-gradient(135deg, #C89B3C, #E8B84B)",
                  borderRadius: "50%", width: 84, height: 84,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 28px rgba(200,155,60,0.5)", color: "#1E3A2F",
                }}>
                <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>4.9</span>
                <span style={{ fontSize: 13 }}>⭐</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.04em" }}>2,400+ reviews</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ background: "#1E3A2F" }}>
        <div className="stats-grid" style={{ maxWidth: 1152, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, textAlign: "center" }}>
          {[
            { val: "2,400+", label: "Happy Customers" },
            { val: "100%", label: "Natural Ingredients" },
            { val: "120 mL", label: "Per Bottle" },
            { val: "Crafted in Haiti 🇭🇹", label: "" },
          ].map((s, i) => (
            <FadeUp key={s.val} delay={i * 0.1}>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "#C89B3C", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{s.val}</div>
              {s.label && <div style={{ color: "rgba(249,243,232,0.45)", fontSize: 13 }}>{s.label}</div>}
            </FadeUp>
          ))}
        </div>
      </section>

      {/* PRESS BAR */}
      <section style={{ background: "#F0E8D4", padding: "28px 24px", borderBottom: "1px solid rgba(200,155,60,0.15)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 36, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: "#3A6B52", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, flexShrink: 0 }}>As Seen In</span>
          <div style={{ width: 1, height: 22, background: "rgba(30,58,47,0.18)", flexShrink: 0 }} />
          {["Essence", "NaturallyCurly", "Vogue Beauty", "Black Enterprise", "Allure"].map((name) => (
            <span key={name} style={{
              fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700,
              color: "rgba(30,58,47,0.32)", letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" style={{ padding: "96px 24px", background: "#F9F3E8" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Why Longtress</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: "clamp(32px, 4vw, 48px)", marginTop: 12, marginBottom: 0 }}>
              Benefits Your Hair <em style={{ color: "#C89B3C" }}>Deserves</em>
            </h2>
          </div>
          <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {BENEFITS.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(30,58,47,0.12)" }}
                  transition={{ duration: 0.2 }}
                  style={{
                    padding: 32, borderRadius: 20,
                    background: i % 2 === 0 ? "#fff" : "#F0E8D4",
                    border: "1px solid rgba(200,155,60,0.12)",
                    boxShadow: "0 2px 16px rgba(30,58,47,0.06)",
                  }}>
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    style={{ fontSize: 36, marginBottom: 16, display: "inline-block" }}>{b.icon}</motion.div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ color: "#3A6B52", fontSize: 14, lineHeight: 1.7 }}>{b.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT / ORDER */}
      <section id="order" style={{ padding: "96px 24px", background: "linear-gradient(160deg, #1E3A2F 0%, #2D5240 100%)" }}>
        <div className="order-grid" style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Details */}
          <div>
            <span style={{ color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>The Product</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#F9F3E8", fontSize: "clamp(32px, 4vw, 48px)", marginTop: 12, marginBottom: 24, lineHeight: 1.15 }}>
              Longtress<br /><em style={{ color: "#C89B3C" }}>Haitian Hair Oil</em>
            </h2>
            <p style={{ color: "rgba(249,243,232,0.7)", fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
              Handcrafted in small batches using cold-pressed Haitian black castor oil — the gold standard of natural hair care.
              Blended with moringa, hibiscus, and ylang-ylang for a formula that nourishes, strengthens, and grows hair of all textures.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "120 mL / 4 fl oz amber glass bottle",
                "Suitable for all hair types & textures",
                "Can be used as scalp treatment, hot oil treatment, or daily moisturizer",
                "Free of parabens, sulfates & mineral oils",
                "Cruelty-free & sustainably sourced",
              ].map((f) => (
                <li key={f} style={{ display: "flex", gap: 10, color: "rgba(249,243,232,0.78)", fontSize: 14, alignItems: "flex-start" }}>
                  <span style={{ color: "#C89B3C", flexShrink: 0, marginTop: 2 }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Qty + Add to cart */}
            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(200,155,60,0.3)", borderRadius: 999, overflow: "hidden", background: "rgba(249,243,232,0.05)" }}>
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: 40, height: 48, background: "none", border: "none", color: "#C89B3C", fontSize: 20, cursor: "pointer" }}>−</button>
                <span style={{ width: 32, textAlign: "center", color: "#F9F3E8", fontWeight: 500 }}>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} style={{ width: 40, height: 48, background: "none", border: "none", color: "#C89B3C", fontSize: 20, cursor: "pointer" }}>+</button>
              </div>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, height: 48, borderRadius: 999, fontWeight: 600, fontSize: 14, cursor: "pointer", border: "none",
                  background: addedToCart ? "rgba(249,243,232,0.08)" : "linear-gradient(135deg, #C89B3C, #E8B84B)",
                  color: addedToCart ? "#C89B3C" : "#1E3A2F",
                  boxShadow: addedToCart ? "none" : "0 8px 24px rgba(200,155,60,0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                {addedToCart ? "✓ Added to Cart!" : `Add to Cart — $${38 * qty}`}
              </button>
            </div>

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <Link href="/checkout" style={{ color: "rgba(200,155,60,0.8)", fontSize: 13, textDecoration: "underline" }}>
                Or buy it now → Checkout
              </Link>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 16, borderRadius: 14, background: "rgba(249,243,232,0.05)", border: "1px solid rgba(200,155,60,0.1)" }}>
              <svg width="18" height="18" fill="none" stroke="#C89B3C" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span style={{ color: "rgba(249,243,232,0.55)", fontSize: 13 }}>Secure checkout · 256-bit SSL · Powered by Stripe</span>
            </div>
          </div>

          {/* Bottle visual */}
          <div className="order-bottle-col" style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,155,60,0.2), transparent 70%)", filter: "blur(40px)", transform: "scale(1.5)" }} />
              <div style={{
                position: "relative", padding: 48, borderRadius: 32,
                background: "rgba(249,243,232,0.04)", border: "1px solid rgba(200,155,60,0.15)", backdropFilter: "blur(8px)",
              }}>
                <BottleSVG width={180} height={280} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section id="ingredients" style={{ padding: "96px 24px", background: "#F0E8D4" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Purity First</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: "clamp(32px, 4vw, 48px)", marginTop: 12 }}>
              {"What's Inside"}
            </h2>
          </div>
          <div className="ingredients-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {INGREDIENTS.map((ing, i) => (
              <FadeUp key={ing.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(30,58,47,0.1)" }}
                  style={{
                    padding: 24, borderRadius: 20, display: "flex", gap: 16, alignItems: "flex-start",
                    background: "#fff", border: "1px solid rgba(200,155,60,0.1)", boxShadow: "0 2px 12px rgba(30,58,47,0.05)",
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(200,155,60,0.1)", color: "#C89B3C",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1E3A2F", marginBottom: 4 }}>{ing.name}</div>
                    <div style={{ fontSize: 12, color: "#3A6B52", lineHeight: 1.6 }}>{ing.note}</div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section id="how-to-use" style={{ padding: "96px 24px", background: "#F9F3E8" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>The Ritual</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: "clamp(32px, 4vw, 48px)", marginTop: 12 }}>
              How to Use
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {STEPS.map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.15}>
                <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 3 }}
                    style={{
                      width: 64, height: 64, flexShrink: 0, borderRadius: 20,
                      background: "linear-gradient(135deg, #1E3A2F, #2D5240)",
                      color: "#C89B3C", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700,
                      border: "1px solid rgba(200,155,60,0.2)", cursor: "default",
                    }}>
                    {step.num}
                  </motion.div>
                  <div style={{ paddingTop: 8 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
                    <p style={{ color: "#3A6B52", fontSize: 14, lineHeight: 1.8 }}>{step.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection />

      {/* REVIEWS */}
      <section id="reviews" style={{ padding: "96px 24px", background: "#1E3A2F" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ color: "#C89B3C", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Real Results</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#F9F3E8", fontSize: "clamp(32px, 4vw, 48px)", marginTop: 12 }}>
              Hair Transformations
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
              <StarRating count={5} />
              <span style={{ color: "rgba(249,243,232,0.45)", fontSize: 13 }}>4.9 average · 2,400+ reviews</span>
            </div>
          </div>

          <div className="reviews-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {REVIEWS.map((r, i) => (
              <FadeUp key={r.name} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 48px rgba(0,0,0,0.25)" }}
                  transition={{ duration: 0.2 }}
                  style={{
                    borderRadius: 24, overflow: "hidden",
                    background: "rgba(249,243,232,0.04)", border: "1px solid rgba(200,155,60,0.15)",
                    display: "flex", flexDirection: "column", height: "100%",
                  }}>

                  {/* Hair Result Visual */}
                  <div style={{
                    padding: "24px 24px 20px",
                    background: "linear-gradient(135deg, rgba(249,243,232,0.07), rgba(200,155,60,0.06))",
                    borderBottom: "1px solid rgba(200,155,60,0.1)",
                  }}>
                    {/* Before → After strip */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                      {/* Before */}
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{
                          height: 64, borderRadius: 12, marginBottom: 6,
                          background: "linear-gradient(160deg, #2a1a0a, #3d2612)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1px solid rgba(255,255,255,0.06)",
                          position: "relative", overflow: "hidden",
                        }}>
                          {/* Hair strand lines */}
                          {[20,35,50,65,80].map((x) => (
                            <div key={x} style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 1.5, background: "rgba(80,40,10,0.6)", borderRadius: 99 }} />
                          ))}
                          <span style={{ fontSize: 18, position: "relative", zIndex: 1 }}>💇</span>
                        </div>
                        <span style={{ fontSize: 10, color: "rgba(249,243,232,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Before</span>
                      </div>

                      {/* Arrow */}
                      <div style={{ display: "flex", alignItems: "center", paddingBottom: 20 }}>
                        <svg width="20" height="20" fill="none" stroke="#C89B3C" viewBox="0 0 24 24" style={{ opacity: 0.6 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>

                      {/* After */}
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{
                          height: 64, borderRadius: 12, marginBottom: 6,
                          background: "linear-gradient(160deg, #1a0d05, #2a1a08)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1px solid rgba(200,155,60,0.2)",
                          position: "relative", overflow: "hidden",
                        }}>
                          {/* Fuller hair strand lines */}
                          {[12,22,32,42,52,62,72,82,88].map((x) => (
                            <div key={x} style={{ position: "absolute", left: `${x}%`, top: 0, bottom: 0, width: 2, background: "rgba(140,80,20,0.5)", borderRadius: 99 }} />
                          ))}
                          <span style={{ fontSize: 22, position: "relative", zIndex: 1 }}>✨</span>
                        </div>
                        <span style={{ fontSize: 10, color: "#C89B3C", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>{r.phase}</span>
                      </div>
                    </div>

                    {/* Result badge */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 14px", borderRadius: 12,
                      background: r.resultBg, border: `1px solid rgba(200,155,60,0.15)`,
                    }}>
                      <span style={{ fontSize: 18 }}>{r.resultIcon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#F9F3E8" }}>{r.result}</div>
                        <div style={{ fontSize: 11, color: "rgba(249,243,232,0.4)" }}>Used {r.weeksUsed} weeks · {r.hairType}</div>
                      </div>
                    </div>
                  </div>

                  {/* Review body */}
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
                    <StarRating count={r.rating} />
                    <p style={{ color: "rgba(249,243,232,0.75)", fontSize: 13, lineHeight: 1.85, flex: 1 }}>
                      &ldquo;{r.text}&rdquo;
                    </p>

                    {/* Result tags */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {r.tags.map((tag) => (
                        <span key={tag} style={{
                          fontSize: 11, padding: "4px 10px", borderRadius: 999,
                          background: "rgba(200,155,60,0.1)", color: "#C89B3C",
                          border: "1px solid rgba(200,155,60,0.2)",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Reviewer */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4, borderTop: "1px solid rgba(249,243,232,0.06)" }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, #C89B3C, #E8B84B)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#1E3A2F", fontWeight: 700, fontSize: 13,
                      }}>
                        {r.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#F9F3E8" }}>{r.name}</div>
                        <span style={{ fontSize: 10, color: "rgba(200,155,60,0.7)" }}>✓ Verified Purchase</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "96px 24px", background: "#F9F3E8", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🌿</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: "#1E3A2F", fontSize: "clamp(32px, 4vw, 48px)", marginBottom: 16, lineHeight: 1.2 }}>
            Ready for Healthy, <em style={{ color: "#C89B3C" }}>Beautiful Hair?</em>
          </h2>
          <p style={{ color: "#3A6B52", fontSize: 15, marginBottom: 32 }}>
            Join thousands who have transformed their hair with Longtress. Free shipping on orders over $60.
          </p>
          <a href="#order" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "16px 40px", borderRadius: 999, fontWeight: 600, fontSize: 15,
            background: "linear-gradient(135deg, #1E3A2F, #2D5240)", color: "#C89B3C",
            textDecoration: "none", boxShadow: "0 8px 32px rgba(30,58,47,0.22)",
          }}>
            Get Longtress — $38
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <p style={{ color: "#3A6B52", fontSize: 12, marginTop: 16 }}>30-day satisfaction guarantee · Free returns</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1E3A2F" }}>
        {/* Newsletter strip */}
        <div style={{ borderBottom: "1px solid rgba(249,243,232,0.07)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>🌿</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", color: "#F9F3E8", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Get Hair Growth Tips & Exclusive Offers
            </h3>
            <p style={{ color: "rgba(249,243,232,0.45)", fontSize: 13, marginBottom: 24 }}>
              Join 8,000+ subscribers. Unsubscribe anytime.
            </p>
            <div style={{ display: "flex", gap: 0, maxWidth: 420, margin: "0 auto", borderRadius: 999, overflow: "hidden", border: "1px solid rgba(200,155,60,0.3)" }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  flex: 1, padding: "13px 20px", background: "rgba(249,243,232,0.05)",
                  border: "none", outline: "none", color: "#F9F3E8", fontSize: 13,
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <button style={{
                padding: "13px 24px", background: "linear-gradient(135deg, #C89B3C, #E8B84B)",
                border: "none", color: "#1E3A2F", fontWeight: 700, fontSize: 13, cursor: "pointer",
                whiteSpace: "nowrap", flexShrink: 0,
              }}>
                Subscribe →
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "48px 24px" }}>
          <div className="footer-inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 40 }}>
            {/* Brand */}
            <div style={{ maxWidth: 260 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "#C89B3C", fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>LONGTRESS</div>
              <p style={{ color: "rgba(249,243,232,0.35)", fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                Premium Haitian black castor oil, cold-pressed and traditionally crafted for all hair types.
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { label: "TikTok", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.14a8.27 8.27 0 004.84 1.54V7.25a4.85 4.85 0 01-1.07-.56z" },
                  { label: "Pinterest", path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
                ].map(({ label, path }) => (
                  <a key={label} href="#" aria-label={label} style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(249,243,232,0.07)", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.2s",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(249,243,232,0.5)">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
              <div>
                <div style={{ color: "#F9F3E8", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Shop</div>
                {["Hair Oil", "Gift Sets", "Bundle & Save", "Wholesale"].map((l) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ color: "rgba(249,243,232,0.4)", fontSize: 13, textDecoration: "none" }}>{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ color: "#F9F3E8", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Company</div>
                {["About Us", "Our Story", "Sustainability", "Press"].map((l) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ color: "rgba(249,243,232,0.4)", fontSize: 13, textDecoration: "none" }}>{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ color: "#F9F3E8", fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Support</div>
                {["Shipping", "Returns", "FAQ", "Contact"].map((l) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href={l === "FAQ" ? "#faq" : "#"} style={{ color: "rgba(249,243,232,0.4)", fontSize: 13, textDecoration: "none" }}>{l}</a>
                  </div>
                ))}
                <Link href="/admin" style={{ color: "rgba(249,243,232,0.25)", fontSize: 12, textDecoration: "none" }}>Admin</Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid rgba(249,243,232,0.08)", display: "flex", justifyContent: "space-between", color: "rgba(249,243,232,0.22)", fontSize: 12, flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span>© 2025 Longtress. All rights reserved.</span>
            <span>Made with 🌿 in Haiti · Powered by Stripe</span>
          </div>
        </div>
      </footer>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; padding-top: 80px !important; }
          .hero-bottle { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .benefits-grid { grid-template-columns: 1fr !important; }
          .order-grid { grid-template-columns: 1fr !important; }
          .order-bottle-col { order: -1; }
          .order-bottle-col > div { padding: 24px !important; }
          .order-bottle-col > div > div:last-child { padding: 24px !important; }
          .ingredients-grid { grid-template-columns: 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
}
