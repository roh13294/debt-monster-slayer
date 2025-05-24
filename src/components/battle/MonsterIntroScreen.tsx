
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Debt } from '@/types/gameTypes';
import { getMonsterImage, getDemonElementType } from '@/utils/monsterImages';
import { getMonsterProfile } from '@/utils/monsterProfiles';
import ParticleField from '@/components/ui/ParticleField';

interface MonsterIntroScreenProps {
  debt: Debt;
  onComplete: () => void;
  isVisible: boolean;
}

const MonsterIntroScreen: React.FC<MonsterIntroScreenProps> = ({
  debt,
  onComplete,
  isVisible
}) => {
  const [stage, setStage] = useState<'entrance' | 'display' | 'exit'>('entrance');
  const monsterImage = getMonsterImage(debt.name);
  const elementType = getDemonElementType(debt.name);
  const monsterProfile = getMonsterProfile(debt.name);

  useEffect(() => {
    if (!isVisible) return;

    const timer1 = setTimeout(() => setStage('display'), 500);
    const timer2 = setTimeout(() => setStage('exit'), 3000);
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onComplete]);

  const getElementColors = () => {
    switch (elementType) {
      case 'fire': return ['#ff2d55', '#ff5733', '#ff9500'];
      case 'spirit': return ['#0ea5e9', '#06b6d4', '#3b82f6'];
      case 'lightning': return ['#eab308', '#f59e0b', '#8b5cf6'];
      case 'earth': return ['#84cc16', '#22c55e', '#16a34a'];
      case 'shadow': return ['#8b5cf6', '#a855f7', '#c084fc'];
      default: return ['#64748b', '#475569', '#334155'];
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 monster-intro flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Layered Parallax Background */}
        <div className="absolute inset-0 parallax-bg" />
        <div className="absolute inset-0 parallax-layer-1" />
        <div className="absolute inset-0 parallax-layer-2" />
        
        {/* Particle Effects */}
        <ParticleField count={25} colors={getElementColors()} />
        
        {/* Dramatic Kanji Background */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="text-[20rem] font-black text-white/10 select-none">
            {elementType === 'fire' ? '炎' : 
             elementType === 'spirit' ? '水' : 
             elementType === 'lightning' ? '雷' : 
             elementType === 'earth' ? '地' : 
             elementType === 'shadow' ? '影' : '魔'}
          </div>
        </motion.div>

        {/* Monster Display */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-8">
          {/* Monster Name */}
          <motion.h1
            className="anime-title text-6xl md:text-8xl mb-4"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {monsterProfile.name}
          </motion.h1>

          {/* Element Type Badge */}
          <motion.div
            className="inline-block mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className={`px-8 py-3 rounded-2xl text-xl font-bold bg-gradient-to-r ${
              elementType === 'fire' ? 'from-red-500 to-orange-500' :
              elementType === 'spirit' ? 'from-blue-500 to-cyan-500' :
              elementType === 'lightning' ? 'from-yellow-500 to-purple-500' :
              elementType === 'earth' ? 'from-green-500 to-emerald-500' :
              elementType === 'shadow' ? 'from-purple-500 to-indigo-500' :
              'from-gray-500 to-slate-500'
            } text-white shadow-lg`}>
              {elementType.toUpperCase()} DEMON
            </div>
          </motion.div>

          {/* Monster Image */}
          <motion.div
            className="monster-entrance mb-8"
            initial={{ y: 100, scale: 0.8, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
          >
            <div className="relative">
              <img
                src={monsterImage}
                alt={monsterProfile.name}
                className="max-h-96 mx-auto object-contain drop-shadow-2xl"
                style={{
                  filter: `drop-shadow(0 0 30px ${getElementColors()[0]}40)`
                }}
              />
              
              {/* Glowing Aura */}
              <motion.div
                className="absolute inset-0 -z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: `radial-gradient(circle, ${getElementColors()[0]}30, transparent 70%)`
                }}
              />
            </div>
          </motion.div>

          {/* Monster Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="demon-card p-6">
              <h3 className="anime-subtitle text-xl mb-2">Curse Power</h3>
              <p className="text-3xl font-bold text-red-400">
                ${debt.amount.toLocaleString()}
              </p>
            </div>
            
            <div className="demon-card p-6">
              <h3 className="anime-subtitle text-xl mb-2">Health</h3>
              <p className="text-3xl font-bold text-amber-400">
                {debt.health}%
              </p>
            </div>
            
            <div className="demon-card p-6">
              <h3 className="anime-subtitle text-xl mb-2">Corruption</h3>
              <p className="text-3xl font-bold text-purple-400">
                {debt.interest}%
              </p>
            </div>
          </motion.div>

          {/* Battle Cry */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            <p className="anime-subtitle text-2xl italic text-center">
              "{monsterProfile.catchphrase}"
            </p>
          </motion.div>
        </div>

        {/* Screen Flash Effect */}
        {stage === 'exit' && (
          <motion.div
            className="absolute inset-0 bg-white z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MonsterIntroScreen;
