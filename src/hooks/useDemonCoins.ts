
import { useState, useCallback } from 'react';
import { DemonCoinTransaction, CurrencyState, EarningSource } from '@/types/currencyTypes';
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';

export const useDemonCoins = (initialBalance: number = 0) => {
  const [currencyState, setCurrencyState] = useState<CurrencyState>({
    balance: initialBalance,
    totalEarned: 0,
    totalSpent: 0,
    transactions: []
  });

  const earnDemonCoins = useCallback((source: EarningSource, description: string) => {
    const amount = Math.floor(source.baseAmount * (source.multiplier || 1));
    const transaction: DemonCoinTransaction = {
      id: uuidv4(),
      amount,
      type: 'earned',
      source: source.type,
      timestamp: Date.now(),
      description
    };

    setCurrencyState(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      transactions: [transaction, ...prev.transactions].slice(0, 100) // Keep last 100 transactions
    }));

    toast({
      title: "DemonCoins Earned!",
      description: `+${amount} DemonCoins from ${description}`,
      variant: "default",
    });

    return amount;
  }, []);

  const spendDemonCoins = useCallback((amount: number, description: string): boolean => {
    if (currencyState.balance < amount) {
      toast({
        title: "Insufficient DemonCoins",
        description: `You need ${amount} DemonCoins but only have ${currencyState.balance}`,
        variant: "destructive",
      });
      return false;
    }

    const transaction: DemonCoinTransaction = {
      id: uuidv4(),
      amount,
      type: 'spent',
      source: 'purchase',
      timestamp: Date.now(),
      description
    };

    setCurrencyState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      totalSpent: prev.totalSpent + amount,
      transactions: [transaction, ...prev.transactions].slice(0, 100)
    }));

    return true;
  }, [currencyState.balance]);

  const addBonusCoins = useCallback((amount: number, description: string) => {
    const transaction: DemonCoinTransaction = {
      id: uuidv4(),
      amount,
      type: 'bonus',
      source: 'bonus',
      timestamp: Date.now(),
      description
    };

    setCurrencyState(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarned: prev.totalEarned + amount,
      transactions: [transaction, ...prev.transactions].slice(0, 100)
    }));

    toast({
      title: "Bonus DemonCoins!",
      description: `+${amount} DemonCoins from ${description}`,
      variant: "default",
    });
  }, []);

  return {
    balance: currencyState.balance,
    totalEarned: currencyState.totalEarned,
    totalSpent: currencyState.totalSpent,
    transactions: currencyState.transactions,
    earnDemonCoins,
    spendDemonCoins,
    addBonusCoins
  };
};
