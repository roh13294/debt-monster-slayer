
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, CircleArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BattleEscapeOptionsProps {
  cash: number;
  onRetreat: () => void;
  onChannelEnergy: () => void;
  isMinAttackPossible: boolean;
  isInCombo: boolean;
}

const BattleEscapeOptions: React.FC<BattleEscapeOptionsProps> = ({
  cash,
  onRetreat,
  onChannelEnergy,
  isMinAttackPossible,
  isInCombo
}) => {
  const handleRetreat = () => {
    // Apply penalty for breaking combo
    if (isInCombo) {
      toast({
        title: "Combo Broken",
        description: "You've sacrificed your combo chain to retreat!",
        variant: "destructive",
      });
    }
    
    onRetreat();
  };
  
  const handleChannelEnergy = () => {
    // Apply penalty for breaking combo
    if (isInCombo) {
      toast({
        title: "Combo Paused",
        description: "Your combo window is temporarily frozen while channeling energy.",
        variant: "default",
      });
    }
    
    onChannelEnergy();
  };
  
  return (
    <div className="flex flex-col space-y-2 w-full">
      {!isMinAttackPossible && (
        <div className="bg-red-900/30 text-red-300 px-4 py-2 rounded-md text-sm mb-2">
          <p className="font-medium">Insufficient Spirit Energy for minimum attack!</p>
          <p className="text-xs opacity-80">Try a light attack, channel energy, or retreat.</p>
        </div>
      )}
      
      <div className="flex justify-between gap-2">
        <motion.div whileTap={{ scale: 0.98 }} className="w-1/2">
          <Button
            onClick={handleRetreat}
            variant="outline"
            className="w-full border-red-800/50 text-red-400 hover:bg-red-950/30 flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retreat
          </Button>
        </motion.div>
        
        <motion.div whileTap={{ scale: 0.98 }} className="w-1/2">
          <Button
            onClick={handleChannelEnergy}
            variant="outline"
            className="w-full border-blue-800/50 text-blue-400 hover:bg-blue-950/30 flex items-center justify-center"
          >
            <CircleArrowLeft className="mr-2 h-4 w-4" />
            Channel Energy
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BattleEscapeOptions;
