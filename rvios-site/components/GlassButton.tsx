import Link from "next/link";
import { ReactNode } from "react";

type GlassButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
};

export default function GlassButton({ href, children, variant = "primary" }: GlassButtonProps) {
  const base =
    "glass-btn inline-flex items-center gap-2 rounded-full px-7 py-3 font-body text-sm tracking-wide transition-transform duration-300 hover:-translate-y-0.5";

  const styles =
    variant === "primary"
      ? "bg-primary/90 text-ivory shadow-glass-gold border border-gold/40"
      : "glass text-ivory";

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
