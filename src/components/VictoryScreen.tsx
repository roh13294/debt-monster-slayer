
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, Sparkles, Trophy, Star, Flame } from 'lucide-react';
import { Debt } from '../types/gameTypes';
import { getMonsterProfile } from '../utils/monsterProfiles';
import MonsterImage from './MonsterImage';

interface VictoryScreenProps {
  debt: Debt;
  paymentAmount: number;
  onClose: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ debt, paymentAmount, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const monsterProfile = getMonsterProfile(debt.name);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-50 to-slate-100 border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-fun-purple to-fun-magenta bg-clip-text text-transparent flex items-center justify-center">
            <Trophy className="h-6 w-6 mr-2 text-fun-yellow" />
            Monster Defeated!
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            You've successfully paid off your {debt.name}!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-inner relative overflow-hidden">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-indigo-900">{monsterProfile.name}</h3>
              <p className="text-indigo-700 text-sm">has been defeated!</p>
            </div>
            
            <div className="relative">
              <div className="h-48 flex items-center justify-center">
                <MonsterImage debtName={debt.name} className="opacity-80 filter grayscale" />
              </div>
              
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="relative">
                  <Flame className="h-16 w-16 text-yellow-500 opacity-70 absolute -left-8 -top-8 animate-ping-slow" />
                  <Sparkles className="h-20 w-20 text-fun-blue animate-sparkle" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-indigo-700 italic">"{monsterProfile.victoryMessage}"</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Coins className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Final Payment</h4>
              </div>
              <p className="text-lg font-bold text-green-700 mt-2">${paymentAmount.toFixed(2)}</p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-yellow-900">Bonus Reward</h4>
              </div>
              <p className="text-lg font-bold text-yellow-700 mt-2">+1 Special Move</p>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleClose}
              className="bg-gradient-to-r from-fun-purple to-fun-magenta hover:from-fun-purple/90 hover:to-fun-magenta/90 text-white font-medium px-8 py-2"
            >
              Continue
            </Button>
          </div>
        </div>
        
        {/* Confetti effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VictoryScreen;
