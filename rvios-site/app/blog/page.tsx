import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getCategories } from "@/lib/api/client";

export const metadata: Metadata = {
  title: "المدونة — RVIOS Technologies",
  description: "مقالات ورؤى تقنية من فريق RVIOS في البرمجة والذكاء الاصطناعي والتحول الرقمي",
  openGraph: {
    title: "مدونة RVIOS التقنية",
    description: "مقالات في البرمجة والذكاء الاصطناعي والتحول الرقمي",
    type: "website",
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const { page: pageParam, category: categorySlug, search } = await searchParams;
  const page = Number(pageParam) || 1;

  const [postsRes, categories] = await Promise.all([
    getPublishedPosts({ page, limit: 9, categorySlug, search }).catch(() => ({ data: [], meta: { total: 0, totalPages: 1, page: 1, limit: 9 } })),
    getCategories().catch(() => []),
  ]);

  const posts = postsRes.data;
  const meta = postsRes.meta;

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      {/* Hero */}
      <section className="bg-[#1A120F] text-[#FAF9F6] pt-32 pb-20 px-6 text-center">
        <p className="text-xs tracking-[0.2em] text-[#9e2226] uppercase mb-4 font-mono">RVIOS BLOG</p>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">المدونة التقنية</h1>
        <p className="text-[#FAF9F6]/60 text-lg max-w-2xl mx-auto">
          رؤى وتحليلات تقنية من فريق RVIOS في البرمجة والذكاء الاصطناعي والتحول الرقمي
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-10">
          <Link href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!categorySlug ? "bg-[#9e2226] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#9e2226]"}`}>
            الكل
          </Link>
          {(categories as any[]).map((cat: any) => (
            <Link key={cat.id} href={`/blog?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${categorySlug === cat.slug ? "bg-[#9e2226] text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-[#9e2226]"}`}>
              {cat.name}
              {cat._count?.posts > 0 && <span className="mr-1 opacity-60">({cat._count.posts})</span>}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-2xl mb-2">لا توجد مقالات</p>
            <p className="text-sm">تابعنا قريباً لمزيد من المحتوى</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100">
                {post.heroImageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img src={post.heroImageUrl} alt={post.heroImageAlt || post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                {!post.heroImageUrl && (
                  <div className="h-48 bg-gradient-to-br from-[#9e2226] to-[#6e1518] flex items-center justify-center">
                    <span className="text-white/20 text-6xl font-bold">{post.title[0]}</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-xs bg-[#9e2226]/10 text-[#9e2226] px-2 py-1 rounded-full font-semibold">{post.category.name}</span>
                    )}
                    {post.featured && (
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full font-semibold">مميز</span>
                    )}
                  </div>
                  <h2 className="font-bold text-lg leading-snug mb-2 group-hover:text-[#9e2226] transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">{post.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <span>{post.readingTime} دقائق قراءة</span>
                      <span>{post.views} مشاهدة</span>
                    </div>
                    <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ar-SA") : ""}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}
                    className="mt-4 flex items-center gap-2 text-[#9e2226] font-semibold text-sm hover:gap-3 transition-all">
                    اقرأ المقال ←
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <Link key={i} href={`/blog?page=${i + 1}${categorySlug ? `&category=${categorySlug}` : ""}`}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-sm transition-all ${i + 1 === meta.page ? "bg-[#9e2226] text-white" : "bg-white border hover:border-[#9e2226]"}`}>
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
