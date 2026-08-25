import { Link } from "@tanstack/react-router";
import { Instagram, MapPin, MessageCircle } from "lucide-react";

import { Logo } from "./Logo";
import { SITE, WA_GENERAL, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-sidebar text-sidebar-foreground">
      <div className="cd-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm text-sidebar-foreground/70">
            Serviços profissionais de limpeza residencial, comercial e pós-obra.
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm text-sidebar-foreground/70">
            <MapPin className="h-4 w-4 text-sidebar-primary" /> {SITE.region}
          </p>
        </div>

        <nav aria-label="Links do rodapé">
          <h2 className="font-display text-sm tracking-[0.2em] uppercase text-sidebar-primary">Navegação</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/servicos", label: "Serviços" },
              { to: "/sobre", label: "Sobre a Clean Deluxe" },
              { to: "/galeria", label: "Galeria" },
              { to: "/agendar", label: "Agendar limpeza" },
              { to: "/privacidade", label: "Política de Privacidade" },
              { to: "/termos", label: "Termos de Uso" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sidebar-foreground/75 transition-colors hover:text-sidebar-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm tracking-[0.2em] uppercase text-sidebar-primary">Contato</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                className="inline-flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary"
                href={whatsappLink(WA_GENERAL)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" /> {SITE.whatsappNumber}
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 text-sidebar-foreground/80 hover:text-sidebar-primary"
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" /> {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="cd-container flex flex-col gap-2 py-5 text-xs text-sidebar-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Clean Deluxe. Todos os direitos reservados.</p>
          <Link to="/auth" className="hover:text-sidebar-primary">
            Área da proprietária
          </Link>
        </div>
      </div>
    </footer>
  );
}
