
import React, { useEffect, useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { Sword, Shield, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMonsterImage, getDemonElementType, getDemonRank } from '@/utils/monsterImages';
import { gameTerms } from '@/utils/gameTerms';
import { AnimatedSlash, ElementalBurst, EnergyWave } from './BattleEffects';

interface BattleArenaProps {
  stance: string | null;
  onComplete: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({ stance, onComplete }) => {
  const { debts } = useGameContext();
  const [battleProgress, setBattleProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [showSlash, setShowSlash] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [burstElement, setBurstElement] = useState<'fire' | 'water' | 'lightning' | 'earth' | 'shadow'>('fire');
  const [battlePhase, setBattlePhase] = useState<'approach' | 'engage' | 'victory'>('approach');
  
  // Simple animation effect for battle progress
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        if (battleProgress < 33 && battlePhase === 'approach') {
          setBattleProgress(prev => prev + 10);
          
          if (battleProgress + 10 >= 33) {
            setBattlePhase('engage');
            
            // Show slash animation when entering engage phase
            setTimeout(() => {
              setShowSlash(true);
              
              // After slash, show elemental burst based on stance
              setTimeout(() => {
                setShowBurst(true);
                if (stance === 'aggressive') setBurstElement('fire');
                else if (stance === 'defensive') setBurstElement('water');
                else if (stance === 'risky') setBurstElement('lightning');
                else setBurstElement('earth');
              }, 700);
            }, 500);
          }
        } 
        else if (battleProgress < 67 && battlePhase === 'engage') {
          setBattleProgress(prev => prev + 7);
          
          if (battleProgress + 7 >= 67) {
            setBattlePhase('victory');
          }
        }
        else if (battleProgress < 100 && battlePhase === 'victory') {
          setBattleProgress(prev => Math.min(prev + 5, 100));
        } 
        else if (battleProgress >= 100) {
          setIsAnimating(false);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [battleProgress, isAnimating, battlePhase, stance]);
  
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
  
  const getBattlePhaseText = () => {
    switch (battlePhase) {
      case 'approach':
        return "Approaching demons...";
      case 'engage':
        return "Engaging in combat!";
      case 'victory':
        return "Claiming victory!";
      default:
        return "Battle in progress...";
    }
  };
  
  return (
    <div className="min-h-[70vh] relative overflow-hidden bg-slate-900 rounded-lg border border-slate-700">
      {/* Battle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5"></div>
        <div className="absolute inset-0 opacity-30">
          {/* Animated elements */}
          <div className="absolute h-2 w-2 rounded-full bg-yellow-400 animate-pulse top-1/4 left-1/4"></div>
          <div className="absolute h-3 w-3 rounded-full bg-blue-400 animate-float top-3/4 left-2/3"></div>
          <div className="absolute h-2 w-2 rounded-full bg-purple-400 animate-float-slow top-2/3 left-1/3"></div>
        </div>
      </div>
      
      <EnergyWave color={stance === 'aggressive' ? 'red' : stance === 'defensive' ? 'blue' : stance === 'risky' ? 'purple' : 'yellow'} />
      
      {/* Slash effect animation */}
      <AnimatedSlash 
        isActive={showSlash} 
        onComplete={() => setShowSlash(false)} 
      />
      
      {/* Elemental burst animation */}
      <ElementalBurst 
        element={burstElement} 
        isActive={showBurst}
        onComplete={() => setShowBurst(false)}
      />
      
      {/* Battle content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-16 px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">Demon Encounter</h2>
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${getStanceClass()}`}>
              {getStanceIcon()}
            </div>
            <p className="text-xl text-white">Using {stance === 'aggressive' ? 'Flame' : stance === 'defensive' ? 'Water' : stance === 'risky' ? 'Thunder' : 'Beast'} Breathing</p>
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
          <p className="text-center text-white mt-2">{getBattlePhaseText()}</p>
        </div>
        
        {/* Enemy overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-8">
          <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg text-white mb-2">Current Demons</h3>
            <div className="flex flex-wrap gap-2">
              {debts.length > 0 ? debts.slice(0, 3).map((debt, idx) => (
                <div key={debt.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 relative">
                    <img 
                      src={getMonsterImage(debt.name)}
                      alt={debt.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-slate-300">{debt.name.split(' ')[0]}</span>
                  {idx < Math.min(debts.length, 3) - 1 && <span className="text-slate-500">•</span>}
                </div>
              )) : (
                <p className="text-sm text-green-400">No demons remaining!</p>
              )}
            </div>
          </div>
          
          <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg text-white mb-2">Battle Effects</h3>
            <p className="text-sm text-slate-300">
              {stance === 'aggressive' && 'Flame Breathing: Spirit Strikes +15% effective'}
              {stance === 'defensive' && 'Water Breathing: Power Seals reinforced by 5%'}
              {stance === 'risky' && 'Thunder Breathing: Unpredictable combat outcomes'}
            </p>
          </div>
        </div>
        
        {/* Continue button */}
        {!isAnimating && (
          <Button 
            onClick={onComplete}
            className={`bg-gradient-to-br ${getStanceClass()} hover:opacity-90 text-white`}
          >
            Complete Moon Cycle
          </Button>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
