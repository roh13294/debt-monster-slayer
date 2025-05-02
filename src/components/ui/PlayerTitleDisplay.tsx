
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';

interface PlayerTitleDisplayProps {
  showLevel?: boolean;
  showPerk?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PlayerTitleDisplay: React.FC<PlayerTitleDisplayProps> = ({ 
  showLevel = true,
  showPerk = true,
  size = 'md'
}) => {
  const { playerLevel, playerTitle, playerPerk } = useGameContext();
  
  // Get title aura color
  const getTitleAura = () => {
    if (playerLevel >= 20) return 'from-purple-600/30 to-purple-900/10';
    if (playerLevel >= 15) return 'from-indigo-600/30 to-indigo-900/10';
    if (playerLevel >= 10) return 'from-cyan-600/30 to-cyan-900/10';
    if (playerLevel >= 5) return 'from-green-600/30 to-green-900/10';
    return 'from-blue-600/30 to-blue-900/10';
  };
  
  // Get title text color
  const getTitleColor = () => {
    if (playerLevel >= 20) return 'text-purple-400';
    if (playerLevel >= 15) return 'text-indigo-400';
    if (playerLevel >= 10) return 'text-cyan-400';
    if (playerLevel >= 5) return 'text-green-400';
    return 'text-blue-400';
  };
  
  // Get font size based on component size
  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'text-xs';
      case 'lg': return 'text-lg';
      default: return 'text-sm';
    }
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r ${getTitleAura()} rounded-full border border-slate-700/50`}
    >
      <Trophy className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} ${getTitleColor()} mr-1.5`} />
      
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          {showLevel && (
            <span className={`${getFontSize()} text-slate-400 mr-1.5`}>
              Lv. {playerLevel}
            </span>
          )}
          <span className={`font-medium ${getFontSize()} ${getTitleColor()}`}>
            {playerTitle || 'Debt Slayer'}
          </span>
        </div>
        
        {showPerk && playerPerk && (
          <span className="text-xs text-slate-400">
            {playerPerk}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerTitleDisplay;
