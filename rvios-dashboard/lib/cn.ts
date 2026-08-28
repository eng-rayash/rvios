import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * يدمج الكلاسات الشرطية ويحلّ تعارض Tailwind لصالح الأخير.
 *
 * `clsx` وحده يُبقي `px-4 px-6` معاً فيفوز أحدهما حسب ترتيب CSS لا حسب
 * ترتيب الاستدعاء — وهو ما يجعل تمرير `className` للمكوّنات غير موثوق.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
