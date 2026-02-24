"use client";

import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useData } from "../context/DataContext";

// Using consistent high-quality logos as defaults
const DEFAULT_LOGOS = {
  ifood: "https://logodownload.org/wp-content/uploads/2017/05/ifood-logo-0.png",
  food99:
    "https://logodownload.org/wp-content/uploads/2020/11/99-food-logo-0.png",
};

const DeliveryBanner = () => {
  const { business: businessInfo } = useData();
  const deliveryLogos = businessInfo?.deliveryLogos || DEFAULT_LOGOS;
  return (
    <section className="bg-brand-50/30 py-16 border-b border-brand-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center md:text-left md:w-1/2"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-brand-600">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-widest">
                Delivery
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 font-brand mb-3">
              No conforto da sua casa
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg font-light">
              Peça pelos principais apps e receba onde estiver.
            </p>
          </motion.div>

          {/* Cards Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
          >
            {/* iFood Card */}
            {businessInfo?.ifood && (
              <motion.a
                href={businessInfo.ifood}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 bg-white p-4 pr-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-brand-100 group w-full sm:w-auto"
              >
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img
                    src={deliveryLogos?.ifood}
                    alt="iFood"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs text-gray-400 font-medium uppercase">
                    Pedir pelo
                  </span>
                  <span className="block text-red-500 font-bold text-lg">
                    iFood
                  </span>
                </div>
              </motion.a>
            )}

            {/* 99Food Card */}
            {businessInfo?.food99 && (
              <motion.a
                href={businessInfo.food99}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                className="flex items-center gap-4 bg-white p-4 pr-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-brand-100 group w-full sm:w-auto"
              >
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                  <img
                    src={deliveryLogos?.food99}
                    alt="99Food"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-xs text-gray-400 font-medium uppercase">
                    Pedir pelo
                  </span>
                  <span className="block text-yellow-600 font-bold text-lg">
                    99Food
                  </span>
                </div>
              </motion.a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryBanner;
