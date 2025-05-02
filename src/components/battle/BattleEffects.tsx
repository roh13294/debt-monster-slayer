import React from 'react';
import { motion } from 'framer-motion';

interface BattleEffectsProps {
  effect: 'attack' | 'critical' | 'heal' | 'special' | 'combo';
  position?: { x: number; y: number };
}

const BattleEffects: React.FC<BattleEffectsProps> = ({ 
  effect, 
  position = { x: 50, y: 50 } 
}) => {
  // Handle different effect types
  switch (effect) {
    case 'attack':
      return (
        <motion.div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 2], rotate: [0, 15] }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-red-500/40 rounded-full" />
          </div>
        </motion.div>
      );
      
    case 'critical':
      return (
        <motion.div
          className="absolute pointer-events-none z-30 flex items-center justify-center"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <motion.div
            className="absolute w-40 h-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.7 }}
          >
            <div className="w-full h-full bg-yellow-500/30 rounded-full" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full" />
          </motion.div>
          
          {/* Slash effect */}
          <motion.div
            className="absolute w-40 h-40 overflow-hidden"
            initial={{ rotate: -45, scale: 0 }}
            animate={{ rotate: 45, scale: 1.5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute w-full h-2 bg-yellow-400/80 top-1/2 left-0 transform -translate-y-1/2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
          
          <motion.div
            className="absolute w-40 h-40 overflow-hidden"
            initial={{ rotate: 45, scale: 0 }}
            animate={{ rotate: -45, scale: 1.5 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.div
              className="absolute w-full h-2 bg-red-400/80 top-1/2 left-0 transform -translate-y-1/2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>
        </motion.div>
      );
      
    case 'heal':
      return (
        <motion.div
          className="absolute pointer-events-none z-30 flex items-center justify-center"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Green healing particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-green-500/80 rounded-full"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0
              }}
              animate={{ 
                x: Math.random() * 100 - 50,
                y: Math.random() * -100,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.05
              }}
            />
          ))}
          
          <motion.div
            className="w-20 h-20 bg-green-500/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      );
      
    case 'special':
      return (
        <motion.div
          className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden"
        >
          {/* Full screen flash */}
          <motion.div
            className="absolute inset-0 bg-indigo-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.7 }}
          />
          
          {/* Energy wave */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/5 border-4 border-indigo-500/40"
            initial={{ scale: 0 }}
            animate={{ scale: 3, opacity: [1, 0] }}
            transition={{ duration: 1.2 }}
          />
          
          {/* Energy particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 1
              }}
              animate={{ 
                x: Math.random() * 800 - 400,
                y: Math.random() * 800 - 400,
                opacity: 0
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      );
      
    case 'combo':
      return (
        <motion.div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Combo flash */}
          <motion.div
            className="absolute w-32 h-32 bg-amber-500/20 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Combo sparks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-10 bg-amber-400 rounded-full origin-bottom"
              style={{
                left: '50%',
                bottom: '50%',
                transform: `rotate(${i * 45}deg)`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.4 }}
            />
          ))}
          
          {/* Combo center */}
          <motion.div
            className="w-10 h-10 bg-amber-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      );
      
    default:
      return null;
  }
};

// Add the missing named exports
export const AnimatedSlash: React.FC<{
  isActive: boolean;
  onComplete: () => void;
}> = ({ isActive, onComplete }) => {
  React.useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="absolute w-full h-4 bg-white/80 rotate-45 top-1/2 left-0 transform -translate-y-1/2"
        initial={{ scaleX: 0, x: -500 }}
        animate={{ scaleX: 1, x: 1500 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute w-full h-4 bg-amber-400/60 -rotate-45 top-1/2 left-0 transform -translate-y-1/2"
        initial={{ scaleX: 0, x: -500 }}
        animate={{ scaleX: 1, x: 1500 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export const ElementalBurst: React.FC<{
  element: 'fire' | 'water' | 'lightning' | 'earth';
  isActive: boolean;
  onComplete: () => void;
}> = ({ element, isActive, onComplete }) => {
  React.useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;
  
  const getElementColor = () => {
    switch(element) {
      case 'fire': return {
        primary: 'bg-red-500',
        secondary: 'bg-amber-400',
        particle: 'bg-orange-300'
      };
      case 'water': return {
        primary: 'bg-blue-500',
        secondary: 'bg-cyan-400',
        particle: 'bg-blue-300'
      };
      case 'lightning': return {
        primary: 'bg-purple-500',
        secondary: 'bg-indigo-400',
        particle: 'bg-purple-300'
      };
      default: return {
        primary: 'bg-green-500',
        secondary: 'bg-emerald-400',
        particle: 'bg-green-300'
      };
    }
  };
  
  const colors = getElementColor();

  return (
    <motion.div
      className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`absolute w-[300px] h-[300px] rounded-full ${colors.primary}/20 flex items-center justify-center`}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2.5], opacity: [0.8, 0] }}
        transition={{ duration: 0.7 }}
      />
      
      <motion.div
        className={`absolute w-[200px] h-[200px] rounded-full ${colors.secondary}/30`}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2], opacity: [0.8, 0] }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      
      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 ${colors.particle} rounded-full`}
          initial={{ 
            x: 0, 
            y: 0,
            scale: 0,
            opacity: 0
          }}
          animate={{ 
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 0.7,
            delay: Math.random() * 0.2
          }}
        />
      ))}
    </motion.div>
  );
};

export const ScreenShake: React.FC<{
  isActive: boolean;
  onComplete: () => void;
}> = ({ isActive, onComplete }) => {
  React.useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      animate={{ 
        x: [0, -10, 10, -8, 8, -5, 5, 0],
        y: [0, 5, -5, 8, -8, 3, -3, 0]
      }}
      transition={{ 
        duration: 0.6, 
        times: [0, 0.1, 0.3, 0.4, 0.5, 0.7, 0.9, 1] 
      }}
    />
  );
};

export const EnergyWave: React.FC<{ 
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple'; 
  duration?: number;
  delay?: number;
}> = ({ color = 'blue', duration = 5, delay = 0 }) => {
  const getWaveColor = () => {
    switch (color) {
      case 'red': return 'from-red-600/20 to-transparent';
      case 'green': return 'from-green-600/20 to-transparent';
      case 'yellow': return 'from-amber-600/20 to-transparent';
      case 'purple': return 'from-purple-600/20 to-transparent';
      default: return 'from-blue-600/20 to-transparent';
    }
  };

  return (
    <motion.div
      className={`absolute bottom-0 left-0 w-full h-[150%] bg-gradient-to-t ${getWaveColor()}`}
      style={{
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
      }}
      initial={{ y: "100%" }}
      animate={{
        y: ["-10%", "-60%", "-10%"],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    />
  );
};

export default BattleEffects;
