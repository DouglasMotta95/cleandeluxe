import { createFileRoute } from "@tanstack/react-router";
import { NuveAdminSection } from "@/components/admin/NuveAdminSection";

export const Route = createFileRoute("/_authenticated/admin/disponibilidade")({ component: () => <NuveAdminSection kind="promotions" /> });
