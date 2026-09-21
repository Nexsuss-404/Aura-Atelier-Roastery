import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mountain, 
  Leaf, 
  Flame, 
  Coffee, 
  ArrowRight, 
  Sliders, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PageType } from '../types';

interface StoryChapter {
  id: string;
  step: string;
  phase: string;
  title: string;
  subtitle: string;
  originLot: string;
  altitude: string;
  keyMetricLabel: string;
  keyMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  description: string;
  tastingImpact: string;
  icon: React.ElementType;
  tag: string;
  coordinates: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'terroir',
    step: '01',
    phase: 'High-Elevation Terroir',
    title: 'The Canopy of Mount Guna',
    subtitle: 'Slow-ripening heirloom cherries at 2,150 meters above sea level',
    originLot: 'Yirgacheffe Micro-Lot 449-B',
    altitude: '2,150m ASL',
    keyMetricLabel: 'Diurnal Temp Swing',
    keyMetricValue: '18°C',
    secondaryMetricLabel: 'Soil Mineral Composition',
    secondaryMetricValue: 'Volcanic Basalt',
    description:
      'High in the Southern Rift Valley, steep mist-shrouded slopes create extreme day-to-night temperature swings. This slows cherry maturation down to 9 months, allowing the tree to pack dense, complex organic phosphoric acids and high sucrose concentrations into the seed.',
    tastingImpact: 'Delivers brilliant sparkling citric acidity and delicate bergamot top-notes.',
    icon: Mountain,
    tag: 'Terroir & Climate',
    coordinates: '6°09\'44"N 38°12\'18"E',
  },
  {
    id: 'fermentation',
    step: '02',
    phase: 'Selective Fermentation',
    title: 'Anaerobic Wild Maceration',
    subtitle: '72 hours in oxygen-depleted stainless vats with ambient yeasts',
    originLot: 'Wild Yeast Batch #12',
    altitude: 'Controlled 16°C',
    keyMetricLabel: 'Brix Sugar Density',
    keyMetricValue: '24.5° Bx',
    secondaryMetricLabel: 'pH Acidity Threshold',
    secondaryMetricValue: '3.82 pH',
    description:
      'Only 100% optical-grade ripe cherries are sealed into air-locked stainless steel bio-reactors. Ambient wild yeasts metabolize the sticky mucilage in an oxygen-free environment. Carbon dioxide builds natural pressure, forcing floral aromatic esters deep into the bean structure before slow drying on raised beds for 28 days.',
    tastingImpact: 'Creates deep notes of wild blackberry, candied neroli, and tropical guava sweetness.',
    icon: Leaf,
    tag: 'Post-Harvest Biology',
    coordinates: 'Raised African Beds • 28 Days',
  },
  {
    id: 'roast',
    step: '03',
    phase: 'Thermodynamic Roasting',
    title: 'Single-Pass Convection Curve',
    subtitle: 'Zero-emission single-origin profile dropped at 204.5°C',
    originLot: 'Loring S35 Kestrel Profile',
    altitude: 'Atelier Roastery',
    keyMetricLabel: 'Development Time Ratio',
    keyMetricValue: '13.8%',
    secondaryMetricLabel: 'First Crack Window',
    secondaryMetricValue: '8m 42s',
    description:
      'Traditional drum roasters scorch the bean surface with direct metal contact. Our recirculating convection roaster transfers energy purely through superheated laminar airflow. We hold a steady descending Rate of Rise (RoR), caramelizing delicate fructose without burning the volatile floral compounds.',
    tastingImpact: 'Preserves jasmine florals and transparent honey sweetness with zero smoky astringency.',
    icon: Flame,
    tag: 'Thermal Artistry',
    coordinates: 'Drum Speed 58 RPM • Airflow 85%',
  },
  {
    id: 'extraction',
    step: '04',
    phase: 'Precision Extraction',
    title: 'The Golden Cup Dial',
    subtitle: '93.5°C PID thermal stability, 9-bar saturation, 27-second yield',
    originLot: 'Atelier Counter Bar',
    altitude: 'Barista Station 1',
    keyMetricLabel: 'Refractometer TDS',
    keyMetricValue: '9.85%',
    secondaryMetricLabel: 'Extraction Yield (EY)',
    secondaryMetricValue: '21.2%',
    description:
      'Every morning at 6:00 AM, our lead baristas pull test shots with optical digital refractometers to lock in the recipe. We dose 19.5g of grounds into a precision 20g basket, pre-infuse for 6 seconds at 3 bars, then peak at 9 bars to extract 42g of liquid velvet with golden crema.',
    tastingImpact: 'Sensory harmony: bright bergamot entrance, velvety body, and sweet cocoa linger.',
    icon: Coffee,
    tag: 'Sensory Alchemy',
    coordinates: '19.5g in • 42g out • 27s flow',
  },
];

