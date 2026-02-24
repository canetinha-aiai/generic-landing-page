"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { getBusinessStatus, getFormattedHours } from "../utils/businessHelpers";

const BusinessStatus = () => {
  const { openingHours } = useData();
  const { isOpen, message } = getBusinessStatus(openingHours);
  const [showHours, setShowHours] = useState(false);
  const hoursFormatted = getFormattedHours(openingHours);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowHours(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-block z-50 mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowHours(!showHours)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer hover:brightness-95 ${
          isOpen
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <span className="font-medium text-xs tracking-wide uppercase">
          {message}
        </span>
        <Clock className="w-3.5 h-3.5 opacity-60" />
        {showHours ? (
          <ChevronUp className="w-3.5 h-3.5 opacity-70" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        )}
      </motion.button>

      <AnimatePresence>
        {showHours && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 mt-4 w-72 max-w-[90vw] bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 ring-1 ring-black/5 p-4 origin-top z-50"
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Horários
              </span>
              <button
                onClick={() => setShowHours(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Fechar</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {hoursFormatted.map((item, index) => {
                const isToday = item.dayIndex === new Date().getDay();
                return (
                  <div
                    key={index}
                    className={`flex items-start text-sm rounded-xl px-2 py-1.5 group transition-colors ${isToday ? "bg-brand-50" : ""}`}
                  >
                    <span
                      className={`font-medium w-20 flex-shrink-0 inline-flex items-center gap-2 ${isToday ? "text-brand-700 font-bold" : "text-gray-600"}`}
                    >
                      <span>{item.day}</span>
                      {isToday && (
                        <span className="text-[9px] bg-brand-500 text-white rounded-full px-1.5 py-0.5 font-bold uppercase tracking-wide leading-none">
                          HOJE
                        </span>
                      )}
                    </span>

                    {/* Dotted separator */}
                    <div className="flex-grow mx-2 border-b border-dotted border-gray-300 relative top-3 opacity-50"></div>

                    <div className="flex flex-col items-end gap-1 min-w-[100px]">
                      {item.ranges.length > 0 ? (
                        item.ranges.map((range, idx) => (
                          <span
                            key={idx}
                            className={`font-medium whitespace-nowrap ${isToday ? "text-brand-700" : "text-gray-800"}`}
                          >
                            {range.open} - {range.close}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic font-light">
                          Fechado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-center text-gray-400">
                Horários podem variar em feriados
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessStatus;
