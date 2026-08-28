"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "حدث خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>R</div>
            <span style={{ fontWeight: 800, fontSize: "1.3rem", letterSpacing: "0.02em" }}>RVIOS</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>لوحة التحكم الإدارية</p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: "32px" }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "6px" }}>تسجيل الدخول</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "28px" }}>أدخل بيانات الحساب الإداري</p>

          {error && (
            <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, color: "#f87171", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label>البريد الإلكتروني</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@rvios.com" required />
            </div>
            <div>
              <label>كلمة المرور</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 8, opacity: loading ? 0.7 : 1 }}>
              {loading ? "جار الدخول..." : "دخول"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-faint)", fontSize: "0.75rem" }}>
          RVIOS Admin — محمي ومشفر
        </p>
      </div>
    </div>
  );
}
