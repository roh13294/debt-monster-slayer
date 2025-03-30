import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import MonsterBattle from './MonsterBattle';
import Challenge from './Challenge';
import LifeEvent from './LifeEvent';
import { Coins, CalendarDays, Sparkles, PiggyBank, Zap } from 'lucide-react';
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
    specialMoves 
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
      {/* Header with financial summary and advance month button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-elegant bg-gradient-to-br from-green-50 to-blue-50 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current Cash</h3>
            <div className="flex items-center">
              <Coins className="h-6 w-6 text-green-500 mr-2" />
              <span className="text-2xl font-bold text-green-600">{formatCurrency(cash)}</span>
            </div>
          </div>
          <div className="bg-white/50 mt-4 p-3 rounded-b-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Monthly Income</p>
              <p className="text-sm font-medium text-gray-700">+{formatCurrency(budget.income)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Monthly Expenses</p>
              <p className="text-sm font-medium text-gray-700">-{formatCurrency(budget.essentials)}</p>
            </div>
          </div>
        </div>
        
        <div className="card-elegant bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Debt</h3>
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 text-purple-500 mr-2" />
              <span className="text-2xl font-bold text-purple-600">{formatCurrency(totalDebt)}</span>
            </div>
          </div>
          <div className="bg-white/50 mt-4 p-3 rounded-b-xl flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Debt Payment Budget</p>
              <p className="text-sm font-medium text-gray-700">{formatCurrency(budget.debt)}/month</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Months Passed</p>
              <p className="text-sm font-medium text-gray-700">{monthsPassed}</p>
            </div>
          </div>
        </div>
        
        <div className="card-elegant bg-gradient-to-br from-yellow-50 to-orange-50 flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow">
          <div className="p-5">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Game Progress</h3>
            <div className="flex items-center">
              <Sparkles className="h-6 w-6 text-yellow-500 mr-2" />
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-yellow-600">{specialMoves}</span>
                <span className="text-sm text-yellow-600">Special Moves</span>
              </div>
            </div>
            <div className="flex mt-2 items-center space-x-3">
              <div className="flex items-center">
                <PiggyBank className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-xs text-blue-600">Savings: {formatCurrency(budget.savings)}/mo</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-purple-500 mr-1" />
                <span className="text-xs text-purple-600">Level: {Math.max(1, Math.floor(monthsPassed / 3) + 1)}</span>
              </div>
            </div>
          </div>
          <div className="bg-white/50 p-3 rounded-b-xl">
            <Button 
              onClick={handleAdvanceMonth} 
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium"
            >
              Advance to Next Month
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card-elegant shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="p-1.5 bg-gradient-to-br from-fun-purple to-fun-magenta text-white rounded-md mr-2">
                <Zap className="w-4 h-4" />
              </span>
              Your Debt Monsters
            </h2>
            {debts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                <Sparkles className="w-8 h-8 text-green-500 mb-2 mx-auto" />
                <p className="text-green-600 font-medium">You have no debts! Great job!</p>
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
            <div className="card-elegant shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <span className="p-1 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-md mr-2">
                  <PiggyBank className="w-3.5 h-3.5" />
                </span>
                Strategy
              </h2>
              <StrategySelector />
            </div>
            
            <div className="card-elegant shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-bold mb-3 flex items-center">
                <span className="p-1 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-md mr-2">
                  <Coins className="w-3.5 h-3.5" />
                </span>
                Budget
              </h2>
              <BudgetAllocator />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="card-elegant shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <span className="p-1 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-md mr-2">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              Active Challenge
            </h2>
            <Challenge 
              title={sampleChallenge.title}
              description={sampleChallenge.description}
              progress={sampleChallenge.progress}
              target={sampleChallenge.target}
              reward={sampleChallenge.reward}
              completed={sampleChallenge.completed}
            />
          </div>
          
          <div className="card-elegant shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold mb-3 flex items-center">
              <span className="p-1 bg-gradient-to-br from-fun-purple to-fun-magenta text-white rounded-md mr-2">
                <Zap className="w-3.5 h-3.5" />
              </span>
              Helpful Tips
            </h2>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-700">
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
