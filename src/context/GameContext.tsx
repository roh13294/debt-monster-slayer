
import React, { createContext, useContext } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useDebtState } from '../hooks/useDebtState';
import { useBudgetState } from '../hooks/useBudgetState';
import { useChallengeState } from '../hooks/useChallengeState';
import { useLifeEventState } from '../hooks/useLifeEventState';
import { useGameProgress } from '../hooks/useGameProgress';
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
    initializePlayerState,
    resetPlayerState
  } = usePlayerState();

  // Debt state
  const {
    debts,
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
    setCurrentLifeEvent
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
    setDebts => {
      const updatedDebts = setDebts(debts);
      return updatedDebts;
    },
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

  // Initialize game
  const initializeGame = () => {
    // Reset all state first
    resetGame();
    
    // Initialize player with random traits
    const initialTraits = initializePlayerState();
    
    // Initialize debts based on financial knowledge
    initializeDebts(initialTraits.financialKnowledge);
    
    // Initialize challenges
    initializeChallenges(initialTraits);
    
    // Reset budget to initial values
    resetBudgetState();
    
    // Set initial game state
    setMonthsPassed(0);
    setLastLevelSeen(1);
    setGameStarted(true);
    
    toast({
      title: "Game Started!",
      description: "Welcome to Debt Monster Slayer! Make payments to defeat your debt monsters.",
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
    useLifeEventState(
      setEventHistory,
      setCash,
      updateBudget,
      addDebt,
      updateDebt,
      debts,
      budget
    ).resolveLifeEvent(
      optionIndex,
      updatePlayerTrait,
      playerTraits
    );
  };

  // Context value
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
    gameStarted
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
