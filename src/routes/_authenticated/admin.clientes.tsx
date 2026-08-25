import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAppointments } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["appointments"], queryFn: fetchAppointments });

  const clients = useMemo(() => {
    const map = new Map<
      string,
      { name: string; phone: string; email: string; city: string; count: number }
    >();
    for (const a of data ?? []) {
      const key = a.customer_email.toLowerCase();
      const current = map.get(key);
      if (current) current.count += 1;
      else
        map.set(key, {
          name: a.customer_name,
          phone: a.customer_phone,
          email: a.customer_email,
          city: a.city,
          count: 1,
        });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl">Clientes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lista gerada a partir dos agendamentos. Informação restrita à administração.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : clients.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Nenhum cliente registrado ainda.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead className="text-right">Agendamentos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.email}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.city}</TableCell>
                  <TableCell className="text-right">{c.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
