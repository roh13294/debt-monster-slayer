
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sword, ShieldAlert, ArrowLeft, ArrowRight, Flame, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Debt } from '@/types/gameTypes';

interface BattleControlsProps {
  debt: Debt;
  stance: string | null;
  cash: number;
  specialMoves: number;
  onAttack: (amount: number) => void;
  onSpecialMove: () => void;
}

const BattleControls: React.FC<BattleControlsProps> = ({
  debt,
  stance,
  cash,
  specialMoves,
  onAttack,
  onSpecialMove
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(Math.min(debt.minimumPayment, cash));
  const maxPayment = Math.min(cash, debt.amount);
  
  const getStanceBonus = (): number => {
    switch(stance) {
      case 'aggressive': return 1.2;
      case 'defensive': return 0.9;
      case 'risky': return Math.random() > 0.7 ? 1.5 : 1.0;
      default: return 1.0;
    }
  };
  
  const handleAttack = () => {
    const adjustedAmount = Math.round(paymentAmount * getStanceBonus());
    onAttack(adjustedAmount);
  };
  
  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6">
      <h3 className="text-xl font-medium text-slate-100 mb-2 flex items-center gap-2">
        <Sword className="w-5 h-5 text-amber-400" />
        Channel Your Spirit Energy
      </h3>
      
      <div className="grid gap-4">
        <div className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Attack Strength</span>
            <span className="text-amber-400 font-medium">${paymentAmount}</span>
          </div>
          
          <Slider
            value={[paymentAmount]}
            min={debt.minimumPayment > maxPayment ? maxPayment : debt.minimumPayment}
            max={maxPayment}
            step={5}
            onValueChange={(value) => setPaymentAmount(value[0])}
            className="my-4"
          />
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>Min: ${debt.minimumPayment > maxPayment ? maxPayment : debt.minimumPayment}</span>
            <span>Max: ${maxPayment}</span>
          </div>
          
          <div className="mt-3 text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">Available Spirit Energy</span>
              <span className="text-slate-300">${cash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Enemy Health</span>
              <span className="text-slate-300">${debt.amount}</span>
            </div>
          </div>
        </div>
        
        {stance && (
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700 flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              stance === 'aggressive' ? 'bg-red-900/30 text-red-400' :
              stance === 'defensive' ? 'bg-blue-900/30 text-blue-400' :
              'bg-amber-900/30 text-amber-400'
            }`}>
              {stance === 'aggressive' && <Flame className="w-5 h-5" />}
              {stance === 'defensive' && <ShieldAlert className="w-5 h-5" />}
              {stance === 'risky' && <Zap className="w-5 h-5" />}
            </div>
            <div>
              <div className="font-medium text-slate-300">
                {stance === 'aggressive' && 'Flame Breathing'}
                {stance === 'defensive' && 'Water Breathing'}
                {stance === 'risky' && 'Thunder Breathing'}
              </div>
              <div className="text-xs text-slate-400">
                {stance === 'aggressive' && 'Attacks deal +20% damage'}
                {stance === 'defensive' && 'Conserves energy but deals -10% damage'}
                {stance === 'risky' && 'Chance for critical hits (+50% damage)'}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            onClick={handleAttack}
            disabled={paymentAmount <= 0 || cash <= 0}
            className={`py-6 ${
              stance === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' :
              stance === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
              stance === 'risky' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500' :
              'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
            }`}
          >
            <Sword className="w-5 h-5 mr-2" />
            Attack!
          </Button>
          
          <Button
            onClick={onSpecialMove}
            disabled={specialMoves <= 0}
            variant="outline"
            className="border-amber-500 text-amber-400 hover:bg-amber-950/50 py-6"
          >
            <Zap className="w-5 h-5 mr-2 text-amber-400" />
            Special Move ({specialMoves})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BattleControls;
