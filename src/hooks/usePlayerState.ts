
import { useState } from 'react';
import { PlayerTraits, Job, LifeStage, LifeEvent, SpecialMove } from '../types/gameTypes';
import { initialPlayerTraits } from '../data/initialGameState';

export const usePlayerState = () => {
  const [playerName, setPlayerName] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [cash, setCash] = useState<number>(1000);
  const [playerTraits, setPlayerTraits] = useState<PlayerTraits>({
    ...initialPlayerTraits,
    luck: 5,
    stressTolerance: 5
  });
  const [specialMoves, setSpecialMoves] = useState<SpecialMove[]>([]);
  const [paymentStreak, setPaymentStreak] = useState<number>(0);
  const [eventHistory, setEventHistory] = useState<LifeEvent[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [circumstances, setCircumstances] = useState<string[]>([]);
  const [characterBackground, setCharacterBackground] = useState<string>('');

  const updatePlayerTrait = (trait: keyof PlayerTraits, value: number) => {
    setPlayerTraits(prev => ({
      ...prev,
      [trait]: Math.max(0, Math.min(10, value))
    }));
  };

  const calculateAdjustedIncome = (baseIncome: number, job: Job, lifeStage: LifeStage, circumstances: string[]) => {
    let adjustedIncome = baseIncome;
    
    // Life stage modifiers
    if (lifeStage.modifier) {
      adjustedIncome *= lifeStage.modifier;
    }
    
    // Circumstance modifiers
    circumstances.forEach(circumstance => {
      switch (circumstance) {
        case 'Urban Professional':
          adjustedIncome *= 1.2;
          break;
        case 'Recent Graduate':
          adjustedIncome *= 0.8;
          break;
        case 'Family Provider':
          adjustedIncome *= 1.1;
          break;
        default:
          break;
      }
    });
    
    return Math.round(adjustedIncome);
  };

  const calculateBaseExpenses = (income: number, lifeStage: LifeStage, circumstances: string[]) => {
    let baseExpenseRatio = lifeStage.baseExpenses;
    
    if (lifeStage.modifier) {
      baseExpenseRatio *= lifeStage.modifier;
    }
    
    circumstances.forEach(circumstance => {
      switch (circumstance) {
        case 'High Cost of Living':
          baseExpenseRatio *= 1.3;
          break;
        case 'Frugal Lifestyle':
          baseExpenseRatio *= 0.8;
          break;
        default:
          break;
      }
    });
    
    return Math.round(income * baseExpenseRatio);
  };

  const initializePlayerState = (jobData: Job, lifeStageData: LifeStage, circumstancesData: string[]) => {
    setJob(jobData);
    setLifeStage(lifeStageData);
    setCircumstances(circumstancesData);
    
    const adjustedIncome = calculateAdjustedIncome(jobData.baseSalary, jobData, lifeStageData, circumstancesData);
    const baseExpenses = calculateBaseExpenses(adjustedIncome, lifeStageData, circumstancesData);
    const startingCash = Math.round(adjustedIncome * 0.3);
    
    setCash(startingCash);
    
    return {
      income: adjustedIncome,
      expenses: baseExpenses,
      startingCash,
      traits: playerTraits
    };
  };

  const resetPlayerState = () => {
    setPlayerName('');
    setAvatar('');
    setCash(1000);
    setPlayerTraits({
      ...initialPlayerTraits,
      luck: 5,
      stressTolerance: 5
    });
    setSpecialMoves([]);
    setPaymentStreak(0);
    setEventHistory([]);
    setJob(null);
    setLifeStage(null);
    setCircumstances([]);
    setCharacterBackground('');
  };

  return {
    playerName,
    setPlayerName,
    avatar,
    setAvatar,
    cash,
    setCash,
    playerTraits,
    updatePlayerTrait,
    specialMoves,
    setSpecialMoves,
    paymentStreak,
    setPaymentStreak,
    eventHistory,
    setEventHistory,
    job,
    lifeStage,
    circumstances,
    characterBackground,
    setCharacterBackground,
    setCharacterDetails: (job: Job, lifeStage: LifeStage, circumstances: string[]) => {
      setJob(job);
      setLifeStage(lifeStage);
      setCircumstances(circumstances);
    },
    initializePlayerState,
    resetPlayerState
  };
};
