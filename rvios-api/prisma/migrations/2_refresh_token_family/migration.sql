-- ═══════════════════════════════════════════════════════════════
-- 2_refresh_token_family — تدوير التوكنات مع كشف إعادة الاستعمال
--
-- الجلسات القائمة لا تحمل familyId، ولا يمكن اشتقاقه لها. وهي عاطلة
-- أصلاً: كانت البصمة تُخزَّن بـ bcrypt (ملح عشوائي) فلا تُطابَق أبداً،
-- أي أن /auth/refresh كان يفشل دائماً. فحذفها لا يفقد جلسة عاملة.
-- ═══════════════════════════════════════════════════════════════

DELETE FROM "refresh_tokens";

ALTER TABLE "refresh_tokens" ADD COLUMN "familyId" TEXT NOT NULL;

CREATE INDEX "refresh_tokens_userId_idx"   ON "refresh_tokens"("userId");
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");
