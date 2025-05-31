import { useState } from 'react';
import { Debt, Strategy } from '../types/gameTypes';
import { initialDebts } from '../data/initialGameState';

export const useDebtState = (setCash: (cash: number | ((prev: number) => number)) => void) => {
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [strategy, setStrategy] = useState<Strategy>('snowball');

  const totalDebt = debts.reduce((sum, debt) => sum + debt.balance, 0);

  const addDebt = (debt: Debt) => {
    setDebts(prev => [...prev, debt]);
  };

  const updateDebt = (id: string, updates: Partial<Debt>) => {
    setDebts(prev => prev.map(debt => 
      debt.id === id ? { ...debt, ...updates } : debt
    ));
  };

  const removeDebt = (id: string) => {
    setDebts(prev => prev.filter(debt => debt.id !== id));
  };

  const generateDebt = (id: string, name: string, amount: number, interestRate: number, monsterType: string) => {
    const newDebt: Debt = {
      id,
      name,
      amount,
      balance: amount,
      interest: interestRate,
      interestRate,
      minimumPayment: Math.round(amount * 0.025),
      type: 'generated',
      monsterType,
      health: 100,
      psychologicalImpact: Math.floor(Math.random() * 5) + 3
    };
    
    addDebt(newDebt);
    return newDebt;
  };

  const initializeDebts = (financialKnowledge: number, lifeStage: any, circumstances: any[]) => {
    const generatedDebts: Debt[] = [];
    
    // Credit card debt (common)
    if (Math.random() < 0.7) {
      generatedDebts.push({
        id: `credit-${Date.now()}`,
        name: 'Credit Card Debt',
        amount: Math.round(2000 + Math.random() * 5000),
        balance: Math.round(2000 + Math.random() * 5000),
        interest: 18.99,
        interestRate: 18.99,
        minimumPayment: 150,
        type: 'credit card',
        monsterType: 'red',
        health: 100,
        psychologicalImpact: 8
      });
    }

    // Student loan (for younger demographics)
    if (lifeStage?.name?.includes('Young') && Math.random() < 0.6) {
      generatedDebts.push({
        id: `student-${Date.now()}`,
        name: 'Student Loan',
        amount: Math.round(10000 + Math.random() * 20000),
        balance: Math.round(10000 + Math.random() * 20000),
        interest: 5.8,
        interestRate: 5.8,
        minimumPayment: 180,
        type: 'student loan',
        monsterType: 'blue',
        health: 100,
        psychologicalImpact: 6
      });
    }

    // Car loan (based on circumstances)
    if (circumstances.some(c => c.includes('Car')) && Math.random() < 0.5) {
      generatedDebts.push({
        id: `car-${Date.now()}`,
        name: 'Car Loan',
        amount: Math.round(8000 + Math.random() * 15000),
        balance: Math.round(8000 + Math.random() * 15000),
        interest: 4.5,
        interestRate: 4.5,
        minimumPayment: 220,
        type: 'auto loan',
        monsterType: 'green',
        health: 100,
        psychologicalImpact: 5
      });
    }

    setDebts(generatedDebts);
    return generatedDebts;
  };

  const resetDebtState = () => {
    setDebts(initialDebts);
    setStrategy('snowball');
  };

  return {
    debts,
    setDebts,
    totalDebt,
    strategy,
    setStrategy,
    addDebt,
    updateDebt,
    removeDebt,
    generateDebt,
    initializeDebts,
    resetDebtState
  };
};
