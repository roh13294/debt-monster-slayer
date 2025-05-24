import { Debt } from './gameTypes';
import { Budget } from './budgetTypes';
import { Challenge } from './challengeTypes';
import { LifeEvent } from './lifeEventTypes';
import { ShopItem } from './shopTypes';
import { SpecialMove } from './battleTypes';

export type Strategy = 'snowball' | 'avalanche' | 'high-interest';
export type BudgetPreset = 'strict' | 'balanced' | 'relaxed';
export type ShadowFormType = 'cursedBlade' | 'leecher' | 'whisperer' | null;

export interface Job {
  title: string;
  baseSalary: number;
  description?: string;
}

export interface LifeStage {
  name: string;
  baseExpenses: number;
  description?: string;
  ageBracket?: string;
}

export interface PlayerTraits {
  financialKnowledge: number;
  discipline: number;
  luck: number;
  stressTolerance: number;
}

export interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  avatar: string;
  setAvatar: (avatar: string) => void;
  cash: number;
  setCash: (cash: number | ((prev: number) => number)) => void;
  playerTraits: PlayerTraits;
  updatePlayerTrait: (trait: keyof PlayerTraits, value: any) => void;
  eventHistory: LifeEvent[];
  debts: Debt[];
  addDebt: (debt: Debt) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  totalDebt: number;
  strategy: Strategy;
  setStrategy: (strategy: Strategy) => void;
  budget: Budget;
  updateBudget: (category: keyof Budget, amount: number) => void;
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
  specialMoves: SpecialMove[];
  setSpecialMoves: (moves: SpecialMove[]) => void;
  useSpecialMove: (moveId: string, debtId: string) => boolean;
  paymentStreak: number;
  initializeGame: () => void;
  resetGame: () => void;
  gameStarted: boolean;
  job: Job;
  lifeStage: LifeStage;
  circumstances: string[];
  characterBackground?: string;
  purchaseItem: (item: ShopItem) => boolean;
  shadowForm: ShadowFormType | null;
  corruptionLevel: number;
  updateShadowForm: (form: ShadowFormType | null, corruption?: number) => void;
  increaseCorruption: (amount: number) => void;
  decreaseCorruption: (amount: number) => void;
  isCorruptionUnstable: boolean;
  breathingXP: number;
  addBreathingXP: (amount: number) => void;
  templeLevel: number;
  upgradeTemple: (cost: number) => boolean;
  calculateTempleReturn: (hasShadowPenalty?: boolean) => number;
  playerXP: number;
  gainXP: (amount: number) => void;
  playerLevel: number;
  playerTitle: string;
  playerPerk: string;
  getXPThreshold: (level: number) => number;
  getNextTitle: (level: number) => string;
  demonCoinBalance: number;
  earnDemonCoins: (source: any, description: string) => number;
  spendDemonCoins: (amount: number, description: string) => boolean;
  addBonusCoins: (amount: number, description: string) => void;
  coinTransactions: any[];
  powerUpInventory: any;
  purchasePowerUp: (powerUpId: string, spendCoins: (amount: number, desc: string) => boolean) => boolean;
  activatePowerUp: (powerUpId: string) => boolean;
  getActivePowerUps: () => any[];
  getPowerUpMultiplier: (type: string) => number;
}
