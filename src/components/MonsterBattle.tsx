import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import DebtMonster from './DebtMonster';
import { Button } from '@/components/ui/button';
import { X, Sword, Sparkles, Volume2, VolumeX, Info, Crown, Zap, Target, Trophy, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface MonsterBattleProps {
  debtId: string;
  onClose: () => void;
}

const MonsterBattle: React.FC<MonsterBattleProps> = ({ debtId, onClose }) => {
  const { debts, specialMoves, monthsPassed } = useGameContext();
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [battleMode, setBattleMode] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);
  const [showBattleTips, setShowBattleTips] = useState(false);
  const [battleStreak, setBattleStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const playerLevel = Math.max(1, Math.floor(monthsPassed / 3) + 1);

  const nextMonster = () => {
    setCurrentMonsterIndex((prev) => (prev + 1) % debts.length);
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
      setBattleStreak(0);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      toast({
        title: "Sound Effects Enabled",
        description: "Battle sounds are now on! Attack with audio feedback.",
        variant: "default",
      });
    } else {
      toast({
        title: "Sound Effects Disabled",
        description: "Battle sounds are now off.",
        variant: "default",
      });
    }
  };

  const handleMonsterClick = (debtId: string) => {
    // Handle monster click logic here
  };

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimateTitle(true);
      setTimeout(() => setAnimateTitle(false), 1000);
    }, 7000);
    
    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    if (battleMode && localStorage.getItem('firstBattle') !== 'completed') {
      setShowBattleTips(true);
      localStorage.setItem('firstBattle', 'completed');
    }
  }, [battleMode]);

  return (
    <div className="card-fun relative overflow-hidden group">
      {soundEnabled && (
        <>
          <audio id="attack-sound" src="https://assets.mixkit.co/sfx/preview/mixkit-swift-sword-strike-2166.mp3"></audio>
          <audio id="combo-sound" src="https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3"></audio>
          <audio id="special-sound" src="https://assets.mixkit.co/sfx/preview/mixkit-magic-sweep-game-trophy-257.mp3"></audio>
          <audio id="monster-sound" src="https://assets.mixkit.co/sfx/preview/mixkit-monster-growl-1993.mp3"></audio>
        </>
      )}
      
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-fun-purple/30 to-fun-magenta/30 rounded-full animate-pulse-subtle"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-fun-blue/30 to-fun-green/30 rounded-full animate-pulse-subtle"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-br from-fun-yellow/5 to-fun-orange/5 rounded-full animate-pulse-subtle"></div>
      
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold flex items-center ${animateTitle ? 'animate-tada' : ''}`}>
            <span className="p-1.5 bg-gradient-to-br from-fun-purple to-fun-magenta text-white rounded-md mr-2 transform group-hover:rotate-12 transition-transform animate-wiggle">
              <Sword className="w-4 h-4" />
            </span>
            <span className="bg-gradient-to-r from-fun-purple to-fun-magenta bg-clip-text text-transparent">
              Debt Monster Battle
            </span>
            <Sparkles className="w-4 h-4 ml-2 text-fun-yellow animate-sparkle" />
          </h2>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSound}
              className="flex items-center justify-center p-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-all"
              title={soundEnabled ? "Turn sound off" : "Turn sound on"}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-green-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            <button
              onClick={() => setShowTutorial(true)}
              className="flex items-center justify-center p-1 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-all"
              title="Show tutorial"
            >
              <Info className="w-4 h-4 text-blue-600" />
            </button>
            
            <div className="flex items-center bg-gradient-to-r from-purple-100 to-indigo-100 px-2 py-1 rounded-full text-xs">
              <Crown className="w-3.5 h-3.5 mr-1 text-fun-purple" />
              <span className="font-medium">Level {playerLevel}</span>
            </div>
            
            {battleStreak > 0 && (
              <div className="flex items-center bg-gradient-to-r from-orange-100 to-yellow-100 px-2 py-1 rounded-full text-xs animate-pulse-subtle">
                <Zap className="w-3.5 h-3.5 mr-1 text-fun-orange" />
                <span className="font-medium">Streak: {battleStreak}</span>
              </div>
            )}
            
            {specialMoves > 0 && (
              <div className="flex items-center bg-gradient-to-r from-red-100 to-pink-100 px-2 py-1 rounded-full text-xs">
                <Target className="w-3.5 h-3.5 mr-1 text-fun-magenta" />
                <span className="font-medium">Specials: {specialMoves}</span>
              </div>
            )}
          </div>
        </div>
        
        {showTutorial && (
          <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <Sword className="w-5 h-5 inline-block text-fun-purple mr-2" />
                  Debt Monster Battle Guide
                </DialogTitle>
                <DialogDescription>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1">Battle Mode</h4>
                      <p className="text-sm text-gray-700">Activate Battle Mode to directly target and attack your debt monsters one at a time.</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1">Making Payments</h4>
                      <p className="text-sm text-gray-700">Use the slider to adjust your payment amount, then click "Attack" to reduce your debt.</p>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1">Combo Attacks</h4>
                      <p className="text-sm text-gray-700">Attack quickly in succession to build a combo that increases damage.</p>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1">Special Moves</h4>
                      <p className="text-sm text-gray-700">Use Special Moves to reduce a debt's interest rate, making it easier to pay off.</p>
                    </div>
                    
                    <div className="bg-red-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1">Battle Streaks</h4>
                      <p className="text-sm text-gray-700">Battle multiple monsters in a row to earn streak bonuses, including special moves.</p>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h4 className="font-medium mb-1">Monster Reactions</h4>
                      <p className="text-sm text-gray-700">Monsters will react to your attacks and occasionally taunt you or counter-attack.</p>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button onClick={() => setShowTutorial(false)}>
                  Got it!
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {debts.length === 0 ? (
          <div className="p-8 text-center bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100 animate-pulse-subtle">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fun-green to-fun-blue text-white mb-4 animate-bounce-fun">
              <Trophy className="w-6 h-6" />
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
                  <><ShieldAlert className="w-4 h-4 mr-1" /> Exit Battle</> : 
                  <><Sword className="w-4 h-4 mr-1" /> Enter Battle Mode <Zap className="w-3.5 h-3.5 ml-1 animate-pulse" /></>
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
                    <ArrowLeft className="w-4 h-4" />
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
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

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
                    <DebtMonster
                      debt={debt}
                      isInBattle={false}
                      onClick={() => handleMonsterClick(debt.id)}
                    />
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
