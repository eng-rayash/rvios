import Image from "next/image";
import Link from "next/link";
import type { ProjectCard } from "@/lib/api/types";
import { CoverFallback } from "./CoverFallback";

/** ٢٠٢٥ → ٢٠٢٥ بالأرقام العربية-الهندية، لتوافق `metrics[].value` المزروعة. */
const arabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

/**
 * بطاقة المعرض — ترجمة `.work-card` من `design/proposals/a-heritage`.
 *
 * الحواف حادة (`--radius-xs`) والفصل بالخطوط لا بالظل: هذه شخصية «أرشيف ملكي».
 */
export function WorkCard({
  project,
  priority = false,
}: {
  project: ProjectCard;
  /** للبطاقات فوق الطيّة — يمنع تأخّر أول صورة */
  priority?: boolean;
}) {
  /* الخادم يقيّد `metrics` بـ `take: 1`، فقد تكون فارغة تماماً. */
  const metric = project.metrics?.[0];

  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-card transition-[border-color,transform] duration-base ease-out hover:-translate-y-[3px] hover:border-gold">
      <Link href={`/work/${project.slug}`} className="block">
        {/* الغلاف — الصورة تكاد تكون البطاقة كلها، والبيانات تنزلق فوقها */}
        <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={project.coverImageAlt ?? project.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder={project.coverBlurHash ? "blur" : "empty"}
              blurDataURL={project.coverBlurHash ?? undefined}
              className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <CoverFallback
              slug={project.slug}
              title={project.title}
              className="h-full w-full transition-transform duration-slow ease-out group-hover:scale-[1.03]"
            />
          )}

          {project.year && (
            <em className="absolute start-3 top-3 z-[2] rounded-xs border border-border-strong bg-surface-0/80 px-2 py-[2px] font-mono text-[11px] not-italic tracking-[0.1em] text-fg-muted backdrop-blur-sm">
              {arabicDigits(project.year)}
            </em>
          )}

          {/* المؤشّر ينزلق من الأسفل عند التحويم — نمط معارض الأعمال:
              البطاقة صورة في السكون، والبيانات عند الاهتمام. */}
          {metric && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-surface-0 via-surface-0/90 to-transparent p-4 opacity-0 transition-[transform,opacity] duration-base ease-out group-hover:translate-y-0 group-hover:opacity-100"
            >
              <div className="flex items-baseline gap-2">
                <b className="font-display text-2xl text-primary-300">
                  {metric.value}
                  {metric.unit ?? ""}
                </b>
                <span className="text-xs text-fg-muted">{metric.label}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {project.client && (
            <span className="font-mono text-xs tracking-[0.12em] text-gold">
              {project.client}
            </span>
          )}

          <h3 className="mb-3 mt-2 font-display text-lg font-bold text-fg transition-colors duration-base group-hover:text-gold">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm text-fg-muted">{project.summary}</p>

          {/* نسخة ثابتة للمس ولقارئ الشاشة: النسخة المتحرّكة فوق الغلاف
              `aria-hidden` ولا تظهر بلا تحويم، فلا يجوز أن تكون الوحيدة. */}
          {metric && (
            <div className="mt-5 flex items-baseline gap-2 border-t border-border-subtle pt-4 md:hidden">
              <b className="font-display text-2xl text-primary-300">
                {metric.value}
                {metric.unit ?? ""}
              </b>
              <span className="text-xs text-fg-muted">{metric.label}</span>
            </div>
          )}
          <span className="sr-only">
            {metric ? `${metric.label}: ${metric.value}${metric.unit ?? ""}` : ""}
          </span>
        </div>
      </Link>
    </article>
  );
}
