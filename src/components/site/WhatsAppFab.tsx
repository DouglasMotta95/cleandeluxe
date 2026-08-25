import { MessageCircle } from "lucide-react";

import { WA_GENERAL, whatsappLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink(WA_GENERAL)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Clean Deluxe pelo WhatsApp"
      className="fixed right-4 bottom-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 lg:hidden"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
