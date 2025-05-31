import { useState } from 'react';
import { Budget, PlayerTraits, BudgetPreset } from '../types/gameTypes';
import { initialBudget } from '../data/initialGameState';

export const useBudgetState = (
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void,
  playerTraits: PlayerTraits
) => {
  const [budget, setBudget] = useState<Budget>({
    income: initialBudget.income,
    essentials: initialBudget.essentials,
    debtPayment: initialBudget.debtPayment,
    debt: initialBudget.debt,
    savings: initialBudget.savings,
    entertainment: initialBudget.entertainment,
    discretionary: initialBudget.discretionary
  });

  const updateBudget = (category: keyof Budget, amount: number) => {
    setBudget((prevBudget) => {
      const updatedBudget = { ...prevBudget, [category]: amount };
      
      // Auto-calculate discretionary spending based on other allocations
      const allocatedFunds = updatedBudget.essentials + updatedBudget.debtPayment + updatedBudget.savings + updatedBudget.entertainment;
      updatedBudget.discretionary = Math.max(0, updatedBudget.income - allocatedFunds);
      
      return updatedBudget;
    });
  };

  const calculateBudgetEfficiency = () => {
    const debtToIncomeRatio = budget.debtPayment / budget.income;
    const savingsToIncomeRatio = budget.savings / budget.income;
    
    // Ideal: 20% to debt, 20% to savings minimum
    const debtEfficiency = Math.min(debtToIncomeRatio / 0.2, 1.5);
    const savingsEfficiency = Math.min(savingsToIncomeRatio / 0.2, 1.5);
    
    return (debtEfficiency + savingsEfficiency) / 2;
  };

  const applyBudgetPreset = (preset: BudgetPreset) => {
    const income = budget.income;
    let essentials = 0;
    let debtPayment = 0;
    let debt = 0;
    let savings = 0;
    let entertainment = 0;
    let discretionary = 0;
    
    switch (preset) {
      case 'balanced':
        // 50-30-20 rule: 50% essentials, 30% discretionary (auto-calculated), 20% savings+debt
        essentials = income * 0.5;
        debtPayment = income * 0.1;
        debt = debtPayment;
        savings = income * 0.1;
        entertainment = income * 0.15;
        discretionary = income - essentials - debtPayment - savings - entertainment;
        break;
      
      case 'aggressive':
        // Focus on debt repayment: 50% essentials, 30% debt, 10% savings
        essentials = income * 0.5;
        debtPayment = income * 0.3;
        debt = debtPayment;
        savings = income * 0.1;
        entertainment = income * 0.05;
        discretionary = income - essentials - debtPayment - savings - entertainment;
        break;
      
      case 'conservative':
        // Focus on stability: 50% essentials, 15% debt, 25% savings
        essentials = income * 0.5;
        debtPayment = income * 0.15;
        debt = debtPayment;
        savings = income * 0.25;
        entertainment = income * 0.1;
        discretionary = income - essentials - debtPayment - savings - entertainment;
        break;
      
      case 'frugal':
        // Extreme budgeting: 40% essentials, 30% debt, 20% savings
        essentials = income * 0.4;
        debtPayment = income * 0.3;
        debt = debtPayment;
        savings = income * 0.2;
        entertainment = income * 0.05;
        discretionary = income - essentials - debtPayment - savings - entertainment;
        
        // Reward with improved saving ability
        if (updatePlayerTrait && playerTraits) {
          updatePlayerTrait('savingAbility', playerTraits.savingAbility + 1);
        }
        break;
      
      default:
        // Custom - keep current values
        return;
    }
    
    setBudget({
      income,
      essentials,
      debtPayment,
      debt,
      savings,
      entertainment,
      discretionary
    });
  };

  const initializeBudget = (job: any, lifeStage: any, circumstances: any[]) => {
    const income = job.baseSalary || 3500;
    const essentialsRatio = lifeStage.baseExpenses || 0.5;
    
    // Base budget based on income and life stage
    const essentials = income * essentialsRatio;
    const debtPayment = income * 0.15;
    const debt = debtPayment;
    const savings = income * 0.1;
    const entertainment = income * 0.1;
    const discretionary = income - essentials - debtPayment - savings - entertainment;
    
    const newBudget = {
      income,
      essentials,
      debtPayment,
      debt,
      savings,
      entertainment,
      discretionary
    };
    
    setBudget(newBudget);
    return newBudget;
  };

  const resetBudgetState = () => {
    setBudget({
      income: initialBudget.income,
      essentials: initialBudget.essentials,
      debtPayment: initialBudget.debtPayment,
      debt: initialBudget.debt,
      savings: initialBudget.savings,
      entertainment: initialBudget.entertainment,
      discretionary: initialBudget.discretionary
    });
  };

  return {
    budget,
    updateBudget,
    calculateBudgetEfficiency,
    applyBudgetPreset,
    initializeBudget,
    resetBudgetState
  };
};
