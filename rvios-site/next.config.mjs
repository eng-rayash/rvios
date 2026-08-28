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
