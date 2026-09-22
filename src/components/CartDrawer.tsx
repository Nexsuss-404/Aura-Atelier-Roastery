import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Coffee, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';
import { KineticCounter, KineticTextRoll } from './KineticTypography';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreMenu,
}) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    tax,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);

  // Keyboard accessibility and body scroll lock
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isCartOpen, setIsCartOpen]);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const result = applyPromoCode(inputCode.trim());
    setPromoMessage({ success: result.success, text: result.message });
    if (result.success) setInputCode('');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#1A1A18]/60 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#9D8461]/25 shadow-[0_0_60px_rgba(26,26,24,0.35)] flex flex-col justify-between h-full relative"
            >
              {/* Top ambient highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9D8461]/20 via-[#9D8461] to-[#9D8461]/20 pointer-events-none" />

              {/* Drawer Header */}
              <div className="p-4 sm:p-6 border-b border-[#1A1A18]/8 bg-white/90 backdrop-blur-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] flex items-center gap-1.5">
                    <ShoppingBag className="w-3 h-3" />
                    Atelier Order Manifest
                  </span>
                  <h2 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.025em]">
                    <KineticTextRoll text="Your Roastery Bag" />
                  </h2>
                  <span className="font-sans text-xs text-[#1A1A18]/50 block">
                    {items.length} {items.length === 1 ? 'item' : 'items'} queued for barista extraction
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearCart}
                      className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#1A1A18]/50 hover:text-red-700 px-2 py-1 transition-colors cursor-pointer"
                      title="Clear order"
                    >
                      Clear
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCartOpen(false)}
                    className="p-2 text-[#1A1A18]/50 hover:text-[#1A1A18] rounded-full hover:bg-[#1A1A18]/5 transition-colors cursor-pointer"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Drawer Body Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Complimentary Courier Milestone Tracker */}
                {items.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between font-sans text-xs">
                      <span className="text-[#1A1A18] flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-[#9D8461]" />
                        {subtotal >= 35 ? (
                          <span className="text-[#9D8461] font-semibold">Complimentary Roastery Courier Unlocked</span>
                        ) : (
                          <span>
                            Add <span className="font-semibold text-[#1A1A18]">${(35 - subtotal).toFixed(2)}</span> for free courier
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-[#1A1A18]/50 font-mono">
                        ${subtotal.toFixed(2)} / $35.00
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1A18]/8 rounded-full overflow-hidden relative">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#9D8461] to-[#1A1A18]"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (subtotal / 35) * 100)}%` }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Empty Cart State */}
                {items.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full border border-[#9D8461]/30 bg-[#FAF8F5] mx-auto flex items-center justify-center text-[#9D8461] shadow-xs">
                      <Coffee className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.02em]">
                        Your bag is empty
                      </h3>
                      <p className="font-sans text-xs text-[#1A1A18]/60 max-w-xs mx-auto leading-relaxed">
                        Select single-origin micro-lots, botanical infusions, or artisan pastries from our menu.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setIsCartOpen(false);
                        onExploreMenu();
                      }}
                      className="px-6 py-2.5 rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#FAF8F5] font-sans text-xs font-semibold uppercase tracking-[0.08em] transition-all cursor-pointer shadow-2xs"
                    >
                      Explore Menu Offerings
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.div
                          key={item.cartItemId}
                          layout
                          initial={{ opacity: 0, y: 16, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={{ y: -1 }}
                          className="p-3.5 rounded-2xl bg-white border border-[#1A1A18]/10 hover:border-[#9D8461]/30 shadow-2xs space-y-2.5 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#1A1A18]/10 shrink-0 bg-[#F4EFEA]">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                onError={handleImageError}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between">
                                <h4 className="font-serif text-base font-normal text-[#1A1A18] truncate">
                                  {item.product.name}
                                </h4>
                                <span className="font-serif text-base font-normal text-[#1A1A18] ml-2">
                                  <KineticCounter value={item.totalPrice} prefix="$" decimals={2} />
                                </span>
                              </div>

                              {/* Customization Specs Breakdown */}
                              <div className="font-sans text-[11px] text-[#1A1A18]/60 space-y-0.5 mt-0.5">
                                {item.customization.size && (
                                  <div>
                                    <span className="font-medium text-[#1A1A18]/80">{item.customization.size}</span>
                                    {item.customization.temperature && ` • ${item.customization.temperature}`}
                                  </div>
                                )}
                                {item.customization.milkChoice !== 'No Milk / Black' && (
                                  <div>Milk: {item.customization.milkChoice}</div>
                                )}
                                {item.customization.espressoShots && item.customization.espressoShots !== 2 && (
                                  <div>Shots: {item.customization.espressoShots} Dosed</div>
                                )}
                                {item.customization.syrup && item.customization.syrup !== 'None' && (
                                  <div>Syrup: {item.customization.syrup}</div>
                                )}
                                {item.customization.grindOption && (
                                  <div>Grind: {item.customization.grindOption}</div>
                                )}
                                {item.customization.notes && (
                                  <div className="italic text-[#9D8461]">"{item.customization.notes}"</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stepper Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#1A1A18]/8 font-sans">
                            <span className="text-[11px] text-[#1A1A18]/50 font-mono">
                              ${item.unitPrice.toFixed(2)} unit
                            </span>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-[#1A1A18]/15 bg-[#FAF8F5] rounded-full overflow-hidden p-0.5">
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                  className="w-6 h-6 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 rounded-full transition-colors cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </motion.button>
                                <span className="w-6 text-center text-xs font-semibold text-[#1A1A18]">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  type="button"
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 rounded-full transition-colors cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </motion.button>
                              </div>

                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.cartItemId)}
                                className="p-1.5 text-[#1A1A18]/40 hover:text-red-600 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Promo Code Box */}
                    <div className="pt-2">
                      <form onSubmit={handleApplyCode} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Promo code (FIRSTROAST / BARISTA5)"
                            value={inputCode}
                            onChange={(e) => setInputCode(e.target.value)}
                            className="w-full px-4 py-2.5 text-xs rounded-2xl bg-white border border-[#1A1A18]/15 font-sans uppercase tracking-wider placeholder:normal-case placeholder:text-[#1A1A18]/40 focus:outline-none focus:border-[#9D8461]"
                          />
                          <Tag className="w-3.5 h-3.5 text-[#1A1A18]/30 absolute right-3 top-3 pointer-events-none" />
                        </div>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2.5 min-h-[38px] rounded-2xl border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] text-xs font-sans font-semibold uppercase tracking-[0.06em] hover:bg-[#2A2622] transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
                        >
                          Apply
                        </motion.button>
                      </form>

                      {promoMessage && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`text-[11px] font-sans mt-1.5 ${
                            promoMessage.success ? 'text-[#9D8461] font-semibold' : 'text-red-700'
                          }`}
                        >
                          {promoMessage.text}
                        </motion.p>
                      )}

                      {promoCode && (
                        <div className="flex items-center justify-between text-xs bg-[#9D8461]/10 text-[#9D8461] p-2.5 rounded-xl mt-2 border border-[#9D8461]/25 font-sans">
                          <span className="font-semibold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Applied Atelier Code: {promoCode}
                          </span>
                          <button
                            onClick={removePromoCode}
                            className="text-[10px] uppercase font-bold tracking-wider hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer with Financial Summary */}
              {items.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-[#1A1A18]/10 bg-white/95 backdrop-blur-xs space-y-3 font-sans">
                  <div className="space-y-1.5 text-xs text-[#1A1A18]/70">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#1A1A18]">
                        <KineticCounter value={subtotal} prefix="$" decimals={2} />
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-[#9D8461] font-semibold">
                        <span>Atelier Discount</span>
                        <span>
                          -<KineticCounter value={discount} prefix="$" decimals={2} />
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Estimated Tax (8.75%)</span>
                      <span className="font-medium text-[#1A1A18]">
                        <KineticCounter value={tax} prefix="$" decimals={2} />
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-base text-[#1A1A18] pt-2 border-t border-[#1A1A18]/10">
                      <span className="font-serif text-lg font-normal">Total Due</span>
                      <span className="font-serif font-light text-2xl">
                        <KineticCounter value={total} prefix="$" decimals={2} />
                      </span>
                    </div>
                  </div>

                  <motion.button
                    id="cart-proceed-checkout-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsCartOpen(false);
                      onProceedToCheckout();
                    }}
                    className="group w-full py-3.5 min-h-[46px] rounded-2xl border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] hover:bg-[#2A2622] text-xs font-sans font-semibold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_rgba(26,26,24,0.15)]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>

                  <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.04em] text-[#1A1A18]/50">
                    <ShieldCheck className="w-3 h-3 text-[#9D8461]" />
                    <span>Encrypted 256-bit TLS • Direct Atelier Roastery Dispatch</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
