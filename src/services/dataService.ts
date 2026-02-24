import * as XLSX from "xlsx";
import {
  StoreData,
  BusinessInfo,
  MenuItem,
  OpeningHours,
} from "../types/store";

// ============================================================================
// Utility / Helper Functions
// ============================================================================

/**
 * Robust helper to extract data from a sheet while filtering out empty rows.
 */
const getSheetValidData = (
  workbook: XLSX.WorkBook,
  name: string,
  options: XLSX.Sheet2JSONOpts = {},
): any[] | null => {
  const sheet = workbook.Sheets[name];
  if (!sheet) {
    if (["Loja", "Config", "Cardápio", "Cardapio"].includes(name)) {
      console.warn(`Section "${name}" not found.`);
    }
    return null;
  }

  let data = XLSX.utils.sheet_to_json(sheet, options) as any[];

  // Filter out truly empty rows
  if (options.header === 1) {
    data = data.filter(
      (row) =>
        Array.isArray(row) &&
        row.some(
          (cell) =>
            cell !== undefined && cell !== null && String(cell).trim() !== "",
        ),
    );
  } else {
    data = data.filter((row) =>
      Object.values(row).some(
        (val) =>
          val !== undefined &&
          val !== null &&
          String(val).trim() !== "" &&
          (val as any) !== row.__rowNum__,
      ),
    );
  }

  console.log(`Section "${name}" loaded with ${data.length} valid entries.`);
  return data;
};

// ============================================================================
// Parsing: Business Info
// ============================================================================

const BUSINESS_KEY_MAP: Record<string, keyof BusinessInfo> = {
  Nome: "name",
  "Nome Secundário": "tagline",
  Descrição: "description",
  Telefone: "phone",
  Instagram: "instagram",
  Ifood: "ifood",
  "99Food": "food99",
  GooglePlaceId: "googlePlaceId",
  "Cor Primária": "primaryColor",
  "Cor Secundária": "secondaryColor",
  Logo: "logo",
  Favicon: "favicon",
  Keywords: "keywords",
  "Palavras-Chave": "keywords",
  "Palavras-chave": "keywords",
  Descricao: "description",
  "Título Social": "ogTitle",
  "Titulo Social": "ogTitle",
  "Descrição Social": "ogDescription",
  "Descricao Social": "ogDescription",
  "Link Canônico": "canonicalUrl",
};

/**
 * Maps business settings from raw rows. (Key-Value format)
 */
const parseBusinessInfo = (rows: any[] | null): BusinessInfo => {
  const business: Partial<BusinessInfo> = {};

  if (!rows) return business as BusinessInfo;

  rows.forEach((row) => {
    if (!Array.isArray(row) || row.length < 2) return;

    const rawKey = String(row[0]).trim();
    const key = BUSINESS_KEY_MAP[rawKey] || rawKey;

    const value =
      row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : "";

    // Skip header rows (e.g., "Nome" | "Valor" | "Uso")
    if (
      rawKey === "Nome" &&
      (value === "Valor" || value === "Conteúdo" || value === "Uso")
    )
      return;
    if (rawKey === "Informações de SEO") return;

    if (key) {
      (business as any)[key] = value;
    }
  });

  return business as BusinessInfo;
};

// ============================================================================
// Parsing: Menu
// ============================================================================

const findMenuHeaderIndex = (rows: any[]): number => {
  return rows.findIndex(
    (row) =>
      Array.isArray(row) &&
      row.some(
        (cell) =>
          cell && ["Nome", "name", "item"].includes(String(cell).trim()),
      ),
  );
};

