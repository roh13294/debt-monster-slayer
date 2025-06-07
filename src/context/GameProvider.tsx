
import React, { useState } from 'react';
import { usePlayerState } from '../hooks/usePlayerState';
import { useDebtState } from '../hooks/useDebtState';
import { useBudgetState } from '../hooks/useBudgetState';
import { useChallengeState } from '../hooks/useChallengeState';
import { useLifeEventState } from '../hooks/useLifeEventState';
import { useGameProgress } from '../hooks/useGameProgress';
import { useRandomCharacter } from '../hooks/useRandomCharacter';
import { GameContextType, Strategy, BudgetPreset, ShopItem, Challenge, Job, LifeStage, PlayerTraits, ShadowFormType, SpecialMove } from '../types/gameTypes';
import { useBattleActions } from '../hooks/useBattleActions';
import { useShopActions } from '../hooks/useShopActions';
import { useEventResolver } from '../hooks/useEventResolver';
import { useShadowFormState } from '../hooks/useShadowFormState';
import { useBreathingState } from '../hooks/useBreathingState';
import { useWealthTempleState } from '../hooks/useWealthTempleState';
import { usePlayerLevelState } from '../hooks/usePlayerLevelState';
import { useDemonCoins } from '../hooks/useDemonCoins';
import { usePowerUps } from '../hooks/usePowerUps';
import { GameContext } from './GameContextTypes';
import { initializeGameState, resetGameState } from './GameInitialization';
import { toast } from "@/hooks/use-toast";
import { gameTerms } from '@/utils/gameTerms';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    playerName, setPlayerName,
    avatar, setAvatar,
    cash, setCash,
    playerTraits, updatePlayerTrait,
    specialMoves, setSpecialMoves,
    paymentStreak, setPaymentStreak,
    eventHistory, setEventHistory,
    job, lifeStage, circumstances,
    characterBackground,
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
    updateBudget: originalUpdateBudget,
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
    originalUpdateBudget,
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

  const {
    playerXP,
    playerLevel,
    playerTitle,
    playerPerk,
    gainXP,
    getXPThreshold,
    getNextTitle,
    initPlayerLevelState,
    resetPlayerLevelState
  } = usePlayerLevelState();

  const { damageMonster, useSpecialMove: originalUseSpecialMove } = useBattleActions({
    cash,
    setCash,
    updateDebt,
    removeDebt,
    updateChallenge: (id: string, updates: Partial<Challenge>) => updateChallenge(id, updates),
    updatePlayerTrait,
    playerTraits,
    debts,
    specialMoves: Array.isArray(specialMoves) ? specialMoves : [],
    setSpecialMoves,
    gainXP
  });

  const { purchaseItem: originalPurchaseItem } = useShopActions({
    cash,
    setCash,
    setSpecialMoves,
    setDebts,
    updateDebt,
    updatePlayerTrait,
    playerTraits,
    debts
  });

  const {
    shadowForm,
    corruptionLevel,
    isCorruptionUnstable,
    updateShadowForm,
    increaseCorruption,
    decreaseCorruption,
    checkShadowFormEligibility
  } = useShadowFormState();

  const {
    breathingXP,
    unlockedSkills,
    addBreathingXP,
    unlockSkill,
    isSkillUnlocked,
    resetBreathingSkills
  } = useBreathingState();

  const {
    templeLevel,
    relics,
    relicSlots,
    equippedRelics,
    getTemplePassiveReturnRate,
    calculateMonthlyTempleReturn,
    upgradeTemple: originalUpgradeTemple,
    acquireRelic,
    equipRelic,
    unequipRelic
  } = useWealthTempleState();

  const {
    balance: demonCoinBalance,
    earnDemonCoins,
    spendDemonCoins,
    addBonusCoins,
    transactions: coinTransactions
  } = useDemonCoins(cash);

  const {
    inventory: powerUpInventory,
    purchasePowerUp,
    activatePowerUp,
    getActivePowerUps,
    getPowerUpMultiplier
  } = usePowerUps();

  const enhancedSetCash = (value: number | ((prev: number) => number)) => {
    setCash(value);
  };

  // Wrapper functions to match expected signatures
  const updateBudget = (category: keyof typeof budget, amount: number) => {
    originalUpdateBudget({ [category]: amount });
  };

  const useSpecialMove = (moveId: string, debtId: string): boolean => {
    if (Array.isArray(specialMoves) && specialMoves.length > 0) {
      originalUseSpecialMove(debtId);
      return true;
    }
    return false;
  };

  const purchaseItem = (item: ShopItem): boolean => {
    originalPurchaseItem(item);
    return true;
  };

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
    
    if (shadowForm) {
      switch (shadowForm) {
        case 'cursedBlade':
          stanceMultipliers.debtPaymentMultiplier *= 1.5;
          increaseCorruption(5);
          break;
        case 'leecher':
          stanceMultipliers.savingsMultiplier = 0;
          increaseCorruption(3);
          break;
        case 'whisperer':
          increaseCorruption(2);
          break;
      }
    }
    
    if (isCorruptionUnstable) {
      stanceMultipliers.expensesMultiplier = 1.5;
      increaseCorruption(1);
    } else {
      const templeReturn = calculateMonthlyTempleReturn(cash, shadowForm !== null);
      if (templeReturn > 0) {
        setCash(prev => prev + templeReturn);
        toast({
          title: "Temple Returns",
          description: `Your Wealth Temple generated ${templeReturn} DemonCoins in passive returns!`,
          variant: "default",
        });
      }
    }

    const coinBoostMultiplier = getPowerUpMultiplier('coin_boost');
    const xpBoostMultiplier = getPowerUpMultiplier('xp_boost');
    const damageBoostMultiplier = getPowerUpMultiplier('damage_boost');

    // Calculate effective debt payment before using it
    const totalDebtPayment = Math.floor(budget.debtPayment * stanceMultipliers.debtPaymentMultiplier);
    const effectiveDebtPayment = Math.min(totalDebtPayment, totalDebt);

    if (effectiveDebtPayment > 0) {
      earnDemonCoins(
        { type: 'debt_payment', baseAmount: Math.floor(effectiveDebtPayment / 10), multiplier: coinBoostMultiplier },
        'Monthly debt payment'
      );
    }
    
    originalProcessMonthlyFinancials(stanceMultipliers);
    
    if (shadowForm && corruptionLevel < 100) {
      decreaseCorruption(1);
    }
    
    addBreathingXP(1);
  };

  const enhancedDamageMonster = (debtId: string, damage: number) => {
    const damageMultiplier = getPowerUpMultiplier('damage_boost');
    const enhancedDamage = Math.floor(damage * damageMultiplier);
    
    damageMonster(debtId, enhancedDamage);
    
    earnDemonCoins(
      { type: 'monster_defeat', baseAmount: Math.floor(enhancedDamage / 5) },
      'Monster damage dealt'
    );
  };

  const enhancedGainXP = (amount: number) => {
    const xpMultiplier = getPowerUpMultiplier('xp_boost');
    const enhancedXP = Math.floor(amount * xpMultiplier);
    gainXP(enhancedXP);
  };

  const upgradeTemple = (upgradeCost: number) => {
    if (cash < upgradeCost) {
      toast({
        title: "Not Enough DemonCoins",
        description: "You don't have enough DemonCoins to upgrade your temple.",
        variant: "destructive",
      });
      return false;
    }
    
    const result = originalUpgradeTemple(cash, upgradeCost);
    if (result !== false) {
      setCash(prev => prev - upgradeCost);
      return true;
    }
    return false;
  };

  const calculateTempleReturn = (hasShadowPenalty: boolean = shadowForm !== null) => {
    return calculateMonthlyTempleReturn(cash, hasShadowPenalty);
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
      typeof c === 'string' ? c : (c && typeof c === 'object' && 'name' in c ? c.name : '')
    ).filter(Boolean);
    
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
      title: "Your Slayer Journey Begins!",
      description: `You're a ${randomLifeStage.name} ${randomJob.title} with ${randomCircumstances.length} unique traits. Defeat the demons that haunt your path!`,
      variant: "default",
    });

    if (setCharacterBackground) {
      setCharacterBackground(background);
    }
    
    initPlayerLevelState();
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
    
    resetPlayerLevelState();
  };

  const handleResolveLifeEvent = (optionIndex: number) => {
    originalResolveLifeEvent(optionIndex, updatePlayerTrait, playerTraits);
  };

  const safeCircumstances = circumstances || [];
  const formattedCircumstances = safeCircumstances.map((c: any) => {
    if (typeof c === 'string') {
      return c;
    } else if (c && typeof c === 'object' && 'name' in c) {
      return c.name;
    }
    return '';
  }).filter(Boolean);

  const value: GameContextType = {
    playerName,
    setPlayerName,
    avatar,
    setAvatar,
    cash,
    setCash: enhancedSetCash,
    playerTraits,
    updatePlayerTrait,
    eventHistory: [],
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
    damageMonster: enhancedDamageMonster,
    specialMoves: Array.isArray(specialMoves) ? specialMoves : [],
    setSpecialMoves: (moves: SpecialMove[]) => setSpecialMoves(moves),
    useSpecialMove,
    paymentStreak,
    initializeGame,
    resetGame,
    gameStarted,
    job: job || { title: 'Unemployed', baseSalary: 0 },
    lifeStage: lifeStage || { name: 'Adult', baseExpenses: 0.5 },
    circumstances: formattedCircumstances,
    characterBackground,
    purchaseItem,
    
    shadowForm,
    corruptionLevel,
    updateShadowForm,
    increaseCorruption,
    decreaseCorruption,
    isCorruptionUnstable,
    
    breathingXP,
    addBreathingXP,
    
    templeLevel,
    upgradeTemple,
    calculateTempleReturn,
    
    playerXP,
    gainXP: enhancedGainXP,
    playerLevel,
    playerTitle,
    playerPerk,
    getXPThreshold,
    getNextTitle,
    demonCoinBalance,
    earnDemonCoins,
    spendDemonCoins,
    addBonusCoins,
    coinTransactions,
    powerUpInventory,
    purchasePowerUp,
    activatePowerUp,
    getActivePowerUps,
    getPowerUpMultiplier,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
