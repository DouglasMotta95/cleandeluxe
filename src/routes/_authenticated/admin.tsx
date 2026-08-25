import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { isCurrentUserAdmin } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel | Clean Deluxe" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const MENU = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/agendamentos", label: "Agendamentos", icon: ClipboardList },
  { to: "/admin/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/admin/disponibilidade", label: "Disponibilidade", icon: CalendarDays },
  { to: "/admin/servicos", label: "Serviços", icon: Sparkles },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
] as const;

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const adminQuery = useQuery({ queryKey: ["is-admin"], queryFn: isCurrentUserAdmin });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {MENU.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          onClick={() => setOpen(false)}
          activeOptions={{ exact: "exact" in item ? item.exact : false }}
          activeProps={{ className: "bg-sidebar-accent text-sidebar-primary" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent"
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  if (adminQuery.isSuccess && !adminQuery.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl">Acesso restrito</h1>
        <p className="max-w-md text-muted-foreground">
          Esta conta não possui permissão de administradora da Clean Deluxe.
        </p>
        <Button onClick={signOut} variant="outline">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <div className="border-b border-sidebar-border px-5 py-5">
          <Logo inverted />
        </div>
        {nav}
        <div className="mt-auto p-3">
          <Button onClick={signOut} variant="ghost" className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon" aria-label="Abrir menu do painel">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar p-0">
                <SheetTitle className="sr-only">Menu do painel</SheetTitle>
                <div className="border-b border-sidebar-border px-5 py-5">
                  <Logo inverted />
                </div>
                {nav}
              </SheetContent>
            </Sheet>
            <span className="font-display text-sm tracking-[0.18em] uppercase text-muted-foreground">
              Painel administrativo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Ver site</Link>
            </Button>
            <Button onClick={signOut} variant="outline" size="sm" className="lg:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
