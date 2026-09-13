const TECHS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python",
  "AWS", "Google Cloud", "Docker", "PostgreSQL",
  "MongoDB", "Redis", "GraphQL", "REST API",
  "TailwindCSS", "Figma", "FastAPI",
  "Laravel", "Django", "Firebase", "Nginx", "CI/CD",
];

export default function MarqueeTicker() {
  // Double the array for seamless infinite loop
  const doubled = [...TECHS, ...TECHS];

  return (
    <div className="relative overflow-hidden bg-surface-alt border-y border-black/6 py-4 select-none">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-surface-alt to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0  w-24 z-10 bg-gradient-to-r from-surface-alt to-transparent" />

      <div className="marquee-track">
        {doubled.map((tech, i) => (
          <span
            key={i}
            className="flex items-center gap-3 mx-6 shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
            <span className="font-body text-sm tracking-[0.12em] text-ink-muted whitespace-nowrap">
              {tech}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
