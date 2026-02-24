"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import {
  StoreData,
  BusinessInfo,
  MenuItem,
  OpeningHours,
} from "../types/store";

interface DataState extends StoreData {
  loading: boolean;
  error: string | null;
}

const defaultBusiness: BusinessInfo = { name: "", phone: "" };

const initialState: DataState = {
  business: defaultBusiness,
  menu: [],
  openingHours: [],
  loading: false,
  error: null,
};

const DataContext = createContext<DataState>(initialState);

interface DataProviderProps {
  children: ReactNode;
  initialData: StoreData | null;
}

export const DataProvider = ({ children, initialData }: DataProviderProps) => {
  const data: DataState = initialData
    ? { ...initialData, loading: false, error: null }
    : { ...initialState, error: "Erro ao carregar dados da planilha." };

  // ── Dynamic Theme Injection ──────────────────────────────────
  useEffect(() => {
    const primary = data.business?.primaryColor;
    if (!primary || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(primary)) return;

    const adjust = (hex: string, amount: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      let rr = r,
        gg = g,
        bb = b;
      if (amount > 0) {
        rr = Math.round(r + (255 - r) * amount);
        gg = Math.round(g + (255 - g) * amount);
        bb = Math.round(b + (255 - b) * amount);
      } else {
        rr = Math.round(r * (1 + amount));
        gg = Math.round(g * (1 + amount));
        bb = Math.round(b * (1 + amount));
      }
      return `#${rr.toString(16).padStart(2, "0")}${gg.toString(16).padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;
    };

    const root = document.documentElement;
    root.style.setProperty("--color-brand-50", adjust(primary, 0.92));
    root.style.setProperty("--color-brand-100", adjust(primary, 0.85));
    root.style.setProperty("--color-brand-200", adjust(primary, 0.7));
    root.style.setProperty("--color-brand-300", adjust(primary, 0.5));
    root.style.setProperty("--color-brand-400", adjust(primary, 0.25));
    root.style.setProperty("--color-brand-500", primary);
    root.style.setProperty("--color-brand-600", adjust(primary, -0.15));
    root.style.setProperty("--color-brand-700", adjust(primary, -0.3));
    root.style.setProperty("--color-brand-800", adjust(primary, -0.45));
    root.style.setProperty("--color-brand-900", adjust(primary, -0.6));

    localStorage.setItem("theme-primary-color", primary);
  }, [data.business?.primaryColor]);

  // ── Dynamic Favicon Injection ────────────────────────────────
  useEffect(() => {
    const faviconUrl = data.business?.favicon;
    const existingLinks = document.querySelectorAll(
      "link[rel~='icon'], link[rel='apple-touch-icon']",
    );
    if (faviconUrl) {
      if (existingLinks.length > 0) {
        existingLinks.forEach((link) => {
          (link as HTMLLinkElement).href = faviconUrl;
          link.removeAttribute("sizes");
          link.removeAttribute("type");
        });
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = faviconUrl;
        document.head.appendChild(newLink);
      }
    } else {
      existingLinks.forEach((link) => link.remove());
    }
  }, [data.business?.favicon]);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
