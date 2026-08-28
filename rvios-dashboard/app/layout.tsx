import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "RVIOS Admin Dashboard",
  description: "لوحة تحكم RVIOS الإدارية",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* data-theme صريح: التصميم المعتمد للوحة فاتح بشريط جانبي داكن.
       بدونه تتبع اللوحة تفضيل نظام التشغيل وتنقلب داكنة بالكامل —
       وهو سلوك لم يقرّره أحد. المبدّل اليدوي سيغيّر هذه السمة. */
    <html lang="ar" dir="rtl" data-theme="light">
      <head>
        {/* توكنز الهوية + @font-face. يُحمَّل قبل globals.css حتى تتوفّر
            المتغيّرات عند أول رسم، فلا يومض المحتوى بألوان افتراضية.
            المصدر: packages/design-tokens — يُنسخ بـ brand-assets/sync.mjs */}
        <link
          rel="preload"
          as="font"
          type="font/ttf"
          href="/fonts/Hacen%20Liner%20Screen.ttf"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="/styles/tokens.css" />
      </head>
      <body className="bg-surface-1 text-fg antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
