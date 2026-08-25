import { createFileRoute } from "@tanstack/react-router";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site";

const TITLE = "Termos de Uso | Clean Deluxe";
const DESCRIPTION =
  "Condições de uso do site e do sistema de agendamento de serviços de limpeza da Clean Deluxe.";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Condições"
        title="Termos de Uso"
        description="Regras para utilização do site e do sistema de agendamento da Clean Deluxe."
      />
      <section className="py-14 md:py-20">
        <div className="cd-container max-w-3xl space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-xl text-foreground">1. Objeto</h2>
            <p className="mt-2">
              Este site apresenta os serviços da Clean Deluxe e permite solicitar um agendamento de
              limpeza para {SITE.region}.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">2. Solicitação de agendamento</h2>
            <p className="mt-2">
              O envio do formulário registra uma solicitação de atendimento. A solicitação passa a
              ter o status “Pendente” e só é considerada confirmada após aprovação da Clean Deluxe,
              informada ao cliente pelo contato fornecido.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">3. Informações do cliente</h2>
            <p className="mt-2">
              O cliente é responsável pela veracidade dos dados informados. Endereço ou contato
              incorretos podem inviabilizar o atendimento.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">4. Cancelamentos e alterações</h2>
            <p className="mt-2">
              Alterações e cancelamentos devem ser comunicados pelo WhatsApp{" "}
              {SITE.whatsappNumber} com a maior antecedência possível, para que o horário possa ser
              liberado para outro cliente.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">5. Disponibilidade da agenda</h2>
            <p className="mt-2">
              Os horários exibidos refletem a agenda no momento da consulta. Um horário já ocupado
              deixa de ser oferecido e datas bloqueadas não permitem agendamento.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">6. Dados pessoais</h2>
            <p className="mt-2">
              O tratamento dos dados pessoais segue a Política de Privacidade deste site.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
