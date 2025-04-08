
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGameContext } from '../context/GameContext';
import { Flame, Sword, Zap } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { EncounterStageOne, EncounterStageTwo } from './encounter/EncounterStages';
import { EncounterBackdrop } from './encounter/EncounterEffects';
import { motion } from 'framer-motion';
import { gameTerms } from '@/utils/gameTerms';

const MonthlyEncounter = () => {
  const { advanceMonth, cash, budget, setCash, updateBudget, processMonthlyFinancials } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState(1);
  const [stance, setStance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stanceOutcome, setStanceOutcome] = useState({
    title: '',
    description: '',
    cashChange: 0,
    debtChange: 0
  });
  
  const handleOpenEncounter = () => {
    setIsOpen(true);
    setStage(1);
    setStance(null);
  };
  
  const handleCloseEncounter = () => {
    setIsOpen(false);
    // Reset state after close
    setTimeout(() => {
      setStage(1);
      setStance(null);
    }, 300);
  };
  
  const handleSelectStance = (selected: string) => {
    setIsLoading(true);
    setStance(selected);
    
    // Simulate processing time for effect
    setTimeout(() => {
      setIsLoading(false);
      
      // Process stance outcomes
      let outcome = {
        title: '',
        description: '',
        cashChange: 0,
        debtChange: 0
      };
      
      switch (selected) {
        case 'aggressive':
          outcome = {
            title: "Flame Breathing Form",
            description: "Your fiery attacks burn through the demon's defenses, weakening their cursed bonds.",
            cashChange: 0,
            debtChange: 15
          };
          break;
          
        case 'defensive':
          outcome = {
            title: "Water Breathing Form",
            description: "Your fluid defensive movements protect your spirit energy and strengthen your power seals.",
            cashChange: 5,
            debtChange: -5
          };
          break;
          
        case 'risky':
          // For risky stance, randomize the outcome
          const riskRoll = Math.random();
          if (riskRoll < 0.25) {
            // Big success
            outcome = {
              title: "Thunder Breathing: First Form",
              description: "Your lightning-fast strikes critically hit the demon's core, creating massive resonance damage!",
              cashChange: 30,
              debtChange: 10
            };
          } else if (riskRoll < 0.65) {
            // Moderate success
            outcome = {
              title: "Thunder Breathing: Second Form",
              description: "Your erratic movements confuse the demon, allowing you to land several effective strikes.",
              cashChange: 15,
              debtChange: 0
            };
          } else if (riskRoll < 0.9) {
            // Break even
            outcome = {
              title: "Thunder Breathing: Failed Form",
              description: "The demon anticipated your movements. You managed to avoid damage but couldn't land effective strikes.",
              cashChange: 0,
              debtChange: 0
            };
          } else {
            // Loss
            outcome = {
              title: "Thunder Breathing: Reverse Strike",
              description: "Your risky maneuver backfired! The demon countered your attack and drained some of your energy.",
              cashChange: -15,
              debtChange: -5
            };
          }
          break;
      }
      
      setStanceOutcome(outcome);
      setStage(2);
    }, 1000);
  };
  
  const handleContinue = () => {
    // Apply the stance effects
    if (stanceOutcome.cashChange !== 0) {
      const cashChange = Math.round((cash * stanceOutcome.cashChange) / 100);
      setCash(cash + cashChange);
      
      if (cashChange > 0) {
        toast({
          title: "Energy Surge!",
          description: `You gained ${cashChange} Spirit Energy from your battle technique.`,
          variant: "default",
        });
      } else if (cashChange < 0) {
        toast({
          title: "Energy Drained",
          description: `You lost ${Math.abs(cashChange)} Spirit Energy from the demon's counterattack.`,
          variant: "destructive",
        });
      }
    }
    
    // Apply debt payment effectiveness changes in the next month's budget
    if (stanceOutcome.debtChange !== 0) {
      const currentDebtBudget = budget.debt;
      const debtBudgetChange = Math.round((currentDebtBudget * stanceOutcome.debtChange) / 100);
      
      updateBudget({
        debt: currentDebtBudget + debtBudgetChange
      });
      
      if (debtBudgetChange > 0) {
        toast({
          title: "Attack Power Increased!",
          description: `Your spirit strikes are ${stanceOutcome.debtChange}% more effective against demons.`,
          variant: "default",
        });
      } else if (debtBudgetChange < 0) {
        toast({
          title: "Attack Power Decreased",
          description: `Your spirit strikes are ${Math.abs(stanceOutcome.debtChange)}% less effective against demons.`,
          variant: "default",
        });
      }
    }
    
    // Close the encounter
    handleCloseEncounter();
    
    // Process financials and advance to next month
    processMonthlyFinancials();
    
    toast({
      title: "New Moon Rises!",
      description: "The cycle begins anew as you continue your journey to slay the curse demons.",
      variant: "default",
    });
  };
  
  return (
    <>
      <Button 
        onClick={handleOpenEncounter} 
        className="oni-button w-full group"
      >
        <Flame className="w-4 h-4 mr-2 group-hover:animate-flame-pulse text-amber-200" />
        Begin Next Moon Cycle
        <Sword className="w-4 h-4 ml-2 group-hover:animate-pulse-subtle" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl bg-slate-900/95 border border-yellow-500/30 p-0">
          <div className="relative min-h-[60vh] p-0">
            {/* Dynamic backdrop based on stance */}
            <EncounterBackdrop stance={stance || 'default'} />
            
            {/* Encounter content */}
            <div className="relative z-10">
              {stage === 1 && (
                <EncounterStageOne 
                  onSelectStance={handleSelectStance} 
                  isLoading={isLoading} 
                />
              )}
              
              {stage === 2 && stance && (
                <EncounterStageTwo 
                  stance={stance}
                  stanceOutcome={stanceOutcome}
                  onContinue={handleContinue}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyEncounter;
