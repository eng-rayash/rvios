import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { GoogleAnalytics } from "@next/third-parties/google";

export const metadata: Metadata = {
  title: "RVIOS Technologies — حلول تقنية متكاملة | Digital Solutions",
  description:
    "RVIOS شركة تقنية متخصصة في تطوير البرمجيات، تصميم المنتجات، البنية التحتية السحابية، الأتمتة والذكاء الاصطناعي، والاستشارات التقنية.",
  keywords: "تطوير تطبيقات، تصميم مواقع، حلول سحابية، ذكاء اصطناعي، تحول رقمي، RVIOS",
  openGraph: {
    title: "RVIOS Technologies",
    description: "حلول تقنية متكاملة لبناء أعمال رقمية أكثر ذكاءً",
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