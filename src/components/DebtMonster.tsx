
import React, { useState } from 'react';
import { Shield, ZapOff, Sword } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useGameContext, Debt } from '../context/GameContext';

interface DebtMonsterProps {
  debt: Debt;
}

const DebtMonster: React.FC<DebtMonsterProps> = ({ debt }) => {
  const { damageMonster, useSpecialMove, specialMoves } = useGameContext();
  const [isAttacking, setIsAttacking] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(100);

  // Monster colors based on type
  const monsterColors = {
    red: 'bg-monster-red text-white',
    blue: 'bg-monster-blue text-white',
    green: 'bg-monster-green text-white',
    purple: 'bg-monster-purple text-white',
    yellow: 'bg-monster-yellow text-black'
  };

  // Monster icons based on type
  const MonsterIcon = () => {
    switch (debt.monsterType) {
      case 'red':
        return <ZapOff className="w-10 h-10" />;
      case 'blue':
        return <Shield className="w-10 h-10" />;
      default:
        return <Sword className="w-10 h-10" />;
    }
  };

  const handleAttack = () => {
    setIsAttacking(true);
    damageMonster(debt.id, paymentAmount);
    setTimeout(() => setIsAttacking(false), 500);
  };

  const handleSpecialMove = () => {
    setIsAttacking(true);
    useSpecialMove(debt.id);
    setTimeout(() => setIsAttacking(false), 500);
  };

  return (
    <div className={`monster ${monsterColors[debt.monsterType]} ${isAttacking ? 'monster-damaged' : ''} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <MonsterIcon />
          </div>
          <div>
            <h3 className="font-bold">{debt.name}</h3>
            <div className="text-sm opacity-90">
              ${debt.amount.toFixed(2)} at {debt.interest}% APR
            </div>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-white/20 rounded-full">
          Min: ${debt.minimumPayment}/mo
        </div>
      </div>
      
      <ProgressBar 
        progress={100 - debt.health} 
        color={`bg-white`} 
        label="Damage" 
      />
      
      <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <div className="flex-1 flex items-center space-x-2">
          <input
            type="range"
            min="10"
            max={Math.min(1000, debt.amount)}
            step="10"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm font-medium w-20">${paymentAmount}</span>
        </div>
        
        <button
          onClick={handleAttack}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          Attack
        </button>
        
        <button
          onClick={handleSpecialMove}
          disabled={specialMoves <= 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            specialMoves > 0 
              ? 'bg-white/20 hover:bg-white/30' 
              : 'bg-white/10 cursor-not-allowed'
          }`}
        >
          Special ({specialMoves})
        </button>
      </div>
    </div>
  );
};

export default DebtMonster;
