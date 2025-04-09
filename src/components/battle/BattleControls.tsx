
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sword, ShieldAlert, Flame, Zap, Target } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Debt } from '@/types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface BattleControlsProps {
  debt: Debt;
  stance: string | null;
  cash: number;
  specialMoves: number;
  onAttack: (amount: number) => void;
  onSpecialMove: () => void;
}

// Special move cooldown tracking
interface SpecialMoveCooldown {
  name: string;
  cooldown: number;
  description: string;
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
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [attackType, setAttackType] = useState<string>('');
  const [specialActive, setSpecialActive] = useState<boolean>(false);
  
  const maxPayment = Math.min(cash, debt.amount);
  
  const getStanceBonus = (): number => {
    switch(stance) {
      case 'aggressive': return 1.2;
      case 'defensive': return 0.9;
      case 'risky': return Math.random() > 0.7 ? 1.5 : 1.0;
      default: return 1.0;
    }
  };
  
  const getBreathingTechnique = (): string => {
    switch(stance) {
      case 'aggressive': return 'Flame Breathing: First Form';
      case 'defensive': return 'Water Breathing: Second Form';
      case 'risky': return 'Thunder Breathing: First Form';
      default: return 'Total Concentration Breathing';
    }
  };
  
  const getSpecialMoveName = (): string => {
    switch(stance) {
      case 'aggressive': return 'Blooming Flame Undulation';
      case 'defensive': return 'Water Surface Slash';
      case 'risky': return 'Thunderclap and Flash';
      default: return 'Chain Breaker';
    }
  };
  
  const getAttackName = (): string => {
    const paymentRatio = paymentAmount / debt.amount;
    
    if (paymentRatio >= 0.5) {
      return 'Piercing Strike';
    } else if (paymentRatio >= 0.25) {
      return 'Focused Slash';
    } else if (paymentRatio >= 0.1) {
      return 'Spirit Strike';
    } else {
      return 'Swift Cut';
    }
  };
  
  const handleAttack = () => {
    setIsAttacking(true);
    setAttackType('regular');
    const adjustedAmount = Math.round(paymentAmount * getStanceBonus());
    
    let isCritical = false;
    let isMiss = false;
    let isDouble = false;
    
    const roll = Math.random();
    if (stance === 'risky' && roll < 0.25) {
      isCritical = true;
      setAttackType('critical');
    } else if (roll < 0.05) {
      isMiss = true;
      setAttackType('miss');
    } else if (roll < 0.15) {
      isDouble = true;
      setAttackType('double');
    }
    
    if (!isMiss && typeof window !== 'undefined' && typeof window.hitMonster === 'function') {
      window.hitMonster();
    }
    
    setTimeout(() => {
      setIsAttacking(false);
      if (!isMiss) {
        const finalAmount = isCritical ? adjustedAmount * 2 : adjustedAmount;
        onAttack(isDouble ? finalAmount * 2 : finalAmount);
      }
    }, 800);
  };
  
  const handleSpecialMove = () => {
    setSpecialActive(true);
    setAttackType('special');
    
    if (typeof window !== 'undefined' && typeof window.hitMonster === 'function') {
      window.hitMonster();
    }
    
    setTimeout(() => {
      setSpecialActive(false);
      onSpecialMove();
    }, 1200);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="bg-slate-900/90 border border-slate-700 rounded-lg p-6 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {isAttacking && attackType === 'critical' && (
          <motion.div 
            className="absolute inset-0 bg-yellow-500/20 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
        
        {isAttacking && attackType === 'miss' && (
          <motion.div 
            className="absolute inset-0 bg-red-900/20 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
        
        {specialActive && (
          <motion.div 
            className="absolute inset-0 bg-purple-600/20 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>
      
      <motion.h3 
        className="text-xl font-medium text-slate-100 mb-2 flex items-center gap-2 relative z-10"
        variants={itemVariants}
      >
        <Sword className="w-5 h-5 text-amber-400" />
        Channel Your Spirit Energy
      </motion.h3>
      
      <div className="grid gap-4 relative z-10">
        <motion.div 
          className="bg-slate-800/80 p-4 rounded-lg border border-slate-700"
          variants={itemVariants}
        >
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
        </motion.div>
        
        {stance && (
          <motion.div 
            className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex items-center gap-3"
            variants={itemVariants}
          >
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
          </motion.div>
        )}
        
        <motion.div 
          className="grid grid-cols-2 gap-3 mt-2"
          variants={itemVariants}
        >
          <AnimatePresence>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              <Button
                onClick={handleAttack}
                disabled={paymentAmount <= 0 || cash <= 0 || isAttacking}
                className={`w-full py-6 ${
                  stance === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' :
                  stance === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
                  stance === 'risky' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500' :
                  'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                } relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                
                {isAttacking ? (
                  <>
                    {attackType === 'miss' && <span>Energy Dispersed!</span>}
                    {attackType === 'critical' && <span>Critical Strike!</span>}
                    {attackType === 'double' && <span>Double Strike!</span>}
                    {attackType === 'regular' && <span>{getBreathingTechnique()}</span>}
                  </>
                ) : (
                  <>
                    <Sword className="w-5 h-5 mr-2" />
                    Strike!
                  </>
                )}
              </Button>
              
              {!isAttacking && (
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-xs text-amber-400/80 font-semibold">{getAttackName()}</span>
                </div>
              )}
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
            >
              <Button
                onClick={handleSpecialMove}
                disabled={specialMoves <= 0 || specialActive}
                variant="outline"
                className={`w-full border-amber-500 text-amber-400 hover:bg-amber-950/50 py-6 relative overflow-hidden group ${
                  specialActive ? 'bg-amber-900/30' : ''
                }`}
              >
                <AnimatePresence>
                  {!specialActive && specialMoves > 0 && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-400/20"
                      animate={{ 
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>
                
                {specialActive ? (
                  <span>{getSpecialMoveName()}!</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2 text-amber-400" />
                    Special Technique ({specialMoves})
                  </>
                )}
              </Button>
              
              {!specialActive && specialMoves > 0 && (
                <div className="absolute -bottom-6 left-0 right-0 text-center">
                  <span className="text-xs text-amber-400/80 font-semibold">Chain Breaker</span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BattleControls;
