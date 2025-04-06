
import React, { useState } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useDebtState } from '../hooks/useDebtState';
import { useBudgetState } from '../hooks/useBudgetState';
import { useChallengeState } from '../hooks/useChallengeState';
import { useLifeEventState } from '../hooks/useLifeEventState';
import { useGameProgress } from '../hooks/useGameProgress';
import { useRandomCharacter } from '../hooks/useRandomCharacter';
import { GameContextType } from '../types/gameTypes';
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
    processMonthlyFinancials,
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
    processMonthlyFinancials
  });

  // Initialize game with random character
  const initializeGame = () => {
    const background = initializeGameState(
      resetGame,
      initializePlayerState,
      initializeDebts,
      initializeBudget,
      initializeChallenges,
      setMonthsPassed,
      setLastLevelSeen,
      setGameStarted,
      generateRandomCharacter,
      generateCharacterBackground
    );
    
    setCharacterBackground(background);
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
    resolveLifeEvent(optionIndex, () => originalResolveLifeEvent(optionIndex));
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
