
import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import { Sword, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const MonsterBattle: React.FC = () => {
  const { debts } = useGameContext();
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [battleMode, setBattleMode] = useState(false);

  // Handle navigation between monsters
  const nextMonster = () => {
    setCurrentMonsterIndex((prev) => (prev + 1) % debts.length);
  };

  const prevMonster = () => {
    setCurrentMonsterIndex((prev) => (prev - 1 + debts.length) % debts.length);
  };

  const toggleBattleMode = () => {
    setBattleMode(!battleMode);
  };

  return (
    <div className="card-elegant relative overflow-hidden group">
      {/* Decorative background effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-50 rounded-full opacity-40"></div>
      
      <div className="relative">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <span className="p-1.5 bg-red-100 text-red-600 rounded-md mr-2 transform group-hover:rotate-12 transition-transform">
            <Sword size={18} />
          </span>
          Debt Monster Battle
        </h2>
        
        {debts.length === 0 ? (
          <div className="p-8 text-center bg-green-50 rounded-xl border border-green-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <ShieldAlert size={24} />
            </div>
            <p className="text-lg font-medium mb-2">No Debt Monsters Found!</p>
            <p className="text-gray-600">You've defeated all your debt monsters. Congratulations!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleBattleMode}
                className="transition-all hover:bg-primary/10"
              >
                {battleMode ? "Exit Battle" : "Enter Battle Mode"}
              </Button>

              {battleMode && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={prevMonster} disabled={debts.length <= 1}>
                    <ArrowLeft size={16} />
                  </Button>
                  <span className="text-sm font-medium py-2">
                    {currentMonsterIndex + 1} / {debts.length}
                  </span>
                  <Button variant="ghost" size="sm" onClick={nextMonster} disabled={debts.length <= 1}>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </div>

            {battleMode ? (
              debts.length > 0 && (
                <div className="battle-arena bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl transition-all duration-500 transform hover:scale-[1.01]">
                  <DebtMonster 
                    key={debts[currentMonsterIndex].id} 
                    debt={debts[currentMonsterIndex]} 
                    isInBattle={true} 
                  />
                </div>
              )
            ) : (
              <div className="space-y-4">
                {debts.map((debt) => (
                  <DebtMonster key={debt.id} debt={debt} isInBattle={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonsterBattle;
