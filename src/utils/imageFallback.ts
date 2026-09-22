import React from 'react';

// Elegant SVG placeholder encoded as data URI for offline/failed image fallback
export const COFFEE_FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 450' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23F4EFEA'/%3E%3Cpath d='M250 200c0 40 30 70 70 70s70-30 70-70h-140zm140 10h20c15 0 25-10 25-25s-10-25-25-25h-20v50z' fill='none' stroke='%239D8461' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M280 160c-2-12 4-22 4-30M320 160c-2-14 4-24 4-32M360 160c-2-14 4-24 4-32' fill='none' stroke='%23C5B59E' stroke-width='4' stroke-linecap='round'/%3E%3Ctext x='50%25' y='325' text-anchor='middle' font-family='serif' font-size='18' fill='%231A1A18' opacity='0.6'%3EAura Roastery Specialty Lot%3C/text%3E%3C/svg%3E";

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.currentTarget;
  if (target.src !== COFFEE_FALLBACK_IMAGE) {
    target.src = COFFEE_FALLBACK_IMAGE;
  }
};
