import type { ReactNode } from "react";

/**
 * الإيقاع الرأسي الموحّد — يترجم `.sec` من المقترح المعتمد (`padding-block: 96px`).
 *
 * الصفحات القائمة تكتب `py-24` و`py-20` و`py-28` بلا قاعدة؛ هذا المكوّن يُنهي
 * التفاوت لكل ما يُبنى بعده.
 */
export function Section({
  children,
  tone = "surface",
  className = "",
  id,
}: {
  children: ReactNode;
  /** خلفية القسم — تناوبها يصنع الإيقاع اللوني للصفحة */
  tone?: "surface" | "alt" | "ink" | "none";
  className?: string;
  id?: string;
}) {
  const tones = {
    surface: "bg-surface",
    alt: "bg-surface-alt",
    ink: "bg-ink text-ivory",
    none: "",
  };
  return (
    <section id={id} className={`py-24 ${tones[tone]} ${className}`}>
      <div className="mx-auto w-[min(100%-3rem,1200px)]">{children}</div>
    </section>
  );
}

/**
 * رأس القسم — `.sec-head` + `.eyebrow`.
 *
 * الـ eyebrow بخط mono وشعيرة ذهبية قبله: النمط المتكرر في كل قسم من المقترح.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  onDark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  /** على الخلفيات الداكنة يصير الـ eyebrow ذهبياً بدل العنّابي */
  onDark?: boolean;
}) {
  return (
    <div
      className={`mb-16 grid max-w-[62ch] gap-4 ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] ${
            onDark ? "text-gold" : "text-primary"
          } ${align === "center" ? "justify-center" : ""}`}
        >
          <i aria-hidden className="h-px w-7 bg-gold" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-4xl font-bold -tracking-[0.01em] ${
          onDark ? "text-ivory" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-lg ${onDark ? "text-ivory/60" : "text-ink-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

/** خط ذهبي متلاشٍ — `.rule` */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-px bg-gradient-to-l from-gold to-transparent ${className}`}
    />
  );
}

/** رقاقة بحواف حادة بلا خلفية — `.tag`. تُستعمل لعرض `technologies[]`. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-border px-2 py-[3px] font-mono text-[11px] text-ink-muted">
      {children}
    </span>
  );
}
