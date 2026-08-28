"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, FileText, Tag, Briefcase, FolderOpen,
  Image, MessageSquare, Settings, User, Users, LogOut
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard/posts", label: "المقالات", icon: FileText },
  { href: "/dashboard/categories", label: "التصنيفات", icon: Tag },
  { href: "/dashboard/services", label: "الخدمات", icon: Briefcase },
  { href: "/dashboard/projects", label: "المشاريع", icon: FolderOpen },
  { href: "/dashboard/media", label: "الوسائط", icon: Image },
  { href: "/dashboard/contacts", label: "الرسائل", icon: MessageSquare },
  { href: "/dashboard/owner", label: "الملف الشخصي", icon: User },
  { href: "/dashboard/users", label: "المستخدمون", icon: Users },
  { href: "/dashboard/settings", label: "الإعدادات", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    /* جدار داكن بمحتوى إيفوري — تركيبة «أرشيف ملكي» المعتمدة.
       الألوان مثبَّتة على المقياس الداكن لأن الشريط داكن دائماً، حتى
       عندما تكون بقية اللوحة فاتحة. */
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-ink-900 py-6 text-fg-inverse">
      <div className="border-b border-gold-500/20 px-5 pb-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-sm bg-primary-500 font-display font-extrabold text-fg-onPrimary">
            R
          </div>
          <div>
            <div className="font-display text-base font-extrabold tracking-wide">RVIOS</div>
            <div className="font-mono text-[10px] tracking-[0.18em] text-gold-500">
              ADMIN PANEL
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 border-s-2 px-5 py-3 text-sm transition-fast ease-out",
                active
                  ? "border-s-gold-500 bg-gold-500/10 font-bold text-fg-inverse"
                  : "border-s-transparent text-fg-inverse/55 hover:bg-fg-inverse/5 hover:text-fg-inverse",
              )}
            >
              <Icon size={17} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gold-500/20 px-4 pt-4">
        <div className="mb-3 px-1">
          <div className="truncate text-sm font-bold">{user?.email}</div>
          <div className="font-mono text-[10px] tracking-widest text-gold-500">
            {user?.role}
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-gold-500/40 px-4 py-2 text-sm transition-fast ease-out hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-500"
        >
          <LogOut size={15} aria-hidden /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
