
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface TempleRelic {
  id: string;
  name: string;
  description: string;
  effect: {
    type: string;
    value: number;
  };
  rarity: 'common' | 'rare' | 'legendary';
}

export const useWealthTempleState = () => {
  const [templeLevel, setTempleLevel] = useState<number>(1);
  const [relics, setRelics] = useState<TempleRelic[]>([]);
  const [relicSlots, setRelicSlots] = useState<number>(0);
  const [equippedRelics, setEquippedRelics] = useState<string[]>([]);
  
  const getTemplePassiveReturnRate = (level: number = templeLevel, hasShadowPenalty: boolean = false) => {
    const baseRates = [0.03, 0.035, 0.04, 0.05, 0.06];
    
    let rate = baseRates[Math.min(level - 1, 4)];
    
    // Apply shadow form penalty if needed
    if (hasShadowPenalty) {
      rate *= 0.7;
    }
    
    // Apply relic bonuses (implementation would check equipped relics)
    const relicBonus = 0; // would calculate from equipped relics
    
    return rate + relicBonus;
  };
  
  const calculateMonthlyTempleReturn = (cash: number, hasShadowPenalty: boolean = false) => {
    const rate = getTemplePassiveReturnRate(templeLevel, hasShadowPenalty);
    return Math.floor(cash * rate);
  };
  
  const upgradeTemple = (cash: number, upgradeCost: number) => {
    if (templeLevel >= 5) {
      toast({
        title: "Maximum Level Reached",
        description: "Your Wealth Temple is already at maximum level.",
        variant: "default",
      });
      return false;
    }
    
    if (cash < upgradeCost) {
      toast({
        title: "Not Enough DemonCoins",
        description: "You don't have enough DemonCoins to upgrade your temple.",
        variant: "destructive",
      });
      return false;
    }
    
    setTempleLevel(prev => prev + 1);
    
    // Update relic slots based on new level
    const newSlots = [0, 1, 3, 5, 8];
    setRelicSlots(newSlots[Math.min(templeLevel, 4)]);
    
    toast({
      title: "Temple Upgraded",
      description: "Your Wealth Temple has been upgraded to the next tier!",
      variant: "default",
    });
    
    return upgradeCost;
  };
  
  const acquireRelic = (relic: TempleRelic) => {
    setRelics(prev => [...prev, relic]);
    
    toast({
      title: "Relic Acquired",
      description: `You've acquired the ${relic.rarity} relic: ${relic.name}!`,
      variant: "default",
    });
  };
  
  const equipRelic = (relicId: string) => {
    if (equippedRelics.length >= relicSlots) {
      toast({
        title: "No Slots Available",
        description: "Upgrade your temple to unlock more relic slots.",
        variant: "destructive",
      });
      return false;
    }
    
    setEquippedRelics(prev => [...prev, relicId]);
    return true;
  };
  
  const unequipRelic = (relicId: string) => {
    setEquippedRelics(prev => prev.filter(id => id !== relicId));
    return true;
  };
  
  return {
    templeLevel,
    relics,
    relicSlots,
    equippedRelics,
    getTemplePassiveReturnRate,
    calculateMonthlyTempleReturn,
    upgradeTemple,
    acquireRelic,
    equipRelic,
    unequipRelic
  };
};
