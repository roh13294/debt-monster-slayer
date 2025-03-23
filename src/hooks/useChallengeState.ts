
import { useState } from 'react';
import { Challenge, PlayerTraits } from '../types/gameTypes';
import { initialChallenges } from '../data/initialGameState';
import { toast } from "@/hooks/use-toast";

export const useChallengeState = (
  setCash: (fn: (prev: number) => number) => void,
  setSpecialMoves: (fn: (prev: number) => number) => void
) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

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
    
    return personalizedChallenges;
  };

  // Initialize challenge state
  const initializeChallenges = (playerTraits: PlayerTraits) => {
    setChallenges(initialChallenges);
  };

  // Reset challenge state
  const resetChallengeState = () => {
    setChallenges([]);
  };

  return {
    challenges,
    updateChallenge,
    generatePersonalizedChallenges,
    initializeChallenges,
    resetChallengeState,
    setChallenges
  };
};
