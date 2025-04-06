
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { Sword, Shield, Flame, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface BattleArenaProps {
  stance: string | null;
  onComplete: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({ stance, onComplete }) => {
  const { debts } = useGameContext();
  const [battleProgress, setBattleProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Simple animation effect for battle progress
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        if (battleProgress < 100) {
          setBattleProgress(prev => Math.min(prev + 10, 100));
        } else {
          setIsAnimating(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [battleProgress, isAnimating]);
  
  const getStanceIcon = () => {
    switch (stance) {
      case 'aggressive':
        return <Sword className="w-8 h-8 text-red-500" />;
      case 'defensive':
        return <Shield className="w-8 h-8 text-blue-500" />;
      case 'risky':
        return <Zap className="w-8 h-8 text-purple-500" />;
      default:
        return <Flame className="w-8 h-8 text-amber-500" />;
    }
  };
  
  const getStanceClass = () => {
    switch (stance) {
      case 'aggressive':
        return 'from-red-600 to-red-900';
      case 'defensive':
        return 'from-blue-600 to-blue-900';
      case 'risky':
        return 'from-purple-600 to-purple-900';
      default:
        return 'from-amber-600 to-amber-900';
    }
  };
  
  return (
    <div className="min-h-[70vh] relative overflow-hidden bg-slate-900 rounded-lg border border-slate-700">
      {/* Battle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* Animated elements */}
          <div className="absolute h-2 w-2 rounded-full bg-yellow-400 animate-pulse top-1/4 left-1/4"></div>
          <div className="absolute h-3 w-3 rounded-full bg-blue-400 animate-float top-3/4 left-2/3"></div>
          <div className="absolute h-2 w-2 rounded-full bg-purple-400 animate-float-slow top-2/3 left-1/3"></div>
        </div>
      </div>
      
      {/* Battle content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-16 px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">Financial Battle</h2>
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${getStanceClass()}`}>
              {getStanceIcon()}
            </div>
            <p className="text-xl text-white">Using {stance || "balanced"} stance</p>
          </div>
        </motion.div>
        
        {/* Battle progress bar */}
        <div className="w-full max-w-lg mb-12">
          <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full bg-gradient-to-r ${getStanceClass()}`}
              initial={{ width: '0%' }}
              animate={{ width: `${battleProgress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <p className="text-center text-white mt-2">Battle progress: {battleProgress}%</p>
        </div>
        
        {/* Enemy overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-8">
          <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg text-white mb-2">Financial Enemies</h3>
            <p className="text-sm text-slate-300">{debts.length} debt monsters remaining</p>
          </div>
          
          <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg text-white mb-2">Battle Effects</h3>
            <p className="text-sm text-slate-300">
              {stance === 'aggressive' && 'Debt payments +15% effective'}
              {stance === 'defensive' && 'Savings increased by 5%'}
              {stance === 'risky' && 'Unpredictable outcomes possible'}
            </p>
          </div>
        </div>
        
        {/* Continue button */}
        {!isAnimating && (
          <Button 
            onClick={onComplete}
            className={`bg-gradient-to-br ${getStanceClass()} hover:opacity-90 text-white`}
          >
            Complete Month
          </Button>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
