import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Coffee, 
  SlidersHorizontal, 
  Scale, 
  Check, 
  ArrowRight
} from 'lucide-react';
import { Product, RoastLevel } from '../types';
import { PRODUCTS } from '../data/coffeeData';
import { RoastCurveVisualizer } from './RoastCurveVisualizer';
import { handleImageError } from '../utils/imageFallback';

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
      {/* Header section */}
      <div className="max-w-3xl space-y-2 border-b border-[#1A1A18]/10 pb-6">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
          Sensory Analysis & Terroir Lab
        </span>
        <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#1A1A18] tracking-[-0.03em]">
          Interactive Cupping & Sensory Lab
        </h1>
        <p className="font-sans text-[15px] text-[#1A1A18]/70 leading-[1.65] max-w-2xl [text-wrap:pretty]">
          Examine seasonal farm-direct coffees. Calibrated 5-axis cupping radar matrices, elevation terroir, and bespoke roasting parameters dialed to preserve sweetness and volatile aromatics.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-3 font-sans text-xs">
        <div className="flex items-center justify-between text-[#1A1A18]/60 uppercase tracking-[0.06em] text-[11px] font-medium">
          <span className="flex items-center gap-1.5 text-[#1A1A18]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9D8461]" />
            Terroir & Roast Filters
          </span>
          <span className="text-[#1A1A18]/50">
            Showing {filteredProducts.length} micro-lots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Roast level */}
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/55 mb-1.5">
              Roast Intensity
            </label>
            <select
              value={selectedRoast}
              onChange={(e) => setSelectedRoast(e.target.value)}
              className="w-full p-2.5 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
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
            <label className="block text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/55 mb-1.5">
              Country of Origin
            </label>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full p-2.5 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
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
            <label className="block text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/55 mb-1.5">
              Processing Method
            </label>
            <select
              value={selectedProcess}
              onChange={(e) => setSelectedProcess(e.target.value)}
              className="w-full p-2.5 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
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
        <div className="lg:col-span-7 bg-white border border-[#1A1A18]/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1A1A18]/10">
            <div>
              <div className="flex items-center gap-2 mb-2 font-sans text-[10px] font-medium uppercase tracking-[0.04em]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#1A1A18] text-[#F8F7F4]">
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

            <button
              id="gallery-order-inspect-btn"
              onClick={() => onSelectProductToOrder(activeProduct)}
              className="px-6 py-3 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] hover:bg-transparent hover:text-[#1A1A18] font-sans text-xs font-medium uppercase tracking-[0.06em] flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer shadow-xs"
            >
              <Coffee className="w-3.5 h-3.5 text-[#9D8461]" />
              <span>Order Harvest • ${activeProduct.price.toFixed(2)}</span>
            </button>
          </div>

          {/* Terroir breakdown cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans text-xs">
            <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-[#F8F7F4]">
              <span className="text-[10px] uppercase tracking-wider text-[#1A1A18]/50 block font-medium">Origin</span>
              <span className="font-semibold text-xs text-[#1A1A18] line-clamp-1">
                {activeProduct.origin}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-[#F8F7F4]">
              <span className="text-[10px] uppercase tracking-wider text-[#1A1A18]/50 block font-medium">Elevation</span>
              <span className="font-semibold text-xs text-[#1A1A18]">
                {activeProduct.altitude || '1,800m - 2,200m'}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-[#F8F7F4]">
              <span className="text-[10px] uppercase tracking-wider text-[#1A1A18]/50 block font-medium">Process</span>
              <span className="font-semibold text-xs text-[#1A1A18] line-clamp-1">
                {activeProduct.process || 'Washed'}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-[#1A1A18]/10 bg-[#F8F7F4]">
              <span className="text-[10px] uppercase tracking-wider text-[#9D8461] block font-medium">SCA Score</span>
              <span className="font-semibold text-xs text-[#9D8461]">
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
              <div className="flex items-center p-0.5 rounded-full border border-[#1A1A18]/15 bg-[#F8F7F4] font-sans text-[11px] font-medium uppercase tracking-[0.04em]">
                <button
                  type="button"
                  onClick={() => setSensoryView('radar')}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    sensoryView === 'radar'
                      ? 'bg-[#1A1A18] text-[#F8F7F4]'
                      : 'text-[#1A1A18]/60 hover:text-[#1A1A18]'
                  }`}
                >
                  Radar Pentagram
                </button>
                <button
                  type="button"
                  onClick={() => setSensoryView('bars')}
                  className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                    sensoryView === 'bars'
                      ? 'bg-[#1A1A18] text-[#F8F7F4]'
                      : 'text-[#1A1A18]/60 hover:text-[#1A1A18]'
                  }`}
                >
                  Metric Bars
                </button>
              </div>
            </div>

            <div className="bg-[#F8F7F4] p-5 sm:p-6 rounded-2xl border border-[#1A1A18]/10 space-y-4 bg-dot-grid">
              {sensoryView === 'radar' ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* SVG Spider Radar */}
                  <div className="w-full max-w-[300px] aspect-square relative flex items-center justify-center mx-auto md:mx-0">
                    <svg viewBox="0 0 300 280" className="w-full h-full">
                      {/* Concentric spider web pentagons */}
                      {[0.2, 0.4, 0.6, 0.8, 1.0].map((level) => {
                        const points = [0, 1, 2, 3, 4]
                          .map((i) => {
                            const c = getCoordinates(i, level);
                            return `${c.x.toFixed(1)},${c.y.toFixed(1)}`;
                          })
                          .join(' ');
                        return (
                          <polygon
                            key={level}
                            points={points}
                            fill="none"
                            stroke="rgba(26, 26, 24, 0.12)"
                            strokeWidth="1"
                            strokeDasharray={level === 1.0 ? 'none' : '3 3'}
                          />
                        );
                      })}

                      {/* Axis spokes */}
                      {[0, 1, 2, 3, 4].map((i) => {
                        const end = getCoordinates(i, 1.0);
                        return (
                          <line
                            key={i}
                            x1={cx}
                            y1={cy}
                            x2={end.x}
                            y2={end.y}
                            stroke="rgba(26, 26, 24, 0.12)"
                            strokeWidth="1"
                          />
                        );
                      })}

                      {/* Product Sensory Data Polygon */}
                      <polygon
                        points={radarPolygonPoints}
                        fill="#9D8461"
                        fillOpacity="0.28"
                        stroke="#1A1A18"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        className="transition-all duration-500"
                      />

                      {/* Vertices Dots */}
                      {radarMetrics.map((m, i) => {
                        const coord = getCoordinates(i, m.value / 5);
                        return (
                          <g key={m.label}>
                            <circle
                              cx={coord.x}
                              cy={coord.y}
                              r="4"
                              fill="#F8F7F4"
                              stroke="#1A1A18"
                              strokeWidth="2"
                            />
                          </g>
                        );
                      })}

                      {/* Labels at outer vertices */}
                      {radarMetrics.map((m, i) => {
                        const labelCoord = getCoordinates(i, 1.18);
                        return (
                          <text
                            key={m.label}
                            x={labelCoord.x}
                            y={labelCoord.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="text-[11px] font-sans font-medium uppercase tracking-[0.04em] fill-[#1A1A18]"
                          >
                            {m.label} ({m.value}/5)
                          </text>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Sensory Summary Breakdown List on right */}
                  <div className="flex-1 w-full space-y-2 font-sans text-xs">
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
                      Cupping Sensory Values
                    </span>
                    <div className="space-y-1.5">
                      {radarMetrics.map((m) => (
                        <div
                          key={m.label}
                          className="p-2 rounded-xl bg-white border border-[#1A1A18]/10 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium text-[#1A1A18]">{m.label}</span>
                            <span className="text-[11px] text-[#1A1A18]/50 block">{m.note}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`w-2 h-2 rounded-full ${
                                  star <= m.value ? 'bg-[#9D8461]' : 'bg-[#1A1A18]/15'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 font-sans text-xs">
                  {radarMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span className="text-[#1A1A18]">{metric.label}</span>
                        <span className="text-[#9D8461]">{metric.value}/5</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#1A1A18]/10 rounded-full overflow-hidden">
                        <motion.div
                          key={`${activeProduct.id}-${metric.label}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(metric.value / 5) * 100}%` }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                          className="h-full bg-[#1A1A18] rounded-full"
                        />
                      </div>
                      <div className="text-[11px] text-[#1A1A18]/50">{metric.note}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tasting Note Bubbles */}
          <div className="space-y-2">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              Cupping Descriptors
            </span>
            <div className="flex flex-wrap gap-1.5 font-sans text-[11px] text-[#1A1A18]">
              {activeProduct.tastingNotes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 rounded-full border border-[#1A1A18]/15 bg-[#F8F7F4] font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Artisanal Brew Guide if available */}
          {activeProduct.brewGuide && (
            <div className="p-4 rounded-2xl border border-[#1A1A18]/10 bg-[#F8F7F4] space-y-2 font-sans text-xs">
              <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                <Scale className="w-3.5 h-3.5 text-[#9D8461]" />
                Roastery Brew Guide: {activeProduct.brewGuide.method}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[#1A1A18] pt-1">
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-medium">Water Temp</span>
                  <span className="font-semibold">{activeProduct.brewGuide.waterTemp}</span>
                </div>
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-medium">Ratio</span>
                  <span className="font-semibold">{activeProduct.brewGuide.ratio}</span>
                </div>
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-medium">Grind Size</span>
                  <span className="font-semibold">{activeProduct.brewGuide.grindSize}</span>
                </div>
                <div>
                  <span className="text-[10px] block text-[#1A1A18]/50 uppercase font-medium">Brew Time</span>
                  <span className="font-semibold">{activeProduct.brewGuide.brewTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 cols: Scrollable list of coffees to click and inspect */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#1A1A18]/10">
            <h3 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.015em]">
              Select Harvest
            </h3>
            <span className="font-sans text-[11px] uppercase tracking-[0.06em] text-[#1A1A18]/50 font-medium">
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
                  className="px-5 py-2 rounded-full border border-[#1A1A18] text-[#1A1A18] text-xs font-sans font-medium uppercase tracking-[0.06em] hover:bg-[#1A1A18] hover:text-[#F8F7F4] transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isSelected = activeProduct.id === p.id;
                return (
                  <div
                    key={p.id}
                    id={`gallery-item-${p.id}`}
                    onClick={() => setActiveProduct(p)}
                    className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-[#1A1A18] bg-[#F8F7F4] shadow-xs'
                        : 'border-[#1A1A18]/10 bg-white hover:border-[#1A1A18]/30 hover:bg-[#FAF9F7]'
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
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-sm bg-black/75 backdrop-blur-xs text-[9px] font-sans font-medium uppercase tracking-[0.04em] text-[#F8F7F4]">
                          {p.roastLevel}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] uppercase tracking-[0.08em] text-[#9D8461] font-sans font-medium truncate">
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
                          <span className="shrink-0 px-2 py-0.5 rounded-full bg-[#1A1A18] text-[#F8F7F4] text-[9.5px] font-sans font-medium uppercase tracking-[0.06em]">
                            Active Lot
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Thermodynamic Roasting Telemetry Curve Section */}
      <RoastCurveVisualizer
        roastLevel={activeProduct.roastLevel}
        lotName={activeProduct.name}
      />
    </div>
  );
};
