"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  useTransition,
  ReactNode,
} from "react";
import { MenuItem } from "../types/store";
import {
  fetchIFoodCategoriesAction,
  fetchIFoodItemsByCategoryAction,
} from "../lib/actions/menuActions";
import { IFoodCategory } from "../services/iFoodService";

interface IFoodState {
  ifoodMenu: MenuItem[]; // Still useful for "All" or combined view if needed
  categories: IFoodCategory[];
  itemsByCategory: Record<string, MenuItem[]>;
  isLoading: boolean;
  error: string | null;
  isEnabled: boolean;
  syncCategories: () => Promise<void>;
  fetchItemsByCategory: (
    categoryId: string,
    categoryName: string,
  ) => Promise<void>;
}

const initialState: IFoodState = {
  ifoodMenu: [],
  categories: [],
  itemsByCategory: {},
  isLoading: false,
  error: null,
  isEnabled: false,
  syncCategories: async () => {},
  fetchItemsByCategory: async () => {},
};

const IFoodContext = createContext<IFoodState>(initialState);

export const IFoodProvider = ({
  children,
  isEnabled = false,
}: {
  children: ReactNode;
  isEnabled?: boolean;
}) => {
  const [categories, setCategories] = useState<IFoodCategory[]>([]);
  const [itemsByCategory, setItemsByCategory] = useState<
    Record<string, MenuItem[]>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const syncStartedRef = useRef(false);

  const syncCategories = useCallback(async () => {
    if (!isEnabled || syncStartedRef.current) return;

    syncStartedRef.current = true;
    setError(null);

    startTransition(async () => {
      try {
        const result = await fetchIFoodCategoriesAction();
        const sortedCategories = [...result].sort(
          (a, b) => a.sequence - b.sequence,
        );
        setCategories(sortedCategories);
      } catch (err) {
        console.error("[IFoodProvider] Category sync failed:", err);
        setError("Erro ao carregar categorias do iFood.");
        syncStartedRef.current = false;
      }
    });
  }, [isEnabled]);

  const fetchItemsByCategory = useCallback(
    async (categoryId: string, categoryName: string) => {
      if (itemsByCategory[categoryId]) return;

      startTransition(async () => {
        try {
          const items = await fetchIFoodItemsByCategoryAction(
            categoryId,
            categoryName,
          );
          setItemsByCategory((prev) => ({ ...prev, [categoryId]: items }));
        } catch (err) {
          console.error(
            `[IFoodProvider] Failed to fetch items for ${categoryName}:`,
            err,
          );
        }
      });
    },
    [itemsByCategory],
  );

  useEffect(() => {
    syncCategories();
  }, [syncCategories]);

  const ifoodMenu = useMemo(() => {
    return Object.values(itemsByCategory).flat();
  }, [itemsByCategory]);

  const value = useMemo(
    () => ({
      ifoodMenu,
      categories,
      itemsByCategory,
      isLoading: isPending,
      error,
      isEnabled,
      syncCategories,
      fetchItemsByCategory,
    }),
    [
      ifoodMenu,
      categories,
      itemsByCategory,
      isPending,
      error,
      isEnabled,
      syncCategories,
      fetchItemsByCategory,
    ],
  );

  return (
    <IFoodContext.Provider value={value}>{children}</IFoodContext.Provider>
  );
};

export const useIFood = () => {
  const context = useContext(IFoodContext);
  if (!context) {
    throw new Error("useIFood must be used within an IFoodProvider");
  }
  return context;
};
