import Link from "next/link";
import { ScrollStackItem } from "@/components/ScrollStack";
import type { Service } from "@/lib/services";

/**
 * بطاقة الخدمة — تستخدمها الرئيسية وصفحة الخدمات.
 *
 * كان نفس الـmarkup مكرّراً في الصفحتين فاختلفتا مع أول تعديل.
 *
 * الخلفية عبر background-image لا <Image>: صور الخدمات قد لا تكون مرفوعة
 * بعد، وعندها يبقى التدرّج وحده بدل أيقونة صورة مكسورة.
 */
export default function ServiceCard({
  service: s,
  maxTags,
}: {
  service: Service;
  /** الرئيسية تعرض عدداً أقل من الوسوم لضيق البطاقة */
  maxTags?: number;
}) {
  const tags = maxTags ? s.tags.slice(0, maxTags) : s.tags;

  return (
    <ScrollStackItem itemClassName="group relative overflow-hidden bg-ink text-ivory border border-primary/25 hover:border-primary/60 transition-colors shadow-2xl">
      {/* صورة الخدمة */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url('${s.image}')` }}
      />
      {/* حاجب ثابت ثم تدرّج اتجاهي: رأسي على الجوال (النص تحت) وأفقي من جهة
          النص على الشاشات الأوسع. التدرّج وحده لا يكفي فوق صور فاتحة. */}
      <div aria-hidden className="absolute inset-0 bg-[rgb(var(--color-ink-900-ch)/0.3)]" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--color-ink-900-ch))] via-[rgb(var(--color-ink-900-ch)/0.9)] to-[rgb(var(--color-ink-900-ch)/0.45)] md:bg-gradient-to-l md:from-[rgb(var(--color-ink-900-ch))] md:via-[rgb(var(--color-ink-900-ch)/0.85)] md:to-[rgb(var(--color-ink-900-ch)/0.2)]"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 h-full">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-primary font-bold">{s.id}</span>
            <span className="w-8 h-px bg-primary/40" />
            <span className="font-body text-xs tracking-widest text-ivory/60 uppercase">{s.nameEn}</span>
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-ivory font-bold">{s.nameAr}</h3>
          <p className="font-body text-base leading-relaxed text-ivory/80">{s.descAr}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full bg-[rgb(var(--color-ink-900-ch)/0.55)] backdrop-blur-sm border border-primary/25 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="self-end md:self-center shrink-0">
          <Link
            href={`/services/${s.slug}`}
            className="btn-primary text-sm px-6 py-3.5 inline-flex items-center gap-2"
          >
            تفاصيل الخدمة — Details
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </ScrollStackItem>
  );
}
