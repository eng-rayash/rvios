"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { postsApi } from "@/lib/api";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

export default function PostsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function load(page = 1) {
    if (!token) return;
    setLoading(true);
    try {
      const res = await postsApi.list(token, `page=${page}&limit=15&search=${search}`);
      setPosts(res.data);
      setMeta(res.meta);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(1); }, [token, search]);

  async function remove(id: string) {
    if (!confirm("تأكيد حذف المقال؟")) return;
    await postsApi.delete(token!, id);
    load();
  }

  const statusBadge = (s: string) =>
    s === "PUBLISHED" ? <span className="badge badge-green">منشور</span>
    : <span className="badge badge-gray">مسودة</span>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>المقالات</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>{meta.total} مقال إجمالاً</p>
        </div>
        <Link href="/dashboard/posts/new" className="btn btn-primary">
          <Plus size={16} /> مقال جديد
        </Link>
      </div>

      {/* Search */}
      <input className="input" placeholder="البحث في المقالات..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: 20 }} />

      <div className="card" style={{ overflow: "hidden" }}>
        <table>
          <thead>
            <tr>
              <th>العنوان</th>
              <th>التصنيف</th>
              <th>الحالة</th>
              <th>المشاهدات</th>
              <th>تاريخ الإنشاء</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: 32 }}>جار التحميل...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)", padding: 32 }}>لا توجد مقالات</td></tr>
            ) : posts.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600, maxWidth: 280 }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-faint)", marginTop: 2 }}>/{p.slug}</div>
                </td>
                <td><span className="badge badge-blue">{p.category?.name ?? "—"}</span></td>
                <td>{statusBadge(p.status)}</td>
                <td style={{ color: "var(--text-muted)" }}>{p.views}</td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(p.createdAt).toLocaleDateString("ar")}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Link href={`/dashboard/posts/${p.id}/edit`} className="btn btn-ghost" style={{ padding: "6px 10px" }}><Pencil size={14} /></Link>
                    <button className="btn btn-danger" style={{ padding: "6px 10px" }} onClick={() => remove(p.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 20, justifyContent: "center" }}>
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <button key={i} className={`btn ${i + 1 === meta.page ? "btn-primary" : "btn-ghost"}`}
              style={{ width: 36, height: 36, padding: 0, justifyContent: "center" }}
              onClick={() => load(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
