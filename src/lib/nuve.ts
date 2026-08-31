export type NuveProduct = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  eyebrow: string;
  description: string;
  price: number;
  accent: "rose" | "blue" | "pearl";
  actives: string[];
  benefits: string[];
};

export const NUVE = {
  brand: "NUVE",
  fullName: "NUVE ADVANCED SKIN CARE",
  headline: "Tecnologia japonesa. Ativos selecionados. Skincare para a vida real.",
  intro:
    "A Nuve une a sofisticação do skincare japonês a fórmulas cuidadosamente desenvolvidas com ativos selecionados para transformar a rotina de cuidados com a pele em uma experiência simples, prática e especial.",
  differentiator: "FORMULAÇÕES DESENVOLVIDAS NO JAPÃO",
  differentiatorText:
    "Tecnologia e conhecimento em skincare traduzidos para uma rotina moderna de cuidados com a pele.",
  instagram: "https://www.instagram.com/nuve_serum?igsi=MWF0eGxhdmp0MXloMg==",
  tiktok: "https://www.tiktok.com/@nuveadvanced",
} as const;

export const PRODUCTS: NuveProduct[] = [
  {
    id: "nuve-5-em-1",
    name: "NUVE 5 EM 1",
    shortName: "5 EM 1",
    slug: "nuve-5-em-1",
    eyebrow: "Cinco ativos selecionados. Uma rotina prática.",
    description:
      "A combinação pensada para hidratar, cuidar e melhorar a aparência da pele, tornando a rotina diária mais prática e completa.",
    price: 149.9,
    accent: "rose",
    actives: [
      "Nano Colesterol",
      "Nano Ácido Hialurônico",
      "Nano Niacinamida",
      "Resveratrol",
      "Óleo de Rosa Mosqueta",
    ],
    benefits: ["Hidratação", "Cuidado da barreira", "Ação antioxidante", "Aparência saudável"],
  },
  {
    id: "nuve-ghk-cu",
    name: "NUVE GHK-Cu",
    shortName: "GHK-Cu",
    slug: "nuve-ghk-cu",
    eyebrow: "O poder dos peptídeos em uma fórmula sofisticada.",
    description:
      "Um dos peptídeos mais conhecidos da cosmética avançada, apresentado em uma proposta de cuidado sofisticada para a rotina diária.",
    price: 149.9,
    accent: "blue",
    actives: ["GHK-Cu", "Copper Tripeptide-1"],
    benefits: ["Aparência de firmeza", "Elasticidade", "Textura", "Cuidado antioxidante"],
  },
  {
    id: "nuve-pdrn",
    name: "NUVE PDRN + PEPTÍDEO DE COBRE",
    shortName: "PDRN",
    slug: "nuve-pdrn-peptideo-de-cobre",
    eyebrow: "Tecnologia avançada para uma rotina de skincare sofisticada.",
    description:
      "Uma combinação de ativos inspirada na nova geração do skincare para quem busca elevar a rotina de cuidados.",
    price: 149.9,
    accent: "pearl",
    actives: ["PDRN / Polydeoxyribonucleotide", "Peptídeo de Cobre"],
    benefits: ["Rotina sofisticada", "Ativos contemporâneos", "Cuidado cosmético", "Nova geração do skincare"],
  },
];

export const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
