
import { useState } from 'react';
import { toast } from "../hooks/use-toast";
import { Debt } from '../types/gameTypes';

interface StanceMultipliers {
  debtPaymentMultiplier: number;
  savingsMultiplier: number;
  incomeMultiplier: number;
  expensesMultiplier: number;
}

interface Budget {
  income: number;
  essentials: number;
  debt: number;
  savings: number;
  discretionary: number;
}

interface PlayerTraits {
  financialKnowledge: number;
  determination: number;
  riskTolerance: number;
}

export function useGameProgress(
  setDebts: React.Dispatch<React.SetStateAction<Debt[]>>,
  debts: Debt[],
  budget: Budget,
  setCash: React.Dispatch<React.SetStateAction<number>>,
  setPaymentStreak: React.Dispatch<React.SetStateAction<number>>,
  paymentStreak: number,
  setSpecialMoves: React.Dispatch<React.SetStateAction<number>>,
  specialMoves: number,
  strategy: string,
  generateLifeEvent: () => void,
  playerTraits: PlayerTraits,
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>,
  generatePersonalizedChallenges: () => any[]
) {
  const [monthsPassed, setMonthsPassed] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [lastLevelSeen, setLastLevelSeen] = useState<number>(1);

  // Process monthly finances
  const processMonthlyFinancials = (stanceMultipliers?: StanceMultipliers) => {
    // Default multipliers
    const multipliers = stanceMultipliers || {
      debtPaymentMultiplier: 1,
      savingsMultiplier: 1,
      incomeMultiplier: 1,
      expensesMultiplier: 1
    };
    
    // Income
    const monthlyIncome = budget.income * multipliers.incomeMultiplier;
    
    // Expenses
    const monthlyExpenses = budget.essentials * multipliers.expensesMultiplier;
    
    // Handle income and expenses
    const netCashFlow = monthlyIncome - monthlyExpenses;
    setCash(prevCash => prevCash + netCashFlow);

    // Handle savings
    const monthlySavings = budget.savings * multipliers.savingsMultiplier;
    setCash(prevCash => prevCash - monthlySavings);

    // Handle debt payments
    const debtPayment = budget.debt;
    const effectiveDebtPayment = debtPayment * multipliers.debtPaymentMultiplier;
    
    // Apply debt payment strategy
    if (debts.length > 0) {
      const updatedDebts = [...debts];
      
      // Deduct cash for the debt payment
      setCash(prevCash => prevCash - debtPayment);
      
      // Set payment streak
      setPaymentStreak(prevStreak => prevStreak + 1);
      
      // Apply payment based on strategy
      switch (strategy) {
        case "avalanche":
          // Sort by interest rate (highest first)
          updatedDebts.sort((a, b) => b.interestRate - a.interestRate);
          break;
        case "snowball":
          // Sort by balance (lowest first)
          updatedDebts.sort((a, b) => a.balance - b.balance);
          break;
        case "highImpact":
          // Sort by psychological impact (highest first)
          updatedDebts.sort((a, b) => b.psychologicalImpact - a.psychologicalImpact);
          break;
        default:
          // Default - proportional payments
          // No sorting needed
          break;
      }
      
      // Check if we should reward a special move for payment streak
      if (paymentStreak > 0 && paymentStreak % 3 === 0) {
        setSpecialMoves(prev => prev + 1);
        toast({
          title: "Streak Reward!",
          description: `You've maintained your payment streak for ${paymentStreak} months! You earned a special move!`,
          variant: "default",
        });
      }

      // Apply debt payment according to strategy
      if (strategy === "proportional") {
        // Proportional payments to all debts
        const totalDebtAmount = updatedDebts.reduce((sum, debt) => sum + debt.balance, 0);
        
        updatedDebts.forEach((debt, index) => {
          const proportion = debt.balance / totalDebtAmount;
          const payment = effectiveDebtPayment * proportion;
          
          updatedDebts[index] = {
            ...debt,
            balance: Math.max(0, debt.balance - payment)
          };
        });
      } else {
        // For avalanche, snowball, and highImpact: focus on first debt
        let remainingPayment = effectiveDebtPayment;
        
        for (let i = 0; i < updatedDebts.length && remainingPayment > 0; i++) {
          const payment = Math.min(remainingPayment, updatedDebts[i].balance);
          
          updatedDebts[i] = {
            ...updatedDebts[i],
            balance: Math.max(0, updatedDebts[i].balance - payment)
          };
          
          remainingPayment -= payment;
        }
      }
      
      // Remove any paid off debts
      const filteredDebts = updatedDebts.filter(debt => debt.balance > 0);
      
      setDebts(filteredDebts);
      
      // If all debts are paid off
      if (filteredDebts.length === 0 && debts.length > 0) {
        toast({
          title: "All Debts Paid!",
          description: "Congratulations! You've defeated all your debt demons!",
          variant: "default",
        });
      }
    }

    // Increase month counter
    setMonthsPassed(prevMonths => prevMonths + 1);
    
    // Generate life event with 30% chance
    if (Math.random() < 0.3) {
      generateLifeEvent();
    }
    
    // Generate new personalized challenges every 3 months
    if ((monthsPassed + 1) % 3 === 0) {
      setChallenges(generatePersonalizedChallenges());
    }
    
    // Check for level up
    const currentLevel = Math.floor(monthsPassed / 3) + 1;
    const newLevel = Math.floor((monthsPassed + 1) / 3) + 1;
    
    if (newLevel > currentLevel && newLevel > lastLevelSeen) {
      toast({
        title: "Level Up!",
        description: `You've reached level ${newLevel}! Keep up the good financial habits!`,
        variant: "default",
      });
      setLastLevelSeen(newLevel);
    }
  };

  // Advance to next month
  const advanceMonth = () => {
    processMonthlyFinancials();
  };

  return {
    monthsPassed,
    setMonthsPassed,
    gameStarted,
    setGameStarted,
    advanceMonth,
    processMonthlyFinancials,
    setLastLevelSeen
  };
}
