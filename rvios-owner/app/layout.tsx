import type { Metadata } from "next";
import "./globals.css";

const rawApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
  .trim()
  .replace(/\/+$/, '');

/** يقبل الأصل وحده أو المسار الكامل، ويصل دائماً إلى `<origin>/api/v1`. */
const API = /\/api\/v\d+$/.test(rawApiUrl)
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/api$/, '')}/api/v1`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${API}/owner/profile`, { next: { revalidate: 3600 } });
    const profile = await res.json();
    return {
      title: `${profile.name} — ${profile.titleEn}`,
      description: profile.bioEn,
      openGraph: {
        title: `${profile.name} — ${profile.titleEn}`,
        description: profile.bioEn,
        images: profile.avatarUrl ? [profile.avatarUrl] : [],
      },
    };
  } catch {
    return { title: "Rayash Faisal — Founder of RVIOS", description: "Full-Stack Developer & Product Designer" };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
