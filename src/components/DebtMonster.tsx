
import React from 'react';
import { motion } from 'framer-motion';
import { Debt } from '@/types/gameTypes';
import { getMonsterImage, getDemonElementType, getDemonRank } from '@/utils/monsterImages';
import { getMonsterProfile } from '@/utils/monsterProfiles';
import { Progress } from '@/components/ui/progress';

interface DebtMonsterProps {
  debt: Debt;
  onClick?: () => void;
}

const DebtMonster: React.FC<DebtMonsterProps> = ({ debt, onClick }) => {
  const monsterImage = getMonsterImage(debt.name);
  const elementType = getDemonElementType(debt.name);
  const monsterRank = getDemonRank(debt.amount);
  const monsterProfile = getMonsterProfile(debt.name);
  
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
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <motion.div 
      className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Demon image */}
        <div className="h-40 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 relative">
          <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10"></div>
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, -5, 0],
              filter: ['drop-shadow(0 0 10px rgba(255,165,0,0.3))', 'drop-shadow(0 0 15px rgba(255,165,0,0.5))', 'drop-shadow(0 0 10px rgba(255,165,0,0.3))']
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <img 
              src={monsterImage} 
              alt={debt.name} 
              className="h-40 object-contain -mb-4 group-hover:-mb-6 transition-all transform group-hover:scale-110"
            />
          </motion.div>
          
          {/* Element type badge */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full bg-gradient-to-r ${getElementColor()} text-white text-xs font-medium`}>
            {elementType} Type
          </div>
          
          {/* Monster rank badge */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-gradient-to-r from-slate-700 to-slate-800 text-white text-xs font-medium border border-slate-600">
            {monsterRank}
          </div>
        </div>
        
        {/* Health bar */}
        <div className="px-3 -mt-3 relative z-10">
          <div className="bg-slate-700 p-1 rounded-full">
            <Progress value={debt.health} className={getHealthColor()} />
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {/* Monster name */}
        <h3 className="font-bold text-white mb-1">{monsterProfile.name}</h3>
        <p className="text-xs text-slate-400 mb-3">{monsterProfile.catchphrase}</p>
        
        {/* Monster stats */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-3">
          <div>
            <span className="text-slate-400">Curse Power:</span> {formatCurrency(debt.amount)}
          </div>
          <div>
            <span className="text-slate-400">Min Attack:</span> {formatCurrency(debt.minimumPayment)}
          </div>
          <div>
            <span className="text-slate-400">Corruption:</span> {getInterestDescription()}
          </div>
          <div>
            <span className="text-slate-400">Mental Damage:</span> {debt.psychologicalImpact}/10
          </div>
        </div>
        
        {/* Attack button */}
        <button className="w-full px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm rounded-md font-medium transition-colors">
          Attack This Demon
        </button>
      </div>
    </motion.div>
  );
};

export default DebtMonster;
