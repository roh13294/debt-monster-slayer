
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

export default BattleEffects;
