import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext, useRouter } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import checkoutCss from "../checkout.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.28em] uppercase text-muted-foreground">NUVE Advanced Skin Care</p>
        <h1 className="mt-3 text-7xl font-display">404</h1>
        <h2 className="mt-4 text-2xl font-display">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">O conteúdo que você procura não está disponível.</p>
        <Link to="/" className="mt-6 inline-flex min-h-11 items-center justify-center bg-primary px-6 text-xs font-semibold tracking-[0.15em] text-primary-foreground">VOLTAR À NUVE</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-display">Esta página não carregou</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte para a página inicial da NUVE.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="bg-primary px-4 py-2 text-sm text-primary-foreground">Tentar novamente</button>
          <a href="/" className="border border-input bg-background px-4 py-2 text-sm">Início</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NUVE Advanced Skin Care" },
      { name: "description", content: "Tecnologia japonesa, ativos selecionados e skincare para a vida real." },
      { name: "author", content: "NUVE Advanced Skin Care" },
      { property: "og:title", content: "NUVE Advanced Skin Care" },
      { property: "og:description", content: "Tecnologia japonesa. Ativos selecionados. Skincare para a vida real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: checkoutCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="pt-BR"><head><HeadContent /></head><body>{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;
}
