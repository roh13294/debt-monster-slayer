import React, { useState } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useDebtState } from '../hooks/useDebtState';
import { useBudgetState } from '../hooks/useBudgetState';
import { useChallengeState } from '../hooks/useChallengeState';
import { useLifeEventState } from '../hooks/useLifeEventState';
import { useGameProgress } from '../hooks/useGameProgress';
import { useRandomCharacter } from '../hooks/useRandomCharacter';
import { GameContextType, Strategy, BudgetPreset, ShopItem, Challenge, Job, LifeStage, PlayerTraits } from '../types/gameTypes';
import { useBattleActions } from '../hooks/useBattleActions';
import { useShopActions } from '../hooks/useShopActions';
import { useEventResolver } from '../hooks/useEventResolver';
import { GameContext } from './GameContextTypes';
import { initializeGameState, resetGameState } from './GameInitialization';
import { toast } from "@/hooks/use-toast";

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    playerName, setPlayerName,
    avatar, setAvatar,
    cash, setCash,
    playerTraits, updatePlayerTrait,
    specialMoves, setSpecialMoves,
    paymentStreak, setPaymentStreak,
    eventHistory, setEventHistory,
    job, lifeStage, circumstances, characterBackground,
    setCharacterBackground,
    setCharacterDetails,
    initializePlayerState,
    resetPlayerState
  } = usePlayerState();

  const {
    generateRandomCharacter,
    calculateAdjustedIncome,
    calculateBaseExpenses,
    calculateStartingCash,
    generateCharacterBackground
  } = useRandomCharacter();

  const {
    debts,
    setDebts,
    totalDebt,
    strategy, setStrategy,
    addDebt,
    updateDebt,
    removeDebt,
    initializeDebts,
    resetDebtState
  } = useDebtState(setCash);

  const {
    budget,
    updateBudget,
    initializeBudget,
    applyBudgetPreset,
    resetBudgetState
  } = useBudgetState(updatePlayerTrait, playerTraits);

  const {
    challenges,
    updateChallenge,
    generatePersonalizedChallenges,
    initializeChallenges,
    resetChallengeState,
    setChallenges
  } = useChallengeState(setCash, setSpecialMoves);

  const {
    currentLifeEvent,
    generateLifeEvent,
    setCurrentLifeEvent,
    resolveLifeEvent: originalResolveLifeEvent
  } = useLifeEventState(
    setEventHistory,
    setCash,
    updateBudget,
    addDebt,
    updateDebt,
    debts,
    budget
  );

  const {
    monthsPassed,
    gameStarted,
    setGameStarted,
    advanceMonth,
    processMonthlyFinancials: originalProcessMonthlyFinancials,
    setMonthsPassed,
    setLastLevelSeen
  } = useGameProgress(
    setDebts,
    debts,
    budget,
    setCash,
    setPaymentStreak,
    paymentStreak,
    setSpecialMoves,
    specialMoves,
    strategy,
    generateLifeEvent,
    playerTraits,
    setChallenges,
    () => generatePersonalizedChallenges(playerTraits)
  );

  const { damageMonster, useSpecialMove } = useBattleActions({
    cash,
    setCash,
    updateDebt,
    removeDebt,
    updateChallenge: (id: string, updates: Partial<Challenge>) => updateChallenge(id, updates),
    updatePlayerTrait,
    playerTraits,
    debts,
    specialMoves,
    setSpecialMoves
  });

  const { purchaseItem } = useShopActions({
    cash,
    setCash,
    setSpecialMoves,
    setDebts,
    updateDebt,
    updatePlayerTrait,
    playerTraits,
    debts
  });

  const { resolveLifeEvent } = useEventResolver({
    updatePlayerTrait,
    playerTraits,
    processMonthlyFinancials: originalProcessMonthlyFinancials
  });

  const processMonthlyFinancials = (stance?: string | null) => {
    let stanceMultipliers = {
      debtPaymentMultiplier: 1,
      savingsMultiplier: 1,
      incomeMultiplier: 1,
      expensesMultiplier: 1
    };
    
    if (stance) {
      switch (stance) {
        case 'aggressive':
          stanceMultipliers.debtPaymentMultiplier = 1.15;
          break;
        case 'defensive':
          stanceMultipliers.savingsMultiplier = 1.05;
          stanceMultipliers.debtPaymentMultiplier = 0.95;
          break;
        case 'risky':
          const riskRoll = Math.random();
          if (riskRoll < 0.25) {
            stanceMultipliers.incomeMultiplier = 1.3;
            stanceMultipliers.debtPaymentMultiplier = 1.1;
          } else if (riskRoll < 0.65) {
            stanceMultipliers.incomeMultiplier = 1.15;
          } else if (riskRoll < 0.9) {
            stanceMultipliers.incomeMultiplier = 1;
          } else {
            stanceMultipliers.incomeMultiplier = 0.85;
            stanceMultipliers.debtPaymentMultiplier = 0.95;
          }
          break;
      }
    }
    
    originalProcessMonthlyFinancials(stanceMultipliers);
  };

  const initializeGame = () => {
    resetGame();
    
    const { job: randomJob, lifeStage: randomLifeStage, circumstances: randomCircumstances } = generateRandomCharacter();
    
    const gameJob: Job = { 
      title: randomJob.title, 
      baseSalary: randomJob.baseIncome || 3500,
      description: randomJob.description
    };
    
    const gameLifeStage: LifeStage = { 
      name: randomLifeStage.name, 
      baseExpenses: randomLifeStage.expenseRatio || 0.5,
      description: randomLifeStage.description,
      ageBracket: randomLifeStage.ageBracket
    };
    
    const gameCircumstances: string[] = randomCircumstances.map(c => 
      typeof c === 'string' ? c : c.name
    );
    
    const playerDetails = initializePlayerState(gameJob, gameLifeStage, gameCircumstances);
    
    const generatedDebts = initializeDebts(
      playerDetails.traits.financialKnowledge,
      randomLifeStage,
      randomCircumstances
    );
    
    const initializedBudget = initializeBudget(gameJob, gameLifeStage, randomCircumstances);
    
    initializeChallenges(playerDetails.traits);
    
    setMonthsPassed(0);
    setLastLevelSeen(1);
    setGameStarted(true);
    
    const background = generateCharacterBackground(randomJob, randomLifeStage, randomCircumstances);
    
    toast({
      title: "Your Financial Journey Begins!",
      description: `You're a ${randomLifeStage.name} ${randomJob.title} with ${randomCircumstances.length} life circumstances. Make payments to defeat your debt monsters!`,
      variant: "default",
    });

    if (setCharacterBackground) {
      setCharacterBackground(background);
    }
  };

  const resetGame = () => {
    resetGameState(
      resetPlayerState,
      resetDebtState,
      resetBudgetState,
      resetChallengeState,
      setMonthsPassed,
      setGameStarted,
      setCurrentLifeEvent
    );
  };

  const handleResolveLifeEvent = (optionIndex: number) => {
    originalResolveLifeEvent(optionIndex, updatePlayerTrait, playerTraits);
  };

  const value: GameContextType = {
    playerName,
    setPlayerName,
    avatar,
    setAvatar,
    cash,
    setCash,
    playerTraits,
    updatePlayerTrait,
    eventHistory,
    debts,
    addDebt,
    updateDebt,
    removeDebt,
    totalDebt,
    strategy,
    setStrategy,
    budget,
    updateBudget,
    applyBudgetPreset,
    currentLifeEvent,
    generateLifeEvent,
    resolveLifeEvent: handleResolveLifeEvent,
    challenges,
    updateChallenge,
    monthsPassed,
    advanceMonth,
    processMonthlyFinancials,
    damageMonster,
    specialMoves,
    setSpecialMoves,
    useSpecialMove,
    paymentStreak,
    initializeGame,
    resetGame,
    gameStarted,
    job: job || { title: 'Unemployed', baseSalary: 0 },
    lifeStage: lifeStage || { name: 'Adult', baseExpenses: 0.5 },
    circumstances: circumstances && circumstances.length > 0 
      ? circumstances.map(c => typeof c === 'string' ? c : (typeof c === 'object' && c !== null && 'name' in c ? c.name : ''))
      : [],
    characterBackground,
    purchaseItem
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
