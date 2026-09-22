import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Coffee, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

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

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const result = applyPromoCode(inputCode);
    setPromoMessage({ success: result.success, text: result.message });
    if (result.success) setInputCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="w-screen max-w-md bg-[#F8F7F4] border-l border-[#1A1A18]/10 shadow-2xl flex flex-col justify-between h-full"
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-[#1A1A18]/10 bg-white flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
                Order Manifest
              </span>
              <h2 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.02em]">
                Your Roastery Bag
              </h2>
              <span className="font-sans text-xs text-[#1A1A18]/50">
                {items.length} {items.length === 1 ? 'item' : 'items'} queued
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#1A1A18]/60 hover:text-[#1A1A18] px-2 py-1 transition-colors cursor-pointer"
                  title="Clear order"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-[#1A1A18]/60 hover:text-[#1A1A18] rounded-full hover:bg-[#1A1A18]/5 transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Courier Threshold */}
            {items.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-2">
                <div className="flex items-center justify-between font-sans text-xs">
                  <span className="text-[#1A1A18] flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3 h-3 text-[#9D8461]" />
                    {subtotal >= 35 ? (
                      <span className="text-[#9D8461] font-semibold">Complimentary Courier Unlocked</span>
                    ) : (
                      <span>Add ${(35 - subtotal).toFixed(2)} for free courier</span>
                    )}
                  </span>
                  <span className="text-[11px] text-[#1A1A18]/50 font-medium">
                    ${subtotal.toFixed(2)} / $35.00
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#1A1A18]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full bg-[#1A1A18]"
                    style={{ width: `${Math.min(100, (subtotal / 35) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full border border-[#1A1A18]/15 mx-auto flex items-center justify-center text-[#1A1A18]/50">
                  <Coffee className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.02em]">
                    Your bag is empty
                  </h3>
                  <p className="font-sans text-xs text-[#1A1A18]/60 max-w-xs mx-auto">
                    Select handcrafted drinks or single-origin micro-lots from our atelier menu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMenu();
                  }}
                  className="px-6 py-2.5 rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F8F7F4] font-sans text-xs font-medium uppercase tracking-[0.06em] transition-all cursor-pointer"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        onError={handleImageError}
                        className="w-13 h-13 rounded-xl object-cover border border-[#1A1A18]/10 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <h4 className="font-serif text-base font-normal text-[#1A1A18] truncate">
                            {item.product.name}
                          </h4>
                          <span className="font-serif text-base font-normal text-[#1A1A18] ml-2">
                            ${item.totalPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Customization specs breakdown */}
                        <div className="font-sans text-[11px] text-[#1A1A18]/60 space-y-0.5 mt-0.5">
                          {item.customization.size && (
                            <div>{item.customization.size} • {item.customization.temperature}</div>
                          )}
                          {item.customization.milkChoice !== 'No Milk / Black' && (
                            <div>Milk: {item.customization.milkChoice}</div>
                          )}
                          {item.customization.espressoShots !== 2 && (
                            <div>Shots: {item.customization.espressoShots}</div>
                          )}
                          {item.customization.syrup !== 'None' && (
                            <div>Syrup: {item.customization.syrup}</div>
                          )}
                          {item.customization.grindOption && (
                            <div>Grind: {item.customization.grindOption}</div>
                          )}
                          {item.customization.notes && (
                            <div className="italic text-[#1A1A18]/80">Note: "{item.customization.notes}"</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stepper row */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1A1A18]/10 font-sans">
                      <span className="text-[11px] text-[#1A1A18]/50">
                        ${item.unitPrice.toFixed(2)} each
                      </span>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#1A1A18]/20 bg-[#F8F7F4] rounded-full overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-semibold text-[#1A1A18]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.cartItemId)}
                          className="p-1.5 text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code input box */}
                <div className="pt-2">
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (FIRSTROAST / BARISTA5)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 text-xs rounded-full bg-white border border-[#1A1A18]/15 font-sans uppercase tracking-wider placeholder:normal-case focus:outline-none focus:border-[#1A1A18]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 min-h-[38px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.06em] hover:bg-transparent hover:text-[#1A1A18] transition-colors cursor-pointer flex items-center justify-center"
                    >
                      Apply
                    </button>
                  </form>

                  {promoMessage && (
                    <p
                      className={`text-[11px] font-sans mt-1.5 ${
                        promoMessage.success ? 'text-[#9D8461] font-semibold' : 'text-red-700'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}

                  {promoCode && (
                    <div className="flex items-center justify-between text-xs bg-[#9D8461]/10 text-[#9D8461] p-2 rounded-xl mt-2 border border-[#9D8461]/20 font-sans">
                      <span className="font-semibold">Code: {promoCode}</span>
                      <button
                        onClick={removePromoCode}
                        className="text-[10px] uppercase underline cursor-pointer"
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
            <div className="p-4 sm:p-6 border-t border-[#1A1A18]/10 bg-white space-y-3 font-sans">
              <div className="space-y-1.5 text-xs text-[#1A1A18]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A18]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#9D8461] font-semibold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax (8.75%)</span>
                  <span className="font-medium text-[#1A1A18]">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-baseline text-base text-[#1A1A18] pt-2 border-t border-[#1A1A18]/10">
                  <span className="font-serif text-lg">Total Due</span>
                  <span className="font-serif font-light text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 min-h-[44px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] hover:bg-transparent hover:text-[#1A1A18] text-xs font-sans font-medium uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.04em] text-[#1A1A18]/50">
                <ShieldCheck className="w-3 h-3 text-[#9D8461]" />
                <span>Encrypted 256-bit TLS • Direct Roastery Dispatch</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
