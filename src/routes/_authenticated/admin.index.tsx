import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgePercent, Boxes, PackageSearch, ShoppingBag } from "lucide-react";

import { PRODUCTS } from "@/lib/nuve";

export const Route = createFileRoute("/_authenticated/admin/")({ component: Dashboard });

function Dashboard() {
  const cards = [
    { label: "Produtos cadastrados", value: PRODUCTS.length, icon: PackageSearch, to: "/admin/servicos" as const },
    { label: "Pedidos reais", value: "—", icon: ShoppingBag, to: "/admin/agendamentos" as const },
    { label: "Estoque configurado", value: "Pendente", icon: Boxes, to: "/admin/calendario" as const },
    { label: "Promoção inicial", value: "10% OFF em 2+", icon: BadgePercent, to: "/admin/disponibilidade" as const },
  ];
  return (
    <div className="space-y-8">
      <div><p className="text-xs font-semibold tracking-[.18em] text-muted-foreground">NUVE ADVANCED SKIN CARE</p><h1 className="mt-2 text-3xl font-display">Dashboard</h1><p className="mt-2 text-sm text-muted-foreground">Visão geral da estrutura comercial da loja. Métricas de vendas só aparecem quando existirem dados reais.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((c) => <Link key={c.label} to={c.to} className="rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-sm"><c.icon className="h-5 w-5 text-primary"/><p className="mt-5 text-sm text-muted-foreground">{c.label}</p><p className="mt-2 text-2xl font-semibold">{c.value}</p></Link>)}</div>
      <div className="grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-display">Checklist para ativação</h2><div className="mt-5 space-y-3 text-sm text-muted-foreground"><p>• Definir estoque real por SKU</p><p>• Configurar regras oficiais de frete</p><p>• Inserir credenciais seguras do Mercado Pago no backend</p><p>• Aprovar políticas de troca, envio e atendimento</p><p>• Substituir conteúdos pendentes apenas por informações oficiais</p></div></section><section className="rounded-2xl border border-border bg-card p-6"><h2 className="text-xl font-display">Linha inicial</h2><div className="mt-4 space-y-3">{PRODUCTS.map((p) => <div key={p.id} className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0"><span>{p.name}</span><span className="text-muted-foreground">R$ 149,90</span></div>)}</div></section></div>
    </div>
  );
}
