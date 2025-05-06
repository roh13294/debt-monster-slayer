
import { toast } from '@/hooks/use-toast';

// Define the breathing style types and their effects
export type BreathingStyleType = 'flame' | 'water' | 'thunder' | 'wind' | 'shadow';

export interface BreathingStyle {
  id: string;
  name: string;
  description: string;
  elementType: BreathingStyleType;
  attackMultiplier: number;
  defenseMultiplier: number;
  spiritCostModifier: number;
  critChance: number;
  healChance: number;
  comboModifier: number;
  specialEffect?: () => void;
  visualEffect: {
    color: string;
    animationClass: string;
    particleEffect: string;
  };
}

export const BREATHING_STYLES: Record<string, BreathingStyle> = {
  flame: {
    id: 'flame',
    name: 'Flame Breathing',
    description: 'A powerful style focused on aggressive attacks with increased damage output.',
    elementType: 'flame',
    attackMultiplier: 1.2,
    defenseMultiplier: 0.9,
    spiritCostModifier: 1.1,
    critChance: 0.1,
    healChance: 0,
    comboModifier: 1.5,
    specialEffect: () => {
      toast({
        title: "Flame Surge",
        description: "Your flame breathing ignites for additional damage!",
        variant: "default",
      });
    },
    visualEffect: {
      color: 'from-red-600 to-orange-500',
      animationClass: 'animate-flame-pulse',
      particleEffect: 'flame-particles'
    }
  },
  water: {
    id: 'water',
    name: 'Water Breathing',
    description: 'A flowing style that reduces spirit energy costs and provides recovery.',
    elementType: 'water',
    attackMultiplier: 0.9,
    defenseMultiplier: 1.2,
    spiritCostModifier: 0.85,
    critChance: 0.05,
    healChance: 0.15,
    comboModifier: 1.0,
    specialEffect: () => {
      toast({
        title: "Water Flow",
        description: "Your water breathing technique restores spirit energy!",
        variant: "default",
      });
    },
    visualEffect: {
      color: 'from-blue-600 to-cyan-500',
      animationClass: 'animate-water-ripple',
      particleEffect: 'water-ripples'
    }
  },
  thunder: {
    id: 'thunder',
    name: 'Thunder Breathing',
    description: 'An unpredictable style with high critical hit chance but less consistency.',
    elementType: 'thunder',
    attackMultiplier: 1.0,
    defenseMultiplier: 0.8,
    spiritCostModifier: 1.0,
    critChance: 0.25,
    healChance: 0,
    comboModifier: 1.2,
    specialEffect: () => {
      toast({
        title: "Thunder Strike",
        description: "Your thunder breathing technique lands a critical hit!",
        variant: "default",
      });
    },
    visualEffect: {
      color: 'from-purple-600 to-indigo-500',
      animationClass: 'animate-lightning-flash',
      particleEffect: 'lightning-sparks'
    }
  },
  wind: {
    id: 'wind',
    name: 'Wind Breathing',
    description: 'A quick style that enhances evasion and combo building.',
    elementType: 'wind',
    attackMultiplier: 0.8,
    defenseMultiplier: 1.0,
    spiritCostModifier: 0.9,
    critChance: 0.05,
    healChance: 0.05,
    comboModifier: 2.0,
    specialEffect: () => {
      toast({
        title: "Wind Evasion",
        description: "Your wind breathing technique helps you evade attacks!",
        variant: "default",
      });
    },
    visualEffect: {
      color: 'from-teal-600 to-green-500',
      animationClass: 'animate-wind-swirl',
      particleEffect: 'wind-swirls'
    }
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow Breathing',
    description: 'A corrupted style that deals massive damage at the cost of spirit corruption.',
    elementType: 'shadow',
    attackMultiplier: 1.5,
    defenseMultiplier: 0.7,
    spiritCostModifier: 1.2,
    critChance: 0.15,
    healChance: 0,
    comboModifier: 1.0,
    specialEffect: () => {
      toast({
        title: "Shadow Corruption",
        description: "Your shadow breathing technique increases corruption!",
        variant: "destructive",
      });
    },
    visualEffect: {
      color: 'from-purple-900 to-purple-600',
      animationClass: 'animate-shadow-pulse',
      particleEffect: 'shadow-tendrils'
    }
  }
};

// Calculate damage based on breathing style
export function calculateBreathingDamage(
  baseDamage: number,
  breathingStyle: BreathingStyleType,
  perfectTiming: boolean = false,
  comboCount: number = 0
) {
  const style = BREATHING_STYLES[breathingStyle];
  if (!style) return { damage: baseDamage, isCritical: false };
  
  let damageMultiplier = style.attackMultiplier;
  
  // Perfect timing bonus
  if (perfectTiming) {
    damageMultiplier += 0.25;
  }
  
  // Combo bonus
  const comboBonus = Math.min(comboCount * 0.05 * style.comboModifier, 0.5);
  damageMultiplier += comboBonus;
  
  // Critical hit chance
  const isCritical = Math.random() < style.critChance;
  if (isCritical) {
    damageMultiplier *= 2;
  }
  
  // Calculate final damage
  const finalDamage = Math.round(baseDamage * damageMultiplier);
  
  // Trigger special effect if it exists (15% chance)
  if (style.specialEffect && Math.random() < 0.15) {
    style.specialEffect();
  }
  
  return {
    damage: finalDamage,
    isCritical,
    elementType: style.elementType
  };
}

// Get spirit cost based on breathing style
export function calculateSpiritCost(baseAmount: number, breathingStyle: BreathingStyleType) {
  const style = BREATHING_STYLES[breathingStyle];
  if (!style) return baseAmount;
  
  return Math.round(baseAmount * style.spiritCostModifier);
}

// Check for healing based on breathing style
export function checkBreathingHealing(breathingStyle: BreathingStyleType, perfectTiming: boolean = false) {
  const style = BREATHING_STYLES[breathingStyle];
  if (!style) return { healed: false, amount: 0 };
  
  let healChance = style.healChance;
  
  // Perfect timing increases healing chance
  if (perfectTiming) {
    healChance += 0.1;
  }
  
  const healed = Math.random() < healChance;
  const amount = healed ? Math.round(20 + Math.random() * 30) : 0;
  
  return {
    healed,
    amount
  };
}
