import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Coffee, 
  Flame, 
  Snowflake, 
  Sparkles, 
  Plus, 
  Minus, 
  Check
} from 'lucide-react';
import { Product, DrinkCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

interface DrinkCustomizerModalProps {
  product: Product | null;
  onClose: () => void;
  onAddedSuccess?: () => void;
}

interface DrinkCustomizerModalDialogProps {
  product: Product;
  onClose: () => void;
  onAddedSuccess?: () => void;
}

const DrinkCustomizerModalDialog: React.FC<DrinkCustomizerModalDialogProps> = ({
  product,
  onClose,
  onAddedSuccess,
}) => {
  const { addItem, setIsCartOpen } = useCart();

  const isBeanProduct = product.category === 'beans';
  const isPastry = product.category === 'pastries';

  // Initial customization state
  const [customization, setCustomization] = useState<DrinkCustomization>({
    size: 'Regular (8oz)',
    temperature: product.category === 'coldbrew' ? 'Iced' : 'Hot',
    roastChoice: product.origin || 'House Reserve Blend',
    milkChoice: isPastry || isBeanProduct ? 'No Milk / Black' : 'Whole Milk',
    espressoShots: 2,
    sweetness: '0% Unsweetened',
    syrup: 'None',
    extraIce: false,
    grindOption: isBeanProduct ? 'Whole Bean (Fresh)' : undefined,
    notes: '',
  });

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Keyboard and scroll accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // Dynamic price calculation
  const calculateCurrentPrice = () => {
    let base = product.price;

    if (product.isDailySpecial && product.specialDiscountPercent) {
      base = base * (1 - product.specialDiscountPercent / 100);
    }

    if (!isBeanProduct && !isPastry) {
      if (customization.size === 'Grande (12oz)') base += 0.65;
      if (customization.size === 'Reserve (16oz)') base += 1.25;

      if (customization.espressoShots > 2) {
        base += (customization.espressoShots - 2) * 1.00;
      }

      if (
        customization.milkChoice.includes('Oat') ||
        customization.milkChoice.includes('Almond') ||
        customization.milkChoice.includes('Macadamia') ||
        customization.milkChoice.includes('Coconut')
      ) {
        base += 0.85;
      }

      if (customization.syrup && customization.syrup !== 'None') {
        base += 0.75;
      }
    }

    return Math.round(base * 100) / 100;
  };

  const unitPrice = calculateCurrentPrice();
  const totalPrice = Math.round(unitPrice * quantity * 100) / 100;

  const estimatedCaffeine = !isBeanProduct && !isPastry
    ? Math.round((customization.espressoShots || 2) * 70)
    : product.caffeineMg || 0;

  const estimatedCalories = (() => {
    if (isPastry) return product.calories || 320;
    if (isBeanProduct) return 0;
    let cal = 5;
    if (customization.milkChoice.includes('Whole')) cal += 120;
    else if (customization.milkChoice.includes('Oat')) cal += 85;
    else if (customization.milkChoice.includes('Almond')) cal += 45;
    else if (customization.milkChoice.includes('Macadamia')) cal += 75;
    else if (customization.milkChoice.includes('Coconut')) cal += 70;
    if (customization.sweetness.includes('100%')) cal += 80;
    else if (customization.sweetness.includes('75%')) cal += 60;
    else if (customization.sweetness.includes('50%')) cal += 40;
    else if (customization.sweetness.includes('25%')) cal += 20;
    return cal;
  })();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddToCart = () => {
    if (isAdded) return;
    addItem(product, customization, quantity);
    setIsAdded(true);
    if (onAddedSuccess) onAddedSuccess();

    setTimeout(() => {
      setIsAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 600);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-black/40 backdrop-blur-xs"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="relative w-full max-w-2xl bg-[#F8F7F4] rounded-2xl shadow-2xl border border-[#1A1A18]/10 overflow-hidden my-auto max-h-[92dvh] sm:max-h-[90vh] flex flex-col"
      >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#1A1A18]/10 bg-white">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs flex-shrink-0 bg-[#F8F7F4] border border-[#1A1A18]/10">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
                  Configuration Lab
                </span>
                <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight tracking-[-0.02em]">
                  {product.name}
                </h3>
                <p className="font-sans text-xs text-[#1A1A18]/60 line-clamp-1">{product.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#1A1A18]/50 hover:text-[#1A1A18] hover:bg-[#1A1A18]/5 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body content */}
          <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-sm">
            {/* Tasting notes & details badge banner */}
            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-xl bg-white border border-[#1A1A18]/10 font-sans text-[11px]">
              <span className="font-semibold text-[#9D8461] mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Notes:
              </span>
              {product.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-2.5 py-0.5 rounded-full border border-[#1A1A18]/10 bg-[#F8F7F4] text-[#1A1A18] font-medium"
                >
                  {note}
                </span>
              ))}
              {product.origin && (
                <span className="ml-auto text-[#1A1A18]/50">
                  {product.origin} • {product.altitude || 'High elevation'}
                </span>
              )}
            </div>

            {/* Live Barista Recipe & Nutrition Gauge */}
            {!isBeanProduct && !isPastry && (
              <div className="p-3.5 rounded-xl bg-white border border-[#1A1A18]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border border-[#1A1A18]/15 bg-[#F8F7F4] text-[#1A1A18] flex items-center justify-center font-serif text-sm">
                    {customization.temperature === 'Iced' ? '❄' : '☕'}
                  </div>
                  <div>
                    <span className="font-serif text-base font-normal text-[#1A1A18] block">
                      {customization.size} • {customization.temperature} {product.name}
                    </span>
                    <span className="font-sans text-[11px] text-[#1A1A18]/60">
                      {customization.espressoShots} Shots • {customization.milkChoice}
                      {customization.syrup !== 'None' ? ` • ${customization.syrup}` : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-sans text-[11px] text-[#1A1A18]/60">
                  <span className="px-2.5 py-1 rounded-full border border-[#1A1A18]/10 bg-[#F8F7F4]">
                    ~{estimatedCaffeine}mg Caffeine
                  </span>
                  <span className="px-2.5 py-1 rounded-full border border-[#1A1A18]/10 bg-[#F8F7F4]">
                    ~{estimatedCalories} kcal
                  </span>
                </div>
              </div>
            )}

            {/* If Whole Bean: Grind options */}
            {isBeanProduct && (
              <div className="space-y-2">
                <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                  Grind Selection (Milled Fresh on Mahlkönig EK43)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Whole Bean (Fresh)',
                    'Espresso (Fine)',
                    'V60 & Chemex (Medium)',
                    'Aeropress (Medium-Fine)',
                    'French Press (Coarse)',
                    'Cold Brew (Extra Coarse)',
                  ].map((grind) => (
                    <button
                      key={grind}
                      type="button"
                      onClick={() => setCustomization({ ...customization, grindOption: grind })}
                      className={`px-3.5 py-2.5 rounded-full border text-xs font-sans font-medium text-left transition-all cursor-pointer ${
                        customization.grindOption === grind
                          ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                          : 'border-[#1A1A18]/15 bg-white text-[#1A1A18] hover:border-[#1A1A18]/40'
                      }`}
                    >
                      {grind}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Drink Customizations */}
            {!isBeanProduct && !isPastry && (
              <>
                {/* Size Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                      Select Cup Size
                    </label>
                    <span className="font-sans text-[11px] text-[#1A1A18]/50">Precision extraction</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { size: 'Regular (8oz)' as const, upcharge: '+$0.00' },
                      { size: 'Grande (12oz)' as const, upcharge: '+$0.65' },
                      { size: 'Reserve (16oz)' as const, upcharge: '+$1.25' },
                    ].map((s) => (
                      <button
                        key={s.size}
                        type="button"
                        onClick={() => setCustomization({ ...customization, size: s.size })}
                        className={`p-3 rounded-full border text-center transition-all cursor-pointer ${
                          customization.size === s.size
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                            : 'border-[#1A1A18]/15 bg-white text-[#1A1A18] hover:border-[#1A1A18]/40'
                        }`}
                      >
                        <div className="font-sans text-xs font-semibold">{s.size}</div>
                        <div className="font-sans text-[11px] opacity-70 mt-0.5">{s.upcharge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                    Temperature Calibration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { temp: 'Hot' as const, icon: <Flame className="w-3.5 h-3.5 text-[#9D8461]" /> },
                      { temp: 'Iced' as const, icon: <Snowflake className="w-3.5 h-3.5 text-[#1A1A18]/70" /> },
                      { temp: 'Extra Hot' as const, icon: <Flame className="w-3.5 h-3.5 text-amber-700" /> },
                    ].map((t) => (
                      <button
                        key={t.temp}
                        type="button"
                        onClick={() => setCustomization({ ...customization, temperature: t.temp })}
                        className={`p-2.5 rounded-full border flex items-center justify-center gap-2 text-xs font-sans font-medium transition-all cursor-pointer ${
                          customization.temperature === t.temp
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                            : 'border-[#1A1A18]/15 bg-white text-[#1A1A18] hover:border-[#1A1A18]/40'
                        }`}
                      >
                        {t.icon}
                        <span>{t.temp}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milk Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                      Milk & Plant Bases
                    </label>
                    <span className="font-sans text-[11px] text-[#1A1A18]/50">Steamed to 62°C</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'Whole Milk', upcharge: 'Standard' },
                      { name: 'Oat Milk (Oatly Barista)', upcharge: '+$0.85' },
                      { name: 'Almond Milk (House Pressed)', upcharge: '+$0.85' },
                      { name: 'Macadamia Nut Milk', upcharge: '+$0.85' },
                      { name: 'Coconut Cream Milk', upcharge: '+$0.85' },
                      { name: 'No Milk / Black', upcharge: 'Standard' },
                    ].map((m) => (
                      <button
                        key={m.name}
                        type="button"
                        onClick={() => setCustomization({ ...customization, milkChoice: m.name })}
                        className={`p-2.5 rounded-full border text-center transition-all cursor-pointer ${
                          customization.milkChoice === m.name
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                            : 'border-[#1A1A18]/15 bg-white text-[#1A1A18] hover:border-[#1A1A18]/40'
                        }`}
                      >
                        <div className="font-sans text-xs font-medium truncate">{m.name}</div>
                        <div className="font-sans text-[10px] opacity-70 mt-0.5">{m.upcharge}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Espresso Shots & Sweetness Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Shots */}
                  <div className="space-y-2">
                    <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                      Espresso Shots
                    </label>
                    <div className="flex items-center justify-between p-2 rounded-full bg-white border border-[#1A1A18]/15">
                      <button
                        type="button"
                        onClick={() =>
                          setCustomization({
                            ...customization,
                            espressoShots: Math.max(1, customization.espressoShots - 1),
                          })
                        }
                        className="w-8 h-8 rounded-full border border-[#1A1A18]/15 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-center font-sans">
                        <span className="font-semibold text-xs text-[#1A1A18]">
                          {customization.espressoShots} {customization.espressoShots === 1 ? 'Shot' : 'Shots'}
                        </span>
                        <div className="text-[10px] text-[#1A1A18]/50">
                          {customization.espressoShots > 2 ? `+$${(customization.espressoShots - 2) * 1}.00` : 'Standard'}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setCustomization({
                            ...customization,
                            espressoShots: Math.min(5, customization.espressoShots + 1),
                          })
                        }
                        className="w-8 h-8 rounded-full border border-[#1A1A18]/15 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Sweetness */}
                  <div className="space-y-2">
                    <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                      Sweetness Calibration
                    </label>
                    <select
                      value={customization.sweetness}
                      onChange={(e) =>
                        setCustomization({
                          ...customization,
                          sweetness: e.target.value as DrinkCustomization['sweetness'],
                        })
                      }
                      className="w-full p-2.5 rounded-full bg-white border border-[#1A1A18]/15 font-sans text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
                    >
                      <option value="0% Unsweetened">0% Unsweetened (Pure Extraction)</option>
                      <option value="25% Light">25% Light Touch</option>
                      <option value="50% Half Sweet">50% Half Sweet</option>
                      <option value="100% Full Sweet">100% Full Sweet</option>
                    </select>
                  </div>
                </div>

                {/* Artisanal Syrups */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                      Craft Botanical Syrups (+$0.75)
                    </label>
                    <span className="font-sans text-[11px] text-[#1A1A18]/50">Small batch</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      'None',
                      'Madagascar Bourbon Vanilla',
                      'Smoked Cardamom Honey',
                      'Kurogoma Dark Mocha',
                      'Spiced Cinnamon Praline',
                      'Lavender Blossom Nectar',
                    ].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setCustomization({ ...customization, syrup: s })}
                        className={`p-2.5 rounded-full border font-sans text-xs font-medium text-center transition-all cursor-pointer ${
                          customization.syrup === s
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                            : 'border-[#1A1A18]/15 bg-white text-[#1A1A18] hover:border-[#1A1A18]/40'
                        }`}
                      >
                        <span className="truncate block">{s}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Special Barista Instructions */}
            <div className="space-y-1.5">
              <label className="block font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                Barista Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., In ceramic cup, extra hot, light foam, etc."
                value={customization.notes || ''}
                onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
                className="w-full p-2.5 rounded-full bg-white border border-[#1A1A18]/15 font-sans text-xs text-[#1A1A18] placeholder-[#1A1A18]/40 focus:outline-none focus:border-[#1A1A18]"
              />
            </div>
          </div>

          {/* Footer with quantity and Add button */}
          <div className="p-3.5 sm:p-6 border-t border-[#1A1A18]/10 bg-white flex items-center justify-between gap-3 sm:gap-4">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-sans text-[11px] uppercase text-[#1A1A18]/50 hidden sm:inline font-medium">Qty:</span>
              <div className="flex items-center border border-[#1A1A18]/20 bg-[#F8F7F4] rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 sm:w-8 text-center font-sans font-semibold text-xs text-[#1A1A18]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add to order button */}
            <motion.button
              id="modal-add-to-order-btn"
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className={`flex-1 sm:flex-initial sm:min-w-[240px] px-4 sm:px-6 py-3 min-h-[44px] rounded-full font-sans text-xs font-medium uppercase tracking-[0.06em] sm:tracking-[0.08em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                isAdded
                  ? 'bg-[#9D8461] text-[#F8F7F4] border border-[#9D8461]'
                  : 'bg-[#1A1A18] text-[#F8F7F4] border border-[#1A1A18] hover:bg-transparent hover:text-[#1A1A18]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="whitespace-nowrap">Added to Order</span>
                </>
              ) : (
                <>
                  <Coffee className="w-4 h-4 text-[#9D8461] shrink-0" />
                  <span className="whitespace-nowrap">Add to Order • ${totalPrice.toFixed(2)}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  export const DrinkCustomizerModal: React.FC<DrinkCustomizerModalProps> = ({
    product,
    onClose,
    onAddedSuccess,
  }) => {
    return (
      <AnimatePresence>
        {product && (
          <DrinkCustomizerModalDialog
            key={product.id}
            product={product}
            onClose={onClose}
            onAddedSuccess={onAddedSuccess}
          />
        )}
      </AnimatePresence>
    );
  };
