"use client";

import { motion } from "framer-motion";
import { Store } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] bg-brand-50 flex flex-col items-center justify-center p-4">
      {/* Pulsing Logo/Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center shadow-xl shadow-brand-200">
          <Store className="text-white w-12 h-12" />
        </div>
        {/* Decorative rings */}
        <div className="absolute inset-0 border-4 border-brand-200 rounded-full animate-ping opacity-20"></div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl md:text-3xl font-brand text-brand-700 font-bold mb-2">
          Um momento especial...
        </h2>
        <div className="flex items-center gap-1 justify-center">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
        </div>
        <p className="text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mt-4 max-w-[200px] mx-auto leading-relaxed">
          Estamos preparando tudo com muito carinho para você...
        </p>
      </motion.div>

      {/* Bottom info */}
      <div className="absolute bottom-8 text-gray-400 text-[10px] uppercase tracking-widest font-black">
        Processando informações
      </div>
    </div>
  );
};

export default LoadingScreen;
