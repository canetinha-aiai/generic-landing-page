import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-[80vh] bg-brand-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Soft decorative background circles */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-brand-200/30 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center relative z-10 px-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-8xl md:text-9xl font-brand font-bold text-brand-300/80 mb-6 drop-shadow-sm"
        >
          404
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          Página não encontrada
        </h2>

        <p className="text-gray-500 mb-10 text-lg leading-relaxed font-light">
          Parece que o que você procurava não está mais por aqui. Vamos voltar
          ao início?
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-700 shadow-md shadow-brand-200 transition-all hover:-translate-y-0.5"
          >
            <ArrowLeft size={20} />
            Voltar ao Início
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
