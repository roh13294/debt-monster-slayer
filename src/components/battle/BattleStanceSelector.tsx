
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Shield, Zap } from 'lucide-react';

interface BattleStanceSelectorProps {
  currentStance: string;
  stances: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  onStanceChange: (stanceId: string) => void;
}

const BattleStanceSelector: React.FC<BattleStanceSelectorProps> = ({
  currentStance,
  stances,
  onStanceChange
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-slate-400 mb-2">Combat Stance</h3>
      <div className="grid grid-cols-3 gap-2">
        {stances.map(stance => (
          <Button
            key={stance.id}
            onClick={() => onStanceChange(stance.id)}
            variant={currentStance === stance.id ? "default" : "outline"}
            className={`flex items-center justify-center gap-1 ${
              currentStance === stance.id ? (
                stance.id === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                stance.id === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                stance.id === 'risky' ? 'bg-gradient-to-r from-amber-600 to-amber-700' : ''
              ) : 'border-slate-600'
            }`}
          >
            {stance.id === 'aggressive' && <Flame className="w-4 h-4" />}
            {stance.id === 'defensive' && <Shield className="w-4 h-4" />}
            {stance.id === 'risky' && <Zap className="w-4 h-4" />}
            {stance.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BattleStanceSelector;
