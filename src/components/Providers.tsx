"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/src/context/CartContext";
import { APIProvider } from "@vis.gl/react-google-maps";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <APIProvider
      apiKey={GOOGLE_API_KEY}
      libraries={["places"]}
      language="pt-BR"
    >
      <CartProvider>{children}</CartProvider>
    </APIProvider>
  );
}
