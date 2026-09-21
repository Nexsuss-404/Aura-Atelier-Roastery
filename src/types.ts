export type PageType = 'home' | 'menu' | 'gallery' | 'checkout' | 'states';

export type PageStateCategory = 
  | 'Interaction'
  | 'Feedback & Async'
  | 'Access & Security'
  | 'Form & Input'
  | 'Lifecycle & Records'
  | 'Network & Transfer';

export type PageStateId = 
  | 'default'
  | 'hover'
  | 'focus'
  | 'active'
  | 'pressed'
  | 'selected'
  | 'disabled'
  | 'loading'
  | 'success'
  | 'error'
  | 'warning'
  | 'empty'
  | 'skeleton'
  | 'offline'
  | 'restricted'
  | 'authentication'
  | 'not_found'
  | 'maintenance'
  | 'locked'
  | 'expanded'
  | 'collapsed'
  | 'checked'
  | 'unchecked'
  | 'indeterminate'
  | 'read_only'
  | 'required'
  | 'optional'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'draft'
  | 'published'
  | 'archived'
  | 'no_results'
  | 'partial'
  | 'syncing'
  | 'updating'
  | 'saving'
  | 'saved'
  | 'deleted'
  | 'uploading'
  | 'downloading'
  | 'connection_lost';

export interface PageStateMeta {
  id: PageStateId;
  label: string;
  category: PageStateCategory;
  description: string;
  badgeTone?: 'neutral' | 'accent' | 'warning' | 'error' | 'success' | 'info';
}

export type Category = 
  | 'all'
  | 'espresso'
  | 'pourover'
  | 'coldbrew'
  | 'signatures'
  | 'beans'
  | 'pastries';

export type RoastLevel = 'Light' | 'Medium-Light' | 'Medium' | 'Medium-Dark' | 'Dark';

export interface FlavorProfile {
  acidity: number; // 1-5
  sweetness: number; // 1-5
  body: number; // 1-5
  aroma: number; // 1-5
  bitterness: number; // 1-5
}

export interface BrewGuide {
  method: string;
  waterTemp: string;
  ratio: string;
  grindSize: string;
  brewTime: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'espresso' | 'pourover' | 'coldbrew' | 'signatures' | 'beans' | 'pastries';
  price: number;
  description: string;
  image: string;
  origin?: string;
  region?: string;
  farm?: string;
  altitude?: string;
  process?: 'Washed' | 'Natural' | 'Honey' | 'Anaerobic Fermentation' | 'Swiss Water Decaf' | 'Pulped Natural' | 'Washed & Pulped Natural' | string;
  roastLevel?: RoastLevel;
  tastingNotes: string[];
  flavorProfile?: FlavorProfile;
  brewGuide?: BrewGuide;
  calories?: number;
  caffeineMg?: number;
  isDailySpecial?: boolean;
  specialDiscountPercent?: number;
  specialRemaining?: number;
  isCustomRoast?: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  rating: number;
  reviewCount: number;
}

export interface DrinkCustomization {
  size: 'Regular (8oz)' | 'Grande (12oz)' | 'Reserve (16oz)';
  temperature: 'Hot' | 'Iced' | 'Extra Hot';
  roastChoice: string;
  milkChoice: string;
  espressoShots: number;
  sweetness: '0% Unsweetened' | '25% Light' | '50% Half Sweet' | '100% Full Sweet';
  syrup: string;
  extraIce: boolean;
  grindOption?: string; // For whole beans
  notes?: string;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  customization: DrinkCustomization;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export type LoyaltyTier = 'Bronze Roaster' | 'Silver Barista' | 'Gold Connoisseur' | 'Obsidian Master';

export interface LoyaltyReward {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  category: 'drink' | 'discount' | 'beans' | 'merch';
  icon: string;
}

export interface LoyaltyActivity {
  id: string;
  date: string;
  description: string;
  pointsChange: number;
  type: 'earn' | 'redeem' | 'bonus';
}

export interface LoyaltyUser {
  id: string;
  name: string;
  email: string;
  memberSince: string;
  tier: LoyaltyTier;
  points: number;
  lifetimePoints: number;
  rewardsRedeemedCount: number;
  history: LoyaltyActivity[];
}

export type OrderStatus = 'placed' | 'grinding' | 'brewing' | 'ready' | 'completed';

export interface Order {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  total: number;
  loyaltyPointsEarned: number;
  loyaltyPointsRedeemed: number;
  status: OrderStatus;
  fulfillmentType: 'pickup' | 'delivery';
  pickupLocation: string;
  estimatedMinutes: number;
  customer: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  paymentMethod: 'apple_pay' | 'google_pay' | 'card';
}

export interface CustomBlendConfig {
  name: string;
  bean1Id: string;
  bean1Percentage: number;
  bean2Id: string;
  bean2Percentage: number;
  roastLevel: RoastLevel;
  grindPreference: string;
  bagSize: '250g' | '500g' | '1kg';
  customNotes: string;
}

export interface ToastData {
  id: string;
  product: Product;
  message: string;
  size?: string;
  timestamp: number;
}

