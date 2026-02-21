import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useData } from "../context/DataContext";
import { Plus } from "lucide-react";

const MenuSection = () => {
  const { menu: items } = useData();
  const { addItem } = useCart();

  // Filter highlighted items
  const sweets = items.filter((item) => item.isHighlight);

  if (sweets.length === 0) return null;

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
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-600 font-brand mb-4">
            Destaques do Cardápio
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 font-light text-lg">
            Destaques do nosso cardápio.
          </p>
        </div>

        <motion.div
          layout
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {sweets.map((sweet, index) => (
            <motion.div
              layout
              key={sweet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-brand-100 flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative group">
                <img
                  src={sweet.image}
                  alt={sweet.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                  <button
                    onClick={() => addItem(sweet)}
                    className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-600 font-bold py-2 rounded-lg hover:bg-brand-100 active:scale-95 transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar ao Pedido
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link
            to="/cardapio"
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
