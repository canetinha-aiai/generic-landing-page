import type { Metadata } from "next";
import { BusinessInfo } from "@/src/types/store";

const FALLBACK_TITLE = "Nossa Loja";
const FALLBACK_DESCRIPTION =
  "Bem-vindo! Confira nosso cardápio e faça seu pedido.";

/**
 * Builds the Next.js Metadata from spreadsheet business info.
 * Pass `titlePrefix` for sub-pages, e.g. "Cardápio" → "Cardápio — Nome da Loja"
 */
export function buildMetadata(
  business: BusinessInfo | undefined,
  titlePrefix?: string,
): Metadata {
  const storeName = business?.name || FALLBACK_TITLE;
  const title = titlePrefix ? `${titlePrefix} — ${storeName}` : storeName;
  const description =
    business?.seoDescription || business?.description || FALLBACK_DESCRIPTION;

  const metadata: Metadata = {
    title,
    description,
    keywords: business?.keywords,
    openGraph: {
      title: business?.ogTitle || title,
      description: business?.ogDescription || description,
      locale: "pt_BR",
      type: "website",
    },
    alternates: {
      canonical: business?.canonicalUrl,
    },
  };

  if (business?.favicon) {
    metadata.icons = { icon: business.favicon, apple: business.favicon };
  }

  if (business?.logo && metadata.openGraph) {
    metadata.openGraph.images = [{ url: business.logo }];
  }

  return metadata;
}
