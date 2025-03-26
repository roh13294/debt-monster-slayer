import { useState } from 'react';
import { Budget, BudgetPreset, PlayerTraits } from '../types/gameTypes';
import { initialBudget } from '../data/initialGameState';
import { JobType, LifeStage, Circumstance } from '../hooks/useRandomCharacter';

export const useBudgetState = (
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void,
  playerTraits: PlayerTraits
) => {
  const [budget, setBudget] = useState<Budget>(initialBudget);

  // Update budget values
  const updateBudget = (updates: Partial<Budget>) => {
    setBudget(prev => ({
      ...prev,
      ...updates
    }));

    // Update player traits based on budget changes
    if (updates.savings && updates.savings > budget.savings) {
      updatePlayerTrait('savingAbility', playerTraits.savingAbility + 0.2);
    }
  };

  // Initialize budget based on job, life stage and circumstances
  const initializeBudget = (
    job: JobType | null,
    lifeStage: LifeStage | null, 
    circumstances: Circumstance[]
  ) => {
    let income = job ? job.baseIncome : initialBudget.income;
    let essentials = 1800; // Default base expenses
    
    // Apply life stage modifiers
    if (lifeStage) {
      if (lifeStage.modifier.income) {
        income += lifeStage.modifier.income;
      }
      if (lifeStage.modifier.expenses) {
        essentials += lifeStage.modifier.expenses;
      }
    }
    
    // Apply circumstances modifiers
    circumstances.forEach(circumstance => {
      if (circumstance.effect.income) {
        income += circumstance.effect.income;
      }
      if (circumstance.effect.expenses) {
        essentials += circumstance.effect.expenses;
      }
    });
    
    // Calculate reasonable debt payment and savings
    const debtPayment = Math.max(300, Math.round(income * 0.15));
    const savings = Math.max(100, Math.round(income * 0.05));
    
    // Update budget state
    setBudget({
      income,
      essentials,
      debt: debtPayment,
      savings
    });
    
    return {
      income,
      essentials,
      debt: debtPayment,
      savings
    };
  };

  // Apply budget presets
  const applyBudgetPreset = (preset: BudgetPreset) => {
    const currentIncome = budget.income;
    let newBudget: Budget;

    switch (preset) {
      case 'frugal':
        newBudget = {
          income: currentIncome,
          essentials: Math.round(currentIncome * 0.5),
          debt: Math.round(currentIncome * 0.3),
          savings: Math.round(currentIncome * 0.2)
        };
        updatePlayerTrait('savingAbility', playerTraits.savingAbility + 1);
        break;

      case 'balanced':
        newBudget = {
          income: currentIncome,
          essentials: Math.round(currentIncome * 0.6),
          debt: Math.round(currentIncome * 0.2),
          savings: Math.round(currentIncome * 0.2)
        };
        break;

      case 'aggressive':
        newBudget = {
          income: currentIncome,
          essentials: Math.round(currentIncome * 0.4),
          debt: Math.round(currentIncome * 0.5),
          savings: Math.round(currentIncome * 0.1)
        };
        updatePlayerTrait('riskTolerance', playerTraits.riskTolerance + 1);
        break;

      default:
        newBudget = budget;
    }

    setBudget(newBudget);
  };

  // Reset budget state
  const resetBudgetState = () => {
    setBudget(initialBudget);
  };

  return {
    budget,
    updateBudget,
    initializeBudget,
    applyBudgetPreset,
    resetBudgetState
  };
};
