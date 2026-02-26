"use server";

import { iFoodService } from "@/src/services/iFoodService";
import { MenuItem } from "@/src/types/store";

export async function fetchIFoodMenuAction(): Promise<MenuItem[]> {
  const isEnabled = process.env.ENABLE_IFOOD === "true";

  if (!isEnabled) {
    return [];
  }

  try {
    return await iFoodService.fetchMenuFromIFood();
  } catch (error) {
    console.error("[fetchIFoodMenuAction] Error fetching menu:", error);
    return [];
  }
}

export async function fetchIFoodCategoriesAction() {
  const isEnabled = process.env.ENABLE_IFOOD === "true";
  if (!isEnabled) return [];

  try {
    return await iFoodService.fetchIFoodCategories();
  } catch (error) {
    console.error("[fetchIFoodCategoriesAction] Error:", error);
    return [];
  }
}

export async function fetchIFoodItemsByCategoryAction(
  categoryId: string,
  categoryName: string,
) {
  const isEnabled = process.env.ENABLE_IFOOD === "true";
  if (!isEnabled) return [];

  try {
    return await iFoodService.fetchIFoodItemsByCategory(
      categoryId,
      categoryName,
    );
  } catch (error) {
    console.error("[fetchIFoodItemsByCategoryAction] Error:", error);
    return [];
  }
}
