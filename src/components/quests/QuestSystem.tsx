
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Scroll, Check, Clock } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { toast } from '@/hooks/use-toast';
import DemonCoin from '@/components/ui/DemonCoin';

interface QuestSystemProps {
  onClose: () => void;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  objective: {
    type: 'battle_wins' | 'use_stance' | 'reduce_debt' | 'save_money' | 'defeat_boss';
    target: number;
    params?: {
      stance?: string;
      debtType?: string;
      amount?: number;
    };
  };
  progress: number;
  rewards: {
    xp: number;
    coins: number;
    relics: number;
    specialMoves: number;
  };
  completed: boolean;
  claimed: boolean;
  expiresAt: number; // timestamp
}

const QuestSystem: React.FC<QuestSystemProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { 
    cash, 
    setCash, 
    gainXP, 
    specialMoves, 
    setSpecialMoves 
  } = useGameContext();
  
  // Mock quests with useState to allow updating them
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'daily-1',
      title: 'Flame Form Master',
      description: 'Use Flame stance in 3 battles',
      type: 'daily',
      objective: {
        type: 'use_stance',
        target: 3,
        params: {
          stance: 'flame'
        }
      },
      progress: 1,
      rewards: {
        xp: 50,
        coins: 200,
        relics: 0,
        specialMoves: 1
      },
      completed: false,
      claimed: false,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
    },
    {
      id: 'daily-2',
      title: 'Demon Slayer',
      description: 'Defeat any 2 demons in battle',
      type: 'daily',
      objective: {
        type: 'battle_wins',
        target: 2
      },
      progress: 2,
      rewards: {
        xp: 100,
        coins: 300,
        relics: 0,
        specialMoves: 0
      },
      completed: true,
      claimed: false,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours from now
    },
    {
      id: 'weekly-1',
      title: 'Debt Reducer',
      description: 'Reduce your total debt by 1000',
      type: 'weekly',
      objective: {
        type: 'reduce_debt',
        target: 1000
      },
      progress: 500,
      rewards: {
        xp: 200,
        coins: 500,
        relics: 1,
        specialMoves: 1
      },
      completed: false,
      claimed: false,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days from now
    },
    {
      id: 'monthly-1',
      title: 'Temple Guardian',
      description: 'Upgrade your Wealth Temple',
      type: 'monthly',
      objective: {
        type: 'defeat_boss',
        target: 1
      },
      progress: 0,
      rewards: {
        xp: 500,
        coins: 2000,
        relics: 2,
        specialMoves: 3
      },
      completed: false,
      claimed: false,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days from now
    }
  ]);
  
  // Filter quests by active tab
  const filteredQuests = quests.filter(quest => quest.type === activeTab);
  
  // Format time remaining
  const formatTimeRemaining = (expiresAt: number): string => {
    const now = Date.now();
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };
  
  // Handle claiming quest rewards
  const handleClaimReward = (questId: string) => {
    // Find the quest to claim
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;
    
    const quest = quests[questIndex];
    
    // Apply rewards to the player
    if (quest.rewards.coins > 0) {
      // Fix: Use the current cash value and add the rewards directly
      const newCashAmount = cash + quest.rewards.coins;
      setCash(newCashAmount);
    }
    
    if (quest.rewards.xp > 0 && gainXP) {
      gainXP(quest.rewards.xp);
    }
    
    if (quest.rewards.specialMoves > 0) {
      // Fix: Use the current specialMoves value and add the rewards directly
      const newSpecialMovesAmount = specialMoves + quest.rewards.specialMoves;
      setSpecialMoves(newSpecialMovesAmount);
    }
    
    // Mark quest as claimed
    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...quest,
      claimed: true
    };
    
    setQuests(updatedQuests);
    
    // Show success message
    toast({
      title: "Rewards Claimed!",
      description: `You received ${quest.rewards.coins} DemonCoins, ${quest.rewards.xp} XP, and ${quest.rewards.specialMoves} special moves.`,
      variant: "default",
    });
    
    // Play claim sound
    const audio = new Audio('/sounds/quest-complete.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
  };
  
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl p-6 rounded-xl border border-slate-700 shadow-lg max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Scroll className="w-6 h-6 text-amber-400 mr-2" />
          Quest Scrolls
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Your Balance:</span>
          <DemonCoin amount={cash} size="md" />
        </div>
      </div>
      
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === 'daily' ? 'default' : 'outline'}
          className={`${activeTab === 'daily' ? 'bg-amber-700' : 'border-amber-700/30'}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily
        </Button>
        <Button
          variant={activeTab === 'weekly' ? 'default' : 'outline'}
          className={`${activeTab === 'weekly' ? 'bg-blue-700' : 'border-blue-700/30'}`}
          onClick={() => setActiveTab('weekly')}
        >
          Weekly
        </Button>
        <Button
          variant={activeTab === 'monthly' ? 'default' : 'outline'}
          className={`${activeTab === 'monthly' ? 'bg-purple-700' : 'border-purple-700/30'}`}
          onClick={() => setActiveTab('monthly')}
        >
          Monthly
        </Button>
      </div>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mb-6">
        {filteredQuests.length > 0 ? (
          filteredQuests.map(quest => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-slate-800/70 rounded-lg p-4 border ${
                quest.completed ? 'border-green-700/50' : 'border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-white flex items-center">
                    {quest.title}
                    {quest.completed && (
                      <span className="ml-2 bg-green-700/50 text-green-400 text-xs py-0.5 px-2 rounded-full">
                        Completed
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-slate-400 mt-0.5">{quest.description}</p>
                </div>
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{formatTimeRemaining(quest.expiresAt)}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Progress</span>
                  <span>{quest.progress} / {quest.objective.target}</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${quest.completed ? 'bg-green-600' : 'bg-amber-600'}`}
                    style={{ width: `${Math.min(100, (quest.progress / quest.objective.target) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
                {quest.rewards.xp > 0 && (
                  <div className="bg-slate-900/50 p-2 rounded">
                    <p className="text-slate-400">XP</p>
                    <p className="text-blue-400 font-medium">{quest.rewards.xp}</p>
                  </div>
                )}
                {quest.rewards.coins > 0 && (
                  <div className="bg-slate-900/50 p-2 rounded">
                    <p className="text-slate-400">Coins</p>
                    <p className="text-amber-400 font-medium">{quest.rewards.coins}</p>
                  </div>
                )}
                {quest.rewards.specialMoves > 0 && (
                  <div className="bg-slate-900/50 p-2 rounded">
                    <p className="text-slate-400">Moves</p>
                    <p className="text-red-400 font-medium">{quest.rewards.specialMoves}</p>
                  </div>
                )}
                {quest.rewards.relics > 0 && (
                  <div className="bg-slate-900/50 p-2 rounded">
                    <p className="text-slate-400">Relics</p>
                    <p className="text-purple-400 font-medium">{quest.rewards.relics}</p>
                  </div>
                )}
              </div>
              
              <Button
                disabled={!quest.completed || quest.claimed}
                onClick={() => handleClaimReward(quest.id)}
                className={`w-full ${
                  quest.completed && !quest.claimed 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700' 
                    : 'bg-slate-700'
                }`}
              >
                <Check className="mr-2 h-4 w-4" />
                {quest.claimed ? 'Claimed' : 'Claim Rewards'}
              </Button>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-slate-400">No quests available</p>
          </div>
        )}
      </div>
      
      <Button onClick={onClose} variant="outline" className="border-slate-700 hover:bg-slate-800">
        Return to Dashboard
      </Button>
    </div>
  );
};

export default QuestSystem;
