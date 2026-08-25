import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ptBR } from "date-fns/locale";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAppointments } from "@/lib/admin";
import { fetchBlockedDates } from "@/lib/booking";
import { STATUS_LABEL, formatDateBR, hhmm, toISODate } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/calendario")({
  component: CalendarioPage,
});

function CalendarioPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data, isLoading } = useQuery({ queryKey: ["appointments"], queryFn: fetchAppointments });
  const blockedQuery = useQuery({ queryKey: ["blocked-dates"], queryFn: fetchBlockedDates });

  const iso = date ? toISODate(date) : null;
  const dayList = (data ?? []).filter((a) => a.appointment_date === iso);
  const busyDays = new Set((data ?? []).filter((a) => a.status !== "cancelled").map((a) => a.appointment_date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Calendário</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visualize os atendimentos por dia.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="rounded-2xl border border-border bg-card p-4">
          {isLoading ? (
            <Skeleton className="h-72 w-72" />
          ) : (
            <Calendar
              mode="single"
              locale={ptBR}
              selected={date}
              onSelect={setDate}
              modifiers={{
                busy: (d) => busyDays.has(toISODate(d)),
                blocked: (d) =>
                  (blockedQuery.data ?? []).some((b) => b.blocked_date === toISODate(d)),
              }}
              modifiersClassNames={{
                busy: "font-bold text-primary underline",
                blocked: "line-through opacity-60",
              }}
            />
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Dias em destaque possuem atendimentos. Dias riscados estão bloqueados.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-lg">{iso ? formatDateBR(iso) : "Selecione um dia"}</h2>
          </div>
          {dayList.length === 0 ? (
            <p className="px-5 py-6 text-sm text-muted-foreground">Nenhum atendimento neste dia.</p>
          ) : (
            <ul className="divide-y divide-border">
              {dayList.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm">
                  <span className="font-medium">{hhmm(a.appointment_time)}</span>
                  <span>{a.customer_name}</span>
                  <span className="text-muted-foreground">{a.service_name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {STATUS_LABEL[a.status]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
