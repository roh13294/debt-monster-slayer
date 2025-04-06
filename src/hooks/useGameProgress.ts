
import { useState, useEffect } from 'react';
import { PlayerTraits } from '../types/gameTypes';
import { toast } from "@/hooks/use-toast";

export const useGameProgress = (
  setDebts: (fn: (prev: any[]) => any[]) => void,
  debts: any[],
  budget: any,
  setCash: (fn: (prev: number) => number) => void,
  setPaymentStreak: (fn: (prev: number) => number) => void,
  paymentStreak: number,
  setSpecialMoves: (fn: (prev: number) => number) => void,
  specialMoves: number,
  strategy: string,
  generateLifeEvent: () => void,
  playerTraits: PlayerTraits,
  setChallenges: (challenges: any[]) => void,
  generatePersonalizedChallenges: (traits: PlayerTraits) => any[]
) => {
  const [monthsPassed, setMonthsPassed] = useState<number>(0);
  const [lastLevelSeen, setLastLevelSeen] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Process financial updates after monthly decision is made
  const processMonthlyFinancials = () => {
    // Apply interest to debts
    setDebts(prevDebts => prevDebts.map(debt => ({
      ...debt,
      amount: debt.amount * (1 + debt.interest / 1200) // Monthly interest
    })));
    
    // Apply income
    setCash(prev => prev + budget.income);
    
    // Apply expenses
    setCash(prev => prev - budget.essentials);
    
    // Apply minimum payments to all debts
    let remainingDebtBudget = budget.debt;
    
    // Sort debts by strategy
    const sortedDebts = [...debts].sort((a, b) => {
      if (strategy === 'snowball') {
        return a.amount - b.amount; // Smallest first
      } else {
        return b.interest - a.interest; // Highest interest first
      }
    });
    
    // Apply minimum payments
    const updatedDebts = sortedDebts.map(debt => {
      const payment = Math.min(debt.minimumPayment, debt.amount);
      remainingDebtBudget -= payment;
      
      return {
        ...debt,
        amount: Math.max(0, debt.amount - payment),
        health: debt.amount <= payment ? 0 : debt.health - (payment / debt.amount) * 100
      };
    });
    
    // Apply extra payments to first debt in sorted list
    if (remainingDebtBudget > 0 && updatedDebts.length > 0) {
      const targetDebt = updatedDebts[0];
      const extraPayment = Math.min(remainingDebtBudget, targetDebt.amount);
      
      updatedDebts[0] = {
        ...targetDebt,
        amount: Math.max(0, targetDebt.amount - extraPayment),
        health: targetDebt.amount <= extraPayment ? 0 : targetDebt.health - (extraPayment / targetDebt.amount) * 100
      };
    }
    
    // Remove paid off debts
    setDebts(prev => prev.filter(debt => debt.amount > 0));
    
    // Apply savings
    setCash(prev => prev + budget.savings);
    
    // Increment months
    setMonthsPassed(prev => prev + 1);
    
    // Increment payment streak
    setPaymentStreak(prev => prev + 1);
    
    // If payment streak reaches certain milestones, award special moves
    if (paymentStreak > 0 && paymentStreak % 3 === 0) {
      setSpecialMoves(prev => prev + 1);
      
      toast({
        title: "Payment Streak!",
        description: `${paymentStreak} months of consistent payments! +1 Special Move!`,
        variant: "default",
      });
    }
    
    // Life event chance affected by player traits
    let eventChance = 0.5; // Base 50% chance
    
    // Risk-tolerant players get more events
    if (playerTraits.riskTolerance > 7) {
      eventChance += 0.2;
    } else if (playerTraits.riskTolerance < 4) {
      eventChance -= 0.1;
    }
    
    // Generate life event based on chance
    if (Math.random() < eventChance) {
      generateLifeEvent();
    }
  };

  // New advanceMonth implementation that doesn't immediately update financials
  const advanceMonth = () => {
    // This function now doesn't do the financial processing directly
    // Instead, it's handled by the MonthlyEncounter component after user makes choices
    // The actual financial processing is done in processMonthlyFinancials which is called 
    // after the encounter is resolved in MonthlyEncounter component
  };

  // Check for level-up and award special moves
  useEffect(() => {
    if (!gameStarted) return;
    
    const currentLevel = Math.max(1, Math.floor(monthsPassed / 3) + 1);
    if (currentLevel > lastLevelSeen) {
      // Player leveled up
      setSpecialMoves(prev => prev + 1);
      setLastLevelSeen(currentLevel);
      
      toast({
        title: "Level Up!",
        description: `You reached level ${currentLevel}! +1 Special Move unlocked!`,
        variant: "default",
      });
      
      // Every 3 levels, update challenges based on player traits
      if (currentLevel % 3 === 0) {
        const newChallenges = generatePersonalizedChallenges(playerTraits);
        setChallenges(newChallenges);
        
        toast({
          title: "New Challenges!",
          description: `New personalized challenges available based on your play style!`,
          variant: "default",
        });
      }
    }
  }, [monthsPassed, lastLevelSeen, gameStarted, playerTraits, setSpecialMoves, setChallenges, generatePersonalizedChallenges]);

  return {
    monthsPassed,
    gameStarted,
    setGameStarted,
    advanceMonth,
    processMonthlyFinancials,
    setMonthsPassed,
    setLastLevelSeen
  };
};
