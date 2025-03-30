
import React from 'react';
import { useGameContext } from '../context/GameContext';
import { ArrowDownToLine, TrendingDown } from 'lucide-react';

const StrategySelector: React.FC = () => {
  const { strategy, setStrategy } = useGameContext();

  return (
    <div className="space-y-4">      
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={() => setStrategy('snowball')}
          className={`relative p-3 rounded-xl border transition-all duration-300 ${
            strategy === 'snowball'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-blue-100 rounded-full">
              <ArrowDownToLine className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">Snowball Method</h3>
              <p className="text-xs text-gray-600 truncate">Pay off smallest debts first</p>
            </div>
          </div>
          
          {strategy === 'snowball' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse-subtle"></div>
          )}
        </button>
        
        <button
          onClick={() => setStrategy('avalanche')}
          className={`relative p-3 rounded-xl border transition-all duration-300 ${
            strategy === 'avalanche'
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-gray-200 hover:border-primary/50'
          }`}
        >
          <div className="flex items-center">
            <div className="mr-3 p-2 bg-blue-100 rounded-full">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate">Avalanche Method</h3>
              <p className="text-xs text-gray-600 truncate">Pay high interest first</p>
            </div>
          </div>
          
          {strategy === 'avalanche' && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse-subtle"></div>
          )}
        </button>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg text-xs">
        <p className="text-gray-600">
          {strategy === 'snowball'
            ? 'The Snowball method builds momentum by paying off small debts first, giving you psychological wins.'
            : 'The Avalanche method saves you money by tackling high-interest debt first, reducing total interest paid.'
          }
        </p>
      </div>
    </div>
  );
};

export default StrategySelector;
