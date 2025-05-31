
import { useState } from 'react';
import { JobType, PlayerTraits } from '../types/gameTypes';

export const useRandomCharacter = () => {
  // Job types with income ranges
  const jobTypes = [
    { title: 'Software Developer', baseIncome: 4500, description: 'Tech professional with good income potential' },
    { title: 'Teacher', baseIncome: 3200, description: 'Educator with stable but modest income' },
    { title: 'Nurse', baseIncome: 3800, description: 'Healthcare worker with steady income' },
    { title: 'Sales Associate', baseIncome: 2800, description: 'Retail worker with variable income' },
    { title: 'Marketing Manager', baseIncome: 4200, description: 'Business professional with good prospects' },
    { title: 'Freelancer', baseIncome: 3000, description: 'Independent contractor with irregular income' }
  ];

  // Life stage definitions
  const lifeStages = [
    { name: 'Young Adult', expenseRatio: 0.4, description: 'Just starting out in life', ageBracket: '18-25' },
    { name: 'Early Career', expenseRatio: 0.5, description: 'Building career foundation', ageBracket: '26-35' },
    { name: 'Mid Career', expenseRatio: 0.6, description: 'Established professional', ageBracket: '36-45' },
    { name: 'Late Career', expenseRatio: 0.55, description: 'Experienced professional', ageBracket: '46-60' }
  ];

  // Personal circumstances
  const circumstances = [
    'Single',
    'Married',
    'Has Children',
    'Urban Living',
    'Suburban Living',
    'High Cost of Living',
    'Recent Graduate',
    'Career Changer',
    'Homeowner',
    'Renter'
  ];

  const generateRandomCharacter = () => {
    const job = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const lifeStage = lifeStages[Math.floor(Math.random() * lifeStages.length)];
    
    // Select 2-4 random circumstances
    const shuffledCircumstances = [...circumstances].sort(() => 0.5 - Math.random());
    const selectedCircumstances = shuffledCircumstances.slice(0, 2 + Math.floor(Math.random() * 3));
    
    return {
      job,
      lifeStage,
      circumstances: selectedCircumstances
    };
  };

  const calculateAdjustedIncome = (baseIncome: number, job: JobType, lifeStage: any, circumstances: string[]) => {
    let multiplier = 1.0;
    
    // Life stage adjustments
    if (lifeStage.name === 'Young Adult') multiplier *= 0.8;
    if (lifeStage.name === 'Mid Career') multiplier *= 1.2;
    if (lifeStage.name === 'Late Career') multiplier *= 1.3;
    
    // Circumstance adjustments
    if (circumstances.includes('Recent Graduate')) multiplier *= 0.85;
    if (circumstances.includes('Urban Living')) multiplier *= 1.15;
    if (circumstances.includes('High Cost of Living')) multiplier *= 1.1;
    
    return Math.round(baseIncome * multiplier);
  };

  const calculateBaseExpenses = (income: number, lifeStage: any, circumstances: string[]) => {
    let expenseRatio = lifeStage.expenseRatio;
    
    // Circumstance adjustments
    if (circumstances.includes('Has Children')) expenseRatio += 0.15;
    if (circumstances.includes('Homeowner')) expenseRatio += 0.1;
    if (circumstances.includes('High Cost of Living')) expenseRatio += 0.2;
    if (circumstances.includes('Urban Living')) expenseRatio += 0.1;
    
    return Math.round(income * Math.min(expenseRatio, 0.8)); // Cap at 80%
  };

  const calculateStartingCash = (income: number, lifeStage: any, circumstances: string[]) => {
    let cashMultiplier = 0.2; // Base 20% of monthly income
    
    // Life stage adjustments
    if (lifeStage.name === 'Young Adult') cashMultiplier = 0.1;
    if (lifeStage.name === 'Mid Career') cashMultiplier = 0.3;
    if (lifeStage.name === 'Late Career') cashMultiplier = 0.4;
    
    // Circumstance adjustments
    if (circumstances.includes('Recent Graduate')) cashMultiplier *= 0.5;
    if (circumstances.includes('Has Children')) cashMultiplier *= 0.7;
    
    return Math.round(income * cashMultiplier);
  };

  const generateCharacterBackground = (job: JobType, lifeStage: any, circumstances: string[]) => {
    const backgrounds = [
      `As a ${lifeStage.name.toLowerCase()} ${job.title.toLowerCase()}, you've found yourself in a challenging financial situation. The demons of debt have begun to manifest, and you must fight to reclaim your financial freedom.`,
      
      `Your journey as a ${job.title.toLowerCase()} in the ${lifeStage.name.toLowerCase()} phase of life has led you here. The shadows of financial stress have grown long, and mystical debts now take physical form as monsters you must battle.`,
      
      `Once, you thought being a ${job.title.toLowerCase()} would provide stability. But the financial demons have other plans, manifesting as literal monsters that feed on your peace of mind and drain your resources.`
    ];
    
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  return {
    generateRandomCharacter,
    calculateAdjustedIncome,
    calculateBaseExpenses,
    calculateStartingCash,
    generateCharacterBackground
  };
};
