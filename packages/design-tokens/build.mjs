#!/usr/bin/env node
/**
 * مولّد التوكنز — بلا تبعيات.
 *
 * مصدر واحد (tokens/*.json) → أربعة أهداف:
 *   dist/tokens.css   CSS variables + تجاوزات الوضع الداكن + @font-face
 *   dist/preset.cjs   Tailwind preset (site, owner, dashboard)
 *   dist/tokens.ts    كائن TypeScript مُنمَّط
 *   dist/tokens.dart  ثوابت Dart لتطبيق Flutter
 *
 * فُضّل هذا على style-dictionary: مجموعة التوكنز صغيرة ومحكومة،
 * والصياغة هنا مقروءة بالكامل في ملف واحد بلا سلسلة تبعيات.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(readFileSync(join(here, 'tokens', f), 'utf8'));

const color = read('color.json');
const scale = read('scale.json');
const effect = read('effect.json');
const font = read('font.json');

/* ── حلّ المراجع {base.primary.500} ───────────────────────── */

const lookup = (path, root) =>
  path.split('.').reduce((acc, k) => (acc == null ? acc : acc[k]), root);

function resolve(value, root, seen = 0) {
  if (typeof value !== 'string') return value;
  const m = /^\{([^}]+)\}$/.exec(value.trim());
  if (!m) return value;
  if (seen > 10) throw new Error(`Circular token reference: ${value}`);
  const next = lookup(m[1], root);
  if (next === undefined) throw new Error(`Unknown token reference: ${value}`);
  return resolve(next, root, seen + 1);
}

