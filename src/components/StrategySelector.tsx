
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { ArrowDownToLine, TrendingDown } from 'lucide-react';

const StrategySelector: React.FC = () => {
  const { strategy, setStrategy } = useGameContext();

  return (
    <div className="card-elegant">
      <h2 className="text-xl font-bold mb-4">Repayment Strategy</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setStrategy('snowball')}
          className={`relative p-4 rounded-xl border transition-all duration-300 ${
            strategy === 'snowball'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-blue-100 rounded-full">
              <ArrowDownToLine className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Snowball Method</h3>
              <p className="text-sm text-gray-600">Pay off smallest debts first for quick wins</p>
            </div>
          </div>
          
          {strategy === 'snowball' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse-subtle"></div>
          )}
        </button>
        
        <button
          onClick={() => setStrategy('avalanche')}
          className={`relative p-4 rounded-xl border transition-all duration-300 ${
            strategy === 'avalanche'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-blue-100 rounded-full">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">Avalanche Method</h3>
              <p className="text-sm text-gray-600">Pay off highest interest debts first to save money</p>
            </div>
          </div>
          
          {strategy === 'avalanche' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse-subtle"></div>
          )}
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          {strategy === 'snowball'
            ? 'The Snowball method helps you build momentum by completely paying off small debts first, giving you psychological wins.'
            : 'The Avalanche method saves you the most money overall by tackling high-interest debt first, reducing the total interest paid.'
          }
        </p>
      </div>
    </div>
  );
};

export default StrategySelector;
