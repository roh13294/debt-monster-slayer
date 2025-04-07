
import { Dispatch, SetStateAction } from 'react';
import { ReactNode } from 'react';

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  psychologicalImpact: number;
  
  // Additional properties used in implementation
  amount: number;
  interest: number;
  health: number;
  monsterType: string;
}

export interface Budget {
  income: number;
  essentials: number;
  debt: number;
  savings: number;
  discretionary: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  
  // Additional properties used in implementation
  progress: number;
  target: number;
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  options: LifeEventOption[];
}

export interface LifeEventOption {
  text: string;
  effect: {
    cash?: number;
    debt?: number;
    income?: number;
    description: string;
    // Additional properties can be added as needed
  };
}

export interface PlayerTraits {
  financialKnowledge: number;
  riskTolerance: number;
  determination: number;
  
  // Additional properties used in implementation
  discipline: number;
  courage: number;
  wisdom: number;
  spendingHabits: number;
  careerFocus: number;
  savingAbility: number;
  luckyStreak?: number;
}

export interface Job {
  title: string;
  baseSalary: number;
}

export interface LifeStage {
  name: string;
  baseExpenses: number;
}

// Define ShopItem interface for the Shop component
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: {
    type: string;
    value: number;
    trait?: keyof PlayerTraits;
  };
  icon?: ReactNode;
  category?: string;
}

// Define Strategy type for debt repayment strategies
export type Strategy = 'avalanche' | 'snowball' | 'highImpact' | 'proportional';

// Define BudgetPreset type
export type BudgetPreset = 'balanced' | 'aggressive' | 'conservative' | 'custom' | 'frugal';

export interface StanceMultipliers {
  debtPaymentMultiplier: number;
  savingsMultiplier: number;
  incomeMultiplier: number;
  expensesMultiplier: number;
}

export interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  cash: number;
  setCash: (cash: number) => void;
  playerTraits: PlayerTraits;
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void;
  eventHistory: string[];
  debts: Debt[];
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  totalDebt: number;
  strategy: Strategy;
  setStrategy: (strategy: Strategy) => void;
  budget: Budget;
  updateBudget: (updates: Partial<Budget>) => void;
  applyBudgetPreset: (preset: BudgetPreset) => void;
  currentLifeEvent: LifeEvent | null;
  generateLifeEvent: () => void;
  resolveLifeEvent: (optionIndex: number) => void;
  challenges: Challenge[];
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  monthsPassed: number;
  advanceMonth: () => void;
  processMonthlyFinancials: (stance?: string | null) => void;
  damageMonster: (debtId: string, damage: number) => void;
  specialMoves: number;
  setSpecialMoves: (moves: number) => void;
  useSpecialMove: (debtId: string) => void;
  paymentStreak: number;
  initializeGame: () => void;
  resetGame: () => void;
  gameStarted: boolean;
  job: Job;
  lifeStage: LifeStage;
  circumstances: string[];
  characterBackground: string;
  purchaseItem: (item: ShopItem) => void;
}

export interface PlayerStateType {
  playerName: string;
  setPlayerName: Dispatch<SetStateAction<string>>;
  avatar: string;
  setAvatar: Dispatch<SetStateAction<string>>;
  cash: number;
  setCash: Dispatch<SetStateAction<number>>;
  playerTraits: PlayerTraits;
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void;
  specialMoves: number;
  setSpecialMoves: Dispatch<SetStateAction<number>>;
  paymentStreak: number;
  setPaymentStreak: Dispatch<SetStateAction<number>>;
  eventHistory: string[];
  setEventHistory: Dispatch<SetStateAction<string[]>>;
  job: Job;
  lifeStage: LifeStage;
  circumstances: string[];
  characterBackground: string;
  setCharacterBackground: React.Dispatch<React.SetStateAction<string>>;
  setCharacterDetails: (job: Job, lifeStage: LifeStage, circumstances: string[]) => void;
  initializePlayerState: (job: Job, lifeStage: LifeStage, circumstances: string[]) => any;
  resetPlayerState: () => void;
}

// Add utility type for the hooks/useRandomCharacter.ts compatibility
export type JobType = Job;
export type CircumstanceType = string;
