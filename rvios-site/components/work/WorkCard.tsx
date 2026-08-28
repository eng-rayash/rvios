import Image from "next/image";
import Link from "next/link";
import type { ProjectCard } from "@/lib/api/types";

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
    <article className="group border border-border bg-card transition-[border-color,transform] duration-base ease-out hover:-translate-y-[3px] hover:border-gold">
      <Link href={`/work/${project.slug}`} className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
        {/* الغلاف — وإن غاب فتدرّج حبري بالحرف الأول */}
        <div className="relative grid aspect-[4/3] place-items-center overflow-hidden border-b border-border bg-gradient-to-br from-ink to-primary-900">
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
            <span
              aria-hidden
              className="font-display text-4xl font-extrabold text-ivory/[0.13]"
            >
              {project.title.trim().charAt(0)}
            </span>
          )}

          {project.year && (
            <em className="absolute start-3 top-3 z-[2] bg-surface px-2 py-[2px] font-mono text-[11px] not-italic tracking-[0.1em] text-ink-muted">
              {arabicDigits(project.year)}
            </em>
          )}
        </div>

        <div className="p-6">
          {project.client && (
            <span className="font-mono text-xs tracking-[0.12em] text-gold-700">
              {project.client}
            </span>
          )}

          <h3 className="mb-3 mt-2 font-display text-lg font-bold text-ink">
            {project.title}
          </h3>

          <p className="line-clamp-2 text-sm text-ink-muted">{project.summary}</p>

          {metric && (
            <div className="mt-5 flex items-baseline gap-2 border-t border-border-subtle pt-4">
              <b className="font-display text-2xl text-primary">
                {metric.value}
                {metric.unit ?? ""}
              </b>
              <span className="text-xs text-ink-muted">{metric.label}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
