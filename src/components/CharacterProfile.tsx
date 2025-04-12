
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import AnimeAvatar from './AnimeAvatar';
import { Sword, Shield, Book, Zap, PiggyBank, TrendingUp, Flame, Trophy, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import XPBar from './ui/XPBar';
import { motion } from 'framer-motion';

const CharacterProfile: React.FC = () => {
  const { 
    playerName, 
    playerTraits, 
    specialMoves, 
    cash,
    job,
    lifeStage,
    paymentStreak,
    debts,
    totalDebt,
    playerLevel,
    playerTitle,
    playerPerk
  } = useGameContext();
  
  // Calculate wealth percentage for progress
  const calculateWealthProgress = () => {
    if (totalDebt === 0) return 100;
    const wealthRatio = Math.min(cash / (totalDebt || 1), 1);
    return Math.floor(wealthRatio * 100);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="demon-card relative animate-floating-card">
      <div className="absolute inset-0 kanji-bg opacity-10"></div>
      
      {/* Top Section with Avatar */}
      <div className="flex items-center gap-6">
        <AnimeAvatar size="lg" showDetails={false} className="shrink-0" />
        
        <div className="space-y-2">
          {/* Player Name and Title */}
          <div>
            <h2 className="text-lg font-bold flame-breathing-text">{playerName || 'Slayer'}</h2>
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-demon-gold" />
              <span className="text-sm text-demon-gold">{lifeStage?.name || 'Young'} {playerTitle}</span>
            </div>
          </div>
          
          {/* Level & Progress */}
          <div>
            <XPBar size="md" />
          </div>
          
          {/* Player Perk */}
          {playerPerk && (
            <motion.div 
              className="text-xs bg-demon-black/30 px-2 py-1 rounded border border-demon-red/20 inline-flex items-center"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-3 h-3 text-demon-gold mr-1" />
              <span className="text-demon-gold">{playerPerk}</span>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div className="demon-divider my-4"></div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold water-breathing-text flex items-center gap-1">
            <Shield className="w-3 h-3" /> Combat Stats
          </h3>
          
          <div className="space-y-2">
            <StatBar 
              icon={<Sword className="w-3 h-3 text-demon-red" />}
              label="Discipline" 
              value={playerTraits.discipline * 10} 
              color="demon-red"
            />
            
            <StatBar 
              icon={<Flame className="w-3 h-3 text-demon-ember" />}
              label="Courage" 
              value={playerTraits.courage * 10} 
              color="demon-ember"
            />
            
            <StatBar 
              icon={<Book className="w-3 h-3 text-demon-blue" />}
              label="Wisdom" 
              value={playerTraits.wisdom * 10} 
              color="demon-blue"
            />
            
            <StatBar 
              icon={<Zap className="w-3 h-3 text-demon-purple" />}
              label="Special Moves" 
              value={specialMoves * 20} 
              color="demon-purple"
              showValue={`${specialMoves} left`}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold thunder-breathing-text flex items-center gap-1">
            <PiggyBank className="w-3 h-3" /> Financial Power
          </h3>
          
          <div className="space-y-2">
            <StatBar 
              icon={<TrendingUp className="w-3 h-3 text-demon-teal" />}
              label="Financial Knowledge" 
              value={playerTraits.financialKnowledge * 10} 
              color="demon-teal"
            />
            
            <div className="bg-demon-black/30 rounded-md p-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/70">Cash</span>
                <span className="text-demon-gold">{cash} SC</span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-white/70">Debt</span>
                <span className="text-demon-red">{totalDebt} HP</span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-white/70">Demons Slain</span>
                <span className="text-demon-gold">{Math.max(0, 10 - debts.length)}/10</span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-white/70">Payment Streak</span>
                <span className="text-demon-ember">{paymentStreak} months</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for stat bars
const StatBar: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  showValue?: string;
}> = ({ label, value, icon, color, showValue }) => (
  <div>
    <div className="flex justify-between items-center text-xs mb-1">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-white/80">{label}</span>
      </div>
      <span className={`text-${color}`}>{showValue || `${value}%`}</span>
    </div>
    <div className="h-1.5 bg-demon-black/60 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-${color} rounded-full`} 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

export default CharacterProfile;
