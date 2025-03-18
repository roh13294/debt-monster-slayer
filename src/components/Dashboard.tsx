
import React from 'react';
import { useGameContext } from '../context/GameContext';
import Avatar from './Avatar';
import ProgressBar from './ProgressBar';
import { CreditCard, DollarSign, CalendarDays, Zap, ArrowUp, Shield, TrendingUp, Flame } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    playerName, 
    cash, 
    totalDebt, 
    debts, 
    monthsPassed, 
    specialMoves,
    budget,
    advanceMonth
  } = useGameContext();

  // Calculate total initial debt (original debt + any new debt added)
  const initialTotalDebt = totalDebt + debts.reduce((paid, debt) => {
    const originalAmount = debt.amount / (1 - debt.health / 100);
    return paid + (originalAmount - debt.amount);
  }, 0);

  // Progress percentage (paid off / total)
  const progressPercentage = initialTotalDebt > 0 
    ? ((initialTotalDebt - totalDebt) / initialTotalDebt) * 100 
    : 100;

  // Calculate monthly cash flow
  const cashFlow = budget.income - budget.essentials;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 rounded-full opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100 rounded-full opacity-40"></div>
      
      <div className="flex flex-col md:flex-row items-center md:items-start mb-6 relative">
        <Avatar avatarType="default" className="mb-4 md:mb-0 md:mr-6 animate-float" />
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{playerName}</h1>
          <div className="flex items-center justify-center md:justify-start gap-1 text-gray-600">
            <Shield size={14} className="text-primary" />
            <span>Debt Fighter</span>
          </div>
          
          <div className="mt-2">
            <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
              <Flame className="h-3 w-3 text-orange-500" />
              <span>Level {Math.floor(monthsPassed / 3) + 1}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium flex items-center gap-1">
            <TrendingUp size={14} className="text-primary" /> 
            Debt Freedom Progress
          </span>
          <span className="text-sm font-medium">{progressPercentage.toFixed(0)}%</span>
        </div>
        <ProgressBar 
          progress={progressPercentage} 
          color={`bg-gradient-to-r from-blue-500 to-indigo-500`}
        />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-panel rounded-xl p-4 transform transition-transform hover:scale-105 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-full mr-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-xs text-gray-600">Cash</span>
          </div>
          <div className="mt-2 font-bold">${cash.toFixed(2)}</div>
        </div>
        
        <div className="glass-panel rounded-xl p-4 transform transition-transform hover:scale-105 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-full mr-2">
              <CreditCard className="h-4 w-4 text-red-600" />
            </div>
            <span className="text-xs text-gray-600">Total Debt</span>
          </div>
          <div className="mt-2 font-bold">${totalDebt.toFixed(2)}</div>
        </div>
        
        <div className="glass-panel rounded-xl p-4 transform transition-transform hover:scale-105 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-full mr-2">
              <CalendarDays className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-xs text-gray-600">Month</span>
          </div>
          <div className="mt-2 font-bold">{monthsPassed}</div>
        </div>
        
        <div className="glass-panel rounded-xl p-4 transform transition-transform hover:scale-105 hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-full mr-2">
              <Zap className="h-4 w-4 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-600">Special Moves</span>
          </div>
          <div className="mt-2 font-bold">{specialMoves}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm font-medium">Monthly Cash Flow</div>
          <div className={`text-lg font-bold ${cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${cashFlow.toFixed(2)}
          </div>
        </div>
        
        <button
          onClick={advanceMonth}
          className="btn-elegant relative overflow-hidden group"
        >
          <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          <span className="relative z-10">Advance Month</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
