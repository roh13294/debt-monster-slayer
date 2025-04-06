
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown, Coins, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';

interface MonthSummaryProps {
  stance: string | null;
  onFinish: () => void;
}

const MonthSummary: React.FC<MonthSummaryProps> = ({ stance, onFinish }) => {
  const { 
    cash, 
    monthsPassed,
    totalDebt,
    specialMoves,
    budget
  } = useGameContext();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  return (
    <div className="min-h-[70vh] relative overflow-hidden bg-slate-900 rounded-lg border border-slate-700">
      {/* Summary background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900/30 z-0"></div>
      
      {/* Summary content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-16 px-4">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">Month {monthsPassed} Complete</h2>
          <p className="text-xl text-slate-300">Your financial journey continues...</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Financial Status */}
          <motion.div 
            className="bg-slate-800/60 rounded-lg p-6 border border-slate-700"
            variants={itemVariants}
          >
            <h3 className="text-xl text-white mb-4 flex items-center">
              <Coins className="mr-2 text-yellow-400" /> Financial Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Current Cash</span>
                <span className="text-white font-bold">{formatCurrency(cash)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Total Debt</span>
                <span className="text-white font-bold">{formatCurrency(totalDebt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Special Moves</span>
                <span className="text-white font-bold">{specialMoves}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Monthly Summary */}
          <motion.div 
            className="bg-slate-800/60 rounded-lg p-6 border border-slate-700"
            variants={itemVariants}
          >
            <h3 className="text-xl text-white mb-4 flex items-center">
              <PiggyBank className="mr-2 text-green-400" /> Monthly Activity
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Income</span>
                <span className="text-green-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> {formatCurrency(budget.income)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                <span className="text-slate-300">Expenses</span>
                <span className="text-red-400 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" /> {formatCurrency(budget.essentials)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Debt Payments</span>
                <span className="text-amber-400">{formatCurrency(budget.debt)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Stance effect summary */}
        {stance && (
          <motion.div 
            className="bg-slate-800/60 rounded-lg p-4 border border-slate-700 max-w-lg w-full mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <h3 className="text-lg text-white mb-2">Stance Effects</h3>
            <p className="text-sm text-slate-300">
              {stance === 'aggressive' && 'Your aggressive stance helped you pay down debt more efficiently this month.'}
              {stance === 'defensive' && 'Your defensive stance helped you build savings and protect your finances.'}
              {stance === 'risky' && 'Your risky approach led to unpredictable outcomes in your financial journey.'}
            </p>
          </motion.div>
        )}
        
        {/* Continue button */}
        <Button 
          onClick={onFinish}
          className="bg-gradient-to-br from-purple-600 to-blue-600 hover:opacity-90 text-white"
        >
          Continue Journey <ArrowRight className="ml-1 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MonthSummary;
