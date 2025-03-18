
import React, { useState } from 'react';
import { Shield, ZapOff, Sword, Flame, Target, ChevronDown, ChevronUp } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useGameContext, Debt } from '../context/GameContext';
import { getMonsterProfile } from '../utils/monsterProfiles';

interface DebtMonsterProps {
  debt: Debt;
}

const DebtMonster: React.FC<DebtMonsterProps> = ({ debt }) => {
  const { damageMonster, useSpecialMove, specialMoves } = useGameContext();
  const [isAttacking, setIsAttacking] = useState(false);
  const [specialAttack, setSpecialAttack] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(100);
  const [showDetails, setShowDetails] = useState(false);
  
  // Get the monster profile
  const monsterProfile = getMonsterProfile(debt.name);

  // Monster colors based on type
  const monsterColors = {
    red: 'bg-gradient-to-br from-monster-red to-red-600 text-white',
    blue: 'bg-gradient-to-br from-monster-blue to-blue-600 text-white',
    green: 'bg-gradient-to-br from-monster-green to-green-600 text-white',
    purple: 'bg-gradient-to-br from-monster-purple to-purple-600 text-white',
    yellow: 'bg-gradient-to-br from-monster-yellow to-yellow-500 text-black'
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
    setSpecialAttack(false);
    damageMonster(debt.id, paymentAmount);
    setTimeout(() => setIsAttacking(false), 500);
  };

  const handleSpecialMove = () => {
    setIsAttacking(true);
    setSpecialAttack(true);
    useSpecialMove(debt.id);
    setTimeout(() => setIsAttacking(false), 800);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div 
      className={`monster ${monsterColors[debt.monsterType]} ${isAttacking ? 'monster-damaged' : ''} 
      transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg relative overflow-hidden`}
    >
      {/* Special attack effect */}
      {specialAttack && (
        <div className="absolute inset-0 bg-white/40 animate-pulse z-10"></div>
      )}
      
      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-20">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <MonsterIcon />
          </div>
          <div>
            <h3 className="font-bold">{monsterProfile.name}</h3>
            <div className="text-sm opacity-90">
              ${debt.amount.toFixed(2)} at {debt.interest}% APR
            </div>
            <div className="text-xs italic mt-1">"{monsterProfile.catchphrase}"</div>
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
          Min: ${debt.minimumPayment}/mo
        </div>
      </div>
      
      <div className="relative z-20">
        <ProgressBar 
          progress={100 - debt.health} 
          color={`bg-gradient-to-r from-white/80 to-white/60`} 
          label="Damage" 
        />
      </div>
      
      <div className="mt-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 relative z-20">
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
          <span className="text-sm font-medium w-20 bg-white/20 backdrop-blur-sm rounded-md px-2 py-0.5">${paymentAmount}</span>
        </div>
        
        <button
          onClick={handleAttack}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-1"
        >
          <Sword className="h-4 w-4" />
          Attack
        </button>
        
        <button
          onClick={handleSpecialMove}
          disabled={specialMoves <= 0}
          className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm flex items-center justify-center gap-1 ${
            specialMoves > 0 
              ? 'bg-white/20 hover:bg-white/30 hover:shadow-md' 
              : 'bg-white/10 cursor-not-allowed'
          }`}
        >
          <Flame className="h-4 w-4" />
          Special ({specialMoves})
        </button>
      </div>
      
      <button 
        onClick={toggleDetails}
        className="w-full mt-4 flex items-center justify-center py-1 bg-white/10 hover:bg-white/20 transition-all text-xs font-medium"
      >
        {showDetails ? 'Hide Details' : 'Monster Details'} 
        {showDetails ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </button>
      
      {showDetails && (
        <div className="mt-2 bg-white/10 p-3 rounded-lg text-sm animate-fade-in">
          <p className="mb-2"><strong>Personality:</strong> {monsterProfile.personality}</p>
          <p className="mb-2"><strong>Weakness:</strong> {monsterProfile.weakness}</p>
          <p className="mb-3">{monsterProfile.story}</p>
          
          <div className="mb-1"><strong>Special Abilities:</strong></div>
          <ul className="list-disc list-inside space-y-1">
            {monsterProfile.abilities.map((ability, index) => (
              <li key={index} className="text-xs">{ability}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DebtMonster;
