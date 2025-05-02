
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sword, Flame } from 'lucide-react';
import { Debt } from '@/types/gameTypes';

interface BattleAttackControlsProps {
  debt: Debt;
  cash: number;
  specialMoves: number;
  currentStance: string;
  onAttack: (amount: number) => void;
  onSpecialMove: () => void;
}

const BattleAttackControls: React.FC<BattleAttackControlsProps> = ({
  debt,
  cash,
  specialMoves,
  currentStance,
  onAttack,
  onSpecialMove
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(
    Math.min(debt?.minimumPayment || 0, cash)
  );

  // Ensure payment amount is always within valid range when cash changes
  React.useEffect(() => {
    setPaymentAmount(prev => Math.min(prev, cash));
  }, [cash]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + " HP";
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-6">
      {/* Attack power */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">Attack Strength</span>
          <span className="text-amber-400 font-medium">{formatCurrency(paymentAmount)}</span>
        </div>
        
        <Slider
          value={[paymentAmount]}
          min={Math.min(debt.minimumPayment, cash, 1)}
          max={Math.min(cash, debt.amount)}
          step={5}
          onValueChange={(value) => setPaymentAmount(value[0])}
          className="my-4"
          disabled={cash <= 0}
        />
        
        <div className="flex justify-between text-xs text-slate-500">
          <span>Min: {formatCurrency(Math.min(debt.minimumPayment, cash, 1))}</span>
          <span>Max: {formatCurrency(Math.min(cash, debt.amount))}</span>
        </div>
        
        <div className="mt-3 text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-slate-400">Available Spirit Energy</span>
            <span className={`${cash <= 0 ? 'text-red-400' : 'text-slate-300'}`}>
              {formatCurrency(cash)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Attack buttons */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <motion.div
          whileHover={{ scale: cash > 0 ? 1.02 : 1 }}
          whileTap={{ scale: cash > 0 ? 0.98 : 1 }}
        >
          <Button
            onClick={() => onAttack(paymentAmount)}
            disabled={paymentAmount <= 0 || cash <= 0}
            className={`w-full py-6 ${
              currentStance === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' :
              currentStance === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
              currentStance === 'risky' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500' :
              'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            } ${cash <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Sword className="w-5 h-5 mr-2" />
            Attack ({formatCurrency(paymentAmount)})
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: specialMoves > 0 ? 1.02 : 1 }}
          whileTap={{ scale: specialMoves > 0 ? 0.98 : 1 }}
        >
          <Button
            onClick={onSpecialMove}
            disabled={specialMoves <= 0}
            variant="outline"
            className="w-full border-amber-600 text-amber-500 hover:bg-amber-900/30 py-6"
          >
            <Flame className="w-5 h-5 mr-2" />
            Special Technique ({specialMoves})
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default BattleAttackControls;
