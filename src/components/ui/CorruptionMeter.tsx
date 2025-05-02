
import React, { useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Skull, Sword, Droplets, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShadowFormType } from '../../types/gameTypes';

interface CorruptionMeterProps {
  size?: 'sm' | 'md' | 'lg'; 
}

const CorruptionMeter: React.FC<CorruptionMeterProps> = ({ size = 'md' }) => {
  const { shadowForm, corruptionLevel } = useGameContext();
  
  // Play sound effects when corruption level crosses thresholds
  useEffect(() => {
    if (corruptionLevel === 30 || corruptionLevel === 60 || corruptionLevel === 90) {
      const audio = new Audio('/sounds/corruption-rise.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio playback error:", e));
      
      // Add screen effect to indicate corruption increase
      const body = document.querySelector('body');
      if (body) {
        body.classList.add('corruption-pulse');
        setTimeout(() => body.classList.remove('corruption-pulse'), 2000);
      }
    }
  }, [corruptionLevel]);
  
  if (!shadowForm || corruptionLevel === 0) {
    return null;
  }
  
  const getCorruptionColor = () => {
    if (corruptionLevel >= 90) return 'from-red-600 to-red-900';
    if (corruptionLevel >= 75) return 'from-red-500 to-red-800';
    if (corruptionLevel >= 50) return 'from-red-400 to-red-700';
    if (corruptionLevel >= 25) return 'from-red-300 to-red-600';
    return 'from-red-200 to-red-500';
  };
  
  const getShadowFormIcon = () => {
    switch(shadowForm) {
      case 'cursedBlade':
        return <Sword className="h-4 w-4 text-red-400" />;
      case 'leecher':
        return <Droplets className="h-4 w-4 text-purple-400" />;
      case 'whisperer':
        return <Brain className="h-4 w-4 text-blue-400" />;
      default:
        return <Skull className="h-4 w-4 text-red-400" />;
    }
  };
  
  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'h-1 w-16';
      case 'lg': return 'h-3 w-32';
      default: return 'h-2 w-24';
    }
  };
  
  const getShadowFormLabel = (): string => {
    switch(shadowForm) {
      case 'cursedBlade': return 'Cursed Blade';
      case 'leecher': return 'Debt Leecher';
      case 'whisperer': return 'Whisperer';
      default: return 'Shadow Form';
    }
  };
  
  const isPulsing = corruptionLevel >= 75;
  const isGlitching = corruptionLevel >= 75;
  
  // Add visual indicators for corruption thresholds
  const renderThresholdMarkers = () => {
    if (size === 'sm') return null;
    
    return (
      <>
        <div className="absolute h-full w-px bg-red-300/30 left-[30%]"></div>
        <div className="absolute h-full w-px bg-red-300/30 left-[60%]"></div>
        <div className="absolute h-full w-px bg-red-300/30 left-[90%]"></div>
      </>
    );
  };
  
  // Show tooltip with shadow form benefits
  const getShadowFormDescription = (): string => {
    switch (shadowForm) {
      case 'cursedBlade':
        return '+50% damage, -50% interest, -10% savings';
      case 'leecher':
        return 'Life drain from demons, no savings';
      case 'whisperer':
        return 'Foresight abilities, -50% combat XP';
      default:
        return '';
    }
  };
  
  return (
    <div className="group relative">
      <div className="flex items-center space-x-1 relative">
        <motion.div 
          animate={isPulsing ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`${isPulsing ? 'drop-shadow-lg' : ''}`}
        >
          {getShadowFormIcon()}
        </motion.div>
        
        <div className="bg-slate-800/80 rounded-full overflow-hidden relative">
          {renderThresholdMarkers()}
          
          <motion.div 
            className={`${getSizeClasses()} bg-gradient-to-r ${getCorruptionColor()}`}
            style={{ 
              width: `${Math.min(100, corruptionLevel)}%`,
            }}
            animate={isPulsing ? { opacity: [0.8, 1, 0.8] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          ></motion.div>
          
          {isPulsing && (
            <div className="absolute inset-0 bg-red-500/20 animate-ping rounded-full"></div>
          )}
        </div>
        
        {/* Add corruption value as number */}
        <div className="text-xs font-mono text-red-400">
          {Math.round(corruptionLevel)}%
        </div>
        
        {/* Glitch effect for high corruption */}
        {isGlitching && (
          <motion.div 
            className="absolute inset-0 mix-blend-overlay pointer-events-none z-10"
            animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatType: 'loop', times: [0, 0.1, 0.2, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-red-500/30"></div>
          </motion.div>
        )}
        
        {corruptionLevel >= 100 && (
          <>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-600 rounded-full"></div>
          </>
        )}
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 py-1 px-2 bg-slate-900/90 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-red-900/50 z-20">
        <p className="font-medium text-red-400">{getShadowFormLabel()}</p>
        <p className="text-slate-300 text-[10px]">{getShadowFormDescription()}</p>
        <div className="text-[10px] mt-1 text-red-300">
          <span className="font-semibold">Warning:</span> {corruptionLevel >= 90 
            ? 'Critical corruption level!'
            : corruptionLevel >= 60
            ? 'High corruption threatens your control.'
            : corruptionLevel >= 30
            ? 'Corruption is building within you.'
            : 'Corruption is manageable.'
          }
        </div>
      </div>
    </div>
  );
};

export default CorruptionMeter;
