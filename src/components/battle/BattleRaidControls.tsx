
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sword, Shield, Flame, Droplets, Wind } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { toast } from '@/hooks/use-toast';

interface BattleRaidControlsProps {
  onAttack: (damage: number, isCritical: boolean) => void;
  onUseSpecial: () => void;
  onSelectStance: (stance: string) => void;
  specialMoves: number;
  selectedStance: string | null;
  isAttacking: boolean;
  isInCombo: boolean;
  comboLevel: number;
  lastAttackTime: number;
}

const BattleRaidControls: React.FC<BattleRaidControlsProps> = ({
  onAttack,
  onUseSpecial,
  onSelectStance,
  specialMoves,
  selectedStance,
  isAttacking,
  isInCombo,
  comboLevel,
  lastAttackTime
}) => {
  const { playerTraits, breathingXP, shadowForm } = useGameContext();
  const [comboWindow, setComboWindow] = useState<number>(2000); // 2 seconds
  const [comboTimeLeft, setComboTimeLeft] = useState<number>(0);
  const [showComboTimer, setShowComboTimer] = useState<boolean>(false);
  
  // Calculate attack damage based on player stats and stance
  const calculateAttackDamage = () => {
    // Base damage is influenced by determination
    let baseDamage = 10 + (playerTraits.determination * 2);
    
    // Apply stance multipliers
    if (selectedStance === 'flame') {
      baseDamage *= 1.3; // Flame stance increases damage
    } else if (selectedStance === 'water') {
      baseDamage *= 0.9; // Water stance focuses on defense, less damage
    } else if (selectedStance === 'thunder') {
      // Thunder stance has chance for critical hits
      const isCritical = Math.random() < 0.25;
      if (isCritical) {
        baseDamage *= 1.5;
      }
    } else if (selectedStance === 'wind') {
      // Wind stance focuses on combo building
      if (comboLevel > 0) {
        baseDamage *= (1 + (comboLevel * 0.1));
      }
    }
    
    // Apply combo multipliers
    if (isInCombo) {
      baseDamage *= (1 + (Math.min(comboLevel, 10) * 0.15));
    }
    
    // Apply breathing XP bonus (small incremental boost)
    baseDamage *= (1 + (breathingXP / 1000));
    
    // Apply shadow form effects
    if (shadowForm === 'cursedBlade') {
      baseDamage *= 1.5; // Cursed Blade increases damage
    }
    
    return Math.floor(baseDamage);
  };
  
  // Handle attack action
  const handleAttack = () => {
    if (isAttacking) return;
    
    const damage = calculateAttackDamage();
    const isCritical = selectedStance === 'thunder' && Math.random() < 0.25;
    
    // Trigger the attack
    onAttack(damage, isCritical);
    
    // Sound effect
    const audio = new Audio(isCritical ? '/sounds/critical-hit.mp3' : '/sounds/sword-slash.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
    
    // Update combo window visibility
    if (Date.now() - lastAttackTime < comboWindow) {
      setShowComboTimer(true);
    }
  };
  
  // Handle special move use
  const handleSpecial = () => {
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves",
        description: "You don't have any special moves available.",
        variant: "destructive",
      });
      return;
    }
    
    onUseSpecial();
    
    // Sound effect
    const audio = new Audio('/sounds/special-move.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
  };
  
  // Combo timer effect
  useEffect(() => {
    if (!isInCombo || lastAttackTime === 0) return;
    
    const interval = setInterval(() => {
      const timeElapsed = Date.now() - lastAttackTime;
      const timeLeft = Math.max(0, comboWindow - timeElapsed);
      setComboTimeLeft(timeLeft);
      
      if (timeLeft === 0) {
        setShowComboTimer(false);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isInCombo, lastAttackTime, comboWindow]);
  
  return (
    <div className="w-full">
      {/* Stance Selection */}
      <div className="flex justify-center space-x-2 mb-4">
        <Button
          variant={selectedStance === 'flame' ? 'default' : 'outline'}
          className={`px-3 py-1 ${
            selectedStance === 'flame' 
              ? 'bg-gradient-to-r from-red-600 to-orange-500 border-red-400' 
              : 'border-red-700/40 bg-red-900/10'
          }`}
          onClick={() => onSelectStance('flame')}
        >
          <Flame className="w-4 h-4 mr-1" />
          <span className="text-xs">Flame</span>
        </Button>
        
        <Button
          variant={selectedStance === 'water' ? 'default' : 'outline'}
          className={`px-3 py-1 ${
            selectedStance === 'water' 
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-400' 
              : 'border-blue-700/40 bg-blue-900/10'
          }`}
          onClick={() => onSelectStance('water')}
        >
          <Droplets className="w-4 h-4 mr-1" />
          <span className="text-xs">Water</span>
        </Button>
        
        <Button
          variant={selectedStance === 'thunder' ? 'default' : 'outline'}
          className={`px-3 py-1 ${
            selectedStance === 'thunder' 
              ? 'bg-gradient-to-r from-yellow-500 to-amber-400 border-yellow-400' 
              : 'border-yellow-700/40 bg-yellow-900/10'
          }`}
          onClick={() => onSelectStance('thunder')}
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs">Thunder</span>
        </Button>
        
        <Button
          variant={selectedStance === 'wind' ? 'default' : 'outline'}
          className={`px-3 py-1 ${
            selectedStance === 'wind' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-400 border-emerald-400' 
              : 'border-emerald-700/40 bg-emerald-900/10'
          }`}
          onClick={() => onSelectStance('wind')}
        >
          <Wind className="w-4 h-4 mr-1" />
          <span className="text-xs">Wind</span>
        </Button>
      </div>
      
      {/* Combo Timer */}
      {showComboTimer && (
        <div className="flex justify-center mb-2">
          <div className="bg-amber-900/30 rounded-full px-3 py-1 text-xs text-amber-300">
            <span>Combo Window: </span>
            <span className="font-mono">{(comboTimeLeft / 1000).toFixed(1)}s</span>
            <div 
              className="h-1 bg-amber-700/50 mt-1 rounded-full overflow-hidden"
              style={{ width: '100px' }}
            >
              <div 
                className="h-full bg-amber-500"
                style={{ 
                  width: `${(comboTimeLeft / comboWindow) * 100}%`,
                  transition: 'width 100ms linear'
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Attack Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          disabled={isAttacking}
          onClick={handleAttack}
          className={`relative px-8 py-6 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 transition-all ${
            isAttacking ? 'opacity-50' : ''
          }`}
        >
          <Sword className="w-5 h-5 mr-2" />
          <span>Attack</span>
          
          {isAttacking && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="absolute top-1 right-1 h-3 w-3 border-2 border-t-transparent border-white rounded-full"
            />
          )}
          
          {isInCombo && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 1], opacity: 1 }}
              className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {comboLevel}
            </motion.div>
          )}
        </Button>
        
        <Button
          disabled={specialMoves <= 0 || isAttacking}
          onClick={handleSpecial}
          className={`relative px-4 py-6 bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-500 hover:to-purple-700 transition-all ${
            specialMoves <= 0 || isAttacking ? 'opacity-50' : ''
          }`}
        >
          <Shield className="w-5 h-5 mr-2" />
          <span>Special ({specialMoves})</span>
        </Button>
      </div>
    </div>
  );
};

export default BattleRaidControls;
