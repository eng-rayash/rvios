import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TenantMiddleware } from './common/tenant/tenant.middleware';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { ProjectsModule } from './projects/projects.module';
import { MediaModule } from './media/media.module';
import { ContactsModule } from './contacts/contacts.module';
import { SettingsModule } from './settings/settings.module';
import { OwnerModule } from './owner/owner.module';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // ── Config ───────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // ── Rate Limiting ─────────────────────────────────────────
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    // ── Core ─────────────────────────────────────────────────
    PrismaModule,

    // ── Feature Modules ───────────────────────────────────────
    HealthModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
    ServicesModule,
    ProjectsModule,
    MediaModule,
    ContactsModule,
    SettingsModule,
    OwnerModule,
  ],
  providers: [
    // Registering ThrottlerGuard globally — without this the ThrottlerModule
    // config above has no effect at all.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // يفتح سياق المستأجر لكل طلب. خامل اليوم — لا نموذج يحمل companyId
    // بعد — وجاهز للحظة إضافة وحدات التطبيق.
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
