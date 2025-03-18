
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { DollarSign, Home, CreditCard, PiggyBank } from 'lucide-react';

const BudgetAllocator: React.FC = () => {
  const { budget, updateBudget, applyBudgetPreset } = useGameContext();
  const [incomeInput, setIncomeInput] = useState(budget.income.toString());
  
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIncomeInput(value);
    const numValue = parseFloat(value) || 0;
    updateBudget({ income: numValue });
  };

  const calculatePercentage = (value: number) => {
    return budget.income > 0 ? ((value / budget.income) * 100).toFixed(0) : '0';
  };

  return (
    <div className="card-elegant">
      <h2 className="text-xl font-bold mb-4">Budget Allocation</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Income</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="number"
            value={incomeInput}
            onChange={handleIncomeChange}
            className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">USD</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">Essentials</label>
              <span className="text-sm text-gray-500">{calculatePercentage(budget.essentials)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max={budget.income}
              value={budget.essentials}
              onChange={(e) => updateBudget({ essentials: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">$0</span>
              <span className="text-xs font-medium">${budget.essentials}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">Debt Payments</label>
              <span className="text-sm text-gray-500">{calculatePercentage(budget.debt)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max={budget.income}
              value={budget.debt}
              onChange={(e) => updateBudget({ debt: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">$0</span>
              <span className="text-xs font-medium">${budget.debt}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">Savings</label>
              <span className="text-sm text-gray-500">{calculatePercentage(budget.savings)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max={budget.income}
              value={budget.savings}
              onChange={(e) => updateBudget({ savings: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">$0</span>
              <span className="text-xs font-medium">${budget.savings}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h3 className="text-sm font-medium mb-2">Quick Presets</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => applyBudgetPreset('frugal')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Frugal
          </button>
          <button
            onClick={() => applyBudgetPreset('balanced')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Balanced
          </button>
          <button
            onClick={() => applyBudgetPreset('aggressive')}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            Aggressive
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetAllocator;
