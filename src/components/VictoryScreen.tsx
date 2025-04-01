
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Sword, ArrowRight } from 'lucide-react';
import { Debt } from '../types/gameTypes';
import { getMonsterProfile } from '../utils/monsterProfiles';

interface VictoryScreenProps {
  debt: Debt;
  paymentAmount: number;
  onClose: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ debt, paymentAmount, onClose }) => {
  const monsterProfile = getMonsterProfile(debt.name);
  
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
            MONSTER DEFEATED!
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
              <p className="text-sm text-gray-600">Final Payment</p>
              <p className="text-xl font-bold text-blue-700">${paymentAmount}</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
              <p className="text-sm text-gray-600">Total Conquered</p>
              <p className="text-xl font-bold text-green-700">${debt.amount.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-2">
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
            You've defeated this debt monster! Continue your journey to slay them all!
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
      
      <style jsx>{`
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
