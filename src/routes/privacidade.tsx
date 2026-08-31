import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: "Privacidade | NUVE Advanced Skin Care" }, { name: "description", content: "Informações de privacidade da NUVE Advanced Skin Care." }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <section className="nuve-legal-page">
        <div className="nuve-container nuve-legal-inner">
          <p className="nuve-kicker">NUVE ADVANCED SKIN CARE</p>
          <h1>Privacidade</h1>
          <p>Esta página está preparada para receber a política oficial de privacidade e proteção de dados da NUVE.</p>
          <p>Até a aprovação do texto jurídico final da marca, não publicamos CNPJ, endereço, prazos, canais de contato ou regras que não tenham sido fornecidos oficialmente.</p>
          <h2>Dados e consentimento</h2>
          <p>Formulários, newsletter, conta e checkout devem coletar apenas os dados necessários para a finalidade informada, com transparência e controles adequados de acesso.</p>
          <h2>Versão final</h2>
          <p>O conteúdo jurídico definitivo será disponibilizado assim que aprovado pela NUVE e seus responsáveis.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
