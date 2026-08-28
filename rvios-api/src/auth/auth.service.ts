import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * بصمة التوكن المخزَّنة.
   *
   * SHA-256 لا bcrypt: القيمة توكن عشوائي موقَّع لا كلمة مرور، فلا تُخمَّن
   * بالقاموس ولا فائدة من بطء bcrypt. والأهم أن bcrypt يستعمل ملحاً عشوائياً
   * فلا يُنتج القيمة نفسها مرتين — وهو ما جعل البحث عن التوكن مستحيلاً
   * وأعطب `/auth/refresh` و`/auth/logout` بالكامل.
   */
  private fingerprint(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  // ── Login ─────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    /* نقارن دائماً حتى لو لم يوجد المستخدم: المقارنة تستغرق وقتاً ملموساً،
       وتخطّيها يجعل زمن الرد يفشي أي البُرد مسجَّل. */
    const valid = user
      ? await bcrypt.compare(dto.password, user.password)
      : await bcrypt.compare(dto.password, '$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid');

    if (!user || !valid) {
      throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  // ── Refresh ───────────────────────────────────────────────
  async refresh(refreshToken: string) {
    const fp = this.fingerprint(refreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: fp },
      include: { user: true },
    });

    if (!stored) {
      /* التوكن غير موجود. إن كان توقيعه سليماً فهو توكن سبق تدويره وأُعيد
         استعماله — أي أنه مسروق أو مُسرَّب. عندها نُبطل عائلة الجلسة كلها
         لا هذا التوكن وحده. */
      await this.revokeFamilyOfReusedToken(refreshToken);
      throw new UnauthorizedException('انتهت الجلسة — يرجى تسجيل الدخول من جديد');
    }

    if (stored.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedException('انتهت صلاحية الجلسة');
    }

    /* التدوير والإصدار في معاملة واحدة: سقوط بين الحذف والإنشاء كان
       سيفقد الجلسة بلا سبب. */
    const { user } = stored;
    return this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.delete({ where: { id: stored.id } });
      return this.issueTokens(user.id, user.email, user.role, stored.familyId, tx);
    });
  }

  /** يُبطل كل جلسات العائلة عند اكتشاف إعادة استعمال توكن مُدوَّر. */
  private async revokeFamilyOfReusedToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sub: string; fid?: string }>(refreshToken, {
        secret: this.config.get('jwt.refreshSecret'),
      });
      if (!payload?.fid) return;

      const { count } = await this.prisma.refreshToken.deleteMany({
        where: { familyId: payload.fid },
      });
      if (count > 0) {
        this.logger.warn(
          `Refresh token reuse detected for user ${payload.sub} — revoked ${count} session(s)`,
        );
      }
    } catch {
      /* توقيع غير صالح: توكن ملفّق أو منتهٍ. لا عائلة تُبطَل. */
    }
  }

  // ── Logout ────────────────────────────────────────────────
  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: this.fingerprint(refreshToken) },
    });
    return { message: 'تم تسجيل الخروج بنجاح' };
  }

  /** إنهاء كل جلسات المستخدم — يُستدعى عند تغيير كلمة المرور. */
  async logoutAll(userId: string) {
    const { count } = await this.prisma.refreshToken.deleteMany({ where: { userId } });
    return { message: `تم إنهاء ${count} جلسة` };
  }

  // ── Me ────────────────────────────────────────────────────
  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    });
  }

  // ── Helpers ───────────────────────────────────────────────
  private generateTokens(userId: string, email: string, role: string) {
    /* جلسة جديدة ⇒ عائلة جديدة. كل تدوير لاحق يبقى داخلها. */
    return this.issueTokens(userId, email, role, randomUUID(), this.prisma);
  }

  private async issueTokens(
    userId: string,
    email: string,
    role: string,
    familyId: string,
    tx: Pick<PrismaService, 'refreshToken'>,
  ) {
    const accessToken = this.jwt.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get('jwt.secret'),
        expiresIn: this.config.get('jwt.expiresIn'),
      },
    );

    const refreshExpiresIn = this.config.get<string>('jwt.refreshExpiresIn') ?? '7d';
    const refreshToken = this.jwt.sign(
      { sub: userId, email, role, fid: familyId },
      { secret: this.config.get('jwt.refreshSecret'), expiresIn: refreshExpiresIn },
    );

    await tx.refreshToken.create({
      data: {
        token: this.fingerprint(refreshToken),
        userId,
        familyId,
        /* مشتقّ من انتهاء الـ JWT نفسه لا من رقم ثابت: تعارضهما كان يعني
           رفض صفٍّ ما زال توكنه صالحاً، أو العكس. */
        expiresAt: this.jwtExpiryDate(refreshToken),
      },
    });

    return { accessToken, refreshToken };
  }

  private jwtExpiryDate(token: string): Date {
    const decoded = this.jwt.decode(token) as { exp?: number } | null;
    return decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
}
