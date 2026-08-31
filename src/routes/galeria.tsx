import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/galeria")({
  beforeLoad: () => { throw redirect({ to: "/" }); },
});
