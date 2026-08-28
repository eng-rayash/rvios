import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // ── Security headers ───────────────────────────────────────
  app.use(helmet());

  // ── Prefix + versioning ────────────────────────────────────
  // كل المسارات تصير /api/v1/... — تطبيق Flutter سيولّد عميله من
  // هذا العقد، فأي كسر مستقبلي يذهب إلى v2 بدل كسر التطبيق المنشور.
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ── Validation ─────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Uniform error shape ────────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── Cookie Parser ──────────────────────────────────────────
  app.use(cookieParser());

  // ── CORS ───────────────────────────────────────────────────
  // Allow-list only. Anything not listed here (or in CORS_ORIGINS) is rejected.
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://rvios-dashboard.vercel.app',
    'https://rvios-site.vercel.app',
    'https://rvios-owner.vercel.app',
  ];
  const envOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

  app.enableCors({
    origin: (origin, callback) => {
      // No Origin header: server-to-server, curl, native apps — not a browser
      // cross-origin request, so there is no cookie to protect.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      logger.warn(`CORS rejected origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // x-company-id يحمل سياق المستأجر لطلبات التطبيق
    allowedHeaders: ['Content-Type', 'Authorization', 'x-company-id'],
  });

  // ── OpenAPI ────────────────────────────────────────────────
  // مصدر العقد لتطبيق Flutter: توثيق ~15 وحدة يدوياً غير واقعي.
  const openapi = new DocumentBuilder()
    .setTitle('RVIOS API')
    .setDescription('منصة RVIOS — واجهة الموقع ولوحة التحكم والتطبيق')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .addGlobalParameters({
      name: 'x-company-id',
      in: 'header',
      required: false,
      description: 'سياق المستأجر — مطلوب لوحدات التطبيق',
      schema: { type: 'string' },
    })
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, openapi),
    { jsonDocumentUrl: 'api/docs/openapi.json' },
  );

  // ── Start ──────────────────────────────────────────────────
  const port = process.env.PORT || process.env.API_PORT || 3001;
  await app.listen(port, '0.0.0.0');
  logger.log(`RVIOS API running on port ${port}`);
  logger.log(`Health: /api/v1/health · Docs: /api/docs`);
}

bootstrap();
