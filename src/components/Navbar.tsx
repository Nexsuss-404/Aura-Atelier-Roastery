import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X
} from 'lucide-react';
import { PageType } from '../types';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  const navLinks: { id: PageType; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'checkout', label: 'Checkout' },
  ];

  const handleNav = (page: PageType) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md border-b border-[#1A1A18]/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleNav('home')}
          className="group flex flex-col items-start text-left focus:outline-none cursor-pointer"
        >
          <span className="font-serif text-3xl sm:text-4xl tracking-[0.12em] uppercase font-light text-[#1A1A18] leading-none">
            Aura
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-[#9D8461] mt-1 font-medium">
            Atelier & Roastery
          </span>
        </button>

        {/* Right Nav links & Cart button */}
        <div className="flex items-center gap-5 sm:gap-7">
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`text-[12px] uppercase tracking-[0.1em] transition-all relative py-1 cursor-pointer ${
                    isActive
                      ? 'text-[#1A1A18] font-semibold opacity-100'
                      : 'text-[#1A1A18] opacity-60 hover:opacity-100 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9D8461]"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Cart Bag trigger button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="nav-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative px-3.5 py-1.5 min-h-[40px] rounded-full border border-[#1A1A18] text-[#1A1A18] hover:bg-[#1A1A18] hover:text-[#F8F7F4] transition-all text-[11px] font-sans font-medium uppercase tracking-[0.06em] flex items-center gap-2 group cursor-pointer shrink-0"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#9D8461] text-white text-[10px] font-sans font-bold leading-tight">
                {itemCount}
              </span>
            )}
          </motion.button>

          {/* Mobile hamburger toggle */}
          <button
            id="nav-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-[#1A1A18] hover:opacity-70 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[#1A1A18]/10 bg-[#F8F7F4] px-5 sm:px-6 py-4 space-y-3 overflow-hidden"
          >
            <div className="font-sans text-[11px] font-medium tracking-[0.06em] text-[#9D8461] uppercase pb-1 border-b border-[#1A1A18]/10">
              Navigation Index
            </div>
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => handleNav(item.id)}
                    className={`text-left text-xs uppercase tracking-[0.16em] py-3 min-h-[44px] flex items-center justify-between border-b border-[#1A1A18]/5 transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#1A1A18] font-bold'
                        : 'text-[#1A1A18]/70 hover:text-[#1A1A18]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#9D8461]" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
