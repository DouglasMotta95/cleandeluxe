import { BadgePercent, Boxes, PackageSearch, Settings2, ShoppingBag, Users } from "lucide-react";

import { PRODUCTS, money } from "@/lib/nuve";

type Kind = "products" | "orders" | "stock" | "promotions" | "customers" | "settings";

const COPY: Record<Kind, { title: string; subtitle: string }> = {
  products: { title: "Produtos", subtitle: "Catálogo inicial da NUVE. Conteúdo e disponibilidade permanecem editáveis." },
  orders: { title: "Pedidos", subtitle: "Acompanhe os pedidos quando o checkout e o meio de pagamento estiverem ativos." },
  stock: { title: "Estoque", subtitle: "O estoque real será controlado por SKU. Nenhuma quantidade foi inventada." },
  promotions: { title: "Promoções", subtitle: "Regras comerciais configuráveis da loja." },
  customers: { title: "Clientes", subtitle: "Perfis e histórico de compras serão exibidos conforme os pedidos reais." },
  settings: { title: "Configurações", subtitle: "Canais oficiais, integrações e parâmetros da loja." },
};

export function NuveAdminSection({ kind }: { kind: Kind }) {
  const copy = COPY[kind];
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground">NUVE ADVANCED SKIN CARE</p>
        <h1 className="mt-2 text-3xl font-display">{copy.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{copy.subtitle}</p>
      </header>
      {kind === "products" && <Products />}
      {kind === "orders" && <Empty icon={ShoppingBag} title="Nenhum pedido ainda" text="Pedidos reais aparecerão aqui após a ativação do checkout." />}
      {kind === "stock" && <Stock />}
      {kind === "promotions" && <Promotions />}
      {kind === "customers" && <Empty icon={Users} title="Nenhum cliente ainda" text="A lista será alimentada por cadastros e pedidos reais." />}
      {kind === "settings" && <Settings />}
    </div>
  );
}

function Products() {
  return <div className="grid gap-4 lg:grid-cols-3">{PRODUCTS.map((p) => <article key={p.id} className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-semibold tracking-[.14em] text-muted-foreground">{p.shortName}</span><h2 className="mt-2 text-xl font-display">{p.name}</h2><p className="mt-2 text-sm text-muted-foreground">{p.eyebrow}</p><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><strong>{money(p.price)}</strong><span className="rounded-full bg-secondary px-2.5 py-1 text-xs">Cadastro inicial</span></div></article>)}</div>;
}

function Stock() {
  return <div className="rounded-2xl border border-border bg-card"><div className="border-b border-border px-5 py-4 text-sm font-medium">Controle por produto</div>{PRODUCTS.map((p) => <div key={p.id} className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4 last:border-0"><Boxes className="h-4 w-4 text-muted-foreground"/><strong className="min-w-48 text-sm">{p.name}</strong><span className="ml-auto text-sm text-muted-foreground">Quantidade pendente de configuração</span></div>)}</div>;
}

function Promotions() {
  return <div className="grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-border bg-card p-6"><BadgePercent className="h-6 w-6 text-primary"/><h2 className="mt-4 text-xl font-display">10% OFF em 2+</h2><p className="mt-2 text-sm text-muted-foreground">Regra inicial: 10% de desconto quando o carrinho tiver duas ou mais unidades elegíveis.</p><span className="mt-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs">Ativa na experiência da loja</span></article><article className="rounded-2xl border border-dashed border-border p-6"><h2 className="text-xl font-display">Cupons</h2><p className="mt-2 text-sm text-muted-foreground">Estrutura reservada para código, percentual ou valor fixo, pedido mínimo, vigência e limite de uso. Nenhum cupom fictício foi publicado.</p></article></div>;
}

function Settings() {
  return <div className="grid gap-4 md:grid-cols-2"><article className="rounded-2xl border border-border bg-card p-6"><Settings2 className="h-6 w-6 text-primary"/><h2 className="mt-4 text-xl font-display">Canais oficiais</h2><p className="mt-3 text-sm text-muted-foreground">Instagram: @nuve_serum</p><p className="mt-1 text-sm text-muted-foreground">TikTok: @nuveadvanced</p></article><article className="rounded-2xl border border-border bg-card p-6"><PackageSearch className="h-6 w-6 text-primary"/><h2 className="mt-4 text-xl font-display">Pagamentos e frete</h2><p className="mt-3 text-sm text-muted-foreground">Mercado Pago previsto para integração segura. Frete permanece sem valores ou regras inventadas até a configuração oficial.</p></article></div>;
}

function Empty({ icon: Icon, title, text }: { icon: typeof ShoppingBag; title: string; text: string }) {
  return <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center"><Icon className="h-7 w-7 text-muted-foreground"/><h2 className="mt-4 text-xl font-display">{title}</h2><p className="mt-2 max-w-md text-sm text-muted-foreground">{text}</p></div>;
}
