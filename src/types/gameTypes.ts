import { Dispatch, SetStateAction } from 'react';

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  psychologicalImpact: number;
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
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  options: LifeEventOption[];
}

export interface LifeEventOption {
  text: string;
  cashChange?: number;
  debtChange?: number;
  budgetChange?: {
    income?: number;
    essentials?: number;
    debt?: number;
    savings?: number;
    discretionary?: number;
  };
  traitChange?: {
    financialKnowledge?: number;
    determination?: number;
    riskTolerance?: number;
  };
}

export interface PlayerTraits {
  financialKnowledge: number;
  determination: number;
  riskTolerance: number;
}

export interface Job {
  title: string;
  baseSalary: number;
}

export interface LifeStage {
  name: string;
  baseExpenses: number;
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
  eventHistory: LifeEvent[];
  debts: Debt[];
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  totalDebt: number;
  strategy: string;
  setStrategy: (strategy: string) => void;
  budget: Budget;
  updateBudget: (updates: Partial<Budget>) => void;
  applyBudgetPreset: (preset: string) => void;
  currentLifeEvent: LifeEvent | null;
  generateLifeEvent: () => void;
  resolveLifeEvent: (optionIndex: number, originalResolve: () => void) => void;
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
  purchaseItem: (itemId: string) => void;
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
  eventHistory: LifeEvent[];
  setEventHistory: Dispatch<SetStateAction<LifeEvent[]>>;
  job: Job;
  lifeStage: LifeStage;
  circumstances: string[];
  characterBackground: string;
  setCharacterBackground: React.Dispatch<React.SetStateAction<string>>;
  setCharacterDetails: (job: Job, lifeStage: LifeStage, circumstances: string[]) => void;
  initializePlayerState: (job: Job, lifeStage: LifeStage, circumstances: string[]) => PlayerStateType;
  resetPlayerState: () => void;
}

export interface StanceMultipliers {
  debtPaymentMultiplier: number;
  savingsMultiplier: number;
  incomeMultiplier: number;
  expensesMultiplier: number;
}
