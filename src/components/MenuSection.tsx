"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { useCart } from "../context/CartContext";
import { useData } from "../context/DataContext";
import { useIFood } from "../hooks/useIFood";
import { Plus } from "lucide-react";

const MenuSection = () => {
  const { menu: sheetItems } = useData();
  const { ifoodMenu, isLoading: menuLoading, isEnabled } = useIFood();
  const { addItem } = useCart();

  if (isEnabled) return null;

  const items = ifoodMenu.length > 0 ? ifoodMenu : sheetItems;

  // Filter highlighted items
  const products = items.filter((item) => item.isHighlight);

  if (products.length === 0 && !menuLoading) return null;

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
    <section id="menu" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-brand-600 font-brand mb-4">
            Destaques do Cardápio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 font-light text-lg">
            Destaques do nosso cardápio.
          </p>
        </motion.div>

        {menuLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">
              Carregando cardápio do iFood...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Nenhum item em destaque no momento.</p>
          </div>
        ) : (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((sweet, index) => (
              <motion.div
                layout
                key={sweet.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-xl shadow-lg border-brand-100 flex flex-col h-full hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden relative group">
                  <Image
                    src={sweet.image || ""}
                    alt={sweet.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-600 shadow-sm">
                    {sweet.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-lg text-gray-800 leading-tight">
                      {sweet.name}
                    </h3>
                    <span className="bg-brand-100 text-brand-600 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {formatPrice(sweet.price)}
                    </span>
                  </div>
                  <p
                    className="text-gray-500 text-sm mb-4 line-clamp-2 h-10 overflow-hidden"
                    title={sweet.description}
                  >
                    {sweet.description}
                  </p>
                  <div className="mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addItem(sweet)}
                      className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 font-bold py-2 rounded-lg hover:bg-brand-100 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar ao Pedido
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/cardapio"
            className="inline-block bg-brand-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-brand-700 hover:scale-105 transition-all"
          >
            Ver cardápio completo
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
