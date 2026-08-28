"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { settingsApi } from "@/lib/api";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    if (!token) return;
    const data: any[] = await settingsApi.list(token).catch(() => []);
    const map: Record<string, string> = {};
    data.forEach(s => { map[s.key] = s.value; });
    setSettings(map);
    setLoading(false);
  }

  useEffect(() => { load(); }, [token]);

  async function save() {
    setSaving(true);
    const arr = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await settingsApi.bulkUpdate(token!, arr);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields = [
    { key: "site_name", label: "اسم الموقع", type: "text" },
    { key: "site_email", label: "البريد الإلكتروني", type: "email" },
    { key: "site_whatsapp", label: "رقم واتساب", type: "text" },
    { key: "site_maintenance", label: "وضع الصيانة (true/false)", type: "text" },
  ];

  if (loading) return <p style={{ color: "var(--text-muted)" }}>جار التحميل...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>إعدادات الموقع</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>الإعدادات العامة لـ RVIOS</p>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saved ? "تم الحفظ ✓" : saving ? "جار الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>

      <div className="card" style={{ padding: 32, maxWidth: 600 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label>{f.label}</label>
              <input className="input" type={f.type}
                value={settings[f.key] ?? ""}
                onChange={e => setSettings(prev => ({ ...prev, [f.key]: e.target.value }))} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
