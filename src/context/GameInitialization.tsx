
import { toast } from "@/hooks/use-toast";

// Function to initialize game with random character
export const initializeGameState = (
  resetGame: () => void,
  initializePlayerState: any,
  initializeDebts: any,
  initializeBudget: any,
  initializeChallenges: any,
  setMonthsPassed: any,
  setLastLevelSeen: any,
  setGameStarted: any,
  generateRandomCharacter: any,
  generateCharacterBackground: any
) => {
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

  return background;
};

// Function to reset game state
export const resetGameState = (
  resetPlayerState: () => void,
  resetDebtState: () => void,
  resetBudgetState: () => void,
  resetChallengeState: () => void,
  setMonthsPassed: (value: number) => void,
  setGameStarted: (value: boolean) => void,
  setCurrentLifeEvent: (value: null) => void
) => {
  resetPlayerState();
  resetDebtState();
  resetBudgetState();
  resetChallengeState();
  setMonthsPassed(0);
  setGameStarted(false);
  setCurrentLifeEvent(null);
};
