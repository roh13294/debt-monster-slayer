
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import MonsterBattle from './MonsterBattle';
import MultiChallenge from './MultiChallenge';
import LifeEvent from './LifeEvent';
import StreakDisplay from './StreakDisplay';
import { Shield, Sword, Flame, Trophy, Zap, BookOpen, Scroll, Temple, Wind } from 'lucide-react';
import StrategySelector from './StrategySelector';
import BudgetAllocator from './BudgetAllocator';
import FinancialSummaryCard from './dashboard/FinancialSummaryCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import JourneyTimeline from './journey/JourneyTimeline';
import SlayerLog from './journey/SlayerLog';
import { calculatePlayerLevel, getPlayerRank } from '@/utils/gameTerms';
import CorruptionMeter from './ui/CorruptionMeter';
import WealthTempleScreen from './temple/WealthTempleScreen';
import SkillTree from './skills/SkillTree';

interface DashboardProps {
  onAdvanceMonth: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAdvanceMonth }) => {
  const { 
    debts, 
    totalDebt, 
    budget, 
    cash, 
    challenges, 
    currentLifeEvent, 
    monthsPassed,
    specialMoves,
    paymentStreak,
    playerTraits,
    shadowForm,
    corruptionLevel
  } = useGameContext();
  
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showSlayerLog, setShowSlayerLog] = useState(false);
  const [showWealthTemple, setShowWealthTemple] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  
  const handleMonsterClick = (id: string) => {
    setSelectedMonster(id);
  };
  
  const handleCloseBattle = () => {
    setSelectedMonster(null);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const playerLevel = calculatePlayerLevel(monthsPassed);
  const playerRank = getPlayerRank(playerLevel);
  
  return (
    <div className="relative space-y-6">
      <div className="absolute top-20 left-40 w-40 h-40 bg-red-500/10 rounded-full mix-blend-color-dodge filter blur-3xl opacity-30 animate-pulse-subtle pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-60 h-60 bg-purple-500/10 rounded-full mix-blend-color-dodge filter blur-3xl opacity-20 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-2">
        {/* Status Indicators */}
        <div className="flex items-center space-x-3">
          {shadowForm && (
            <CorruptionMeter size="md" />
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FinancialSummaryCard
          type="cash"
          title="DemonCoins"
          value={formatCurrency(cash)}
          details={{
            leftLabel: "Monthly Income",
            leftValue: `+${formatCurrency(budget.income)}`,
            rightLabel: "Monthly Expenses",
            rightValue: `-${formatCurrency(budget.essentials)}`
          }}
        />
        
        <FinancialSummaryCard
          type="debt"
          title="Total Debt"
          value={formatCurrency(totalDebt)}
          details={{
            leftLabel: "Debt Payment Budget",
            leftValue: `${formatCurrency(budget.debt)}/month`,
            rightLabel: "Months Passed",
            rightValue: `${monthsPassed}`
          }}
        />
        
        <FinancialSummaryCard
          type="progress"
          title="Game Progress"
          value={`${specialMoves} Special Moves`}
          details={{
            leftLabel: playerRank,
            leftValue: `Level ${playerLevel}`,
            rightLabel: "Growth",
            rightValue: `${playerTraits.determination + playerTraits.discipline + playerTraits.financialKnowledge}/30`
          }}
        >
          <Button 
            onClick={onAdvanceMonth} 
            className="oni-button w-full group"
          >
            <Flame className="w-4 h-4 mr-2 group-hover:animate-flame-pulse text-amber-200" />
            Advance to Next Month
            <Flame className="w-4 h-4 ml-2 group-hover:animate-sword-draw" />
          </Button>
        </FinancialSummaryCard>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTimeline(true)}
          className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
        >
          <Scroll className="w-4 h-4 text-amber-400" />
          <span>Journey Timeline</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSlayerLog(true)}
          className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Book of the Slayer</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowWealthTemple(true)}
          className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
        >
          <Temple className="w-4 h-4 text-amber-400" />
          <span>Wealth Temple</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSkillTree(true)}
          className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 flex items-center gap-2"
        >
          <Wind className="w-4 h-4 text-blue-400" />
          <span>Breathing Techniques</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="oni-card relative overflow-hidden">
            <div className="absolute right-5 top-5 opacity-5 text-6xl font-bold kanji-bg">負債</div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="p-1.5 bg-gradient-to-br from-red-500 to-amber-500 text-white rounded-md mr-2 shadow-oni">
                <Sword className="w-4 h-4" />
              </span>
              <span className="oni-text-fire">Your Debt Demons</span>
            </h2>
            {debts.length === 0 ? (
              <div className="text-center py-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <Trophy className="w-8 h-8 text-amber-500 mb-2 mx-auto animate-float" />
                <p className="text-green-400 font-medium">You have no debts! Great job!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {debts.map(debt => (
                  <DebtMonster
                    key={debt.id}
                    debt={debt}
                    onClick={() => handleMonsterClick(debt.id)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="oni-card relative overflow-hidden">
              <div className="absolute left-5 top-5 opacity-5 text-6xl font-bold kanji-bg">戦略</div>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <span className="p-1 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-md mr-2 shadow-oni">
                  <Shield className="w-3.5 h-3.5" />
                </span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Strategy</span>
              </h2>
              <div className="overflow-hidden">
                <StrategySelector />
              </div>
            </div>
            
            <div className="oni-card relative overflow-hidden">
              <div className="absolute right-5 top-5 opacity-5 text-6xl font-bold kanji-bg">予算</div>
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <span className="p-1 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-md mr-2 shadow-oni">
                  <Sword className="w-3.5 h-3.5" />
                </span>
                <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">Budget</span>
              </h2>
              <BudgetAllocator />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="oni-card relative overflow-hidden">
            <div className="absolute right-5 top-5 opacity-5 text-6xl font-bold kanji-bg">挑戦</div>
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <span className="p-1 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-md mr-2 shadow-oni">
                <Flame className="w-3.5 h-3.5" />
              </span>
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Daily Challenges
              </span>
            </h2>
            <MultiChallenge challenges={challenges} maxDisplay={3} />
          </div>
          
          <div className="oni-card relative overflow-hidden">
            <div className="absolute left-5 top-5 opacity-5 text-6xl font-bold kanji-bg">連続</div>
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <span className="p-1 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-md mr-2 shadow-oni">
                <Flame className="w-3.5 h-3.5" />
              </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Streaks
              </span>
            </h2>
            <StreakDisplay
              streakCount={paymentStreak}
              streakType="Payment"
              nextReward={3}
              rewardType="Special Move"
            />
          </div>
          
          <div className="oni-card relative overflow-hidden">
            <div className="absolute right-5 top-5 opacity-5 text-6xl font-bold kanji-bg">成長</div>
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <span className="p-1 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-md mr-2 shadow-oni">
                <Zap className="w-3.5 h-3.5" />
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Character Growth
              </span>
            </h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-blue-300">Discipline</span>
                  <span className="text-blue-300">{playerTraits.discipline}/10</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${playerTraits.discipline * 10}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-amber-300">Resilience</span>
                  <span className="text-amber-300">{playerTraits.determination}/10</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${playerTraits.determination * 10}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-emerald-300">Focus</span>
                  <span className="text-emerald-300">{playerTraits.financialKnowledge}/10</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500" 
                    style={{ width: `${playerTraits.financialKnowledge * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none">
          <JourneyTimeline onClose={() => setShowTimeline(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showSlayerLog} onOpenChange={setShowSlayerLog}>
        <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none">
          <SlayerLog onClose={() => setShowSlayerLog(false)} />
        </DialogContent>
      </Dialog>
      
      <WealthTempleScreen isOpen={showWealthTemple} onClose={() => setShowWealthTemple(false)} />
      
      <SkillTree isOpen={showSkillTree} onClose={() => setShowSkillTree(false)} />
      
      {selectedMonster && (
        <MonsterBattle 
          debtId={selectedMonster} 
          onClose={handleCloseBattle} 
        />
      )}
      
      {currentLifeEvent && <LifeEvent />}
    </div>
  );
};

export default Dashboard;
