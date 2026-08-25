import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import residencial from "@/assets/servico-residencial.jpg";
import comercial from "@/assets/servico-comercial.jpg";
import posObra from "@/assets/servico-pos-obra.jpg";
import banheiro from "@/assets/galeria-banheiro.jpg";
import vidros from "@/assets/galeria-vidros.jpg";
import hero from "@/assets/hero-clean.jpg";
import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const TITLE = "Galeria | Clean Deluxe Limpeza Profissional";
const DESCRIPTION =
  "Galeria de ambientes da Clean Deluxe: limpeza residencial, comercial e pós-obra em Indaiatuba e região.";

export const Route = createFileRoute("/galeria")({
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
  component: GaleriaPage,
});

const CATEGORIES = ["Todos", "Residencial", "Comercial", "Pós-obra"] as const;

const ITEMS = [
  { src: hero, alt: "Sala de estar limpa com piso brilhante", cat: "Residencial" },
  { src: residencial, alt: "Cozinha e sala residenciais limpas e organizadas", cat: "Residencial" },
  { src: banheiro, alt: "Banheiro higienizado com box de vidro sem manchas", cat: "Residencial" },
  { src: comercial, alt: "Escritório comercial limpo e organizado", cat: "Comercial" },
  { src: posObra, alt: "Ambiente vazio limpo após obra", cat: "Pós-obra" },
  { src: vidros, alt: "Vidros e piso limpos após limpeza pós-obra", cat: "Pós-obra" },
];

function GaleriaPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [open, setOpen] = useState<null | (typeof ITEMS)[number]>(null);

  const visible = cat === "Todos" ? ITEMS : ITEMS.filter((i) => i.cat === cat);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Galeria"
        title="Ambientes que passaram por uma limpeza profissional"
        description="Referências visuais dos tipos de ambiente atendidos pela Clean Deluxe: residencial, comercial e pós-obra."
      />

      <section className="py-14 md:py-20">
        <div className="cd-container">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={c === cat ? "default" : "outline"}
                onClick={() => setCat(c)}
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setOpen(item)}
                className="group overflow-hidden rounded-2xl border border-border bg-muted focus:ring-2 focus:ring-ring focus:outline-none"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </button>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Imagens ilustrativas dos tipos de ambiente atendidos. Os trabalhos publicados pela
            empresa estão no Instagram oficial.
          </p>
        </div>
      </section>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{open?.alt ?? "Imagem"}</DialogTitle>
          {open && (
            <img src={open.src} alt={open.alt} width={1200} height={900} className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
