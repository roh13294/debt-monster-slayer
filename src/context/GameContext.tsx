
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLifeEvent } from '../utils/lifeEventGenerator';
import { toast } from "@/hooks/use-toast";

// Types
export type Debt = {
  id: string;
  name: string;
  amount: number;
  interest: number;
  minimumPayment: number;
  monsterType: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
  health: number; // Monster health percentage
};

export type Strategy = 'snowball' | 'avalanche';

export type Budget = {
  income: number;
  essentials: number;
  debt: number;
  savings: number;
};

export type BudgetPreset = 'frugal' | 'balanced' | 'aggressive';

export type LifeEvent = {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    effect: {
      cash?: number;
      debt?: number;
      income?: number;
      description: string;
    };
  }[];
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
};

export type GameContextType = {
  // Player data
  playerName: string;
  setPlayerName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  cash: number;
  setCash: (cash: number) => void;
  
  // Debt data
  debts: Debt[];
  addDebt: (debt: Omit<Debt, 'id' | 'health'>) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  totalDebt: number;
  
  // Strategy
  strategy: Strategy;
  setStrategy: (strategy: Strategy) => void;
  
  // Budget
  budget: Budget;
  updateBudget: (budget: Partial<Budget>) => void;
  applyBudgetPreset: (preset: BudgetPreset) => void;
  
  // Life events
  currentLifeEvent: LifeEvent | null;
  generateLifeEvent: () => void;
  resolveLifeEvent: (optionIndex: number) => void;
  
  // Challenges
  challenges: Challenge[];
  updateChallenge: (id: string, progress: number) => void;
  
  // Game progress
  monthsPassed: number;
  advanceMonth: () => void;
  
  // Monster battles
  damageMonster: (debtId: string, amount: number) => void;
  
  // Special moves
  specialMoves: number;
  useSpecialMove: (debtId: string) => void;
  
  // Streaks
  paymentStreak: number;
  
  // Game initialization
  initializeGame: () => void;
  resetGame: () => void;
  gameStarted: boolean;
};

// Initial values
const initialDebts: Debt[] = [
  {
    id: '1',
    name: 'Credit Card Debt',
    amount: 5000,
    interest: 18.99,
    minimumPayment: 125,
    monsterType: 'red',
    health: 100,
  },
  {
    id: '2',
    name: 'Student Loan',
    amount: 15000,
    interest: 5.8,
    minimumPayment: 180,
    monsterType: 'blue',
    health: 100,
  },
  {
    id: '3',
    name: 'Car Loan',
    amount: 12000,
    interest: 4.5,
    minimumPayment: 220,
    monsterType: 'green',
    health: 100,
  }
];

const initialBudget: Budget = {
  income: 3500,
  essentials: 1800,
  debt: 600,
  savings: 200,
};

const initialChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Extra Payment',
    description: 'Make 3 extra debt payments this month',
    reward: 100,
    progress: 0,
    target: 3,
    completed: false,
  },
  {
    id: '2',
    title: 'Save Streak',
    description: 'Save $500 total',
    reward: 150,
    progress: 0,
    target: 500,
    completed: false,
  },
  {
    id: '3',
    title: 'Budget Master',
    description: 'Stay within budget for 3 months',
    reward: 200,
    progress: 0,
    target: 3,
    completed: false,
  }
];

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerName] = useState<string>('Player');
  const [avatar, setAvatar] = useState<string>('default');
  const [cash, setCash] = useState<number>(2000);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [strategy, setStrategy] = useState<Strategy>('snowball');
  const [budget, setBudget] = useState<Budget>(initialBudget);
  const [currentLifeEvent, setCurrentLifeEvent] = useState<LifeEvent | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [monthsPassed, setMonthsPassed] = useState<number>(0);
  const [specialMoves, setSpecialMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [paymentStreak, setPaymentStreak] = useState<number>(0);
  const [lastLevelSeen, setLastLevelSeen] = useState<number>(0);
  
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
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
    }
  }, [monthsPassed, lastLevelSeen, gameStarted]);
  
  // Initialize game
  const initializeGame = () => {
    setDebts(initialDebts);
    setBudget(initialBudget);
    setChallenges(initialChallenges);
    setCash(2000);
    setMonthsPassed(0);
    setSpecialMoves(1); // Start with one special move
    setPaymentStreak(0);
    setLastLevelSeen(1);
    setGameStarted(true);
    
    toast({
      title: "Game Started!",
      description: "Welcome to Debt Monster Slayer! Make payments to defeat your debt monsters.",
      variant: "default",
    });
  };
  
  // Reset game
  const resetGame = () => {
    setDebts([]);
    setBudget(initialBudget);
    setChallenges([]);
    setCash(0);
    setMonthsPassed(0);
    setSpecialMoves(0);
    setPaymentStreak(0);
    setGameStarted(false);
  };
  
  // Add new debt
  const addDebt = (debt: Omit<Debt, 'id' | 'health'>) => {
    const newDebt: Debt = {
      ...debt,
      id: Date.now().toString(),
      health: 100,
    };
    setDebts([...debts, newDebt]);
    
    toast({
      title: "New Debt Monster Appeared!",
      description: `A ${debt.name} monster has appeared with $${debt.amount} in debt!`,
      variant: "destructive",
    });
  };
  
  // Update existing debt
  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(debts.map(debt => {
      if (debt.id === id) {
        // Check if debt is fully paid
        if (updates.amount === 0 || updates.health === 0) {
          toast({
            title: "Debt Monster Defeated!",
            description: `You've completely paid off your ${debt.name}! Monster defeated!`,
            variant: "default",
          });
          
          // Award a bonus special move for defeating a monster
          setSpecialMoves(prev => prev + 1);
          
          return { ...debt, ...updates, amount: 0, health: 0 };
        }
        return { ...debt, ...updates };
      }
      return debt;
    }));
  };
  
  // Remove debt
  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };
  
  // Update budget
  const updateBudget = (updates: Partial<Budget>) => {
    setBudget({ ...budget, ...updates });
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
        break;
      default:
        break;
    }
  };
  
  // Generate a random life event using our new system
  const generateLifeEvent = () => {
    setCurrentLifeEvent(getLifeEvent());
  };
  
  // Resolve current life event
  const resolveLifeEvent = (optionIndex: number) => {
    if (!currentLifeEvent) return;
    
    const option = currentLifeEvent.options[optionIndex];
    
    // Apply cash effect
    if (option.effect.cash) {
      setCash(prev => prev + option.effect.cash);
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
          monsterType: 'red'
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
  
  // Update challenge progress
  const updateChallenge = (id: string, progress: number) => {
    setChallenges(challenges.map(challenge => {
      if (challenge.id === id) {
        const newProgress = challenge.progress + progress;
        const completed = newProgress >= challenge.target;
        
        // Award rewards for completed challenges
        if (completed && !challenge.completed) {
          setCash(prev => prev + challenge.reward);
          setSpecialMoves(prev => prev + 1);
          
          toast({
            title: "Challenge Completed!",
            description: `${challenge.title}: +$${challenge.reward} cash and +1 Special Move!`,
            variant: "default",
          });
        }
        
        return {
          ...challenge,
          progress: newProgress,
          completed: completed
        };
      }
      return challenge;
    }));
  };
  
  // Advance game by one month
  const advanceMonth = () => {
    // Apply interest to debts
    setDebts(debts.map(debt => ({
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
    setDebts(updatedDebts.filter(debt => debt.amount > 0));
    
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
    
    // Increased chance for life event (50% instead of 25%)
    if (Math.random() < 0.5) {
      generateLifeEvent();
    }
  };
  
  // Damage monster (pay extra toward debt)
  const damageMonster = (debtId: string, amount: number) => {
    if (cash < amount) {
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
  };
  
  // Use special move (50% damage to monster)
  const useSpecialMove = (debtId: string) => {
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
  
  // Context value
  const value: GameContextType = {
    playerName,
    setPlayerName,
    avatar,
    setAvatar,
    cash,
    setCash,
    debts,
    addDebt,
    updateDebt,
    removeDebt,
    totalDebt,
    strategy,
    setStrategy,
    budget,
    updateBudget,
    applyBudgetPreset,
    currentLifeEvent,
    generateLifeEvent,
    resolveLifeEvent,
    challenges,
    updateChallenge,
    monthsPassed,
    advanceMonth,
    damageMonster,
    specialMoves,
    useSpecialMove,
    paymentStreak,
    initializeGame,
    resetGame,
    gameStarted
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
