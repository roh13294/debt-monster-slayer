
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import { Sword, ShieldAlert, ArrowLeft, ArrowRight, Sparkles, Zap, Target, Trophy, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from "@/hooks/use-toast";

const MonsterBattle: React.FC = () => {
  const { debts, specialMoves, monthsPassed } = useGameContext();
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [battleMode, setBattleMode] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);
  const [showBattleTips, setShowBattleTips] = useState(false);
  const [battleStreak, setBattleStreak] = useState(0);

  // Check for player level based on months passed
  const playerLevel = Math.max(1, Math.floor(monthsPassed / 3) + 1);
  
  // Handle navigation between monsters
  const nextMonster = () => {
    setCurrentMonsterIndex((prev) => (prev + 1) % debts.length);
    // Add battle streak if in battle mode
    if (battleMode) {
      setBattleStreak(prev => prev + 1);
      if (battleStreak + 1 >= 3) {
        toast({
          title: "Battle Streak!",
          description: "You've battled 3 monsters in a row! +1 Special Move unlocked!",
          variant: "default",
        });
      }
    }
  };

  const prevMonster = () => {
    setCurrentMonsterIndex((prev) => (prev - 1 + debts.length) % debts.length);
  };

  const toggleBattleMode = () => {
    if (!battleMode) {
      setBattleMode(true);
      toast({
        title: "Battle Mode Activated!",
        description: "Target a debt monster and attack it directly to reduce your debt faster!",
        variant: "default",
      });
    } else {
      setBattleMode(false);
      // Reset battle streak when exiting
      setBattleStreak(0);
    }
  };

  // Randomly animate the title for fun
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimateTitle(true);
      setTimeout(() => setAnimateTitle(false), 1000);
    }, 7000);
    
    return () => clearInterval(animationInterval);
  }, []);

  // Check if first time in battle mode
  useEffect(() => {
    if (battleMode && localStorage.getItem('firstBattle') !== 'completed') {
      setShowBattleTips(true);
      localStorage.setItem('firstBattle', 'completed');
    }
  }, [battleMode]);

  return (
    <div className="card-fun relative overflow-hidden group">
      {/* Fun animated background elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-fun-purple/30 to-fun-magenta/30 rounded-full animate-pulse-subtle"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-fun-blue/30 to-fun-green/30 rounded-full animate-pulse-subtle"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-br from-fun-yellow/5 to-fun-orange/5 rounded-full animate-pulse-subtle"></div>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold flex items-center ${animateTitle ? 'animate-tada' : ''}`}>
            <span className="p-1.5 bg-gradient-to-br from-fun-purple to-fun-magenta text-white rounded-md mr-2 transform group-hover:rotate-12 transition-transform animate-wiggle">
              <Sword size={18} className="animate-sparkle" />
            </span>
            <span className="bg-gradient-to-r from-fun-purple to-fun-magenta bg-clip-text text-transparent">
              Debt Monster Battle
            </span>
            <Sparkles size={16} className="ml-2 text-fun-yellow animate-sparkle" />
          </h2>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gradient-to-r from-purple-100 to-indigo-100 px-2 py-1 rounded-full text-xs">
              <Crown size={14} className="mr-1 text-fun-purple" />
              <span className="font-medium">Level {playerLevel}</span>
            </div>
            
            {battleStreak > 0 && (
              <div className="flex items-center bg-gradient-to-r from-orange-100 to-yellow-100 px-2 py-1 rounded-full text-xs animate-pulse-subtle">
                <Zap size={14} className="mr-1 text-fun-orange" />
                <span className="font-medium">Streak: {battleStreak}</span>
              </div>
            )}
            
            {specialMoves > 0 && (
              <div className="flex items-center bg-gradient-to-r from-red-100 to-pink-100 px-2 py-1 rounded-full text-xs">
                <Target size={14} className="mr-1 text-fun-magenta" />
                <span className="font-medium">Specials: {specialMoves}</span>
              </div>
            )}
          </div>
        </div>
        
        {debts.length === 0 ? (
          <div className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 animate-pulse-subtle">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fun-green to-fun-blue text-white mb-4 animate-bounce-fun">
              <Trophy size={24} />
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

            {/* Battle tips for first-time users */}
            {showBattleTips && battleMode && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 mb-4 animate-fade-in relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowBattleTips(false)}
                >
                  ✕
                </Button>
                <h3 className="font-bold text-sm mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-1 text-fun-purple" />
                  Battle Tips
                </h3>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                  <li>Use the <strong>slider</strong> to set your payment amount</li>
                  <li>Attack quickly in succession for <strong>bonus combo damage</strong></li>
                  <li>Save <strong>Special Moves</strong> for large debts</li>
                  <li>Battle all monsters in a row to earn <strong>streak bonuses</strong></li>
                </ul>
              </div>
            )}

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
