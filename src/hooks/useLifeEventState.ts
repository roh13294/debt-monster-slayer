
import { useState } from 'react';
import { LifeEvent, PlayerTraits } from '../types/gameTypes';
import { getLifeEvent } from '../utils/lifeEventGenerator';

export const useLifeEventState = (
  setEventHistory: (fn: (prev: LifeEvent[]) => LifeEvent[]) => void,
  setCash: (fn: (prev: number) => number) => void, 
  updateBudget: (updates: { income: number }) => void,
  addDebt: (debt: any) => void,
  updateDebt: (id: string, updates: any) => void,
  debts: any[],
  budget: { income: number }
) => {
  const [currentLifeEvent, setCurrentLifeEvent] = useState<LifeEvent | null>(null);

  // Generate a random life event
  const generateLifeEvent = () => {
    // Generate event with impact from player traits
    const event = getLifeEvent();
    
    // Track in history
    setEventHistory(prev => [...prev, event]);
    
    setCurrentLifeEvent(event);
  };

  // Resolve current life event
  const resolveLifeEvent = (
    optionIndex: number, 
    updatePlayerTrait?: (trait: keyof PlayerTraits, value: number) => void,
    playerTraits?: PlayerTraits
  ) => {
    if (!currentLifeEvent) return;
    
    const option = currentLifeEvent.options[optionIndex];
    
    // Update player traits based on choice if they exist
    if (updatePlayerTrait && playerTraits) {
      updateTraitsBasedOnChoice(option, updatePlayerTrait, playerTraits);
    }
    
    // Apply cash effect
    if (option.effect.cash) {
      setCash(prev => prev + option.effect.cash!);
    }
    
    // Apply debt effect
    if (option.effect.debt) {
      // Find credit card debt to add to, or create a new one
      const creditCardDebt = debts.find(debt => debt.name === 'Credit Card Debt');
      
      if (creditCardDebt) {
        updateDebt(creditCardDebt.id, {
          amount: creditCardDebt.amount + option.effect.debt
        });
      } else {
        addDebt({
          name: 'Credit Card Debt',
          amount: option.effect.debt,
          interest: 18.99,
          minimumPayment: Math.max(25, option.effect.debt * 0.02),
          monsterType: 'red',
          balance: option.effect.debt,
          interestRate: 18.99,
          health: 100,
          psychologicalImpact: 8
        });
      }
    }
    
    // Apply income effect
    if (option.effect.income) {
      updateBudget({
        income: budget.income + option.effect.income
      });
    }
    
    // Clear current life event
    setCurrentLifeEvent(null);
  };

  // Update player traits based on choices
  const updateTraitsBasedOnChoice = (
    option: LifeEvent['options'][0], 
    updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void,
    playerTraits: PlayerTraits
  ) => {
    if (!option) return;
    
    const text = option.text.toLowerCase();
    
    // Example trait modifications based on choices
    const traitUpdates: Partial<PlayerTraits> = {};
    
    // Risk tolerance
    if (text.includes('risk')) {
      traitUpdates.riskTolerance = playerTraits.riskTolerance + 1;
    } else if (text.includes('safe') || text.includes('secure')) {
      traitUpdates.riskTolerance = playerTraits.riskTolerance - 1;
    }
    
    // Financial knowledge
    if (text.includes('invest') || text.includes('research')) {
      traitUpdates.financialKnowledge = playerTraits.financialKnowledge + 1;
    }
    
    // Spending habits
    if (option.effect.cash && option.effect.cash < 0 && text.includes('buy')) {
      traitUpdates.spendingHabits = playerTraits.spendingHabits + 1;
    } else if (text.includes('save') || text.includes('budget')) {
      traitUpdates.spendingHabits = Math.max(1, playerTraits.spendingHabits - 1);
    }
    
    // Career focus
    if (text.includes('career') || text.includes('job') || text.includes('professional')) {
      traitUpdates.careerFocus = playerTraits.careerFocus + 1;
    }
    
    // Saving ability
    if (text.includes('save') || (option.effect.cash && option.effect.cash > 0)) {
      traitUpdates.savingAbility = playerTraits.savingAbility + 1;
    }
    
    // Apply trait updates
    Object.entries(traitUpdates).forEach(([trait, value]) => {
      if (value !== undefined) {
        updatePlayerTrait(trait as keyof PlayerTraits, value);
      }
    });
  };

  return {
    currentLifeEvent,
    generateLifeEvent,
    resolveLifeEvent,
    setCurrentLifeEvent
  };
};
