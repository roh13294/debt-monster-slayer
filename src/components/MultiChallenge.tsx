
import React from 'react';
import Challenge from './Challenge';
import { Challenge as ChallengeType } from '../types/gameTypes';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MultiChallengeProps {
  challenges: ChallengeType[];
  maxDisplay?: number;
}

const MultiChallenge: React.FC<MultiChallengeProps> = ({
  challenges,
  maxDisplay = 3
}) => {
  // Sort challenges: completed last, then by progress percentage
  const sortedChallenges = [...challenges].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    const aProgress = a.progress / a.target;
    const bProgress = b.progress / b.target;
    
    return bProgress - aProgress;
  });

  const displayChallenges = sortedChallenges.slice(0, maxDisplay);
  
  return (
    <div className="space-y-3">
      <ScrollArea className="h-[280px] pr-3">
        {displayChallenges.map((challenge) => (
          <div key={challenge.id} className="mb-3">
            <Challenge
              title={challenge.title}
              description={challenge.description}
              progress={challenge.progress}
              target={challenge.target}
              reward={challenge.reward}
              completed={challenge.completed}
            />
          </div>
        ))}
        
        {challenges.length === 0 && (
          <div className="p-4 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg">
            No active challenges available
          </div>
        )}
      </ScrollArea>
      
      {challenges.length > maxDisplay && (
        <div className="text-xs text-center text-muted-foreground">
          +{challenges.length - maxDisplay} more challenges available
        </div>
      )}
    </div>
  );
};

export default MultiChallenge;
