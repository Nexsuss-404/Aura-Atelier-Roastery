import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Coffee, 
  SlidersHorizontal, 
  X
} from 'lucide-react';
import { Product, Category } from '../types';
import { PRODUCTS } from '../data/coffeeData';
import { ProductCard } from './ProductCard';

interface MenuPageProps {
  onCustomize: (product: Product) => void;
  onExploreGallery?: (product: Product) => void;
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Offerings' },
  { id: 'espresso', label: 'Espresso Bar' },
  { id: 'pourover', label: 'Single-Origin Pour-Over' },
  { id: 'coldbrew', label: 'Cold Brew & Nitro' },
  { id: 'signatures', label: 'Atelier Signatures' },
  { id: 'beans', label: 'Whole Bean Roasts' },
  { id: 'pastries', label: 'Pairings & Pastry' },
];

const CATEGORY_STORIES: Record<Category, string> = {
  all: 'Complete seasonal catalog of roasted whole bean lots, hand-pulled espresso extractions, and culinary botanical infusions.',
  espresso: 'Dialed on saturated 9-bar group heads with 6-second pre-infusion. Paired with textured microfoam steamed to 62°C for natural milk sweetness.',
  pourover: 'Extracted through flat-bed Kalita Wave and ceramic V60 cones with 93.5°C remineralized water, highlighting origin terroir and transparent florals.',
  coldbrew: '20-hour cold water immersion extraction micro-filtered and nitrogen-charged for a silky Guinness-like cascade with zero bitterness.',
  signatures: 'House-distilled neroli essences, stone-ground toasted sesame, and applewood smoke married with specialty double ristretto shots.',
  beans: 'Single-origin micro-lots roasted in our zero-emission convection roaster. Nitrogen-flushed and labeled with farmer partner and harvest elevation.',
  pastries: 'Handmade flaky viennoiserie, cardamom buns, and almond croissants baked fresh every morning to pair with high-acid coffees.',
};

