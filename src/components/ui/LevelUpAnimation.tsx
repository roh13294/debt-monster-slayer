
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, ArrowUpCircle } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';

interface LevelUpAnimationProps {
  isOpen: boolean;
  onClose: () => void;
}

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ isOpen, onClose }) => {
  const { playerLevel, playerTitle, playerPerk } = useGameContext();
  const [animationPhase, setAnimationPhase] = useState<number>(0);
  
  useEffect(() => {
    if (isOpen) {
      // Reset animation sequence
      setAnimationPhase(0);
      
      // Phase 1: Initial burst
      const phase1Timer = setTimeout(() => {
        setAnimationPhase(1);
      }, 500);
      
      // Phase 2: Show title
      const phase2Timer = setTimeout(() => {
        setAnimationPhase(2);
      }, 1500);
      
      // Phase 3: Show perk
      const phase3Timer = setTimeout(() => {
        setAnimationPhase(3);
      }, 2500);
      
      // Phase 4: Fade out
      const phase4Timer = setTimeout(() => {
        setAnimationPhase(4);
      }, 4000);
      
      // Auto close
      const closeTimer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => {
        clearTimeout(phase1Timer);
        clearTimeout(phase2Timer);
        clearTimeout(phase3Timer);
        clearTimeout(phase4Timer);
        clearTimeout(closeTimer);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
        onClick={onClose}
      >
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {/* Energy burst */}
          <motion.div
            className="absolute inset-0 bg-demon-gradient rounded-full blur-2xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 5, 2], 
              opacity: [0, 1, 0.8],
              rotate: [0, 180]
            }}
            transition={{ duration: 2 }}
          />
          
          {/* Level badge */}
          <motion.div
            className="relative bg-night-sky border-4 border-demon-gold rounded-xl p-8 flex flex-col items-center transform-gpu"
            initial={{ scale: 0, y: 50 }}
            animate={{ 
              scale: animationPhase >= 1 ? 1 : 0,
              y: animationPhase >= 1 ? 0 : 50,
              rotate: animationPhase >= 1 ? [-5, 5, 0] : 0,
            }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div
              className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5 z-0"
              animate={{ scale: [1.1, 1], opacity: [0.1, 0.05] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
            
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ArrowUpCircle className="text-demon-gold w-12 h-12 mr-2" />
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">RANK ASCENSION</h2>
                <div className="text-demon-gold text-3xl font-bold flex items-center justify-center">
                  <Trophy className="w-6 h-6 mr-2" />
                  LEVEL {playerLevel}
                </div>
              </div>
            </motion.div>
            
            {/* Title reveal */}
            <motion.div
              className="mb-4 text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: animationPhase >= 2 ? 1 : 0,
                height: animationPhase >= 2 ? "auto" : 0,
              }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-white/70 mb-1">New Title Unlocked</p>
              <h3 className="text-2xl font-bold bg-demon-gradient bg-clip-text text-transparent">
                "{playerTitle}"
              </h3>
            </motion.div>
            
            {/* Perk reveal */}
            {playerPerk && (
              <motion.div
                className="bg-demon-black/50 p-3 rounded-lg border border-demon-red/30"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: animationPhase >= 3 ? 1 : 0, 
                  scale: animationPhase >= 3 ? 1 : 0, 
                  y: animationPhase >= 3 ? 0 : 20 
                }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center text-demon-gold">
                  <Star className="w-4 h-4 mr-2 animate-pulse-subtle" />
                  <span className="font-medium">{playerPerk}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Particles */}
          <Particles />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Particle effect component
const Particles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <>
      {particles.map((id) => {
        const size = Math.random() * 8 + 4;
        const duration = Math.random() * 2 + 2;
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;
        const delay = Math.random() * 2;
        const color = Math.random() > 0.5 ? 'bg-demon-gold' : 'bg-demon-red';
        
        return (
          <motion.div
            key={id}
            className={`absolute w-2 h-2 rounded-full ${color}`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: [1, 0],
              scale: [0, size / 4],
              x: x,
              y: y,
            }}
            transition={{
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{ width: size, height: size }}
          />
        );
      })}
    </>
  );
};

export default LevelUpAnimation;
