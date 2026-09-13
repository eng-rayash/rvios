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
  // مطابقة لـ rvios-site/lib/services.ts — الموقع يعرض تلك النسخة، وهذه
  // تغذّي لوحة التحكم وربط الخدمات بالمشاريع.
  const services = [
    {
      title: 'تصميم المواقع',
      titleEn: 'Web Design',
      slug: 'web-design',
      description: 'نصمم تجارب ويب مبنية حول علامتك التجارية وجمهورك، تجمع الجمال بالوضوح.',
      descriptionEn: 'Design experiences built around your brand and audience.',
      icon: 'design',
      features: ['UI/UX', 'Website Design', 'Design Systems', 'User Experience'],
      order: 1,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'تطوير المواقع',
      titleEn: 'Web Development',
      slug: 'web-development',
      description: 'نطوّر مواقع سريعة وآمنة وقابلة للتوسع بأحدث تقنيات الويب.',
      descriptionEn: 'Fast, scalable websites built with modern technology.',
      icon: 'code',
      features: ['Corporate Websites', 'Custom Websites', 'Next.js / React', 'CMS & API Integration'],
      order: 2,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'أنظمة وتطبيقات الويب',
      titleEn: 'Web Systems & Applications',
      slug: 'web-systems',
      description: 'أنظمة وتطبيقات مخصصة تدير أعمالك من مكان واحد.',
      descriptionEn: 'Custom systems and applications that run your business.',
      icon: 'systems',
      features: ['Custom Business Systems', 'Dashboards', 'Portals', 'SaaS Platforms', 'Web Applications', 'Mobile Apps'],
      order: 3,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'المتاجر الإلكترونية',
      titleEn: 'E-commerce',
      slug: 'ecommerce',
      description: 'متاجر إلكترونية مصممة لتجربة تسوق أسهل ومبيعات أكثر.',
      descriptionEn: 'Online stores designed for better shopping experiences.',
      icon: 'cart',
      features: ['Custom Online Stores', 'Product Experiences', 'Checkout', 'Products & Orders Management'],
      order: 4,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'صفحات الهبوط',
      titleEn: 'Landing Pages',
      slug: 'landing-pages',
      description: 'صفحات مركّزة مبنية لتحويل الزوار إلى عملاء.',
      descriptionEn: 'Focused pages built to turn visitors into customers.',
      icon: 'landing',
      features: ['Campaign Pages', 'Product Pages', 'Lead Generation', 'Conversion-focused Pages'],
      order: 5,
      status: ServiceStatus.ACTIVE,
    },
    {
      title: 'العناية بالموقع',
      titleEn: 'Website Care',
      slug: 'website-care',
      description: 'صيانة وتحسين ودعم مستمر لموقعك بعد الإطلاق.',
      descriptionEn: 'Ongoing maintenance, optimization and support.',
      icon: 'care',
      features: ['Maintenance', 'Optimization', 'Performance', 'Updates', 'Technical Support'],
      order: 6,
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
