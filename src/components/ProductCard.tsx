import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Check, SlidersHorizontal, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
  onExploreGallery?: (product: Product) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCustomize,
  onExploreGallery,
  index = 0,
}) => {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (justAdded) {
      timer = setTimeout(() => setJustAdded(false), 1400);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [justAdded]);

  const discountedPrice =
    product.isDailySpecial && product.specialDiscountPercent
      ? product.price * (1 - product.specialDiscountPercent / 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (justAdded) return;
    addItem(
      product,
      {
        size: 'Regular (8oz)',
        temperature: product.category === 'coldbrew' ? 'Iced' : 'Hot',
        roastChoice: product.origin || 'House Reserve Blend',
        milkChoice:
          product.category === 'pastries' || product.category === 'beans'
            ? 'No Milk / Black'
            : 'Whole Milk',
        espressoShots: 2,
        sweetness: '0% Unsweetened',
        syrup: 'None',
        extraIce: false,
        grindOption: product.category === 'beans' ? 'Whole Bean (Fresh)' : undefined,
      },
      1
    );
    setJustAdded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.25), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative bg-[#FCFBF9] border border-[#1A1A18]/10 hover:border-[#9D8461]/35 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-[0_20px_40px_-12px_rgba(26,26,24,0.12)]"
    >
      {/* 1. Visual Showcase with organic aspect ratio */}
      <div
        className="relative aspect-[4/3] overflow-hidden bg-[#F2ECE4] cursor-pointer"
        onClick={() => onCustomize(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          referrerPolicy="no-referrer"
        />

        {/* Deep photographic contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {product.isDailySpecial ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1A1A18]/90 text-[#F8F7F4] text-[10px] font-sans font-semibold tracking-[0.06em] uppercase border border-white/20 backdrop-blur-xs shadow-xs">
              Special -{product.specialDiscountPercent}%
            </span>
          ) : product.roastLevel ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1A1A18]/80 backdrop-blur-xs text-[#F8F7F4] text-[10px] font-sans font-medium tracking-[0.05em] uppercase border border-white/10">
              {product.roastLevel}
            </span>
          ) : (
            <span />
          )}

          {product.isPopular && (
            <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5]/95 backdrop-blur-xs text-[#1A1A18] text-[10px] font-sans font-semibold tracking-[0.05em] uppercase shadow-xs">
              House Favorite
            </span>
          )}
        </div>

        {/* Bottom Origin & Terroir Bar */}
        {product.origin && (
          <div className="absolute bottom-3 left-3.5 right-3.5 text-white text-xs font-sans font-medium flex items-center justify-between drop-shadow-sm pointer-events-none">
            <span className="truncate tracking-[0.01em]">{product.origin}</span>
            {product.altitude && (
              <span className="opacity-90 shrink-0 font-mono text-[10px] bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
                {product.altitude}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Bespoke Editorial Content Deck */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div className="space-y-2">
          {/* Rating and Caffeine Bar */}
          <div className="flex items-center justify-between text-xs text-[#1A1A18]/60 font-sans">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#9D8461] text-[#9D8461]" />
              <span className="font-semibold text-[#1A1A18] text-xs">{product.rating}</span>
              <span className="text-[11px] text-[#1A1A18]/45">({product.reviewCount})</span>
            </div>
            {product.caffeineMg ? (
              <span className="text-[11px] text-[#1A1A18]/50 font-mono">
                {product.caffeineMg}mg caffeine
              </span>
            ) : product.process ? (
              <span className="text-[10px] text-[#9D8461] font-sans font-semibold tracking-wider uppercase">
                {product.process}
              </span>
            ) : null}
          </div>

          {/* Product Title */}
          <div>
            <h3
              onClick={() => onCustomize(product)}
              className="font-serif text-[1.42rem] sm:text-[1.5rem] font-normal leading-[1.25] text-[#1A1A18] group-hover:text-[#9D8461] transition-colors duration-300 line-clamp-1 cursor-pointer tracking-[-0.02em]"
            >
              {product.name}
            </h3>
            {product.subtitle && (
              <p className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[#9D8461] mt-0.5 truncate">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Sensory Description */}
          <p className="font-sans text-[13px] text-[#1A1A18]/70 line-clamp-2 leading-[1.6] [text-wrap:pretty]">
            {product.description}
          </p>
        </div>

        {/* Sensory Tasting Notes Chips */}
        <div className="flex flex-wrap gap-1.5 pt-0.5 font-sans text-[11px] text-[#1A1A18]/80 font-normal">
          {product.tastingNotes.slice(0, 3).map((note) => (
            <span
              key={note}
              className="px-2.5 py-0.5 rounded-full border border-[#1A1A18]/8 bg-[#FBF9F6] group-hover:bg-[#FAF8F5] text-[#1A1A18]/75 tracking-[0.01em] transition-colors"
            >
              {note}
            </span>
          ))}
          {product.tastingNotes.length > 3 && (
            <span className="self-center text-[10px] text-[#1A1A18]/45 font-mono">
              +{product.tastingNotes.length - 3}
            </span>
          )}
        </div>

        {/* Pricing & Quiet-Luxury Action Controls */}
        <div className="pt-3.5 border-t border-[#1A1A18]/8 flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            {discountedPrice ? (
              <div className="flex items-baseline gap-1.5 font-sans">
                <span className="font-serif text-[1.65rem] font-light text-[#1A1A18] tracking-[-0.025em] leading-none">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-xs text-[#1A1A18]/40 line-through">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-serif text-[1.65rem] font-light text-[#1A1A18] block tracking-[-0.025em] leading-none">
                ${product.price.toFixed(2)}
              </span>
            )}
            <div className="text-[10px] font-sans uppercase tracking-[0.06em] text-[#1A1A18]/45 mt-1 truncate">
              {product.category === 'beans' ? '340g Whole Bean' : 'Single Extraction'}
            </div>
          </div>

          {/* Action Buttons Cluster */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onExploreGallery && (
              <motion.button
                type="button"
                whileHover={{ rotate: 15, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onExploreGallery(product)}
                title="View cupping radar & origin notes"
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-[#1A1A18]/15 text-[#9D8461] hover:border-[#9D8461] hover:bg-[#9D8461]/10 flex items-center justify-center transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.button>
            )}

            {/* Primary Dial Button */}
            <motion.button
              type="button"
              id={`customize-btn-${product.id}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onCustomize(product)}
              className="px-4 sm:px-3.5 py-2 sm:py-1.5 min-h-[38px] sm:min-h-[34px] rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#FAF8F5] text-[11px] font-sans font-semibold uppercase tracking-[0.07em] flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs group/btn"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:rotate-45" />
              <span>Dial</span>
            </motion.button>

            {/* Quick Add Button */}
            <motion.button
              type="button"
              id={`quick-add-btn-${product.id}`}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleQuickAdd}
              title={justAdded ? "Added to Bag" : "Quick Add to Bag"}
              className={`w-9 h-9 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                justAdded
                  ? 'bg-[#2D6A4F] text-white scale-105'
                  : 'bg-[#1A1A18] text-[#FAF8F5] hover:bg-[#9D8461]'
              }`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
