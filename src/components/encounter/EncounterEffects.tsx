
import React from 'react';
import { motion } from 'framer-motion';
import { EnergyWave } from '../battle/BattleEffects';

export const EncounterBackdrop: React.FC<{ stance: string }> = ({ stance }) => {
  const getBackdropEffect = () => {
    switch (stance) {
      case 'aggressive':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-black"></div>
            <motion.div 
              className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-radial from-red-500/30 to-transparent"
              initial={{ scale: 0.6 }}
              animate={{ scale: [0.6, 0.9, 0.7], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10"></div>
            <EnergyWave color="red" />
          </>
        );
        
      case 'defensive':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-black"></div>
            <motion.div 
              className="absolute inset-0 bg-[url('/images/wave-pattern.png')] bg-repeat-x bg-bottom opacity-20"
              animate={{ backgroundPositionX: ['0%', '100%'] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10"></div>
            <EnergyWave color="blue" />
          </>
        );
        
      case 'risky':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-black"></div>
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute w-px h-[30vh] bg-purple-400 opacity-40"
                  style={{ 
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    rotate: `${Math.random() * 90}deg`
                  }}
                  initial={{ opacity: 0.4, height: 0 }}
                  animate={{ 
                    opacity: [0.4, 0.8, 0], 
                    height: ['0vh', '30vh', '0vh']
                  }}
                  transition={{ 
                    duration: 0.8 + Math.random() * 2,
                    delay: Math.random() * 5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 5
                  }}
                />
              ))}
            </motion.div>
            <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10"></div>
            <EnergyWave color="purple" />
          </>
        );
        
      default:
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-purple-800/20 to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10"></div>
            <EnergyWave color="yellow" />
          </>
        );
    }
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {getBackdropEffect()}
    </div>
  );
};
