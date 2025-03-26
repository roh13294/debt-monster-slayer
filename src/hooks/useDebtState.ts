import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Debt, Strategy, PlayerTraits } from '../types/gameTypes';
import { initialDebts } from '../data/initialGameState';
import { toast } from "@/hooks/use-toast";
import { LifeStage, Circumstance } from '../hooks/useRandomCharacter';

export const useDebtState = (
  setCash: (fn: (prev: number) => number) => void
) => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [strategy, setStrategy] = useState<Strategy>('snowball');

  // Calculate total debt
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  // Add a new debt
  const addDebt = (debt: Omit<Debt, 'id' | 'health'>) => {
    setDebts(prev => [
      ...prev, 
      { 
        ...debt, 
        id: uuidv4(),
        health: 100
      }
    ]);
  };

  // Update an existing debt
  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => 
      debt.id === id ? { ...debt, ...updates } : debt
    ));
  };

  // Remove a debt
  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
    
    toast({
      title: "Debt Eliminated!",
      description: "Congratulations! You've paid off this debt completely!",
      variant: "default",
    });
  };

  // Damage a debt monster
  const damageMonster = (
    debtId: string, 
    amount: number, 
    cash: number,
    updateChallenge: (id: string, progress: number) => void,
    updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void,
    playerTraits: PlayerTraits
  ) => {
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Ensure player has enough cash
    if (cash < amount) {
      toast({
        title: "Not Enough Cash",
        description: "You don't have enough cash to make this payment.",
        variant: "default",
      });
      return;
    }
    
    // Calculate health reduction (percentage of current debt)
    const healthReduction = (amount / debt.amount) * 100;
    const newAmount = Math.max(0, debt.amount - amount);
    const newHealth = Math.max(0, debt.health - healthReduction);
    
    // Update the debt
    updateDebt(debtId, {
      amount: newAmount,
      health: newHealth
    });
    
    // Deduct payment from cash
    setCash(prev => prev - amount);
    
    // Update challenge progress for making a payment
    updateChallenge('1', 1);
    
    // If debt is paid off, remove it
    if (newAmount === 0) {
      removeDebt(debtId);
      
      // Improve financial knowledge
      updatePlayerTrait('financialKnowledge', playerTraits.financialKnowledge + 0.5);
    }
    
    toast({
      title: "Payment Made!",
      description: `You made a $${amount} payment on your ${debt.name}!`,
      variant: "default",
    });
  };

  // Use a special move on a debt monster
  const useSpecialMove = (
    debtId: string,
    specialMoves: number,
    setSpecialMoves: (fn: (prev: number) => number) => void
  ) => {
    // Check if player has special moves available
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves",
        description: "You don't have any special moves available.",
        variant: "default",
      });
      return;
    }
    
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Apply special move effects (reduce interest by 20%)
    const newInterest = Math.max(1, debt.interest * 0.8);
    
    // Update the debt
    updateDebt(debtId, {
      interest: newInterest
    });
    
    // Consume special move
    setSpecialMoves(prev => prev - 1);
    
    toast({
      title: "Special Move Used!",
      description: `You negotiated a lower interest rate on your ${debt.name}!`,
      variant: "default",
    });
  };

  // Initialize debts based on character details
  const initializeDebts = (
    financialKnowledge: number = 5,
    lifeStage: LifeStage | null = null,
    circumstances: Circumstance[] = []
  ) => {
    let characterDebts: Debt[] = [];
    
    // Determine if we should use static debts or generate random ones
    const useRandomDebts = Math.random() > 0.3; // 70% chance of random debts
    
    if (useRandomDebts) {
      // Generate random debts based on life stage and circumstances
      
      // First, check for specific debt from circumstances
      circumstances.forEach(circumstance => {
        if (circumstance.effect.debt) {
          // If the circumstance is "Recent Homeowner", add a mortgage
          if (circumstance.name === "Recent Homeowner") {
            characterDebts.push({
              id: uuidv4(),
              name: "Mortgage",
              amount: circumstance.effect.debt,
              interest: 4.5,
              minimumPayment: Math.round(circumstance.effect.debt / 360), // 30-year mortgage
              monsterType: 'green',
              health: 100
            });
          } 
          // If the circumstance is "Recent Education", add a student loan
          else if (circumstance.name === "Recent Education") {
            characterDebts.push({
              id: uuidv4(),
              name: "Student Loan",
              amount: circumstance.effect.debt,
              interest: 5.8,
              minimumPayment: Math.round(circumstance.effect.debt * 0.01),
              monsterType: 'blue',
              health: 100
            });
          }
          // For all other circumstances with debt, add a generic debt
          else {
            characterDebts.push({
              id: uuidv4(),
              name: "Personal Loan",
              amount: circumstance.effect.debt,
              interest: 9.9,
              minimumPayment: Math.round(circumstance.effect.debt * 0.02),
              monsterType: 'purple',
              health: 100
            });
          }
        }
      });
      
      // Check for debt-free circumstance
      const debtFreeStart = circumstances.some(c => c.name === "Debt Free Start");
      if (debtFreeStart) {
        // If debt-free, don't add additional random debts
      } 
      // Otherwise, possibly add credit card debt based on life stage
      else if (lifeStage && lifeStage.modifier.debtChance && Math.random() < lifeStage.modifier.debtChance) {
        // Credit card debt amount based on life stage
        let ccDebtAmount = 0;
        
        if (lifeStage.name === "Fresh Graduate") {
          ccDebtAmount = Math.round(1000 + Math.random() * 3000);
        } else if (lifeStage.name === "Young Professional") {
          ccDebtAmount = Math.round(2000 + Math.random() * 4000);
        } else if (lifeStage.name === "Mid-Career") {
          ccDebtAmount = Math.round(3000 + Math.random() * 7000);
        } else if (lifeStage.name === "Established Professional") {
          ccDebtAmount = Math.round(4000 + Math.random() * 8000);
        } else if (lifeStage.name === "Pre-Retirement") {
          ccDebtAmount = Math.round(2000 + Math.random() * 5000);
        }
        
        if (ccDebtAmount > 0) {
          characterDebts.push({
            id: uuidv4(),
            name: "Credit Card Debt",
            amount: ccDebtAmount,
            interest: 18.99,
            minimumPayment: Math.max(25, Math.round(ccDebtAmount * 0.02)),
            monsterType: 'red',
            health: 100
          });
        }
      }
      
      // Possibly add a car loan (50% chance if not too many debts already)
      if (characterDebts.length < 2 && Math.random() < 0.5) {
        const carLoanAmount = Math.round(8000 + Math.random() * 20000);
        characterDebts.push({
          id: uuidv4(),
          name: "Car Loan",
          amount: carLoanAmount,
          interest: 4.5,
          minimumPayment: Math.round(carLoanAmount / 60), // 5-year car loan
          monsterType: 'yellow',
          health: 100
        });
      }
    } 
    // Use static debts but adjust based on financial knowledge
    else {
      // Copy default debts
      characterDebts = [...initialDebts];
      
      // Adjust based on financial knowledge
      if (financialKnowledge > 7) {
        // Good financial knowledge - lower debt amounts and interest
        characterDebts = characterDebts.map(debt => ({
          ...debt,
          amount: Math.round(debt.amount * 0.7),
          interest: Math.max(1, debt.interest * 0.8),
          minimumPayment: Math.round(debt.minimumPayment * 0.7)
        }));
      } else if (financialKnowledge < 4) {
        // Poor financial knowledge - higher debt amounts and interest
        characterDebts = characterDebts.map(debt => ({
          ...debt,
          amount: Math.round(debt.amount * 1.3),
          interest: debt.interest * 1.2,
          minimumPayment: Math.round(debt.minimumPayment * 1.3)
        }));
      }
    }
    
    // Ensure there's at least one debt
    if (characterDebts.length === 0) {
      characterDebts.push({
        id: uuidv4(),
        name: "Credit Card Debt",
        amount: 2000,
        interest: 18.99,
        minimumPayment: 50,
        monsterType: 'red',
        health: 100
      });
    }
    
    setDebts(characterDebts);
    return characterDebts;
  };

  // Reset debt state
  const resetDebtState = () => {
    setDebts([]);
    setStrategy('snowball');
  };

  return {
    debts,
    setDebts,
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
