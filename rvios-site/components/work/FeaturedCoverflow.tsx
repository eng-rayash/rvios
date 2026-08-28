"use client";

import { useRouter } from "next/navigation";
import CoverflowGallery, { type CoverflowItem } from "@/components/CoverflowGallery";

/**
 * غلاف عميل لـ `CoverflowGallery`.
 *
 * العارض يستقبل `onOpen` (دالة)، والدوال لا تُمرَّر من مكوّن خادم إلى عميل —
 * لذلك يعيش التنقّل هنا. الغلاف رقيق عمداً: كل المنطق البصري في العارض نفسه.
 */
export function FeaturedCoverflow({ items }: { items: CoverflowItem[] }) {
  const router = useRouter();

  /* عنصران لا يكفيان لعارض ثلاثي الأبعاد — الجاران يختفيان فيبدو بطاقة وحيدة. */
  if (items.length < 3) return null;

  return (
    <CoverflowGallery
      items={items}
      eyebrow="مختارات"
      heading="أعمال بارزة"
      onOpen={(item) => router.push(`/work/${item.slug}`)}
    />
  );
}
