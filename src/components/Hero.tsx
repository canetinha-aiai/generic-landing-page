"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import BusinessStatus from "./BusinessStatus";
import { useData } from "../context/DataContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Hero = () => {
  const { business: businessInfo } = useData();
  return (
    <section
      id="home"
      className="relative bg-gradient-to-r from-brand-100 to-brand-200 py-20 overflow-hidden scroll-mt-20"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        <div className="md:w-1/2 text-center md:text-left order-2 md:order-1">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div variants={itemVariants}>
              <BusinessStatus />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold text-brand-700 mb-6 font-brand leading-tight"
            >
              {businessInfo?.name}
              <br />
              <span className="text-brand-500 font-brand text-3xl md:text-5xl">
                {businessInfo?.tagline}
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-700 mb-8 leading-relaxed"
            >
              {businessInfo?.description}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/cardapio"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 h-full w-full"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Ver Cardápio <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#location"
                  className="bg-brand-100 hover:bg-brand-200 text-brand-800 font-bold py-3 px-8 rounded-full shadow-md transition-all flex items-center justify-center h-full w-full"
                >
                  Entrar em Contato
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {businessInfo?.logo && (
          <div className="md:w-1/2 flex justify-center order-1 md:order-2 z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                bounce: 0.4,
              }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="w-48 h-48 md:w-80 md:h-80 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-brand-50 flex items-center justify-center relative z-10"
              >
                <Image
                  src={businessInfo.logo}
                  alt={`Logo ${businessInfo.name}`}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-96 md:h-96 bg-brand-300 rounded-full blur-2xl z-0"
              ></motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
