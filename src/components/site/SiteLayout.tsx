import type { ReactNode } from "react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="nuve-site">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
