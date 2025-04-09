
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface BattleTipsProps {
  stance: string | null;
  onClose: () => void;
}

const BattleTips: React.FC<BattleTipsProps> = ({ stance, onClose }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 mb-4 animate-fade-in relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        ✕
      </Button>
      <h3 className="font-bold text-sm mb-2 flex items-center">
        <Target className="w-4 h-4 mr-1 text-fun-purple" />
        Battle Tips
      </h3>
      <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
        <li>Use the <strong>slider</strong> to set your payment amount</li>
        <li>Attack quickly in succession for <strong>bonus combo damage</strong></li>
        <li>Save <strong>Special Moves</strong> for large debts</li>
        <li>Battle all monsters in a row to earn <strong>streak bonuses</strong></li>
        {stance === 'aggressive' && (
          <li>Your <strong>Flame Breathing</strong> stance increases damage but reduces defense</li>
        )}
        {stance === 'defensive' && (
          <li>Your <strong>Water Breathing</strong> stance improves sustainability in longer battles</li>
        )}
        {stance === 'risky' && (
          <li>Your <strong>Thunder Breathing</strong> stance has a chance for critical strikes</li>
        )}
      </ul>
    </div>
  );
};

export default BattleTips;
