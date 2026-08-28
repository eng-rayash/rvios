import { MetadataRoute } from "next";
import { getProjectSlugs, getPublishedPosts } from "@/lib/api/client";

const BASE = "https://rvios.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    "",
    "/work",
    "/services",
    "/about",
    "/contact",
    "/blog",
    "/services/software-development",
    "/services/product-design",
    "/services/cloud-infrastructure",
    "/services/ai-automation",
    "/services/consulting",
    /* كانت مفقودة رغم وجود الصفحة — فلم تُفهرس قط */
    "/services/software-solutions",
  ].map((route) => ({
    url: `${BASE}${route}`,
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/work" ? 0.9 : 0.8,
  }));

  /* المسارات الديناميكية عبر عميل الـ API نفسه لا بـ fetch يدوي:
     المسار السابق كان يبني العنوان من `NEXT_PUBLIC_API_URL` بافتراض
     `/api` فينكسر بعد إضافة `/v1`. */
  const [projectRoutes, blogRoutes] = await Promise.all([
    getProjectSlugs()
      .then((slugs) =>
        slugs.map((p) => ({
          url: `${BASE}/work/${p.slug}`,
          lastModified: p.updatedAt ?? today,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
      )
      .catch(() => []),
    getPublishedPosts({ limit: 100 })
      .then((res) =>
        (res.data ?? []).map((post: { slug: string; updatedAt?: string; publishedAt?: string; featured?: boolean }) => ({
          url: `${BASE}/blog/${post.slug}`,
          lastModified: post.updatedAt ?? post.publishedAt ?? today,
          changeFrequency: "monthly" as const,
          priority: post.featured ? 0.9 : 0.7,
        })),
      )
      .catch(() => []),
  ]);

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
