import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badge = cva(
  "inline-flex items-center gap-1 rounded-full border px-3 py-0.5 font-mono text-[11px]",
  {
    variants: {
      tone: {
        success: "border-success text-success",
        warning: "border-warning text-warning",
        danger: "border-danger text-danger",
        info: "border-info text-info",
        neutral: "border-border-strong text-fg-muted",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}

/** خريطة حالات المحتوى المشتركة بين المقالات والمشاريع والخدمات. */
const STATUS_TONE = {
  PUBLISHED: { tone: "success", label: "منشور" },
  ACTIVE: { tone: "success", label: "نشط" },
  DRAFT: { tone: "warning", label: "مسودة" },
  UNREAD: { tone: "info", label: "جديد" },
  READ: { tone: "neutral", label: "مقروء" },
  REPLIED: { tone: "success", label: "تم الرد" },
  ARCHIVED: { tone: "neutral", label: "مؤرشف" },
  INACTIVE: { tone: "neutral", label: "متوقف" },
} as const;

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_TONE[status as keyof typeof STATUS_TONE];
  /* حالة غير معروفة تُعرض كما هي بدل أن تختفي — الاختفاء يخفي أخطاء البيانات */
  return <Badge tone={s?.tone ?? "neutral"}>{s?.label ?? status}</Badge>;
}
