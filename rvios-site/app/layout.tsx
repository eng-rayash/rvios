import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "RVIOS Technologies — تصميم وتطوير مواقع الويب | Web Design & Development",
  description:
    "RVIOS منصة متخصصة في تصميم وتطوير مواقع الويب: مواقع الشركات، أنظمة وتطبيقات الويب، المتاجر الإلكترونية، صفحات الهبوط، والعناية بالمواقع بعد الإطلاق.",
  keywords: "تصميم مواقع، تطوير مواقع، متجر إلكتروني، صفحات هبوط، صيانة مواقع، Web Design، Web Development، Next.js، RVIOS",
  openGraph: {
    title: "RVIOS Technologies",
    description: "نصمم ونطوّر مواقع ويب مخصصة تنمو معها أعمالك",
    url: "https://rvios.com",
    siteName: "RVIOS Technologies",
    locale: "ar_YE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* data-theme صريح: الهوية المعتمدة فاتحة. بدونه تتبع الصفحة تفضيل نظام
       التشغيل وتنقلب داكنة — سلوك لم يقرّره أحد. */
    <html lang="ar" dir="rtl" data-theme="light">
      <head>
        {/* توكنز الهوية + @font-face. تُحمَّل قبل globals.css فتتوفّر
            المتغيّرات عند أول رسم. المصدر: packages/design-tokens */}
        <link rel="stylesheet" href="/styles/tokens.css" />
      </head>
      <body className="bg-surface font-body antialiased selection:bg-primary/20 selection:text-primary">
        <LayoutShell>{children}</LayoutShell>

        <GoogleAnalytics gaId="G-LXZYJ0F1GC" />
      </body>
    </html>
  );
}