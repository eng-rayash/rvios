import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * جذر مساحة العمل — إلزامي هنا.
   *
   * Next 16 يستنتج الجذر من أقرب **مستودع git**. وبما أن `rvios-site` مستودع
   * مستقل والجذر `F:\rvios` ليس مستودعاً، فهو يتجاهل `pnpm-workspace.yaml`
   * ولا يجد `next` نفسه في `node_modules` الجذرية:
   *
   *   ⚠ Next.js ignored pnpm-workspace.yaml … because it is outside the
   *     current Git repository
   *   Error: Could not find the Next.js package (next/package.json)
   *
   * التصريح هنا يحلّها. ويصير زائداً — لا ضاراً — بعد توحيد المستودعات.
   */
  turbopack: { root: join(here, "..") },

  /**
   * مسارات الخدمات القديمة — قبل إعادة التموضع كمنصة ويب.
   *
   * 301 تنقل رصيد الفهرسة إلى الصفحة الجديدة الأقرب، وتُبقي روابط الخدمات
   * في صفحات المشاريع (تُبنى من قاعدة البيانات بالـslug القديم) صالحة.
   * الخدمات التي لا مقابل لها تذهب إلى صفحة الخدمات.
   */
  async redirects() {
    return [
      { source: "/services/product-design", destination: "/services/web-design", permanent: true },
      { source: "/services/software-development", destination: "/services/web-development", permanent: true },
      { source: "/services/software-solutions", destination: "/services/web-systems", permanent: true },
      { source: "/services/cloud-infrastructure", destination: "/services", permanent: true },
      { source: "/services/ai-automation", destination: "/services", permanent: true },
      { source: "/services/consulting", destination: "/services", permanent: true },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
      { protocol: "https", hostname: "pub-*.r2.dev" },
      /* صور بيانات البذور فقط. الصور الحقيقية تُرفع إلى R2 عبر
         POST /media/presign — يمكن حذف هذا السطر بعد استبدال البذور. */
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
