
import { useState } from 'react';

// Define types for our character attributes
export type JobType = {
  title: string;
  baseIncome: number;
  description: string;
};

export type LifeStage = {
  name: string;
  description: string;
  ageBracket: string;
  modifier: {
    income?: number;
    expenses?: number;
    debtChance?: number;
    startingCash?: number;
  };
};

export type Circumstance = {
  name: string;
  description: string;
  effect: {
    income?: number;
    expenses?: number;
    cash?: number;
    debt?: number | null;
    traits?: Partial<Record<string, number>>;
  };
};

// Available jobs with base income
const availableJobs: JobType[] = [
  { 
    title: "Software Developer", 
    baseIncome: 5500, 
    description: "You write code for applications and websites."
  },
  { 
    title: "Teacher", 
    baseIncome: 3800, 
    description: "You educate the next generation."
  },
  { 
    title: "Nurse", 
    baseIncome: 4200, 
    description: "You provide healthcare and support to patients."
  },
  { 
    title: "Marketing Specialist", 
    baseIncome: 4500, 
    description: "You develop strategies to promote products and services."
  },
  { 
    title: "Retail Manager", 
    baseIncome: 3600, 
    description: "You oversee store operations and staff."
  },
  { 
    title: "Graphic Designer", 
    baseIncome: 3900, 
    description: "You create visual content for various media."
  },
  { 
    title: "Accountant", 
    baseIncome: 4800, 
    description: "You maintain and analyze financial records."
  },
  { 
    title: "Chef", 
    baseIncome: 3700, 
    description: "You prepare and cook food in a restaurant."
  },
  { 
    title: "Sales Representative", 
    baseIncome: 4000, 
    description: "You sell products or services to customers."
  },
  { 
    title: "Administrative Assistant", 
    baseIncome: 3200, 
    description: "You provide organizational support in an office."
  }
];

// Life stages with modifiers
const lifeStages: LifeStage[] = [
  {
    name: "Fresh Graduate",
    description: "You've recently completed your education and are starting your career.",
    ageBracket: "22-25",
    modifier: {
      income: -500,
      startingCash: 1000,
      debtChance: 0.8
    }
  },
  {
    name: "Young Professional",
    description: "You've been working for a few years and are establishing yourself.",
    ageBracket: "26-35",
    modifier: {
      income: 0,
      startingCash: 3000,
      debtChance: 0.6
    }
  },
  {
    name: "Mid-Career",
    description: "You're established in your career with more responsibilities.",
    ageBracket: "36-45",
    modifier: {
      income: 800,
      expenses: 500,
      startingCash: 5000,
      debtChance: 0.7
    }
  },
  {
    name: "Established Professional",
    description: "You have significant experience and are at a senior level in your career.",
    ageBracket: "46-55",
    modifier: {
      income: 1500,
      expenses: 700,
      startingCash: 8000,
      debtChance: 0.5
    }
  },
  {
    name: "Pre-Retirement",
    description: "You're in the final phase of your career before retirement.",
    ageBracket: "56-65",
    modifier: {
      income: 1000,
      expenses: 400,
      startingCash: 10000,
      debtChance: 0.4
    }
  }
];

// Life circumstances
const circumstances: Circumstance[] = [
  {
    name: "Recent Homeowner",
    description: "You recently purchased a home with a mortgage.",
    effect: {
      expenses: 800,
      debt: 250000,
      traits: { savingAbility: -1 }
    }
  },
  {
    name: "Renter",
    description: "You're currently renting your home.",
    effect: {
      expenses: 500,
      traits: { savingAbility: 1 }
    }
  },
  {
    name: "Living with Family",
    description: "You're living with family to save on housing costs.",
    effect: {
      expenses: -300,
      traits: { savingAbility: 2 }
    }
  },
  {
    name: "Supporting Dependents",
    description: "You have financial responsibility for others.",
    effect: {
      expenses: 600,
      traits: { careerFocus: 1, spendingHabits: -1 }
    }
  },
  {
    name: "Recent Education",
    description: "You recently completed additional education.",
    effect: {
      debt: 30000,
      income: 300,
      traits: { financialKnowledge: 1 }
    }
  },
  {
    name: "Side Business",
    description: "You run a small side business for additional income.",
    effect: {
      income: 500,
      traits: { riskTolerance: 1, careerFocus: 1 }
    }
  },
  {
    name: "Health Challenge",
    description: "You're managing ongoing health expenses.",
    effect: {
      expenses: 300,
      traits: { savingAbility: -1 }
    }
  },
  {
    name: "Inheritance",
    description: "You recently received a modest inheritance.",
    effect: {
      cash: 5000,
      traits: { luckyStreak: 1 }
    }
  },
  {
    name: "Market Investment",
    description: "You have some investments in the market.",
    effect: {
      income: 200,
      traits: { riskTolerance: 1, financialKnowledge: 1 }
    }
  },
  {
    name: "Debt Free Start",
    description: "You've managed to avoid taking on debt so far.",
    effect: {
      debt: null,
      traits: { financialKnowledge: 1, savingAbility: 1 }
    }
  }
];

