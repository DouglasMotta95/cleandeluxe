import { createFileRoute } from "@tanstack/react-router";

import { NuveShop } from "@/components/site/NuveShop";

const TITLE = "NUVE Advanced Skin Care | Tecnologia japonesa e ativos selecionados";
const DESCRIPTION =
  "NUVE Advanced Skin Care: formulações desenvolvidas no Japão, ativos selecionados e skincare pensado para a vida real.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NUVE Advanced Skin Care",
          sameAs: [
            "https://www.instagram.com/nuve_serum?igsi=MWF0eGxhdmp0MXloMg==",
            "https://www.tiktok.com/@nuveadvanced",
          ],
        }),
      },
    ],
  }),
  component: NuveShop,
});
