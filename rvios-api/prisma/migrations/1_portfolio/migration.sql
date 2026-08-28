-- ═══════════════════════════════════════════════════════════════
-- 1_portfolio — توسيع نموذج Project إلى معرض أعمال كامل
--
-- مكتوبة يدوياً لا مولَّدة: `migrate diff` ينتج ثلاث عمليات تُفقد
-- بيانات الإنتاج —
--   1. DROP COLUMN "imageUrl" / "url"   ← تحذف صور المشاريع وروابطها
--   2. ADD COLUMN "slug" TEXT NOT NULL  ← يفشل على صفوف قائمة
--   3. ADD COLUMN "summary" TEXT NOT NULL ← يفشل كذلك
--
-- البديل هنا: إعادة تسمية بدل الحذف، وإضافة nullable ثم تعبئة ثم
-- فرض القيد. الترتيب إلزامي.
-- ═══════════════════════════════════════════════════════════════

-- ── 1) الأنواع الجديدة ─────────────────────────────────────────
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "MetricDirection" AS ENUM ('UP', 'DOWN', 'NEUTRAL');

-- ── 2) حفظ البيانات القائمة: إعادة تسمية لا حذف ────────────────
-- imageUrl و url يحملان صور المشاريع المنشورة وروابطها الحيّة.
ALTER TABLE "projects" RENAME COLUMN "imageUrl" TO "coverImageUrl";
ALTER TABLE "projects" RENAME COLUMN "url"      TO "liveUrl";

-- ── 3) الأعمدة الجديدة — slug و summary nullable مؤقتاً ────────
ALTER TABLE "projects"
  ADD COLUMN "slug"                 TEXT,
  ADD COLUMN "summary"              TEXT,
  ADD COLUMN "titleEn"              TEXT,
  ADD COLUMN "challenge"            TEXT,
  ADD COLUMN "solution"             TEXT,
  ADD COLUMN "outcome"              TEXT,
  ADD COLUMN "approach"             JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN "client"               TEXT,
  ADD COLUMN "clientLogoUrl"        TEXT,
  ADD COLUMN "industry"             TEXT,
  ADD COLUMN "year"                 INTEGER,
  ADD COLUMN "durationMonths"       INTEGER,
  ADD COLUMN "role"                 TEXT,
  ADD COLUMN "teamSize"             INTEGER,
  ADD COLUMN "categoryId"           TEXT,
  ADD COLUMN "coverImageAlt"        TEXT,
  ADD COLUMN "coverBlurHash"        TEXT,
  ADD COLUMN "testimonialQuote"     TEXT,
  ADD COLUMN "testimonialAuthor"    TEXT,
  ADD COLUMN "testimonialRole"      TEXT,
  ADD COLUMN "testimonialAvatarUrl" TEXT,
  ADD COLUMN "repoUrl"              TEXT,
  ADD COLUMN "status"               "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedAt"          TIMESTAMP(3),
  ADD COLUMN "views"                INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "metaTitle"            TEXT,
  ADD COLUMN "metaDescription"      TEXT,
  ADD COLUMN "ogImageUrl"           TEXT;

-- ── 4) تعبئة الصفوف القائمة قبل فرض NOT NULL ──────────────────
-- summary: أول 200 محرف من الوصف — يحترم الحدّ في CreateProjectDto.
UPDATE "projects"
   SET "summary" = left("description", 200)
 WHERE "summary" IS NULL;

-- slug: مشتق من المعرّف لا من العنوان.
-- تحويل العنوان العربي إلى slug داخل SQL يحتاج تطبيعاً ومعالجة تصادم؛
-- الاشتقاق من cuid مضمون التفرّد، ويُحرَّر لاحقاً من لوحة التحكم.
UPDATE "projects"
   SET "slug" = 'project-' || substring("id" from 1 for 12)
 WHERE "slug" IS NULL;

-- المشاريع القائمة كانت مرئية قبل هذه الهجرة، فتبقى منشورة.
-- تركها DRAFT كان سيُخفيها فجأة عن الموقع.
UPDATE "projects"
   SET "status"      = 'PUBLISHED',
       "publishedAt" = COALESCE("publishedAt", "createdAt")
 WHERE "status" = 'DRAFT';

-- ── 5) الآن فقط: فرض القيود ────────────────────────────────────
ALTER TABLE "projects" ALTER COLUMN "slug"    SET NOT NULL;
ALTER TABLE "projects" ALTER COLUMN "summary" SET NOT NULL;

-- ── 6) الجداول والفهارس الجديدة ────────────────────────────────
CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "blurHash" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_metrics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "direction" "MetricDirection" NOT NULL DEFAULT 'UP',
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_services" (
    "projectId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "project_services_pkey" PRIMARY KEY ("projectId","serviceId")
);

-- CreateIndex
CREATE INDEX "project_images_projectId_order_idx" ON "project_images"("projectId", "order");

-- CreateIndex
CREATE INDEX "project_metrics_projectId_order_idx" ON "project_metrics"("projectId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "project_categories_slug_key" ON "project_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_status_featured_order_idx" ON "projects"("status", "featured", "order");

-- CreateIndex
CREATE INDEX "projects_status_publishedAt_idx" ON "projects"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "projects_categoryId_idx" ON "projects"("categoryId");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "project_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_metrics" ADD CONSTRAINT "project_metrics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_services" ADD CONSTRAINT "project_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
