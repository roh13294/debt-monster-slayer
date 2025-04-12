
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Trophy, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';

interface XPBarProps {
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
  animateOnLevelUp?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ 
  size = 'md', 
  showDetails = true,
  className = '',
  animateOnLevelUp = true
}) => {
  const { 
    playerXP, 
    playerLevel, 
    playerTitle, 
    getXPThreshold,
    getNextTitle
  } = useGameContext();

  const maxXP = getXPThreshold(playerLevel);
  const progressPercentage = Math.min(100, (playerXP / maxXP) * 100);
  const nextTitleData = getNextTitle(playerLevel);
  
  // Height based on size
  const getHeight = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'lg': return 'h-3';
      default: return 'h-2';
    }
  };
  
  // Scale animations based on size
  const getAnimationScale = () => {
    switch (size) {
      case 'sm': return [1, 1.1, 1];
      case 'lg': return [1, 1.2, 1];
      default: return [1, 1.15, 1];
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showDetails && (
        <div className="flex justify-between items-center text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center border border-demon-red/30 rounded-full px-1.5 py-0.5 bg-demon-black/30">
              <Star className="w-3 h-3 text-demon-gold" />
              <span className="ml-0.5 text-demon-gold font-bold">{playerLevel}</span>
            </div>
            <span className="text-white/80">{playerTitle}</span>
          </div>
          <div className="flex items-center text-white/60">
            <span>{playerXP}/{maxXP} XP</span>
          </div>
        </div>
      )}
      
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className={`${getHeight()} bg-demon-black/60`}
        />
        
        <motion.div 
          className="absolute inset-0 bg-demon-gradient animate-energy-flow rounded-full overflow-hidden"
          style={{ width: `${progressPercentage}%` }}
          animate={animateOnLevelUp ? { 
            scale: getAnimationScale(),
            opacity: [1, 0.8, 1]
          } : {}}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      {showDetails && nextTitleData && (
        <div className="flex justify-end mt-1 text-xs text-white/60 items-center gap-1 animate-pulse-subtle">
          <Trophy className="w-3 h-3 text-demon-gold" />
          <span>Next: "{nextTitleData.title}" at Level {nextTitleData.level}</span>
          <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

export default XPBar;
