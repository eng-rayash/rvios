/**
 * استبدال مضيف الوسائط في الروابط المخزَّنة.
 *
 * الروابط تُحفظ كاملة في قاعدة البيانات وقت الرفع، لا تُركَّب عند العرض.
 * فحين يتغيّر `CF_PUBLIC_URL` — أو حين يكون خاطئاً من البداية كما حدث مع
 * hash الـ r2.dev — لا يُصلح المتغيّرُ ما كُتب قبله: الملفات في الدلو
 * سليمة، والصفوف تشير إلى مضيف يردّ 401.
 *
 *   pnpm --filter rvios-api exec ts-node scripts/fix-media-host.ts <old-host>
 *   pnpm --filter rvios-api exec ts-node scripts/fix-media-host.ts <old-host> --apply
 *
 * بلا `--apply` يعرض ما سيتغيّر ولا يكتب شيئاً.
 * المضيف الجديد يُقرأ من `CF_PUBLIC_URL`.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

function loadEnv() {
  try {
    const raw = readFileSync(join(__dirname, '..', '.env'), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
      if (!m) continue;
      const [, key, value] = m;
      if (process.env[key] === undefined) {
        process.env[key] = value.trim().replace(/^["']|["']$/g, '');
      }
    }
  } catch {
    /* لا ملف — نعتمد على متغيّرات البيئة كما هي */
  }
}
loadEnv();

const oldHost = process.argv[2]?.replace(/\/+$/, '');
const newHost = process.env.CF_PUBLIC_URL?.replace(/\/+$/, '');
const apply = process.argv.includes('--apply');

if (!oldHost || oldHost.startsWith('--')) {
  console.error('الاستعمال: ts-node scripts/fix-media-host.ts <old-host> [--apply]');
  process.exit(1);
}
if (!newHost) {
  console.error('غاب CF_PUBLIC_URL من .env — لا مضيف جديد نكتبه.');
  process.exit(1);
}
if (oldHost === newHost) {
  console.error('المضيف القديم هو الجديد نفسه — لا شيء لتغييره.');
  process.exit(1);
}

const prisma = new PrismaClient();

/** كل عمود يحمل رابطاً قد يشير إلى الدلو. */
const TARGETS = [
  { model: 'media', column: 'url' },
  { model: 'projectImage', column: 'url' },
  { model: 'project', column: 'coverImageUrl' },
  { model: 'project', column: 'ogImageUrl' },
  { model: 'project', column: 'clientLogoUrl' },
  { model: 'project', column: 'testimonialAvatarUrl' },
  { model: 'post', column: 'heroImageUrl' },
  { model: 'ownerProfile', column: 'avatarUrl' },
  { model: 'ownerProfile', column: 'resumeUrl' },
] as const;

async function main() {
  console.log(`من: ${oldHost}`);
  console.log(`إلى: ${newHost}`);
  console.log(apply ? '\n— الكتابة —\n' : '\n— عرض فقط، بلا كتابة —\n');

  let total = 0;

  for (const { model, column } of TARGETS) {
    const delegate = (prisma as any)[model];
    const rows = await delegate.findMany({
      where: { [column]: { startsWith: oldHost } },
      select: { id: true, [column]: true },
    });
    if (!rows.length) continue;

    total += rows.length;
    console.log(`${model}.${column} — ${rows.length} صفّاً`);

    for (const row of rows) {
      const next = (row[column] as string).replace(oldHost, newHost);
      console.log(`  ${row.id}`);
      console.log(`    ${row[column]}`);
      console.log(`    ${next}`);
      if (apply) {
        await delegate.update({ where: { id: row.id }, data: { [column]: next } });
      }
    }
  }

  console.log(
    total === 0
      ? 'لا صفّ يشير إلى المضيف القديم.'
      : `\n${total} صفّاً ${apply ? 'حُدّثت' : 'ستُحدَّث — أعد التشغيل مع --apply'}.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
