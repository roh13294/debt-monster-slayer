
import { useState, useEffect } from 'react';
import { ShadowFormType } from '../types/gameTypes';
import { toast } from "@/hooks/use-toast";

export const useShadowFormState = () => {
  const [shadowForm, setShadowForm] = useState<ShadowFormType>(null);
  const [corruptionLevel, setCorruptionLevel] = useState<number>(0);
  const [isCorruptionUnstable, setIsCorruptionUnstable] = useState<boolean>(false);
  const [cutsceneShown, setCutsceneShown] = useState<{
    choice: boolean;
    max: boolean;
    redemption: boolean;
  }>({
    choice: false,
    max: false,
    redemption: false,
  });
  
  // Check for shadow form eligibility
  const checkShadowFormEligibility = (
    monthsPassed: number, 
    totalDebt: number, 
    missedPayments: number,
    demonStress: number = 0
  ): boolean => {
    // Already has shadow form
    if (shadowForm !== null) return false;
    
    // Trigger shadow form at month 3
    if (monthsPassed >= 3) return true;
    
    // Trigger shadow form if debt > $15,000 and 2+ missed payments
    if (totalDebt > 15000 && missedPayments >= 2) return true;
    
    // Trigger shadow form if demon stress exceeds 75%
    if (demonStress >= 75) return true;
    
    // Trigger shadow form if corruption level > 30
    if (corruptionLevel > 30) return true;
    
    return false;
  };
  
  // Update shadow form
  const updateShadowForm = (form: ShadowFormType, corruption: number = corruptionLevel) => {
    setShadowForm(form);
    setCorruptionLevel(corruption);
    
    if (form === null && corruption === 0) {
      // Reset corruption unstable state
      setIsCorruptionUnstable(false);
      
      // Allow to show cutscenes again in the future
      setCutsceneShown(prev => ({
        ...prev,
        choice: false
      }));
    } else if (!cutsceneShown.choice) {
      // Mark choice cutscene as shown
      setCutsceneShown(prev => ({
        ...prev,
        choice: true
      }));
    }
    
    // Special form setup effects
    if (form) {
      // Create a dark impact sound effect
      const audio = new Audio('/sounds/shadow-embrace.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback error:", e));
      
      // Add a form-specific glitch effect to the UI (in a real game)
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('shadow-transition');
        setTimeout(() => body.classList.remove('shadow-transition'), 2000);
      }
    }
  };
  
  // Increase corruption
  const increaseCorruption = (amount: number) => {
    if (shadowForm === null) return;
    
    const newLevel = Math.min(100, corruptionLevel + amount);
    setCorruptionLevel(newLevel);
    
    // Check if reaching max corruption for the first time
    if (newLevel >= 100 && !isCorruptionUnstable && !cutsceneShown.max) {
      setIsCorruptionUnstable(true);
      setCutsceneShown(prev => ({
        ...prev,
        max: true
      }));
      
      toast({
        title: "Corruption Overload!",
        description: "The shadow has consumed you! Your powers are at their peak, but at a terrible cost...",
        variant: "destructive",
      });
      
      // Create a corruption overload sound effect
      const audio = new Audio('/sounds/corruption-max.mp3');
      audio.volume = 0.7;
      audio.play().catch(e => console.error("Audio playback error:", e));
      
      // Trigger a UI effect for max corruption
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('corruption-overload');
        setTimeout(() => body.classList.remove('corruption-overload'), 3000);
      }
    } else if (newLevel >= 75 && newLevel < 100) {
      // Warning at high corruption
      if (Math.floor(newLevel / 5) !== Math.floor((newLevel - amount) / 5)) {
        toast({
          title: "Corruption Rising",
          description: "The shadow's influence grows stronger. Your powers increase, but at what cost?",
          variant: "default",
        });
      }
    }
  };
  
  // Decrease corruption
  const decreaseCorruption = (amount: number) => {
    if (shadowForm === null) return;
    
    const newLevel = Math.max(0, corruptionLevel - amount);
    setCorruptionLevel(newLevel);
    
    // Check if coming back from unstable state
    if (corruptionLevel >= 100 && newLevel < 100) {
      setIsCorruptionUnstable(false);
      
      toast({
        title: "Control Regained",
        description: "You've pulled back from the brink of total corruption. The shadows still linger, but you are in control once more.",
        variant: "default",
      });
    }
    
    // Check for redemption
    if (corruptionLevel > 0 && newLevel === 0 && !cutsceneShown.redemption) {
      setCutsceneShown(prev => ({
        ...prev,
        redemption: true
      }));
      
      toast({
        title: "Path to Redemption",
        description: "You've resisted the shadow's influence completely! Though your powers diminish, your spirit grows stronger.",
        variant: "default",
      });
      
      // Create a redemption sound effect
      const audio = new Audio('/sounds/redemption.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback error:", e));
    }
  };
  
  // Get shadow form benefits
  const getShadowFormBenefits = () => {
    switch(shadowForm) {
      case 'cursedBlade':
        return {
          attackMultiplier: 1.5,
          interestReduction: 0.5,
          savingsLoss: 0.1,
          corruptionPerBattle: 5
        };
      
      case 'leecher':
        return {
          killReward: true,
          doublePaymentChance: 0.25,
          canSave: false,
          passiveCorruption: 10
        };
      
      case 'whisperer':
        return {
          previewEvents: 2,
          xpGainBonus: 0.3,
          specialMoveRegen: 0,
          combatXpReduction: 0.5
        };
        
      default:
        return null;
    }
  };
  
  return {
    shadowForm,
    corruptionLevel,
    isCorruptionUnstable,
    updateShadowForm,
    increaseCorruption,
    decreaseCorruption,
    checkShadowFormEligibility,
    getShadowFormBenefits
  };
};
