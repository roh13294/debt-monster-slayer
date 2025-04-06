
import React from 'react';
import { Coins, CalendarDays, Sparkles, PiggyBank, Zap } from 'lucide-react';

interface FinancialSummaryCardProps {
  type: 'cash' | 'debt' | 'progress';
  title: string;
  value: string | number;
  children?: React.ReactNode;
  details?: {
    leftLabel: string;
    leftValue: string;
    rightLabel: string;
    rightValue: string;
  };
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ 
  type, title, value, children, details 
}) => {
  const getCardIcon = () => {
    switch (type) {
      case 'cash': return <Coins className="h-6 w-6 text-green-500" />;
      case 'debt': return <CalendarDays className="h-6 w-6 text-purple-400" />;
      case 'progress': return <Sparkles className="h-6 w-6 text-amber-400" />;
      default: return <Coins className="h-6 w-6" />;
    }
  };
  
  const getGradientClasses = () => {
    switch (type) {
      case 'cash': return {
        bg: 'from-green-500/10 to-blue-500/10',
        text: 'text-green-400'
      };
      case 'debt': return {
        bg: 'from-red-500/10 to-purple-500/10',
        text: 'text-purple-400'
      };
      case 'progress': return {
        bg: 'from-amber-500/10 to-orange-500/10',
        text: 'text-amber-400'
      };
      default: return {
        bg: 'from-blue-500/10 to-indigo-500/10',
        text: 'text-blue-400'
      };
    }
  };
  
  const { bg, text } = getGradientClasses();
  
  return (
    <div className="oni-card flex flex-col justify-between relative overflow-hidden group">
      <div className={`absolute -right-10 top-0 h-40 w-40 bg-gradient-to-br ${bg} rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity`}></div>
      <div className="p-5 relative z-10">
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <div className="flex items-center">
          <div className={`p-2 bg-gradient-to-br ${bg} rounded-full mr-3`}>
            {getCardIcon()}
          </div>
          <span className={`text-2xl font-bold ${text} oni-text-glow`}>{value}</span>
        </div>
        
        {type === 'progress' && (
          <div className="flex mt-2 items-center space-x-3">
            <div className="flex items-center">
              <PiggyBank className="h-4 w-4 text-blue-400 mr-1" />
              <span className="text-xs text-blue-300">Savings: {details?.leftValue}</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-purple-400 mr-1" />
              <span className="text-xs text-purple-300">Level: {details?.rightValue}</span>
            </div>
          </div>
        )}
      </div>
      
      {details && type !== 'progress' && (
        <div className="bg-white/5 mt-4 p-3 rounded-b-xl flex justify-between items-center backdrop-blur-sm">
          <div>
            <p className="text-xs text-gray-400">{details.leftLabel}</p>
            <p className={`text-sm font-medium ${type === 'cash' ? 'text-green-400' : 'text-purple-400'}`}>
              {details.leftValue}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{details.rightLabel}</p>
            <p className={`text-sm font-medium ${type === 'cash' ? 'text-red-400' : 'text-amber-400'}`}>
              {details.rightValue}
            </p>
          </div>
        </div>
      )}
      
      {children && <div className="mt-4 p-3">{children}</div>}
    </div>
  );
};

export default FinancialSummaryCard;
