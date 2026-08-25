import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ptBR } from "date-fns/locale";
import { CalendarDays, CheckCircle2, Clock, Loader2, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero, SiteLayout } from "@/components/site/SiteLayout";
import { serviceImage } from "@/components/site/ServiceCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { fetchAvailability, fetchBlockedDates, fetchPublicServices, fetchSlotsForDate } from "@/lib/booking";
import { formatDateBR, toISODate, waBookingMessage, whatsappLink } from "@/lib/site";

const TITLE = "Agendar Limpeza | Clean Deluxe Indaiatuba";
const DESCRIPTION =
  "Agende online o seu serviço de limpeza com a Clean Deluxe: escolha o serviço, a data e um horário disponível em Indaiatuba e região.";

export const Route = createFileRoute("/agendar")({
  validateSearch: (search: Record<string, unknown>) => ({
    servico: typeof search["servico"] === "string" ? (search["servico"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgendarPage,
});

const formSchema = z.object({
  customer_name: z.string().trim().min(3, "Informe o nome completo").max(120),
  customer_phone: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20, "Telefone muito longo"),
  customer_email: z.string().trim().email("E-mail inválido").max(160),
  address_street: z.string().trim().min(3, "Informe o endereço").max(160),
  address_number: z.string().trim().min(1, "Informe o número").max(20),
  address_complement: z.string().trim().max(80).optional(),
  neighborhood: z.string().trim().min(2, "Informe o bairro").max(80),
  city: z.string().trim().min(2, "Informe a cidade").max(80),
  notes: z.string().trim().max(600).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EMPTY: FormValues = {
  customer_name: "",
  customer_phone: "",
  customer_email: "",
  address_street: "",
  address_number: "",
  address_complement: "",
  neighborhood: "",
  city: "",
  notes: "",
};

function AgendarPage() {
  const { servico } = Route.useSearch();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState<FormValues>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<null | {
    service: string;
    date: string;
    time: string;
    address: string;
  }>(null);

  const servicesQuery = useQuery({ queryKey: ["services", "public"], queryFn: fetchPublicServices });
  const availabilityQuery = useQuery({ queryKey: ["availability"], queryFn: fetchAvailability });
  const blockedQuery = useQuery({ queryKey: ["blocked-dates"], queryFn: fetchBlockedDates });

  const bookable = useMemo(
    () => (servicesQuery.data ?? []).filter((s) => s.show_in_booking),
    [servicesQuery.data],
  );

  const selectedService = useMemo(() => {
    const preset = servico ? bookable.find((s) => s.slug === servico) : undefined;
    return bookable.find((s) => s.id === serviceId) ?? preset ?? null;
  }, [bookable, serviceId, servico]);

  const isoDate = date ? toISODate(date) : null;

  const slotsQuery = useQuery({
    queryKey: ["slots", isoDate],
    queryFn: () => fetchSlotsForDate(isoDate as string),
    enabled: !!isoDate,
  });

  const activeWeekdays = useMemo(
    () => new Set((availabilityQuery.data ?? []).filter((a) => a.is_active).map((a) => a.weekday)),
    [availabilityQuery.data],
  );
  const blockedSet = useMemo(
    () => new Set((blockedQuery.data ?? []).map((b) => b.blocked_date)),
    [blockedQuery.data],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!selectedService || !isoDate || !time) throw new Error("Complete as etapas anteriores.");
      const parsed = formSchema.parse(form);
      const { error } = await supabase.from("appointments").insert({
        service_id: selectedService.id,
        service_name: selectedService.name,
        customer_name: parsed.customer_name,
        customer_phone: parsed.customer_phone,
        customer_email: parsed.customer_email,
        appointment_date: isoDate,
        appointment_time: time,
        address_street: parsed.address_street,
        address_number: parsed.address_number,
        address_complement: parsed.address_complement || null,
        neighborhood: parsed.neighborhood,
        city: parsed.city,
        notes: parsed.notes || null,
        status: "pending",
        consent_accepted: true,
      });
      if (error) {
        if (error.code === "23505") throw new Error("Horário indisponível. Escolha outro horário.");
        throw new Error("Não foi possível registrar o agendamento. Tente novamente.");
      }
      return {
        service: selectedService.name,
        date: formatDateBR(isoDate),
        time,
        address: `${parsed.address_street}, ${parsed.address_number}${
          parsed.address_complement ? ` - ${parsed.address_complement}` : ""
        } — ${parsed.neighborhood}, ${parsed.city}`,
      };
    },
    onSuccess: (data) => {
      setConfirmed(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (err: Error) => {
      toast.error(err.message);
      slotsQuery.refetch();
    },
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = formSchema.safeParse(form);
    if (!result.success) {
      const map: Record<string, string> = {};
      for (const issue of result.error.issues) map[String(issue.path[0])] = issue.message;
      setErrors(map);
      toast.error("Verifique os campos destacados.");
      return;
    }
    if (!consent) {
      toast.error("É necessário aceitar a Política de Privacidade.");
      return;
    }
    setErrors({});
    mutation.mutate();
  }

  if (confirmed) {
    return (
      <SiteLayout>
        <section className="py-16 md:py-24">
          <div className="cd-container max-w-2xl">
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm md:p-12">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <h1 className="mt-6 text-3xl">Agendamento solicitado!</h1>
              <p className="mt-3 text-muted-foreground">
                Agendamento solicitado com sucesso. A Clean Deluxe fará a confirmação do atendimento
                pelo contato informado.
              </p>

              <dl className="mt-8 space-y-3 rounded-2xl bg-secondary/60 p-6 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Serviço</dt>
                  <dd className="text-right font-medium">{confirmed.service}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Data</dt>
                  <dd className="text-right font-medium">{confirmed.date}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Horário</dt>
                  <dd className="text-right font-medium">{confirmed.time}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Endereço</dt>
                  <dd className="text-right font-medium">{confirmed.address}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="text-right font-medium">Pendente de confirmação</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3">
                <Button asChild size="lg">
                  <a
                    href={whatsappLink(
                      waBookingMessage(confirmed.service, confirmed.date, confirmed.time),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-5 w-5" /> Falar com a Clean Deluxe pelo WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Voltar para o início</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Agendamento online"
        title="Agendar limpeza"
        description="Escolha o serviço, a data e um horário disponível. A solicitação é registrada na agenda da Clean Deluxe."
      />

      <section className="py-12 md:py-16">
        <div className="cd-container grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            {/* 1 - serviço */}
            <div>
              <Step n={1} title="Escolha o serviço" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {servicesQuery.isLoading
                  ? [0, 1].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
                  : bookable.map((s) => {
                      const active = selectedService?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setServiceId(s.id);
                            setTime(null);
                          }}
                          className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-colors ${
                            active
                              ? "border-primary bg-secondary"
                              : "border-border bg-card hover:border-primary/50"
                          }`}
                        >
                          <img
                            src={serviceImage(s)}
                            alt=""
                            loading="lazy"
                            width={1200}
                            height={900}
                            className="h-16 w-20 shrink-0 rounded-lg object-cover"
                          />
                          <span>
                            <span className="block font-medium">{s.name}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              Duração aproximada: {Math.round(s.duration_minutes / 60)}h
                            </span>
                          </span>
                        </button>
                      );
                    })}
              </div>
            </div>

            {/* 2 - data */}
            <div>
              <Step n={2} title="Escolha a data" />
              <div className="mt-4 rounded-2xl border border-border bg-card p-3 sm:p-5">
                <Calendar
                  mode="single"
                  locale={ptBR}
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setTime(null);
                  }}
                  disabled={(d) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (d < today) return true;
                    if (blockedSet.has(toISODate(d))) return true;
                    return !activeWeekdays.has(d.getDay());
                  }}
                  className="mx-auto"
                />
              </div>
            </div>

            {/* 3 - horário */}
            <div>
              <Step n={3} title="Escolha o horário" />
              <div className="mt-4">
                {!isoDate && (
                  <p className="text-sm text-muted-foreground">Selecione uma data para ver os horários.</p>
                )}
                {isoDate && slotsQuery.isLoading && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-10 rounded-lg" />
                    ))}
                  </div>
                )}
                {isoDate && !slotsQuery.isLoading && (slotsQuery.data?.length ?? 0) === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Não há horários disponíveis nesta data. Escolha outra data.
                  </p>
                )}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {slotsQuery.data?.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setTime(slot.time)}
                      title={slot.available ? undefined : "Horário indisponível"}
                      className={`rounded-lg border px-2 py-2.5 text-sm transition-colors ${
                        time === slot.time
                          ? "border-primary bg-primary text-primary-foreground"
                          : slot.available
                            ? "border-border bg-card hover:border-primary"
                            : "cursor-not-allowed border-dashed border-border bg-muted text-muted-foreground line-through"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                {isoDate && slotsQuery.data?.some((s) => !s.available) && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Horários riscados estão indisponíveis.
                  </p>
                )}
              </div>
            </div>

            {/* 4 - dados */}
            <div>
              <Step n={4} title="Seus dados" />
              <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={submit} noValidate>
                <Field
                  id="customer_name"
                  label="Nome completo"
                  className="sm:col-span-2"
                  value={form.customer_name}
                  error={errors["customer_name"]}
                  onChange={(v) => setForm({ ...form, customer_name: v })}
                />
                <Field
                  id="customer_phone"
                  label="WhatsApp"
                  placeholder="(19) 99999-9999"
                  value={form.customer_phone}
                  error={errors["customer_phone"]}
                  onChange={(v) => setForm({ ...form, customer_phone: v })}
                />
                <Field
                  id="customer_email"
                  label="E-mail"
                  type="email"
                  value={form.customer_email}
                  error={errors["customer_email"]}
                  onChange={(v) => setForm({ ...form, customer_email: v })}
                />
                <Field
                  id="address_street"
                  label="Endereço"
                  className="sm:col-span-2"
                  value={form.address_street}
                  error={errors["address_street"]}
                  onChange={(v) => setForm({ ...form, address_street: v })}
                />
                <Field
                  id="address_number"
                  label="Número"
                  value={form.address_number}
                  error={errors["address_number"]}
                  onChange={(v) => setForm({ ...form, address_number: v })}
                />
                <Field
                  id="address_complement"
                  label="Complemento (opcional)"
                  value={form.address_complement ?? ""}
                  error={errors["address_complement"]}
                  onChange={(v) => setForm({ ...form, address_complement: v })}
                />
                <Field
                  id="neighborhood"
                  label="Bairro"
                  value={form.neighborhood}
                  error={errors["neighborhood"]}
                  onChange={(v) => setForm({ ...form, neighborhood: v })}
                />
                <Field
                  id="city"
                  label="Cidade"
                  value={form.city}
                  error={errors["city"]}
                  onChange={(v) => setForm({ ...form, city: v })}
                />

                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    className="mt-1.5"
                    rows={4}
                    maxLength={600}
                    value={form.notes ?? ""}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2 rounded-xl border border-border bg-secondary/50 p-4">
                  <p className="text-xs text-muted-foreground">
                    Os dados informados são utilizados apenas para organizar e executar este
                    atendimento, conforme a Lei Geral de Proteção de Dados.
                  </p>
                  <div className="mt-3 flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                    />
                    <Label htmlFor="consent" className="text-sm leading-snug font-normal">
                      Li e concordo com a{" "}
                      <Link to="/privacidade" className="text-primary underline">
                        Política de Privacidade
                      </Link>
                      .
                    </Label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={!selectedService || !isoDate || !time || !consent || mutation.isPending}
                  >
                    {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirmar agendamento
                  </Button>
                  {(!selectedService || !isoDate || !time) && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Selecione serviço, data e horário para concluir.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* resumo */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-sm tracking-[0.2em] uppercase text-primary">Resumo</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Serviço:</span>
                  <span className="ml-auto font-medium">{selectedService?.name ?? "—"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Data:</span>
                  <span className="ml-auto font-medium">{isoDate ? formatDateBR(isoDate) : "—"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Horário:</span>
                  <span className="ml-auto font-medium">{time ?? "—"}</span>
                </li>
              </ul>
              <p className="mt-5 text-xs text-muted-foreground">
                O agendamento é registrado como pendente e confirmado pela Clean Deluxe.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-3 text-xl">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm text-primary-foreground">
        {n}
      </span>
      {title}
    </h2>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5"
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
