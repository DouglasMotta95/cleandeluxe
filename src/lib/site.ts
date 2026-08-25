export const SITE = {
  name: "Clean Deluxe",
  tagline: "Serviços profissionais de limpeza",
  region: "Indaiatuba e região",
  instagramHandle: "@clean_deluxee",
  instagramUrl: "https://www.instagram.com/clean_deluxee/",
  whatsappNumber: "+55 19 99302-7922",
  whatsappDigits: "5519993027922",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

export const WA_GENERAL =
  "Olá! Conheci a Clean Deluxe pelo site e gostaria de solicitar informações sobre os serviços de limpeza.";

export const WA_QUOTE =
  "Olá! Conheci a Clean Deluxe pelo site e gostaria de solicitar um orçamento de limpeza.";

export const WA_AFTER_BOOKING = "Olá! Acabei de realizar um agendamento pelo site da Clean Deluxe.";

export function waBookingMessage(service: string, date: string, time: string) {
  return `Olá! Acabei de solicitar um agendamento pelo site da Clean Deluxe.

Serviço: ${service}
Data: ${date}
Horário: ${time}

Gostaria de confirmar as informações.`;
}

export const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const;

export function formatDateBR(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function hhmm(time: string) {
  return time.slice(0, 5);
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
};
