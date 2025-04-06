
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGameContext } from '../context/GameContext';
import { Flame, Shield, Sword } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { EncounterStageOne, EncounterStageTwo } from './encounter/EncounterStages';
import { EncounterBackdrop } from './encounter/EncounterEffects';
import { motion } from 'framer-motion';

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
            title: "Debt Slayer Stance",
            description: "You've focused your energy on slashing your debt this month. Your payments will be more effective!",
            cashChange: 0,
            debtChange: 15
          };
          break;
          
        case 'defensive':
          outcome = {
            title: "Savings Shield Stance",
            description: "You've taken a defensive position to build your savings this month. Your emergency fund grows stronger!",
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
              title: "Fortune Favors the Bold!",
              description: "Your risky approach paid off handsomely this month. Your investments yielded significant returns!",
              cashChange: 30,
              debtChange: 10
            };
          } else if (riskRoll < 0.65) {
            // Moderate success
            outcome = {
              title: "Calculated Risk",
              description: "Your investments performed reasonably well this month, yielding modest returns.",
              cashChange: 15,
              debtChange: 0
            };
          } else if (riskRoll < 0.9) {
            // Break even
            outcome = {
              title: "Market Volatility",
              description: "Your investments faced a turbulent market. You managed to break even, but gained valuable experience.",
              cashChange: 0,
              debtChange: 0
            };
          } else {
            // Loss
            outcome = {
              title: "Investment Setback",
              description: "Your risky investments didn't pan out this month. The market turned against your positions.",
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
          title: "Extra Income!",
          description: `You earned an additional $${cashChange} from your monthly approach.`,
          variant: "default",
        });
      } else if (cashChange < 0) {
        toast({
          title: "Financial Setback",
          description: `You lost $${Math.abs(cashChange)} from your risky approach.`,
          variant: "default",
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
          title: "Debt Payment Boost!",
          description: `Your monthly debt payment budget increased by $${debtBudgetChange}.`,
          variant: "default",
        });
      } else if (debtBudgetChange < 0) {
        toast({
          title: "Debt Payment Reduced",
          description: `Your monthly debt payment budget decreased by $${Math.abs(debtBudgetChange)}.`,
          variant: "default",
        });
      }
    }
    
    // Close the encounter
    handleCloseEncounter();
    
    // Process financials and advance to next month
    processMonthlyFinancials();
    
    toast({
      title: "A New Month Begins!",
      description: "Your financial journey continues as you face new challenges.",
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
        Advance to Next Month
        <Flame className="w-4 h-4 ml-2 group-hover:animate-sword-draw" />
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl bg-slate-900/95 border border-yellow-500/30 p-0">
          <div className="relative min-h-[50vh] p-8">
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
