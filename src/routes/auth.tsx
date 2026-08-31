import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Acesso | NUVE Advanced Skin Care" }, { name: "description", content: "Área de acesso da NUVE Advanced Skin Care." }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/admin", replace: true }); }); }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin + "/admin" } });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin", replace: true });
        else { toast.success("Conta criada. Confirme o e-mail para continuar."); setMode("signin"); }
      }
    } catch (err) { toast.error(err instanceof Error ? err.message : "Não foi possível entrar."); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/50 px-4 py-12">
      <Link to="/" className="mb-8"><Logo /></Link>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">NUVE ADVANCED SKIN CARE</p>
        <h1 className="mt-2 text-3xl font-display">{mode === "signin" ? "Acesso à conta" : "Criar conta"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Acesso à área segura da NUVE.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
          <div><Label htmlFor="password">Senha</Label><Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}{mode === "signin" ? "Entrar" : "Criar conta"}</Button>
        </form>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-5 w-full text-center text-sm text-muted-foreground hover:text-primary">{mode === "signin" ? "Primeiro acesso? Criar conta" : "Já tenho conta. Entrar"}</button>
      </div>
      <Link to="/" className="mt-6 text-sm text-muted-foreground hover:text-primary">Voltar para a NUVE</Link>
    </div>
  );
}
