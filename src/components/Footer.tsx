import { Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";

const DEFAULT_LOGOS = {
  ifood: "https://logodownload.org/wp-content/uploads/2017/05/ifood-logo-0.png",
  food99:
    "https://logodownload.org/wp-content/uploads/2020/11/99-food-logo-0.png",
};

const Footer = () => {
  const { business: businessInfo } = useData();
  const deliveryLogos = businessInfo.deliveryLogos || DEFAULT_LOGOS;
  return (
    <footer
      id="contact"
      className="bg-brand-50/80 pt-16 pb-8 border-t border-brand-100 scroll-mt-20"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col items-center justify-center mb-6 gap-3"
        >
          {businessInfo?.favicon && (
            <img
              src={businessInfo.favicon}
              alt="Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-200 shadow-sm"
            />
          )}
          <h3 className="text-4xl font-bold font-brand text-brand-600 block">
            {businessInfo?.name}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
          className="flex justify-center gap-6 mb-8"
        >
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href={
              businessInfo?.instagram
                ? `https://instagram.com/${businessInfo.instagram}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-500 shadow-sm hover:bg-brand-500 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            href={businessInfo?.ifood || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-red-100"
            aria-label="iFood"
          >
            <img
              src={deliveryLogos?.ifood}
              alt="iFood"
              className="w-full h-full object-cover p-1"
            />
          </motion.a>
          {businessInfo?.food99 && (
            <motion.a
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              href={businessInfo.food99}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-yellow-100"
              aria-label="99Food"
            >
              <img
                src={deliveryLogos?.food99}
                alt="99Food"
                className="w-full h-full object-cover mix-blend-multiply p-1"
              />
            </motion.a>
          )}
        </motion.div>

        <div className="text-gray-400 text-sm font-medium">
          <p>
            &copy; {new Date().getFullYear()} {businessInfo?.name}. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
