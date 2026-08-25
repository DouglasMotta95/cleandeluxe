import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, Instagram, MessageCircle, ShieldCheck, Sparkles, Timer } from "lucide-react";

import heroImage from "@/assets/hero-clean.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPublicServices } from "@/lib/booking";
import { SITE, WA_GENERAL, WA_QUOTE, whatsappLink } from "@/lib/site";

const TITLE = "Clean Deluxe | Serviços Profissionais de Limpeza em Indaiatuba";
const DESCRIPTION =
  "Clean Deluxe: limpeza residencial, comercial e pós-obra em Indaiatuba e região. Agende online o seu atendimento em poucos minutos.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Clean Deluxe",
          description: DESCRIPTION,
          telephone: SITE.whatsappNumber,
          areaServed: "Indaiatuba e região, SP, Brasil",
          sameAs: [SITE.instagramUrl],
        }),
      },
    ],
  }),
  component: Home,
});

const DIFERENCIAIS = [
  {
    icon: Sparkles,
    title: "Limpeza eficiente",
    text: "Rotina de trabalho organizada para entregar o ambiente pronto para uso, sem retrabalho.",
  },
  {
    icon: ShieldCheck,
    title: "Atendimento profissional",
    text: "Comunicação clara do primeiro contato à conclusão do serviço.",
  },
  {
    icon: Timer,
    title: "Praticidade",
    text: "Agendamento pelo site, com escolha de data e horário disponíveis.",
  },
  {
    icon: CalendarCheck,
    title: "Atendimento personalizado",
    text: "Serviços residenciais, comerciais e pós-obra ajustados à necessidade de cada ambiente.",
  },
];

function Home() {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services", "public"],
    queryFn: fetchPublicServices,
  });

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="cd-container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="cd-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs tracking-[0.18em] uppercase text-primary">
              {SITE.region}
            </p>
            <h1 className="mt-5 text-4xl leading-[1.1] md:text-6xl">
              Limpeza profissional para um ambiente impecável
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Serviços profissionais de limpeza para residências, empresas e ambientes que precisam
              de cuidado, qualidade e praticidade.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/agendar">Agendar limpeza</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={whatsappLink(WA_GENERAL)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Falar pelo WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border shadow-xl shadow-primary/10">
              <img
                src={heroImage}
                alt="Sala residencial limpa e organizada, com piso brilhante e luz natural"
                width={1600}
                height={1104}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-lg sm:block">
              <p className="font-display text-sm tracking-[0.16em] uppercase text-primary">
                Residencial · Comercial · Pós-obra
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="border-t border-border bg-secondary/40 py-16 md:py-24">
        <div className="cd-container">
          <header className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-primary/70">O que fazemos</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Nossos serviços</h2>
            <p className="mt-4 text-muted-foreground">
              Escolha o serviço ideal para o seu ambiente e agende diretamente pelo site.
            </p>
          </header>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-[430px] rounded-2xl" />)
              : services?.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 md:py-24">
        <div className="cd-container grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-primary/70">Quem somos</p>
            <h2 className="mt-3 text-3xl md:text-4xl">Sobre a Clean Deluxe</h2>
            <div className="mt-5 space-y-4 text-muted-foreground">
              <p>
                A Clean Deluxe é uma empresa de serviços profissionais de limpeza que atende{" "}
                {SITE.region}, com trabalhos residenciais, comerciais e pós-obra.
              </p>
              <p>
                O trabalho é conduzido com organização e atenção aos detalhes, do primeiro contato à
                entrega do ambiente limpo. Cada atendimento é combinado diretamente com o cliente,
                respeitando a rotina da casa ou da empresa.
              </p>
              <p>
                O contato oficial é feito pelo WhatsApp {SITE.whatsappNumber} e pelo Instagram{" "}
                {SITE.instagramHandle}.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link to="/sobre">Conhecer a empresa</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {DIFERENCIAIS.map((d) => (
              <div key={d.title} className="rounded-2xl border border-border bg-card p-6">
                <d.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg">{d.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="border-y border-border bg-secondary/40 py-16">
        <div className="cd-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl">Acompanhe a Clean Deluxe</h2>
            <p className="mt-2 text-muted-foreground">
              Novidades e trabalhos publicados no perfil oficial {SITE.instagramHandle}.
            </p>
          </div>
          <Button asChild size="lg" variant="outline">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-5 w-5" /> Ver Instagram
            </a>
          </Button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 md:py-24">
        <div className="cd-container rounded-3xl bg-primary px-6 py-14 text-primary-foreground md:px-14">
          <h2 className="max-w-2xl text-3xl md:text-4xl">Pronto para deixar o ambiente impecável?</h2>
          <p className="mt-4 max-w-xl text-primary-foreground/80">
            Solicite o seu atendimento em poucos minutos. Você escolhe o serviço, a data e o horário
            disponível.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="secondary">
              <Link to="/agendar">Agendar limpeza</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={whatsappLink(WA_QUOTE)} target="_blank" rel="noopener noreferrer">
                Solicitar orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
