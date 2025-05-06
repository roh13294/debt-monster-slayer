
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Sword } from 'lucide-react';
import DebtMonster from '@/components/DebtMonster';
import BattleTips from './BattleTips';
import { Debt } from '@/types/gameTypes';

interface BattlePrepStageProps {
  debt: Debt;
  showNarrative: boolean;
  narrativeChoice: string | null;
  showTips: boolean;
  currentStance: string;
  onNarrativeChoice: (choice: string) => void;
  onStartBattle: () => void;
  onCloseTips: () => void;
  onSwitchToRaid?: () => void; // Add this optional prop
}

const BattlePrepStage: React.FC<BattlePrepStageProps> = ({
  debt,
  showNarrative,
  narrativeChoice,
  showTips,
  currentStance,
  onNarrativeChoice,
  onStartBattle,
  onCloseTips,
  onSwitchToRaid
}) => {
  // Generate some narrative options based on the current stance
  const getNarrativeOptions = (): string[] => {
    switch(currentStance) {
      case 'aggressive':
        return [
          "I'll face this head on, with everything I have.",
          "This demon won't know what hit it.",
          "My strength grows with every challenge."
        ];
      case 'defensive':
        return [
          "Patience and wisdom will guide my actions.",
          "A careful approach will reveal the path forward.",
          "Defense builds the foundation for lasting victory."
        ];
      case 'risky':
        return [
          "Sometimes you have to gamble to get ahead.",
          "The greatest rewards often come with the greatest risks.",
          "Fortune favors the bold."
        ];
      default:
        return [
          "I'll find the right approach for this challenge.",
          "Each demon requires a different strategy.",
          "I must adapt my technique to this opponent."
        ];
    }
  };
  
  const narrativeOptions = getNarrativeOptions();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <DebtMonster 
          debt={debt} 
          isInBattle={true}
        />
      </div>

      {showNarrative ? (
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-slate-100 mb-4">Inner Reflection</h3>
          <p className="text-slate-300 mb-6 italic">
            As you prepare to face this demon, what thoughts guide your approach?
          </p>

          <div className="space-y-3">
            {narrativeOptions.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNarrativeChoice(option)}
                className="w-full p-3 text-left border border-slate-700 rounded-md bg-slate-800 hover:bg-slate-800/80 hover:border-slate-600 transition-colors"
              >
                <p className="text-slate-200">{option}</p>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-blue-900/30 border border-blue-800">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-100 mb-1">Battle Preparation</h3>
              <p className="text-slate-300 mb-2 italic">"{narrativeChoice}"</p>
              <p className="text-sm text-slate-400">
                Your mindset shapes your approach to this battle, influencing your technique and effectiveness.
              </p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  onClick={onStartBattle}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Begin Single Battle
                </Button>
                
                {onSwitchToRaid && (
                  <Button 
                    onClick={onSwitchToRaid}
                    variant="outline"
                    className="border-amber-600 text-amber-500 hover:bg-amber-900/20"
                  >
                    <Sword className="w-4 h-4 mr-2" />
                    Switch to Tactical Raid
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showTips && <BattleTips stance={currentStance} onClose={onCloseTips} />}
    </motion.div>
  );
};

export default BattlePrepStage;
