
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';

interface ComboBadgeProps {
  active: boolean;
  count: number;
  multiplier: number;
}

const ComboBadge: React.FC<ComboBadgeProps> = ({ active, count, multiplier }) => {
  const { shadowForm, corruptionLevel } = useGameContext();
  
  // Don't show for low combos
  if (!active || count <= 1) return null;
  
  // Handle combo sound effect
  useEffect(() => {
    if (active && count > 1) {
      // Play combo sound (volume increases with combo level)
      const audio = new Audio('/sounds/combo-hit.mp3');
      audio.volume = Math.min(0.2 + (count * 0.05), 0.8);
      audio.play().catch(e => console.error("Audio playback error:", e));
    }
  }, [active, count]);
  
  // Determine badge style based on combo level and shadow form
  const getBadgeStyle = () => {
    if (shadowForm === 'cursedBlade') {
      return {
        background: `linear-gradient(to bottom right, #a31c1c, #6c0d0d)`,
        border: '2px solid #ff3333',
        boxShadow: `0 0 20px rgba(255, 0, 0, ${Math.min(0.5, corruptionLevel / 200)})`
      };
    } else if (count >= 10) {
      return {
        background: 'linear-gradient(to bottom right, #e65c00, #8B4513)',
        border: '2px solid #FFD700',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
      };
    } else if (count >= 5) {
      return {
        background: 'linear-gradient(to bottom right, #ff9d00, #8B4513)',
        border: '2px solid #FFA500',
        boxShadow: '0 0 15px rgba(255, 165, 0, 0.4)'
      };
    } else {
      return {
        background: 'linear-gradient(to bottom right, #dc8f00, #8B4513)',
        border: '2px solid #ffc46c',
        boxShadow: '0 0 10px rgba(255, 165, 0, 0.3)'
      };
    }
  };
  
  // Get flame color based on combo level and shadow form
  const getFlameColor = () => {
    if (shadowForm === 'cursedBlade') {
      return 'text-red-300';
    } else if (count >= 10) {
      return 'text-yellow-200';
    } else {
      return 'text-yellow-300';
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ 
          opacity: 1, 
          scale: count >= 10 ? [1, 1.05, 1] : 1, 
          y: 0,
          transition: {
            scale: {
              repeat: count >= 10 ? Infinity : 0,
              duration: 0.8
            }
          }
        }}
        exit={{ opacity: 0, scale: 1.2 }}
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div 
          className="px-6 py-3 rounded-full shadow-lg"
          style={getBadgeStyle()}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: [-5, 5, -5], 
                scale: [1, 1.1, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              <Flame className={`w-6 h-6 ${getFlameColor()}`} />
            </motion.div>
            
            <span className="text-2xl font-bold text-white">COMBO x{count}</span>
            
            <span className="text-sm text-yellow-200">{(multiplier).toFixed(1)}x</span>
            
            {count >= 10 && (
              <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-yellow-500/10"
              />
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComboBadge;
