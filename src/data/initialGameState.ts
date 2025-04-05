
import { Debt, Budget, Challenge, PlayerTraits } from '../types/gameTypes';

export const initialDebts: Debt[] = [
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

export const initialBudget: Budget = {
  income: 3500,
  essentials: 1800,
  debt: 600,
  savings: 200,
};

export const initialChallenges: Challenge[] = [
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
  },
  {
    id: '4',
    title: 'Debt Hunter',
    description: 'Pay off a debt completely',
    reward: 300,
    progress: 0,
    target: 1,
    completed: false,
  },
  {
    id: '5',
    title: 'Financial Planner',
    description: 'Adjust your budget 3 times',
    reward: 120,
    progress: 0,
    target: 3,
    completed: false,
  },
  {
    id: '6',
    title: 'Interest Slayer',
    description: 'Reduce a debt\'s interest rate',
    reward: 200,
    progress: 0,
    target: 1,
    completed: false,
  },
  {
    id: '7',
    title: 'Savings Hero',
    description: 'Reach $1000 in savings',
    reward: 250,
    progress: 0,
    target: 1000,
    completed: false,
  },
  {
    id: '8',
    title: 'Strategy Master',
    description: 'Try both repayment strategies',
    reward: 150,
    progress: 0,
    target: 2,
    completed: false,
  }
];

export const initialPlayerTraits: PlayerTraits = {
  riskTolerance: 5,
  financialKnowledge: 5,
  spendingHabits: 5,
  careerFocus: 5,
  savingAbility: 5,
  luckyStreak: 5,
  // New anime-themed traits
  discipline: 5,
  courage: 5,
  wisdom: 5
};
