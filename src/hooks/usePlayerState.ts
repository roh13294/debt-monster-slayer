
import { useState } from 'react';
import { PlayerTraits, Job, LifeStage } from '../types/gameTypes';
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
  
  // New state for character details
  const [job, setJob] = useState<Job | null>(null);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [circumstances, setCircumstances] = useState<string[]>([]);
  const [characterBackground, setCharacterBackground] = useState<string>('');

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
      determination: Math.floor(Math.random() * 4) + 3, // 3-6
      luckyStreak: Math.floor(Math.random() * 10) + 1, // 1-10
      discipline: Math.floor(Math.random() * 4) + 3, // 3-6
      courage: Math.floor(Math.random() * 4) + 3, // 3-6
      wisdom: Math.floor(Math.random() * 4) + 3 // 3-6
    };
  };

  // Update player traits based on circumstances
  const applyCircumstancesToTraits = (playerCircumstances: any[], baseTraits: PlayerTraits): PlayerTraits => {
    let updatedTraits = { ...baseTraits };
    
    playerCircumstances.forEach(circumstance => {
      if (typeof circumstance === 'object' && circumstance.effect && circumstance.effect.traits) {
        Object.entries(circumstance.effect.traits).forEach(([trait, modifier]) => {
          const traitKey = trait as keyof PlayerTraits;
          if (updatedTraits[traitKey] !== undefined && modifier !== undefined) {
            updatedTraits[traitKey] = Math.max(1, Math.min(10, updatedTraits[traitKey] + (modifier as number)));
          }
        });
      }
    });
    
    return updatedTraits;
  };

  // Set character details
  const setCharacterDetails = (
    jobData: Job, 
    lifeStageData: LifeStage, 
    circumstancesData: string[]
  ) => {
    setJob(jobData);
    setLifeStage(lifeStageData);
    setCircumstances(circumstancesData);
    
    // Generate and set character background description
    if (jobData && lifeStageData) {
      const background = `You are a ${lifeStageData.name} ${lifeStageData.ageBracket ? `(${lifeStageData.ageBracket})` : ''} working as a ${jobData.title}. ${
        jobData.description || ''
      } ${lifeStageData.description || ''} ${circumstancesData.join(' ')}`;
      setCharacterBackground(background);
    }
  };

  // Initialize player state with character details
  const initializePlayerState = (
    initialJob: Job,
    initialLifeStage: LifeStage,
    initialCircumstances: string[]
  ) => {
    let initialTraits = generateInitialPlayerTraits();
    
    // Apply circumstance trait modifications if provided
    const circumstanceObjects = initialCircumstances.length > 0 && typeof initialCircumstances[0] === 'object' 
      ? initialCircumstances 
      : [];
    
    if (circumstanceObjects.length > 0) {
      initialTraits = applyCircumstancesToTraits(circumstanceObjects, initialTraits);
    }
    
    setPlayerTraits(initialTraits);
    setSpecialMoves(1); // Start with one special move
    setPaymentStreak(0);
    setEventHistory([]);
    
    // Set character details
    setCharacterDetails(initialJob, initialLifeStage, initialCircumstances);
    
    // Adjust initial cash based on life stage and circumstances if provided
    let startingCash = 2000;
    if (initialLifeStage?.modifier?.startingCash) {
      startingCash = initialLifeStage.modifier.startingCash;
    }
    
    // Apply circumstance cash modifiers if we have objects with effect.cash
    if (circumstanceObjects.length > 0) {
      circumstanceObjects.forEach((circumstance: any) => {
        if (circumstance.effect?.cash) {
          startingCash += circumstance.effect.cash;
        }
      });
    }
    
    // Further adjust based on saving ability if not overridden
    if (!initialLifeStage.modifier && circumstanceObjects.length === 0) {
      if (initialTraits.savingAbility > 6) {
        startingCash = 2500; // Better savers start with more cash
      } else if (initialTraits.savingAbility < 4) {
        startingCash = 1500; // Poorer savers start with less cash
      }
    }
    
    setCash(startingCash);

    return {
      traits: initialTraits,
      job: initialJob,
      lifeStage: initialLifeStage,
      circumstances: initialCircumstances
    };
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
    setJob(null);
    setLifeStage(null);
    setCircumstances([]);
    setCharacterBackground('');
  };

  return {
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
  };
};
