import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import BusinessStatus from "./BusinessStatus";
import { useData } from "../context/DataContext";

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

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="md:w-1/2 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BusinessStatus />

            <h1 className="text-4xl md:text-6xl font-bold text-brand-700 mb-6 font-brand leading-tight">
              {businessInfo?.name}
              <br />
              <span className="text-brand-500 font-brand text-3xl md:text-5xl">
                {businessInfo?.tagline}
              </span>
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {businessInfo?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/cardapio"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                onClick={() => window.scrollTo(0, 0)}
              >
                Ver Cardápio <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="#location"
                className="bg-brand-100 hover:bg-brand-200 text-brand-800 font-bold py-3 px-8 rounded-full shadow-md transition-all flex items-center justify-center"
              >
                Entrar em Contato
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
