
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
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Ensure player has enough cash
    if (cash < amount) {
      toast({
        title: "Not Enough Cash",
        description: "You don't have enough cash to make this payment.",
        variant: "default",
      });
      return;
    }
    
    // Calculate health reduction (percentage of current debt)
    const healthReduction = (amount / debt.amount) * 100;
    const newAmount = Math.max(0, debt.amount - amount);
    const newHealth = Math.max(0, debt.health - healthReduction);
    
    // Update the debt
    updateDebt(debtId, {
      amount: newAmount,
      health: newHealth
    });
    
    // Deduct payment from cash
    setCash(prev => prev - amount);
    
    // Update challenge progress for making a payment
    updateChallenge('1', 1);
    
    // If debt is paid off, remove it
    if (newAmount === 0) {
      removeDebt(debtId);
      
      // Improve financial knowledge
      updatePlayerTrait('financialKnowledge', playerTraits.financialKnowledge + 0.5);
    }
    
    toast({
      title: "Payment Made!",
      description: `You made a $${amount} payment on your ${debt.name}!`,
      variant: "default",
    });
  };

  // Wrapper for useSpecialMove that provides all necessary dependencies
  const handleUseSpecialMove = (debtId: string) => {
    // Check if player has special moves available
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves",
        description: "You don't have any special moves available.",
        variant: "default",
      });
      return;
    }
    
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Apply special move effects (reduce interest by 20%)
    const newInterest = Math.max(1, debt.interest * 0.8);
    
    // Update the debt
    updateDebt(debtId, {
      interest: newInterest
    });
    
    // Consume special move
    setSpecialMoves(prev => prev - 1);
    
    toast({
      title: "Special Move Used!",
      description: `You negotiated a lower interest rate on your ${debt.name}!`,
      variant: "default",
    });
  };

  // Wrapper for resolveLifeEvent that provides necessary dependencies
  const handleResolveLifeEvent = (optionIndex: number) => {
    resolveLifeEvent(optionIndex, updatePlayerTrait, playerTraits);
  };

  // Handle shop item purchases
  const handlePurchaseItem = (item: any) => {
    // Check if player has enough cash
    if (cash < item.cost) {
      return;
    }
    
    // Deduct cost
    setCash(prev => prev - item.cost);
    
    // Apply effects based on item type
    switch (item.effect.type) {
      case 'special_move':
        setSpecialMoves(prev => prev + item.effect.value);
        break;
        
      case 'interest_reduction':
        // Apply interest reduction to all debts
        setDebts(prevDebts => prevDebts.map(debt => ({
          ...debt,
          interest: Math.max(1, debt.interest - item.effect.value)
        })));
        break;
        
      case 'cash_boost':
        setCash(prev => prev + item.effect.value);
        break;
        
      case 'debt_reduction':
        // Find highest interest debt
        if (debts.length > 0) {
          const highestInterestDebt = [...debts].sort((a, b) => b.interest - a.interest)[0];
          const reductionAmount = Math.min(item.effect.value, highestInterestDebt.amount);
          const healthReduction = (reductionAmount / highestInterestDebt.amount) * 100;
          
          updateDebt(highestInterestDebt.id, {
            amount: Math.max(0, highestInterestDebt.amount - reductionAmount),
            health: Math.max(0, highestInterestDebt.health - healthReduction)
          });
        }
        break;
        
      case 'trait_boost':
        if (item.effect.trait) {
          updatePlayerTrait(
            item.effect.trait, 
            Math.min(10, playerTraits[item.effect.trait as keyof typeof playerTraits] as number + item.effect.value)
          );
        }
        break;
    }
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
    characterBackground,
    // Shop functionality
    purchaseItem: handlePurchaseItem
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
