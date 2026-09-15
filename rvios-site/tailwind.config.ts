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

           تُحذف عند هجرة آخر صفحة إلى السلّم الكامل.
           ══════════════════════════════════════════════════════ */
        /* الصيغة rgb(var(--…-ch) / <alpha-value>) لا var(--color-…): الثانية قيمة hex جاهزة لا يقبل Tailwind حقن الشفافية فيها، فكان كل bg-ink/60 وtext-ivory/65 يسقط بصمت. والأسماء المفردة كائنات لا نصوصاً كي تندمج مع سلالم الـpreset بدل أن تمحوها — كان ink-900 مفقوداً لهذا. */
        surface:        { DEFAULT: "rgb(var(--color-surface-0-ch) / <alpha-value>)" },
        "surface-alt":  "rgb(var(--color-surface-1-ch) / <alpha-value>)",
        card:           "rgb(var(--color-surface-3-ch) / <alpha-value>)",
        ink:            { DEFAULT: "rgb(var(--color-ink-900-ch) / <alpha-value>)" },
        "ink-muted":    "rgb(var(--color-ink-500-ch) / <alpha-value>)",
        "ink-faint":    "rgb(var(--color-ink-300-ch) / <alpha-value>)",
        ivory:          { DEFAULT: "rgb(var(--color-text-inverse-ch) / <alpha-value>)" },
        "ivory-soft":   "rgb(var(--color-surface-0-ch) / <alpha-value>)",
        graphite:       "rgb(var(--color-ink-900-ch) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-700-ch) / <alpha-value>)",
        "primary-light":"rgb(var(--color-primary-300-ch) / <alpha-value>)",
        "gold-soft":    "rgb(var(--color-gold-100-ch) / <alpha-value>)",
      },
      /* خطوات الشفافية عند Tailwind من ٥ إلى ٥، وهذه القيم مستعملة في الصفحات
         (bg-primary/8، bg-ivory/8، border-black/6 …) فكانت تسقط بلا أثر. */
      opacity: { 4: "0.04", 6: "0.06", 7: "0.07", 8: "0.08", 12: "0.12" },
      fontFamily: {
        display: ["var(--font-yapari)", "var(--font-maghfira)", "sans-serif"],
        body:    ["var(--font-panorama)", "var(--font-givonic)", "sans-serif"],
        /* العناوين العربية الصغيرة. font-display يبدأ بـ Yapari وهو لاتيني
           بلا محارف عربية، فكانت تسقط إلى Maghfira (خط رمضاني زخرفي). */
        subhead: ["var(--font-thmanyah)", "var(--font-panorama)", "serif"],
      },
      backgroundImage: {
        "gold-line":       "linear-gradient(90deg, transparent, #C8A45D, transparent)",
        "rvios-radial":    "radial-gradient(120% 120% at 15% 10%, rgba(158,34,38,0.12) 0%, rgba(250,250,247,0) 55%)",
        "hero-vignette":   "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.75) 100%)",
        "primary-gradient":"linear-gradient(135deg, #9E2226 0%, #6E1518 100%)",
        "card-shine":      "linear-gradient(135deg, rgba(255,255,255,0) 40%, rgba(255,239,223,0.45) 100%)",
        "section-dark":    "linear-gradient(135deg, #1A1210 0%, #2C1C1A 100%)",
      },
      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)",
        "card-hover":"0 8px 24px rgba(158,34,38,0.14), 0 20px 48px rgba(158,34,38,0.10)",
        glass:      "0 8px 32px rgba(0,0,0,0.35)",
        "glass-gold":"0 0 0 1px rgba(200,164,93,0.25), 0 8px 32px rgba(0,0,0,0.35)",
        "red-glow": "0 0 40px rgba(158,34,38,0.35)",
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
