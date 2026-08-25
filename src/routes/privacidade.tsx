import { createFileRoute } from "@tanstack/react-router";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { SITE } from "@/lib/site";

const TITLE = "Política de Privacidade | Clean Deluxe";
const DESCRIPTION =
  "Como a Clean Deluxe coleta, utiliza e protege os dados pessoais informados no agendamento de serviços de limpeza.";

export const Route = createFileRoute("/privacidade")({
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
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="LGPD"
        title="Política de Privacidade"
        description="Transparência sobre o tratamento dos dados pessoais informados neste site."
      />
      <section className="py-14 md:py-20">
        <div className="cd-container max-w-3xl space-y-8 text-muted-foreground">
          <div>
            <h2 className="text-xl text-foreground">1. Dados coletados</h2>
            <p className="mt-2">
              Ao solicitar um agendamento, a Clean Deluxe coleta: nome completo, telefone/WhatsApp,
              e-mail, endereço (rua, número, complemento, bairro e cidade), serviço escolhido, data,
              horário e observações informadas pelo cliente.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">2. Finalidade</h2>
            <p className="mt-2">
              Os dados são utilizados exclusivamente para organizar a agenda, confirmar o
              atendimento, executar o serviço contratado e manter contato sobre esse atendimento.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">3. Compartilhamento</h2>
            <p className="mt-2">
              Os dados não são vendidos nem compartilhados com terceiros para fins comerciais. O
              acesso é restrito à administração da Clean Deluxe.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">4. Armazenamento e segurança</h2>
            <p className="mt-2">
              As informações ficam armazenadas em banco de dados com controle de acesso. Apenas a
              conta administrativa autenticada consegue visualizar os agendamentos e os dados dos
              clientes. Nenhum dado de cliente é exibido publicamente no site.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">5. Direitos do titular</h2>
            <p className="mt-2">
              Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o titular pode
              solicitar confirmação de tratamento, acesso, correção, portabilidade, anonimização ou
              exclusão dos seus dados. Basta solicitar pelo WhatsApp {SITE.whatsappNumber}.
            </p>
          </div>
          <div>
            <h2 className="text-xl text-foreground">6. Consentimento</h2>
            <p className="mt-2">
              O envio do formulário de agendamento só é permitido após o aceite desta Política de
              Privacidade, registrado junto à solicitação.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
