
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BattleArenaEnhanced from './battle/BattleArenaEnhanced';

interface EnhancedMonsterBattleProps {
  debtId: string;
  onClose: () => void;
}

const EnhancedMonsterBattle: React.FC<EnhancedMonsterBattleProps> = ({ debtId, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-night-sky p-0 border-slate-700 max-w-5xl">
        <div className="relative overflow-hidden p-0">
          <BattleArenaEnhanced debtId={debtId} onComplete={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMonsterBattle;
