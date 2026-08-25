import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="border-b border-border bg-secondary/50">
      <div className="cd-container py-14 md:py-20">
        <p className="text-xs tracking-[0.3em] uppercase text-primary/70">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}
