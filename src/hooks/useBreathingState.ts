
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export type BreathingType = 'flame' | 'water' | 'thunder' | 'wind' | 'shadow';

export interface BreathingSkill {
  id: string;
  name: string;
  description: string;
  type: BreathingType;
  tier: 1 | 2 | 3;
  xpCost: number;
  effects: {
    type: string;
    value: number;
  }[];
  unlocked: boolean;
  isUltimate?: boolean;
}

export const useBreathingState = () => {
  const [breathingXP, setBreathingXP] = useState<number>(3);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  
  const addBreathingXP = (amount: number) => {
    setBreathingXP(prev => prev + amount);
    
    toast({
      title: "Breathing XP Gained",
      description: `You gained ${amount} Breathing XP!`,
      variant: "default",
    });
  };
  
  const unlockSkill = (skillId: string, cost: number) => {
    if (breathingXP < cost) {
      toast({
        title: "Not Enough XP",
        description: "You don't have enough Breathing XP to unlock this skill.",
        variant: "destructive",
      });
      return false;
    }
    
    setBreathingXP(prev => prev - cost);
    setUnlockedSkills(prev => [...prev, skillId]);
    
    toast({
      title: "Skill Unlocked",
      description: "You've unlocked a new breathing technique!",
      variant: "default",
    });
    
    return true;
  };
  
  const isSkillUnlocked = (skillId: string) => {
    return unlockedSkills.includes(skillId);
  };
  
  const resetBreathingSkills = () => {
    // Return the XP spent on skills
    const refundedXP = unlockedSkills.reduce((total, skillId) => {
      // This would need actual skill costs from a skill database
      // For now, just giving a fixed amount per skill
      return total + 5;
    }, 0);
    
    setUnlockedSkills([]);
    setBreathingXP(prev => prev + refundedXP);
    
    toast({
      title: "Skills Reset",
      description: `Your breathing techniques have been reset. ${refundedXP} XP refunded.`,
      variant: "default",
    });
  };
  
  return {
    breathingXP,
    setBreathingXP,
    unlockedSkills,
    addBreathingXP,
    unlockSkill,
    isSkillUnlocked,
    resetBreathingSkills
  };
};
