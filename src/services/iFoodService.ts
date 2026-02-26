import { MenuItem } from "../types/store";
import { unstable_cache } from "next/cache";
import { CACHE_REVALIDATE } from "../lib/constants";

const IFOOD_API_BASE = "https://merchant-api.ifood.com.br";

interface IFoodToken {
  accessToken: string;
  expiresIn: number;
}

interface IFoodCatalog {
  catalogId: string;
  context: string[];
  status: string;
}

export interface IFoodCategory {
  id: string;
  name: string;
  status: string;
  sequence: number;
  index: number;
}

interface IFoodCategoryItemsResponse {
  categoryId: string;
  items: IFoodItem[];
  products: IFoodProduct[];
}

interface IFoodItem {
  id: string;
  productId: string;
  status: string;
  contextModifiers?: {
    price: {
      value: number;
      originalValue?: number;
    };
    status: string;
  }[];
}

interface IFoodProduct {
  id: string;
  name: string;
  description?: string;
  imagePath?: string;
  serving?: string;
  dietaryRestrictions?: string[];
  tags?: string[];
}

// This is no longer needed as we use Next.js unstable_cache
// let globalToken: string | null = null;
// let globalTokenExpiry: number | null = null;

class IFoodService {
  constructor() {}

  private getCredentials() {
    return {
      clientId: process.env.IFOOD_CLIENT_ID || "",
      clientSecret: process.env.IFOOD_CLIENT_SECRET || "",
      merchantId: process.env.IFOOD_MERCHANT_ID || "",
    };
  }

  private getCachedToken = unstable_cache(
    async (clientId: string, clientSecret: string) => {
      console.log(
        "[iFoodService] Fetching new authentication token via unstable_cache.",
      );
      const params = new URLSearchParams();
      params.append("grantType", "client_credentials");
      params.append("clientId", clientId);
      params.append("clientSecret", clientSecret);

      const response = await fetch(
        `${IFOOD_API_BASE}/authentication/v1.0/oauth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
          cache: "no-store",
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[iFoodService] Auth Error:", errorText);
        throw new Error(`iFood Auth failed: ${response.statusText}`);
      }

      const data: IFoodToken = await response.json();
      return data.accessToken;
    },
    ["ifood-auth-token"],
    { revalidate: CACHE_REVALIDATE.IFOOD_TOKEN }, // 59 minutes
  );

  private async authenticate(): Promise<string> {
    const { clientId, clientSecret } = this.getCredentials();
    return this.getCachedToken(clientId, clientSecret);
  }

  private async fetchCatalogs(
    token: string,
    merchantId: string,
  ): Promise<string> {
    const response = await fetch(
      `${IFOOD_API_BASE}/catalog/v2.0/merchants/${merchantId}/catalogs`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: CACHE_REVALIDATE.IFOOD_CATALOG },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch catalogs: ${response.statusText}`);
    }

    const catalogs: IFoodCatalog[] = await response.json();
    if (catalogs.length === 0) {
      throw new Error("No catalogs found for this merchant.");
    }

    // Return the first available catalog
    return catalogs[0].catalogId;
  }

  private async fetchCategories(
    token: string,
    merchantId: string,
    catalogId: string,
  ): Promise<IFoodCategory[]> {
    const response = await fetch(
      `${IFOOD_API_BASE}/catalog/v2.0/merchants/${merchantId}/catalogs/${catalogId}/categories`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: CACHE_REVALIDATE.IFOOD_CATEGORY },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return await response.json();
  }

  async fetchIFoodCategories(): Promise<IFoodCategory[]> {
    const { merchantId } = this.getCredentials();
    if (!merchantId) return [];

    try {
      const token = await this.authenticate();
      const catalogId = await this.fetchCatalogs(token, merchantId);
      return await this.fetchCategories(token, merchantId, catalogId);
    } catch (error) {
      console.error("[iFoodService] Error fetching categories:", error);
      return [];
    }
  }

  async fetchIFoodItemsByCategory(
    categoryId: string,
    categoryName: string,
  ): Promise<MenuItem[]> {
    const { merchantId } = this.getCredentials();
    if (!merchantId) return [];

    try {
      const token = await this.authenticate();
      const [categoryData, catalogId] = await Promise.all([
        this.fetchCategoryItems(token, merchantId, categoryId),
        this.fetchCatalogs(token, merchantId),
      ]);

      return categoryData.items
        .map((item) => {
          const product = categoryData.products.find(
            (p) => p.id === item.productId,
          );
          const activeModifier = item.contextModifiers?.find(
            (m) => m.status === "AVAILABLE",
          );

          if (
            item.status === "AVAILABLE" &&
            product &&
            activeModifier?.status === "AVAILABLE" && // Explicit check for available modifier
            activeModifier?.price?.value !== undefined
          ) {
            return {
              id: item.id,
              name: product.name,
              description: product.description || "",
              price: activeModifier.price.value,
              originalPrice: activeModifier.price.originalValue,
              category: categoryName,
              image: product.imagePath || "",
              isHighlight: false,
              serving: product.serving,
              tags: Array.from(
                new Set([
                  ...(product.tags || []),
                  ...(product.dietaryRestrictions || []),
                ]),
              ),
            } as MenuItem;
          }
          return null;
        })
        .filter((item): item is MenuItem => item !== null);
    } catch (error) {
      console.error(
        `[iFoodService] Error fetching items for category ${categoryName}:`,
        error,
      );
      return [];
    }
  }

  private async fetchCategoryItems(
    token: string,
    merchantId: string,
    categoryId: string,
  ): Promise<IFoodCategoryItemsResponse> {
    const response = await fetch(
      `${IFOOD_API_BASE}/catalog/v2.0/merchants/${merchantId}/categories/${categoryId}/items`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: CACHE_REVALIDATE.IFOOD_ITEMS },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch items for category ${categoryId}: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  // Keeping this for potential legacy use, but we'll prefer granular fetching
  async fetchMenuFromIFood(): Promise<MenuItem[]> {
    const categories = await this.fetchIFoodCategories();
    const menuItems: MenuItem[] = [];

    const categoryPromises = categories.map(async (category) => {
      const items = await this.fetchIFoodItemsByCategory(
        category.id,
        category.name,
      );
      menuItems.push(...items);
    });

    await Promise.all(categoryPromises);
    return menuItems;
  }
}

export const iFoodService = new IFoodService();
