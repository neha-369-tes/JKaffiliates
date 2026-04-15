import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <section style={{ textAlign: "center", maxWidth: 560 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>Login</h1>
        <p style={{ marginBottom: "1rem" }}>This page is now available and no longer returns 404.</p>
        <Link href="/">Go back home</Link>
      </section>
    </main>
  );
}
