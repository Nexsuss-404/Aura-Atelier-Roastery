import React, { useState } from 'react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { PageType } from '../types';
import { STORE_LOCATIONS } from '../data/coffeeData';

interface FooterProps {
  onNavigate: (page: PageType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-[#1A1A18]/10 bg-[#F8F7F4] text-[#1A1A18] pt-16 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
        {/* Top Atelier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#1A1A18]/10">
          {/* Brand Manifesto (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              Atelier Ethos
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-light tracking-[0.12em] uppercase text-[#1A1A18]">
              Aura
            </div>
            <p className="font-sans text-[14px] text-[#1A1A18]/70 leading-[1.65] max-w-md [text-wrap:pretty]">
              Founded on the intersection of single-origin terroir, fair farm gate contracts, and low-emission convection roasting. Every harvest is meticulously dialed on bar for exceptional sensory clarity.
            </p>
            <div className="font-sans text-[11px] font-medium text-[#1A1A18]/50 uppercase tracking-[0.04em] pt-1">
              SCA Certified Specialty • 89.5+ Cupping Score
            </div>
          </div>

          {/* Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              Index
            </span>
            <ul className="space-y-2 text-xs font-sans font-medium uppercase tracking-[0.08em] text-[#1A1A18]/70">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#1A1A18] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#1A1A18] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Menu & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#1A1A18] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Cupping Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('checkout')}
                  className="hover:text-[#1A1A18] hover:translate-x-0.5 transition-all text-left cursor-pointer"
                >
                  Checkout
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('states')}
                  className="hover:text-[#9D8461] hover:translate-x-0.5 transition-all text-left cursor-pointer flex items-center gap-1.5"
                >
                  <span>Design States (45)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Tasting Rooms (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              Tasting Rooms
            </span>
            <div className="space-y-3 text-xs">
              {STORE_LOCATIONS.map((loc) => (
                <div key={loc.id} className="space-y-0.5">
                  <div className="font-serif text-sm font-normal text-[#1A1A18] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9D8461]" />
                    <span>{loc.name}</span>
                  </div>
                  <p className="text-[12px] text-[#1A1A18]/60 font-sans">{loc.address}</p>
                  <p className="text-[11px] font-sans font-medium text-[#9D8461]">{loc.hours}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Micro-Lot Dispatch (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
              Dispatch
            </span>
            <p className="font-sans text-xs text-[#1A1A18]/70 leading-relaxed [text-wrap:pretty]">
              Receive private dispatch notices when rare Geisha micro-lots and experimental anaerobics enter the roaster.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] placeholder:text-[#1A1A18]/40 focus:outline-none focus:border-[#1A1A18] font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] hover:bg-transparent hover:text-[#1A1A18] transition-all text-xs font-sans font-medium uppercase tracking-[0.06em] flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe to dispatch"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] font-sans text-[#9D8461] flex items-center gap-1 pt-1 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Enrolled in the roastery dispatch.</span>
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Clean Meta Footer Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 font-sans text-[11px] uppercase tracking-[0.04em] text-[#1A1A18]/50 font-medium">
          <div>Est. 2026 • Artisanal Coffee Roastery & Atelier</div>
          <div>Certified Specialty • Zero-Emission Roastery</div>
        </div>
      </div>
    </footer>
  );
};
