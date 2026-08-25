import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchAppointments, type Appointment } from "@/lib/admin";
import { formatDateBR, hhmm, toISODate } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ["appointments"], queryFn: fetchAppointments });

  if (isLoading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const today = toISODate(new Date());
  const active = data.filter((a) => a.status !== "cancelled");
  const todayList = active.filter((a) => a.appointment_date === today);
  const upcoming = active.filter((a) => a.appointment_date > today);

  const cards = [
    { label: "📅 Agendamentos de hoje", value: todayList.length },
    { label: "📆 Próximos agendamentos", value: upcoming.length },
    { label: "⏳ Pendentes", value: data.filter((a) => a.status === "pending").length },
    { label: "✅ Confirmados", value: data.filter((a) => a.status === "confirmed").length },
    { label: "✔️ Concluídos", value: data.filter((a) => a.status === "completed").length },
    { label: "❌ Cancelados", value: data.filter((a) => a.status === "cancelled").length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral da agenda da Clean Deluxe.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <Section title="Hoje" list={todayList} empty="Nenhum atendimento para hoje." />
      <Section title="Próximos atendimentos" list={upcoming.slice(0, 8)} empty="Nenhum atendimento futuro." />
    </div>
  );
}

function Section({ title, list, empty }: { title: string; list: Appointment[]; empty: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-lg">{title}</h2>
        <Link to="/admin/agendamentos" className="text-sm text-primary hover:underline">
          Ver todos
        </Link>
      </div>
      {list.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y divide-border">
          {list.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 text-sm">
              <span className="font-medium">{hhmm(a.appointment_time)}</span>
              <span className="text-muted-foreground">{formatDateBR(a.appointment_date)}</span>
              <span>{a.customer_name}</span>
              <span className="text-muted-foreground">{a.service_name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {a.neighborhood}, {a.city}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
