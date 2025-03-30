
import React from 'react';
import { Calendar, Award, Star } from 'lucide-react';

interface StreakDisplayProps {
  streakCount: number;
  streakType: string;
  nextReward?: number;
  rewardType?: string;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streakCount,
  streakType,
  nextReward = 3,
  rewardType = "Special Move"
}) => {
  const remainingForReward = nextReward - (streakCount % nextReward);
  const progress = ((streakCount % nextReward) / nextReward) * 100;
  
  return (
    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
      <div className="flex items-center mb-2">
        <Award className="h-5 w-5 text-amber-500 mr-2" />
        <h3 className="text-sm font-bold text-amber-800">{streakType} Streak</h3>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold text-amber-600">{streakCount}</span>
          <span className="text-xs ml-1 text-amber-700">days</span>
        </div>
        
        <div className="flex items-center">
          {[...Array(Math.min(5, streakCount))].map((_, i) => (
            <Star 
              key={i} 
              className="h-4 w-4 text-yellow-400 fill-yellow-400" 
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>
      
      <div className="relative h-2 bg-amber-100 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-2 text-xs text-amber-700 text-center flex items-center justify-center">
        <Calendar className="h-3 w-3 mr-1" />
        {remainingForReward} more {remainingForReward === 1 ? 'day' : 'days'} until next {rewardType}
      </div>
    </div>
  );
};

export default StreakDisplay;
