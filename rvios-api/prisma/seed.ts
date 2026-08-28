import { PrismaClient, UserRole, PostStatus, ServiceStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding RVIOS database...');

  // ── Admin User ─────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || 'RVIOS@Admin2025',
    12,
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || 'admin@rvios.com' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@rvios.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user:', admin.email);

  // ── Categories ─────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'software-development' },
      update: {},
      create: { name: 'تطوير البرمجيات', nameEn: 'Software Development', slug: 'software-development' },
    }),
    prisma.category.upsert({
      where: { slug: 'ai-automation' },
      update: {},
      create: { name: 'الذكاء الاصطناعي والأتمتة', nameEn: 'AI & Automation', slug: 'ai-automation' },
    }),
    prisma.category.upsert({
      where: { slug: 'cloud' },
      update: {},
      create: { name: 'السحابة والبنية التحتية', nameEn: 'Cloud & Infrastructure', slug: 'cloud' },
    }),
    prisma.category.upsert({
      where: { slug: 'digital-transformation' },
      update: {},
      create: { name: 'التحول الرقمي', nameEn: 'Digital Transformation', slug: 'digital-transformation' },
    }),
    prisma.category.upsert({
      where: { slug: 'product-design' },
      update: {},
      create: { name: 'تصميم المنتجات', nameEn: 'Product Design', slug: 'product-design' },
    }),
  ]);
  console.log('✅ Categories seeded:', categories.length);

  // ── Services ───────────────────────────────────────────────
  const services = [
    {
      title: 'تطوير البرمجيات والأنظمة',
      titleEn: 'Software Development',
      slug: 'software-development',
      description: 'نبني تطبيقات ومنصات رقمية مخصصة تساعد الشركات على النمو وتحقيق أهدافها التقنية.',
      descriptionEn: 'We build custom digital applications and platforms that help companies grow and achieve their technical goals.',
      icon: 'code',
      features: ['Web Applications', 'Mobile Apps', 'API Development', 'System Integration'],
      order: 1,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'تصميم المنتجات الرقمية',
      titleEn: 'Product Design',
      slug: 'product-design',
      description: 'نصمم تجارب مستخدم استثنائية تجمع بين الجمال البصري والكفاءة الوظيفية.',
      descriptionEn: 'We design exceptional user experiences that combine visual beauty with functional efficiency.',
      icon: 'design',
      features: ['UI/UX Design', 'Design Systems', 'Prototyping', 'User Research'],
      order: 2,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'البنية السحابية والاستضافة',
      titleEn: 'Cloud & Infrastructure',
      slug: 'cloud-infrastructure',
      description: 'نصمم ونبني بنى تحتية سحابية موثوقة وقابلة للتوسع تضمن استمرارية الأعمال.',
      descriptionEn: 'We design and build reliable, scalable cloud infrastructures that ensure business continuity.',
      icon: 'cloud',
      features: ['Cloud Migration', 'DevOps', 'CI/CD', 'Monitoring & Security'],
      order: 3,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'الأتمتة والذكاء الاصطناعي',
      titleEn: 'AI & Automation',
      slug: 'ai-automation',
      description: 'نحول العمليات اليدوية إلى أنظمة ذكية تعمل تلقائياً وتنتج بيانات قابلة للتحليل.',
      descriptionEn: 'We transform manual processes into smart automated systems that produce analyzable data.',
      icon: 'ai',
      features: ['Process Automation', 'AI Integration', 'Data Analytics', 'ML Models'],
      order: 4,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'الاستشارات التقنية',
      titleEn: 'Tech Consulting',
      slug: 'consulting',
      description: 'نقدم استشارات تقنية متخصصة تساعدك على اتخاذ القرارات الصحيحة في رحلة تحولك الرقمي.',
      descriptionEn: 'We provide specialized technical consulting to help you make the right decisions on your digital transformation journey.',
      icon: 'consulting',
      features: ['Technical Audit', 'Architecture Review', 'Tech Strategy', 'Team Training'],
      order: 5,
      status: ServiceStatus.ACTIVE,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }
  console.log('✅ Services seeded:', services.length);

  // ── Owner Profile ──────────────────────────────────────────
  const existingProfile = await prisma.ownerProfile.findFirst();
  if (!existingProfile) {
    await prisma.ownerProfile.create({
      data: {
        name: 'رياش فيصل',
        title: 'مؤسس RVIOS Technologies',
        titleEn: 'Founder of RVIOS Technologies',
        bio: 'مطور ومصمم متخصص في بناء الحلول الرقمية المتكاملة. أؤمن بأن التقنية أداة لحل المشكلات الحقيقية.',
        bioEn: 'Developer and designer specialized in building integrated digital solutions. I believe technology is a tool to solve real problems.',
        skills: ['Full-Stack Development', 'Product Design', 'Cloud Architecture', 'AI Integration', 'Tech Leadership'],
        links: { github: '', linkedin: '', twitter: '' },
      },
    });
    console.log('✅ Owner profile seeded');
  }

  // ── Default Settings ───────────────────────────────────────
  const defaultSettings = [
    { key: 'site_name', value: 'RVIOS Technologies', type: 'STRING' as const, label: 'اسم الموقع' },
    { key: 'site_email', value: 'info@rvios.com', type: 'STRING' as const, label: 'البريد الإلكتروني' },
    { key: 'site_whatsapp', value: '+967739008083', type: 'STRING' as const, label: 'واتساب' },
    { key: 'site_maintenance', value: 'false', type: 'BOOLEAN' as const, label: 'وضع الصيانة' },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Settings seeded');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
