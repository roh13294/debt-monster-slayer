
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import { Sword, ShieldAlert, ArrowLeft, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { Button } from './ui/button';

const MonsterBattle: React.FC = () => {
  const { debts } = useGameContext();
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [battleMode, setBattleMode] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);

  // Handle navigation between monsters
  const nextMonster = () => {
    setCurrentMonsterIndex((prev) => (prev + 1) % debts.length);
  };

  const prevMonster = () => {
    setCurrentMonsterIndex((prev) => (prev - 1 + debts.length) % debts.length);
  };

  const toggleBattleMode = () => {
    setBattleMode(!battleMode);
  };

  // Randomly animate the title for fun
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimateTitle(true);
      setTimeout(() => setAnimateTitle(false), 1000);
    }, 7000);
    
    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="card-fun relative overflow-hidden group">
      {/* Fun animated background elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-fun-purple/30 to-fun-magenta/30 rounded-full animate-pulse-subtle"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-fun-blue/30 to-fun-green/30 rounded-full animate-pulse-subtle"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-br from-fun-yellow/5 to-fun-orange/5 rounded-full animate-pulse-subtle"></div>
      
      <div className="relative">
        <h2 className={`text-xl font-bold mb-4 flex items-center ${animateTitle ? 'animate-tada' : ''}`}>
          <span className="p-1.5 bg-gradient-to-br from-fun-purple to-fun-magenta text-white rounded-md mr-2 transform group-hover:rotate-12 transition-transform animate-wiggle">
            <Sword size={18} className="animate-sparkle" />
          </span>
          <span className="bg-gradient-to-r from-fun-purple to-fun-magenta bg-clip-text text-transparent">
            Debt Monster Battle
          </span>
          <Sparkles size={16} className="ml-2 text-fun-yellow animate-sparkle" />
        </h2>
        
        {debts.length === 0 ? (
          <div className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 animate-pulse-subtle">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fun-green to-fun-blue text-white mb-4 animate-bounce-fun">
              <ShieldAlert size={24} />
            </div>
            <p className="text-lg font-medium mb-2 bg-gradient-to-r from-fun-green to-fun-blue bg-clip-text text-transparent">No Debt Monsters Found!</p>
            <p className="text-gray-600">You've defeated all your debt monsters. Congratulations!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between mb-4">
              <Button 
                onClick={toggleBattleMode}
                className={`transition-all animate-pulse-subtle ${battleMode ? 
                  'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' : 
                  'bg-gradient-to-r from-fun-purple to-fun-magenta hover:from-fun-purple/90 hover:to-fun-magenta/90'
                } text-white hover:shadow-lg`}
              >
                {battleMode ? 
                  <><ShieldAlert size={16} className="mr-1" /> Exit Battle</> : 
                  <><Sword size={16} className="mr-1" /> Enter Battle Mode <Zap size={14} className="ml-1 animate-pulse" /></>
                }
              </Button>

              {battleMode && (
                <div className="flex gap-2 bg-white/30 backdrop-blur-sm p-1 rounded-lg animate-pulse-subtle">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={prevMonster} 
                    disabled={debts.length <= 1}
                    className="hover:bg-fun-purple/20"
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  <span className="text-sm font-medium py-2 px-2 bg-white/50 backdrop-blur-sm rounded-md">
                    {currentMonsterIndex + 1} / {debts.length}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={nextMonster} 
                    disabled={debts.length <= 1}
                    className="hover:bg-fun-purple/20"
                  >
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </div>

            {battleMode ? (
              debts.length > 0 && (
                <div className="battle-arena bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-xl transition-all duration-500 transform hover:scale-[1.01] shadow-xl border border-fun-purple/30 animate-pulse-subtle">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fun-purple/10 via-transparent to-transparent opacity-70"></div>
                  <div className="relative">
                    <DebtMonster 
                      key={debts[currentMonsterIndex].id} 
                      debt={debts[currentMonsterIndex]} 
                      isInBattle={true} 
                    />
                  </div>
                </div>
              )
            ) : (
              <div className="space-y-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10 rounded-xl"></div>
                {debts.map((debt, index) => (
                  <div 
                    key={debt.id} 
                    className={`transform transition-all duration-300 hover:scale-[1.02] ${
                      index % 2 === 0 ? 'animate-pulse-subtle' : ''
                    }`}
                  >
                    <DebtMonster debt={debt} isInBattle={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonsterBattle;
