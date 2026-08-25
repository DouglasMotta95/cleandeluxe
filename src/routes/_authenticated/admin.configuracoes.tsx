import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/configuracoes")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      toast.error("As senhas não conferem.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setPassword("");
    setConfirm("");
    toast.success("Senha alterada com sucesso.");
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Dados da conta administrativa.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg">Conta</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          E-mail de acesso: <span className="font-medium text-foreground">{email || "—"}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg">Alterar senha</h2>
        <form className="mt-4 space-y-4" onSubmit={changePassword}>
          <div>
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              className="mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirmar nova senha</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              className="mt-1.5"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Salvar nova senha
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg">Contatos publicados no site</h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>WhatsApp: {SITE.whatsappNumber}</li>
          <li>Instagram: {SITE.instagramHandle}</li>
          <li>Região atendida: {SITE.region}</li>
        </ul>
      </section>
    </div>
  );
}
