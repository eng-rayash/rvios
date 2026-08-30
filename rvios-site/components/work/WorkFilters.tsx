import Link from "next/link";
import type { ProjectFilters } from "@/lib/api/types";

const arabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

type Params = Record<string, string | undefined>;

/**
 * يبني رابطاً يبدّل مفتاحاً واحداً ويُبقي الباقي.
 * النقر على فلتر مُفعَّل يلغيه — سلوك متوقّع بلا زر «مسح» منفصل.
 */
function toggleHref(current: Params, key: string, value: string): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== "page" && k !== key) q.set(k, v);
  }
  if (current[key] !== value) q.set(key, value);
  const s = q.toString();
  return s ? `/work?${s}` : "/work";
}

function Group({
  label,
  items,
  paramKey,
  current,
}: {
  label: string;
  items: { value: string; display: string; count: number }[];
  paramKey: string;
  current: Params;
}) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] tracking-[0.14em] text-fg-muted">
        {label}
      </span>
      {items.map((it) => {
        const active = current[paramKey] === it.value;
        return (
          <Link
            key={it.value}
            href={toggleHref(current, paramKey, it.value)}
            aria-pressed={active}
            className={`border px-3 py-1 font-mono text-[11px] transition-all duration-fast ease-out ${
              active
                ? "border-primary bg-primary text-fg-onPrimary"
                : "border-border text-ink-muted hover:border-primary hover:text-primary"
            }`}
          >
            {it.display}
            <span className="ms-1 opacity-60">{arabicDigits(it.count)}</span>
          </Link>
        );
      })}
    </div>
  );
}

/**
 * شريط الفلاتر — الحالة كلها في `searchParams` لا في حالة العميل، فالرابط
 * قابل للمشاركة والفهرسة، والصفحة تبقى مكوّن خادم.
 */
export function WorkFilters({
  filters,
  current,
}: {
  filters: ProjectFilters;
  current: Params;
}) {
  const hasAny = Object.entries(current).some(
    ([k, v]) => v && k !== "page",
  );

  return (
    <div className="sticky top-20 z-sticky border-y border-border bg-surface/95 py-4 backdrop-blur">
      <div className="mx-auto flex w-[min(100%-3rem,1200px)] flex-col gap-3">
        <Group
          label="التصنيف"
          paramKey="category"
          current={current}
          items={filters.categories.map((c) => ({
            value: c.slug,
            display: c.name,
            count: c.count,
          }))}
        />
        <Group
          label="القطاع"
          paramKey="industry"
          current={current}
          items={filters.industries.map((i) => ({
            value: i.value,
            display: i.value,
            count: i.count,
          }))}
        />
        <Group
          label="التقنية"
          paramKey="tech"
          current={current}
          items={filters.technologies.slice(0, 8).map((t) => ({
            value: t.value,
            display: t.value,
            count: t.count,
          }))}
        />
        <Group
          label="السنة"
          paramKey="year"
          current={current}
          items={filters.years.map((y) => ({
            value: String(y.value),
            display: arabicDigits(y.value),
            count: y.count,
          }))}
        />

        {hasAny && (
          <Link
            href="/work"
            className="self-start font-mono text-[11px] text-primary underline-offset-4 hover:underline"
          >
            مسح الفلاتر ×
          </Link>
        )}
      </div>
    </div>
  );
}
