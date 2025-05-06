
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useGameContext } from '../context/GameContext';
import { Flame, Sword, Zap, Target } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { EncounterBackdrop } from './encounter/EncounterEffects';
import MonthlyMissionCampaign from './battle/MonthlyMissionCampaign';

const EnhancedMonthlyEncounter = () => {
  const { advanceMonth, debts } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleOpenEncounter = () => {
    if (debts.length === 0) {
      toast({
        title: "No Demons to Battle",
        description: "You've defeated all debt demons. Enjoy your freedom!",
        variant: "default",
      });
      
      // Just process the month without battle
      advanceMonth();
      return;
    }
    
    setIsOpen(true);
  };
  
  const handleCloseEncounter = () => {
    setIsOpen(false);
  };
  
  const handleCampaignComplete = () => {
    handleCloseEncounter();
    
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
        <DialogContent className="max-w-6xl bg-slate-900/95 border border-yellow-500/30 p-0">
          <div className="relative min-h-[60vh] p-0">
            <div className="absolute inset-0 z-0">
              <EncounterBackdrop stance="default" />
            </div>
            
            <div className="relative z-10">
              <MonthlyMissionCampaign onComplete={handleCampaignComplete} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedMonthlyEncounter;
