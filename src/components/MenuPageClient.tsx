"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/src/context/CartContext";
import { DataProvider, useData } from "@/src/context/DataContext";
import { StoreData, MenuItem } from "@/src/types/store";
import CartDrawer from "@/src/components/CartDrawer";
import FloatingCart from "@/src/components/FloatingCart";
import { IFoodProvider, useIFood } from "@/src/context/IFoodContext";

const formatPrice = (price: number | string) => {
  if (typeof price === "number") {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }
  return "Consulte";
};

function MenuContent() {
  const { menu: sheetItems, business } = useData();
  const {
    ifoodMenu,
    categories: ifoodCategories,
    isLoading: menuLoading,
    isEnabled,
    fetchItemsByCategory,
    itemsByCategory,
  } = useIFood();
  const categories = isEnabled
    ? ifoodCategories.map((c) => c.name)
    : Array.from(new Set(sheetItems.map((item) => item.category))).filter(
        Boolean,
      );

  const [activeCategory, setActiveCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const { addItem } = useCart();

  const items = isEnabled ? ifoodMenu : sheetItems;

  useEffect(() => {
    if (activeCategory === "" && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (isEnabled && activeCategory && activeCategory !== "Todos") {
      const category = ifoodCategories.find((c) => c.name === activeCategory);
      if (category) {
        fetchItemsByCategory(category.id, category.name);
      }
    }
  }, [activeCategory, isEnabled, ifoodCategories, fetchItemsByCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let filtered = items;
    if (activeCategory) {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerTerm) ||
          item.description?.toLowerCase().includes(lowerTerm),
      );
    }
    setFilteredItems(filtered);
  }, [items, activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-brand-50/80 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-100/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="text-gray-500 hover:text-brand-600 transition-all flex items-center gap-1.5 group flex-1"
          >
            <ArrowLeft
              size={18}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-bold text-sm tracking-tight uppercase hidden sm:block">
              Início
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-3 flex-none justify-center flex-row-reverse md:flex-row">
            {business?.favicon && (
              <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-brand-200 shadow-sm flex-none">
                <Image
                  src={business.favicon}
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 32px, 40px"
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-brand text-brand-600 mt-1">
              Nosso Cardápio
            </h1>
          </div>

          <div className="flex-1 hidden sm:block"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        {/* Search & Filter */}
        <div className="w-full lg:max-w-4xl mb-16 space-y-8">
          <div className="relative group max-w-2xl">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-300 group-focus-within:text-brand-500 transition-colors"
              size={22}
            />
            <input
              type="text"
              placeholder="Buscar um item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-none ring-1 ring-brand-100 focus:ring-2 focus:ring-brand-400 focus:outline-none transition-all shadow-sm text-gray-700 bg-white"
            />
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            {categories.map((category, idx) => (
              <button
                key={`cat-${category || idx}`}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-200 -translate-y-0.5"
                    : "bg-white text-gray-400 hover:text-brand-500 hover:bg-brand-50/50 shadow-sm"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {menuLoading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">
              Carregando cardápio do iFood...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-50 flex flex-col h-full group"
                >
                  <div className="h-60 overflow-hidden relative">
                    <Image
                      src={item.image || ""}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black text-brand-600 shadow-sm z-10">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex flex-col mb-3">
                      <h2 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-brand-600 transition-colors">
                        {item.name}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-brand-600 font-bold text-lg">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice &&
                          item.originalPrice > item.price && (
                            <span className="text-gray-400 text-sm line-through decoration-brand-400/50">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed h-10 overflow-hidden text-ellipsis">
                        {item.description}
                      </p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {item.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-green-100 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto">
                      <button
                        onClick={() => addItem(item)}
                        className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-4 rounded-2xl hover:bg-brand-700 shadow-md shadow-brand-100 hover:shadow-brand-200 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Eu quero!
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!menuLoading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Nenhum item encontrado 😢</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory(categories[0] || "");
              }}
              className="mt-4 text-brand-600 font-bold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <CartDrawer />
      <FloatingCart />
    </div>
  );
}

export default function MenuPageClient({
  initialData,
  isIFoodEnabled,
}: {
  initialData: StoreData | null;
  isIFoodEnabled: boolean;
}) {
  return (
    <IFoodProvider isEnabled={isIFoodEnabled}>
      <DataProvider initialData={initialData}>
        <MenuContent />
      </DataProvider>
    </IFoodProvider>
  );
}
