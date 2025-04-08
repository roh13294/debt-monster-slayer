
import React from 'react';
import { Flame, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { battleStances } from '@/utils/gameTerms';
import { EnergyWave } from '@/components/battle/BattleEffects';

interface CutsceneEventScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStance: (stance: string) => void;
  isLoading?: boolean;
}

const CutsceneEventScreen: React.FC<CutsceneEventScreenProps> = ({
  isOpen,
  onClose,
  onSelectStance,
  isLoading = false
}) => {
  const getStanceIcon = (stanceId: string) => {
    switch (stanceId) {
      case 'aggressive': return <Flame className="w-6 h-6" />;
      case 'defensive': return <Shield className="w-6 h-6" />;
      case 'risky': return <Zap className="w-6 h-6" />;
      default: return null;
    }
  };
  
  return (
    <div className="min-h-[70vh] relative overflow-hidden">
      {/* Dynamic atmosphere effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
        <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5"></div>
      </div>
      
      <EnergyWave color="purple" duration={6} />
      <EnergyWave color="blue" duration={8} delay={2} />
      
      {/* Content container */}
      <div className="relative z-10 container mx-auto py-10 px-4">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-400 via-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Monthly Demon Encounter
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Choose your breathing style to face the oncoming demons. Each technique offers different advantages in battle.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {battleStances.map((stance) => (
            <motion.div
              key={stance.id}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${stance.color} border-${stance.color.split(' ')[0].replace('from-', '')}-400/50 p-1`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => onSelectStance(stance.id)}
                disabled={isLoading}
                className="relative flex flex-col items-center text-center bg-slate-900/90 rounded-lg p-6 h-full w-full transition-all"
              >
                <div className={`p-4 rounded-full mb-4 bg-gradient-to-br ${stance.color}`}>
                  {getStanceIcon(stance.id)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{stance.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{stance.description}</p>
                <div className="mt-auto">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-${stance.color.split(' ')[0].replace('from-', '')}-400/20 text-${stance.color.split(' ')[0].replace('from-', '')}-300`}>
                    {stance.effect}
                  </span>
                </div>
                
                {isLoading && stance.id === 'selected' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                    <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CutsceneEventScreen;
