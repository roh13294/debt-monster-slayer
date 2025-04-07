
import React, { useState } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useDebtState } from '../hooks/useDebtState';
import { useBudgetState } from '../hooks/useBudgetState';
import { useChallengeState } from '../hooks/useChallengeState';
import { useLifeEventState } from '../hooks/useLifeEventState';
import { useGameProgress } from '../hooks/useGameProgress';
import { useRandomCharacter } from '../hooks/useRandomCharacter';
import { GameContextType, Strategy, BudgetPreset, ShopItem, Challenge } from '../types/gameTypes';
import { useBattleActions } from '../hooks/useBattleActions';
import { useShopActions } from '../hooks/useShopActions';
import { useEventResolver } from '../hooks/useEventResolver';
import { GameContext } from './GameContextTypes';
import { initializeGameState, resetGameState } from './GameInitialization';

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Player state
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

  // Character generation
  const {
    generateRandomCharacter,
    calculateAdjustedIncome,
    calculateBaseExpenses,
    calculateStartingCash,
    generateCharacterBackground
  } = useRandomCharacter();

  // Debt state
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

  // Budget state
  const {
    budget,
    updateBudget,
    initializeBudget,
    applyBudgetPreset,
    resetBudgetState
  } = useBudgetState(updatePlayerTrait, playerTraits);

  // Challenge state
  const {
    challenges,
    updateChallenge,
    generatePersonalizedChallenges,
    initializeChallenges,
    resetChallengeState,
    setChallenges
  } = useChallengeState(setCash, setSpecialMoves);

  // Life event state
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

  // Game progress
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
    generatePersonalizedChallenges
  );

  // Battle actions
  const { damageMonster, useSpecialMove } = useBattleActions({
    cash,
    setCash,
    updateDebt,
    removeDebt,
    updateChallenge,
    updatePlayerTrait,
    playerTraits,
    debts,
    specialMoves,
    setSpecialMoves
  });

  // Shop actions
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

  // Event resolver
  const { resolveLifeEvent } = useEventResolver({
    updatePlayerTrait,
    playerTraits,
    processMonthlyFinancials: originalProcessMonthlyFinancials
  });

  // Modified processMonthlyFinancials to accept stance parameter
  const processMonthlyFinancials = (stance?: string | null) => {
    let stanceMultipliers = {
      debtPaymentMultiplier: 1,
      savingsMultiplier: 1,
      incomeMultiplier: 1,
      expensesMultiplier: 1
    };
    
    // Apply stance effects if provided
    if (stance) {
      switch (stance) {
        case 'aggressive':
          stanceMultipliers.debtPaymentMultiplier = 1.15; // 15% more effective debt payments
          break;
        case 'defensive':
          stanceMultipliers.savingsMultiplier = 1.05; // 5% more savings
          stanceMultipliers.debtPaymentMultiplier = 0.95; // 5% less debt payment
          break;
        case 'risky':
          // Random outcome for risky stance
          const riskRoll = Math.random();
          if (riskRoll < 0.25) {
            // Big success
            stanceMultipliers.incomeMultiplier = 1.3; // 30% more income
            stanceMultipliers.debtPaymentMultiplier = 1.1; // 10% more effective debt payments
          } else if (riskRoll < 0.65) {
            // Moderate success
            stanceMultipliers.incomeMultiplier = 1.15; // 15% more income
          } else if (riskRoll < 0.9) {
            // Break even - no changes
          } else {
            // Loss
            stanceMultipliers.incomeMultiplier = 0.85; // 15% less income
            stanceMultipliers.debtPaymentMultiplier = 0.95; // 5% less effective debt payments
          }
          break;
      }
    }
    
    // Call original with stance multipliers
    originalProcessMonthlyFinancials(stanceMultipliers);
  };

  // Initialize game with random character
  const initializeGame = () => {
    const background = initializeGameState(
      resetGame,
      initializePlayerState,
      initializeDebts,
      initializeBudget,
      (traits) => initializeChallenges(traits),
      setMonthsPassed,
      setLastLevelSeen,
      setGameStarted,
      generateRandomCharacter,
      generateCharacterBackground
    );
    
    if (setCharacterBackground) {
      setCharacterBackground(background);
    }
  };

  // Reset game
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

  // Handle resolving life events with the new resolver
  const handleResolveLifeEvent = (optionIndex: number) => {
    originalResolveLifeEvent(optionIndex, updatePlayerTrait, playerTraits);
  };

  // Context value with character details
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
    job,
    lifeStage,
    circumstances,
    characterBackground,
    purchaseItem
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
