import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchStoreData } from "../services/dataService";
import { StoreData } from "../types/store";

interface DataState extends StoreData {
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  business: {
    name: "",
    phone: "",
  },
  menu: [],
  openingHours: [],
  loading: true,
  error: null,
};

const DataContext = createContext<DataState>(initialState);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DataState>(initialState);

  useEffect(() => {
    const loadDocsData = async () => {
      const baseUrl = import.meta.env.VITE_SHEET_BASE_URL;

      if (!baseUrl) {
        console.warn("VITE_SHEET_BASE_URL is missing. No data will be loaded.");
        setData((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const remoteData = await fetchStoreData(baseUrl);
        setData({
          ...remoteData,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Failed to load remote data:", err);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Erro ao carregar dados da planilha.",
        }));
      }
    };

    loadDocsData();
  }, []);

  // ── Dynamic Theme Injection ──────────────────────────────────
  useEffect(() => {
    const primary = data.business?.primaryColor;
    if (!primary || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(primary)) return;

    const root = document.documentElement;

    // Helper to adjust color (tints/shades)
    const adjust = (hex: string, amount: number) => {
      const rVal = parseInt(hex.slice(1, 3), 16);
      const gVal = parseInt(hex.slice(3, 5), 16);
      const bVal = parseInt(hex.slice(5, 7), 16);

      let r = rVal,
        g = gVal,
        b = bVal;

      if (amount > 0) {
        // Lighten
        r = Math.round(r + (255 - r) * amount);
        g = Math.round(g + (255 - g) * amount);
        b = Math.round(b + (255 - b) * amount);
      } else {
        // Darken
        r = Math.round(r * (1 + amount));
        g = Math.round(g * (1 + amount));
        b = Math.round(b * (1 + amount));
      }
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    };

    // Apply scale
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

    console.log("Brand theme applied from remote source:", primary);
  }, [data.business?.primaryColor]);

  // ── Dynamic Document Title ──────────────────────────────────
  useEffect(() => {
    const storeName = data.business?.name || "Doceria";
    if (data.loading) {
      document.title = "Carregando...";
    } else {
      document.title = storeName;
    }
  }, [data.business?.name, data.loading]);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
