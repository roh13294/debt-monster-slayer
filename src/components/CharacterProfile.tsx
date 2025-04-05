
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import AnimeAvatar from './AnimeAvatar';
import { Sword, Shield, Book, Zap, PiggyBank, TrendingUp, Flame, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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
    totalDebt
  } = useGameContext();
  
  // Calculate level based on traits
  const calculateLevel = () => {
    const { financialKnowledge, discipline, courage, wisdom } = playerTraits;
    const baseLevel = Math.floor((financialKnowledge + discipline + courage + wisdom) / 4);
    return Math.max(1, baseLevel);
  };
  
  // Calculate wealth percentage for level progress
  const calculateWealthProgress = () => {
    if (totalDebt === 0) return 100;
    const wealthRatio = Math.min(cash / (totalDebt || 1), 1);
    return Math.floor(wealthRatio * 100);
  };
  
  // Calculate next title based on level
  const getNextTitle = () => {
    const level = calculateLevel();
    if (level < 5) return 'Adept Slayer';
    if (level < 10) return 'Master Slayer';
    if (level < 15) return 'Hashira';
    return 'Demon Slayer Legend';
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
              <span className="text-sm text-demon-gold">{lifeStage?.name || 'Young'} {job?.title || 'Slayer'}</span>
            </div>
          </div>
          
          {/* Level & Progress */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-white/80">Level {calculateLevel()}</span>
              <span className="text-demon-gold">{calculateWealthProgress()}%</span>
            </div>
            <Progress value={calculateWealthProgress()} className="h-2 bg-demon-black/60">
              <div className="absolute inset-0 bg-demon-gradient animate-energy-flow"></div>
            </Progress>
            <div className="mt-1 text-xs text-white/60 flex items-center gap-1">
              <Flame className="w-3 h-3 text-demon-ember" />
              <span>Next title: {getNextTitle()}</span>
            </div>
          </div>
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
                <span className="text-demon-gold">{formatCurrency(cash)}</span>
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-white/70">Debt</span>
                <span className="text-demon-red">{formatCurrency(totalDebt)}</span>
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
