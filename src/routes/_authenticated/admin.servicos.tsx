import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllServices } from "@/lib/admin";
import type { ServiceRow } from "@/lib/booking";

export const Route = createFileRoute("/_authenticated/admin/servicos")({
  component: ServicosAdminPage,
});

type Draft = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  benefits: string;
  image_url: string;
  duration_minutes: number;
  sort_order: number;
};

const EMPTY: Draft = {
  slug: "",
  name: "",
  description: "",
  benefits: "",
  image_url: "",
  duration_minutes: 120,
  sort_order: 10,
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ServicosAdminPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["services", "admin"], queryFn: fetchAllServices });
  const [draft, setDraft] = useState<Draft | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["services"] });
  };

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        slug: d.slug || slugify(d.name),
        name: d.name.trim(),
        description: d.description.trim(),
        benefits: d.benefits
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean),
        image_url: d.image_url.trim() || null,
        duration_minutes: d.duration_minutes,
        sort_order: d.sort_order,
      };
      if (!payload.name) throw new Error("Informe o nome do serviço.");
      const { error } = d.id
        ? await supabase.from("services").update(payload).eq("id", d.id)
        : await supabase.from("services").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Serviço salvo.");
      setDraft(null);
      refresh();
    },
    onError: (e: Error) => toast.error(e.message || "Não foi possível salvar."),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: "is_active" | "show_in_booking"; value: boolean }) => {
      const { error } = await supabase.from("services").update({ [field]: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: () => toast.error("Não foi possível atualizar."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Serviço removido.");
      refresh();
    },
    onError: () => toast.error("Não foi possível remover o serviço."),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl">Serviços</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Controle o que aparece no site e no agendamento.
          </p>
        </div>
        <Button onClick={() => setDraft({ ...EMPTY })}>
          <Plus className="h-4 w-4" /> Novo serviço
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {((data ?? []) as ServiceRow[]).map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg">{s.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Remover serviço"
                  onClick={() => remove.mutate(s.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <Switch
                    checked={s.is_active}
                    onCheckedChange={(v) => toggle.mutate({ id: s.id, field: "is_active", value: v })}
                  />
                  Ativo no site
                </label>
                <label className="flex items-center gap-2">
                  <Switch
                    checked={s.show_in_booking}
                    onCheckedChange={(v) => toggle.mutate({ id: s.id, field: "show_in_booking", value: v })}
                  />
                  No agendamento
                </label>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={() =>
                  setDraft({
                    id: s.id,
                    slug: s.slug,
                    name: s.name,
                    description: s.description,
                    benefits: (s.benefits ?? []).join("\n"),
                    image_url: s.image_url ?? "",
                    duration_minutes: s.duration_minutes,
                    sort_order: s.sort_order,
                  })
                }
              >
                Editar
              </Button>
            </article>
          ))}
        </div>
      )}

      <Dialog open={!!draft} onOpenChange={(v) => !v && setDraft(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{draft?.id ? "Editar serviço" : "Novo serviço"}</DialogTitle>
          </DialogHeader>
          {draft && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  className="mt-1.5"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  className="mt-1.5"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                <Textarea
                  id="benefits"
                  className="mt-1.5"
                  rows={4}
                  value={draft.benefits}
                  onChange={(e) => setDraft({ ...draft, benefits: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image">URL da imagem (opcional)</Label>
                <Input
                  id="image"
                  className="mt-1.5"
                  placeholder="https://..."
                  value={draft.image_url}
                  onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={30}
                    step={30}
                    className="mt-1.5"
                    value={draft.duration_minutes}
                    onChange={(e) => setDraft({ ...draft, duration_minutes: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="order">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    className="mt-1.5"
                    value={draft.sort_order}
                    onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={() => save.mutate(draft)} disabled={save.isPending}>
                Salvar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
