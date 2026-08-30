const TECHS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python",
  "AWS", "Google Cloud", "Docker", "Kubernetes", "PostgreSQL",
  "MongoDB", "Redis", "GraphQL", "REST API", "Flutter",
  "React Native", "TailwindCSS", "Figma", "AI / ML", "FastAPI",
  "Laravel", "Django", "Firebase", "Nginx", "CI/CD",
];

export default function MarqueeTicker() {
  // Double the array for seamless infinite loop
  const doubled = [...TECHS, ...TECHS];

  return (
    /* aria-hidden: قائمة تقنيات مكرّرة مرّتين لأجل الحلقة البصرية — قارئ
       الشاشة كان يقرأ خمسين اسماً بلا معنى. */
    <div
      aria-hidden
      className="relative select-none overflow-hidden border-y border-border-subtle bg-surface-1 py-4"
    >
      {/* تلاشي الحافتين — يخفي بداية الحلقة ونهايتها */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-surface-1 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-surface-1 to-transparent" />

      <div className="marquee-track">
        {doubled.map((tech, i) => (
          <span key={i} className="mx-6 flex shrink-0 items-center gap-3">
            <span className="h-1 w-1 shrink-0 bg-gold/50" />
            <span className="whitespace-nowrap font-mono text-xs tracking-[0.16em] text-fg-muted">
              {tech}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
