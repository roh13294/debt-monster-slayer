
import React, { useState, useEffect } from 'react';
import { Shield, ZapOff, Sword, Flame, ChevronDown, ChevronUp, Target, Sparkles, Zap } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useGameContext } from '../context/GameContext';
import { Debt } from '../types/gameTypes';
import { getMonsterProfile } from '../utils/monsterProfiles';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";

interface DebtMonsterProps {
  debt: Debt;
  isInBattle?: boolean;
}

const DebtMonster: React.FC<DebtMonsterProps> = ({ debt, isInBattle = false }) => {
  const { damageMonster, useSpecialMove, specialMoves, cash } = useGameContext();
  const [isAttacking, setIsAttacking] = useState(false);
  const [specialAttack, setSpecialAttack] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(Math.min(100, debt.amount / 10));
  const [showDetails, setShowDetails] = useState(false);
  const [monsterState, setMonsterState] = useState<'idle' | 'attacking' | 'damaged'>('idle');
  const [attackCombo, setAttackCombo] = useState(0);
  const [lastAttackTime, setLastAttackTime] = useState(0);
  const [sparkleEffect, setSparkleEffect] = useState(false);
  const [shakeEffect, setShakeEffect] = useState(false);
  const [flashEffect, setFlashEffect] = useState(false);
  
  // Get the monster profile
  const monsterProfile = getMonsterProfile(debt.name);

  // Reset attack combo after inactivity
  useEffect(() => {
    const comboTimer = setTimeout(() => {
      if (attackCombo > 0 && Date.now() - lastAttackTime > 3000) {
        setAttackCombo(0);
      }
    }, 3500);
    
    return () => clearTimeout(comboTimer);
  }, [attackCombo, lastAttackTime]);

  // Occasionally show sparkle effects
  useEffect(() => {
    if (isInBattle) {
      const sparkleTimer = setInterval(() => {
        setSparkleEffect(true);
        setTimeout(() => setSparkleEffect(false), 1000);
      }, Math.random() * 10000 + 5000);
      
      return () => clearInterval(sparkleTimer);
    }
  }, [isInBattle]);

  // Monster colors based on type with enhanced gradients
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
    if (cash < paymentAmount) {
      toast({
        title: "Not Enough Cash",
        description: "You don't have enough cash to make this payment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAttacking(true);
    setSpecialAttack(false);
    setMonsterState('damaged');
    setShakeEffect(true);
    
    // Update combo counter for consecutive attacks
    const now = Date.now();
    if (now - lastAttackTime < 2000) {
      setAttackCombo(prev => prev + 1);
      
      // Bonus damage for combos
      const comboMultiplier = Math.min(2, 1 + (attackCombo * 0.1));
      const adjustedAmount = Math.floor(paymentAmount * comboMultiplier);
      
      if (comboMultiplier > 1) {
        toast({
          title: "Combo Attack!",
          description: `${attackCombo + 1}x combo for ${Math.round((comboMultiplier - 1) * 100)}% bonus damage!`,
          variant: "default",
        });
      }
      
      damageMonster(debt.id, adjustedAmount);
    } else {
      setAttackCombo(1);
      damageMonster(debt.id, paymentAmount);
    }
    
    setLastAttackTime(now);
    
    // Reset shake effect
    setTimeout(() => {
      setShakeEffect(false);
    }, 500);
    
    setTimeout(() => {
      setIsAttacking(false);
      setMonsterState('idle');
    }, 500);
  };

  const handleSpecialMove = () => {
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves",
        description: "You don't have any special moves available.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAttacking(true);
    setSpecialAttack(true);
    setMonsterState('damaged');
    setFlashEffect(true);
    
    useSpecialMove(debt.id);
    
    toast({
      title: "Special Move!",
      description: "You used a powerful special attack!",
      variant: "destructive",
    });
    
    // Reset flash effect
    setTimeout(() => {
      setFlashEffect(false);
    }, 800);
    
    setTimeout(() => {
      setIsAttacking(false);
      setMonsterState('idle');
    }, 800);
  };

  const monsterAttack = () => {
    if (!isInBattle) return;
    
    setMonsterState('attacking');
    
    toast({
      title: `${monsterProfile.name} attacks!`,
      description: `The monster used ${monsterProfile.abilities[Math.floor(Math.random() * monsterProfile.abilities.length)]}!`,
      variant: "default", 
    });
    
    setTimeout(() => {
      setMonsterState('idle');
    }, 1000);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Occasionally have the monster attack back during battle mode
  useEffect(() => {
    if (isInBattle && monsterState === 'idle') {
      const attackTimer = setTimeout(() => {
        // 20% chance to counter-attack
        if (Math.random() < 0.2) {
          monsterAttack();
        }
      }, Math.random() * 10000 + 5000);
      
      return () => clearTimeout(attackTimer);
    }
  }, [isInBattle, monsterState]);

  // Calculate monster health color based on remaining health
  const getHealthColor = () => {
    if (debt.health < 30) return "from-green-500 to-green-300";
    if (debt.health < 70) return "from-yellow-500 to-yellow-300";
    return "from-red-500 to-red-300";
  };

  // Update payment amount when debt changes
  useEffect(() => {
    setPaymentAmount(prev => Math.min(prev, debt.amount));
  }, [debt.amount]);

  return (
    <div 
      className={`monster ${monsterColors[debt.monsterType]} 
      ${shakeEffect ? 'monster-damaged' : ''} 
      ${monsterState === 'attacking' ? 'monster-attacking' : ''} 
      ${flashEffect ? 'animate-flash' : ''}
      transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg relative overflow-hidden
      ${isInBattle ? 'p-6 rounded-xl' : 'p-4 rounded-lg'}`}
    >
      {/* Special attack effect */}
      {specialAttack && (
        <div className="absolute inset-0 bg-white/40 animate-pulse z-10"></div>
      )}
      
      {/* Monster attacking effect */}
      {monsterState === 'attacking' && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse z-10"></div>
      )}
      
      {/* Sparkle effect */}
      {sparkleEffect && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          <Sparkles className="absolute text-yellow-300 animate-sparkle" style={{ top: '10%', left: '80%', width: 20, height: 20 }} />
          <Sparkles className="absolute text-blue-300 animate-sparkle" style={{ top: '70%', left: '20%', width: 16, height: 16 }} />
          <Sparkles className="absolute text-purple-300 animate-sparkle" style={{ top: '40%', left: '60%', width: 24, height: 24 }} />
        </div>
      )}
      
      {/* Background decoration */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
      
      <div className="flex items-center justify-between mb-3 relative z-20">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${isInBattle ? 'p-3' : ''} bg-white/20 backdrop-blur-sm rounded-lg 
            ${monsterState === 'attacking' ? 'animate-bounce' : 'animate-pulse-subtle'}`}>
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
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-white/90">Monster Health</span>
          <span className="text-sm font-medium text-white/80">{debt.health.toFixed(0)}%</span>
        </div>
        
        <div className="h-4 bg-gray-700/40 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${getHealthColor()} shadow-inner`}
            style={{ width: `${debt.health}%` }}
          >
            {debt.health > 15 && (
              <div className="h-1/2 bg-white/20 rounded-full mx-1 mt-0.5"></div>
            )}
          </div>
        </div>
      </div>
      
      {isInBattle && (
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-3">
          <p className="text-sm italic mb-3">
            {attackCombo > 3 
              ? "The monster is staggering from your combo attacks!" 
              : monsterState === 'attacking'
                ? `${monsterProfile.name} is preparing an attack!`
                : monsterProfile.story.split('.')[0] + '.'}
          </p>
          
          {attackCombo > 0 && (
            <div className="mb-3 bg-white/20 backdrop-blur-sm rounded-md p-2 text-center animate-pulse">
              <span className="font-bold text-lg">{attackCombo}x</span> 
              <span className="ml-1 text-sm">combo!</span>
              {attackCombo > 2 && <Zap className="inline-block ml-1 h-4 w-4 animate-pulse" />}
            </div>
          )}
        </div>
      )}
      
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
        
        <Button
          onClick={handleAttack}
          variant="default"
          disabled={cash < paymentAmount}
          className={`px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-1 animate-pulse-subtle ${
            cash < paymentAmount ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Sword className="h-4 w-4" />
          Attack
        </Button>
        
        <Button
          onClick={handleSpecialMove}
          disabled={specialMoves <= 0}
          variant={specialMoves > 0 ? "default" : "outline"}
          className={`px-4 py-2 rounded-lg transition-all backdrop-blur-sm flex items-center justify-center gap-1 animate-pulse-subtle ${
            specialMoves > 0 
              ? 'bg-white/20 hover:bg-white/30 hover:shadow-md' 
              : 'bg-white/10 cursor-not-allowed'
          }`}
        >
          <Flame className="h-4 w-4" />
          Special ({specialMoves})
        </Button>
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
