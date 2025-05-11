
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { formatValue } from '@/utils/formatters';

interface LightAttackOptionProps {
  cash: number;
  onLightAttack: (amount: number) => void;
  isInCombo: boolean;
}

const LightAttackOption: React.FC<LightAttackOptionProps> = ({
  cash,
  onLightAttack,
  isInCombo
}) => {
  const [lightAttackAmount, setLightAttackAmount] = useState<number>(Math.max(1, Math.min(5, cash)));
  
  const handleLightAttack = () => {
    onLightAttack(lightAttackAmount);
  };
  
  const minAmount = 1;
  const maxAmount = Math.min(cash, 30); // Cap light attacks at 30 to ensure they're actually "light"
  
  return (
    <div className="p-4 bg-slate-800/60 border border-amber-900/30 rounded-lg">
      <h3 className="text-sm font-medium text-amber-400 mb-2 flex items-center">
        <Zap className="h-4 w-4 mr-1" />
        Light Attack Mode
      </h3>
      
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-400">Attack Power</span>
          <span className="text-amber-300 font-medium">{lightAttackAmount} HP</span>
        </div>
        
        <Slider
          value={[lightAttackAmount]}
          min={minAmount}
          max={maxAmount}
          step={1}
          onValueChange={(values) => setLightAttackAmount(values[0])}
          className="my-2"
        />
        
        <div className="flex justify-between text-xs text-slate-500">
          <span>Min: {minAmount} HP</span>
          <span>Max: {maxAmount} HP</span>
        </div>
      </div>
      
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleLightAttack}
          disabled={cash <= 0}
          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quick Strike ({lightAttackAmount} HP)
        </Button>
      </motion.div>
      
      <p className="text-xs text-slate-400 mt-2">
        Light attacks deal reduced damage but can help maintain combo chains.
        {isInCombo && " Your current combo will continue with a light attack."}
      </p>
    </div>
  );
};

export default LightAttackOption;
