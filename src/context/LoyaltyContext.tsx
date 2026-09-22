import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoyaltyUser, LoyaltyTier, LoyaltyReward, LoyaltyActivity } from '../types';
import { INITIAL_LOYALTY_USER, LOYALTY_REWARDS_CATALOG } from '../data/coffeeData';

interface LoyaltyContextType {
  user: LoyaltyUser;
  rewards: LoyaltyReward[];
  activeRewardDiscount: number; // in dollars if redeemed
  activeFreeItemCategory: string | null;
  earnPoints: (amountSpent: number, orderNumber: string) => number;
  redeemReward: (reward: LoyaltyReward) => boolean;
  clearActiveReward: () => void;
  resetToDemo: () => void;
  tierPerks: { [key in LoyaltyTier]: string[] };
}

const TIER_THRESHOLDS: { tier: LoyaltyTier; minPoints: number }[] = [
  { tier: 'Obsidian Master', minPoints: 2000 },
  { tier: 'Gold Connoisseur', minPoints: 1000 },
  { tier: 'Silver Barista', minPoints: 400 },
  { tier: 'Bronze Roaster', minPoints: 0 },
];

const TIER_PERKS: { [key in LoyaltyTier]: string[] } = {
  'Bronze Roaster': [
    'Earn 2 Beans per $1 spent',
    'Birthday handcrafted drink credit',
    'Mobile ahead ordering & pickup bypass',
  ],
  'Silver Barista': [
    'Earn 2.5 Beans per $1 spent',
    'Free alternative milks (Oat, Almond, Macadamia)',
    'Early access to limited seasonal micro-lots',
    'All Bronze benefits included',
  ],
  'Gold Connoisseur': [
    'Earn 3 Beans per $1 spent',
    'Free size upgrades on any espresso beverage',
    'Complimentary monthly 100g sample roast',
    'Direct access to cupping sessions & barista masterclasses',
    'All Silver benefits included',
  ],
  'Obsidian Master': [
    'Earn 3.5 Beans per $1 spent',
    'Complimentary annual reserve bag (Panama Geisha)',
    'VIP Reserve Bar seating & personalized cup naming',
    'Zero delivery fee on all roast club subscriptions',
    'All Gold benefits included',
  ],
};

const LoyaltyContext = createContext<LoyaltyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'aura_coffee_loyalty_user';

const safeHydrateUser = (): LoyaltyUser => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && typeof parsed.points === 'number' && typeof parsed.tier === 'string') {
        return {
          ...INITIAL_LOYALTY_USER,
          ...parsed,
          points: Math.max(0, parsed.points),
          lifetimePoints: Math.max(parsed.points || 0, parsed.lifetimePoints || 0),
          history: Array.isArray(parsed.history) ? parsed.history : INITIAL_LOYALTY_USER.history,
        };
      }
    }
  } catch (err) {
    console.warn('Could not restore loyalty user:', err);
  }
  return INITIAL_LOYALTY_USER;
};

export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LoyaltyUser>(() => safeHydrateUser());

  const [activeRewardDiscount, setActiveRewardDiscount] = useState<number>(0);
  const [activeFreeItemCategory, setActiveFreeItemCategory] = useState<string | null>(null);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && typeof parsed === 'object' && typeof parsed.points === 'number') {
            setUser((prev) => ({
              ...prev,
              ...parsed,
            }));
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  const calculateTier = (lifetimePoints: number): LoyaltyTier => {
    for (const t of TIER_THRESHOLDS) {
      if (lifetimePoints >= t.minPoints) {
        return t.tier;
      }
    }
    return 'Bronze Roaster';
  };

  const earnPoints = (amountSpent: number, orderNumber: string): number => {
    // Multipliers by tier
    let multiplier = 2;
    if (user.tier === 'Silver Barista') multiplier = 2.5;
    if (user.tier === 'Gold Connoisseur') multiplier = 3;
    if (user.tier === 'Obsidian Master') multiplier = 3.5;

    const pointsEarned = Math.round(amountSpent * multiplier);
    const newLifetime = user.lifetimePoints + pointsEarned;
    const newCurrent = user.points + pointsEarned;
    const newTier = calculateTier(newLifetime);

    const newActivity: LoyaltyActivity = {
      id: `act-${Date.now()}`,
      date: 'Just now',
      description: `Order #${orderNumber} (${pointsEarned} beans at ${multiplier}x tier rate)`,
      pointsChange: pointsEarned,
      type: 'earn',
    };

    setUser((prev) => ({
      ...prev,
      points: newCurrent,
      lifetimePoints: newLifetime,
      tier: newTier,
      history: [newActivity, ...prev.history],
    }));

    return pointsEarned;
  };

  const redeemReward = (reward: LoyaltyReward): boolean => {
    if (user.points < reward.pointsCost) {
      return false;
    }

    const newActivity: LoyaltyActivity = {
      id: `act-${Date.now()}`,
      date: 'Just now',
      description: `Redeemed ${reward.title}`,
      pointsChange: -reward.pointsCost,
      type: 'redeem',
    };

    setUser((prev) => ({
      ...prev,
      points: prev.points - reward.pointsCost,
      rewardsRedeemedCount: prev.rewardsRedeemedCount + 1,
      history: [newActivity, ...prev.history],
    }));

    // Apply benefit
    if (reward.id === 'rew-free-beverage') {
      setActiveRewardDiscount(6.75); // cover up to $6.75
      setActiveFreeItemCategory('drink');
    } else if (reward.id === 'rew-free-pastry') {
      setActiveRewardDiscount(4.95);
      setActiveFreeItemCategory('pastry');
    } else if (reward.id === 'rew-panama-geisha-pour') {
      setActiveRewardDiscount(12.00);
      setActiveFreeItemCategory('geisha');
    } else if (reward.id === 'rew-roast-bag') {
      setActiveRewardDiscount(19.50);
      setActiveFreeItemCategory('beans');
    }

    return true;
  };

  const clearActiveReward = () => {
    setActiveRewardDiscount(0);
    setActiveFreeItemCategory(null);
  };

  const resetToDemo = () => {
    setUser(INITIAL_LOYALTY_USER);
    clearActiveReward();
  };

  return (
    <LoyaltyContext.Provider
      value={{
        user,
        rewards: LOYALTY_REWARDS_CATALOG,
        activeRewardDiscount,
        activeFreeItemCategory,
        earnPoints,
        redeemReward,
        clearActiveReward,
        resetToDemo,
        tierPerks: TIER_PERKS,
      }}
    >
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error('useLoyalty must be used within a LoyaltyProvider');
  }
  return context;
};
