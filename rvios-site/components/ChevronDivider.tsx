/**
 * عنصر التوقيع البصري لكل صفحات RVIOS — استخدام شكل الـ V من الشعار
 * كخط فاصل بين الأقسام بدل الخطوط الأفقية التقليدية أو الأرقام (01/02/03).
 */
export default function ChevronDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-10 ${className}`} aria-hidden="true">
      <svg width="46" height="26" viewBox="0 0 46 26" className="opacity-70">
        <path
          d="M2 2 L23 22 L44 2"
          fill="none"
          stroke="#C8A45D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
