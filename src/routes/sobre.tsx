import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, MessageCircle } from "lucide-react";

import heroImage from "@/assets/hero-clean.jpg";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { SITE, WA_GENERAL, whatsappLink } from "@/lib/site";

const TITLE = "Sobre a Clean Deluxe | Empresa de Limpeza em Indaiatuba";
const DESCRIPTION =
  "Conheça a Clean Deluxe, empresa de serviços profissionais de limpeza residencial, comercial e pós-obra em Indaiatuba e região.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Sobre a empresa"
        title="Sobre a Clean Deluxe"
        description="Serviços profissionais de limpeza para residências, empresas e ambientes pós-obra."
      />

      <section className="py-14 md:py-20">
        <div className="cd-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4 text-muted-foreground">
            <p>
              A Clean Deluxe atua com serviços profissionais de limpeza em {SITE.region}, atendendo
              residências, empresas e ambientes que passaram por obra ou reforma.
            </p>
            <p>
              O compromisso da empresa é entregar ambientes realmente limpos, com organização,
              atenção aos detalhes e respeito à rotina de cada cliente. O atendimento é combinado
              diretamente, com data e horário definidos antes do serviço.
            </p>
            <p>
              A comunicação oficial da Clean Deluxe acontece pelo WhatsApp {SITE.whatsappNumber} e
              pelo perfil {SITE.instagramHandle} no Instagram, onde a empresa publica seus trabalhos
              e novidades.
            </p>
            <p>
              Pelo site é possível solicitar um agendamento escolhendo o serviço, a data e um dos
              horários disponíveis na agenda.
            </p>
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button asChild>
                <Link to="/agendar">Agendar limpeza</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> Falar pelo WhatsApp
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" /> {SITE.instagramHandle}
                </a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border">
            <img
              src={heroImage}
              alt="Ambiente residencial limpo e organizado"
              loading="lazy"
              width={1600}
              height={1104}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