/** يسطّح كائناً متداخلاً إلى [["primary-500", "#9E2226"], ...] متجاهلاً مفاتيح $ */
function flatten(obj, root, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    const name = prefix ? `${prefix}-${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...flatten(v, root, name));
    } else {
      out.push([name, resolve(v, root)]);
    }
  }
  return out;
}

const hexToChannels = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const isHex = (v) => typeof v === 'string' && /^#[0-9A-Fa-f]{3,8}$/.test(v);

/* ── تجميع ────────────────────────────────────────────────── */

const colorsLight = flatten(color.semantic, color);
const colorsDark = flatten(color.dark, color);
const spaces = flatten(scale.space, scale);
const radii = flatten(scale.radius, scale);
const leadings = flatten(scale.leading, scale);
const shadows = flatten(effect.shadow, effect);
const shadowsDark = flatten(effect.shadowDark, effect);
const motions = flatten(effect.motion, effect);
const eases = flatten(effect.ease, effect);
const zs = flatten(effect.z, effect);
const families = flatten(font.family, font);

const textSizes = Object.entries(scale.text)
  .filter(([k]) => !k.startsWith('$'))
  .map(([k, v]) => [k, v.size, v.leading]);

/* ── الهدف 1: CSS ─────────────────────────────────────────── */

function buildFontFaces() {
  const lines = [];
  for (const [family, faces] of Object.entries(font.face)) {
    if (family.startsWith('$')) continue;
    for (const f of faces) {
      lines.push(
        `@font-face {`,
        `  font-family: "${family}";`,
        `  src: url("../fonts/${encodeURI(f.file)}") format("${f.format}");`,
        `  font-weight: ${f.weight};`,
        `  font-display: swap;`,
        `}`,
        ``,
      );
    }
  }
  return lines.join('\n');
}

function buildCss() {
  const decl = (pairs, prefix) =>
    pairs
      .flatMap(([k, v]) => {
        const line = `  --${prefix}-${k}: ${v};`;
        /* قناة RGB إضافية: Tailwind يحتاجها لتعمل مُعدِّلات الشفافية (bg-primary/50) */
        return isHex(v) ? [line, `  --${prefix}-${k}-ch: ${hexToChannels(v)};`] : [line];
      })
      .join('\n');

  return `/* مولَّد من packages/design-tokens — لا تُحرّره يدوياً. */
/* شغّل: pnpm --filter @rvios/design-tokens build */

${buildFontFaces()}
:root {
  /* ── الألوان ── */
${decl(colorsLight, 'color')}

  /* ── المسافات ── */
${decl(spaces, 'space')}

  /* ── الحواف ── */
${decl(radii, 'radius')}

  /* ── النصوص ── */
${textSizes.map(([k, size, lead]) => `  --text-${k}: ${size};\n  --text-${k}-leading: ${lead};`).join('\n')}
${decl(leadings, 'leading')}

  /* ── الخطوط ── */
${decl(families, 'font')}

  /* ── الظلال ── */
${decl(shadows, 'shadow')}

  /* ── الحركة ── */
${decl(motions, 'motion')}
${decl(eases, 'ease')}

  /* ── الطبقات ── */
${decl(zs, 'z')}
}

/* الوضع الداكن: عبر سمة صريحة أو تفضيل النظام.
   السمة الصريحة تفوز دائماً حتى يعمل مبدّل المستخدم في الاتجاهين. */
:root[data-theme="dark"] {
${decl(colorsDark, 'color')}
${decl(shadowsDark, 'shadow')}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${decl(colorsDark, 'color')
  .split('\n')
  .map((l) => '  ' + l)
  .join('\n')}
${decl(shadowsDark, 'shadow')
  .split('\n')
  .map((l) => '  ' + l)
  .join('\n')}
  }
}
`;
}

/* ── الهدف 2: Tailwind preset ─────────────────────────────── */

/**
 * أسماء Tailwind للتوكنز الدلالية.
 *
 * بدون هذا يصير `text.primary` هو الكلاس `text-text-primary`، لأن Tailwind
 * يسبق اسم المجموعة ببادئة الخاصية. نعيد تسمية المجموعة إلى `fg` ونرفع
 * القيمة الأشيع إلى DEFAULT: `text-fg` و`text-fg-muted`.
 */
const PRESET_ALIASES = {
  'text-primary': ['fg', 'DEFAULT'],
  'text-secondary': ['fg', 'muted'],
  'text-inverse': ['fg', 'inverse'],
  'text-on-primary': ['fg', 'onPrimary'],
};

/**
 * الدرجة التي تصير `DEFAULT` في كل سلّم.
 *
 * بدونها لا يوجد كلاس `bg-primary` — فقط `bg-primary-500`. وهذا يكسر كل
 * استعمال مختصر قائم (١٢٨ موضعاً في rvios-site وحده) ويجبر كل كود جديد
 * على كتابة الدرجة صراحةً حتى حين لا يهمّ أيها.
 */
const SCALE_DEFAULTS = {
  primary: '500',
  gold: '500',
  ink: '900',
  surface: '0',
  border: 'default',
};

function buildPreset() {
  const hexKeys = new Set(colorsLight.filter(([, v]) => isHex(v)).map(([k]) => k));
  const ref = (k) =>
    hexKeys.has(k)
      ? `rgb(var(--color-${k}-ch) / <alpha-value>)`
      : `var(--color-${k})`;

  /* المفاتيح المسطّحة تعود إلى شكل متداخل: primary-500 → colors.primary['500'] */
  const nest = (pairs) => {
    const tree = {};
    for (const [k] of pairs) {
      const alias = PRESET_ALIASES[k];
      let head, leaf;
      if (alias) {
        [head, leaf] = alias;
      } else {
        const parts = k.split('-');
        leaf = parts.length > 1 ? parts.pop() : 'DEFAULT';
        head = parts.join('-') || k;
      }
      tree[head] ??= {};
      tree[head][leaf] = ref(k);
    }

    /* ارفع الدرجة المختارة إلى DEFAULT ليعمل `bg-primary` بلا رقم */
    for (const [group, grade] of Object.entries(SCALE_DEFAULTS)) {
      if (tree[group]?.[grade] && !tree[group].DEFAULT) {
        tree[group].DEFAULT = tree[group][grade];
      }
    }
    return tree;
  };

  const colors = nest(colorsLight);

  const spacing = Object.fromEntries(spaces.map(([k]) => [k, `var(--space-${k})`]));
  const borderRadius = Object.fromEntries(radii.map(([k]) => [k, `var(--radius-${k})`]));
  const boxShadow = Object.fromEntries(shadows.map(([k]) => [k, `var(--shadow-${k})`]));
  const fontFamily = Object.fromEntries(
    families.map(([k]) => [k, [`var(--font-${k})`]]),
  );
  const fontSize = Object.fromEntries(
    textSizes.map(([k]) => [k, [`var(--text-${k})`, { lineHeight: `var(--text-${k}-leading)` }]]),
  );
  const lineHeight = Object.fromEntries(leadings.map(([k]) => [k, `var(--leading-${k})`]));
  const transitionDuration = Object.fromEntries(motions.map(([k]) => [k, `var(--motion-${k})`]));
  const transitionTimingFunction = Object.fromEntries(eases.map(([k]) => [k, `var(--ease-${k})`]));
  const zIndex = Object.fromEntries(zs.map(([k]) => [k, `var(--z-${k})`]));

  return `/* مولَّد من packages/design-tokens — لا تُحرّره يدوياً. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', ':root[data-theme="dark"] &'],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6).replace(/\n/g, '\n      ')},
      spacing: ${JSON.stringify(spacing, null, 6).replace(/\n/g, '\n      ')},
      borderRadius: ${JSON.stringify(borderRadius, null, 6).replace(/\n/g, '\n      ')},
      boxShadow: ${JSON.stringify(boxShadow, null, 6).replace(/\n/g, '\n      ')},
      fontFamily: ${JSON.stringify(fontFamily, null, 6).replace(/\n/g, '\n      ')},
      fontSize: ${JSON.stringify(fontSize, null, 6).replace(/\n/g, '\n      ')},
      lineHeight: ${JSON.stringify(lineHeight, null, 6).replace(/\n/g, '\n      ')},
      transitionDuration: ${JSON.stringify(transitionDuration, null, 6).replace(/\n/g, '\n      ')},
      transitionTimingFunction: ${JSON.stringify(transitionTimingFunction, null, 6).replace(/\n/g, '\n      ')},
      zIndex: ${JSON.stringify(zIndex, null, 6).replace(/\n/g, '\n      ')},
    },
  },
};
`;
}

/* ── الهدف 3: TypeScript ──────────────────────────────────── */

