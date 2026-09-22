import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, 
  MapPin, 
  Clock, 
  CreditCard, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  Trash2, 
  Plus, 
  Minus, 
  Coffee, 
  Printer, 
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { STORE_LOCATIONS } from '../data/coffeeData';
import { PageType, Order } from '../types';
import { handleImageError } from '../utils/imageFallback';

interface CheckoutPageProps {
  onNavigate: (page: PageType) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    discount,
    tax,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode,
    fulfillmentType,
    setFulfillmentType,
    selectedLocationId,
    setSelectedLocationId,
    deliveryAddress,
    setDeliveryAddress,
    customerInfo,
    setCustomerInfo,
    tipPercent,
    setTipPercent,
    setCustomTipAmount,
    calculatedTip,
    submitOrder,
    cancelOrder,
    activeOrder,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'google_pay' | 'card'>('apple_pay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9104');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Local state for recently placed order within this session
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(720); // 12 minutes countdown

  // 1. ORDER CONFIRMATION VIEW
  const activeReceipt = completedOrder || (activeOrder && activeOrder.status !== 'completed' ? activeOrder : null);

  // Live countdown effect when receipt is active
  useEffect(() => {
    if (!activeReceipt) return;
    if (activeReceipt.status === 'ready' || activeReceipt.status === 'completed' || activeReceipt.status === 'cancelled') {
      setSecondsRemaining(0);
      return;
    }
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeReceipt?.orderId, activeReceipt?.status]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleCopyOrderId = (id: string) => {
    try {
      navigator.clipboard.writeText(id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ success: res.success, text: res.message });
    if (res.success) setPromoInput('');
  };

  const handlePlaceOrder = () => {
    setFormError(null);

    if (isProcessing) return;

    if (items.length === 0) {
      setFormError('Your order bag is currently empty.');
      return;
    }

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setFormError('Connection Lost: Unable to process payment while offline. Please reconnect to finalize your order.');
      return;
    }

    if (!customerInfo.name.trim()) {
      setFormError('Please provide your name for the barista pickup callout.');
      return;
    }

    if (!customerInfo.email.trim() || !customerInfo.email.includes('@')) {
      setFormError('Please provide a valid email address to receive your roastery receipt.');
      return;
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please enter a delivery address for the courier dispatch.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim() || cardNumber.length < 8) {
        setFormError('Please provide a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry.trim() || cardExpiry.length < 4) {
        setFormError('Please provide a valid card expiration date (MM/YY).');
        return;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        setFormError('Please enter a valid 3 or 4 digit CVV code.');
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Re-verify network status before finalizing
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        setIsProcessing(false);
        setFormError('Network was interrupted during payment processing. Please reconnect and try again.');
        return;
      }

      const order = submitOrder(paymentMethod);
      setIsProcessing(false);
      setCompletedOrder(order);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#1A1A18', '#9D8461', '#D6C9B8', '#5A4B41'],
        });
      } catch {
        // Safe fallback if canvas context is restricted in iframe
      }
    }, 1200);
  };

  if (activeReceipt) {
    return (
      <div className="py-10 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
            Transmission Confirmed
          </span>
          <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#1A1A18] tracking-[-0.02em]">
            Order Accepted, {activeReceipt.customer.name}
          </h1>
          <div className="flex items-center justify-center gap-2 font-sans text-xs text-[#1A1A18]/70">
            <span>Manifest <strong className="text-[#1A1A18] font-semibold">#{activeReceipt.orderId}</strong> logged at {activeReceipt.date}</span>
            <button
              type="button"
              onClick={() => handleCopyOrderId(activeReceipt.orderId)}
              className="px-2 py-0.5 rounded-full border border-[#1A1A18]/20 bg-white text-[#1A1A18] text-[10px] font-sans font-medium uppercase tracking-[0.06em] transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              {copiedOrderId ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-6">
          {/* Status banner with live countdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8F7F4] border border-[#1A1A18]/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#1A1A18]/15 bg-white text-[#1A1A18] flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#9D8461]" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-sans font-medium tracking-[0.06em] text-[#9D8461] block">
                  Estimated Barista Extraction
                </span>
                <span className="font-serif text-3xl font-light text-[#1A1A18]">
                  {formatCountdown(secondsRemaining)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-sans text-xs text-[#1A1A18]/70">
              <MapPin className="w-4 h-4 text-[#9D8461] flex-shrink-0" />
              <span>
                {activeReceipt.fulfillmentType === 'pickup'
                  ? `Counter Pickup: ${activeReceipt.pickupLocation}`
                  : `Courier Delivery to: ${activeReceipt.customer.address}`}
              </span>
            </div>
          </div>

          {/* Barista Status Steps */}
          {activeReceipt.status === 'cancelled' ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between font-sans text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span className="font-semibold uppercase tracking-[0.05em]">Order Cancelled</span>
                <span className="text-amber-700 hidden sm:inline">• Voided ticket before extraction</span>
              </div>
              <span className="text-amber-800 font-medium text-[11px]">Refund logged</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              {[
                {
                  title: 'Manifest Queued',
                  subtitle: 'Barista ticket printed',
                  stepLevel: 1,
                },
                {
                  title: 'Dosing & Grinding',
                  subtitle: 'Mahlkönig EK43 single dose',
                  stepLevel: 2,
                },
                {
                  title: 'Extraction & Steam',
                  subtitle: '9-bar espresso pull & microfoam',
                  stepLevel: 3,
                },
                {
                  title: 'Ready for Service',
                  subtitle: 'Ledge pickup or courier box',
                  stepLevel: 4,
                },
              ].map((step) => {
                const currentLevel =
                  activeReceipt.status === 'placed'
                    ? 1
                    : activeReceipt.status === 'grinding'
                    ? 2
                    : activeReceipt.status === 'brewing'
                    ? 3
                    : 4;
                const isCurrent = currentLevel === step.stepLevel;
                const isDone = currentLevel > step.stepLevel || activeReceipt.status === 'ready' || activeReceipt.status === 'completed';

                return (
                  <div
                    key={step.title}
                    className={`p-3.5 rounded-xl border font-sans text-xs space-y-1 transition-all ${
                      isCurrent
                        ? 'border-[#1A1A18] bg-[#F8F7F4] shadow-xs'
                        : isDone
                        ? 'border-[#9D8461]/40 bg-white'
                        : 'border-[#1A1A18]/10 bg-white opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-[#9D8461]">
                        Stage 0{step.stepLevel}
                      </span>
                      {isDone ? (
                        <span className="text-[11px] text-[#9D8461] font-semibold">✓</span>
                      ) : isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9D8461] animate-ping" />
                      ) : null}
                    </div>
                    <h4 className="font-serif text-base font-normal text-[#1A1A18]">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[#1A1A18]/60">{step.subtitle}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Order Manifest Summary */}
          <div className="border-t border-[#1A1A18]/10 pt-6 space-y-4">
            <h3 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.02em]">
              Order Items
            </h3>
            <div className="space-y-3">
              {activeReceipt.items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-xl border border-[#1A1A18]/10 bg-[#F8F7F4] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={handleImageError}
                      className="w-11 h-11 rounded-lg object-cover border border-[#1A1A18]/10"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif text-base font-normal text-[#1A1A18]">
                        {item.product.name}
                      </h4>
                      <p className="font-sans text-[11px] text-[#1A1A18]/60">
                        Qty: {item.quantity} • {item.customization.size || 'Standard'}
                      </p>
                    </div>
                  </div>
                  <span className="font-serif text-sm text-[#1A1A18]">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-[#1A1A18]/10 bg-white font-sans text-xs space-y-1.5 text-[#1A1A18]/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#1A1A18]">${activeReceipt.subtotal.toFixed(2)}</span>
              </div>
              {activeReceipt.discount > 0 && (
                <div className="flex justify-between text-[#9D8461] font-semibold">
                  <span>Discount</span>
                  <span>-${activeReceipt.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-medium text-[#1A1A18]">${activeReceipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Barista Gratuity</span>
                <span className="font-medium text-[#1A1A18]">${activeReceipt.tip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline text-base text-[#1A1A18] pt-2 border-t border-[#1A1A18]/10 font-serif">
                <span className="text-lg">Total Settled</span>
                <span className="text-2xl font-light">${activeReceipt.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  try {
                    window.print();
                  } catch {
                    // Fallback
                  }
                }}
                className="px-5 py-2.5 rounded-full border border-[#1A1A18]/20 bg-white text-xs font-sans font-medium uppercase tracking-[0.06em] text-[#1A1A18] hover:border-[#1A1A18] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              {activeReceipt.status !== 'cancelled' && activeReceipt.status !== 'ready' && activeReceipt.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you wish to cancel this order?')) {
                      cancelOrder(activeReceipt.orderId);
                    }
                  }}
                  className="px-4 py-2.5 rounded-full border border-red-200 text-red-700 bg-red-50/50 hover:bg-red-100/60 text-xs font-sans font-medium uppercase tracking-[0.06em] transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setCompletedOrder(null);
                onNavigate('menu');
              }}
              className="px-6 py-2.5 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.06em] hover:bg-transparent hover:text-[#1A1A18] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Order Another Beverage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. EMPTY CART VIEW
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full border border-[#1A1A18]/15 bg-white mx-auto flex items-center justify-center text-[#1A1A18]/60">
          <ShoppingBag className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
            Bag Empty
          </span>
          <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#1A1A18] tracking-[-0.02em]">
            Your Bag is Empty
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#1A1A18]/70 leading-relaxed max-w-md mx-auto [text-wrap:pretty]">
            Explore our curated menu of single-origin pour-overs, handcrafted espresso classics, and fresh roasts to place your order.
          </p>
        </div>

        <button
          onClick={() => onNavigate('menu')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] hover:bg-transparent hover:text-[#1A1A18] font-sans text-xs font-medium uppercase tracking-[0.08em] transition-all cursor-pointer"
        >
          <Coffee className="w-3.5 h-3.5 text-[#9D8461]" />
          <span>Explore Atelier Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // 3. MAIN CHECKOUT VIEW
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="max-w-3xl space-y-2 border-b border-[#1A1A18]/10 pb-6">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9D8461] block">
          Dispatch & Settlement
        </span>
        <h1 className="font-serif font-light text-4xl sm:text-5xl text-[#1A1A18] tracking-[-0.02em]">
          Review & Place Order
        </h1>
        <p className="font-sans text-xs sm:text-sm text-[#1A1A18]/70">
          Verify fulfillment preference, configure barista tip, and complete your secure order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Fulfillment, Contact & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Fulfillment */}
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-4">
            <h2 className="font-serif text-2xl font-light text-[#1A1A18] flex items-center gap-2 tracking-[-0.01em]">
              <span className="w-6 h-6 rounded-full border border-[#1A1A18] text-[#1A1A18] text-xs font-sans font-medium flex items-center justify-center">
                1
              </span>
              Fulfillment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs">
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfillmentType === 'pickup'
                    ? 'border-[#1A1A18] bg-[#F8F7F4] ring-1 ring-[#1A1A18]'
                    : 'border-[#1A1A18]/15 bg-white hover:border-[#1A1A18]/40'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-medium text-[#1A1A18] uppercase tracking-[0.04em]">
                  <MapPin className="w-4 h-4 text-[#9D8461]" />
                  <span>Café Counter Pickup</span>
                </div>
                <p className="text-[11px] text-[#1A1A18]/60 mt-1 font-sans">
                  Ready in ~10-15m at the espresso bar pickup ledge
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  fulfillmentType === 'delivery'
                    ? 'border-[#1A1A18] bg-[#F8F7F4] ring-1 ring-[#1A1A18]'
                    : 'border-[#1A1A18]/15 bg-white hover:border-[#1A1A18]/40'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-medium text-[#1A1A18] uppercase tracking-[0.04em]">
                  <Clock className="w-4 h-4 text-[#9D8461]" />
                  <span>Courier Delivery</span>
                </div>
                <p className="text-[11px] text-[#1A1A18]/60 mt-1 font-sans">
                  Insulated thermal drink carrier • ~25-35m
                </p>
              </button>
            </div>

            {fulfillmentType === 'pickup' ? (
              <div className="space-y-2 pt-2 font-sans text-xs">
                <label className="block text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/60">
                  Select Roastery Location
                </label>
                <div className="space-y-2">
                  {STORE_LOCATIONS.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setSelectedLocationId(loc.id)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedLocationId === loc.id
                          ? 'border-[#1A1A18] bg-[#F8F7F4] ring-1 ring-[#1A1A18]'
                          : 'border-[#1A1A18]/10 bg-white hover:border-[#1A1A18]/30'
                      }`}
                    >
                      <div>
                        <span className="font-medium text-xs text-[#1A1A18] block">
                          {loc.name}
                        </span>
                        <span className="text-[11px] text-[#1A1A18]/60 font-sans">
                          {loc.address} • {loc.hours}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full border border-[#9D8461]/30 text-[#9D8461] text-[10px] font-medium uppercase tracking-wider">
                        ~{loc.currentWaitMins}m wait
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-2 font-sans text-xs">
                <label className="block text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/60">
                  Delivery Address & Unit / Floor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Street address, apartment, suite..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
                />
              </div>
            )}
          </div>

          {/* Section 2: Contact & Callout */}
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-4">
            <h2 className="font-serif text-2xl font-light text-[#1A1A18] flex items-center gap-2 tracking-[-0.01em]">
              <span className="w-6 h-6 rounded-full border border-[#1A1A18] text-[#1A1A18] text-xs font-sans font-medium flex items-center justify-center">
                2
              </span>
              Contact & Barista Callout
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs">
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/60 block mb-1">Your Name</span>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  placeholder="e.g. Alex"
                  className="w-full p-2.5 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
                />
              </div>
              <div>
                <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[#1A1A18]/60 block mb-1">Mobile (for SMS alert)</span>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full p-2.5 rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Gratuity & Barista Support */}
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-light text-[#1A1A18] flex items-center gap-2 tracking-[-0.01em]">
                <span className="w-6 h-6 rounded-full border border-[#1A1A18] text-[#1A1A18] text-xs font-sans font-medium flex items-center justify-center">
                  3
                </span>
                Barista Gratuity
              </h2>
              <span className="text-[11px] text-[#9D8461] uppercase tracking-[0.04em] font-medium">100% to baristas</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {[15, 18, 20, 25].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTipAmount(0);
                  }}
                  className={`py-2 px-1 sm:p-2.5 rounded-xl sm:rounded-full border text-center transition-all cursor-pointer ${
                    tipPercent === pct
                      ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                      : 'border-[#1A1A18]/15 bg-[#F8F7F4] text-[#1A1A18] hover:border-[#1A1A18]/40'
                  }`}
                >
                  <div className="text-xs font-semibold">{pct}%</div>
                  <div className="text-[10px] opacity-70 truncate">
                    ${((subtotal * pct) / 100).toFixed(2)}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs pt-1 font-sans">
              <button
                type="button"
                onClick={() => {
                  setTipPercent(null);
                  setCustomTipAmount(0);
                }}
                className="text-[11px] text-[#1A1A18]/50 hover:text-[#1A1A18] underline cursor-pointer"
              >
                No tip
              </button>
              <span className="text-xs text-[#1A1A18] font-medium">
                Tip: ${calculatedTip.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Section 4: Payment Method */}
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-4">
            <h2 className="font-serif text-2xl font-light text-[#1A1A18] flex items-center gap-2 tracking-[-0.01em]">
              <span className="w-6 h-6 rounded-full border border-[#1A1A18] text-[#1A1A18] text-xs font-sans font-medium flex items-center justify-center">
                4
              </span>
              Payment Method
            </h2>

            <div className="grid grid-cols-3 gap-2 font-sans text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                    : 'border-[#1A1A18]/15 bg-[#F8F7F4] text-[#1A1A18] hover:border-[#1A1A18]/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium whitespace-nowrap">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('google_pay')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'google_pay'
                    ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                    : 'border-[#1A1A18]/15 bg-[#F8F7F4] text-[#1A1A18] hover:border-[#1A1A18]/40'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium whitespace-nowrap">Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4]'
                    : 'border-[#1A1A18]/15 bg-[#F8F7F4] text-[#1A1A18] hover:border-[#1A1A18]/40'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium whitespace-nowrap">Credit Card</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F7F4] border border-[#1A1A18]/10 space-y-3 font-sans text-xs">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.04em] text-[#1A1A18]/60 font-medium">
                <span>
                  {paymentMethod === 'apple_pay'
                    ? 'Apple Pay Tokenized Auth'
                    : paymentMethod === 'google_pay'
                    ? 'Google Wallet Digital Token'
                    : 'PCI-DSS Compliant Card'}
                </span>
                <span className="text-[#9D8461] flex items-center gap-1 normal-case font-normal">
                  <ShieldCheck className="w-3 h-3" /> Encrypted TLS
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-medium text-[#1A1A18]/60 block">Card Number</span>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2.5 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] pl-9 focus:outline-none focus:border-[#1A1A18]"
                  />
                  <CreditCard className="w-4 h-4 text-[#1A1A18]/40 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-medium text-[#1A1A18]/60 block">Expiration</span>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2.5 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-[#1A1A18]/60 block">CVC Security</span>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full p-2.5 rounded-full bg-white border border-[#1A1A18]/15 text-xs text-[#1A1A18] focus:outline-none focus:border-[#1A1A18]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A18]/10 space-y-5">
            <div className="flex items-center justify-between border-b border-[#1A1A18]/10 pb-3">
              <h2 className="font-serif text-2xl font-light text-[#1A1A18] tracking-[-0.01em]">
                Manifest Summary ({items.length})
              </h2>
              <button
                onClick={clearCart}
                className="font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#1A1A18]/60 hover:text-[#1A1A18] transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>

            {/* Item List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-xl bg-[#F8F7F4] border border-[#1A1A18]/10 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={handleImageError}
                      className="w-12 h-12 rounded-lg object-cover border border-[#1A1A18]/10 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <h4 className="font-serif text-base font-normal text-[#1A1A18] truncate">
                          {item.product.name}
                        </h4>
                        <span className="font-serif text-sm text-[#1A1A18] ml-2">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="font-sans text-[11px] text-[#1A1A18]/60 space-y-0.5 mt-0.5">
                        {item.customization.size && (
                          <span>{item.customization.size} • {item.customization.temperature}</span>
                        )}
                        {item.customization.milkChoice !== 'No Milk / Black' && (
                          <span> • {item.customization.milkChoice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and remove */}
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#1A1A18]/10 font-sans">
                    <span className="text-[11px] text-[#1A1A18]/50">
                      ${item.unitPrice.toFixed(2)} each
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#1A1A18]/20 bg-white rounded-full overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold text-[#1A1A18]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#1A1A18] hover:bg-[#1A1A18]/10 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.cartItemId)}
                        className="p-1 text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code input */}
            <div className="pt-2 border-t border-[#1A1A18]/10">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (FIRSTROAST / BARISTA5)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-full bg-[#F8F7F4] border border-[#1A1A18]/15 uppercase font-sans placeholder:normal-case focus:outline-none focus:border-[#1A1A18]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 min-h-[40px] rounded-full border border-[#1A1A18] bg-[#1A1A18] text-[#F8F7F4] text-xs font-sans font-medium uppercase tracking-[0.06em] hover:bg-transparent hover:text-[#1A1A18] transition-colors cursor-pointer flex items-center justify-center shrink-0"
                >
                  Apply
                </button>
              </form>

              {promoMsg && (
                <p
                  className={`text-[11px] font-sans mt-1.5 ${
                    promoMsg.success ? 'text-[#9D8461] font-semibold' : 'text-red-700'
                  }`}
                >
                  {promoMsg.text}
                </p>
              )}

              {promoCode && (
                <div className="flex items-center justify-between text-xs bg-[#9D8461]/10 text-[#9D8461] p-2 rounded-xl mt-2 border border-[#9D8461]/20 font-sans">
                  <span className="font-semibold">Code: {promoCode}</span>
                  <button
                    onClick={removePromoCode}
                    className="text-[10px] uppercase underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Financial Calculations */}
            <div className="space-y-1.5 font-sans text-xs text-[#1A1A18]/70 pt-2 border-t border-[#1A1A18]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#1A1A18]">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#9D8461] font-semibold">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax (8.75%)</span>
                <span className="font-medium text-[#1A1A18]">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Barista Gratuity</span>
                <span className="font-medium text-[#1A1A18]">${calculatedTip.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-baseline text-base text-[#1A1A18] pt-2 border-t border-[#1A1A18]/10">
                <span className="font-serif text-lg">Total Due</span>
                <span className="font-serif font-light text-2xl">${total.toFixed(2)}</span>
              </div>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-sans flex items-center justify-between gap-2">
                <span>{formError}</span>
                <button
                  type="button"
                  onClick={() => setFormError(null)}
                  className="font-bold hover:opacity-75 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Submit Order Button */}
            <button
              id="checkout-place-order-btn"
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className={`w-full py-3.5 min-h-[44px] rounded-full border border-[#1A1A18] text-xs font-sans font-medium uppercase tracking-[0.08em] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-[#1A1A18]/50 text-white cursor-wait'
                  : 'bg-[#1A1A18] text-[#F8F7F4] hover:bg-transparent hover:text-[#1A1A18]'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Transmitting Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#9D8461]" />
                  <span>Authorize & Place Order • ${total.toFixed(2)}</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-sans uppercase tracking-[0.04em] text-[#1A1A18]/50">
              <ShieldCheck className="w-3 h-3 text-[#9D8461]" />
              <span>256-bit TLS Encrypted • Direct Roastery Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
