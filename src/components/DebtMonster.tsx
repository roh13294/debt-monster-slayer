
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Debt } from '@/types/gameTypes';
import { getMonsterImage, getDemonElementType, getDemonRank } from '@/utils/monsterImages';
import { getMonsterProfile } from '@/utils/monsterProfiles';
import { Progress } from '@/components/ui/progress';
import { Flame, ShieldOff, Star } from 'lucide-react';

interface DebtMonsterProps {
  debt: Debt;
  onClick?: () => void;
  isInBattle?: boolean;
  ragePhase?: boolean;
  frenzyPhase?: boolean;
}

const DebtMonster: React.FC<DebtMonsterProps> = ({ 
  debt, 
  onClick, 
  isInBattle = false,
  ragePhase = false,
  frenzyPhase = false
}) => {
  const monsterImage = getMonsterImage(debt.name);
  const elementType = getDemonElementType(debt.name);
  const monsterRank = getDemonRank(debt.amount);
  const monsterProfile = getMonsterProfile(debt.name);
  
  const [isHit, setIsHit] = useState(false);
  
  useEffect(() => {
    if (isHit) {
      const timer = setTimeout(() => setIsHit(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isHit]);
  
  const simulateHit = () => {
    setIsHit(true);
  };
  
  React.useEffect(() => {
    if (window && isInBattle) {
      window.hitMonster = simulateHit;
    }
    return () => {
      if (window) {
        delete window.hitMonster;
      }
    };
  }, [isInBattle]);
  
  const getElementColor = () => {
    switch (elementType) {
      case 'fire': return 'from-red-600 to-orange-600';
      case 'spirit': return 'from-blue-600 to-cyan-600';
      case 'lightning': return 'from-purple-600 to-indigo-600';
      case 'earth': return 'from-amber-700 to-yellow-600';
      case 'shadow': return 'from-purple-900 to-purple-700';
      default: return 'from-slate-600 to-gray-700';
    }
  };
  
  const getHealthColor = () => {
    const health = debt.health;
    if (health > 70) return 'bg-red-500';
    if (health > 30) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const getInterestDescription = () => {
    if (debt.interest > 15) return 'Extremely High';
    if (debt.interest > 10) return 'High';
    if (debt.interest > 5) return 'Moderate';
    return 'Low';
  };
  
  const formatValue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(amount) + " HP";
  };

  // Calculate potential XP reward based on debt amount
  const calculatePotentialXP = () => {
    // Base XP for a standard attack (approximate)
    const baseXP = Math.ceil(debt.minimumPayment / debt.amount * 20);
    // XP for defeating the demon
    const defeatBonus = Math.ceil(debt.amount / 100);
    return `~${baseXP} per attack, +${defeatBonus} bonus`;
  };
  
  const getRageStyles = () => {
    if (frenzyPhase) {
      return {
        containerClass: 'border-red-600 shadow-lg shadow-red-900/30',
        pulseClass: 'animate-[pulse_0.8s_ease-in-out_infinite]',
        glowClass: 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-red-900/30 before:to-transparent before:z-0',
        backgroundClass: 'from-red-950 to-slate-900'
      };
    }
    
    if (ragePhase) {
      return {
        containerClass: 'border-amber-600',
        pulseClass: 'animate-[pulse_1.2s_ease-in-out_infinite]',
        glowClass: 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-amber-900/20 before:to-transparent before:z-0',
        backgroundClass: 'from-amber-950 to-slate-900'
      };
    }
    
    return {
      containerClass: '',
      pulseClass: '',
      glowClass: '',
      backgroundClass: 'from-slate-900 to-slate-800'
    };
  };
  
  const rageStyles = getRageStyles();
  
  return (
    <motion.div 
      className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative ${isInBattle ? 'scale-105' : ''} ${rageStyles.containerClass}`}
      whileHover={{ scale: isInBattle ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className={`h-40 overflow-hidden bg-gradient-to-br ${rageStyles.backgroundClass} relative ${isInBattle ? rageStyles.pulseClass : ''} ${rageStyles.glowClass}`}>
          <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10 z-0"></div>
          
          {(ragePhase || frenzyPhase) && (
            <motion.div 
              className={`absolute inset-0 z-0 ${frenzyPhase ? 'bg-red-500/10' : 'bg-amber-500/10'}`}
              animate={{ 
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
            animate={{ 
              y: [0, -5, 0],
              filter: ['drop-shadow(0 0 10px rgba(255,165,0,0.3))', 'drop-shadow(0 0 15px rgba(255,165,0,0.5))', 'drop-shadow(0 0 10px rgba(255,165,0,0.3))']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.img 
              src={monsterImage} 
              alt={debt.name} 
              className={`h-40 object-contain -mb-4 group-hover:-mb-6 transition-all transform group-hover:scale-110 ${isInBattle ? 'scale-110' : ''}`}
              animate={isHit ? { 
                x: [-5, 5, -3, 3, 0],
                filter: ['brightness(2)', 'brightness(1)'] 
              } : {}}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r ${getElementColor()} text-white text-xs font-medium z-10`}>
            {elementType} Type
          </div>
          
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white text-xs font-medium border border-slate-600 z-10">
            {monsterRank}
          </div>
          
          {ragePhase && !frenzyPhase && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-3 bg-amber-600 text-black font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
              <Flame className="w-3 h-3" />
              RAGE
            </div>
          )}
          
          {frenzyPhase && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-3 bg-red-600 text-white font-bold text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 animate-pulse">
              <ShieldOff className="w-3 h-3" />
              FRENZY
            </div>
          )}
        </div>
        
        <div className="px-3 -mt-3 relative z-10">
          <div className="bg-slate-700 p-1 rounded-full">
            <Progress value={debt.health} className={getHealthColor()} />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-white mb-1">{monsterProfile.name}</h3>
        <p className="text-xs text-slate-400 mb-3">{monsterProfile.catchphrase}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-3">
          <div>
            <span className="text-slate-400">Curse Power:</span> {formatValue(debt.amount)}
          </div>
          <div>
            <span className="text-slate-400">Min Attack:</span> {formatValue(debt.minimumPayment)}
          </div>
          <div>
            <span className="text-slate-400">Corruption:</span> {getInterestDescription()}
          </div>
          <div>
            <span className="text-slate-400">Willpower Strain:</span> {debt.psychologicalImpact}/10
          </div>
        </div>
        
        {isInBattle && (
          <div className="bg-slate-900/60 rounded p-2 mb-3 border border-slate-800">
            <p className="text-amber-400 text-xs font-medium">WEAKNESS: {monsterProfile.weakness}</p>
            <p className="text-slate-400 text-xs italic mt-1">{monsterProfile.backstory.substring(0, 120)}...</p>
            <div className="mt-2 flex items-center text-xs">
              <Star className="w-3 h-3 text-demon-gold mr-1" /> 
              <span className="text-demon-gold">XP Reward: {calculatePotentialXP()}</span>
            </div>
          </div>
        )}
        
        {!isInBattle && (
          <button className="w-full px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm rounded-md font-medium transition-colors">
            Attack This Demon
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DebtMonster;
