import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: "Termos de uso | NUVE Advanced Skin Care" }, { name: "description", content: "Termos de uso da NUVE Advanced Skin Care." }] }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <section className="nuve-legal-page">
        <div className="nuve-container nuve-legal-inner">
          <p className="nuve-kicker">NUVE ADVANCED SKIN CARE</p>
          <h1>Termos de uso</h1>
          <p>Esta página está preparada para receber os termos oficiais da loja NUVE Advanced Skin Care.</p>
          <p>Informações comerciais específicas, prazos de envio, regras de troca e devolução, canais de atendimento e demais obrigações serão publicadas apenas após aprovação oficial da marca.</p>
          <h2>Informações de produto</h2>
          <p>Os conteúdos da loja são apresentados em contexto cosmético. Não são criadas promessas terapêuticas, garantias de resultado, certificações, percentuais de eficácia ou informações técnicas não fornecidas pela NUVE.</p>
          <h2>Compras e pagamentos</h2>
          <p>A finalização de pedidos e pagamentos será regida pelas condições comerciais configuradas na loja e pelo meio de pagamento oficial integrado.</p>
        </div>
      </section>
    </SiteLayout>
  );
}
