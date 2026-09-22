import React from 'react';
import { motion } from 'motion/react';
import { 
  Coffee, 
  ArrowRight, 
  Compass, 
  Sparkles,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { Product, PageType } from '../types';
import { PRODUCTS } from '../data/coffeeData';
import { ProductCard } from './ProductCard';
import { TerroirStoryline } from './TerroirStoryline';
import {
  KineticHeroHeadline,
  KineticParagraphReveal,
  KineticMetric,
  KineticTextRoll
} from './KineticTypography';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
  onCustomize: (product: Product) => void;
  onExploreGallery: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onCustomize,
  onExploreGallery,
}) => {
  const featuredProducts = PRODUCTS.slice(0, 6);
  const dailySpecial = PRODUCTS.find((p) => p.isDailySpecial) || PRODUCTS[0];
  const kerinciProduct = PRODUCTS.find((p) => p.id === 'kerinci-obsidian') || PRODUCTS[1];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Variation 5 Exact Hero Architecture */}
      <section className="border-b border-[#1A1A18]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(85vh-5rem)]">
          {/* Left Column: Hero Section (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 p-5 sm:p-10 lg:p-14 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#1A1A18]/10"
          >
            <div className="mb-4 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: '0%' }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.06em] text-[#1A1A18]/50 uppercase will-change-transform"
              >
                <span>Atelier Harvest</span>
                <span className="w-6 h-px bg-[#1A1A18]/25" />
                <span>Single-Origin No. 08</span>
              </motion.div>
            </div>

            <div className="mb-6 sm:mb-7">
              <KineticHeroHeadline
                firstLine="Dialed for"
                accentWord="clarity."
                className="hero-display-headline text-5xl sm:text-7xl md:text-8xl lg:text-[5.75rem] xl:text-[6.75rem] text-[#1A1A18]"
                delay={0.06}
              />
            </div>

            <KineticParagraphReveal
              text="From high-altitude Ethiopian anaerobic micro-lots to hand-pulled velvet espresso. Handcrafted on demand in our carbon-neutral atelier."
              className="font-sans text-[15px] sm:text-[17px] text-[#1A1A18]/75 leading-[1.65] max-w-[42ch] mb-7 sm:mb-9"
              delay={0.24}
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <motion.button
                id="hero-order-menu-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('menu')}
                className="px-7 sm:px-8 py-3 sm:py-3.5 min-h-[44px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] hover:bg-[#2A2622] transition-all font-sans text-xs font-semibold tracking-[0.08em] uppercase flex items-center justify-center cursor-pointer shadow-xs"
              >
                <span>Order Drinks</span>
              </motion.button>

              <motion.button
                id="hero-gallery-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onNavigate('gallery')}
                className="px-6 sm:px-7 py-3 sm:py-3.5 min-h-[44px] rounded-full border border-[#1A1A18]/25 hover:border-[#1A1A18] hover:bg-white/60 text-[#1A1A18] transition-all font-sans text-xs font-semibold tracking-[0.08em] uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#9D8461]" />
                <span>Explore Lab</span>
              </motion.button>
            </div>

            {/* Technical Metadata Bar */}
            <div className="pt-7 sm:pt-9 mt-7 sm:mt-9 border-t border-[#1A1A18]/10 grid grid-cols-3 gap-2 sm:gap-6">
              <KineticMetric value="89.5+" label="SCA Score" delay={0.36} />
              <KineticMetric value="100%" label="Direct Trade" delay={0.42} />
              <KineticMetric value="~12m" label="Bar Wait" delay={0.48} />
            </div>
          </motion.div>

          {/* Right Column: Details Section with Dot Grid (6 cols) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-6 p-5 sm:p-10 lg:p-14 flex flex-col justify-around bg-dot-grid-lg"
          >
            {/* Card 1: Daily Special */}
            <div className="py-6 sm:py-8 border-b border-[#1A1A18]/10 max-w-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                  Seasonal Feature
                </span>
                {dailySpecial.specialDiscountPercent && (
                  <span className="font-sans text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-[#9D8461]/40 text-[#9D8461]">
                    Curated -{dailySpecial.specialDiscountPercent}%
                  </span>
                )}
              </div>

              <div 
                onClick={() => onCustomize(dailySpecial)}
                className="group cursor-pointer"
              >
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A18] group-hover:text-[#9D8461] transition-colors tracking-[-0.015em]">
                  {dailySpecial.name}
                </h3>
                <p className="font-sans text-[14px] text-[#1A1A18]/70 leading-[1.6] max-w-[45ch] pt-1.5 [text-wrap:pretty]">
                  {dailySpecial.description}
                </p>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-sans text-xs text-[#1A1A18]/80 font-medium">
                    ${dailySpecial.price.toFixed(2)} • {dailySpecial.origin || 'Single Origin'}
                  </span>
                  <span className="font-sans text-xs font-medium text-[#9D8461] group-hover:underline">
                    Customize drink
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Roast Profile */}
            <div className="py-6 sm:py-8 max-w-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                  Roast Profile
                </span>
                <span className="font-sans text-[11px] text-[#1A1A18]/50 font-medium">
                  Lot 449-B
                </span>
              </div>

              <div 
                onClick={() => onExploreGallery(kerinciProduct)}
                className="group cursor-pointer"
              >
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#1A1A18] group-hover:text-[#9D8461] transition-colors tracking-[-0.015em]">
                  Sumatra Kerinci Obsidian
                </h3>
                <p className="font-sans text-[14px] text-[#1A1A18]/70 leading-[1.6] max-w-[45ch] pt-1.5 [text-wrap:pretty]">
                  Notes of black sesame, raw dark cacao, and smoked sea salt. Pulled as an Obsidian dark espresso for profound terroir depth.
                </p>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-sans text-xs text-[#1A1A18]/80 font-medium">
                    1,750m ASL • Anaerobic Natural
                  </span>
                  <span className="font-sans text-xs font-medium text-[#9D8461] group-hover:underline">
                    View cupping matrix
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Artisanal Offerings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#1A1A18]/10">
          <div className="space-y-1">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] block">
              Seasonal Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A18] tracking-[-0.03em]">
              <KineticTextRoll text="Featured Roaster Extractions" />
            </h2>
            <p className="font-sans text-[14px] text-[#1A1A18]/65 leading-[1.6]">
              Hand-selected micro-lots, cold extractions, and single-origin whole bean roasts.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="font-sans text-xs font-medium uppercase tracking-[0.08em] text-[#1A1A18] hover:text-[#9D8461] self-start sm:self-auto min-h-[44px] flex items-center transition-colors cursor-pointer"
          >
            <span>View full menu</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onCustomize={onCustomize}
              onExploreGallery={onExploreGallery}
            />
          ))}
        </div>
      </section>

      {/* The Craft Storyline: From Soil to Cup */}
      <TerroirStoryline onNavigate={onNavigate} />

      {/* Interactive Highlights: Cupping Lab & Atelier Order */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Cupping Lab Banner */}
          <div className="p-6 sm:p-10 rounded-2xl border border-[#1A1A18]/15 bg-[#F8F7F4] space-y-4 flex flex-col justify-between relative overflow-hidden bg-dot-grid">
            <div className="space-y-2">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Sensory Lab
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A18] tracking-[-0.02em]">
                Interactive Flavor Radar & Terroir Lab
              </h3>
              <p className="font-sans text-[14px] text-[#1A1A18]/70 leading-[1.6] max-w-[50ch] [text-wrap:pretty]">
                Explore calibrated 5-point radar cupping pentagons, altitude geography, and fermentation biology for all seasonal harvest offerings.
              </p>
            </div>

            <button
              onClick={() => onNavigate('gallery')}
              className="self-start px-6 py-2.5 min-h-[44px] flex items-center justify-center rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F8F7F4] transition-all font-sans text-xs font-medium tracking-[0.06em] uppercase cursor-pointer"
            >
              <span>Launch Cupping Lab</span>
            </button>
          </div>

          {/* Atelier Counter Bar Banner */}
          <div className="p-6 sm:p-10 rounded-2xl border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                Atelier Service
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#F8F7F4] tracking-[-0.02em]">
                Precision Recipe Dialing & Line Skip
              </h3>
              <p className="font-sans text-[14px] text-[#F8F7F4]/70 leading-[1.6] max-w-[50ch] [text-wrap:pretty]">
                Choose espresso extraction profiles, microfoam temperatures, and artisan botanical syrups. Ready for instant counter pickup or local roastery courier dispatch.
              </p>
            </div>

            <button
              onClick={() => onNavigate('menu')}
              className="self-start px-6 py-2.5 min-h-[44px] flex items-center justify-center rounded-full border border-[#F8F7F4] text-[#F8F7F4] hover:bg-[#F8F7F4] hover:text-[#1A1A18] transition-all font-sans text-xs font-medium tracking-[0.06em] uppercase cursor-pointer"
            >
              <span>Explore Drink Menu</span>
            </button>
          </div>
        </div>
      </section>

      {/* Atelier Philosophy Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
        <div className="p-6 sm:p-10 lg:p-12 rounded-2xl border border-[#1A1A18]/10 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              01 / Sourcing
            </span>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#9D8461]" />
              <h4 className="font-serif text-xl font-normal text-[#1A1A18] tracking-[-0.01em]">
                High-Altitude Terroir
              </h4>
            </div>
            <p className="font-sans text-[13px] text-[#1A1A18]/70 leading-[1.6] [text-wrap:pretty]">
              We contract strictly high-elevation micro-lots above 1,700m ASL, partnering with independent producers for maximum cup complexity.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              02 / Roasting
            </span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#9D8461]" />
              <h4 className="font-serif text-xl font-normal text-[#1A1A18] tracking-[-0.01em]">
                Zero-Emission Roasting
              </h4>
            </div>
            <p className="font-sans text-[13px] text-[#1A1A18]/70 leading-[1.6] [text-wrap:pretty]">
              Our Loring S35 convection roaster recirculates superheated air, drastically lowering emissions while preserving volatile aromatics.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              03 / Extraction
            </span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#9D8461]" />
              <h4 className="font-serif text-xl font-normal text-[#1A1A18] tracking-[-0.01em]">
                Refractometer Dialing
              </h4>
            </div>
            <p className="font-sans text-[13px] text-[#1A1A18]/70 leading-[1.6] [text-wrap:pretty]">
              Every morning our baristas measure Total Dissolved Solids (TDS) and extraction percentage before serving a single cup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
