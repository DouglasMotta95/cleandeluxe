export const SITE = {
  name: "NUVE Advanced Skin Care",
  tagline: "Tecnologia japonesa. Ativos selecionados. Skincare para a vida real.",
  region: "Brasil",
  instagramHandle: "@nuve_serum",
  instagramUrl: "https://www.instagram.com/nuve_serum?igsi=MWF0eGxhdmp0MXloMg==",
  whatsappNumber: "",
  whatsappDigits: "",
} as const;

export function whatsappLink(message: string) {
  return SITE.whatsappDigits ? `https://wa.me/${SITE.whatsappDigits}?text=${encodeURIComponent(message)}` : "#contato";
}

export const WA_GENERAL = "Olá! Conheci a NUVE pelo site e gostaria de receber mais informações.";
export const WA_QUOTE = "Olá! Conheci a NUVE pelo site e gostaria de receber informações sobre os produtos.";
export const WA_AFTER_BOOKING = "Olá! Entrei em contato pelo site da NUVE.";

export function waBookingMessage(service: string, date: string, time: string) {
  return `Olá! Entrei em contato pelo site da NUVE.\n\nAssunto: ${service}\nData: ${date}\nHorário: ${time}`;
}

export const WEEKDAYS = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"] as const;

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

export function hhmm(time: string) { return time.slice(0, 5); }

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  completed: "Concluído",
  cancelled: "Cancelado",
};
