
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import CutsceneEventScreen from '../cutscene/CutsceneEventScreen';

interface EncounterStageOneProps {
  onSelectStance: (stance: string) => void;
  isLoading: boolean;
}

export const EncounterStageOne: React.FC<EncounterStageOneProps> = ({ 
  onSelectStance,
  isLoading
}) => {
  return (
    <CutsceneEventScreen 
      isOpen={true}
      onClose={() => {}}
      onSelectStance={onSelectStance}
      isLoading={isLoading}
    />
  );
};

interface StanceOutcome {
  title: string;
  description: string;
  cashChange: number;
  debtChange: number;
}

interface EncounterStageTwoProps {
  stance: string;
  stanceOutcome: StanceOutcome;
  onContinue: () => void;
}

export const EncounterStageTwo: React.FC<EncounterStageTwoProps> = ({
  stance,
  stanceOutcome,
  onContinue
}) => {
  const getStanceColor = () => {
    switch (stance) {
      case 'aggressive': return 'from-red-500 to-red-700';
      case 'defensive': return 'from-blue-500 to-blue-700';
      case 'risky': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };
  
  const getStanceIcon = () => {
    switch (stance) {
      case 'aggressive': return <Flame className="w-8 h-8 text-red-400" />;
      case 'defensive': return <Shield className="w-8 h-8 text-blue-400" />;
      case 'risky': return <Zap className="w-8 h-8 text-purple-400" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 24
      }}
    >
      <div className="mb-6 flex flex-col items-center">
        <div className={`p-4 rounded-full bg-gradient-to-br ${getStanceColor()} mb-4 animate-pulse-subtle`}>
          {getStanceIcon()}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{stanceOutcome.title}</h2>
        <p className="text-gray-300 max-w-md">{stanceOutcome.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stanceOutcome.cashChange !== 0 && (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-1">Cash Impact</h3>
            <div className={`text-xl font-bold ${stanceOutcome.cashChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stanceOutcome.cashChange > 0 ? '+' : ''}{stanceOutcome.cashChange}%
            </div>
          </div>
        )}
        
        {stanceOutcome.debtChange !== 0 && (
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-1">Debt Payment Effectiveness</h3>
            <div className={`text-xl font-bold ${stanceOutcome.debtChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stanceOutcome.debtChange > 0 ? '+' : ''}{stanceOutcome.debtChange}%
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onContinue}
        className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold px-8 py-6 h-auto text-lg rounded-xl shadow-lg hover:shadow-xl"
      >
        Continue Your Journey
      </Button>
    </motion.div>
  );
};
