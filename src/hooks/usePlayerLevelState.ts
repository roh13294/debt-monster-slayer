
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { TitleTier } from '@/types/gameTypes';
import { gameTerms } from '@/utils/gameTerms';

export const TITLE_TIERS: TitleTier[] = [
  { 
    level: 1, 
    title: "Wandering Soul", 
    perk: null,
    description: "A fresh recruit with potential yet to be discovered",
    aura: "from-slate-400 to-slate-600"
  },
  { 
    level: 3, 
    title: "Debt Brawler", 
    perk: "+5% cash from loot",
    description: "You've learned to stand and fight against the darkness",
    aura: "from-blue-400 to-blue-600" 
  },
  { 
    level: 5, 
    title: "Shadow Initiate", 
    perk: "+1 special move per mission",
    description: "The boundary between light and shadow becomes visible to you",
    aura: "from-purple-400 to-purple-600" 
  },
  { 
    level: 8, 
    title: "Breathing Adept", 
    perk: "+10% XP gain",
    description: "Your breathing techniques grow stronger with each battle",
    aura: "from-cyan-400 to-teal-600" 
  },
  { 
    level: 12, 
    title: "Relic Hunter", 
    perk: "+1 bonus relic slot",
    description: "Ancient powers respond to your growing spiritual presence",
    aura: "from-amber-400 to-amber-600" 
  },
  { 
    level: 15, 
    title: "Demon Slayer", 
    perk: "Unlock Elite Dungeon Raids",
    description: "You are recognized among the ranks of true demon slayers",
    aura: "from-red-400 to-red-600" 
  },
  { 
    level: 20, 
    title: "Bladelord Magnate", 
    perk: "+20% wealth temple passive income",
    description: "Your legend grows, inspiring fear in demons and respect in allies",
    aura: "from-emerald-400 to-emerald-600" 
  },
  { 
    level: 30, 
    title: "Ascendant", 
    perk: "All breathing styles unlocked",
    description: "You have transcended ordinary limits of human potential",
    aura: "from-yellow-300 to-red-600" 
  }
];

export function usePlayerLevelState() {
  const [playerXP, setPlayerXP] = useState<number>(0);
  const [playerLevel, setPlayerLevel] = useState<number>(1);
  const [playerTitle, setPlayerTitle] = useState<string>(TITLE_TIERS[0].title);
  const [playerPerk, setPlayerPerk] = useState<string | null>(TITLE_TIERS[0].perk);
  const [isLevelingUp, setIsLevelingUp] = useState<boolean>(false);

  // Calculate XP threshold for a given level
  const getXPThreshold = (level: number): number => {
    return 100 + (level - 1) * 50;
  };

  // Find the next title based on player level
  const getNextTitle = (level: number): TitleTier | null => {
    const future = TITLE_TIERS.find(t => t.level > level);
    return future || null;
  };

  // Get the current title tier object
  const getCurrentTitleTier = (): TitleTier => {
    const availableTitles = TITLE_TIERS.filter(t => t.level <= playerLevel);
    return availableTitles[availableTitles.length - 1];
  };

  // Player gains XP and potentially levels up
  const gainXP = (amount: number): void => {
    setPlayerXP(prev => {
      const newXP = prev + amount;
      const xpToLevel = getXPThreshold(playerLevel);

      if (newXP >= xpToLevel) {
        const overflow = newXP - xpToLevel;
        levelUp();
        return overflow;
      }
      return newXP;
    });
  };

  // Level up the player
  const levelUp = (): void => {
    setIsLevelingUp(true);
    setPlayerLevel(prev => prev + 1);
    
    // Check if we earned a new title
    const newLevel = playerLevel + 1;
    assignNewTitle(newLevel);
    
    // Show level up notification
    toast({
      title: "Level Up!",
      description: `You've reached Level ${newLevel}! Your powers grow stronger.`,
      variant: "default",
    });
    
    // Reset level up animation after a short delay
    setTimeout(() => {
      setIsLevelingUp(false);
    }, 3000);
  };

  // Assign a new title based on level
  const assignNewTitle = (newLevel: number): void => {
    const availableTitles = TITLE_TIERS.filter(t => t.level <= newLevel);
    const highestTitle = availableTitles[availableTitles.length - 1];
    
    // Only update and show notification if title is changing
    if (highestTitle.title !== playerTitle) {
      setPlayerTitle(highestTitle.title);
      setPlayerPerk(highestTitle.perk);
      
      // Show new title notification
      toast({
        title: "New Title Achieved!",
        description: `You are now a "${highestTitle.title}"! ${highestTitle.perk ? `Perk: ${highestTitle.perk}` : ''}`,
        variant: "default",
      });
    }
  };

  // Initialize player level state
  const initPlayerLevelState = (): void => {
    setPlayerXP(0);
    setPlayerLevel(1);
    setPlayerTitle(TITLE_TIERS[0].title);
    setPlayerPerk(TITLE_TIERS[0].perk);
  };

  // Reset player level state
  const resetPlayerLevelState = (): void => {
    setPlayerXP(0);
    setPlayerLevel(1);
    setPlayerTitle(TITLE_TIERS[0].title);
    setPlayerPerk(TITLE_TIERS[0].perk);
    setIsLevelingUp(false);
  };

  return {
    playerXP,
    setPlayerXP,
    playerLevel,
    setPlayerLevel,
    playerTitle,
    playerPerk,
    isLevelingUp,
    gainXP,
    getXPThreshold,
    getNextTitle,
    getCurrentTitleTier,
    initPlayerLevelState,
    resetPlayerLevelState
  };
}
