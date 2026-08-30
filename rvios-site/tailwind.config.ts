import type { Config } from "tailwindcss";

const config: Config = {
  /* كل القيم البصرية من preset التوكنز المولَّد. لا تضف لوناً هنا —
     أضفه في packages/design-tokens. */
  presets: [require("@rvios/design-tokens/preset")],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ══════════════════════════════════════════════════════
           أسماء توافق — Strangler

           الـ preset يوفّر سلالم (`ink-900`, `surface-0`, `fg-inverse`)
           بينما ~٣٠٠ استعمال قائم يكتب `bg-surface` و`text-ink`
           و`text-ivory`. هذه الأسماء تُبقيها عاملة وتُوجّهها إلى
           التوكنز، فتنتقل الصفحات إلى الهوية الجديدة بلا تعديل ملف.

           ⚠ بعد اعتماد «المعرض الداكن» صار الموقع داكناً دائماً، وسلّم
           `ink` انقلب في الوضع الداكن (`ink-900` = أبيض). لذلك:

             `text-ink`   → أبيض ✔ (نصّ أساسي على سطح داكن)
             `text-ivory` → كان يشير إلى `text-inverse` أي أسود ✘
                            صار يشير إلى `ink-900` أي أبيض ✔

           و`bg-ink`/`bg-ivory` حُذفا من الشيفرة كلياً (استُبدلا بـ
           `bg-surface-2`/`bg-surface-1`): اسم واحد لا يصلح خلفيةً ونصّاً
           معاً بعد انقلاب السلّم.

           تُحذف عند هجرة آخر صفحة إلى السلّم الكامل.
           ══════════════════════════════════════════════════════ */
        surface:        "var(--color-surface-0)",
        "surface-alt":  "var(--color-surface-1)",
        card:           "var(--color-surface-1)",
        ink:            "var(--color-ink-900)",
        "ink-muted":    "var(--color-ink-500)",
        "ink-faint":    "var(--color-ink-300)",
        ivory:          "var(--color-ink-900)",
        "ivory-soft":   "var(--color-surface-1)",
        graphite:       "var(--color-surface-2)",
        "primary-dark": "var(--color-primary-700)",
        "primary-light":"var(--color-primary-300)",
        "gold-soft":    "var(--color-gold-100)",
      },
      fontFamily: {
        display: ["var(--font-yapari)", "var(--font-maghfira)", "sans-serif"],
        body:    ["var(--font-panorama)", "var(--font-givonic)", "sans-serif"],
      },
      /* التدرّجات تقرأ قنوات التوكنز، فتتبع السمة بدل تثبيت لون فاتح.
         `-ch` هي صيغة "R G B" التي يولّدها build.mjs لأجل الشفافية. */
      backgroundImage: {
        "gold-line":       "linear-gradient(90deg, transparent, rgb(var(--color-gold-500-ch)), transparent)",
        "rvios-radial":    "radial-gradient(120% 120% at 15% 10%, rgb(var(--color-primary-500-ch) / 0.14) 0%, transparent 55%)",
        "hero-vignette":   "linear-gradient(to bottom, rgb(var(--color-surface-0-ch) / 0.2) 0%, transparent 45%, rgb(var(--color-surface-0-ch) / 0.85) 100%)",
        "primary-gradient":"linear-gradient(135deg, rgb(var(--color-primary-500-ch)) 0%, rgb(var(--color-primary-700-ch)) 100%)",
        "card-shine":      "linear-gradient(135deg, transparent 40%, rgb(var(--color-gold-500-ch) / 0.10) 100%)",
        "section-dark":    "linear-gradient(135deg, rgb(var(--color-surface-1-ch)) 0%, rgb(var(--color-surface-2-ch)) 100%)",
      },
      boxShadow: {
        card:        "var(--shadow-sm)",
        "card-hover":"var(--shadow-md)",
        glass:       "var(--shadow-lg)",
        "glass-gold":"0 0 0 1px rgb(var(--color-gold-500-ch) / 0.25), var(--shadow-md)",
        "red-glow":  "var(--shadow-glow)",
      },
      keyframes: {
        rise: {
          "0%":   { opacity:"0", transform:"translateY(28px)" },
          "100%": { opacity:"1", transform:"translateY(0)" },
        },
        sheen: {
          "0%":   { transform:"translateX(-120%)" },
          "100%": { transform:"translateX(120%)" },
        },
        floatSlow: {
          "0%,100%": { transform:"translateY(0)" },
          "50%":     { transform:"translateY(-14px)" },
        },
        marquee: {
          "0%":   { transform:"translateX(0%)" },
          "100%": { transform:"translateX(-50%)" },
        },
        fadeUp: {
          "0%":   { opacity:"0", transform:"translateY(32px)" },
          "100%": { opacity:"1", transform:"translateY(0)" },
        },
        pulseRed: {
          "0%,100%": { boxShadow:"0 0 0 0 rgba(158,34,38,0)" },
          "50%":     { boxShadow:"0 0 0 10px rgba(158,34,38,0.12)" },
        },
        scaleIn: {
          "0%":   { opacity:"0", transform:"scale(0.92)" },
          "100%": { opacity:"1", transform:"scale(1)" },
        },
        borderSlide: {
          "0%":   { transform:"scaleX(0)", transformOrigin:"right" },
          "100%": { transform:"scaleX(1)", transformOrigin:"right" },
        },
        spinSlow: {
          "0%":   { transform:"rotate(0deg)" },
          "100%": { transform:"rotate(360deg)" },
        },
      },
      animation: {
        rise:       "rise 0.9s cubic-bezier(0.16,1,0.3,1) both",
        sheen:      "sheen 1.2s ease forwards",
        floatSlow:  "floatSlow 7s ease-in-out infinite",
        marquee:    "marquee 32s linear infinite",
        fadeUp:     "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both",
        pulseRed:   "pulseRed 2.5s ease-in-out infinite",
        scaleIn:    "scaleIn 0.6s cubic-bezier(0.16,1,0.3,1) both",
        spinSlow:   "spinSlow 12s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
