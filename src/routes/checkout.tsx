import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, LockKeyhole, MapPin, ShoppingBag } from "lucide-react";

import { Footer } from "@/components/site/Footer";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | NUVE Advanced Skin Care" }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <div className="nuve-site">
      <header className="nuve-checkout-header">
        <div className="nuve-container"><a href="/"><Logo /></a><span><LockKeyhole size={14} /> CHECKOUT SEGURO</span></div>
      </header>
      <main className="nuve-checkout-page">
        <div className="nuve-container">
          <a href="/#produtos" className="nuve-back-link"><ArrowLeft size={15} /> VOLTAR PARA A LOJA</a>
          <div className="nuve-checkout-layout">
            <section>
              <p className="nuve-kicker">FINALIZE SUA COMPRA</p>
              <h1>Seus dados para entrega.</h1>
              <div className="nuve-checkout-step"><span>01</span><div><strong>IDENTIFICAÇÃO</strong><small>Dados para contato e acompanhamento do pedido.</small></div></div>
              <form className="nuve-checkout-form" onSubmit={(e) => e.preventDefault()}>
                <label>Nome completo<input placeholder="Seu nome" /></label>
                <div className="nuve-form-row"><label>E-mail<input type="email" placeholder="voce@email.com" /></label><label>Telefone<input placeholder="(00) 00000-0000" /></label></div>
                <div className="nuve-checkout-step"><span>02</span><div><strong>ENTREGA</strong><small>Informe o endereço. O frete será definido conforme a operação oficial da marca.</small></div></div>
                <div className="nuve-form-row"><label>CEP<input placeholder="00000-000" /></label><label>Estado<input placeholder="UF" /></label></div>
                <label>Endereço<input placeholder="Rua / Avenida" /></label>
                <div className="nuve-form-row"><label>Número<input placeholder="Nº" /></label><label>Complemento<input placeholder="Opcional" /></label></div>
                <div className="nuve-checkout-step"><span>03</span><div><strong>PAGAMENTO</strong><small>Integração com Mercado Pago preparada para configuração segura.</small></div></div>
                <div className="nuve-payment-preview"><CreditCard /><div><strong>Mercado Pago</strong><span>Pagamento protegido. As chaves privadas não ficam expostas no navegador.</span></div></div>
                <button className="nuve-dark-button nuve-pay-disabled" disabled>AGUARDANDO CONFIGURAÇÃO DO PAGAMENTO</button>
              </form>
            </section>
            <aside className="nuve-order-summary">
              <ShoppingBag size={22} /><h2>Resumo do pedido</h2><p>Seu carrinho é mantido no dispositivo. A versão final conectará esta etapa aos pedidos, estoque e pagamentos no Supabase.</p>
              <div className="nuve-summary-note"><MapPin size={16} /><span>Frete não foi inventado: será exibido quando a regra oficial estiver configurada.</span></div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
