import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FloatingCart = () => {
    const { count, setIsOpen } = useCart();

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.button
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 z-40 bg-brand-600 text-white rounded-3xl w-16 h-16 shadow-[0_20px_50px_rgba(170,95,81,0.3)] flex items-center justify-center transition-all group"
                >
                    {/* Shine effect container - handles clipping without affecting the badge */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </div>
                    
                    <ShoppingBag className="w-7 h-7 relative z-10" />
                    
                    <motion.span 
                        key={count}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-2 -right-2 bg-white text-brand-700 text-[11px] font-black rounded-full min-w-[24px] h-[24px] px-1.5 flex items-center justify-center shadow-lg border-2 border-brand-50 z-20"
                    >
                        {count > 99 ? '99+' : count}
                    </motion.span>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default FloatingCart;
