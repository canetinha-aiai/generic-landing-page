"use client";

import React, { useState, useRef, useEffect } from "react";
import { Cake, Menu, X, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { useData } from "../context/DataContext";
import { getWhatsappLink } from "../utils/businessHelpers";

const Header = () => {
  const { business: businessInfo } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (pathname === "/cardapio") return null;

  interface NavLink {
    name: string;
    href: string;
    type: string;
  }

  const navLinks: NavLink[] = [
    { name: "Início", href: "home", type: "scroll" },
    { name: "Cardápio", href: "/cardapio", type: "route" },
    { name: "Avaliações", href: "reviews", type: "scroll" },
    { name: "Contato", href: "location", type: "scroll" },
  ].filter((link) => {
    if (link.name === "Avaliações" && !businessInfo?.googlePlaceId)
      return false;
    return true;
  });

  const handleNavigation = (e: React.MouseEvent, link: NavLink) => {
    if (link.type === "route") {
      e.preventDefault();
      setIsOpen(false);
      router.push(link.href);
      window.scrollTo(0, 0);
      return;
    }

    e.preventDefault();
    const targetId = link.href;
    const menuWasOpen = isOpen;
    setIsOpen(false);

    const scrollToTarget = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else if (targetId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (pathname !== "/") {
      router.push("/");
      setTimeout(scrollToTarget, 500);
    } else {
      if (menuWasOpen) {
        setTimeout(scrollToTarget, 300);
      } else {
        scrollToTarget();
      }
    }
  };

  return (
    <header ref={headerRef} className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 text-inherit"
            onClick={() => window.scrollTo(0, 0)}
          >
            {businessInfo?.favicon && (
              <img
                src={businessInfo.favicon}
                alt="Logo"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-brand-200 shadow-sm"
              />
            )}
            <div className="text-2xl md:text-3xl font-bold font-brand text-brand-600">
              {businessInfo?.name}
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.type === "scroll" ? `#${link.href}` : link.href}
              onClick={(e) => handleNavigation(e, link)}
              className={`hover:text-brand-500 transition-colors cursor-pointer ${pathname === link.href ? "text-brand-600 font-bold" : ""}`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href={getWhatsappLink(businessInfo?.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-green-100 bg-green-50/30 hover:bg-green-50 text-green-700 px-5 py-2.5 rounded-full text-sm font-bold transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Pedir no WhatsApp
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden absolute top-full left-0 w-full shadow-lg"
          >
            <nav className="flex flex-col p-4 gap-4 text-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.type === "scroll" ? `#${link.href}` : link.href}
                  onClick={(e) => handleNavigation(e, link)}
                  className="text-gray-600 hover:text-brand-500 py-2 transition-colors cursor-pointer"
                >
                  {link.name}
                </a>
              ))}
              <a
                href={getWhatsappLink(businessInfo?.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-green-100 bg-green-50/50 text-green-700 py-4 rounded-2xl font-bold transition-all mt-4"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Pedir no WhatsApp</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
