
import { useState, useEffect } from 'react';
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
  isCorrupted?: boolean;
  requires?: string[];
}

export const useBreathingState = () => {
  const [breathingXP, setBreathingXP] = useState<number>(3);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [activeStyle, setActiveStyle] = useState<BreathingType | null>(null);
  const [skillComboEffects, setSkillComboEffects] = useState<{[key: string]: boolean}>({});
  
  const addBreathingXP = (amount: number) => {
    setBreathingXP(prev => prev + amount);
    
    // Only show toast for significant XP gains
    if (amount >= 3) {
      toast({
        title: "Breathing XP Gained",
        description: `You gained ${amount} Breathing XP!`,
        variant: "default",
      });
      
      const audio = new Audio('/sounds/xp-gain.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.error("Audio playback error:", e));
    }
  };
  
  const unlockSkill = (skill: BreathingSkill) => {
    if (breathingXP < skill.xpCost) {
      toast({
        title: "Not Enough XP",
        description: `You don't have enough Breathing XP to unlock this skill.`,
        variant: "destructive",
      });
      return false;
    }
    
    // Check if required skills are unlocked
    if (skill.requires && skill.requires.length > 0) {
      const missingSkills = skill.requires.filter(req => !unlockedSkills.includes(req));
      if (missingSkills.length > 0) {
        toast({
          title: "Prerequisites Not Met",
          description: "You need to unlock the required skills first.",
          variant: "destructive",
        });
        return false;
      }
    }
    
    setBreathingXP(prev => prev - skill.xpCost);
    setUnlockedSkills(prev => [...prev, skill.id]);
    
    // Potentially set as active style if this is the first skill of this type
    if (activeStyle === null) {
      setActiveStyle(skill.type);
    }
    
    // Check for skill combos
    checkForCombos();
    
    // Special effect for corrupted skills
    if (skill.isCorrupted) {
      toast({
        title: "Dark Power Awakened",
        description: "You've unlocked a corrupted skill. Tread carefully.",
        variant: "destructive",
      });
      
      // Corrupted skill unlock effect
      const audio = new Audio('/sounds/corrupted-skill.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback error:", e));
    } else {
      toast({
        title: `${skill.name} Unlocked!`,
        description: `You've mastered the ${skill.type} breathing technique.`,
        variant: "default",
      });
      
      // Normal skill unlock effect
      const audio = new Audio('/sounds/skill-unlock.mp3');
      audio.volume = 0.4;
      audio.play().catch(e => console.error("Audio playback error:", e));
    }
    
    return true;
  };
  
  const isSkillUnlocked = (skillId: string) => {
    return unlockedSkills.includes(skillId);
  };
  
  const checkForCombos = () => {
    // Check for Thunder + Wind combo
    const hasThunderBasic = unlockedSkills.includes('thunder_basic');
    const hasWindBasic = unlockedSkills.includes('wind_basic');
    
    if (hasThunderBasic && hasWindBasic && !skillComboEffects['shock_cyclone']) {
      setSkillComboEffects(prev => ({...prev, shock_cyclone: true}));
      
      toast({
        title: "New Combo Unlocked!",
        description: "Thunder + Wind = Shock Cyclone Style now available!",
        variant: "default",
      });
      
      // Combo unlock sound effect
      const audio = new Audio('/sounds/combo-unlock.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback error:", e));
    }
    
    // Check other potential combos here
  };
  
  const resetBreathingSkills = () => {
    // Return the XP spent on skills
    const refundedXP = unlockedSkills.reduce((total, skillId) => {
      // This would need actual skill costs from a skill database
      // For now, just giving a fixed amount per skill
      return total + 5;
    }, 0);
    
    setUnlockedSkills([]);
    setActiveStyle(null);
    setSkillComboEffects({});
    setBreathingXP(prev => prev + refundedXP);
    
    toast({
      title: "Skills Reset",
      description: `Your breathing techniques have been reset. ${refundedXP} XP refunded.`,
      variant: "default",
    });
  };
  
  // Get available skills based on unlocked skills and active style
  const getAvailableSkills = (shadowForm: string | null): BreathingSkill[] => {
    const baseSkills: BreathingSkill[] = [
      // Flame breathing skills
      {
        id: 'flame_basic',
        name: 'Basic Flame Breathing',
        description: 'Master the fundamentals of flame breathing techniques.',
        type: 'flame',
        tier: 1,
        xpCost: 3,
        effects: [
          { type: 'damage', value: 10 },
          { type: 'spirit_regen', value: 5 }
        ],
        unlocked: isSkillUnlocked('flame_basic')
      },
      // More skills would be defined here
    ];
    
    // Add corrupted skills if player has shadow form
    if (shadowForm) {
      baseSkills.push({
        id: 'flame_blood',
        name: 'Blood Flame',
        description: 'A forbidden technique that harnesses the shadow\'s power through flame breathing.',
        type: 'flame',
        tier: 2,
        xpCost: 5,
        effects: [
          { type: 'damage', value: 25 },
          { type: 'demon_coins_loss', value: 10 }
        ],
        unlocked: isSkillUnlocked('flame_blood'),
        isCorrupted: true,
        requires: ['flame_basic']
      });
      // More corrupted skills would be defined here
    }
    
    // Add combo skills if requirements met
    if (skillComboEffects['shock_cyclone']) {
      baseSkills.push({
        id: 'shock_cyclone',
        name: 'Shock Cyclone Style',
        description: 'A powerful combination of thunder and wind breathing techniques.',
        type: 'thunder', // Primary type
        tier: 3,
        xpCost: 8,
        effects: [
          { type: 'damage', value: 30 },
          { type: 'critical_chance', value: 15 }
        ],
        unlocked: isSkillUnlocked('shock_cyclone'),
        requires: ['thunder_basic', 'wind_basic']
      });
    }
    
    return baseSkills;
  };
  
  return {
    breathingXP,
    setBreathingXP,
    unlockedSkills,
    activeStyle,
    setActiveStyle,
    skillComboEffects,
    addBreathingXP,
    unlockSkill,
    isSkillUnlocked,
    resetBreathingSkills,
    getAvailableSkills
  };
};
