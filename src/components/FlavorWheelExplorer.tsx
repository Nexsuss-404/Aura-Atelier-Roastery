import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coffee, Compass, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/coffeeData';
import { soundscape } from '../utils/audioSoundscape';
import { handleImageError } from '../utils/imageFallback';

interface FlavorWheelExplorerProps {
  onCustomize: (product: Product) => void;
  onExploreGallery?: (product: Product) => void;
}

interface FlavorCategory {
  id: string;
  name: string;
  subnotes: string[];
  color: string;
  border: string;
  bgLight: string;
  associatedLots: string[]; // matching product IDs
  story: string;
}

const FLAVOR_CATEGORIES: FlavorCategory[] = [
  {
    id: 'floral',
    name: 'Florals & Botanicals',
    subnotes: ['White Jasmine', 'Orange Blossom', 'Earl Grey Bergamot', 'Chamomile Tea'],
    color: '#D4AF37',
    border: 'border-[#D4AF37]/40',
    bgLight: 'bg-[#D4AF37]/10',
    associatedLots: ['ethiopia-yirgacheffe-anaerobic', 'panama-geisha-estate'],
    story: 'High-altitude volcanic soils produce delicate volatile monoterpenes and floral essences, elevated through slow, cold fermentations.',
  },
  {
    id: 'fruit',
    name: 'Stone Fruit & Citrus',
    subnotes: ['Yellow Peach', 'Blood Orange', 'Meyer Lemon', 'Candied Apricot'],
    color: '#E07A5F',
    border: 'border-[#E07A5F]/40',
    bgLight: 'bg-[#E07A5F]/10',
    associatedLots: ['colombia-pink-bourbon', 'ethiopia-yirgacheffe-anaerobic'],
    story: 'Crisp phosphoric and malic acidity reminiscent of orchard stone fruit, preserved by our low-temperature convection roasting profiles.',
  },
  {
    id: 'sweet',
    name: 'Honey & Caramels',
    subnotes: ['Wildflower Honey', 'Panela Cane Sugar', 'Brown Butter', 'Salted Toffee'],
    color: '#9D8461',
    border: 'border-[#9D8461]/40',
    bgLight: 'bg-[#9D8461]/10',
    associatedLots: ['house-espresso-blend', 'kyoto-cold-brew', 'panama-geisha-estate'],
    story: 'Slow Maillard reaction caramelizes natural sucrose within the bean embryo, creating a velvet mouthfeel with natural milk pairing synergy.',
  },
  {
    id: 'cacao',
    name: 'Raw Cacao & Earth',
    subnotes: ['72% Dark Cacao', 'Black Sesame', 'Applewood Smoke', 'Nutmeg Spice'],
    color: '#6F4E37',
    border: 'border-[#6F4E37]/40',
    bgLight: 'bg-[#6F4E37]/10',
    associatedLots: ['kerinci-obsidian', 'house-espresso-blend'],
    story: 'Deep, resonant terroir from dense volcanic micro-climates, generating dark cocoa polyphenols and comforting savory spice.',
  },
];

export const FlavorWheelExplorer: React.FC<FlavorWheelExplorerProps> = ({
  onCustomize,
  onExploreGallery,
}) => {
  const [activeCategory, setActiveCategory] = useState<FlavorCategory>(FLAVOR_CATEGORIES[0]);
  const [selectedSubnote, setSelectedSubnote] = useState<string>(FLAVOR_CATEGORIES[0].subnotes[0]);

  const matchedCoffees = PRODUCTS.filter((p) =>
    activeCategory.associatedLots.includes(p.id) ||
    p.tastingNotes.some((n) => n.toLowerCase().includes(selectedSubnote.toLowerCase()) || activeCategory.subnotes.some((sn) => n.toLowerCase().includes(sn.toLowerCase())))
  );

  return (
    <section className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-white border border-[#1A1A18]/10 space-y-8 shadow-2xs">
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#9D8461]" />
          Sensory Sommelier
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A18] tracking-[-0.025em]">
          Interactive Cupping Flavor Matrix
        </h2>
        <p className="font-sans text-[14px] text-[#1A1A18]/70 leading-relaxed [text-wrap:pretty]">
          Navigate the roastery flavor spectrum. Select sensory profiles to discover corresponding harvest micro-lots, botanical pairings, and extraction guides.
        </p>
      </div>

      {/* Flavor Quadrants Tabs with Kinetic Highlighting */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {FLAVOR_CATEGORIES.map((cat) => {
          const isSelected = activeCategory.id === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setSelectedSubnote(cat.subnotes[0]);
                soundscape.playHapticClick(520);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? `${cat.border} ${cat.bgLight} shadow-xs ring-1 ring-[#1A1A18]/15`
                  : 'border-[#1A1A18]/10 bg-[#FAF8F5] hover:border-[#1A1A18]/30 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-[10px] font-mono uppercase text-[#1A1A18]/45">
                  0{FLAVOR_CATEGORIES.indexOf(cat) + 1}
                </span>
              </div>
              <div>
                <h4 className="font-serif text-base font-normal text-[#1A1A18] mt-2">
                  {cat.name}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Flavor Deep Dive Panel */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#1A1A18]/8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A18]/10 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] text-[#9D8461]">
              Flavor Descriptors in {activeCategory.name}
            </span>
            <h3 className="font-serif text-2xl font-light text-[#1A1A18]">
              {selectedSubnote}
            </h3>
            <p className="font-sans text-xs text-[#1A1A18]/70 max-w-xl leading-relaxed">
              {activeCategory.story}
            </p>
          </div>

          {/* Subnote Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {activeCategory.subnotes.map((subnote) => {
              const isSelected = selectedSubnote === subnote;
              return (
                <button
                  key={subnote}
                  type="button"
                  onClick={() => {
                    setSelectedSubnote(subnote);
                    soundscape.playHapticClick(640);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A18] text-[#FAF8F5] shadow-xs'
                      : 'border border-[#1A1A18]/15 bg-white text-[#1A1A18]/70 hover:border-[#1A1A18]/40 hover:text-[#1A1A18]'
                  }`}
                >
                  {subnote}
                </button>
              );
            })}
          </div>
        </div>

        {/* Matched Coffees Grid */}
        <div className="space-y-3">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.06em] text-[#1A1A18]/60 block">
            Harvest Micro-Lots Exhibiting This Characteristic:
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedCoffees.map((product) => (
              <motion.div
                key={product.id}
                layout
                whileHover={{ y: -3 }}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1A1A18]/10 hover:border-[#9D8461]/40 transition-all flex items-center justify-between gap-4 shadow-2xs group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F2ECE4] border border-[#1A1A18]/10 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-[#9D8461] uppercase block truncate">
                      {product.origin || 'Single Origin'} • {product.altitude || 'High Grown'}
                    </span>
                    <h4 className="font-serif text-base font-normal text-[#1A1A18] truncate group-hover:text-[#9D8461] transition-colors">
                      {product.name}
                    </h4>
                    <p className="font-sans text-[11px] text-[#1A1A18]/60 truncate">
                      {product.tastingNotes.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCustomize(product)}
                    className="px-4 py-2 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] hover:bg-[#2A2622] text-xs font-sans font-semibold uppercase tracking-[0.06em] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <Coffee className="w-3.5 h-3.5 text-[#9D8461]" />
                    <span>Dial</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
