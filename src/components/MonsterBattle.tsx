import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import DebtMonster from './DebtMonster';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Flame, Sword, Shield, Zap } from 'lucide-react';
import NarrativeMoment from './journey/NarrativeMoment';

interface MonsterBattleProps {
  debtId: string;
  onClose: () => void;
}

const MonsterBattle = ({ debtId, onClose }: MonsterBattleProps) => {
  const { debts, cash, damageMonster, specialMoves, useSpecialMove } = useGameContext();
  const debt = debts.find(d => d.id === debtId);
  
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isInBattle, setIsInBattle] = useState<boolean>(true);
  const [showNarrative, setShowNarrative] = useState<boolean>(true);
  const [narrativeType, setNarrativeType] = useState<'battle' | 'victory' | 'decision'>('battle');
  
  // Update payment amount when debt changes
  useEffect(() => {
    if (debt) {
      setPaymentAmount(debt.minimumPayment);
      setCustomAmount(debt.minimumPayment.toString());
    }
  }, [debt]);
  
  if (!debt) {
    return null;
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    setPaymentAmount(value[0]);
    setCustomAmount(value[0].toString());
  };
  
  // Handle custom amount change
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setPaymentAmount(numericValue);
    }
  };
  
  // Handle payment submission
  const handlePayment = () => {
    damageMonster(debtId, paymentAmount);
    setNarrativeType('victory');
    setShowNarrative(true);
  };
  
  // Handle special move
  const handleSpecialMove = () => {
    useSpecialMove(debtId);
  };
  
  // Get payment preset options
  const getPaymentOptions = () => {
    if (!debt) return [];
    
    return [
      { label: 'Minimum', value: debt.minimumPayment },
      { label: 'Medium', value: Math.min(debt.amount, debt.minimumPayment * 3) },
      { label: 'Large', value: Math.min(debt.amount, Math.max(debt.minimumPayment * 5, debt.amount * 0.2)) },
      { label: 'Full', value: debt.amount }
    ];
  };
  
  const paymentOptions = getPaymentOptions();

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-night-sky p-0 border-slate-700">
        <div className="relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950">
            <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5"></div>
          </div>
          
          <div className="relative z-10 p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sword className="w-5 h-5 text-red-500" />
                <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                  Battle with {debt.name}
                </span>
              </h2>
              <div className="text-right">
                <p className="text-sm text-slate-300">Available Spirit Energy</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(cash)}</p>
              </div>
            </div>

            {/* Narrative moment */}
            {showNarrative && (
              <NarrativeMoment 
                type={narrativeType}
                context={{ debt }}
                onDismiss={() => setShowNarrative(false)}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <DebtMonster 
                  key={debt.id} 
                  debt={debt} 
                  isInBattle={true}
                />
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Special Techniques</h3>
                  <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                    <Button
                      onClick={handleSpecialMove}
                      disabled={specialMoves <= 0}
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 flex items-center gap-2"
                    >
                      <Flame className="w-4 h-4" />
                      Negotiate Lower Interest ({specialMoves} remaining)
                    </Button>
                    <p className="text-xs text-slate-400 mt-2 text-center">
                      Using this technique will reduce the demon's corruption aura (interest rate) by 20%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-medium text-slate-300 mb-2">Attack Power</h3>
                  <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span>Minimum: {formatCurrency(debt.minimumPayment)}</span>
                      <span>Maximum: {formatCurrency(Math.min(cash, debt.amount))}</span>
                    </div>
                    
                    <Slider
                      value={[paymentAmount]}
                      min={debt.minimumPayment}
                      max={Math.min(cash, debt.amount)}
                      step={10}
                      onValueChange={handleSliderChange}
                      className="mb-6"
                    />
                    
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {paymentOptions.map((option, index) => (
                        <Button 
                          key={index}
                          variant="outline"
                          size="sm"
                          disabled={option.value > cash}
                          onClick={() => {
                            setPaymentAmount(option.value);
                            setCustomAmount(option.value.toString());
                          }}
                          className={`border-slate-600 ${
                            paymentAmount === option.value 
                              ? 'bg-slate-700 border-slate-500' 
                              : 'bg-slate-800/60'
                          }`}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="custom-amount" className="block text-sm text-slate-400 mb-1">
                        Custom Attack Power
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-amount"
                          type="number"
                          min={0}
                          max={cash}
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="bg-slate-900 border-slate-700 text-slate-200"
                        />
                        <Button 
                          variant="default"
                          onClick={() => setPaymentAmount(Math.min(cash, debt.amount))}
                          className="bg-blue-600 hover:bg-blue-700 shrink-0"
                        >
                          Max
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-400 mb-1">Battle Effects</h4>
                      <div className="bg-slate-900/80 rounded p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400">Damage:</span>{' '}
                            <span className="text-red-400">-{formatCurrency(paymentAmount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Spirit Cost:</span>{' '}
                            <span className="text-emerald-400">-{formatCurrency(paymentAmount)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Health Reduction:</span>{' '}
                            <span className="text-amber-400">~{Math.min(100, Math.round((paymentAmount / debt.amount) * 100))}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Remaining:</span>{' '}
                            <span className="text-blue-400">{formatCurrency(Math.max(0, debt.amount - paymentAmount))}</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handlePayment}
                          disabled={paymentAmount <= 0 || paymentAmount > cash || paymentAmount < debt.minimumPayment}
                          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 flex items-center justify-center gap-2 py-6"
                        >
                          <Sword className="w-5 h-5" />
                          <span className="text-lg">Strike with {formatCurrency(paymentAmount)}</span>
                        </Button>
                      </motion.div>
                      
                      {paymentAmount < debt.minimumPayment && (
                        <p className="text-red-400 text-xs mt-2 text-center">
                          Your attack must be at least the minimum power ({formatCurrency(debt.minimumPayment)})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={onClose} className="border-slate-700 bg-slate-800/60 hover:bg-slate-800">
                Retreat (Close)
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MonsterBattle;
