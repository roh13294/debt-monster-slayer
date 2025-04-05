
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import MonsterBattle from './MonsterBattle';
import Challenge from './Challenge';
import MultiChallenge from './MultiChallenge';
import LifeEvent from './LifeEvent';
import StreakDisplay from './StreakDisplay';
import { Coins, CalendarDays, Sparkles, PiggyBank, Zap, Calendar, Sword, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StrategySelector from './StrategySelector';
import BudgetAllocator from './BudgetAllocator';
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { 
    debts, 
    totalDebt, 
    budget, 
    cash, 
    challenges, 
    currentLifeEvent, 
    advanceMonth, 
    monthsPassed,
    specialMoves,
    paymentStreak
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
  
  const handleAdvanceMonth = () => {
    toast({
      title: "Month Advanced",
      description: "Your financial situation has been updated for the next month.",
      variant: "default",
    });
    advanceMonth();
  };
  
  // Get first challenge for the sample challenge widget
  const sampleChallenge = challenges && challenges.length > 0 ? challenges[0] : {
    id: '1',
    title: 'Sample Challenge',
    description: 'This is a sample challenge description',
    progress: 0,
    target: 5,
    reward: 100,
    completed: false
  };
  
  return (
    <div className="relative space-y-6">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-40 w-40 h-40 bg-red-500/10 rounded-full mix-blend-color-dodge filter blur-3xl opacity-30 animate-pulse-subtle pointer-events-none"></div>
      <div className="absolute bottom-40 right-20 w-60 h-60 bg-purple-500/10 rounded-full mix-blend-color-dodge filter blur-3xl opacity-20 pointer-events-none"></div>
      
      {/* Header with financial summary and advance month button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Current Cash card */}
        <div className="oni-card flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 top-0 h-40 w-40 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div className="p-5 relative z-10">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Current Cash</h3>
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-full mr-3">
                <Coins className="h-6 w-6 text-green-500" />
              </div>
              <span className="text-2xl font-bold text-green-400 oni-text-glow">{formatCurrency(cash)}</span>
            </div>
          </div>
          <div className="bg-white/5 mt-4 p-3 rounded-b-xl flex justify-between items-center backdrop-blur-sm">
            <div>
              <p className="text-xs text-gray-400">Monthly Income</p>
              <p className="text-sm font-medium text-green-400">+{formatCurrency(budget.income)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Monthly Expenses</p>
              <p className="text-sm font-medium text-red-400">-{formatCurrency(budget.essentials)}</p>
            </div>
          </div>
        </div>
        
        {/* Total Debt card */}
        <div className="oni-card flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -left-10 top-0 h-40 w-40 bg-gradient-to-br from-red-500/10 to-purple-500/10 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div className="p-5 relative z-10">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Total Debt</h3>
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-full mr-3">
                <CalendarDays className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-400 oni-text-glow">{formatCurrency(totalDebt)}</span>
            </div>
          </div>
          <div className="bg-white/5 mt-4 p-3 rounded-b-xl flex justify-between items-center backdrop-blur-sm">
            <div>
              <p className="text-xs text-gray-400">Debt Payment Budget</p>
              <p className="text-sm font-medium text-purple-400">{formatCurrency(budget.debt)}/month</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Months Passed</p>
              <p className="text-sm font-medium text-amber-400">{monthsPassed}</p>
            </div>
          </div>
        </div>
        
        {/* Game Progress card */}
        <div className="oni-card flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-10 top-0 h-40 w-40 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
          <div className="p-5 relative z-10">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Game Progress</h3>
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-500/10 rounded-full mr-3">
                <Sparkles className="h-6 w-6 text-amber-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-amber-400 oni-text-glow">{specialMoves}</span>
                <span className="text-sm text-amber-300">Special Moves</span>
              </div>
            </div>
            <div className="flex mt-2 items-center space-x-3">
              <div className="flex items-center">
                <PiggyBank className="h-4 w-4 text-blue-400 mr-1" />
                <span className="text-xs text-blue-300">Savings: {formatCurrency(budget.savings)}/mo</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-xs text-purple-300">Level: {Math.max(1, Math.floor(monthsPassed / 3) + 1)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3">
            <Button 
              onClick={handleAdvanceMonth} 
              className="oni-button w-full group"
            >
              <Flame className="w-4 h-4 mr-2 group-hover:animate-flame-pulse text-amber-200" />
              Advance to Next Month
              <Sword className="w-4 h-4 ml-2 group-hover:animate-sword-draw" />
            </Button>
          </div>
        </div>
      </div>
      
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
                  <PiggyBank className="w-3.5 h-3.5" />
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
                  <Coins className="w-3.5 h-3.5" />
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
                <Sparkles className="w-3.5 h-3.5" />
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
                <Calendar className="w-3.5 h-3.5" />
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
