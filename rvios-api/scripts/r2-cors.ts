/**
 * ضبط قواعد CORS على دلو R2 — والتحقّق منها.
 *
 * الرفع من اللوحة يذهب من المتصفح إلى R2 مباشرة، فالدلو نفسه هو من يردّ
 * على الـ preflight. بلا قواعد يرفضه بـ 403، والمتصفح يبلّغ الصفحة
 * بـ `status 0` بلا سبب — عطلٌ يبدو في الكود وليس فيه.
 *
 *   pnpm --filter rvios-api exec ts-node scripts/r2-cors.ts          # عرض الحالي
 *   pnpm --filter rvios-api exec ts-node scripts/r2-cors.ts --apply  # كتابة القواعد
 *
 * النطاقات تُقرأ من `CORS_ORIGINS` في `.env` — نفس مصدر قائمة الـ API،
 * فلا يفترقان.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  S3Client,
  GetBucketCorsCommand,
  PutBucketCorsCommand,
} from '@aws-sdk/client-s3';

/* قراءة `.env` بلا حزمة: `dotenv` ليست من تبعيات المشروع، وإضافتها لأجل
   سكربت يُشغَّل مرّتين في العمر مبالغة. */
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

const accountId = process.env.CF_ACCOUNT_ID;
const bucket = process.env.CF_BUCKET_NAME ?? 'rvios-media';

if (!accountId || !process.env.CF_ACCESS_KEY_ID || !process.env.CF_SECRET_ACCESS_KEY) {
  console.error('غابت متغيّرات R2 من .env — CF_ACCOUNT_ID و CF_ACCESS_KEY_ID و CF_SECRET_ACCESS_KEY');
  process.exit(1);
}

const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3002')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CF_ACCESS_KEY_ID,
    secretAccessKey: process.env.CF_SECRET_ACCESS_KEY,
  },
});

async function show() {
  try {
    const res = await s3.send(new GetBucketCorsCommand({ Bucket: bucket }));
    console.log(JSON.stringify(res.CORSRules, null, 2));
  } catch (e: any) {
    if (e?.name === 'NoSuchCORSConfiguration') {
      console.log(`لا قواعد CORS على «${bucket}» — الرفع من المتصفح سيفشل.`);
      console.log('شغّل نفس الأمر مع --apply لكتابتها.');
      return;
    }
    throw e;
  }
}

async function apply() {
  /* الكتابة تستبدل القواعد كلها لا تضيف إليها: تشغيل السكربت من جهاز
     `.env`ه محلّي وحده يمسح نطاقات الإنتاج ويكسر الرفع من اللوحة
     المنشورة. تحذير قبل الفعل خير من تشخيصٍ بعده. */
  if (!origins.some((o) => o.startsWith('https://'))) {
    console.warn(
      'تحذير: لا نطاق إنتاج في CORS_ORIGINS — ستقتصر القواعد على localhost،\n' +
        'وسيفشل الرفع من اللوحة المنشورة. أضف نطاقات Vercel قبل المتابعة.\n',
    );
  }

  await s3.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: origins,
            /* PUT للرفع الموقّع، وGET/HEAD لقراءة الصورة من صفحة أخرى */
            AllowedMethods: ['PUT', 'GET', 'HEAD'],
            AllowedHeaders: ['content-type'],
            ExposeHeaders: ['etag'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );
  console.log(`كُتبت قواعد CORS على «${bucket}» للنطاقات:`);
  for (const o of origins) console.log(`  · ${o}`);
}

async function main() {
  if (process.argv.includes('--apply')) {
    await apply();
    console.log('\nالحالي بعد الكتابة:');
  }
  await show();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
