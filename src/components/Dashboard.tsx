
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import MonsterBattle from './MonsterBattle';
import MultiChallenge from './MultiChallenge';
import LifeEvent from './LifeEvent';
import StreakDisplay from './StreakDisplay';
import { Shield, Sword, Flame, Trophy, Zap } from 'lucide-react';
import StrategySelector from './StrategySelector';
import BudgetAllocator from './BudgetAllocator';
import FinancialSummaryCard from './dashboard/FinancialSummaryCard';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onAdvanceMonth?: () => void;
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
    playerTraits
  } = useGameContext();
  
  const [selectedMonster, setSelectedMonster] = useState<string | null>(null);
  
  // Handle monster selection
  const handleMonsterClick = (id: string) => {
    setSelectedMonster(id);
  };
  
  // Close monster battle modal
  const handleCloseBattle = () => {
    setSelectedMonster(null);
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
    <div className="relative space-y-6">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-40 w-40 h-40 bg-red-500/10 rounded-full mix-blend-color-dodge filter blur-3xl opacity-30 animate-pulse-subtle pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-60 h-60 bg-purple-500/10 rounded-full mix-blend-color-dodge filter blur-3xl opacity-20 pointer-events-none"></div>
      
      {/* Header with financial summary and advance month button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Cash card */}
        <FinancialSummaryCard
          type="cash"
          title="Current Cash"
          value={formatCurrency(cash)}
          details={{
            leftLabel: "Monthly Income",
            leftValue: `+${formatCurrency(budget.income)}`,
            rightLabel: "Monthly Expenses",
            rightValue: `-${formatCurrency(budget.essentials)}`
          }}
        />
        
        {/* Total Debt card */}
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
        
        {/* Game Progress card */}
        <FinancialSummaryCard
          type="progress"
          title="Game Progress"
          value={`${specialMoves} Special Moves`}
          details={{
            leftLabel: "Savings",
            leftValue: `${formatCurrency(budget.savings)}/mo`,
            rightLabel: "Level",
            rightValue: `${Math.max(1, Math.floor(monthsPassed / 3) + 1)}`
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
      
      {/* Rest of dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Debt Monsters section */}
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
            {/* Strategy section with fixed UI */}
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
            
            {/* Budget section */}
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
          {/* Multiple Challenges section */}
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
          
          {/* Payment Streak section */}
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
          
          {/* Tips section */}
          <div className="oni-card relative overflow-hidden">
            <div className="absolute right-5 top-5 opacity-5 text-6xl font-bold kanji-bg">助言</div>
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <span className="p-1 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-md mr-2 shadow-oni">
                <Zap className="w-3.5 h-3.5" />
              </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Helpful Tips
              </span>
            </h2>
            <div className="p-4 bg-blue-950/50 rounded-lg border border-blue-500/20">
              <p className="text-sm text-blue-300">
                Make regular payments to your debts to keep your payment streak going. Every 3 months of consistent payments earns you a special move!
              </p>
            </div>
          </div>
        </div>
      </div>
      
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
