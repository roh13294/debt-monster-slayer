
import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Temple, PiggyBank, CrownIcon, Sparkles, Coins } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import DemonCoin from '@/components/ui/DemonCoin';

interface WealthTempleScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

const WealthTempleScreen: React.FC<WealthTempleScreenProps> = ({ isOpen, onClose }) => {
  const { cash, shadowForm, isCorruptionUnstable } = useGameContext();
  const [templeLevel] = useState(1); // This would be stored in context in the full implementation
  
  // Temple is blocked for players in unstable corruption mode
  const isTempleBlocked = isCorruptionUnstable;
  
  // Temple has corruption penalty for shadow form users
  const hasCorruptionPenalty = shadowForm !== null && !isTempleBlocked;
  
  const getTempleTierInfo = () => {
    switch(templeLevel) {
      case 1:
        return {
          name: "Shrine Ruins",
          description: "The remnants of an ancient financial temple. You sense dormant power within these walls.",
          passiveReturn: "3%",
          relicSlots: 0,
          nextUpgrade: "5,000"
        };
      case 2:
        return {
          name: "Inner Grove",
          description: "The temple grounds have been partially restored, allowing basic financial blessings.",
          passiveReturn: "3.5%",
          relicSlots: 1,
          nextUpgrade: "15,000"
        };
      case 3:
        return {
          name: "Sky Altar",
          description: "The temple rises toward the heavens, channeling greater financial energy.",
          passiveReturn: "4%",
          relicSlots: 3,
          nextUpgrade: "40,000"
        };
      case 4:
        return {
          name: "Spirit Chamber",
          description: "The inner sanctum is accessible, providing protection against financial corruption.",
          passiveReturn: "5%",
          relicSlots: 5,
          nextUpgrade: "100,000"
        };
      case 5:
        return {
          name: "Celestial Gate",
          description: "The temple has reached its ultimate form, offering the greatest financial blessings.",
          passiveReturn: "6%",
          relicSlots: 8,
          nextUpgrade: "MAX"
        };
      default:
        return {
          name: "Undiscovered",
          description: "Unlock the power of the Wealth Temple first",
          passiveReturn: "0%",
          relicSlots: 0,
          nextUpgrade: "1,000"
        };
    }
  };
  
  const tierInfo = getTempleTierInfo();
  
  const handleOpenGamblersShrine = () => {
    // This would be implemented in the full version
    toast({
      title: "Coming Soon",
      description: "The Gambler's Shrine will be available in the next update!",
      variant: "default",
    });
  };
  
  const handleUpgradeTemple = () => {
    // This would be implemented in the full version
    toast({
      title: "Coming Soon",
      description: "Temple upgrades will be available in the next update!",
      variant: "default",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-lg border border-blue-500/30 shadow-xl shadow-blue-500/20">
          <DialogHeader className="p-6 border-b border-blue-500/20">
            <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Temple className="h-6 w-6 text-amber-400" />
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Wealth Temple</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            {isTempleBlocked ? (
              <div className="text-center p-10 space-y-4">
                <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                  <Temple className="h-10 w-10 text-red-400 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-red-400">Temple Blocked</h3>
                <p className="text-gray-400">
                  Your corruption is too unstable to access the Wealth Temple.
                  Reduce your corruption level below 100 to regain access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Temple Description */}
                <div className="space-y-4">
                  <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30">
                    <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                      <Temple className="h-5 w-5 text-blue-400" />
                      {tierInfo.name}
                    </h3>
                    <p className="text-sm text-gray-300">{tierInfo.description}</p>
                    
                    {hasCorruptionPenalty && (
                      <div className="mt-3 p-2 bg-red-900/30 rounded border border-red-500/30 text-xs text-red-300">
                        <span className="font-semibold">Shadow Penalty:</span> Temple powers reduced by 30% due to corruption.
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30">
                    <h3 className="text-sm font-bold text-blue-300 mb-2">Temple Stats</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Passive Return:</span>
                        <span className="text-amber-300">
                          {hasCorruptionPenalty 
                            ? `${parseFloat(tierInfo.passiveReturn) * 0.7}%` 
                            : tierInfo.passiveReturn}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Relic Slots:</span>
                        <span className="text-amber-300">{tierInfo.relicSlots}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-400">Next Upgrade:</span>
                        <span className="text-amber-300">
                          <DemonCoin amount={parseInt(tierInfo.nextUpgrade.replace(/,/g, ''))} size="sm" />
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleUpgradeTemple}
                      disabled={cash < parseInt(tierInfo.nextUpgrade.replace(/,/g, '')) || tierInfo.nextUpgrade === "MAX"}
                      className={`w-full ${tierInfo.nextUpgrade === "MAX" ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                      {tierInfo.nextUpgrade === "MAX" ? "Maximum Level" : `Upgrade Temple (${tierInfo.nextUpgrade} DemonCoins)`}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleOpenGamblersShrine}
                      className="w-full border-amber-500/50 text-amber-300 hover:bg-amber-900/30"
                    >
                      <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                      Gambler's Shrine
                    </Button>
                  </div>
                </div>
                
                {/* Center Column - Temple Visualization */}
                <div className="bg-blue-950/50 rounded-lg border border-blue-500/30 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-32 h-32 mx-auto flex items-center justify-center">
                      {/* Temple illustration would go here - placeholder for now */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                        <Temple className="h-16 w-16 text-blue-300" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-xs text-gray-400">Temple Level</span>
                      <div className="flex justify-center items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level} 
                            className={`w-3 h-3 rounded-full ${
                              level <= templeLevel 
                                ? 'bg-blue-400' 
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 text-xs text-gray-400 italic">
                      "Wealth flows to those who nurture its temple."
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Relics */}
                <div className="space-y-4">
                  <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30">
                    <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                      <CrownIcon className="h-5 w-5 text-amber-400" />
                      Holy Relics
                    </h3>
                    
                    {tierInfo.relicSlots === 0 ? (
                      <p className="text-sm text-gray-300">
                        Upgrade your temple to unlock relic slots.
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {Array(tierInfo.relicSlots).fill(0).map((_, index) => (
                          <div 
                            key={index} 
                            className="h-16 border border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-800/30"
                          >
                            <span className="text-gray-500 text-xs">Empty Slot</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30">
                    <h3 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                      <Coins className="h-4 w-4 text-green-400" />
                      Passive Income
                    </h3>
                    
                    <p className="text-sm text-gray-300 mb-2">
                      Your temple generates {hasCorruptionPenalty 
                        ? parseFloat(tierInfo.passiveReturn) * 0.7
                        : tierInfo.passiveReturn}% interest on unspent DemonCoins.
                    </p>
                    
                    <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Current DemonCoins:</span>
                        <span className="text-green-400">{cash.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-gray-300">Monthly Yield:</span>
                        <span className="text-green-400">
                          +{Math.floor(cash * (parseFloat(tierInfo.passiveReturn.replace('%', '')) / 100) * (hasCorruptionPenalty ? 0.7 : 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WealthTempleScreen;
