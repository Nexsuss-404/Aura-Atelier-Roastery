import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageType, Product } from './types';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MenuPage } from './components/MenuPage';
import { InteractiveGallery } from './components/InteractiveGallery';
import { CheckoutPage } from './components/CheckoutPage';
import { PageStatesShowcase } from './components/PageStatesShowcase';
import { DrinkCustomizerModal } from './components/DrinkCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const { lastAddedToast, clearLastAddedToast, setIsCartOpen } = useCart();

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCustomizer = (product: Product) => {
    setCustomizingProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1B18] font-sans selection:bg-[#43281C] selection:text-[#FAF8F5]">
      {/* Top sticky navigation with only Home, Menu, Gallery, and Checkout */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page Content with smooth transitions */}
      <main className="flex-1">
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

            {currentPage === 'states' && (
              <PageStatesShowcase
                onNavigateHome={() => handleNavigate('home')}
                onNavigateMenu={() => handleNavigate('menu')}
              />
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
