import { Table, TableMessage, TableSkeleton } from "@/components/ui/Table";

export interface ListPageShellProps<T> {
  title: string;
  /** سطر العدّاد تحت العنوان، مثل: «٢٤ مشروعاً · ٣ مسودات» */
  count?: React.ReactNode;
  /** زر الإجراء الأساسي أعلى اليسار */
  action?: React.ReactNode;
  /** شريط فلاتر اختياري بين الهيدر والجدول */
  filters?: React.ReactNode;

  columns: readonly string[];
  rows: T[] | undefined;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  renderRow: (row: T, index: number) => React.ReactNode;
}

/**
 * الهيكل المشترك لصفحات القوائم.
 *
 * قبل هذا المكوّن كان الهيدر نفسه (عنوان + عدّاد + زر) مكتوباً حرفياً في
 * تسع صفحات، ونمط الجدول مع حالتَي التحميل والفراغ في ستّ. أي تعديل على
 * الشكل كان يعني تعديل تسعة ملفات.
 */
export function ListPageShell<T>({
  title,
  count,
  action,
  filters,
  columns,
  rows,
  loading,
  error,
  emptyMessage = "لا توجد عناصر بعد",
  renderRow,
}: ListPageShellProps<T>) {
  return (
    <div>
      <header className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          {count != null && (
            <p className="mt-1 font-mono text-xs tracking-wider text-fg-muted">
              {count}
            </p>
          )}
        </div>
        {action && <div className="ms-auto">{action}</div>}
      </header>

      {filters && <div className="mb-4">{filters}</div>}

      <Table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableSkeleton cols={columns.length} />
          ) : error ? (
            <TableMessage colSpan={columns.length}>
              <span className="text-danger">{error}</span>
            </TableMessage>
          ) : !rows?.length ? (
            <TableMessage colSpan={columns.length}>{emptyMessage}</TableMessage>
          ) : (
            rows.map(renderRow)
          )}
        </tbody>
      </Table>
    </div>
  );
}
