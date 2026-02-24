"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useCart, CartItem } from "../context/CartContext";
import { useData } from "../context/DataContext";
import { getWhatsappLink } from "../utils/businessHelpers";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    price,
  );

const CartDrawer = () => {
  const {
    items,
    total,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  const { business: businessInfo } = useData();

  const hasUnpriced = items.some((i: CartItem) => !i.price);

  const buildWhatsAppMessage = () => {
    const lines = items.map((i: CartItem) => {
      const subtotal = i.price
        ? formatPrice(i.price * i.quantity)
        : "Preço sob consulta";
      return `• ${i.quantity}x ${i.name}${i.price ? ` — ${subtotal}` : ""}`;
    });
    const text = [
      "Olá! Gostaria de fazer um pedido:",
      "",
      ...lines,
      "",
      `*Total ${hasUnpriced ? "parcial" : ""}: ${formatPrice(total)}*`,
      "",
      "Pode confirmar a disponibilidade?",
    ].join("\n");
    const whatsappBase = getWhatsappLink(businessInfo.phone);
    return `${whatsappBase}?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3 text-brand-600">
                <ShoppingBag className="w-6 h-6" />
                <span className="font-bold text-xl text-gray-800 tracking-tight">
                  Seu Pedido
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-400">
                      Sacola vazia
                    </p>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-brand-600 font-bold mt-2 hover:underline"
                    >
                      Explorar cardápio
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {items.map((item: CartItem) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex items-center gap-4 group"
                    >
                      {item.image && (
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full rounded-2xl object-cover shadow-sm"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="font-bold text-gray-800 text-base leading-tight truncate pr-4">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors p-1 -m-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-brand-600 text-base font-bold mt-1">
                          {item.price
                            ? formatPrice(item.price * item.quantity)
                            : "Consultar"}
                        </p>
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-all active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-black text-gray-800 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-all active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={clearCart}
                      className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
                    >
                      Limpar sacola
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer / Checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-8 py-8 space-y-6 bg-white shadow-up">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 font-medium">
                    {hasUnpriced ? "Subtotal parcial" : "Subtotal"}
                  </span>
                  <span className="text-2xl font-black text-gray-900 leading-none">
                    {formatPrice(total)}
                  </span>
                </div>

                {hasUnpriced && (
                  <p className="text-xs text-brand-600 font-medium bg-brand-50/50 p-3 rounded-xl border border-brand-100/50">
                    Nota: Alguns itens selecionados estão "sob consulta". O
                    valor total será atualizado pelo atendente no WhatsApp.
                  </p>
                )}

                {/* WhatsApp Checkout */}
                <a
                  href={buildWhatsAppMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg shadow-brand-100 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-lg">Enviar Pedido</span>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </a>

                <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Finalize seu pedido com o atendente
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