export const MenuPage: React.FC<MenuPageProps> = ({
  onCustomize,
  onExploreGallery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'caffeine'>('featured');
  const [activeFilterTag, setActiveFilterTag] = useState<'all' | 'special' | 'single-origin' | 'cold'>('all');

  const handleCategorySelect = (catId: Category) => {
    if (catId === selectedCategory) return;
    setIsCategoryLoading(true);
    setSelectedCategory(catId);
    setTimeout(() => {
      setIsCategoryLoading(false);
    }, 220);
  };

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.origin && item.origin.toLowerCase().includes(query)) ||
        item.tastingNotes.some((n) => n.toLowerCase().includes(query));

      const matchTag =
        activeFilterTag === 'all' ||
        (activeFilterTag === 'special' && item.isDailySpecial) ||
        (activeFilterTag === 'single-origin' && !!item.origin) ||
        (activeFilterTag === 'cold' && (item.category === 'coldbrew' || item.name.toLowerCase().includes('iced') || item.name.toLowerCase().includes('cold')));

      return matchCat && matchSearch && matchTag;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'caffeine') {
      list = [...list].sort((a, b) => (b.caffeineMg || 0) - (a.caffeineMg || 0));
    }

    return list;
  }, [selectedCategory, searchQuery, activeFilterTag, sortBy]);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="max-w-3xl space-y-2 border-b border-[#1A1A18]/10 pb-6">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
          Curated Offerings
        </span>
        <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#1A1A18] tracking-[-0.03em]">
          Handcrafted Beverages & Roasts
        </h1>
        <p className="font-sans text-[15px] text-[#1A1A18]/70 leading-[1.65] max-w-2xl [text-wrap:pretty]">
          Every extraction is pulled to order with calibrated water mineral profiles, temperature monitoring, and bespoke dairy, oat, or botanical infusion options.
        </p>
      </div>

      {/* Category Pills & Search Bar Toolbar */}
      <div className="space-y-4">
        {/* Search bar & Sort controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by drink, single-origin, or tasting note..."
              className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] placeholder:text-[#1A1A18]/40 focus:outline-none focus:border-[#1A1A18] font-sans shadow-xs"
            />
            <Search className="w-3.5 h-3.5 text-[#1A1A18]/40 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 absolute right-3 top-2.5 text-[#1A1A18]/40 hover:text-[#1A1A18] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto font-sans text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9D8461]" />
            <span className="text-[#1A1A18]/60 uppercase tracking-[0.04em] font-medium text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
            >
              <option value="featured">Curated (Default)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="caffeine">Caffeine Level</option>
            </select>
          </div>
        </div>

        {/* Category horizontal scrolling tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar font-sans text-[12px] font-medium uppercase tracking-[0.04em] -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 min-h-[38px] rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isSelected
                    ? 'bg-[#1A1A18] text-[#F8F7F4] border border-[#1A1A18]'
                    : 'bg-white border border-[#1A1A18]/15 text-[#1A1A18]/70 hover:border-[#1A1A18]/40 hover:text-[#1A1A18]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Story Callout */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#1A1A18]/10 flex items-center gap-3">
          <Coffee className="w-4 h-4 text-[#9D8461] shrink-0" />
          <p className="font-sans text-xs text-[#1A1A18]/75 leading-relaxed [text-wrap:pretty]">
            <span className="font-semibold text-[#1A1A18]">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label}:{' '}
            </span>
            {CATEGORY_STORIES[selectedCategory]}
          </p>
        </div>

        {/* Secondary Quick Filter Tags Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-sans text-[11px] font-medium uppercase tracking-[0.04em]">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'special', label: "Today's Specials" },
              { id: 'single-origin', label: 'Single-Origin Only' },
              { id: 'cold', label: 'Iced & Cold Brews' },
            ].map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveFilterTag(tag.id as any)}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
                  activeFilterTag === tag.id
                    ? 'bg-[#9D8461] text-white shadow-xs'
                    : 'border border-[#1A1A18]/10 bg-[#F8F7F4] text-[#1A1A18]/70 hover:border-[#1A1A18]/30'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <span className="text-[#1A1A18]/50">
            {filteredProducts.length} craft offering{filteredProducts.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {isCategoryLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((sk) => (
            <div
              key={sk}
              className="bg-[#FCFBF9] border border-[#1A1A18]/8 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between"
            >
              <div className="aspect-[4/3] bg-[#EFECE6]" />
              <div className="p-5 sm:p-6 space-y-4">
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-[#EFECE6] rounded-md" />
                  <div className="h-3.5 w-1/2 bg-[#EFECE6] rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-[#EFECE6] rounded-md" />
                  <div className="h-3 w-4/5 bg-[#EFECE6] rounded-md" />
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-5 w-16 bg-[#EFECE6] rounded-full" />
                  <div className="h-5 w-20 bg-[#EFECE6] rounded-full" />
                </div>
                <div className="pt-4 border-t border-[#1A1A18]/8 flex items-center justify-between">
                  <div className="h-7 w-20 bg-[#EFECE6] rounded-md" />
                  <div className="h-9 w-24 bg-[#EFECE6] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white border border-[#1A1A18]/10 rounded-2xl p-8 max-w-lg mx-auto">
          <Coffee className="w-8 h-8 text-[#9D8461] mx-auto opacity-70" />
          <h3 className="font-serif text-2xl font-light text-[#1A1A18]">
            {searchQuery
              ? `No coffees found matching "${searchQuery}"`
              : 'No coffees match the selected filter criteria'}
          </h3>
          <p className="font-sans font-light text-xs text-[#1A1A18]/60">
            Try searching for "Ethiopia", "Geisha", "Cold Brew", or reset filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setActiveFilterTag('all');
            }}
            className="px-5 py-2.5 rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.06em] transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              index={idx}
              onCustomize={onCustomize}
              onExploreGallery={onExploreGallery}
            />
          ))}
        </div>
      )}
    </div>
  );
};
