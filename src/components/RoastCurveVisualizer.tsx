import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, Thermometer, Wind, Sparkles } from 'lucide-react';
import { RoastLevel } from '../types';

interface RoastStage {
  id: string;
  name: string;
  time: string;
  temp: string;
  chemicalProcess: string;
  sensoryImpact: string;
  xPercent: number;
  yPercent: number; // 0 is bottom (low temp), 100 is top (high temp)
}

const ROAST_STAGES: RoastStage[] = [
  {
    id: 'charge',
    name: '01. Green Charge',
    time: '0:00',
    temp: '185°C',
    chemicalProcess: 'Thermal equilibrium shock; cold dense seed enters preheated convection drum.',
    sensoryImpact: 'Traps core moisture; sets baseline thermodynamic momentum.',
    xPercent: 5,
    yPercent: 35,
  },
  {
    id: 'turn',
    name: '02. Turning Point',
    time: '1:18',
    temp: '94°C',
    chemicalProcess: 'Lowest temperature reached; bean and chamber achieve thermal parity.',
    sensoryImpact: 'Heat begins penetrating the cellular matrix without scorching outer chaff.',
    xPercent: 18,
    yPercent: 18,
  },
  {
    id: 'drying',
    name: '03. Drying End',
    time: '4:45',
    temp: '152°C',
    chemicalProcess: 'Chlorophyll degrades from green to golden yellow; moisture content drops to ~5%.',
    sensoryImpact: 'Aroma shifts from fresh grass to warm baked bread and grain.',
    xPercent: 42,
    yPercent: 44,
  },
  {
    id: 'maillard',
    name: '04. Maillard Reaction',
    time: '7:10',
    temp: '178°C',
    chemicalProcess: 'Amino acids bond with reducing sugars, generating melanoidins and aromatics.',
    sensoryImpact: 'Develops deep body, toffee notes, and rich aromatic complexity.',
    xPercent: 68,
    yPercent: 65,
  },
  {
    id: 'first_crack',
    name: '05. First Crack',
    time: '8:55',
    temp: '204°C',
    chemicalProcess: 'Steam pressure ruptures bean cellular structure with audible pops; volume expands ~45%.',
    sensoryImpact: 'Unlocks sparkling floral top-notes and bright, transparent citric acids.',
    xPercent: 84,
    yPercent: 82,
  },
  {
    id: 'drop',
    name: '06. Roaster Drop',
    time: '10:12',
    temp: '211°C',
    chemicalProcess: 'Rapid pneumatic discharge into cooling sieve; airflow quenches roast in <90s.',
    sensoryImpact: 'Locks in caramel sweetness while preventing bitter pyrolytic charring.',
    xPercent: 96,
    yPercent: 89,
  },
];

interface RoastCurveVisualizerProps {
  roastLevel?: RoastLevel;
  lotName?: string;
}

export const RoastCurveVisualizer: React.FC<RoastCurveVisualizerProps> = ({
  roastLevel = 'Medium-Light',
  lotName = 'Ethiopia Yirgacheffe G1',
}) => {
  const [activeStageId, setActiveStageId] = useState<string>('first_crack');
  const activeStage = ROAST_STAGES.find((s) => s.id === activeStageId) || ROAST_STAGES[4];

  // SVG dimensions for the curve
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingY = 25;

  const points = ROAST_STAGES.map((s) => {
    const x = paddingX + (s.xPercent / 100) * (width - paddingX * 2);
    const y = height - paddingY - (s.yPercent / 100) * (height - paddingY * 2);
    return { ...s, x, y };
  });

  // Smooth SVG cubic Bezier path
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) * 0.45;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) * 0.55;
    const cy2 = pt.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="rounded-2xl border border-[#1A1A18]/10 bg-white p-5 sm:p-7 space-y-6">
      {/* Top Header with live status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1A1A18]/10">
        <div className="space-y-1">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.06em] text-[#9D8461] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" />
            Thermodynamic Roasting Telemetry
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#1A1A18] tracking-[-0.015em]">
            Rate of Rise (RoR) Convection Curve
          </h3>
          <p className="font-sans text-xs text-[#1A1A18]/70">
            Profile for <span className="font-medium text-[#1A1A18]">{lotName}</span> • Target: <span className="font-medium text-[#9D8461]">{roastLevel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 font-sans text-xs">
          <div className="px-3 py-1.5 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-[#1A1A18]">Loring S35 Convection</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive RoR Curve */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#F8F7F4] border border-[#1A1A18]/10 p-2 sm:p-4 bg-dot-grid">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Subtle Grid Guidelines */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={ratio}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="rgba(26, 26, 24, 0.08)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Fill under the curve */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
            fill="url(#curveGradient)"
            opacity="0.35"
          />

          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9D8461" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#9D8461" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* The RoR Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#1A1A18"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Phase Keypoint Markers */}
          {points.map((pt) => {
            const isSelected = pt.id === activeStageId;
            return (
              <g
                key={pt.id}
                onClick={() => setActiveStageId(pt.id)}
                className="cursor-pointer group"
              >
                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 10 : 6}
                  fill={isSelected ? '#9D8461' : '#F8F7F4'}
                  fillOpacity={isSelected ? 0.3 : 1}
                  stroke={isSelected ? '#9D8461' : '#1A1A18'}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Inner dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 5 : 3}
                  fill={isSelected ? '#1A1A18' : '#9D8461'}
                  className="transition-all duration-300"
                />

                {/* Temperature label floating above */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="text-[10px] font-mono font-medium fill-[#1A1A18] opacity-80"
                >
                  {pt.temp}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend under SVG */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-2 text-[10px] font-mono uppercase text-[#1A1A18]/50">
          <span>T=0:00 (Charge)</span>
          <span>RoR Phase: {activeStage.name}</span>
          <span>T=10:12 (Cooling)</span>
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      <motion.div
        key={activeStage.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="p-4 sm:p-5 rounded-xl bg-[#F8F7F4] border border-[#1A1A18]/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
      >
        <div className="md:col-span-5 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-sans text-xs font-semibold text-[#1A1A18]">
              {activeStage.name}
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-white border border-[#1A1A18]/10 text-[#9D8461]">
              {activeStage.time} • {activeStage.temp}
            </span>
          </div>
          <p className="font-sans text-xs text-[#1A1A18]/70 leading-relaxed [text-wrap:pretty]">
            {activeStage.chemicalProcess}
          </p>
        </div>

        <div className="md:col-span-7 p-3 rounded-lg bg-white border border-[#1A1A18]/10 space-y-1">
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.06em] text-[#9D8461] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Sensory Cup Outcome
          </span>
          <p className="font-sans text-xs text-[#1A1A18] font-medium leading-normal">
            {activeStage.sensoryImpact}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
