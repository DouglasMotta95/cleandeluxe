import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { fetchAvailability, fetchBlockedDates } from "@/lib/booking";
import { WEEKDAYS, formatDateBR, hhmm } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/disponibilidade")({
  component: DisponibilidadePage,
});

function DisponibilidadePage() {
  const qc = useQueryClient();
  const availability = useQuery({ queryKey: ["availability"], queryFn: fetchAvailability });
  const blocked = useQuery({ queryKey: ["blocked-dates"], queryFn: fetchBlockedDates });

  const [newDay, setNewDay] = useState({ weekday: 1, start: "08:00", end: "12:00", slot: 60 });
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["availability"] });
    qc.invalidateQueries({ queryKey: ["blocked-dates"] });
    qc.invalidateQueries({ queryKey: ["slots"] });
  };

  const addSlot = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("availability").insert({
        weekday: newDay.weekday,
        start_time: newDay.start,
        end_time: newDay.end,
        slot_minutes: newDay.slot,
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Horário adicionado.");
      refresh();
    },
    onError: () => toast.error("Não foi possível adicionar o horário."),
  });

  const toggleSlot = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("availability").update({ is_active: active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: () => toast.error("Não foi possível atualizar."),
  });

  const removeSlot = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Horário removido.");
      refresh();
    },
    onError: () => toast.error("Não foi possível remover."),
  });

  const addBlocked = useMutation({
    mutationFn: async () => {
      if (!blockDate) throw new Error("Informe a data.");
      const { error } = await supabase
        .from("blocked_dates")
        .insert({ blocked_date: blockDate, reason: blockReason || null });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Data bloqueada.");
      setBlockDate("");
      setBlockReason("");
      refresh();
    },
    onError: () => toast.error("Não foi possível bloquear a data."),
  });

  const removeBlocked = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blocked_dates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Data liberada.");
      refresh();
    },
    onError: () => toast.error("Não foi possível liberar a data."),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl">Disponibilidade</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          As alterações refletem imediatamente no agendamento público.
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg">Dias e horários de atendimento</h2>
        {availability.isLoading ? (
          <Skeleton className="mt-4 h-40 rounded-xl" />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {(availability.data ?? []).map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
                <span className="w-36 font-medium">{WEEKDAYS[row.weekday]}</span>
                <span className="text-muted-foreground">
                  {hhmm(row.start_time)} às {hhmm(row.end_time)} · intervalos de {row.slot_minutes} min
                </span>
                <div className="ml-auto flex items-center gap-3">
                  <Switch
                    checked={row.is_active}
                    onCheckedChange={(v) => toggleSlot.mutate({ id: row.id, active: v })}
                    aria-label="Ativar dia"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeSlot.mutate(row.id)} aria-label="Remover">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
            {(availability.data ?? []).length === 0 && (
              <li className="py-4 text-sm text-muted-foreground">Nenhum horário configurado.</li>
            )}
          </ul>
        )}

        <div className="mt-6 grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-5">
          <div>
            <Label htmlFor="weekday">Dia</Label>
            <select
              id="weekday"
              className="mt-1.5 h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
              value={newDay.weekday}
              onChange={(e) => setNewDay({ ...newDay, weekday: Number(e.target.value) })}
            >
              {WEEKDAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="start">Início</Label>
            <Input
              id="start"
              type="time"
              className="mt-1.5"
              value={newDay.start}
              onChange={(e) => setNewDay({ ...newDay, start: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="end">Fim</Label>
            <Input
              id="end"
              type="time"
              className="mt-1.5"
              value={newDay.end}
              onChange={(e) => setNewDay({ ...newDay, end: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="slot">Intervalo (min)</Label>
            <Input
              id="slot"
              type="number"
              min={30}
              step={30}
              className="mt-1.5"
              value={newDay.slot}
              onChange={(e) => setNewDay({ ...newDay, slot: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={() => addSlot.mutate()} disabled={addSlot.isPending}>
              Adicionar
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg">Datas bloqueadas</h2>
        {blocked.isLoading ? (
          <Skeleton className="mt-4 h-24 rounded-xl" />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {(blocked.data ?? []).map((b) => (
              <li key={b.id} className="flex items-center gap-3 py-3 text-sm">
                <span className="font-medium">{formatDateBR(b.blocked_date)}</span>
                <span className="text-muted-foreground">{b.reason ?? ""}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => removeBlocked.mutate(b.id)}
                >
                  Liberar
                </Button>
              </li>
            ))}
            {(blocked.data ?? []).length === 0 && (
              <li className="py-4 text-sm text-muted-foreground">Nenhuma data bloqueada.</li>
            )}
          </ul>
        )}

        <div className="mt-6 grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="blockDate">Data</Label>
            <Input
              id="blockDate"
              type="date"
              className="mt-1.5"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="blockReason">Motivo (opcional)</Label>
            <Input
              id="blockReason"
              className="mt-1.5"
              maxLength={120}
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={() => addBlocked.mutate()} disabled={addBlocked.isPending}>
              Bloquear data
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
