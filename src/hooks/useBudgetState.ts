
import { useState } from 'react';
import { Budget, BudgetPreset, PlayerTraits } from '../types/gameTypes';
import { initialBudget } from '../data/initialGameState';

export const useBudgetState = (updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void, playerTraits: PlayerTraits) => {
  const [budget, setBudget] = useState<Budget>(initialBudget);

  // Update budget
  const updateBudget = (updates: Partial<Budget>) => {
    setBudget(prevBudget => ({ ...prevBudget, ...updates }));
  };

  // Apply budget preset
  const applyBudgetPreset = (preset: BudgetPreset) => {
    const { income } = budget;
    
    switch (preset) {
      case 'frugal':
        setBudget({
          income,
          essentials: income * 0.5,
          debt: income * 0.4,
          savings: income * 0.1,
        });
        
        // Update player traits based on budget choice
        updatePlayerTrait('spendingHabits', Math.max(1, playerTraits.spendingHabits - 1));
        updatePlayerTrait('savingAbility', Math.min(10, playerTraits.savingAbility + 1));
        break;
        
      case 'balanced':
        setBudget({
          income,
          essentials: income * 0.6,
          debt: income * 0.3,
          savings: income * 0.1,
        });
        break;
        
      case 'aggressive':
        setBudget({
          income,
          essentials: income * 0.5,
          debt: income * 0.45,
          savings: income * 0.05,
        });
        
        // Update player traits based on budget choice
        updatePlayerTrait('riskTolerance', Math.min(10, playerTraits.riskTolerance + 1));
        break;
        
      default:
        break;
    }
  };

  // Reset budget state
  const resetBudgetState = () => {
    setBudget(initialBudget);
  };

  return {
    budget,
    updateBudget,
    applyBudgetPreset,
    resetBudgetState
  };
};
