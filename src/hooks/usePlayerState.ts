
import { useState } from 'react';
import { PlayerTraits } from '../types/gameTypes';
import { initialPlayerTraits } from '../data/initialGameState';
import { toast } from "@/hooks/use-toast";
import { JobType, LifeStage, Circumstance } from '../hooks/useRandomCharacter';

export const usePlayerState = () => {
  const [playerName, setPlayerName] = useState<string>('Player');
  const [avatar, setAvatar] = useState<string>('default');
  const [cash, setCash] = useState<number>(2000);
  const [playerTraits, setPlayerTraits] = useState<PlayerTraits>(initialPlayerTraits);
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const [specialMoves, setSpecialMoves] = useState<number>(0);
  const [paymentStreak, setPaymentStreak] = useState<number>(0);
  
  // New state for character details
  const [job, setJob] = useState<JobType | null>(null);
  const [lifeStage, setLifeStage] = useState<LifeStage | null>(null);
  const [circumstances, setCircumstances] = useState<Circumstance[]>([]);
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
  const applyCircumstancesToTraits = (playerCircumstances: Circumstance[], baseTraits: PlayerTraits): PlayerTraits => {
    let updatedTraits = { ...baseTraits };
    
    playerCircumstances.forEach(circumstance => {
      if (circumstance.effect.traits) {
        Object.entries(circumstance.effect.traits).forEach(([trait, modifier]) => {
          const traitKey = trait as keyof PlayerTraits;
          if (updatedTraits[traitKey] !== undefined && modifier !== undefined) {
            updatedTraits[traitKey] = Math.max(1, Math.min(10, updatedTraits[traitKey] + modifier));
          }
        });
      }
    });
    
    return updatedTraits;
  };

  // Set character details
  const setCharacterDetails = (
    jobData: JobType | null, 
    lifeStageData: LifeStage | null, 
    circumstancesData: Circumstance[]
  ) => {
    setJob(jobData);
    setLifeStage(lifeStageData);
    setCircumstances(circumstancesData);
    
    // Generate and set character background description
    if (jobData && lifeStageData) {
      const background = `You are a ${lifeStageData.name} (${lifeStageData.ageBracket}) working as a ${jobData.title}. ${
        circumstancesData.map(c => c.description).join(' ')
      }`;
      setCharacterBackground(background);
    }
  };

  // Initialize player state with character details
  const initializePlayerState = (
    initialJob?: JobType | null,
    initialLifeStage?: LifeStage | null,
    initialCircumstances?: Circumstance[]
  ) => {
    let initialTraits = generateInitialPlayerTraits();
    
    // Apply circumstance trait modifications if provided
    if (initialCircumstances && initialCircumstances.length > 0) {
      initialTraits = applyCircumstancesToTraits(initialCircumstances, initialTraits);
    }
    
    setPlayerTraits(initialTraits);
    setSpecialMoves(1); // Start with one special move
    setPaymentStreak(0);
    setEventHistory([]);
    
    // Set character details if provided
    if (initialJob && initialLifeStage && initialCircumstances) {
      setCharacterDetails(initialJob, initialLifeStage, initialCircumstances);
    }
    
    // Adjust initial cash based on life stage and circumstances if provided
    let startingCash = 2000;
    if (initialLifeStage?.modifier?.startingCash) {
      startingCash = initialLifeStage.modifier.startingCash;
    }
    
    // Apply circumstance cash modifiers
    if (initialCircumstances) {
      initialCircumstances.forEach(circumstance => {
        if (circumstance.effect?.cash) {
          startingCash += circumstance.effect.cash;
        }
      });
    }
    
    // Further adjust based on saving ability if not overridden
    if (!initialLifeStage && !initialCircumstances) {
      if (initialTraits.savingAbility > 6) {
        startingCash = 2500; // Better savers start with more cash
      } else if (initialTraits.savingAbility < 4) {
        startingCash = 1500; // Poorer savers start with less cash
      }
    }
    
    setCash(startingCash);

    return {
      traits: initialTraits,
      job: initialJob || null,
      lifeStage: initialLifeStage || null,
      circumstances: initialCircumstances || []
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
