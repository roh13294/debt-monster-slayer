
import { useState } from 'react';
import { PlayerTraits } from '../types/gameTypes';
import { initialPlayerTraits } from '../data/initialGameState';
import { toast } from "@/hooks/use-toast";

export const usePlayerState = () => {
  const [playerName, setPlayerName] = useState<string>('Player');
  const [avatar, setAvatar] = useState<string>('default');
  const [cash, setCash] = useState<number>(2000);
  const [playerTraits, setPlayerTraits] = useState<PlayerTraits>(initialPlayerTraits);
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const [specialMoves, setSpecialMoves] = useState<number>(0);
  const [paymentStreak, setPaymentStreak] = useState<number>(0);

  // Update a player trait
  const updatePlayerTrait = (trait: keyof PlayerTraits, value: number) => {
    setPlayerTraits(prev => ({
      ...prev,
      [trait]: Math.max(1, Math.min(10, value)) // Ensure value is between 1-10
    }));
  };

  // Generate initial player traits with some randomness
  const generateInitialPlayerTraits = (): PlayerTraits => {
    return {
      riskTolerance: Math.floor(Math.random() * 4) + 3, // 3-6
      financialKnowledge: Math.floor(Math.random() * 4) + 3, // 3-6
      spendingHabits: Math.floor(Math.random() * 4) + 3, // 3-6
      careerFocus: Math.floor(Math.random() * 4) + 3, // 3-6
      savingAbility: Math.floor(Math.random() * 4) + 3, // 3-6
      luckyStreak: Math.floor(Math.random() * 10) + 1 // 1-10
    };
  };

  // Initialize player state
  const initializePlayerState = () => {
    const initialTraits = generateInitialPlayerTraits();
    setPlayerTraits(initialTraits);
    setSpecialMoves(1); // Start with one special move
    setPaymentStreak(0);
    setEventHistory([]);

    // Adjust initial cash based on traits
    if (initialTraits.savingAbility > 6) {
      setCash(2500); // Better savers start with more cash
    } else if (initialTraits.savingAbility < 4) {
      setCash(1500); // Poorer savers start with less cash
    } else {
      setCash(2000); // Default
    }

    return initialTraits; // Return for use in other initializations
  };

  // Reset player state
  const resetPlayerState = () => {
    setPlayerName('Player');
    setAvatar('default');
    setCash(0);
    setPlayerTraits(initialPlayerTraits);
    setEventHistory([]);
    setSpecialMoves(0);
    setPaymentStreak(0);
  };

  return {
    playerName, setPlayerName,
    avatar, setAvatar,
    cash, setCash,
    playerTraits, updatePlayerTrait,
    specialMoves, setSpecialMoves,
    paymentStreak, setPaymentStreak,
    eventHistory, setEventHistory,
    initializePlayerState,
    resetPlayerState
  };
};
