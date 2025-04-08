
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedSlashProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const AnimatedSlash: React.FC<AnimatedSlashProps> = ({ isActive, onComplete }) => {
  if (!isActive) return null;
  
  return (
    <motion.div
      className="absolute inset-0 z-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div 
        className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 opacity-75"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ 
          scaleX: [0, 1, 1, 0],
        }}
        transition={{ 
          times: [0, 0.2, 0.8, 1],
          duration: 0.6, 
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 opacity-75"
        initial={{ scaleY: 0, originY: 0 }}
        animate={{ 
          scaleY: [0, 1, 1, 0],
        }}
        transition={{ 
          times: [0, 0.2, 0.8, 1],
          duration: 0.6, 
          ease: "easeInOut",
          delay: 0.1
        }}
      />
    </motion.div>
  );
};

interface ElementalBurstProps {
  element: 'fire' | 'water' | 'lightning' | 'earth' | 'shadow';
  isActive: boolean;
  position?: 'center' | 'top' | 'bottom';
  onComplete?: () => void;
}

export const ElementalBurst: React.FC<ElementalBurstProps> = ({ 
  element, 
  isActive, 
  position = 'center',
  onComplete 
}) => {
  if (!isActive) return null;
  
  const getElementColors = () => {
    switch (element) {
      case 'fire': return 'from-red-500 via-orange-400 to-yellow-300';
      case 'water': return 'from-blue-500 via-cyan-400 to-teal-300';
      case 'lightning': return 'from-purple-500 via-indigo-400 to-blue-300';
      case 'earth': return 'from-amber-700 via-yellow-600 to-orange-400';
      case 'shadow': return 'from-purple-900 via-purple-700 to-purple-500';
    }
  };
  
  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'top-0 left-1/2 -translate-x-1/2';
      case 'bottom': return 'bottom-0 left-1/2 -translate-x-1/2';
      default: return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };
  
  return (
    <motion.div 
      className={`absolute ${getPositionClasses()} z-20 pointer-events-none`}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0.2, 1.5, 1.8, 2.2]
      }}
      transition={{ 
        times: [0, 0.3, 0.7, 1],
        duration: 0.8, 
        ease: "easeOut" 
      }}
      onAnimationComplete={onComplete}
    >
      <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getElementColors()} opacity-60 blur-lg`} />
    </motion.div>
  );
};

interface EnergyWaveProps {
  color: string;
  duration?: number;
  delay?: number;
}

export const EnergyWave: React.FC<EnergyWaveProps> = ({ 
  color = 'blue', 
  duration = 3, 
  delay = 0 
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'red': return 'from-red-500/20 to-red-500/5';
      case 'blue': return 'from-blue-500/20 to-blue-500/5';
      case 'purple': return 'from-purple-500/20 to-purple-500/5';
      case 'green': return 'from-green-500/20 to-green-500/5';
      case 'yellow': return 'from-yellow-500/20 to-yellow-500/5';
      default: return 'from-blue-500/20 to-blue-500/5';
    }
  };
  
  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.div 
        className={`absolute -inset-[100%] rounded-full bg-gradient-radial ${getColorClass()}`}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ 
          scale: 2.5, 
          opacity: 0,
        }}
        transition={{
          duration,
          ease: "easeOut",
          repeat: Infinity,
          repeatDelay: 1
        }}
      />
    </motion.div>
  );
};

export const ScreenShake: React.FC<{ isActive: boolean; onComplete?: () => void }> = ({ 
  isActive, 
  onComplete 
}) => {
  if (!isActive) return null;
  
  return (
    <motion.div 
      className="absolute inset-0 z-40 pointer-events-none"
      animate={{ 
        x: [0, -10, 10, -10, 10, 0],
        y: [0, 5, -5, 5, -5, 0]
      }}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
    />
  );
};
