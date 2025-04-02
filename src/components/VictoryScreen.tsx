
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sword, ArrowRight, XP, Sparkles, Shield, Flame } from 'lucide-react';
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
  
  // Calculate XP based on payment amount and debt type
  useEffect(() => {
    // Base XP calculation
    const baseXp = Math.floor(paymentAmount / 10);
    // Bonus XP for higher interest debts
    const interestMultiplier = debt.interest > 10 ? 1.5 : 1.2;
    // Final XP calculation
    const finalXp = Math.floor(baseXp * interestMultiplier);
    
    // Delay the XP animation for dramatic effect
    setTimeout(() => {
      setXpGained(finalXp);
      setShowXpAnimation(true);
    }, 1000);
    
    // Determine if a reward should be unlocked based on payment
    if (paymentAmount >= debt.amount * 0.5) {
      // Significant payment unlocks a reward
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
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-purple-200 shadow-xl max-w-lg">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {/* Confetti effect with CSS */}
          <div className="confetti-container">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`,
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                }}
              />
            ))}
          </div>
        </div>
        
        <DialogHeader className="relative z-10">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-bounce-fun">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            DEBT DEMON DEFEATED!
          </DialogTitle>
          <DialogDescription className="text-center text-lg font-medium text-purple-800">
            You've vanquished {monsterProfile.name}!
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-xl p-4 mt-2 border border-purple-100">
          <p className="text-center mb-4 italic text-gray-700">
            "{monsterProfile.victoryMessage}"
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-100">
              <p className="text-sm text-gray-600">Damage Dealt</p>
              <p className="text-xl font-bold text-blue-700">${paymentAmount}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
              <p className="text-sm text-gray-600">Demon Slain</p>
              <p className="text-xl font-bold text-green-700">${debt.amount.toFixed(2)}</p>
            </div>
          </div>
          
          {/* XP reward section with animation */}
          <div className={`bg-gradient-to-r from-violet-100 to-indigo-100 p-3 rounded-lg text-center mt-3 border border-indigo-200 
            ${showXpAnimation ? 'animate-pulse' : ''}`}>
            <p className="text-sm text-gray-600 flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" /> 
              XP Gained
            </p>
            <p className="text-xl font-bold text-indigo-700 flex items-center justify-center">
              +{xpGained} XP
              {showXpAnimation && (
                <Sparkles className="h-4 w-4 text-yellow-500 ml-2 animate-spin" />
              )}
            </p>
          </div>
          
          {/* Unlocked reward section */}
          {unlockedReward && (
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-3 rounded-lg text-center mt-3 border border-amber-200 animate-fade-in">
              <p className="text-sm text-gray-600 flex items-center justify-center">
                <Flame className="h-4 w-4 text-orange-500 mr-1" /> 
                New Ability Unlocked!
              </p>
              <p className="text-lg font-bold text-orange-700">{unlockedReward}</p>
              <p className="text-xs text-gray-600 mt-1">Use this in your next battle!</p>
            </div>
          )}
          
          <div className="flex items-center justify-center mt-4">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="h-5 w-5 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="relative z-10 flex flex-col gap-2">
          <p className="text-sm text-center text-gray-600 px-2">
            Your financial power grows! Continue your journey to defeat all debt demons.
          </p>
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Sword className="h-4 w-4 mr-2" />
            Continue Battle
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
      
      {/* Add CSS using style tag without the jsx property */}
      <style>{`
        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
        }
        
        .confetti {
          position: absolute;
          top: -10px;
          animation: fall 5s linear infinite;
        }
        
        @keyframes fall {
          0% {
            top: -10px;
            transform: rotate(0deg) translateX(0);
          }
          100% {
            top: 100%;
            transform: rotate(360deg) translateX(20px);
          }
        }
      `}</style>
    </Dialog>
  );
};

export default VictoryScreen;
