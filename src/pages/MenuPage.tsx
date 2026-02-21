import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useData } from "../context/DataContext";
import { Plus } from "lucide-react";
import { MenuItem } from "../types/store";

const MenuPage = () => {
  const { menu: items, loading } = useData();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const { addItem } = useCart();

  const categories = ["Todos", ...new Set(items.map((item) => item.category))];

  // Scroll to top on page mount (React Router keeps scroll position between routes)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    let filtered = items;

    // Filter by category
    if (activeCategory !== "Todos") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    // Filter by search
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

  const formatPrice = (price: number | string) => {
    if (typeof price === "number") {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    }
    return "Consulte";
  };

  return (
    <div className="min-h-screen bg-brand-50/80 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-brand-100/50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-gray-500 hover:text-brand-600 transition-all flex items-center gap-1.5 group"
          >
            <ArrowLeft
              size={18}
              className="transform group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-bold text-sm tracking-tight uppercase">
              Início
            </span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-brand text-brand-600 mt-1">
            Nosso Cardápio
          </h1>
          <div className="w-16 hidden md:block"></div>{" "}
          {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-10">
        {/* Search & Filter */}
        <div className="max-w-3xl mx-auto mb-16 space-y-8">
          {/* Search */}
          <div className="relative group">
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

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-50 flex flex-col h-full group"
              >
                <div className="h-60 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black text-brand-600 shadow-sm">
                    {item.category}
                  </div>
                </div>
                <div className="p-7 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-brand-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-brand-600 font-bold text-lg">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed h-10 overflow-hidden text-ellipsis">
                    {item.description}
                  </p>
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

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Nenhum item encontrado 😢</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("Todos");
              }}
              className="mt-4 text-brand-600 font-bold hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
