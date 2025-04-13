
import React from 'react';
import { Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BattleMissionTrackerProps {
  mission: {
    type: string;
    goal: number;
    reward: string;
    progress: number;
  } | null;
}

const BattleMissionTracker: React.FC<BattleMissionTrackerProps> = ({ mission }) => {
  if (!mission) return null;
  
  return (
    <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-slate-300">Battle Mission</span>
        </div>
        <span className="text-xs text-amber-400 font-bold">
          {mission.progress}/{mission.goal}
        </span>
      </div>
      <Progress 
        value={(mission.progress / mission.goal) * 100} 
        className="h-1 mb-1"
      />
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400">
          {mission.type === 'damage' ? 'Deal damage' : 
           mission.type === 'combo' ? 'Reach combo chain' : 
           'Defeat quickly'}
        </span>
        <span className="text-slate-300">Reward: {mission.reward}</span>
      </div>
    </div>
  );
};

export default BattleMissionTracker;
