import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug } from "@/lib/api/client";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatPostContent(content: string = ""): string {
  if (!content) return "";
  
  // Replace literal '\\n' string escapes with real newlines
  let cleaned = content.replace(/\\n/g, "\n");
  
  // Basic markdown to styled HTML tags
  let html = cleaned
    .replace(/^---$/gm, '<hr class="my-8 border-t border-gray-200" />')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#1A120F] mt-8 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#1A120F] mt-10 mb-4 border-b border-gray-200 pb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-[#1A120F] mt-10 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-[#9e2226] font-semibold underline hover:text-[#6e1518] transition-colors">$1</a>')
    .replace(/^✅ (.*$)/gim, '<div class="flex items-center gap-2 text-gray-800 my-2 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100"><span class="text-emerald-600 font-bold">✅</span> <span>$1</span></div>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-gray-700 my-1">$1</li>');

  const blocks = html
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("<h") || block.startsWith("<hr") || block.startsWith("<div") || block.startsWith("<li")) {
        return block;
      }
      return `<p class="mb-4 leading-relaxed text-gray-700">${block.replace(/\n/g, "<br />")}</p>`;
    });

  return blocks.join("");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    return {
      title: `${post.title} — RVIOS`,
      description: post.metaDescription || post.description,
      keywords: post.keywords?.join(", "),
      openGraph: {
        title: post.title,
        description: post.metaDescription || post.description,
        type: "article",
        publishedTime: post.publishedAt,
        images: post.heroImageUrl ? [{ url: post.heroImageUrl, alt: post.heroImageAlt || post.title }] : [],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.metaDescription || post.description,
        images: post.heroImageUrl ? [post.heroImageUrl] : [],
      },
    };
  } catch {
    return { title: "المقال — RVIOS" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: any;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  // JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    image: post.heroImageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "RVIOS Technologies", url: "https://rvios.com" },
    publisher: { "@type": "Organization", name: "RVIOS Technologies", logo: { "@type": "ImageObject", url: "https://rvios.com/logo.png" } },
    keywords: post.keywords?.join(", "),
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Hero */}
      <section className="bg-[#1A120F] text-[#FAF9F6] pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/blog" className="text-[#9e2226] text-sm hover:underline">المدونة</Link>
            <span className="text-white/30">←</span>
            {post.category && <span className="text-white/50 text-sm">{post.category.name}</span>}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
          <p className="text-[#FAF9F6]/60 text-lg leading-relaxed mb-8">{post.description}</p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#9e2226]/30 flex items-center justify-center">
                <span className="text-[#9e2226] font-bold text-xs">RV</span>
              </div>
              <span>RVIOS Technologies</span>
            </div>
            <span>{post.readingTime} دقائق قراءة</span>
            {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}</span>}
            <span>{post.views} مشاهدة</span>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {post.heroImageUrl && (
        <div className="max-w-5xl mx-auto px-6 -mt-8 mb-12">
          <img src={post.heroImageUrl} alt={post.heroImageAlt || post.title}
            className="w-full rounded-2xl shadow-2xl max-h-[500px] object-cover" />
        </div>
      )}

      {/* Content + TOC */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_280px] gap-12">
        {/* Article */}
        <article className="prose prose-lg max-w-none">
          <div
            className="text-gray-700 leading-relaxed space-y-4"
            style={{ lineHeight: 1.9, fontSize: "1.05rem" }}
            dangerouslySetInnerHTML={{ __html: formatPostContent(post.content) }}
          />
        </article>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 self-start space-y-6">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-sm mb-4 text-gray-500 uppercase tracking-wider">الوسوم</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-[#9e2226] rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-2">هل تحتاج مساعدة تقنية؟</h3>
            <p className="text-white/70 text-sm mb-4">فريق RVIOS جاهز لمساعدتك في مشروعك</p>
            <Link href="/contact" className="block text-center bg-white text-[#9e2226] rounded-xl py-2.5 font-bold text-sm hover:bg-[#FFEFDF] transition-colors">
              تواصل معنا
            </Link>
          </div>

          {/* Keywords */}
          {post.keywords?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-sm mb-4 text-gray-500 uppercase tracking-wider">كلمات مفتاحية</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw: string) => (
                  <span key={kw} className="text-xs bg-[#9e2226]/5 text-[#9e2226] px-2 py-1 rounded">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[#9e2226] font-semibold hover:gap-3 transition-all">
          ← العودة إلى المدونة
        </Link>
      </div>
    </main>
  );
}
