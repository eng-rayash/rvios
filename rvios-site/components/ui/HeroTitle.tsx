import type { ElementType } from "react";

/**
 * عنوان بدخول متدرّج للكلمات — بلا JS.
 *
 * كل كلمة `span` بتأخير مضمَّن، والحركة من `@keyframes wordRise` في
 * `globals.css`. حلّ محلّ `SplitText` القائم على GSAP: ذاك كان يحمّل
 * مكتبة كاملة على المسار الحرج ليؤخّر ظهور أهمّ نصّ في الصفحة حتى
 * يعمل JS — وهو أيضاً أكبر عنصر مرئي (LCP).
 *
 * النصّ يبقى نصّاً واحداً لقارئ الشاشة: التقسيم بصريّ والمسافات محفوظة.
 */
export function HeroTitle({
  text,
  as: Tag = "h1" as ElementType,
  className = "",
  /** المللي ثانية بين كلمة والتالية */
  stagger = 70,
  /** تأخير قبل الكلمة الأولى — لتسلسل الـ hero ككل */
  delay = 0,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <Tag className={`word-rise ${className}`}>
      {words.map((word, i) => (
        <span key={i} style={{ animationDelay: `${delay + i * stagger}ms` }}>
          {word}
          {/* مسافة عادية خارج الـ span المتحرّك تنهار في التخطيط */}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
