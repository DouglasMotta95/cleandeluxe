import { createFileRoute } from "@tanstack/react-router";
import { NuveAdminSection } from "@/components/admin/NuveAdminSection";

export const Route = createFileRoute("/_authenticated/admin/servicos")({ component: () => <NuveAdminSection kind="products" /> });
