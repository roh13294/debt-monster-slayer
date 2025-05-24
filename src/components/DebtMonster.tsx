import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Debt } from '@/types/gameTypes';
import { getMonsterImage, getDemonElementType, getDemonRank } from '@/utils/monsterImages';
import { getMonsterProfile } from '@/utils/monsterProfiles';
import { Progress } from '@/components/ui/progress';
import { Flame, ShieldOff, Star } from 'lucide-react';
import AnimeCard from '@/components/ui/AnimeCard';
import AnimeButton from '@/components/ui/AnimeButton';
import ParticleField from '@/components/ui/ParticleField';

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
  
  const getElementParticleColors = () => {
    switch (elementType) {
      case 'fire': return ['#ff2d55', '#ff5733', '#ff9500'];
      case 'spirit': return ['#0ea5e9', '#06b6d4', '#3b82f6'];
      case 'lightning': return ['#eab308', '#f59e0b', '#8b5cf6'];
      case 'earth': return ['#84cc16', '#22c55e', '#16a34a'];
      case 'shadow': return ['#8b5cf6', '#a855f7', '#c084fc'];
      default: return ['#64748b', '#475569', '#334155'];
    }
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
    <AnimeCard
      rarity={debt.amount > 50000 ? 'legendary' : debt.amount > 25000 ? 'epic' : debt.amount > 10000 ? 'rare' : 'common'}
      glowing={isInBattle || ragePhase || frenzyPhase}
      onClick={onClick}
      className={`overflow-hidden transition-all duration-300 ${isInBattle ? 'scale-105' : ''}`}
    >
      <div className="relative">
        {/* Parallax Background */}
        <div className={`h-48 overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-800`}>
          <div className="absolute inset-0 parallax-bg opacity-60" />
          <div className="absolute inset-0 parallax-layer-1" />
          
          {/* Particle Effects */}
          {(ragePhase || frenzyPhase || isInBattle) && (
            <ParticleField 
              count={12} 
              colors={getElementParticleColors()} 
              className="opacity-70"
            />
          )}
          
          {/* Rage/Frenzy Aura */}
          {(ragePhase || frenzyPhase) && (
            <motion.div 
              className={`absolute inset-0 ${frenzyPhase ? 'bg-red-500/20' : 'bg-amber-500/20'}`}
              animate={{ 
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          {/* Monster Image */}
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
            animate={{ 
              y: [0, -8, 0],
              filter: ['drop-shadow(0 0 15px rgba(255,165,0,0.4))', 'drop-shadow(0 0 25px rgba(255,165,0,0.6))', 'drop-shadow(0 0 15px rgba(255,165,0,0.4))']
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <motion.img 
              src={monsterImage} 
              alt={debt.name} 
              className={`h-44 object-contain -mb-4 transition-all ${isInBattle ? 'scale-110' : ''}`}
              animate={isHit ? { 
                x: [-8, 8, -6, 6, 0],
                filter: ['brightness(2.5)', 'brightness(1)'] 
              } : {}}
              transition={{ duration: 0.4 }}
            />
          </motion.div>
          
          {/* Element Type Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${getElementColor()} text-white text-xs font-bold z-10 shadow-lg`}>
            {elementType.toUpperCase()}
          </div>
          
          {/* Rank Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white text-xs font-bold border border-slate-600 z-10 shadow-lg">
            {monsterRank}
          </div>
          
          {/* Status Badges */}
          {ragePhase && !frenzyPhase && (
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 top-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 z-10 shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Flame className="w-3 h-3" />
              RAGE MODE
            </motion.div>
          )}
          
          {frenzyPhase && (
            <motion.div 
              className="absolute left-1/2 transform -translate-x-1/2 top-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 z-10 shadow-lg"
              animate={{ 
                scale: [1, 1.15, 1],
                boxShadow: ['0 0 10px rgba(255, 0, 0, 0.5)', '0 0 20px rgba(255, 0, 0, 0.8)', '0 0 10px rgba(255, 0, 0, 0.5)']
              }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <ShieldOff className="w-3 h-3" />
              FRENZY
            </motion.div>
          )}
        </div>
        
        {/* Health Bar */}
        <div className="px-4 -mt-4 relative z-10">
          <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 backdrop-blur-sm">
            <Progress value={debt.health} className={`${getHealthColor()} h-2`} />
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="anime-subtitle text-xl font-bold text-white mb-1">
            {monsterProfile.name}
          </h3>
          <p className="text-sm text-slate-400 italic">
            "{monsterProfile.catchphrase}"
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <span className="text-slate-400 block text-xs">Curse Power</span>
            <span className="text-red-400 font-bold">
              ${debt.amount.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <span className="text-slate-400 block text-xs">Min Attack</span>
            <span className="text-amber-400 font-bold">
              ${debt.minimumPayment.toLocaleString()}
            </span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <span className="text-slate-400 block text-xs">Corruption</span>
            <span className="text-purple-400 font-bold">
              {debt.interest}%
            </span>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
            <span className="text-slate-400 block text-xs">Stress</span>
            <span className="text-orange-400 font-bold">
              {debt.psychologicalImpact}/10
            </span>
          </div>
        </div>
        
        {/* Battle Info */}
        {isInBattle && (
          <div className="bg-slate-900/80 rounded-xl p-4 mb-4 border border-slate-700">
            <p className="text-amber-400 text-sm font-bold mb-2 flex items-center gap-2">
              <Star className="w-4 h-4" />
              WEAKNESS: {monsterProfile.weakness}
            </p>
            <p className="text-slate-300 text-xs leading-relaxed mb-3">
              {monsterProfile.backstory.substring(0, 150)}...
            </p>
            <div className="flex items-center text-xs">
              <Star className="w-3 h-3 text-demon-gold mr-1" /> 
              <span className="text-demon-gold font-medium">
                XP Reward: ~{Math.ceil(debt.minimumPayment / debt.amount * 20)} per attack
              </span>
            </div>
          </div>
        )}
        
        {/* Action Button */}
        {!isInBattle && (
          <AnimeButton
            variant="demon"
            dramatic
            glowing
            className="w-full"
            onClick={onClick}
          >
            Enter Battle
          </AnimeButton>
        )}
      </div>
    </AnimeCard>
  );
};

export default DebtMonster;
