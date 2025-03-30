import { useState } from 'react';
import { Challenge, PlayerTraits } from '../types/gameTypes';
import { initialChallenges } from '../data/initialGameState';
import { toast } from "@/hooks/use-toast";

export const useChallengeState = (
  setCash: (fn: (prev: number) => number) => void,
  setSpecialMoves: (fn: (prev: number) => number) => void
) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lastChallengeUpdate, setLastChallengeUpdate] = useState<number>(Date.now());

  // Update challenge progress
  const updateChallenge = (id: string, progress: number) => {
    setChallenges(prevChallenges => prevChallenges.map(challenge => {
      if (challenge.id === id) {
        const newProgress = challenge.progress + progress;
        const completed = newProgress >= challenge.target;
        
        // Award rewards for completed challenges
        if (completed && !challenge.completed) {
          setCash(prev => prev + challenge.reward);
          setSpecialMoves(prev => prev + 1);
          
          toast({
            title: "Challenge Completed!",
            description: `${challenge.title}: +$${challenge.reward} cash and +1 Special Move!`,
            variant: "default",
          });
        }
        
        return {
          ...challenge,
          progress: newProgress,
          completed: completed
        };
      }
      return challenge;
    }));
  };

  // Rotate challenges every 3 days
  const rotateDailyChallenges = () => {
    // Only rotate if it's been at least 3 days since the last update
    const currentTime = Date.now();
    const daysSinceLastUpdate = (currentTime - lastChallengeUpdate) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastUpdate >= 3) {
      // Keep completed challenges, remove 2 oldest incomplete challenges
      const completedChallenges = challenges.filter(c => c.completed);
      const incompleteChallenges = challenges.filter(c => !c.completed);
      
      // Remove oldest 2 incomplete challenges (if available)
      const remainingChallenges = incompleteChallenges.slice(Math.min(2, incompleteChallenges.length));
      
      // Generate new challenges to replace them
      const newChallenges = generateRandomChallenges(2);
      
      // Combine all challenges
      setChallenges([...completedChallenges, ...remainingChallenges, ...newChallenges]);
      setLastChallengeUpdate(currentTime);
      
      toast({
        title: "New Daily Challenges!",
        description: "Check out your new challenges for more rewards.",
        variant: "default",
      });
    }
  };

  // Generate random challenges
  const generateRandomChallenges = (count: number): Challenge[] => {
    const possibleChallenges: Omit<Challenge, 'id'>[] = [
      {
        title: "Budget Guru",
        description: "Adjust your budget allocation",
        reward: 50,
        progress: 0,
        target: 1,
        completed: false
      },
      {
        title: "Debt Slayer",
        description: "Make an extra payment on any debt",
        reward: 75,
        progress: 0,
        target: 1,
        completed: false
      },
      {
        title: "Interest Hunter",
        description: "Reduce a debt's interest rate",
        reward: 100,
        progress: 0,
        target: 1,
        completed: false
      },
      {
        title: "Savings Boost",
        description: "Increase your savings amount",
        reward: 80,
        progress: 0,
        target: 1,
        completed: false
      },
      {
        title: "Strategy Switch",
        description: "Change your repayment strategy",
        reward: 60,
        progress: 0,
        target: 1,
        completed: false
      },
      {
        title: "Multiple Payments",
        description: "Make payments on different debts",
        reward: 120,
        progress: 0,
        target: 2,
        completed: false
      }
    ];

    return Array.from({ length: count }, (_, index) => {
      const randomIndex = Math.floor(Math.random() * possibleChallenges.length);
      const challenge = possibleChallenges[randomIndex];
      
      return {
        ...challenge,
        id: `random-${Date.now()}-${index}`
      };
    });
  };

  // Create personalized challenges based on player traits
  const generatePersonalizedChallenges = (playerTraits: PlayerTraits) => {
    const personalizedChallenges: Challenge[] = [...initialChallenges];
    
    // Add trait-specific challenges
    if (playerTraits.savingAbility > 6) {
      personalizedChallenges.push({
        id: 'save-expert',
        title: 'Savings Expert',
        description: 'Save $1000 total',
        reward: 300,
        progress: 0,
        target: 1000,
        completed: false
      });
    }
    
    if (playerTraits.riskTolerance > 7) {
      personalizedChallenges.push({
        id: 'risk-taker',
        title: 'Risk Taker',
        description: 'Make 5 risky financial decisions',
        reward: 250,
        progress: 0,
        target: 5,
        completed: false
      });
    }
    
    if (playerTraits.careerFocus > 6) {
      personalizedChallenges.push({
        id: 'career-focused',
        title: 'Career Climber',
        description: 'Increase monthly income by $500',
        reward: 200,
        progress: 0,
        target: 500,
        completed: false
      });
    }
    
    // Add daily random challenges
    const dailyChallenges = generateRandomChallenges(3);
    
    return [...personalizedChallenges, ...dailyChallenges];
  };

  // Initialize challenge state
  const initializeChallenges = (playerTraits: PlayerTraits) => {
    const personalizedChallenges = generatePersonalizedChallenges(playerTraits);
    setChallenges(personalizedChallenges);
    setLastChallengeUpdate(Date.now());
  };

  // Reset challenge state
  const resetChallengeState = () => {
    setChallenges([]);
    setLastChallengeUpdate(Date.now());
  };

  return {
    challenges,
    updateChallenge,
    generatePersonalizedChallenges,
    initializeChallenges,
    resetChallengeState,
    setChallenges,
    rotateDailyChallenges
  };
};
