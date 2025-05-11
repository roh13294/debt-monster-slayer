
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sword, Flame } from 'lucide-react';
import { Debt } from '@/types/gameTypes';
import { formatValue } from '@/utils/formatters';
import LightAttackOption from './LightAttackOption';
import BattleEscapeOptions from './BattleEscapeOptions';
import UnwinnableScenarioModal from './UnwinnableScenarioModal';
import { toast } from '@/hooks/use-toast';

interface BattleAttackControlsProps {
  debt: Debt;
  cash: number;
  specialMoves: number;
  currentStance: string;
  isInCombo?: boolean;
  comboCount?: number;
  onAttack: (amount: number) => void;
  onSpecialMove: () => void;
  onRetreat?: () => void;
  onChannelEnergy?: () => void;
}

const BattleAttackControls: React.FC<BattleAttackControlsProps> = ({
  debt,
  cash,
  specialMoves,
  currentStance,
  isInCombo = false,
  comboCount = 0,
  onAttack,
  onSpecialMove,
  onRetreat,
  onChannelEnergy
}) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(
    Math.min(debt?.minimumPayment || 0, cash)
  );
  const [showLightAttack, setShowLightAttack] = useState<boolean>(false);
  const [checkingUnwinnable, setCheckingUnwinnable] = useState<boolean>(false);
  const [isUnwinnableModalOpen, setIsUnwinnableModalOpen] = useState<boolean>(false);
  
  // Check if minimum attack is possible
  const isMinAttackPossible = cash >= debt.minimumPayment;
  
  // Ensure payment amount is always within valid range when cash changes
  useEffect(() => {
    setPaymentAmount(prev => Math.min(prev, cash));
    
    // Check for unwinnable scenario
    if (!checkingUnwinnable && cash < debt.minimumPayment && specialMoves <= 0) {
      setCheckingUnwinnable(true);
      
      // Give the player a moment before showing the modal
      const timer = setTimeout(() => {
        if (cash < debt.minimumPayment && specialMoves <= 0) {
          setIsUnwinnableModalOpen(true);
        }
        setCheckingUnwinnable(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [cash, debt.minimumPayment, specialMoves, checkingUnwinnable]);

  const handleLightAttack = (amount: number) => {
    if (onAttack) {
      onAttack(amount);
      
      toast({
        title: "Light Attack",
        description: `You performed a quick strike for ${amount} damage!`,
        variant: "default",
      });
    }
  };
  
  const handleChannelEnergy = () => {
    if (onChannelEnergy) {
      onChannelEnergy();
      setIsUnwinnableModalOpen(false);
    }
  };
  
  const handleRetreat = () => {
    if (onRetreat) {
      onRetreat();
      setIsUnwinnableModalOpen(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-6">
      {/* Unwinnable Scenario Modal */}
      <UnwinnableScenarioModal 
        isOpen={isUnwinnableModalOpen}
        onChannelEnergy={handleChannelEnergy}
        onRetreat={handleRetreat}
      />
    
      {/* Light Attack Toggle */}
      {!showLightAttack && !isMinAttackPossible && (
        <div className="mb-4">
          <Button 
            onClick={() => setShowLightAttack(true)}
            variant="outline"
            className="w-full border-amber-700 text-amber-400 hover:bg-amber-950/30"
          >
            Switch to Light Attack Mode
          </Button>
        </div>
      )}
      
      {/* Light Attack Option */}
      {showLightAttack ? (
        <>
          <LightAttackOption 
            cash={cash}
            onLightAttack={handleLightAttack}
            isInCombo={isInCombo || false}
          />
          
          <div className="mt-4">
            <Button 
              onClick={() => setShowLightAttack(false)}
              variant="outline"
              className="w-full border-slate-700 text-slate-400 hover:bg-slate-800/60"
            >
              Switch to Regular Attack
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Attack power */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Attack Strength</span>
              <span className="text-amber-400 font-medium">{formatValue(paymentAmount)}</span>
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
              <span>Min: {formatValue(Math.min(debt.minimumPayment, cash, 1))}</span>
              <span>Max: {formatValue(Math.min(cash, debt.amount))}</span>
            </div>
            
            <div className="mt-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Available Spirit Energy</span>
                <span className={`${cash <= 0 ? 'text-red-400' : 'text-slate-300'}`}>
                  {formatValue(cash)}
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
                disabled={paymentAmount <= 0 || cash <= 0 || paymentAmount < debt.minimumPayment}
                className={`w-full py-6 ${
                  currentStance === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' :
                  currentStance === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
                  currentStance === 'risky' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500' :
                  'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                } ${cash <= 0 || paymentAmount < debt.minimumPayment ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Sword className="w-5 h-5 mr-2" />
                Attack ({formatValue(paymentAmount)})
              </Button>
              
              {paymentAmount < debt.minimumPayment && (
                <div className="text-red-400 text-xs mt-1 text-center">
                  Minimum attack: {formatValue(debt.minimumPayment)}
                </div>
              )}
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
        </>
      )}
      
      {/* Escape Options */}
      {(onRetreat || onChannelEnergy) && (
        <div className="mt-6 pt-4 border-t border-slate-700">
          <BattleEscapeOptions
            cash={cash}
            onRetreat={handleRetreat}
            onChannelEnergy={handleChannelEnergy}
            isMinAttackPossible={isMinAttackPossible}
            isInCombo={isInCombo || false}
          />
        </div>
      )}
    </div>
  );
};

export default BattleAttackControls;
