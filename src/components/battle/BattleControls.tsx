
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sword, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';

interface BattleControlsProps {
  battleMode: boolean;
  toggleBattleMode: () => void;
  prevMonster: () => void;
  nextMonster: () => void;
  currentMonsterIndex: number;
  totalMonsters: number;
}

const BattleControls: React.FC<BattleControlsProps> = ({
  battleMode,
  toggleBattleMode,
  prevMonster,
  nextMonster,
  currentMonsterIndex,
  totalMonsters
}) => {
  return (
    <div className="flex justify-between mb-4">
      <Button 
        onClick={toggleBattleMode}
        className={`transition-all animate-pulse-subtle ${battleMode ? 
          'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600' : 
          'bg-gradient-to-r from-fun-purple to-fun-magenta hover:from-fun-purple/90 hover:to-fun-magenta/90'
        } text-white hover:shadow-lg`}
      >
        {battleMode ? 
          <><ShieldAlert className="w-4 h-4 mr-1" /> Exit Battle</> : 
          <><Sword className="w-4 h-4 mr-1" /> Enter Battle Mode <Sword className="w-3.5 h-3.5 ml-1 animate-pulse" /></>
        }
      </Button>

      {battleMode && (
        <div className="flex gap-2 bg-white/30 backdrop-blur-sm p-1 rounded-lg animate-pulse-subtle">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={prevMonster} 
            disabled={totalMonsters <= 1}
            className="hover:bg-fun-purple/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium py-2 px-2 bg-white/50 backdrop-blur-sm rounded-md">
            {currentMonsterIndex + 1} / {totalMonsters}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextMonster} 
            disabled={totalMonsters <= 1}
            className="hover:bg-fun-purple/20"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BattleControls;
