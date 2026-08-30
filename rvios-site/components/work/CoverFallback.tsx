/**
 * غلاف مؤقّت يُولَّد من الـ slug.
 *
 * لا مشروع يحمل غلافاً بعد، وشبكة معرض بمستطيلات فارغة تفقد معناها.
 * هذا يرسم SVG مشتقّاً حسابياً من اسم المشروع: نفس الاسم يعطي نفس
 * الغلاف دائماً، واسمان مختلفان لا يتشابهان — فتبدو الشبكة متنوّعة
 * لا مكرّرة.
 *
 * SVG مضمَّن لا ملف: لا أصول تُدار، ولا طلب شبكة، ولا التباس ترخيص،
 * ويعمل لأي مشروع يُضاف لاحقاً بلا خطوة توليد. يختفي من تلقاء نفسه
 * فور رفع المحرّر غلافاً حقيقياً.
 */

/** تجزئة ثابتة عبر التشغيلات — `Math.random` كان سيغيّر الغلاف كل رندر. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function CoverFallback({
  slug,
  title,
  className = "",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const h = hash(slug);

  /* زاوية التدرّج ودرجة اللكنة وكثافة الشبكة — كلها من التجزئة */
  const angle = h % 360;
  const accent = ["var(--color-primary-500)", "var(--color-gold-500)"][h % 2];
  const rings = 3 + (h % 3);
  const offset = 18 + (h % 24);
  const letter = title.trim().charAt(0);

  /* معرّف فريد: تعريفات SVG عامّة في المستند، وتكرار id يجعل كل
     البطاقات ترث تدرّج أوّلها. */
  const uid = `cf-${h.toString(36)}`;

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`غلاف مؤقّت لمشروع ${title}`}
    >
      <defs>
        <linearGradient id={`${uid}-g`} gradientTransform={`rotate(${angle} .5 .5)`}>
          <stop offset="0%" stopColor="var(--color-surface-2)" />
          <stop offset="100%" stopColor="var(--color-surface-0)" />
        </linearGradient>
        <radialGradient id={`${uid}-r`} cx={`${offset}%`} cy="30%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.30" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${uid}-g)`} />
      <rect width="400" height="300" fill={`url(#${uid}-r)`} />

      {/* حلقات متحدة المركز — الزخرفة الهندسية التي تميّز بطاقة عن أخرى */}
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx={offset * 4}
          cy={90 + i * 14}
          r={40 + i * 34}
          fill="none"
          stroke={accent}
          strokeOpacity={0.16 - i * 0.03}
          strokeWidth="1"
        />
      ))}

      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--color-ink-900)"
        fillOpacity="0.10"
        fontSize="130"
        fontWeight="800"
        fontFamily="var(--font-display), sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}
