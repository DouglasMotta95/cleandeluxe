import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});
