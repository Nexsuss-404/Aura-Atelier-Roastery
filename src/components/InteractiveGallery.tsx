import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Coffee, 
  SlidersHorizontal, 
  Scale, 
  Check, 
  ArrowRight,
  X,
  Maximize2,
  Droplets,
  Layers,
  Thermometer,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Product, RoastLevel } from '../types';
import { PRODUCTS } from '../data/coffeeData';
import { RoastCurveVisualizer } from './RoastCurveVisualizer';
import { handleImageError } from '../utils/imageFallback';
import { KineticTextRoll, KineticCounter } from './KineticTypography';

interface InteractiveGalleryProps {
  onSelectProductToOrder: (product: Product) => void;
}

export const InteractiveGallery: React.FC<InteractiveGalleryProps> = ({
  onSelectProductToOrder,
}) => {
  // Filter states
  const [selectedRoast, setSelectedRoast] = useState<string>('All');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('All');
  const [selectedProcess, setSelectedProcess] = useState<string>('All');

  // Cupping Dossier Modal state
  const [dossierProduct, setDossierProduct] = useState<Product | null>(null);

  // Active highlighted product for sensory radar deep-dive
  const singleOrigins = useMemo(
    () => PRODUCTS.filter((p) => p.origin && p.flavorProfile),
    []
  );

  const [activeProduct, setActiveProduct] = useState<Product>(singleOrigins[0] || PRODUCTS[0]);

  // Distinct lists for filters
  const roastLevels: ('All' | RoastLevel)[] = [
    'All',
    'Light',
    'Medium-Light',
    'Medium',
    'Medium-Dark',
  ];

  const origins = ['All', 'Panama', 'Ethiopia', 'Colombia', 'Kenya', 'Sumatra', 'Guatemala', 'Costa Rica'];
  const processes = ['All', 'Washed', 'Natural', 'Honey', 'Anaerobic Fermentation'];

  const filteredProducts = useMemo(() => {
    return singleOrigins.filter((item) => {
      const matchRoast = selectedRoast === 'All' || item.roastLevel === selectedRoast;
      const matchOrigin = selectedOrigin === 'All' || (item.origin && item.origin.toLowerCase().includes(selectedOrigin.toLowerCase()));
      const matchProcess = selectedProcess === 'All' || item.process === selectedProcess;
      return matchRoast && matchOrigin && matchProcess;
    });
  }, [singleOrigins, selectedRoast, selectedOrigin, selectedProcess]);

  // Ensure activeProduct stays in sync with current filtered list
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const exists = filteredProducts.some((p) => p.id === activeProduct.id);
      if (!exists) {
        setActiveProduct(filteredProducts[0]);
      }
    }
  }, [filteredProducts, activeProduct.id]);

  const [sensoryView, setSensoryView] = useState<'radar' | 'bars'>('radar');

  const profile = activeProduct.flavorProfile || {
    acidity: 3,
    sweetness: 4,
    body: 3,
    aroma: 4,
    bitterness: 2,
  };

  const radarMetrics = [
    { label: 'Acidity', value: profile.acidity, note: 'Phosphoric, crisp stone fruit' },
    { label: 'Sweetness', value: profile.sweetness, note: 'Panela, wildflower honey' },
    { label: 'Body', value: profile.body, note: 'Silky, tea-like to creamy' },
    { label: 'Aroma', value: profile.aroma, note: 'Intense florals & jasmine bloom' },
    { label: 'Balance', value: Math.max(1, Math.min(5, 6 - profile.bitterness)), note: 'Harmonious, clean cacao finish' },
  ];

  // SVG Radar calculations
  const cx = 150;
  const cy = 140;
  const maxR = 78;

  const getCoordinates = (index: number, ratio: number) => {
    const angle = ((-90 + index * 72) * Math.PI) / 180;
    const r = ratio * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const radarPolygonPoints = radarMetrics
    .map((m, i) => {
      const coord = getCoordinates(i, m.value / 5);
      return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header section with Kinetic Typography */}
      <div className="max-w-3xl space-y-2 border-b border-[#1A1A18]/10 pb-6">
        <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] block">
          Sensory Analysis & Terroir Lab
        </span>
        <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#1A1A18] tracking-[-0.03em]">
          <KineticTextRoll text="Interactive Cupping & Sensory Lab" />
        </h1>
        <p className="font-sans text-[15px] text-[#1A1A18]/70 leading-[1.65] max-w-2xl [text-wrap:pretty]">
          Examine seasonal farm-direct coffees. Calibrated 5-axis cupping radar matrices, elevation terroir, and bespoke roasting parameters dialed to preserve sweetness and volatile aromatics.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-3 font-sans text-xs shadow-2xs">
        <div className="flex items-center justify-between text-[#1A1A18]/60 uppercase tracking-[0.06em] text-[11px] font-semibold">
          <span className="flex items-center gap-1.5 text-[#1A1A18]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9D8461]" />
            Terroir & Roast Filters
          </span>
          <span className="text-[#1A1A18]/50 font-mono">
            Showing {filteredProducts.length} micro-lots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Roast level */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#1A1A18]/60 mb-1.5">
              Roast Intensity
            </label>
            <select
              value={selectedRoast}
              onChange={(e) => setSelectedRoast(e.target.value)}
              className="w-full p-2.5 rounded-full bg-[#FAF8F5] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#9D8461] transition-colors cursor-pointer"
            >
              {roastLevels.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Roast Levels' : `${r} Roast`}
                </option>
              ))}
            </select>
          </div>

          {/* Origin */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#1A1A18]/60 mb-1.5">
              Country of Origin
            </label>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full p-2.5 rounded-full bg-[#FAF8F5] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#9D8461] transition-colors cursor-pointer"
            >
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o === 'All' ? 'All Origins' : o}
                </option>
              ))}
            </select>
          </div>

          {/* Process */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#1A1A18]/60 mb-1.5">
              Processing Method
            </label>
            <select
              value={selectedProcess}
              onChange={(e) => setSelectedProcess(e.target.value)}
              className="w-full p-2.5 rounded-full bg-[#FAF8F5] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#9D8461] transition-colors cursor-pointer"
            >
              {processes.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Processes' : p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Spotlight Inspector + Selection Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 cols: Interactive Sensory Inspector Card */}
        <div className="lg:col-span-7 bg-white border border-[#1A1A18]/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A18]/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.06em]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A18] text-[#FAF8F5]">
                  {activeProduct.roastLevel} Roast
                </span>
                <span className="px-2.5 py-0.5 rounded-full border border-[#1A1A18]/15 text-[#1A1A18]">
                  {activeProduct.process}
                </span>
                {activeProduct.isDailySpecial && (
                  <span className="px-2.5 py-0.5 rounded-full border border-[#9D8461]/40 text-[#9D8461]">
                    Special -{activeProduct.specialDiscountPercent}%
                  </span>
                )}
              </div>
              <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#1A1A18] tracking-[-0.02em]">
                {activeProduct.name}
              </h2>
              <p className="font-sans text-[13px] text-[#1A1A18]/70 mt-1">{activeProduct.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDossierProduct(activeProduct)}
                title="Open Complete Cupping Dossier"
                className="p-3 rounded-full border border-[#1A1A18]/15 text-[#1A1A18] hover:border-[#9D8461] hover:text-[#9D8461] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </motion.button>

              <motion.button
                id="gallery-order-inspect-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onSelectProductToOrder(activeProduct)}
                className="px-6 py-3 min-h-[44px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] hover:bg-[#2A2622] font-sans text-xs font-semibold uppercase tracking-[0.08em] flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
              >
                <Coffee className="w-3.5 h-3.5 text-[#9D8461]" />
                <span>Order Harvest • ${activeProduct.price.toFixed(2)}</span>
              </motion.button>
            </div>
          </div>

          {/* Terroir breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
            <div className="p-3.5 rounded-2xl border border-[#1A1A18]/10 bg-[#FAF8F5]">
              <span className="text-[10px] uppercase tracking-wider text-[#1A1A18]/50 block font-semibold">Origin</span>
              <span className="font-semibold text-xs text-[#1A1A18] line-clamp-1 mt-0.5">
                {activeProduct.origin}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#1A1A18]/10 bg-[#FAF8F5]">
              <span className="text-[10px] uppercase tracking-wider text-[#1A1A18]/50 block font-semibold">Elevation</span>
              <span className="font-semibold text-xs text-[#1A1A18] mt-0.5">
                {activeProduct.altitude || '1,800m - 2,200m'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#1A1A18]/10 bg-[#FAF8F5]">
              <span className="text-[10px] uppercase tracking-wider text-[#1A1A18]/50 block font-semibold">Process</span>
              <span className="font-semibold text-xs text-[#1A1A18] line-clamp-1 mt-0.5">
                {activeProduct.process || 'Washed'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl border border-[#1A1A18]/10 bg-[#FAF8F5]">
              <span className="text-[10px] uppercase tracking-wider text-[#9D8461] block font-semibold">SCA Score</span>
              <span className="font-semibold text-xs text-[#9D8461] mt-0.5">
                89.5+ Specialty
              </span>
            </div>
          </div>

          {/* Interactive Flavor Matrix */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif text-2xl font-light text-[#1A1A18] flex items-center gap-2 tracking-[-0.015em]">
                <Sparkles className="w-4 h-4 text-[#9D8461]" />
                Sensory Flavor Profile & Cupping Lab
              </h3>
              <div className="flex items-center p-0.5 rounded-full border border-[#1A1A18]/15 bg-[#FAF8F5] font-sans text-[11px] font-semibold uppercase tracking-[0.04em]">
                <button
                  type="button"
                  onClick={() => setSensoryView('radar')}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    sensoryView === 'radar'
                      ? 'bg-[#1A1A18] text-[#FAF8F5]'
                      : 'text-[#1A1A18]/60 hover:text-[#1A1A18]'
                  }`}
                >
                  Radar Web
                </button>
                <button
                  type="button"
                  onClick={() => setSensoryView('bars')}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    sensoryView === 'bars'
                      ? 'bg-[#1A1A18] text-[#FAF8F5]'
                      : 'text-[#1A1A18]/60 hover:text-[#1A1A18]'
                  }`}
                >
                  Calibrated Bars
                </button>
              </div>
            </div>

            {/* Radar / Bars Graphic */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#1A1A18]/8">
              {sensoryView === 'radar' ? (
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                  {/* SVG Radar */}
                  <div className="relative w-[300px] h-[280px]">
                    <svg viewBox="0 0 300 280" className="w-full h-full overflow-visible">
                      {/* Concentric grid rings */}
                      {[0.2, 0.4, 0.6, 0.8, 1.0].map((ringRatio) => {
                        const ringPoints = [0, 1, 2, 3, 4]
                          .map((idx) => {
                            const c = getCoordinates(idx, ringRatio);
                            return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
                          })
                          .join(' ');
                        return (
                          <polygon
                            key={ringRatio}
                            points={ringPoints}
                            fill="none"
                            stroke="#1A1A18"
                            strokeOpacity={ringRatio === 1 ? 0.2 : 0.08}
                            strokeWidth={ringRatio === 1 ? 1.5 : 1}
                          />
                        );
                      })}

                      {/* Axis lines */}
                      {[0, 1, 2, 3, 4].map((idx) => {
                        const endpoint = getCoordinates(idx, 1.0);
                        return (
                          <line
                            key={idx}
                            x1={cx}
                            y1={cy}
                            x2={endpoint.x}
                            y2={endpoint.y}
                            stroke="#1A1A18"
                            strokeOpacity="0.12"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Morphing Radar Area */}
                      <motion.polygon
                        initial={false}
                        animate={{ points: radarPolygonPoints }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        fill="#9D8461"
                        fillOpacity="0.25"
                        stroke="#9D8461"
                        strokeWidth="2.5"
                      />

                      {/* Radar vertex dots */}
                      {radarMetrics.map((m, idx) => {
                        const pt = getCoordinates(idx, m.value / 5);
                        return (
                          <circle
                            key={m.label}
                            cx={pt.x}
                            cy={pt.y}
                            r="4.5"
                            fill="#1A1A18"
                            stroke="#FAF8F5"
                            strokeWidth="2"
                          />
                        );
                      })}

                      {/* Axis Labels */}
                      {radarMetrics.map((m, idx) => {
                        const labelCoord = getCoordinates(idx, 1.25);
                        return (
                          <text
                            key={m.label}
                            x={labelCoord.x}
                            y={labelCoord.y + 4}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="600"
                            fontFamily="sans-serif"
                            fill="#1A1A18"
                            opacity="0.8"
                          >
                            {m.label}
                          </text>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Metrics summary list */}
                  <div className="space-y-3 font-sans text-xs w-full sm:w-56">
                    <span className="text-[10px] uppercase font-semibold text-[#9D8461] tracking-wider block">
                      Cupping Calibrations (1-5)
                    </span>
                    {radarMetrics.map((metric) => (
                      <div key={metric.label} className="border-b border-[#1A1A18]/8 pb-1.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-semibold text-[#1A1A18]">{metric.label}</span>
                          <span className="font-mono text-[#9D8461] font-semibold">{metric.value}/5</span>
                        </div>
                        <span className="text-[10px] text-[#1A1A18]/50 block">{metric.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 font-sans text-xs">
                  {radarMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span className="text-[#1A1A18]">{metric.label}</span>
                        <span className="text-[#9D8461] font-mono">{metric.value}/5</span>
                      </div>
                      <div className="h-2 w-full bg-[#1A1A18]/8 rounded-full overflow-hidden">
                        <motion.div
                          key={`${activeProduct.id}-${metric.label}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(metric.value / 5) * 100}%` }}
                          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full bg-gradient-to-r from-[#9D8461] to-[#1A1A18] rounded-full"
                        />
                      </div>
                      <div className="text-[10px] text-[#1A1A18]/50">{metric.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tasting Note Bubbles */}
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] block">
              Cupping Descriptors
            </span>
            <div className="flex flex-wrap gap-1.5 font-sans text-[11px] text-[#1A1A18]">
              {activeProduct.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 rounded-full border border-[#1A1A18]/12 bg-[#FAF8F5] font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Artisanal Brew Guide if available */}
          {activeProduct.brewGuide && (
            <div className="p-4 rounded-2xl border border-[#1A1A18]/10 bg-[#FAF8F5] space-y-2 font-sans text-xs">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9D8461]">
                <Scale className="w-3.5 h-3.5 text-[#9D8461]" />
                Roastery Brew Guide: {activeProduct.brewGuide.method}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#1A1A18] pt-1">
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-semibold">Water Temp</span>
                  <span className="font-semibold font-mono">{activeProduct.brewGuide.waterTemp}</span>
                </div>
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-semibold">Ratio</span>
                  <span className="font-semibold font-mono">{activeProduct.brewGuide.ratio}</span>
                </div>
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-semibold">Grind Size</span>
                  <span className="font-semibold">{activeProduct.brewGuide.grindSize}</span>
                </div>
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-semibold">Brew Time</span>
                  <span className="font-semibold font-mono">{activeProduct.brewGuide.brewTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 cols: Scrollable list of coffees with layout animations */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#1A1A18]/10">
            <h3 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.015em]">
              Select Harvest Lot
            </h3>
            <span className="font-sans text-[11px] uppercase tracking-[0.06em] text-[#1A1A18]/50 font-semibold">
              Click to inspect
            </span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1.5 scrollbar-thin">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-[#1A1A18]/10 space-y-3">
                <Coffee className="w-8 h-8 text-[#9D8461] mx-auto opacity-70" />
                <h4 className="font-serif text-xl font-light text-[#1A1A18]">
                  No micro-lots match your filter
                </h4>
                <p className="font-sans text-xs text-[#1A1A18]/60">
                  Try clearing the roast level, origin, or processing filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRoast('All');
                    setSelectedOrigin('All');
                    setSelectedProcess('All');
                  }}
                  className="px-5 py-2 rounded-full border border-[#1A1A18] text-[#1A1A18] text-xs font-sans font-semibold uppercase tracking-[0.06em] hover:bg-[#1A1A18] hover:text-[#FAF8F5] transition-all cursor-pointer shadow-2xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => {
                  const isSelected = activeProduct.id === p.id;
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ y: -2 }}
                      id={`gallery-item-${p.id}`}
                      onClick={() => setActiveProduct(p)}
                      className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#1A1A18] bg-[#FAF8F5] shadow-xs'
                          : 'border-[#1A1A18]/10 bg-white hover:border-[#9D8461]/30 hover:bg-[#FAF9F7]'
                      }`}
                    >
                      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-[#F2ECE4] border border-[#1A1A18]/10">
                        <img
                          src={p.image}
                          alt={p.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        {p.roastLevel && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-sm bg-black/75 backdrop-blur-xs text-[9px] font-sans font-medium uppercase tracking-[0.04em] text-[#FAF8F5]">
                            {p.roastLevel}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-[10px] uppercase tracking-[0.08em] text-[#9D8461] font-sans font-semibold truncate">
                              {p.origin || p.category}
                            </span>
                            {p.altitude && (
                              <span className="hidden sm:inline font-mono text-[10px] text-[#1A1A18]/40 truncate">
                                • {p.altitude}
                              </span>
                            )}
                          </div>
                          <span className="font-serif text-base font-light text-[#1A1A18] shrink-0 tracking-[-0.01em]">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>

                        <h4 className="font-serif text-[1.05rem] font-normal text-[#1A1A18] group-hover:text-[#9D8461] transition-colors truncate tracking-[-0.015em]">
                          {p.name}
                        </h4>

                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <p className="font-sans text-[12px] text-[#1A1A18]/65 line-clamp-1">
                            {p.tastingNotes.slice(0, 3).join(' • ')}
                          </p>
                          {isSelected && (
                            <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#1A1A18] text-[#FAF8F5] text-[9.5px] font-sans font-semibold uppercase tracking-[0.06em]">
                              Active Lot
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Thermodynamic Roasting Telemetry Curve Section */}
      <RoastCurveVisualizer
        roastLevel={activeProduct.roastLevel}
        lotName={activeProduct.name}
      />

      {/* ================================================================= */}
      {/* CUpping Lot Dossier Modal                                        */}
      {/* ================================================================= */}
      <AnimatePresence>
        {dossierProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDossierProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-[#1A1A18]/65 backdrop-blur-md"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-[0_32px_80px_rgba(26,26,24,0.3)] border border-[#9D8461]/30 overflow-hidden my-auto max-h-[90vh] flex flex-col"
            >
              {/* Top ambient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#9D8461] to-transparent" />

              {/* Dossier Header */}
              <div className="p-4 sm:p-6 border-b border-[#1A1A18]/8 bg-white/90 backdrop-blur-xs flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#1A1A18]/10 bg-[#F4EFEA] shrink-0">
                    <img
                      src={dossierProduct.image}
                      alt={dossierProduct.name}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 py-0.5 rounded-full bg-[#9D8461]/12 text-[#9D8461] border border-[#9D8461]/20">
                      Single-Origin Cupping Dossier
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A18] mt-1">
                      {dossierProduct.name}
                    </h3>
                    <p className="font-sans text-xs text-[#1A1A18]/60">
                      {dossierProduct.origin} • {dossierProduct.altitude || 'High Elevation'} • {dossierProduct.process}
                    </p>
                  </div>
                </div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDossierProduct(null)}
                  className="p-2 text-[#1A1A18]/50 hover:text-[#1A1A18] rounded-full hover:bg-[#1A1A18]/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Dossier Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 font-sans">
                {/* Cupping Score Highlight */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#9D8461]/15 via-white to-[#FAF8F5] border border-[#9D8461]/25 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#9D8461] block">
                      Certified Specialty Cupping Score
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl font-light text-[#1A1A18]">
                      91.25 / 100 Points
                    </span>
                    <p className="text-[11px] text-[#1A1A18]/60 mt-0.5">
                      Graded under strict SCA cupping protocol • Outstanding Specialty Micro-Lot
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#9D8461] text-[#FAF8F5] flex items-center justify-center font-serif text-lg font-light shadow-xs shrink-0">
                    SCA
                  </div>
                </div>

                {/* Terroir Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-white">
                    <span className="text-[10px] text-[#1A1A18]/50 uppercase font-semibold block">Elevation</span>
                    <span className="font-semibold text-xs text-[#1A1A18]">{dossierProduct.altitude || '1,950 MASL'}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-white">
                    <span className="text-[10px] text-[#1A1A18]/50 uppercase font-semibold block">Varietal</span>
                    <span className="font-semibold text-xs text-[#1A1A18]">Geisha / Heirloom</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-white">
                    <span className="text-[10px] text-[#1A1A18]/50 uppercase font-semibold block">Roast Level</span>
                    <span className="font-semibold text-xs text-[#1A1A18]">{dossierProduct.roastLevel}</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-white">
                    <span className="text-[10px] text-[#1A1A18]/50 uppercase font-semibold block">Harvest Season</span>
                    <span className="font-semibold text-xs text-[#1A1A18]">Direct Current Crop</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-white">
                    <span className="text-[10px] text-[#1A1A18]/50 uppercase font-semibold block">Soil Condition</span>
                    <span className="font-semibold text-xs text-[#1A1A18]">Volcanic Loam</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-white">
                    <span className="text-[10px] text-[#1A1A18]/50 uppercase font-semibold block">Water Activity</span>
                    <span className="font-semibold text-xs text-[#1A1A18]">0.54 aw (optimal)</span>
                  </div>
                </div>

                {/* Tasting Notes */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9D8461] block">
                    Certified Sensory Descriptors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {dossierProduct.tastingNotes.map((note) => (
                      <span
                        key={note}
                        className="px-3.5 py-1 rounded-full border border-[#9D8461]/30 bg-white text-[#1A1A18] text-xs font-medium shadow-2xs"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Full Editorial Note */}
                <div className="p-4 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1A1A18]/50 block">
                    Head Roaster Note
                  </span>
                  <p className="text-xs text-[#1A1A18]/80 leading-relaxed [text-wrap:pretty]">
                    {dossierProduct.description} Sourced through direct ethical trade partnerships at 180% above Fair Trade minimums.
                  </p>
                </div>
              </div>

              {/* Dossier Footer */}
              <div className="p-4 sm:p-6 border-t border-[#1A1A18]/8 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.06em] text-[#1A1A18]/50 block">
                    Harvest Price
                  </span>
                  <span className="font-serif text-2xl font-light text-[#1A1A18]">
                    ${dossierProduct.price.toFixed(2)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const prod = dossierProduct;
                    setDossierProduct(null);
                    onSelectProductToOrder(prod);
                  }}
                  className="px-6 py-3 min-h-[44px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#FAF8F5] hover:bg-[#2A2622] font-sans text-xs font-semibold uppercase tracking-[0.08em] flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Coffee className="w-4 h-4 text-[#9D8461]" />
                  <span>Dial Extraction for this Lot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
