import { cache } from "react";
import { fetchStoreData } from "@/src/services/dataService";
import { StoreData } from "@/src/types/store";

/**
 * Fetches store data from the spreadsheet with request-level deduplication.
 * React.cache() ensures this runs only once per server request,
 * even when called from both generateMetadata() and the page component.
 */
export const getData = cache(async (): Promise<StoreData | null> => {
  const url = process.env.SHEET_BASE_URL;
  if (!url) return null;
  try {
    return await fetchStoreData(url);
  } catch {
    return null;
  }
});
