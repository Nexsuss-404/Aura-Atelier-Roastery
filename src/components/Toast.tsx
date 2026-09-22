import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Check } from 'lucide-react';
import { Product } from '../types';
import { handleImageError } from '../utils/imageFallback';

export interface ToastData {
  id: string;
  product: Product;
  message: string;
  size?: string;
  timestamp: number;
}

interface ToastProps {
  toast: ToastData | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose, onOpenCart }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 z-50 pointer-events-none flex justify-end">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-full sm:w-96 max-w-sm p-3.5 bg-white/95 backdrop-blur-md border border-[#9D8461]/30 rounded-2xl shadow-[0_16px_36px_-8px_rgba(26,26,24,0.18)] flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#1A1A18]/10 shadow-2xs">
              <img
                src={toast.product.image}
                alt={toast.product.name}
                onError={handleImageError}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0 font-sans">
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9D8461]">
                <Check className="w-3 h-3 text-[#2D6A4F]" />
                <span>Added to Atelier Bag</span>
              </div>
              <h4 className="font-serif text-sm font-normal text-[#1A1A18] truncate mt-0.5">
                {toast.product.name}
              </h4>
              <p className="text-[11px] text-[#1A1A18]/55 truncate">
                {toast.size ? `${toast.size} • ` : ''}${toast.product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenCart}
                className="px-3.5 py-1.5 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] text-[10px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-[#2A2622] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="w-3 h-3 text-[#9D8461]" />
                <span>View</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-[#1A1A18]/40 hover:text-[#1A1A18] rounded-full hover:bg-[#1A1A18]/5 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
