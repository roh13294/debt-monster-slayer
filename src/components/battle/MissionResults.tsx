
import React from 'react';
import { motion } from 'framer-motion';
import { LootItem } from '@/types/battleTypes';
import { Debt } from '@/types/gameTypes';
import { Trophy, Clock, Target, Zap, Star, Sword, Flame, ArrowRight, ChevronsRight, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LootDropCard from './LootDropCard';

interface MissionResultsProps {
  demons: Debt[];
  completedDemons: string[];
  loot: LootItem[];
  stats: {
    demonsDefeated: number;
    totalDamageDealt: number;
    highestCombo: number;
    timeSpent: number;
    xpGained: number;
    coinsEarned: number;
  };
  onContinue: () => void;
}

const MissionResults: React.FC<MissionResultsProps> = ({
  demons,
  completedDemons,
  loot,
  stats,
  onContinue
}) => {
  // Calculate mission completion percentage
  const completionPercentage = demons.length > 0 
    ? Math.round((completedDemons.length / demons.length) * 100) 
    : 100;
  
  // Calculate mission rank based on stats
  const calculateMissionRank = () => {
    // This is a simple rank calculation, can be expanded
    if (completionPercentage === 100) {
      if (stats.highestCombo >= 8) return 'S';
      if (stats.highestCombo >= 5) return 'A';
      return 'B';
    } else if (completionPercentage >= 75) {
      return 'C';
    } else if (completionPercentage >= 50) {
      return 'D';
    }
    return 'E';
  };
  
  const missionRank = calculateMissionRank();
  
  // Format time in minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div 
        className="max-w-4xl mx-auto bg-slate-900/80 rounded-lg overflow-hidden border border-amber-800/30 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 text-white p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Mission Results</h1>
            <div className="bg-amber-700/80 px-4 py-2 rounded-lg">
              <div className="text-sm mb-1">Mission Rank</div>
              <div className="text-4xl font-bold text-center">{missionRank}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="bg-black/20 p-3 rounded flex flex-col items-center">
              <Target className="w-5 h-5 mb-1 text-amber-300" />
              <div className="text-xs text-amber-200">Demons Defeated</div>
              <div className="font-bold text-lg">
                {completedDemons.length}/{demons.length}
              </div>
            </div>
            
            <div className="bg-black/20 p-3 rounded flex flex-col items-center">
              <Clock className="w-5 h-5 mb-1 text-amber-300" />
              <div className="text-xs text-amber-200">Time</div>
              <div className="font-bold text-lg">{formatTime(stats.timeSpent)}</div>
            </div>
            
            <div className="bg-black/20 p-3 rounded flex flex-col items-center">
              <Zap className="w-5 h-5 mb-1 text-amber-300" />
              <div className="text-xs text-amber-200">Highest Combo</div>
              <div className="font-bold text-lg">x{stats.highestCombo || 0}</div>
            </div>
            
            <div className="bg-black/20 p-3 rounded flex flex-col items-center">
              <Star className="w-5 h-5 mb-1 text-amber-300" />
              <div className="text-xs text-amber-200">XP Gained</div>
              <div className="font-bold text-lg">+{stats.xpGained}</div>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-slate-800/60">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-amber-400" />
            Battle Report
          </h2>
          
          <div className="space-y-3 mb-5">
            {demons.map(demon => {
              const isDefeated = completedDemons.includes(demon.id);
              
              return (
                <div 
                  key={demon.id}
                  className={cn(
                    "p-3 border rounded-md flex items-center justify-between",
                    isDefeated 
                      ? "bg-green-900/20 border-green-700/30" 
                      : "bg-red-900/20 border-red-700/30"
                  )}
                >
                  <div className="flex items-center">
                    {isDefeated ? (
                      <Sword className="w-5 h-5 mr-2 text-green-400" />
                    ) : (
                      <Target className="w-5 h-5 mr-2 text-red-400" />
                    )}
                    <div>
                      <div className="font-medium text-white">{demon.name}</div>
                      <div className="text-xs text-slate-400">
                        {isDefeated 
                          ? "Defeated" 
                          : "Escaped"
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(demon.amount)} HP
                    </div>
                    <div className="text-xs text-slate-400">
                      {isDefeated ? "100% damage" : `${demon.health}% damage`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {loot.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                <Coins className="w-5 h-5 mr-2 text-amber-400" />
                Rewards Collected
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {loot.map((item, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-md p-3 border border-slate-600">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-xs text-slate-300 mt-1">{item.description}</div>
                    <div className={cn(
                      "mt-2 text-xs px-2 py-0.5 rounded inline-block",
                      item.rarity === 'Common' && "bg-slate-600 text-white",
                      item.rarity === 'Rare' && "bg-blue-600 text-white",
                      item.rarity === 'Epic' && "bg-purple-600 text-white"
                    )}>
                      {item.rarity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5 bg-slate-900 border-t border-slate-700 flex justify-between items-center">
          <div>
            <div className="text-xs text-slate-400">Earned</div>
            <div className="text-amber-400 font-bold">
              {stats.coinsEarned} DemonCoins
            </div>
          </div>
          
          <Button 
            onClick={onComplete}
            className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white"
          >
            Continue Journey <ChevronsRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default MissionResults;
