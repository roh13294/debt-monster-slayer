
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { Coins, Trophy, Flame, BookOpen, Home } from 'lucide-react';
import CorruptionMeter from '@/components/ui/CorruptionMeter';

interface MonthlySummaryEnhancedProps {
  stance: string | null;
  onFinish: () => void;
}

const MonthlySummaryEnhanced: React.FC<MonthlySummaryEnhancedProps> = ({ 
  stance, 
  onFinish 
}) => {
  const { 
    cash, 
    totalDebt, 
    budget, 
    shadowForm, 
    corruptionLevel,
    templeLevel,
    calculateTempleReturn,
    monthsPassed
  } = useGameContext();
  
  const [showFinancials, setShowFinancials] = useState<boolean>(false);
  const [showCorruption, setShowCorruption] = useState<boolean>(false);
  const [showTemple, setShowTemple] = useState<boolean>(false);
  const [showFuture, setShowFuture] = useState<boolean>(false);
  
  // Summary data
  const templeReturn = calculateTempleReturn();
  const totalIncome = budget.income + templeReturn;
  const totalExpenses = budget.essentials + budget.debt;
  const netMonthly = totalIncome - totalExpenses;
  
  // Narrative elements based on game state
  const getNarrativeTitle = (): string => {
    if (shadowForm && corruptionLevel >= 75) {
      return "The Shadows Deepen";
    } else if (shadowForm) {
      return "Walking the Edge";
    } else if (totalDebt <= 0) {
      return "Path to Freedom";
    } else if (netMonthly < 0) {
      return "Financial Pressure";
    } else {
      return "Progress Continues";
    }
  };
  
  const getNarrativeText = (): string => {
    if (shadowForm && corruptionLevel >= 75) {
      return "The corruption within you grows stronger with each passing day. Your shadow powers provide strength, but at what cost to your humanity?";
    } else if (shadowForm) {
      return "You feel the shadow's pull growing stronger. Its power aids your battles, but the corruption slowly reshapes your very being.";
    } else if (totalDebt <= 0) {
      return "You've vanquished your financial demons! Freedom beckons, but new challenges may yet appear on the horizon.";
    } else if (netMonthly < 0) {
      return "Your finances remain strained. The demons sense your struggle, growing more powerful with each day that passes.";
    } else {
      return "You continue to make progress against your demons. Stay vigilant, for the path to financial freedom is long and filled with trials.";
    }
  };
  
  // Animate sections sequentially
  useEffect(() => {
    const timer1 = setTimeout(() => setShowFinancials(true), 500);
    const timer2 = setTimeout(() => setShowCorruption(true), 1500);
    const timer3 = setTimeout(() => setShowTemple(true), 2500);
    const timer4 = setTimeout(() => setShowFuture(true), 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-slate-900/95 backdrop-blur-xl p-6 rounded-xl border border-slate-700 shadow-lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">{getNarrativeTitle()}</h2>
          <p className="text-slate-300">{getNarrativeText()}</p>
          
          <div className="flex justify-center mt-4">
            <div className="flex items-center px-4 py-2 bg-slate-800 rounded-lg">
              <Flame className="mr-2 h-5 w-5 text-amber-400" />
              <span className="text-white font-medium">Month {monthsPassed}</span>
              <span className="text-slate-400 mx-2">|</span>
              <span className="text-amber-300 font-medium">
                {stance ? stance.charAt(0).toUpperCase() + stance.slice(1) : 'Balanced'} Stance
              </span>
            </div>
          </div>
        </motion.div>
        
        {showFinancials && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Coins className="mr-2 h-5 w-5 text-amber-400" />
              Monthly Financials
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm text-slate-400 mb-2">Income</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Salary</span>
                    <span className="text-green-400">{budget.income}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Temple Returns</span>
                    <span className="text-green-400">+{templeReturn}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-1 mt-1 flex justify-between font-medium">
                    <span className="text-white">Total Income</span>
                    <span className="text-green-500">+{totalIncome}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                <h4 className="text-sm text-slate-400 mb-2">Expenses</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Essentials</span>
                    <span className="text-red-400">-{budget.essentials}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Debt Payments</span>
                    <span className="text-red-400">-{budget.debt}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-1 mt-1 flex justify-between font-medium">
                    <span className="text-white">Total Expenses</span>
                    <span className="text-red-500">-{totalExpenses}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 flex justify-between items-center">
              <span className="text-white font-medium">Net Monthly:</span>
              <span className={`font-bold text-lg ${netMonthly >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {netMonthly >= 0 ? '+' : ''}{netMonthly}
              </span>
            </div>
          </motion.div>
        )}
        
        {shadowForm && showCorruption && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v1m0 16v1m-8-9H3m3.314-5.686L5.5 5.5m12.186.814L18.5 5.5m-12.186 12.186L5.5 18.5m12.186-.814L18.5 18.5M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Corruption Status
            </h3>
            
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-300">Current Form:</p>
                  <p className="text-lg font-medium text-red-400">
                    {shadowForm === 'cursedBlade' ? 'Cursed Blade' : 
                     shadowForm === 'leecher' ? 'Debt Leecher' : 
                     'Whisperer'}
                  </p>
                </div>
                <div className="flex items-center">
                  <CorruptionMeter size="lg" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 rounded bg-slate-900/50 text-sm">
                  <p className="text-slate-300">Corruption effects active:</p>
                  <ul className="mt-1 space-y-1 pl-5 list-disc text-xs">
                    {shadowForm === 'cursedBlade' ? (
                      <>
                        <li className="text-green-400">+50% damage vs demons</li>
                        <li className="text-green-400">-50% interest rate on debts</li>
                        <li className="text-red-400">-10% savings each month</li>
                      </>
                    ) : shadowForm === 'leecher' ? (
                      <>
                        <li className="text-green-400">Absorb essence for healing</li>
                        <li className="text-green-400">25% chance to double payments</li>
                        <li className="text-red-400">Cannot save money</li>
                      </>
                    ) : (
                      <>
                        <li className="text-green-400">Preview upcoming events</li>
                        <li className="text-green-400">+30% XP from all sources</li>
                        <li className="text-red-400">-50% combat XP</li>
                      </>
                    )}
                    
                    {corruptionLevel >= 75 && (
                      <li className="text-red-400 font-medium">WARNING: Corruption nearing critical levels</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {showTemple && templeLevel > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-indigo-400 mb-3 flex items-center">
              <Home className="mr-2 h-5 w-5" />
              Wealth Temple Status
            </h3>
            
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Temple Level</p>
                  <p className="text-lg font-medium text-indigo-400">{templeLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Monthly Return</p>
                  <p className="text-lg font-medium text-amber-400">+{templeReturn}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Return Rate</p>
                  <p className="text-lg font-medium text-green-400">
                    {(templeReturn / cash * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Next Upgrade</p>
                  <p className="text-lg font-medium text-purple-400">{1000 * templeLevel}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {showFuture && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Looking Ahead
            </h3>
            
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
              <p className="text-slate-300 mb-3">
                The demons grow restless as you approach the next month. New challenges await...
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-slate-900/70 rounded p-2 text-center">
                  <p className="text-xs text-slate-400 mb-1">New Enemies</p>
                  <p className="text-sm font-medium text-red-400">3 Demons</p>
                </div>
                <div className="bg-slate-900/70 rounded p-2 text-center">
                  <p className="text-xs text-slate-400 mb-1">Opportunities</p>
                  <p className="text-sm font-medium text-green-400">2 Events</p>
                </div>
                <div className="bg-slate-900/70 rounded p-2 text-center">
                  <p className="text-xs text-slate-400 mb-1">Challenges</p>
                  <p className="text-sm font-medium text-amber-400">1 Quest</p>
                </div>
              </div>
              
              {shadowForm === 'whisperer' && (
                <div className="p-2 bg-blue-900/20 border border-blue-800/30 rounded text-sm mb-3">
                  <p className="text-blue-300">
                    <span className="font-medium">Whisperer's Insight:</span> Your shadow powers grant you a glimpse of what's to come. A major life event will test your resolve next month.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showFuture ? 1 : 0 }}
          className="text-center"
        >
          <Button 
            onClick={onFinish}
            className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 px-8 py-3"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Continue to Next Month
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MonthlySummaryEnhanced;
