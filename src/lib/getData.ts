import { cache } from "react";
import { fetchStoreData } from "@/src/services/dataService";
import { iFoodService } from "@/src/services/iFoodService";
import { StoreData } from "@/src/types/store";

/**
 * Fetches store data with request-level deduplication.
 * Prioritizes iFood for the menu if credentials are present.
 */
export const getData = cache(async (): Promise<StoreData | null> => {
  const url = process.env.SHEET_BASE_URL;
  if (!url) return null;

  try {
    // 1. Fetch base data from spreadsheet (for business info, themes, hours)
    const storeData = await fetchStoreData(url);

    return storeData;
  } catch (error) {
    console.error("[getData] Error fetching store data:", error);
    return null;
  }
});
