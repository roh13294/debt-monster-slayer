export type Strategy = 'snowball' | 'avalanche' | 'high-interest';
export type BudgetPreset = 'strict' | 'balanced' | 'relaxed' | 'aggressive' | 'conservative' | 'frugal';
export type ShadowFormType = 'cursedBlade' | 'leecher' | 'whisperer' | null;

export interface TitleTier {
  level: number;
  title: string;
  perk: string | null;
  description: string;
  aura: string;
}

export interface JobType {
  title: string;
  baseIncome: number;
  description?: string;
}

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
  modifier?: number;
}

export interface PlayerTraits {
  financialKnowledge: number;
  discipline: number;
  luck: number;
  stressTolerance: number;
  courage: number;
  wisdom: number;
  determination: number;
  riskTolerance: number;
  savingAbility: number;
  spendingHabits: number;
  careerFocus: number;
  luckyStreak: number;
}

export interface Debt {
  id: string;
  name: string;
  amount: number;
  balance: number;
  interestRate: number;
  interest: number;
  minimumPayment: number;
  type: string;
  monsterType?: string;
  health?: number;
  maxHealth?: number;
  psychologicalImpact: number;
}

export interface Budget {
  income: number;
  essentials: number;
  debtPayment: number;
  debt: number;
  savings: number;
  entertainment: number;
  discretionary: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    effect: {
      cash?: number;
      debt?: number;
      trait?: string;
      traitChange?: number;
      income?: number;
      description?: string;
    };
  }[];
}

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
  icon?: React.ReactNode;
}

export interface SpecialMove {
  id: string;
  name: string;
  description: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
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
