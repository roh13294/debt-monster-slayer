import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sword, ArrowRight, Sparkles, Shield, Flame } from 'lucide-react';
import { Debt } from '../types/gameTypes';
import { getMonsterProfile } from '../utils/monsterProfiles';

interface VictoryScreenProps {
  debt: Debt;
  paymentAmount: number;
  onClose: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ debt, paymentAmount, onClose }) => {
  const monsterProfile = getMonsterProfile(debt.name);
  const [showXpAnimation, setShowXpAnimation] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [unlockedReward, setUnlockedReward] = useState<string | null>(null);
  const [showSwordAnimation, setShowSwordAnimation] = useState(false);
  
  useEffect(() => {
    const baseXp = Math.floor(paymentAmount / 10);
    const interestMultiplier = debt.interest > 10 ? 1.5 : 1.2;
    const finalXp = Math.floor(baseXp * interestMultiplier);
    
    setShowSwordAnimation(true);
    
    setTimeout(() => {
      setShowSwordAnimation(false);
      setXpGained(finalXp);
      setShowXpAnimation(true);
    }, 1800);
    
    if (paymentAmount >= debt.amount * 0.5) {
      const rewards = [
        "Frugality Boost",
        "No-Spend Aura",
        "Gig Hustle Surge",
        "Budget Break",
        "Refinance Burst",
        "Auto-Pay Blade"
      ];
      setUnlockedReward(rewards[Math.floor(Math.random() * rewards.length)]);
    }
  }, [paymentAmount, debt]);
  
  const formatValue = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(amount) + " HP";
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-black to-gray-900 border-2 border-red-600 shadow-xl max-w-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="bg-red-600/10 absolute inset-0"></div>
          <div className="flame-container">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i}
                className="flame-element"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: 0.6,
                  filter: 'blur(8px)',
                }}
              />
            ))}
          </div>
          
          <div className="ink-splatter" style={{ top: '10%', right: '5%' }}></div>
          <div className="ink-splatter" style={{ bottom: '15%', left: '8%' }}></div>
          
          {showSwordAnimation && (
            <div className="sword-slash-animation z-30"></div>
          )}
        </div>
        
        <DialogHeader className="relative z-10">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.7)]">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-3xl font-bold mt-2 bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent font-display tracking-wider">
            DEBT DEMON VANQUISHED!
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-medium text-red-300">
            You've slain {monsterProfile.name} with your financial blade!
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative z-10 bg-black/60 backdrop-blur-sm rounded-xl p-4 mt-2 border border-red-800">
          <p className="text-center mb-4 italic text-amber-200 font-medium">
            "{monsterProfile.victoryMessage}"
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-indigo-900/40 p-3 rounded-lg text-center border border-indigo-700/50 shadow-[0_0_10px_rgba(79,70,229,0.3)]">
              <p className="text-sm text-indigo-300">Damage Dealt</p>
              <p className="text-2xl font-bold text-indigo-100">{formatValue(paymentAmount)}</p>
            </div>
            
            <div className="bg-purple-900/40 p-3 rounded-lg text-center border border-purple-700/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <p className="text-sm text-purple-300">Demon Slain</p>
              <p className="text-2xl font-bold text-purple-100">{formatValue(debt.amount)}</p>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r from-blue-900/40 to-cyan-900/40 p-3 rounded-lg text-center mt-3 border border-cyan-700/50 shadow-[0_0_15px_rgba(8,145,178,0.2)] 
            ${showXpAnimation ? 'animate-pulse' : ''}`}>
            <p className="text-sm text-cyan-300 flex items-center justify-center">
              <Star className="h-4 w-4 text-cyan-400 mr-1" /> 
              Breathing Technique XP
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent flex items-center justify-center">
              +{xpGained} XP
              {showXpAnimation && (
                <Sparkles className="h-5 w-5 text-cyan-300 ml-2 animate-spin" />
              )}
            </p>
          </div>
          
          {unlockedReward && (
            <div className="bg-gradient-to-r from-amber-900/40 to-orange-900/40 p-3 rounded-lg text-center mt-3 border border-amber-700/50 shadow-[0_0_15px_rgba(251,191,36,0.2)] animate-fade-in">
              <div className="flex items-center justify-center mb-1">
                <Flame className="h-5 w-5 text-orange-400 mr-1" /> 
                <p className="text-sm text-orange-300">New Breathing Technique Unlocked!</p>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-orange-300 to-amber-300 bg-clip-text text-transparent">{unlockedReward}</p>
              <p className="text-xs text-orange-400/90 mt-1">Channel this power in your next battle!</p>
            </div>
          )}
          
          <div className="flex items-center justify-center mt-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-5 w-5 text-yellow-500 fill-yellow-500"
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="relative z-10 flex flex-col gap-2">
          <p className="text-sm text-center text-gray-300 px-2">
            Your spiritual power grows! Continue your journey to defeat all debt demons.
          </p>
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-[0_0_10px_rgba(239,68,68,0.4)] text-white font-medium"
          >
            <Sword className="h-4 w-4 mr-2" />
            Continue Your Path
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .flame-element {
          position: absolute;
          width: 100px;
          height: 200px;
          background: radial-gradient(ellipse at bottom, rgba(255,80,0,0.8) 0%, rgba(255,0,0,0.4) 40%, rgba(255,0,0,0) 70%);
          border-radius: 50% 50% 20% 20%;
          transform-origin: center bottom;
          animation: flameAnimation 4s infinite ease-in-out;
        }
        
        @keyframes flameAnimation {
          0% { transform: scale(1) rotate(-2deg); opacity: 0.7; }
          50% { transform: scale(1.1) rotate(3deg); opacity: 0.9; }
          100% { transform: scale(1) rotate(-2deg); opacity: 0.7; }
        }
        
        .ink-splatter {
          position: absolute;
          width: 100px;
          height: 100px;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M30,50 Q40,20 50,30 Q60,40 70,35 Q80,30 75,50 Q70,70 50,75 Q30,80 30,50 Z" fill="rgba(255,0,0,0.2)"/></svg>');
          filter: blur(2px);
          opacity: 0.4;
          animation: rotate 20s infinite linear;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .sword-slash-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%);
          transform: skewX(-20deg);
          animation: swordSlash 1.8s cubic-bezier(0.36, 0.07, 0.19, 0.97);
          pointer-events: none;
        }
        
        @keyframes swordSlash {
          0% { transform: translateX(-100%) skewX(-20deg); }
          20% { transform: translateX(100%) skewX(-20deg); }
          20.1% { opacity: 1; }
          20.2% { opacity: 0; }
          40% { opacity: 0; }
          40.1% { transform: translateX(-100%) skewX(20deg); opacity: 0; }
          40.2% { opacity: 1; }
          60% { transform: translateX(100%) skewX(20deg); opacity: 1; }
          60.1% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        @font-face {
          font-family: 'AnimeDisplay';
          src: local('Arial');
          /* In a real app you would add a custom font here */
        }
        
        .font-display {
          font-family: 'AnimeDisplay', sans-serif;
          letter-spacing: 0.05em;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </Dialog>
  );
};

export default VictoryScreen;
