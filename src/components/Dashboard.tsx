import React from 'react';
import MonsterBattle from './MonsterBattle';
import StatsDashboard from './StatsDashboard';
import BudgetAllocator from './BudgetAllocator';
import Challenge from './Challenge';
import StrategySelector from './StrategySelector';
import LifeEvent from './LifeEvent';
import Shop from './Shop';
import AchievementDisplay from './AchievementDisplay';

const Dashboard = () => {
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
          <Challenge />
          <StrategySelector />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
