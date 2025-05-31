import React from 'react';
import { Progress } from "@/components/ui/progress"
import { useGameContext } from '@/context/GameContext';

interface XPBarProps {
  currentXP: number;
  xpToNext: number;
  level: number;
  maxLevel?: number;
  showLevel?: boolean;
  showProgress?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  xpToNext,
  level,
  maxLevel = 50,
  showLevel = true,
  showProgress = true,
  className = "",
  size = "md"
}) => {
  const { playerTitle } = useGameContext();
  
  const progress = (currentXP / xpToNext) * 100;
  
  const sizeClasses = {
    sm: "text-xs h-1.5",
    md: "text-sm h-2.5",
    lg: "text-base h-3.5"
  }[size];
  
  if (level > maxLevel) {
    return (
      <div className={`${sizeClasses} ${className}`}>
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-medium text-amber-300">
            {playerTitle} - Max Level Reached
          </span>
        </div>
        <div className="h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full overflow-hidden">
          <div className="h-full w-full"></div>
        </div>
      </div>
    );
  }
  
  const titleData = typeof playerTitle === 'string' ? 
    { title: playerTitle, level: level } : 
    playerTitle;

  return (
    <div className={`${sizeClasses} ${className}`}>
      
      {showLevel && (
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="font-medium text-amber-300">
            {titleData.title} - Level {titleData.level}
          </span>
          <span className="text-gray-400">
            {currentXP} / {xpToNext} XP
          </span>
        </div>
      )}
      
      {showProgress && (
        <Progress value={progress} className="bg-gray-800" />
      )}
    </div>
  );
};

export default XPBar;
