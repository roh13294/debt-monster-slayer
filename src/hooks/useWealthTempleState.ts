
import { useState, useEffect } from 'react';
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
  icon?: React.ReactNode;
}

interface TempleDefenseEvent {
  id: string;
  difficulty: 'easy' | 'normal' | 'hard';
  rewards: {
    demonCoins: number;
    breathingXP: number;
    relicChance: number;
  };
  completed: boolean;
}

export const useWealthTempleState = () => {
  const [templeLevel, setTempleLevel] = useState<number>(1);
  const [relics, setRelics] = useState<TempleRelic[]>([]);
  const [relicSlots, setRelicSlots] = useState<number>(0);
  const [equippedRelics, setEquippedRelics] = useState<string[]>([]);
  const [shrineSpins, setShrineSpins] = useState<number>(0);
  const [defenseEvents, setDefenseEvents] = useState<TempleDefenseEvent[]>([]);
  const [templeGuardianDefeated, setTempleGuardianDefeated] = useState<boolean>(false);
  
  // Load animation states
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const [relicFusionInProgress, setRelicFusionInProgress] = useState(false);
  
  const getTempleTierName = (level: number = templeLevel) => {
    const tierNames = [
      "Shrine Ruins",
      "Inner Grove",
      "Sky Altar",
      "Spirit Chamber",
      "Celestial Gate"
    ];
    return tierNames[Math.min(level - 1, 4)];
  };
  
  const getTemplePassiveReturnRate = (level: number = templeLevel, hasShadowPenalty: boolean = false) => {
    const baseRates = [0.03, 0.035, 0.04, 0.05, 0.06];
    
    let rate = baseRates[Math.min(level - 1, 4)];
    
    // Apply shadow form penalty if needed
    if (hasShadowPenalty) {
      rate *= 0.7;
    }
    
    // Apply relic bonuses
    const relicBonus = calculateRelicBonus('temple_return_rate');
    
    return rate + relicBonus;
  };
  
  const calculateMonthlyTempleReturn = (cash: number, hasShadowPenalty: boolean = false) => {
    const rate = getTemplePassiveReturnRate(templeLevel, hasShadowPenalty);
    return Math.floor(cash * rate);
  };
  
  const calculateRelicBonus = (effectType: string) => {
    // Get equipped relics that have this effect
    const relevantRelics = relics
      .filter(relic => equippedRelics.includes(relic.id))
      .filter(relic => relic.effect.type === effectType);
    
    // Sum up their bonuses
    return relevantRelics.reduce((sum, relic) => sum + relic.effect.value, 0);
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
    
    if (!templeGuardianDefeated && templeLevel >= 1) {
      toast({
        title: "Guardian Blocks Your Path",
        description: "You must defeat the Temple Guardian to proceed with the upgrade.",
        variant: "destructive", 
      });
      
      // Trigger guardian battle event
      triggerGuardianBattle();
      
      return false;
    }
    
    setShowLevelUpAnimation(true);
    
    // Create a level up sound effect
    const audio = new Audio('/sounds/temple-level-up.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
    
    setTimeout(() => {
      setTempleLevel(prev => prev + 1);
      
      // Update relic slots based on new level
      const newSlots = [0, 1, 3, 5, 8];
      setRelicSlots(newSlots[Math.min(templeLevel, 4)]);
      
      // Reset guardian defeated flag for next level
      setTempleGuardianDefeated(false);
      
      toast({
        title: "Temple Upgraded!",
        description: `Your Wealth Temple has been upgraded to ${getTempleTierName(templeLevel + 1)}!`,
        variant: "default",
      });
      
      setShowLevelUpAnimation(false);
    }, 2000);
    
    return upgradeCost;
  };
  
  const acquireRelic = (relic: TempleRelic) => {
    setRelics(prev => [...prev, relic]);
    
    toast({
      title: "Relic Acquired",
      description: `You've acquired the ${relic.rarity} relic: ${relic.name}!`,
      variant: "default",
    });
    
    // Create a relic obtain sound effect
    const audio = new Audio('/sounds/relic-obtained.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.error("Audio playback error:", e));
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
    
    // Create a relic equip sound effect
    const audio = new Audio('/sounds/relic-equip.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.error("Audio playback error:", e));
    
    return true;
  };
  
  const unequipRelic = (relicId: string) => {
    setEquippedRelics(prev => prev.filter(id => id !== relicId));
    return true;
  };
  
  const performShrineGamble = (cost: number, cash: number) => {
    if (cash < cost) {
      toast({
        title: "Not Enough DemonCoins",
        description: `You need ${cost} DemonCoins to make an offering to the shrine.`,
        variant: "destructive",
      });
      return null;
    }
    
    // Play gamble animation sound
    const audio = new Audio('/sounds/shrine-pull.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.error("Audio playback error:", e));
    
    setShrineSpins(prev => prev + 1);
    
    // Generate random relic based on rarity chance
    const rarityRoll = Math.random();
    let rarity: 'common' | 'rare' | 'legendary' = 'common';
    
    if (rarityRoll > 0.95) rarity = 'legendary';
    else if (rarityRoll > 0.70) rarity = 'rare';
    
    // Simple pool of possible relics
    const relicPool = {
      legendary: [
        {
          id: `legendary_${Date.now()}`,
          name: "Seraph Sigil",
          description: "A divine marking that can save you from financial ruin.",
          effect: {
            type: "revival_chance",
            value: 0.1
          },
          rarity: 'legendary' as const
        }
      ],
      rare: [
        {
          id: `rare_${Date.now()}`,
          name: "Aura Prism",
          description: "A crystal that radiates healing energy to your spirit.",
          effect: {
            type: "auto_heal",
            value: 0.05
          },
          rarity: 'rare' as const
        }
      ],
      common: [
        {
          id: `common_${Date.now()}`,
          name: "Sage Coin",
          description: "An ancient coin believed to bring financial wisdom.",
          effect: {
            type: "temple_return_rate",
            value: 0.02
          },
          rarity: 'common' as const
        }
      ]
    };
    
    // Select a relic based on rarity
    const selectedRelic = relicPool[rarity][Math.floor(Math.random() * relicPool[rarity].length)];
    
    // Add relic to collection
    setTimeout(() => {
      acquireRelic(selectedRelic);
    }, 2000);
    
    return {
      cost,
      relic: selectedRelic
    };
  };
  
  const fuseRelics = (relicId1: string, relicId2: string) => {
    const relic1 = relics.find(r => r.id === relicId1);
    const relic2 = relics.find(r => r.id === relicId2);
    
    if (!relic1 || !relic2) {
      toast({
        title: "Fusion Failed",
        description: "One or both relics not found in your collection.",
        variant: "destructive",
      });
      return false;
    }
    
    setRelicFusionInProgress(true);
    
    // Play fusion sound effect
    const audio = new Audio('/sounds/relic-fusion.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
    
    setTimeout(() => {
      // Remove the source relics
      setRelics(prev => prev.filter(r => r.id !== relicId1 && r.id !== relicId2));
      
      // If either was equipped, unequip it
      if (equippedRelics.includes(relicId1)) {
        unequipRelic(relicId1);
      }
      if (equippedRelics.includes(relicId2)) {
        unequipRelic(relicId2);
      }
      
      // Create a new, stronger relic
      const newRelic: TempleRelic = {
        id: `fused_${Date.now()}`,
        name: "Mythical " + (relic1.name.split(' ')[0] || "Artifact"),
        description: "A powerful relic born from the fusion of two lesser artifacts.",
        effect: {
          type: relic1.effect.type, // Use the effect type of the first relic
          value: relic1.effect.value * 1.5 // 50% stronger
        },
        rarity: 'legendary' // Fused relics are always legendary
      };
      
      // Add the new relic
      setRelics(prev => [...prev, newRelic]);
      
      toast({
        title: "Fusion Successful!",
        description: `Created a new legendary relic: ${newRelic.name}!`,
        variant: "default",
      });
      
      setRelicFusionInProgress(false);
    }, 3000);
    
    return true;
  };
  
  const triggerGuardianBattle = () => {
    // In a real implementation, this would trigger a special battle event
    toast({
      title: "Temple Guardian Appears",
      description: "The Guardian of the Temple stands before you, blocking your path to ascension.",
      variant: "default",
    });
    
    // This would be replaced with actual battle mechanics
    return true;
  };
  
  const defeatTempleGuardian = () => {
    setTempleGuardianDefeated(true);
    
    toast({
      title: "Guardian Defeated!",
      description: "You have proven yourself worthy. The temple recognizes your strength.",
      variant: "default",
    });
    
    return true;
  };
  
  const triggerTempleDefenseEvent = () => {
    // Create a random temple defense event
    const newEvent: TempleDefenseEvent = {
      id: `defense_${Date.now()}`,
      difficulty: Math.random() > 0.7 ? 'hard' : Math.random() > 0.4 ? 'normal' : 'easy',
      rewards: {
        demonCoins: Math.floor(Math.random() * 500) + 200,
        breathingXP: Math.floor(Math.random() * 3) + 1,
        relicChance: Math.random() > 0.7 ? 1 : 0
      },
      completed: false
    };
    
    setDefenseEvents(prev => [...prev, newEvent]);
    
    toast({
      title: "Shadow Invasion!",
      description: "Dark forces are assaulting your temple! Defend it to protect your wealth.",
      variant: "destructive",
    });
    
    return newEvent;
  };
  
  const completeDefenseEvent = (eventId: string, success: boolean) => {
    if (!success) {
      toast({
        title: "Temple Defenses Failed",
        description: "The shadows have damaged your temple. Your passive returns will be reduced until repairs are made.",
        variant: "destructive",
      });
      
      return false;
    }
    
    setDefenseEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, completed: true } : event
      )
    );
    
    const event = defenseEvents.find(e => e.id === eventId);
    if (!event) return false;
    
    toast({
      title: "Temple Successfully Defended!",
      description: `You've earned ${event.rewards.demonCoins} DemonCoins and ${event.rewards.breathingXP} Breathing XP.`,
      variant: "default",
    });
    
    // In a real implementation, this would award the rewards to the player
    
    return true;
  };
  
  return {
    templeLevel,
    relics,
    relicSlots,
    equippedRelics,
    shrineSpins,
    defenseEvents,
    templeGuardianDefeated,
    showLevelUpAnimation,
    getTempleTierName,
    getTemplePassiveReturnRate,
    calculateMonthlyTempleReturn,
    calculateRelicBonus,
    upgradeTemple,
    acquireRelic,
    equipRelic,
    unequipRelic,
    performShrineGamble,
    fuseRelics,
    triggerGuardianBattle,
    defeatTempleGuardian,
    triggerTempleDefenseEvent,
    completeDefenseEvent
  };
};
