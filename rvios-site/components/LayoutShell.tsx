"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollProgress } from "@/components/ui/Motion";

/**
 * هيكل الصفحة الثابت.
 *
 * `SplashCursor` أُزيل هنا: مؤثر سائل يتبع المؤشّر على WebGL في كل صفحة،
 * يرسم إطاراً كل 16ms ما دام التبويب مفتوحاً. المراجع التي اعتُمدت
 * للاتجاه (linear.app، cursor.com، recent.design) لا تحمل شيئاً من هذا
 * النوع — الحركة عندها في الدخول والتحويم، لا في خلفية دائمة.
 */
export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
