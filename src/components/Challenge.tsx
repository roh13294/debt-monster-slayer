
import React from 'react';
import { Trophy } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface ChallengeProps {
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
}

const Challenge: React.FC<ChallengeProps> = ({
  title,
  description,
  progress,
  target,
  reward,
  completed
}) => {
  const progressPercentage = Math.min(100, (progress / target) * 100);

  return (
    <div className={`p-4 border rounded-xl transition-all duration-300 ${
      completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start">
        <div className={`p-2 rounded-full mr-3 ${
          completed ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          <Trophy className={`h-5 w-5 ${
            completed ? 'text-green-600' : 'text-primary'
          }`} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-bold">{title}</h3>
            <span className="text-sm font-medium">${reward}</span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          
          <ProgressBar 
            progress={progressPercentage} 
            color={completed ? 'bg-green-500' : 'bg-primary'} 
          />
          
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {progress} / {target} {progress === 1 && target === 1 ? 'task' : 'tasks'}
            </span>
            {completed && (
              <span className="text-xs font-medium text-green-600">Completed!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenge;
