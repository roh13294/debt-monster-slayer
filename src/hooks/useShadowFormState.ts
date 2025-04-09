
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
    missedPayments: number
  ): boolean => {
    // Already has shadow form
    if (shadowForm !== null) return false;
    
    // Trigger shadow form at month 3
    if (monthsPassed >= 3) return true;
    
    // Trigger shadow form if debt > $15,000 and 2+ missed payments
    if (totalDebt > 15000 && missedPayments >= 2) return true;
    
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
    }
  };
  
  return {
    shadowForm,
    corruptionLevel,
    isCorruptionUnstable,
    updateShadowForm,
    increaseCorruption,
    decreaseCorruption,
    checkShadowFormEligibility
  };
};
