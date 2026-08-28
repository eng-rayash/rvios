"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { postsApi, contactsApi, categoriesApi, servicesApi, mediaApi } from "@/lib/api";
import { FileText, MessageSquare, Tag, Briefcase, Image, TrendingUp } from "lucide-react";

interface Stats {
  posts: number;
  unreadContacts: number;
  categories: number;
  services: number;
  media: number;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      postsApi.list(token, "limit=1"),
      contactsApi.stats(token),
      categoriesApi.list(),
      servicesApi.list(token),
      mediaApi.list(token),
    ]).then(([posts, contacts, cats, svcs, media]) => {
      const unread = (contacts as any[]).find((c: any) => c.status === "UNREAD")?._count?.status ?? 0;
      setStats({
        posts: posts.meta?.total ?? 0,
        unreadContacts: unread,
        categories: (cats as any[]).length,
        services: (svcs as any[]).length,
        media: (media as any[]).length,
      });
    }).catch(console.error);
  }, [token]);

  const cards = [
    { label: "المقالات", value: stats?.posts, icon: FileText, color: "#60a5fa" },
    { label: "رسائل غير مقروءة", value: stats?.unreadContacts, icon: MessageSquare, color: "#f87171" },
    { label: "التصنيفات", value: stats?.categories, icon: Tag, color: "#a78bfa" },
    { label: "الخدمات", value: stats?.services, icon: Briefcase, color: "#34d399" },
    { label: "ملفات الوسائط", value: stats?.media, icon: Image, color: "#fbbf24" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 6 }}>لوحة التحكم</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>مرحباً بك في نظام إدارة RVIOS</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "0.7rem", color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{label}</p>
                <p style={{ fontSize: "2rem", fontWeight: 800 }}>{value ?? "—"}</p>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 16 }}>إجراءات سريعة</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "مقال جديد", href: "/dashboard/posts/new" },
            { label: "خدمة جديدة", href: "/dashboard/services/new" },
            { label: "مشروع جديد", href: "/dashboard/projects/new" },
            { label: "رفع وسيط", href: "/dashboard/media" },
          ].map(({ label, href }) => (
            <a key={href} href={href} className="btn btn-ghost" style={{ textDecoration: "none" }}>{label}</a>
          ))}
        </div>
      </div>
    </div>
  );
}
