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
  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt: Debt = {
      ...debt,
      id: uuidv4(),
      health: debt.health || 100,
      balance: debt.amount, // Ensure balance is set
      interestRate: debt.interest, // Ensure interestRate is set
      psychologicalImpact: debt.psychologicalImpact || 5 // Default psychological impact
    };
    
    setDebts(prev => [...prev, newDebt]);
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
        if (circumstance.effect?.debt) {
          // If the circumstance is "Recent Homeowner", add a mortgage
          if (circumstance.name === "Recent Homeowner") {
            const amount = circumstance.effect.debt;
            characterDebts.push({
              id: uuidv4(),
              name: "Mortgage",
              amount: amount,
              balance: amount,
              interest: 4.5,
              interestRate: 4.5,
              minimumPayment: Math.round(amount / 360), // 30-year mortgage
              monsterType: 'green',
              health: 100,
              psychologicalImpact: 7
            });
          } 
          // If the circumstance is "Recent Education", add a student loan
          else if (circumstance.name === "Recent Education") {
            const amount = circumstance.effect.debt;
            characterDebts.push({
              id: uuidv4(),
              name: "Student Loan",
              amount: amount,
              balance: amount,
              interest: 5.8,
              interestRate: 5.8,
              minimumPayment: Math.round(amount * 0.01),
              monsterType: 'blue',
              health: 100,
              psychologicalImpact: 6
            });
          }
          // For all other circumstances with debt, add a generic debt
          else {
            const amount = circumstance.effect.debt;
            characterDebts.push({
              id: uuidv4(),
              name: "Personal Loan",
              amount: amount,
              balance: amount,
              interest: 9.9,
              interestRate: 9.9,
              minimumPayment: Math.round(amount * 0.02),
              monsterType: 'purple',
              health: 100,
              psychologicalImpact: 5
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
      else if (lifeStage && lifeStage.modifier?.debtChance && Math.random() < lifeStage.modifier.debtChance) {
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
            balance: ccDebtAmount,
            interest: 18.99,
            interestRate: 18.99,
            minimumPayment: Math.max(25, Math.round(ccDebtAmount * 0.02)),
            monsterType: 'red',
            health: 100,
            psychologicalImpact: 8
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
          balance: carLoanAmount,
          interest: 4.5,
          interestRate: 4.5,
          minimumPayment: Math.round(carLoanAmount / 60), // 5-year car loan
          monsterType: 'yellow',
          health: 100,
          psychologicalImpact: 4
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
          balance: Math.round(debt.balance * 0.7),
          interest: Math.max(1, debt.interest * 0.8),
          interestRate: Math.max(1, debt.interestRate * 0.8),
          minimumPayment: Math.round(debt.minimumPayment * 0.7)
        }));
      } else if (financialKnowledge < 4) {
        // Poor financial knowledge - higher debt amounts and interest
        characterDebts = characterDebts.map(debt => ({
          ...debt,
          amount: Math.round(debt.amount * 1.3),
          balance: Math.round(debt.balance * 1.3),
          interest: debt.interest * 1.2,
          interestRate: debt.interestRate * 1.2,
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
        balance: 2000,
        interest: 18.99,
        interestRate: 18.99,
        minimumPayment: 50,
        monsterType: 'red',
        health: 100,
        psychologicalImpact: 8
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
    initializeDebts,
    resetDebtState
  };
};
