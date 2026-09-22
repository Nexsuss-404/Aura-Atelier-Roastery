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
  Check,
  Droplets,
  Layers,
  Thermometer,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { Product, DrinkCustomization } from '../types';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';
import { KineticCounter, KineticTextRoll } from './KineticTypography';

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

  // Keyboard accessibility and body scroll lock
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
      transition={{ duration: 0.28 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 sm:py-6 overflow-y-auto bg-[#1A1A18]/65 backdrop-blur-md"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 22 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-[0_32px_80px_rgba(26,26,24,0.28)] border border-[#9D8461]/25 overflow-hidden my-auto max-h-[92dvh] sm:max-h-[88vh] flex flex-col"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9D8461]/60 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#1A1A18]/8 bg-white/80 backdrop-blur-sm relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shadow-xs flex-shrink-0 bg-[#F4EFEA] border border-[#1A1A18]/10 group">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full bg-[#9D8461]/12 text-[#9D8461] border border-[#9D8461]/20">
                    Atelier Dialing Lab
                  </span>
                  {product.origin && (
                    <span className="font-sans text-[11px] text-[#1A1A18]/50 hidden sm:inline">
                      {product.origin}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A18] leading-tight tracking-[-0.025em]">
                  <KineticTextRoll text={product.name} />
                </h3>
                <p className="font-sans text-xs text-[#1A1A18]/65 line-clamp-1">
                  {product.subtitle || product.description}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-[#1A1A18]/50 hover:text-[#1A1A18] hover:bg-[#1A1A18]/5 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Tasting Notes & Terroir Ribbon */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 mt-3 border-t border-[#1A1A18]/6 font-sans text-[11px]">
            <span className="font-semibold text-[#9D8461] flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5" />
              Sensory Notes:
            </span>
            {product.tastingNotes.map((note) => (
              <span
                key={note}
                className="px-2.5 py-0.5 rounded-full border border-[#1A1A18]/8 bg-[#F8F7F4] text-[#1A1A18]/80 font-medium"
              >
                {note}
              </span>
            ))}
            {product.process && (
              <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-[#9D8461]/90 hidden sm:inline">
                {product.process}
              </span>
            )}
          </div>
        </div>

        {/* Live Extraction Recipe Barometer */}
        {!isBeanProduct && !isPastry && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#F4EFEA]/80 border-b border-[#1A1A18]/8 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white border border-[#1A1A18]/10 flex items-center justify-center text-xs">
                {customization.temperature === 'Iced' ? '❄' : '☕'}
              </div>
              <span className="text-[#1A1A18] font-medium tracking-[0.01em]">
                {customization.size} • {customization.temperature} • {customization.espressoShots} Shots • {customization.milkChoice}
                {customization.syrup !== 'None' ? ` • ${customization.syrup}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#1A1A18]/65 font-mono">
              <span className="px-2 py-0.5 rounded-md bg-white/70 border border-[#1A1A18]/8">
                <KineticCounter value={estimatedCaffeine} decimals={0} suffix="mg caffeine" />
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/70 border border-[#1A1A18]/8">
                <KineticCounter value={estimatedCalories} decimals={0} suffix=" kcal" />
              </span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 text-sm">
          {/* Whole Bean Grind Options */}
          {isBeanProduct && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Grind Calibration (Mahlkönig EK43)
                </label>
                <span className="text-[11px] text-[#1A1A18]/50 font-sans">Single dose zero retention</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Whole Bean (Fresh)', note: 'Seal intact' },
                  { name: 'Espresso (Fine)', note: '9-bar espresso' },
                  { name: 'V60 & Chemex (Medium)', note: 'Clean pour-over' },
                  { name: 'Aeropress (Medium-Fine)', note: 'Immersion & pressure' },
                  { name: 'French Press (Coarse)', note: 'Full immersion' },
                  { name: 'Cold Brew (Extra Coarse)', note: 'Slow cold steep' },
                ].map((grind) => {
                  const isSelected = customization.grindOption === grind.name;
                  return (
                    <motion.button
                      key={grind.name}
                      type="button"
                      whileHover={{ y: -1, scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCustomization({ ...customization, grindOption: grind.name })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] shadow-xs'
                          : 'border-[#1A1A18]/12 bg-white text-[#1A1A18] hover:border-[#1A1A18]/30 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="font-sans text-xs font-semibold">{grind.name}</div>
                      <div className={`font-sans text-[10px] mt-0.5 ${isSelected ? 'text-[#FAF8F5]/70' : 'text-[#1A1A18]/50'}`}>
                        {grind.note}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Handcrafted Drink Customizations */}
          {!isBeanProduct && !isPastry && (
            <>
              {/* Cup Size */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Cup Profile & Volume
                  </label>
                  <span className="font-sans text-[11px] text-[#1A1A18]/50">Golden brew ratio</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { size: 'Regular (8oz)' as const, upcharge: 'Standard', desc: 'Optimal milk ratio' },
                    { size: 'Grande (12oz)' as const, upcharge: '+$0.65', desc: 'Extended comfort' },
                    { size: 'Reserve (16oz)' as const, upcharge: '+$1.25', desc: 'Generous pour' },
                  ].map((s) => {
                    const isSelected = customization.size === s.size;
                    return (
                      <motion.button
                        key={s.size}
                        type="button"
                        whileHover={{ y: -1, scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCustomization({ ...customization, size: s.size })}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] shadow-xs'
                            : 'border-[#1A1A18]/12 bg-white text-[#1A1A18] hover:border-[#1A1A18]/30 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="font-sans text-xs font-semibold">{s.size}</div>
                        <div className={`font-sans text-[10px] font-mono mt-0.5 ${isSelected ? 'text-[#9D8461]' : 'text-[#9D8461] font-medium'}`}>
                          {s.upcharge}
                        </div>
                        <div className={`font-sans text-[10px] mt-0.5 ${isSelected ? 'text-[#FAF8F5]/60' : 'text-[#1A1A18]/45'}`}>
                          {s.desc}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Temperature Calibration */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5" />
                    Thermal Calibration
                  </label>
                  <span className="font-sans text-[11px] text-[#1A1A18]/50">PID monitored steam</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { temp: 'Hot' as const, label: 'Hot (62°C)', icon: <Flame className="w-4 h-4 text-[#9D8461]" /> },
                    { temp: 'Iced' as const, label: 'Iced (Sub-Zero)', icon: <Snowflake className="w-4 h-4 text-[#457B9D]" /> },
                    { temp: 'Extra Hot' as const, label: 'Extra Hot (70°C)', icon: <Flame className="w-4 h-4 text-amber-700" /> },
                  ].map((t) => {
                    const isSelected = customization.temperature === t.temp;
                    return (
                      <motion.button
                        key={t.temp}
                        type="button"
                        whileHover={{ y: -1, scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCustomization({ ...customization, temperature: t.temp })}
                        className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-sans font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] shadow-xs'
                            : 'border-[#1A1A18]/12 bg-white text-[#1A1A18] hover:border-[#1A1A18]/30 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {t.icon}
                        <span className="text-center font-semibold text-xs">{t.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Espresso Extraction Meter */}
              <div className="p-4 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] block">
                      Espresso Extraction Dosing
                    </label>
                    <span className="font-sans text-[11px] text-[#1A1A18]/50">
                      Single-origin 18.5g dry dose • 9-bar saturation
                    </span>
                  </div>

                  {/* Extraction beads visualizer */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((shotNum) => (
                      <span
                        key={shotNum}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          shotNum <= customization.espressoShots
                            ? 'bg-[#9D8461] scale-110 shadow-[0_0_8px_rgba(157,132,97,0.6)]'
                            : 'bg-[#1A1A18]/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#1A1A18]/8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() =>
                      setCustomization({
                        ...customization,
                        espressoShots: Math.max(1, customization.espressoShots - 1),
                      })
                    }
                    className="w-9 h-9 rounded-xl border border-[#1A1A18]/15 bg-white flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/5 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>

                  <div className="text-center font-sans">
                    <span className="font-serif text-lg font-normal text-[#1A1A18]">
                      {customization.espressoShots} {customization.espressoShots === 1 ? 'Shot' : 'Shots'}
                      {customization.espressoShots === 2 ? ' (Double Ristretto)' : ''}
                    </span>
                    <div className="text-[11px] text-[#9D8461] font-medium font-mono">
                      {customization.espressoShots > 2 ? `+$${(customization.espressoShots - 2) * 1}.00` : 'House Standard Recipe'}
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() =>
                      setCustomization({
                        ...customization,
                        espressoShots: Math.min(5, customization.espressoShots + 1),
                      })
                    }
                    className="w-9 h-9 rounded-xl border border-[#1A1A18]/15 bg-white flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Milk & Plant Bases */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5" />
                    Milk & Botanical Dairy
                  </label>
                  <span className="font-sans text-[11px] text-[#1A1A18]/50">Microfoam textured</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Whole Milk', upcharge: 'Standard', desc: 'Jersey dairy, rich' },
                    { name: 'Oat Milk (Oatly Barista)', upcharge: '+$0.85', desc: 'Silky, natural malt' },
                    { name: 'Almond Milk (House Pressed)', upcharge: '+$0.85', desc: 'Raw organic almond' },
                    { name: 'Macadamia Nut Milk', upcharge: '+$0.85', desc: 'Buttery texture' },
                    { name: 'Coconut Cream Milk', upcharge: '+$0.85', desc: 'Tropical aromatic' },
                    { name: 'No Milk / Black', upcharge: 'Standard', desc: 'Pure extraction' },
                  ].map((m) => {
                    const isSelected = customization.milkChoice === m.name;
                    return (
                      <motion.button
                        key={m.name}
                        type="button"
                        whileHover={{ y: -1, scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCustomization({ ...customization, milkChoice: m.name })}
                        className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] shadow-xs'
                            : 'border-[#1A1A18]/12 bg-white text-[#1A1A18] hover:border-[#1A1A18]/30 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div className="font-sans text-xs font-semibold truncate">{m.name}</div>
                        <div className="flex items-center justify-between mt-1 text-[10px] font-sans">
                          <span className={isSelected ? 'text-[#FAF8F5]/70' : 'text-[#1A1A18]/50'}>{m.desc}</span>
                          <span className="font-mono text-[#9D8461] font-semibold">{m.upcharge}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Sweetness Calibration */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461]">
                    Sweetness Profile
                  </label>
                  <span className="font-sans text-[11px] text-[#1A1A18]/50">Unrefined raw panela</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '0% Unsweetened', label: '0% Pure', desc: 'Pure origin' },
                    { id: '25% Light', label: '25% Subtle', desc: 'Gentle touch' },
                    { id: '50% Half Sweet', label: '50% Balanced', desc: 'Harmonious' },
                    { id: '100% Full Sweet', label: '100% Indulgent', desc: 'Rich sweetness' },
                  ].map((sweet) => {
                    const isSelected = customization.sweetness === sweet.id;
                    return (
                      <motion.button
                        key={sweet.id}
                        type="button"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() =>
                          setCustomization({
                            ...customization,
                            sweetness: sweet.id as DrinkCustomization['sweetness'],
                          })
                        }
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5]'
                            : 'border-[#1A1A18]/12 bg-white text-[#1A1A18] hover:border-[#1A1A18]/30'
                        }`}
                      >
                        <div className="font-sans text-xs font-semibold">{sweet.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#FAF8F5]/70' : 'text-[#1A1A18]/45'}`}>
                          {sweet.desc}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Artisanal Syrups */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461]">
                    House Botanical Syrups (+$0.75)
                  </label>
                  <span className="font-sans text-[11px] text-[#1A1A18]/50">Slow infused</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'None', desc: 'No syrup' },
                    { name: 'Madagascar Bourbon Vanilla', desc: 'Cured vanilla pod' },
                    { name: 'Smoked Cardamom Honey', desc: 'Wildflower & wood smoke' },
                    { name: 'Kurogoma Dark Mocha', desc: 'Black sesame & 70% cacao' },
                    { name: 'Spiced Cinnamon Praline', desc: 'Ceylon quill & pecan' },
                    { name: 'Lavender Blossom Nectar', desc: 'French culinary floral' },
                  ].map((s) => {
                    const isSelected = customization.syrup === s.name;
                    return (
                      <motion.button
                        key={s.name}
                        type="button"
                        whileHover={{ y: -1, scale: 1.015 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCustomization({ ...customization, syrup: s.name })}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] shadow-xs'
                            : 'border-[#1A1A18]/12 bg-white text-[#1A1A18] hover:border-[#1A1A18]/30 hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span className="font-sans text-xs font-semibold truncate block">{s.name}</span>
                        <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-[#FAF8F5]/70' : 'text-[#1A1A18]/45'}`}>
                          {s.desc}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Barista Instructions */}
          <div className="space-y-2">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] block">
              Barista Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., In pre-warmed ceramic tulip cup, extra microfoam, 65°C, etc."
              value={customization.notes || ''}
              onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#1A1A18]/12 font-sans text-xs text-[#1A1A18] placeholder-[#1A1A18]/40 focus:outline-none focus:border-[#9D8461] transition-all"
            />
          </div>
        </div>

        {/* Modal Footer with Live Quantity & Add to Order CTA */}
        <div className="p-4 sm:p-6 border-t border-[#1A1A18]/8 bg-white/95 backdrop-blur-sm flex items-center justify-between gap-3 sm:gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="font-sans text-[11px] uppercase tracking-wider text-[#1A1A18]/50 hidden sm:inline font-semibold">
              Qty
            </span>
            <div className="flex items-center border border-[#1A1A18]/15 bg-[#FAF8F5] rounded-2xl overflow-hidden p-0.5">
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/8 rounded-xl transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="w-8 text-center font-sans font-semibold text-xs text-[#1A1A18]">
                {quantity}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/8 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Pricing & Add to Order Button */}
          <motion.button
            id="modal-add-to-order-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className={`flex-1 sm:flex-initial sm:min-w-[280px] px-6 py-3.5 min-h-[48px] rounded-2xl font-sans text-xs font-semibold uppercase tracking-[0.08em] flex items-center justify-center gap-2.5 transition-all cursor-pointer relative overflow-hidden shadow-[0_12px_24px_rgba(26,26,24,0.12)] ${
              isAdded
                ? 'bg-[#2D6A4F] text-white border border-[#2D6A4F]'
                : 'bg-[#1A1A18] text-[#FAF8F5] border border-[#1A1A18] hover:bg-[#2A2622]'
            }`}
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 pointer-events-none" />

            {isAdded ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Dialed & Added to Bag</span>
              </motion.div>
            ) : (
              <>
                <Coffee className="w-4 h-4 text-[#9D8461] shrink-0" />
                <span className="whitespace-nowrap flex items-center gap-1.5">
                  Commit to Order • <KineticCounter value={totalPrice} prefix="$" decimals={2} />
                </span>
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
