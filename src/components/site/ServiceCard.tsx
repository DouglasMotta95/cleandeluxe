import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ServiceRow } from "@/lib/booking";
import residencial from "@/assets/servico-residencial.jpg";
import comercial from "@/assets/servico-comercial.jpg";
import posObra from "@/assets/servico-pos-obra.jpg";

const FALLBACK: Record<string, string> = {
  "limpeza-residencial": residencial,
  "limpeza-comercial": comercial,
  "limpeza-pos-obra": posObra,
};

export function serviceImage(service: Pick<ServiceRow, "slug" | "image_url">) {
  return service.image_url || FALLBACK[service.slug] || residencial;
}

export function ServiceCard({ service }: { service: ServiceRow }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={serviceImage(service)}
          alt={`Ambiente após ${service.name.toLowerCase()}`}
          loading="lazy"
          width={1200}
          height={900}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl">{service.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
        {service.benefits.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm">
            {service.benefits.map((b) => (
              <li key={b} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 pt-2">
          <Button asChild className="w-full sm:w-auto" disabled={!service.show_in_booking}>
            <Link to="/agendar" search={{ servico: service.slug }}>
              Agendar
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
