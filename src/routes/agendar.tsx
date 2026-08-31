import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/agendar")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});
