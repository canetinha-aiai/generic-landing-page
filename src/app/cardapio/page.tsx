import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/metadata";
import { getData } from "@/src/lib/getData";
import MenuPageClient from "@/src/components/MenuPageClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return buildMetadata(data?.business, "Cardápio");
}

export default async function CardapioPage() {
  const data = await getData();
  return <MenuPageClient initialData={data} />;
}
