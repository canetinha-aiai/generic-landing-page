"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="text-8xl font-brand text-brand-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Página não encontrada
        </h1>
        <p className="text-gray-500 mb-8">
          Essa página não existe ou foi removida.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-600 text-white font-bold px-8 py-3 rounded-2xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
        >
          Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}
