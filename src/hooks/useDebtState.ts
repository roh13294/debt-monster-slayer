
import { useState } from 'react';
import { Debt, Strategy } from '../types/gameTypes';
import { initialDebts } from '../data/initialGameState';
import { toast } from "@/hooks/use-toast";

export const useDebtState = (setCash: (fn: (prev: number) => number) => void) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [strategy, setStrategy] = useState<Strategy>('snowball');
  
  // Calculate total debt
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  // Add new debt
  const addDebt = (debt: Omit<Debt, 'id' | 'health'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      health: 100,
    };
    setDebts(prevDebts => [...prevDebts, newDebt]);
    
    toast({
      title: "New Debt Monster Appeared!",
      description: `A ${debt.name} monster has appeared with $${debt.amount} in debt!`,
      variant: "destructive",
    });
  };

  // Update existing debt
  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prevDebts => prevDebts.map(debt => {
      if (debt.id === id) {
        // Check if debt is fully paid
        if (updates.amount === 0 || updates.health === 0) {
          toast({
            title: "Debt Monster Defeated!",
            description: `You've completely paid off your ${debt.name}! Monster defeated!`,
            variant: "default",
          });
          
          return { ...debt, ...updates, amount: 0, health: 0 };
        }
        return { ...debt, ...updates };
      }
      return debt;
    }));
  };

  // Remove debt
  const removeDebt = (id: string) => {
    setDebts(prevDebts => prevDebts.filter(debt => debt.id !== id));
  };

  // Damage monster (pay extra toward debt)
  const damageMonster = (
    debtId: string, 
    amount: number,
    currentCash: number,
    updateChallenge: (id: string, progress: number) => void,
    updatePlayerTrait: (trait: keyof any, value: number) => void,
    playerTraits: any
  ) => {
    if (currentCash < amount) {
      toast({
        title: "Not Enough Cash!",
        description: "You don't have enough money to make this payment.",
        variant: "destructive",
      });
      return; // Not enough cash
    }
    
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Calculate damage
    const actualPayment = Math.min(amount, debt.amount);
    const healthReduction = (actualPayment / debt.amount) * 100;
    
    // Update debt
    updateDebt(debtId, {
      amount: debt.amount - actualPayment,
      health: Math.max(0, debt.health - healthReduction)
    });
    
    // Reduce cash
    setCash(prev => prev - actualPayment);
    
    // Update challenge progress
    updateChallenge('1', 1); // Extra payment challenge
    
    // Update traits based on payment behavior
    updatePlayerTrait('financialKnowledge', Math.min(10, playerTraits.financialKnowledge + 0.1));
    updatePlayerTrait('savingAbility', Math.min(10, playerTraits.savingAbility + 0.1));
  };

  // Use special move (50% damage to monster)
  const useSpecialMove = (
    debtId: string,
    specialMoves: number,
    setSpecialMoves: (fn: (prev: number) => number) => void
  ) => {
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves!",
        description: "You don't have any special moves available.",
        variant: "destructive",
      });
      return; // No special moves available
    }
    
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Calculate damage (50% of current health)
    const healthReduction = debt.health * 0.5;
    const amountReduction = (healthReduction / 100) * debt.amount;
    
    // Update debt
    updateDebt(debtId, {
      amount: debt.amount - amountReduction,
      health: debt.health - healthReduction
    });
    
    // Reduce special moves
    setSpecialMoves(prev => prev - 1);
  };

  // Initialize debts with adjustments based on financial knowledge
  const initializeDebts = (financialKnowledge: number) => {
    if (financialKnowledge < 4) {
      // Less financially knowledgeable players start with more debt
      setDebts(initialDebts.map(debt => ({
        ...debt,
        amount: Math.round(debt.amount * 1.2) // 20% more debt
      })));
    } else if (financialKnowledge > 7) {
      // More financially knowledgeable players start with less debt
      setDebts(initialDebts.map(debt => ({
        ...debt,
        amount: Math.round(debt.amount * 0.9) // 10% less debt
      })));
    } else {
      setDebts([...initialDebts]);
    }
  };

  // Reset debt state
  const resetDebtState = () => {
    setDebts([]);
    setStrategy('snowball');
  };

  return {
    debts,
    totalDebt,
    strategy, setStrategy,
    addDebt,
    updateDebt,
    removeDebt,
    damageMonster,
    useSpecialMove,
    initializeDebts,
    resetDebtState
  };
};
