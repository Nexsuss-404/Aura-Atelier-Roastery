import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X } from 'lucide-react';
import { Product } from '../types';

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
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 z-50 pointer-events-none flex justify-end">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto w-full sm:w-96 max-w-sm p-3 sm:p-3.5 bg-white border border-[#1A1A18]/15 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3 backdrop-blur-md"
          >
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8F7F4] flex-shrink-0 border border-[#1A1A18]/10">
              <img
                src={toast.product.image}
                alt={toast.product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.18em] text-[#9D8461]">
                <span>✓ Added to order</span>
              </div>
              <h4 className="font-serif text-sm font-normal text-[#1A1A18] truncate">
                {toast.product.name}
              </h4>
              <p className="font-mono text-[10px] text-[#1A1A18]/50 truncate">
                {toast.size ? `${toast.size} • ` : ''}${toast.product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenCart}
                className="px-3 py-1.5 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] text-[10px] font-mono uppercase tracking-[0.15em] hover:bg-transparent hover:text-[#1A1A18] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Bag</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-[#1A1A18]/40 hover:text-[#1A1A18] rounded-full transition-colors cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
