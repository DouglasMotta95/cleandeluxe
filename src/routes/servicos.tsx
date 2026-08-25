import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { ServiceCard } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPublicServices } from "@/lib/booking";
import { WA_QUOTE, whatsappLink } from "@/lib/site";

const TITLE = "Serviços de Limpeza | Clean Deluxe Indaiatuba";
const DESCRIPTION =
  "Limpeza residencial, limpeza comercial e limpeza pós-obra em Indaiatuba e região com a Clean Deluxe. Agende o serviço online.";

export const Route = createFileRoute("/servicos")({
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
  component: ServicosPage,
});

function ServicosPage() {
  const { data, isLoading } = useQuery({ queryKey: ["services", "public"], queryFn: fetchPublicServices });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Nossos serviços"
        title="Serviços profissionais de limpeza"
        description="Cada ambiente pede um tipo de cuidado. Escolha o serviço adequado e agende o atendimento diretamente pelo site."
      />
      <section className="py-14 md:py-20">
        <div className="cd-container grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-[430px] rounded-2xl" />)
            : data?.map((s) => <ServiceCard key={s.id} service={s} />)}
        </div>

        <div className="cd-container mt-14 rounded-2xl border border-border bg-secondary/50 p-8 text-center">
          <h2 className="text-2xl">Precisa de algo específico?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Fale com a Clean Deluxe pelo WhatsApp para combinar o atendimento conforme a necessidade
            do seu ambiente.
          </p>
          <Button asChild size="lg" className="mt-6">
            <a href={whatsappLink(WA_QUOTE)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" /> Solicitar orçamento
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