const parsePrice = (rawPrice: any): number => {
  if (!rawPrice) return 0;
  if (typeof rawPrice === "number") return rawPrice;
  if (typeof rawPrice === "string") {
    const parsed = parseFloat(
      rawPrice.replace(/[R$\s.]/g, "").replace(",", "."),
    );
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const parseIsHighlight = (rawHighlight: any): boolean => {
  if (!rawHighlight) return false;
  if (rawHighlight === true) return true;
  return ["true", "sim", "x"].includes(String(rawHighlight).toLowerCase());
};

const parseOptions = (rawOptions: any): any => {
  if (!rawOptions) return null;
  if (typeof rawOptions === "string") {
    try {
      return JSON.parse(rawOptions);
    } catch {
      return rawOptions;
    }
  }
  return rawOptions;
};

/**
 * Maps menu items from raw rows using a robust header detection.
 */
const parseMenu = (rows: any[] | null): MenuItem[] => {
  if (!rows || rows.length === 0) return [];

  const headerIndex = findMenuHeaderIndex(rows);
  if (headerIndex === -1) return [];

  const headers = (rows[headerIndex] as any[]).map((h) =>
    String(h || "").trim(),
  );
  const dataRows = rows.slice(headerIndex + 1);

  return dataRows
    .map((row, index) => {
      // 1. Map row array to an object using headers
      const itemData: Record<string, any> = {};
      headers.forEach((header, i) => {
        if (header) itemData[header] = row[i];
      });

      // 2. Extract values with fallbacks for different language variations
      const rawPrice = itemData.Preço || itemData.price;
      const rawHighlight = itemData.Destaque || itemData.isHighlight;
      const rawOptions = itemData.options;

      const mappedItem: MenuItem = {
        id: itemData.ID || itemData.id || index + 1,
        name: itemData.Nome || itemData.name,
        description:
          itemData.Descrição || itemData.description || itemData.Descripción,
        price: parsePrice(rawPrice),
        category: itemData.Categoria || itemData.category,
        image: itemData.Imagem || itemData.image,
        isHighlight: parseIsHighlight(rawHighlight),
        options: parseOptions(rawOptions),
      };

      return mappedItem;
    })
    .filter((item) => item.name); // Filter out empty or invalid items
};

// ============================================================================
// Parsing: Opening Hours
// ============================================================================

const parseTimeRangeStr = (val: any): string => {
  if (val === undefined || val === null || val === "") return "";

  if (typeof val === "number") {
    // Convert Excel time fraction to HH:mm
    const totalMinutes = Math.round(val * 24 * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const str = String(val).trim();
  if (str.includes(":")) {
    const parts = str.split(":");
    return `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
  }

  return str;
};

const DAY_MAP: Record<string, number> = {
  domingo: 0,
  "segunda-feira": 1,
  "terça-feira": 2,
  "quarta-feira": 3,
  "quinta-feira": 4,
  "sexta-feira": 5,
  sábado: 6,
  segunda: 1,
  terca: 2,
  terça: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

/**
 * Maps opening hours from raw rows.
 */
const parseOpeningHours = (rows: any[] | null): OpeningHours[] => {
  const openingHoursMap: Record<number, OpeningHours> = {};

  if (!rows) return [];

  rows.forEach((row) => {
    if (!Array.isArray(row) || row.length < 2 || row[0] === "Dia") return;

    const rawDay = String(row[0]).toLowerCase();
    const day =
      DAY_MAP[rawDay] !== undefined ? DAY_MAP[rawDay] : parseInt(rawDay);

    if (isNaN(day)) return;

    if (!openingHoursMap[day]) {
      openingHoursMap[day] = { day, ranges: [] };
    }

    if (row[1] !== undefined && row[2] !== undefined) {
      const open = parseTimeRangeStr(row[1]);
      const close = parseTimeRangeStr(row[2]);
      if (open && close) {
        openingHoursMap[day].ranges.push({ open, close });
      }
    }
  });

  return Object.values(openingHoursMap);
};

// ============================================================================
// Main Exported Service
// ============================================================================

/**
 * Main function to fetch and orchestrate store data mapping.
 */
export const fetchStoreData = async (url: string): Promise<StoreData> => {
  if (!url) throw new Error("Google Sheets URL not provided");

  console.groupCollapsed(`[DataService] Sync Complete`);

  try {
    const timestamp = new Date().getTime();
    const fetchUrl = url.includes("?")
      ? `${url}&t=${timestamp}`
      : `${url}?t=${timestamp}`;

    const response = await fetch(fetchUrl, {
      credentials: "omit",
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Connection failed: ${response.status} ${response.statusText}`,
      );
    }

    console.log("Remote data source connected (Fresh sync).");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Try finding sheets by various known names
    const getSheet = (names: string[]) => {
      for (const name of names) {
        const data = getSheetValidData(workbook, name, { header: 1 });
        if (data) return data;
      }
      return null;
    };

    const configRows = getSheet(["Loja", "Config"]);
    const menuRows = getSheet(["Cardápio", "Cardapio"]);
    const hoursRows = getSheet([
      "Horários de Funcionamento",
      "Horarios de Funcionamento",
      "Horários",
      "Horarios",
    ]);
    const seoRows = getSheet(["SEO"]);

    const business = parseBusinessInfo(configRows);
    if (seoRows) {
      const seoInfo = parseBusinessInfo(seoRows);
      // Transfer SEO description to a separate field to avoid overwriting the UI description
      if (seoInfo.description) {
        business.seoDescription = seoInfo.description;
        delete (seoInfo as any).description;
      }
      Object.assign(business, seoInfo);
    }
    const menu = parseMenu(menuRows);
    const openingHours = parseOpeningHours(hoursRows);

    console.log(`Total mapped items: ${menu.length}`);
    console.groupEnd();

    return { business, menu, openingHours };
  } catch (error: any) {
    console.groupEnd();
    // Next.js dynamic usage signals are not real errors to be logged in production build
    if (
      error?.digest !== "DYNAMIC_SERVER_USAGE" &&
      error?.message !== "Dynamic server usage"
    ) {
      console.error("[DataService] Error in fetchStoreData:", error);
    }
    throw error;
  }
};
