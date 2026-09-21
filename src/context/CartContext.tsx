import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, DrinkCustomization, Order, OrderStatus, ToastData } from '../types';
import { STORE_LOCATIONS } from '../data/coffeeData';
import { useLoyalty } from './LoyaltyContext';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, customization: DrinkCustomization, quantity?: number) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  tipPercent: number | null;
  customTipAmount: number;
  setTipPercent: (percent: number | null) => void;
  setCustomTipAmount: (amount: number) => void;
  calculatedTip: number;
  tax: number;
  total: number;
  fulfillmentType: 'pickup' | 'delivery';
  setFulfillmentType: (type: 'pickup' | 'delivery') => void;
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  customerInfo: { name: string; email: string; phone: string };
  setCustomerInfo: (info: { name: string; email: string; phone: string }) => void;
  activeOrder: Order | null;
  submitOrder: (paymentMethod: 'apple_pay' | 'google_pay' | 'card') => Order;
  orderHistory: Order[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedToast: ToastData | null;
  clearLastAddedToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aura_coffee_cart_items';
const ORDER_STORAGE_KEY = 'aura_coffee_orders';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { earnPoints, activeRewardDiscount, clearActiveReward, user } = useLoyalty();

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number | null>(18);
  const [customTipAmount, setCustomTipAmount] = useState<number>(0);
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(STORE_LOCATIONS[0].id);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [customerInfo, setCustomerInfo] = useState({
    name: user.name || 'Camille Laurent',
    email: user.email || 'camille.coffee@example.com',
    phone: '(555) 892-4190',
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [lastAddedToast, setLastAddedToast] = useState<ToastData | null>(null);

  const clearLastAddedToast = () => setLastAddedToast(null);

  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (orderHistory.length > 0 && orderHistory[0].status !== 'completed') {
      return orderHistory[0];
    }
    return null;
  });

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Save orders
  useEffect(() => {
    try {
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderHistory));
    } catch {
      // ignore
    }
  }, [orderHistory]);

  // Live order status simulator for realistic barista immersion
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'completed') return;

    const timer1 = setTimeout(() => {
      updateOrderStatus(activeOrder.orderId, 'grinding');
    }, 12000);

    const timer2 = setTimeout(() => {
      updateOrderStatus(activeOrder.orderId, 'brewing');
    }, 28000);

    const timer3 = setTimeout(() => {
      updateOrderStatus(activeOrder.orderId, 'ready');
    }, 55000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeOrder?.orderId, activeOrder?.status]);

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setActiveOrder((prev) => (prev && prev.orderId === orderId ? { ...prev, status } : prev));
    setOrderHistory((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
  };

  const calculateItemPrice = (product: Product, customization: DrinkCustomization): number => {
    let price = product.price;

    // Daily special discount if any
    if (product.isDailySpecial && product.specialDiscountPercent) {
      price = price * (1 - product.specialDiscountPercent / 100);
    }

    // Size adjustments
    if (customization.size === 'Grande (12oz)') price += 0.65;
    if (customization.size === 'Reserve (16oz)') price += 1.25;

    // Extra shots (beyond base 2)
    if (customization.espressoShots > 2) {
      price += (customization.espressoShots - 2) * 1.00;
    }

    // Milk upgrade (free for Silver+ tier)
    const isFreeMilkTier = user.tier === 'Silver Barista' || user.tier === 'Gold Connoisseur' || user.tier === 'Obsidian Master';
    if (!isFreeMilkTier && (customization.milkChoice.includes('Oat') || customization.milkChoice.includes('Almond') || customization.milkChoice.includes('Macadamia'))) {
      price += 0.85;
    }

    // Syrup upgrade
    if (customization.syrup && customization.syrup !== 'None') {
      price += 0.75;
    }

    return Math.round(price * 100) / 100;
  };

  const addItem = (product: Product, customization: DrinkCustomization, quantity = 1) => {
    const unitPrice = calculateItemPrice(product, customization);
    const cartItemId = `${product.id}-${JSON.stringify(customization)}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: Math.round(existing.unitPrice * newQty * 100) / 100,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          product,
          customization,
          unitPrice,
          quantity,
          totalPrice: Math.round(unitPrice * quantity * 100) / 100,
        };
        return [...prev, newItem];
      }
    });

    setLastAddedToast({
      id: `${product.id}-${Date.now()}`,
      product,
      message: 'Added to your bag',
      size: customization.size,
      timestamp: Date.now(),
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              quantity,
              totalPrice: Math.round(item.unitPrice * quantity * 100) / 100,
            }
          : item
      )
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  const applyPromoCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FIRSTROAST') {
      setPromoCode('FIRSTROAST');
      setPromoDiscountPercent(15);
      return { success: true, message: '15% artisanal welcome discount applied!' };
    }
    if (clean === 'BARISTA5') {
      setPromoCode('BARISTA5');
      setPromoDiscountPercent(10);
      return { success: true, message: 'Barista VIP 10% discount applied!' };
    }
    if (clean === 'GEISHA') {
      setPromoCode('GEISHA');
      setPromoDiscountPercent(20);
      return { success: true, message: 'Single Origin Club 20% discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try "FIRSTROAST" or "BARISTA5"' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = Math.round(
    items.reduce((acc, curr) => acc + curr.totalPrice, 0) * 100
  ) / 100;

  // Discounts
  const promoDiscountVal = (subtotal * promoDiscountPercent) / 100;
  const totalDiscount = Math.min(
    subtotal,
    Math.round((promoDiscountVal + activeRewardDiscount) * 100) / 100
  );

  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);

  // Tip calculation
  const calculatedTip = tipPercent !== null
    ? Math.round((discountedSubtotal * (tipPercent / 100)) * 100) / 100
    : Math.max(0, customTipAmount);

  // Tax (8.75% standard)
  const tax = Math.round((discountedSubtotal * 0.0875) * 100) / 100;

  const total = Math.round((discountedSubtotal + calculatedTip + tax) * 100) / 100;

  const submitOrder = (paymentMethod: 'apple_pay' | 'google_pay' | 'card'): Order => {
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `AURA-${orderNumber}`;
    const selectedLocation = STORE_LOCATIONS.find((l) => l.id === selectedLocationId) || STORE_LOCATIONS[0];

    const pointsEarned = earnPoints(discountedSubtotal, orderNumber);

    const newOrder: Order = {
      orderId,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      subtotal,
      discount: totalDiscount,
      tax,
      tip: calculatedTip,
      total,
      loyaltyPointsEarned: pointsEarned,
      loyaltyPointsRedeemed: activeRewardDiscount > 0 ? 120 : 0,
      status: 'placed',
      fulfillmentType,
      pickupLocation: selectedLocation.name,
      estimatedMinutes: fulfillmentType === 'pickup' ? selectedLocation.currentWaitMins : 25,
      customer: {
        ...customerInfo,
        address: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
      },
      paymentMethod,
    };

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    clearCart();
    clearActiveReward();

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        discount: totalDiscount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        tipPercent,
        customTipAmount,
        setTipPercent,
        setCustomTipAmount,
        calculatedTip,
        tax,
        total,
        fulfillmentType,
        setFulfillmentType,
        selectedLocationId,
        setSelectedLocationId,
        deliveryAddress,
        setDeliveryAddress,
        customerInfo,
        setCustomerInfo,
        activeOrder,
        submitOrder,
        orderHistory,
        isCartOpen,
        setIsCartOpen,
        lastAddedToast,
        clearLastAddedToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
