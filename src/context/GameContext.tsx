
import React, { createContext, useContext } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useDebtState } from '../hooks/useDebtState';
import { useBudgetState } from '../hooks/useBudgetState';
import { useChallengeState } from '../hooks/useChallengeState';
import { useLifeEventState } from '../hooks/useLifeEventState';
import { useGameProgress } from '../hooks/useGameProgress';
import { useRandomCharacter } from '../hooks/useRandomCharacter';
import { GameContextType } from '../types/gameTypes';
import { toast } from "@/hooks/use-toast";

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

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
    resolveLifeEvent
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

  // Initialize game with random character
  const initializeGame = () => {
    // Reset all state first
    resetGame();
    
    // Generate random character details
    const { job: randomJob, lifeStage: randomLifeStage, circumstances: randomCircumstances } = generateRandomCharacter();
    
    // Initialize player with random traits and character details
    const playerDetails = initializePlayerState(randomJob, randomLifeStage, randomCircumstances);
    
    // Initialize debts based on character circumstances
    const generatedDebts = initializeDebts(
      playerDetails.traits.financialKnowledge,
      randomLifeStage,
      randomCircumstances
    );
    
    // Initialize budget based on job, life stage and circumstances
    const initializedBudget = initializeBudget(randomJob, randomLifeStage, randomCircumstances);
    
    // Initialize challenges
    initializeChallenges(playerDetails.traits);
    
    // Set initial game state
    setMonthsPassed(0);
    setLastLevelSeen(1);
    setGameStarted(true);
    
    // Generate character background story
    const background = generateCharacterBackground(randomJob, randomLifeStage, randomCircumstances);
    
    // Show welcome message with character details
    toast({
      title: "Your Financial Journey Begins!",
      description: `You're a ${randomLifeStage.name} ${randomJob.title} with ${randomCircumstances.length} life circumstances. Make payments to defeat your debt monsters!`,
      variant: "default",
    });
  };

  // Reset game
  const resetGame = () => {
    resetPlayerState();
    resetDebtState();
    resetBudgetState();
    resetChallengeState();
    setMonthsPassed(0);
    setGameStarted(false);
    setCurrentLifeEvent(null);
  };

  // Wrapper for damageMonster that provides all necessary dependencies
  const handleDamageMonster = (debtId: string, amount: number) => {
    useDebtState(setCash).damageMonster(
      debtId,
      amount,
      cash,
      updateChallenge,
      updatePlayerTrait,
      playerTraits
    );
  };

  // Wrapper for useSpecialMove that provides all necessary dependencies
  const handleUseSpecialMove = (debtId: string) => {
    useDebtState(setCash).useSpecialMove(
      debtId,
      specialMoves,
      setSpecialMoves
    );
  };

  // Wrapper for resolveLifeEvent that provides necessary dependencies
  const handleResolveLifeEvent = (optionIndex: number) => {
    resolveLifeEvent(optionIndex, updatePlayerTrait, playerTraits);
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
    damageMonster: handleDamageMonster,
    specialMoves,
    useSpecialMove: handleUseSpecialMove,
    paymentStreak,
    initializeGame,
    resetGame,
    gameStarted,
    // New character properties
    job,
    lifeStage,
    circumstances,
    characterBackground
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
