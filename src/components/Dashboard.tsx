
import React from 'react';
import MonsterBattle from './MonsterBattle';
import StatsDashboard from './StatsDashboard';
import BudgetAllocator from './BudgetAllocator';
import Challenge from './Challenge';
import StrategySelector from './StrategySelector';
import LifeEvent from './LifeEvent';
import Shop from './Shop';
import AchievementDisplay from './AchievementDisplay';
import { useGameContext } from '../context/GameContext';

const Dashboard = () => {
  const { challenges } = useGameContext();
  
  // Use the first challenge as a sample for the Dashboard display
  const sampleChallenge = challenges && challenges.length > 0 
    ? challenges[0] 
    : {
        title: "Make a Payment",
        description: "Make your first debt payment",
        progress: 0,
        target: 1,
        reward: 50,
        completed: false
      };
  
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsDashboard />
            <AchievementDisplay />
          </div>
          <MonsterBattle />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BudgetAllocator />
            <LifeEvent />
          </div>
        </div>
        <div className="space-y-4">
          <Shop />
          <Challenge 
            title={sampleChallenge.title}
            description={sampleChallenge.description}
            progress={sampleChallenge.progress}
            target={sampleChallenge.target}
            reward={sampleChallenge.reward}
            completed={sampleChallenge.completed}
          />
          <StrategySelector />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
