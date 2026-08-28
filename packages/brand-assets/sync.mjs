#!/usr/bin/env node
/**
 * ينسخ خطوط الهوية و`tokens.css` إلى `public/` لكل تطبيق ويب.
 *
 * نسخ لا symlink: الروابط الرمزية تحتاج صلاحيات مرتفعة على ويندوز،
 * ولا تُتبَع بشكل موثوق في بناء Vercel.
 *
 * يُستدعى من سكربت `predev`/`prebuild` في كل تطبيق، فلا يمكن أن
 * ينسى أحد تشغيله.
 */

import { cpSync, mkdirSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');

const APPS = ['rvios-site', 'rvios-dashboard', 'rvios-owner'];
const fontsSrc = join(here, 'fonts');
const tokensCss = join(repoRoot, 'packages', 'design-tokens', 'dist', 'tokens.css');

if (!existsSync(tokensCss)) {
  console.error(
    '✗ dist/tokens.css غير موجود.\n' +
      '  شغّل أولاً: pnpm --filter @rvios/design-tokens build',
  );
  process.exit(1);
}

let copied = 0;

for (const app of APPS) {
  const appDir = join(repoRoot, app);
  if (!existsSync(appDir)) {
    console.warn(`  ⚠ تخطّي ${app} — غير موجود`);
    continue;
  }

  const publicDir = join(appDir, 'public');
  const fontsDest = join(publicDir, 'fonts');
  /* مزامنة لا نسخ: بدون الحذف أولاً يبقى أي خط أُزيل من المصدر منشوراً
     في public/ إلى الأبد — وهو ما حدث فعلاً مع PanoramaNaskh. */
  rmSync(fontsDest, { recursive: true, force: true });
  mkdirSync(fontsDest, { recursive: true });
  cpSync(fontsSrc, fontsDest, { recursive: true });

  /* tokens.css يجلس بجوار fonts/ لأن @font-face بداخله
     يشير إلى "../fonts/..." نسبةً إلى موقعه. */
  const stylesDest = join(publicDir, 'styles');
  mkdirSync(stylesDest, { recursive: true });
  cpSync(tokensCss, join(stylesDest, 'tokens.css'));

  const n = readdirSync(fontsDest).filter((f) =>
    statSync(join(fontsDest, f)).isFile(),
  ).length;
  console.log(`  ✔ ${app}/public — ${n} خطاً + styles/tokens.css`);
  copied++;
}

console.log(`\n✔ زُوِّد ${copied} تطبيقاً من مصدر واحد`);
