
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

export type PlayerTraits = {
  riskTolerance: number;      // 1-10 scale: affects event probabilities
  financialKnowledge: number; // 1-10 scale: affects advice and options
  spendingHabits: number;     // 1-10 scale: affects spending events
  careerFocus: number;        // 1-10 scale: affects career events
  savingAbility: number;      // 1-10 scale: affects saving events
  luckyStreak: number;        // 1-10 scale: affects random outcomes
};

export type GameContextType = {
  // Player data
  playerName: string;
  setPlayerName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  cash: number;
  setCash: (cash: number) => void;
  
  // Player traits for personalization
  playerTraits: PlayerTraits;
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void;
  
  // Game events tracking
  eventHistory: string[];
  
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
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  
  // Player traits for personalized experience
  const [playerTraits, setPlayerTraits] = useState<PlayerTraits>({
    riskTolerance: 5,
    financialKnowledge: 5,
    spendingHabits: 5,
    careerFocus: 5,
    savingAbility: 5, 
    luckyStreak: 5
  });
  
  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);
  
  // Update a player trait
  const updatePlayerTrait = (trait: keyof PlayerTraits, value: number) => {
    setPlayerTraits(prev => ({
      ...prev,
      [trait]: Math.max(1, Math.min(10, value)) // Ensure value is between 1-10
    }));
  };
  
  // Update player traits based on choices
  const updateTraitsBasedOnChoice = (option: typeof currentLifeEvent?.options[0]) => {
    if (!option) return;
    
    const text = option.text.toLowerCase();
    const effect = option.effect;
    
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
    if (effect.cash && effect.cash < 0 && text.includes('buy')) {
      traitUpdates.spendingHabits = playerTraits.spendingHabits + 1;
    } else if (text.includes('save') || text.includes('budget')) {
      traitUpdates.spendingHabits = Math.max(1, playerTraits.spendingHabits - 1);
    }
    
    // Career focus
    if (text.includes('career') || text.includes('job') || text.includes('professional')) {
      traitUpdates.careerFocus = playerTraits.careerFocus + 1;
    }
    
    // Saving ability
    if (text.includes('save') || (effect.cash && effect.cash > 0)) {
      traitUpdates.savingAbility = playerTraits.savingAbility + 1;
    }
    
    // Apply trait updates
    setPlayerTraits(prev => {
      const updated = { ...prev };
      
      // Apply each update, ensuring values stay within 1-10 range
      Object.entries(traitUpdates).forEach(([trait, value]) => {
        if (value !== undefined) {
          updated[trait as keyof PlayerTraits] = Math.max(1, Math.min(10, value));
        }
      });
      
      return updated;
    });
  };
  
  // Create personalized challenges based on player traits
  const generatePersonalizedChallenges = () => {
    const personalizedChallenges: Challenge[] = [...initialChallenges];
    
    // Add trait-specific challenges
    if (playerTraits.savingAbility > 6) {
      personalizedChallenges.push({
        id: 'save-expert',
        title: 'Savings Expert',
        description: 'Save $1000 total',
        reward: 300,
        progress: 0,
        target: 1000,
        completed: false
      });
    }
    
    if (playerTraits.riskTolerance > 7) {
      personalizedChallenges.push({
        id: 'risk-taker',
        title: 'Risk Taker',
        description: 'Make 5 risky financial decisions',
        reward: 250,
        progress: 0,
        target: 5,
        completed: false
      });
    }
    
    if (playerTraits.careerFocus > 6) {
      personalizedChallenges.push({
        id: 'career-focused',
        title: 'Career Climber',
        description: 'Increase monthly income by $500',
        reward: 200,
        progress: 0,
        target: 500,
        completed: false
      });
    }
    
    return personalizedChallenges;
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
        const newChallenges = generatePersonalizedChallenges();
        // Only add challenges that don't already exist
        const existingIds = challenges.map(c => c.id);
        const challengesToAdd = newChallenges.filter(c => !existingIds.includes(c.id));
        
        if (challengesToAdd.length > 0) {
          setChallenges([...challenges, ...challengesToAdd]);
          
          toast({
            title: "New Challenges!",
            description: `New personalized challenges available based on your play style!`,
            variant: "default",
          });
        }
      }
    }
  }, [monthsPassed, lastLevelSeen, gameStarted, challenges, playerTraits]);
  
  // Initialize game
  const initializeGame = () => {
    // Generate initial player traits with some randomness
    const initialTraits: PlayerTraits = {
      riskTolerance: Math.floor(Math.random() * 4) + 3, // 3-6
      financialKnowledge: Math.floor(Math.random() * 4) + 3, // 3-6
      spendingHabits: Math.floor(Math.random() * 4) + 3, // 3-6
      careerFocus: Math.floor(Math.random() * 4) + 3, // 3-6
      savingAbility: Math.floor(Math.random() * 4) + 3, // 3-6
      luckyStreak: Math.floor(Math.random() * 10) + 1 // 1-10
    };
    
    setPlayerTraits(initialTraits);
    setDebts(initialDebts);
    setBudget(initialBudget);
    setChallenges(initialChallenges);
    setCash(2000);
    setMonthsPassed(0);
    setSpecialMoves(1); // Start with one special move
    setPaymentStreak(0);
    setLastLevelSeen(1);
    setEventHistory([]);
    setGameStarted(true);
    
    // Set initial debt amount based on traits
    if (initialTraits.financialKnowledge < 4) {
      // Less financially knowledgeable players start with more debt
      setDebts(initialDebts.map(debt => ({
        ...debt,
        amount: Math.round(debt.amount * 1.2) // 20% more debt
      })));
    } else if (initialTraits.financialKnowledge > 7) {
      // More financially knowledgeable players start with less debt
      setDebts(initialDebts.map(debt => ({
        ...debt,
        amount: Math.round(debt.amount * 0.9) // 10% less debt
      })));
    }
    
    // Adjust initial cash based on traits
    if (initialTraits.savingAbility > 6) {
      setCash(2500); // Better savers start with more cash
    } else if (initialTraits.savingAbility < 4) {
      setCash(1500); // Poorer savers start with less cash
    }
    
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
    setEventHistory([]);
    setPlayerTraits({
      riskTolerance: 5,
      financialKnowledge: 5,
      spendingHabits: 5,
      careerFocus: 5,
      savingAbility: 5,
      luckyStreak: 5
    });
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
          
          // Update player traits when defeating a monster
          setPlayerTraits(prev => ({
            ...prev,
            financialKnowledge: Math.min(10, prev.financialKnowledge + 0.5),
            savingAbility: Math.min(10, prev.savingAbility + 0.5)
          }));
          
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
        
        // Update player traits based on budget choice
        setPlayerTraits(prev => ({
          ...prev,
          spendingHabits: Math.max(1, prev.spendingHabits - 1),
          savingAbility: Math.min(10, prev.savingAbility + 1)
        }));
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
        setPlayerTraits(prev => ({
          ...prev,
          riskTolerance: Math.min(10, prev.riskTolerance + 1)
        }));
        break;
      default:
        break;
    }
  };
  
  // Generate a random life event using our enhanced system
  const generateLifeEvent = () => {
    // Generate personalized event with impact from player traits
    const event = getLifeEvent();
    
    // Track in history
    setEventHistory(prev => [...prev, event.id]);
    
    setCurrentLifeEvent(event);
  };
  
  // Resolve current life event
  const resolveLifeEvent = (optionIndex: number) => {
    if (!currentLifeEvent) return;
    
    const option = currentLifeEvent.options[optionIndex];
    
    // Update player traits based on choice
    updateTraitsBasedOnChoice(option);
    
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
    
    // Life event chance affected by player traits
    let eventChance = 0.5; // Base 50% chance
    
    // Risk-tolerant players get more events
    if (playerTraits.riskTolerance > 7) {
      eventChance += 0.2;
    } else if (playerTraits.riskTolerance < 4) {
      eventChance -= 0.1;
    }
    
    // Lucky players get more positive events (handled in the event generator)
    
    // Generate life event based on chance
    if (Math.random() < eventChance) {
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
    
    // Update traits based on payment behavior
    setPlayerTraits(prev => ({
      ...prev,
      financialKnowledge: Math.min(10, prev.financialKnowledge + 0.1),
      savingAbility: Math.min(10, prev.savingAbility + 0.1)
    }));
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
    playerTraits,
    updatePlayerTrait,
    eventHistory,
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
