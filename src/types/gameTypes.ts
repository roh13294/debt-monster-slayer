
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
