import { cn } from "@/lib/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-default bg-surface-3",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 border-b border-border-subtle px-6 py-4",
        className,
      )}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

/** بطاقة إحصاء: تسمية بخط mono ورقم ضخم بخط العرض. */
export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <span className="font-mono text-xs tracking-widest text-fg-muted">
        {label}
      </span>
      <b className="mt-2 block font-display text-3xl font-extrabold tabular-nums">
        {value}
      </b>
      {hint && <span className="text-xs text-fg-muted">{hint}</span>}
    </Card>
  );
}
