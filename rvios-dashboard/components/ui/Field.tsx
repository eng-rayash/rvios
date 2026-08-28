import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

interface Base {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function FieldWrapper({
  label,
  hint,
  error,
  required,
  htmlFor,
  children,
}: Base & { htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="flex items-baseline gap-2">
        {label}
        {required && <span className="text-danger" aria-hidden>*</span>}
        {hint && <span className="font-normal text-xs text-fg-muted">{hint}</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  Base & React.InputHTMLAttributes<HTMLInputElement>
>(({ label, hint, error, required, className, ...props }, ref) => {
  const id = useId();
  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-sm border bg-surface-3 px-4 py-3 text-sm transition-fast",
          "focus:border-primary-500 focus:outline-none",
          error ? "border-danger" : "border-border-default",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  Base & React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ label, hint, error, required, className, ...props }, ref) => {
  const id = useId();
  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} htmlFor={id}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-sm border bg-surface-3 px-4 py-3 text-sm leading-relaxed transition-fast",
          "focus:border-primary-500 focus:outline-none",
          error ? "border-danger" : "border-border-default",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
});
Textarea.displayName = "Textarea";

/**
 * إدخال وسوم — للتقنيات.
 * Enter أو فاصلة يُضيف، Backspace على حقل فارغ يحذف الأخير.
 */
export function TagInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const id = useId();
  const add = (raw: string) => {
    const t = raw.trim().replace(/,$/, "");
    if (t && !value.includes(t)) onChange([...value, t]);
  };

  return (
    <FieldWrapper label={label} hint={hint} htmlFor={id}>
      <div className="flex flex-wrap gap-2 rounded-sm border border-border-default bg-surface-3 p-2">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-sm border border-border-strong px-2 py-1 font-mono text-xs"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== t))}
              aria-label={`حذف ${t}`}
              className="text-fg-muted hover:text-danger"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          placeholder={placeholder ?? "اكتب واضغط Enter"}
          className="min-w-[10rem] flex-1 bg-transparent px-1 py-1 text-sm focus:outline-none"
          onKeyDown={(e) => {
            const el = e.currentTarget;
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(el.value);
              el.value = "";
            } else if (e.key === "Backspace" && !el.value && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={(e) => { add(e.currentTarget.value); e.currentTarget.value = ""; }}
        />
      </div>
    </FieldWrapper>
  );
}