export const useRandomCharacter = () => {
  const [job, setJob] = useState<JobType | null>(null);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [characterCircumstances, setCharacterCircumstances] = useState<Circumstance[]>([]);

  // Generate a random character based on RNG
  const generateRandomCharacter = () => {
    // Select a random job
    const randomJob = availableJobs[Math.floor(Math.random() * availableJobs.length)];
    
    // Select a random life stage
    const randomLifeStage = lifeStages[Math.floor(Math.random() * lifeStages.length)];
    
    // Select 1-3 random circumstances without repeats
    const shuffledCircumstances = [...circumstances].sort(() => Math.random() - 0.5);
    // Take between 1 and 3 circumstances
    const numCircumstances = Math.floor(Math.random() * 3) + 1;
    const selectedCircumstances = shuffledCircumstances.slice(0, numCircumstances);
    
    // Set the state
    setJob(randomJob);
    setLifeStage(randomLifeStage);
    setCharacterCircumstances(selectedCircumstances);
    
    return {
      job: randomJob,
      lifeStage: randomLifeStage,
      circumstances: selectedCircumstances
    };
  };

  // Calculate the adjusted income based on job, life stage, and circumstances
  const calculateAdjustedIncome = (
    selectedJob: JobType, 
    selectedLifeStage: LifeStage, 
    selectedCircumstances: Circumstance[]
  ) => {
    let income = selectedJob.baseIncome;
    
    // Apply life stage modifier
    if (selectedLifeStage.modifier.income) {
      income += selectedLifeStage.modifier.income;
    }
    
    // Apply circumstances modifiers
    selectedCircumstances.forEach(circumstance => {
      if (circumstance.effect.income) {
        income += circumstance.effect.income;
      }
    });
    
    return income;
  };
  
  // Calculate monthly expenses based on life stage and circumstances
  const calculateBaseExpenses = (
    selectedLifeStage: LifeStage, 
    selectedCircumstances: Circumstance[]
  ) => {
    // Base expenses are approximately 50% of income for essentials
    let baseExpenses = 1500; // Minimum base expenses
    
    // Apply life stage modifier
    if (selectedLifeStage.modifier.expenses) {
      baseExpenses += selectedLifeStage.modifier.expenses;
    }
    
    // Apply circumstances modifiers
    selectedCircumstances.forEach(circumstance => {
      if (circumstance.effect.expenses) {
        baseExpenses += circumstance.effect.expenses;
      }
    });
    
    return baseExpenses;
  };
  
  // Calculate starting cash based on life stage and circumstances
  const calculateStartingCash = (
    selectedLifeStage: LifeStage, 
    selectedCircumstances: Circumstance[]
  ) => {
    let cash = selectedLifeStage.modifier.startingCash || 2000;
    
    // Apply circumstances modifiers
    selectedCircumstances.forEach(circumstance => {
      if (circumstance.effect.cash) {
        cash += circumstance.effect.cash;
      }
    });
    
    return cash;
  };
  
  // Generate a description of the character's background
  const generateCharacterBackground = (
    selectedJob: JobType, 
    selectedLifeStage: LifeStage, 
    selectedCircumstances: Circumstance[]
  ) => {
    return {
      jobTitle: selectedJob.title,
      jobDescription: selectedJob.description,
      lifeStage: selectedLifeStage.name,
      lifeStageBracket: selectedLifeStage.ageBracket,
      lifeStageDescription: selectedLifeStage.description,
      circumstances: selectedCircumstances.map(c => ({
        name: c.name,
        description: c.description
      }))
    };
  };

  return {
    job,
    lifeStage,
    characterCircumstances,
    generateRandomCharacter,
    calculateAdjustedIncome,
    calculateBaseExpenses,
    calculateStartingCash,
    generateCharacterBackground
  };
};
