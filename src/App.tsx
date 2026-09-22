import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { PageType, Product } from './types';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { InteractiveGallery } from './components/InteractiveGallery';
import { CheckoutPage } from './components/CheckoutPage';
import { DrinkCustomizerModal } from './components/DrinkCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const checkConnectivity = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return true;
  if (!window.navigator.onLine) return false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`/favicon.ico?_t=${Date.now()}`, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);
    return res.ok || res.status < 500;
  } catch {
    return window.navigator.onLine;
  }
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const { lastAddedToast, clearLastAddedToast, setIsCartOpen } = useCart();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showRestored, setShowRestored] = useState<boolean>(false);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);

  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = setTimeout(() => setShowRestored(false), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    if (typeof window !== 'undefined') {
      setIsOnline(window.navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    };
  }, []);

  const handleManualReconnect = async () => {
    setIsReconnecting(true);
    try {
      const active = await checkConnectivity();
      setIsOnline(active);
      if (active) {
        setShowRestored(true);
        if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
        restoreTimerRef.current = setTimeout(() => setShowRestored(false), 3000);
      }
    } finally {
      setIsReconnecting(false);
    }
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomizer = (product: Product) => {
    setCustomizingProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1B18] font-sans selection:bg-[#43281C] selection:text-[#FAF8F5] overflow-x-hidden">
      {/* Offline / Connection Lost Alert Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#1A1A18] text-[#F8F7F4] border-b border-[#9D8461]/30 text-xs px-4 py-2.5 flex items-center justify-between z-50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 font-sans">
              <div className="flex items-center gap-2">
                <WifiOff className="w-3.5 h-3.5 text-[#E07A5F] shrink-0 animate-pulse" />
                <span className="text-[12px] font-medium tracking-[0.02em]">
                  <strong className="font-semibold text-white">Connection Lost:</strong> Roastery operating in offline cache mode. Browsing and tasting notes remain available.
                </span>
              </div>
              <button
                type="button"
                onClick={handleManualReconnect}
                disabled={isReconnecting}
                className="px-3 py-1 rounded-full border border-white/20 text-[11px] uppercase tracking-wider font-medium text-white hover:bg-white/10 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3 h-3 ${isReconnecting ? 'animate-spin' : ''}`} />
                <span>{isReconnecting ? 'Testing...' : 'Reconnect'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {showRestored && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#2D6A4F] text-white text-xs px-4 py-2 z-50 flex items-center justify-center gap-2 font-sans text-center"
          >
            <Wifi className="w-3.5 h-3.5 text-white" />
            <span className="text-[12px] font-medium tracking-[0.02em]">
              Connection Restored — Roastery inventory synchronized.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top sticky navigation with only Home, Menu, Gallery, and Checkout */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Content with smooth transitions */}
      <main className="flex-1 w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                onCustomize={handleOpenCustomizer}
                onExploreGallery={() => handleNavigate('gallery')}
              />
            )}

            {currentPage === 'menu' && (
              <MenuPage
                onCustomize={handleOpenCustomizer}
                onExploreGallery={() => handleNavigate('gallery')}
              />
            )}

            {currentPage === 'gallery' && (
              <InteractiveGallery
                onSelectProductToOrder={(product) => handleOpenCustomizer(product)}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage onNavigate={handleNavigate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
        onExploreMenu={() => handleNavigate('menu')}
      />

      {/* Drink Customizer Modal for dialing shots, milk, size, and syrups */}
      <DrinkCustomizerModal
        product={customizingProduct}
        onClose={() => setCustomizingProduct(null)}
      />

      {/* Instant Sensory Toast Notification on Add to Bag */}
      <Toast
        toast={lastAddedToast}
        onClose={clearLastAddedToast}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Minimalist Editorial Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <LoyaltyProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </LoyaltyProvider>
  );
}