interface TerroirStorylineProps {
  onNavigate: (page: PageType) => void;
}

export const TerroirStoryline: React.FC<TerroirStorylineProps> = ({ onNavigate }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeChapter = CHAPTERS[activeStepIndex];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#1A1A18]/10">
        <div className="space-y-1">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            The Craft Story
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1A1A18] tracking-[-0.025em]">
            From Volcanic Soil to Finished Cup
          </h2>
          <p className="font-sans text-[14px] text-[#1A1A18]/70 leading-[1.6] max-w-[55ch] [text-wrap:pretty]">
            Specialty coffee is not an industrial commodity. Follow the lifecycle of our seasonal Ethiopian micro-lot as it journeys from high-altitude slopes to your morning extraction.
          </p>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2 font-sans text-xs font-medium">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1.5 min-h-[36px] rounded-full border transition-all cursor-pointer flex items-center gap-1.5 ${
                idx === activeStepIndex
                  ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                  : 'border-[#1A1A18]/15 bg-white text-[#1A1A18]/60 hover:border-[#1A1A18]/40 hover:text-[#1A1A18]'
              }`}
            >
              <span className="text-[10px] font-mono opacity-60">{ch.step}</span>
              <span className="hidden sm:inline">{ch.phase.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Story Stage Box */}
      <div className="rounded-3xl border border-[#1A1A18]/10 bg-white overflow-hidden shadow-sm">
        {/* Progress Tracker Bar */}
        <div className="w-full bg-[#1A1A18]/5 h-1 relative">
          <motion.div
            className="h-full bg-[#9D8461]"
            initial={false}
            animate={{ width: `${((activeStepIndex + 1) / CHAPTERS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Left Column: Stage Visual Narrative (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1A1A18]/10 bg-dot-grid">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Micro Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#9D8461]/15 text-[#9D8461] font-sans text-[11px] font-medium tracking-[0.04em] uppercase">
                      Chapter {activeChapter.step} • {activeChapter.tag}
                    </span>
                    <span className="font-mono text-[11px] text-[#1A1A18]/40">
                      {activeChapter.coordinates}
                    </span>
                  </div>
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/60">
                    {activeChapter.altitude}
                  </span>
                </div>

                {/* Chapter Headline */}
                <div className="space-y-2">
                  <h3 className="font-serif text-3xl sm:text-4xl font-normal text-[#1A1A18] tracking-[-0.02em]">
                    {activeChapter.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-[15px] font-medium text-[#9D8461]">
                    {activeChapter.subtitle}
                  </p>
                </div>

                {/* Deep Narrative Body */}
                <p className="font-sans text-[14px] sm:text-[15px] text-[#1A1A18]/75 leading-[1.7] [text-wrap:pretty]">
                  {activeChapter.description}
                </p>

                {/* Sensory Cup Impact Quote Box */}
                <div className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#1A1A18]/10 flex items-start gap-3.5">
                  <Sparkles className="w-4 h-4 text-[#9D8461] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.06em] text-[#1A1A18]/50 block">
                      Sensory Cup Consequence
                    </span>
                    <p className="text-xs sm:text-[13px] font-sans text-[#1A1A18] font-medium pt-0.5">
                      {activeChapter.tastingImpact}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Step Navigation Controls */}
            <div className="pt-8 mt-6 border-t border-[#1A1A18]/10 flex items-center justify-between gap-4">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className={`px-4 py-2 min-h-[40px] rounded-full border text-xs font-sans font-medium uppercase tracking-[0.06em] transition-all cursor-pointer ${
                  activeStepIndex === 0
                    ? 'border-[#1A1A18]/10 text-[#1A1A18]/30 cursor-not-allowed'
                    : 'border-[#1A1A18]/20 text-[#1A1A18] hover:border-[#1A1A18]'
                }`}
              >
                Previous Chapter
              </button>

              <div className="flex items-center gap-1.5">
                {CHAPTERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStepIndex(i)}
                    aria-label={`Jump to chapter ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      i === activeStepIndex ? 'w-6 bg-[#1A1A18]' : 'bg-[#1A1A18]/20 hover:bg-[#1A1A18]/50'
                    }`}
                  />
                ))}
              </div>

              {activeStepIndex < CHAPTERS.length - 1 ? (
                <button
                  onClick={() => setActiveStepIndex((prev) => Math.min(CHAPTERS.length - 1, prev + 1))}
                  className="px-5 py-2 min-h-[40px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] hover:bg-transparent hover:text-[#1A1A18] text-xs font-sans font-medium uppercase tracking-[0.06em] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('menu')}
                  className="px-5 py-2 min-h-[40px] rounded-full border border-[#9D8461] bg-[#9D8461] text-[#F8F7F4] hover:bg-[#1A1A18] hover:border-[#1A1A18] text-xs font-sans font-medium uppercase tracking-[0.06em] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Taste This Harvest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Telemetry & Process Dashboard (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 bg-[#F8F7F4] flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChapter.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#1A1A18]/10">
                  <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                    Roastery Telemetry Matrix
                  </span>
                  <span className="font-mono text-[11px] text-[#1A1A18]/50">
                    Live Lot 449-B
                  </span>
                </div>

                {/* Primary Metric Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-1">
                  <span className="text-[11px] font-sans uppercase tracking-[0.04em] text-[#1A1A18]/60 font-medium">
                    {activeChapter.keyMetricLabel}
                  </span>
                  <div className="font-serif text-3xl sm:text-4xl text-[#1A1A18] font-light">
                    {activeChapter.keyMetricValue}
                  </div>
                  <div className="text-[11px] font-sans text-[#1A1A18]/50 pt-1">
                    Calibrated against Specialty Coffee Association (SCA) standard
                  </div>
                </div>

                {/* Secondary Metric Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-1">
                  <span className="text-[11px] font-sans uppercase tracking-[0.04em] text-[#1A1A18]/60 font-medium">
                    {activeChapter.secondaryMetricLabel}
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl text-[#1A1A18] font-light">
                    {activeChapter.secondaryMetricValue}
                  </div>
                  <div className="text-[11px] font-sans text-[#1A1A18]/50 pt-1">
                    Monitored via optical density sensor array
                  </div>
                </div>

                {/* Terroir Badge Box */}
                <div className="p-4 rounded-xl border border-[#1A1A18]/10 bg-white space-y-2 font-sans text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A18]/60">Traceability:</span>
                    <span className="font-semibold text-[#1A1A18]">Direct Trade • 100% Traceable</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A18]/60">Farm Gate Premium:</span>
                    <span className="font-semibold text-[#9D8461]">+280% Above C-Market</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A1A18]/60">Carbon Footprint:</span>
                    <span className="font-semibold text-[#1A1A18]">Net-Zero Convection Roasting</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick action to order or explore */}
            <div className="pt-4 border-t border-[#1A1A18]/10 flex items-center justify-between">
              <button
                onClick={() => onNavigate('gallery')}
                className="font-sans text-xs font-medium uppercase tracking-[0.06em] text-[#1A1A18] hover:text-[#9D8461] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>View Full Cupping Radar</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => onNavigate('menu')}
                className="font-sans text-xs font-medium text-[#9D8461] hover:underline cursor-pointer"
              >
                Order On-Bar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
