"use client";

import { useIFood as useIFoodFromContext } from "../context/IFoodContext";

export const useIFood = () => {
  return useIFoodFromContext();
};
