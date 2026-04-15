import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "4rem 1.5rem",
        background: "linear-gradient(180deg, #fffaf0 0%, #f8fafc 100%)",
      }}
    >
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 24,
          padding: "2.25rem",
          background: "#ffffff",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.08)",
          textAlign: "center",
        }}
      >
        <p style={{ letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b", marginBottom: "0.5rem" }}>
          Affiliate Store
        </p>
        <h1 style={{ fontSize: "2.2rem", marginBottom: "0.8rem", color: "#0f172a" }}>
          Landing Page
        </h1>
        <p style={{ fontSize: "1.05rem", color: "#334155", marginBottom: "1.5rem" }}>
          Explore curated products, bundles, and category pages from one place.
        </p>
        <div style={{ display: "flex", gap: "0.85rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ padding: "0.65rem 1rem", borderRadius: 999, border: "1px solid #cbd5e1" }}>
            Home
          </Link>
          <Link href="/shop" style={{ padding: "0.65rem 1rem", borderRadius: 999, border: "1px solid #cbd5e1" }}>
            Shop
          </Link>
          <Link href="/login" style={{ padding: "0.65rem 1rem", borderRadius: 999, border: "1px solid #cbd5e1" }}>
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
