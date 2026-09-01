"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashCursor from "@/components/SplashCursor";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SplashCursor COLOR="#EF4444" RAINBOW_MODE={false} />
      <Header />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