function buildTs() {
  const obj = (pairs) =>
    `{\n${pairs.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')}\n} as const`;

  return `// مولَّد من packages/design-tokens — لا تُحرّره يدوياً.

export const color = ${obj(colorsLight)};
export const colorDark = ${obj(colorsDark)};
export const space = ${obj(spaces)};
export const radius = ${obj(radii)};
export const shadow = ${obj(shadows)};
export const motion = ${obj(motions)};
export const ease = ${obj(eases)};
export const zIndex = ${obj(zs)};
export const fontFamily = ${obj(families)};
export const fontSize = ${obj(textSizes.map(([k, v]) => [k, v]))};

export type ColorToken = keyof typeof color;
export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;

/** مرجع CSS variable لتوكن لون — يحترم الوضع الداكن تلقائياً. */
export const cssColor = (t: ColorToken) => \`var(--color-\${t})\`;
`;
}

/* ── الهدف 4: Dart (تطبيق Flutter) ────────────────────────── */

function buildDart() {
  const dartName = (k) =>
    k.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase()).replace(/^(\d)/, 'v$1');

  const colorConst = (pairs) =>
    pairs
      .filter(([, v]) => isHex(v))
      .map(([k, v]) => {
        const h = v.replace('#', '');
        const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
        return `  static const Color ${dartName(k)} = Color(0xFF${full.toUpperCase()});`;
      })
      .join('\n');

  const px = (v) => parseFloat(String(v).replace('px', ''));

  return `// مولَّد من packages/design-tokens — لا تُحرّره يدوياً.
// شغّل: pnpm --filter @rvios/design-tokens build
//
// هذا الملف يجعل ألوان التطبيق ومساحاته مطابقة للموقع حرفياً،
// من مصدر واحد. لا تعرّف Color(0xFF...) في lib/ بعد الآن.

import 'package:flutter/material.dart';

abstract final class RviosColors {
${colorConst(colorsLight)}
}

abstract final class RviosColorsDark {
${colorConst(colorsDark)}
}

abstract final class RviosSpacing {
${spaces.map(([k, v]) => `  static const double s${k} = ${px(v)};`).join('\n')}
}

abstract final class RviosRadius {
${radii.map(([k, v]) => `  static const double ${dartName(k)} = ${px(v)};`).join('\n')}
}

abstract final class RviosTextSize {
${textSizes.map(([k, size]) => `  static const double ${dartName(k)} = ${px(size)};`).join('\n')}
}

abstract final class RviosLineHeight {
${textSizes.map(([k, , lead]) => `  static const double ${dartName(k)} = ${lead};`).join('\n')}
}

abstract final class RviosMotion {
${motions.map(([k, v]) => `  static const Duration ${dartName(k)} = Duration(milliseconds: ${parseInt(v, 10)});`).join('\n')}
}
`;
}

/* ── الكتابة ──────────────────────────────────────────────── */

const dist = join(here, 'dist');
mkdirSync(dist, { recursive: true });

const targets = [
  ['tokens.css', buildCss()],
  ['preset.cjs', buildPreset()],
  ['tokens.ts', buildTs()],
  ['tokens.dart', buildDart()],
];

for (const [name, content] of targets) {
  writeFileSync(join(dist, name), content, 'utf8');
  console.log(`  ✔ dist/${name}  (${content.split('\n').length} سطراً)`);
}

console.log(
  `\n✔ ${colorsLight.length} لوناً · ${spaces.length} مسافة · ${radii.length} حافة · ` +
    `${textSizes.length} حجم نص · ${shadows.length} ظلاً`,
);
