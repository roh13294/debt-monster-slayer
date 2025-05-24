
export interface DemonCoinTransaction {
  id: string;
  amount: number;
  type: 'earned' | 'spent' | 'bonus';
  source: string;
  timestamp: number;
  description: string;
}

export interface CurrencyState {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: DemonCoinTransaction[];
}

export interface EarningSource {
  type: 'debt_payment' | 'challenge_complete' | 'monster_defeat' | 'daily_bonus' | 'streak_bonus';
  baseAmount: number;
  multiplier?: number;
}
