import { cn } from "@/lib/cn";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-surface-3">
      <table className={cn("w-full border-collapse", className)} {...props} />
    </div>
  );
}

/**
 * صف يغطي عرض الجدول — للحالات الفارغة والتحميل والخطأ.
 * يأخذ `colSpan` تلقائياً بدل تمريره يدوياً في كل صفحة.
 */
export function TableMessage({
  colSpan,
  children,
}: {
  colSpan: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center text-fg-muted">
        {children}
      </td>
    </tr>
  );
}

export function TableSkeleton({
  rows = 5,
  cols,
}: {
  rows?: number;
  cols: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <tr key={r} aria-hidden>
          {Array.from({ length: cols }, (_, c) => (
            <td key={c}>
              <span
                className="block h-3 animate-pulse rounded-xs bg-surface-2"
                style={{ width: `${55 + ((r * 7 + c * 13) % 40)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
