import { Link } from "@tanstack/react-router";
import { Menu, MessageCircle } from "lucide-react";
import { useState } from "react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { WA_GENERAL, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/sobre", label: "Sobre" },
  { to: "/galeria", label: "Galeria" },
  { to: "/agendar", label: "Agendar" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="cd-container flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="Clean Deluxe — página inicial">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" size="sm">
            <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild size="sm">
            <Link to="/agendar">Agendar limpeza</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="outline" size="icon" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[86vw] max-w-sm">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="px-5 pt-5">
              <Logo />
            </div>
            <nav className="mt-6 flex flex-col gap-1 px-3" aria-label="Navegação mobile">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base text-foreground transition-colors hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-2 px-5">
              <Button asChild>
                <Link to="/agendar" onClick={() => setOpen(false)}>
                  Agendar limpeza
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Falar pelo WhatsApp
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
