import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAppointments, updateAppointmentStatus, type Appointment } from "@/lib/admin";
import { STATUS_LABEL, formatDateBR, hhmm, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/agendamentos")({
  component: AgendamentosPage,
});

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

function statusVariant(status: string) {
  if (status === "confirmed") return "default" as const;
  if (status === "completed") return "secondary" as const;
  if (status === "cancelled") return "destructive" as const;
  return "outline" as const;
}

function AgendamentosPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [detail, setDetail] = useState<Appointment | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["appointments"], queryFn: fetchAppointments });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment["status"] }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      toast.success("Status atualizado.");
      qc.invalidateQueries({ queryKey: ["appointments"] });
      setDetail(null);
    },
    onError: () => toast.error("Não foi possível atualizar o status."),
  });

  const list = (data ?? []).filter((a) => (filter === "all" ? true : a.status === filter));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Agendamentos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirme, conclua ou cancele os atendimentos solicitados.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button key={f} size="sm" variant={f === filter ? "default" : "outline"} onClick={() => setFilter(f)}>
            {f === "all" ? "Todos" : STATUS_LABEL[f]}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : list.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum agendamento nesta visualização.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((a) => (
            <article key={a.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg">{a.customer_name}</h2>
                  <p className="text-sm text-muted-foreground">{a.service_name}</p>
                </div>
                <Badge variant={statusVariant(a.status)}>{STATUS_LABEL[a.status]}</Badge>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Row label="Data" value={formatDateBR(a.appointment_date)} />
                <Row label="Horário" value={hhmm(a.appointment_time)} />
                <Row label="Telefone" value={a.customer_phone} />
                <Row label="Cidade" value={a.city} />
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Endereço</dt>
                  <dd>
                    {a.address_street}, {a.address_number}
                    {a.address_complement ? ` - ${a.address_complement}` : ""} — {a.neighborhood},{" "}
                    {a.city}
                  </dd>
                </div>
                {a.notes && (
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Observações</dt>
                    <dd>{a.notes}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setDetail(a)} variant="outline">
                  Detalhes
                </Button>
                {a.status !== "confirmed" && a.status !== "completed" && (
                  <Button
                    size="sm"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: a.id, status: "confirmed" })}
                  >
                    Confirmar
                  </Button>
                )}
                {a.status !== "completed" && a.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: a.id, status: "completed" })}
                  >
                    Concluir
                  </Button>
                )}
                {a.status !== "cancelled" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: a.id, status: "cancelled" })}
                  >
                    Cancelar
                  </Button>
                )}
                {a.status === "cancelled" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: a.id, status: "pending" })}
                  >
                    Reabrir
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do agendamento</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-2 text-sm">
              <Row label="Cliente" value={detail.customer_name} />
              <Row label="Telefone" value={detail.customer_phone} />
              <Row label="E-mail" value={detail.customer_email} />
              <Row label="Serviço" value={detail.service_name} />
              <Row label="Data" value={formatDateBR(detail.appointment_date)} />
              <Row label="Horário" value={hhmm(detail.appointment_time)} />
              <Row
                label="Endereço"
                value={`${detail.address_street}, ${detail.address_number}${
                  detail.address_complement ? ` - ${detail.address_complement}` : ""
                } — ${detail.neighborhood}, ${detail.city}`}
              />
              <Row label="Observações" value={detail.notes || "—"} />
              <Row label="Status" value={STATUS_LABEL[detail.status] ?? detail.status} />
              <Row label="Solicitado em" value={new Date(detail.created_at).toLocaleString("pt-BR")} />
              <Button asChild className="mt-3 w-full">
                <a
                  href={whatsappLink(
                    `Olá, ${detail.customer_name}! Aqui é a Clean Deluxe, sobre o seu agendamento de ${detail.service_name} em ${formatDateBR(detail.appointment_date)} às ${hhmm(detail.appointment_time)}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Falar com o cliente no WhatsApp
                </a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
