import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * تُصدَّر ليستعملها `<Link>` أيضاً: الرابط يجب أن يبقى `<a>` لأسباب
 * الوصولية والتنقّل، فلا يصحّ لفّه بـ `<button>` لمجرد الشكل.
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm border font-bold " +
    "transition-fast ease-out disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-primary-500 text-fg-onPrimary hover:bg-primary-700",
        ghost:
          "border-border-strong bg-transparent text-fg hover:border-primary-500 hover:text-primary-500",
        danger:
          "border-danger bg-transparent text-danger hover:bg-danger hover:text-fg-inverse",
        subtle:
          "border-transparent bg-surface-2 text-fg-muted hover:bg-surface-2 hover:text-fg",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-3 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      /* يمنع قارئ الشاشة من إعلان الزر كجاهز أثناء الحفظ */
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  ),
);
Button.displayName = "Button";
