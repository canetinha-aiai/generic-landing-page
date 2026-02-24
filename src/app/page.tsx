import type { Metadata } from "next";
import { buildMetadata } from "@/src/lib/metadata";
import { getData } from "@/src/lib/getData";
import HomePageClient from "@/src/components/HomePageClient";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return buildMetadata(data?.business);
}

export default async function HomePage() {
  const data = await getData();
  return <HomePageClient initialData={data} />;
}
