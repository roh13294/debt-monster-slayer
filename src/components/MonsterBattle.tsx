
import React from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';
import { Sword, ShieldAlert } from 'lucide-react';

const MonsterBattle: React.FC = () => {
  const { debts } = useGameContext();

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
            {debts.map((debt) => (
              <DebtMonster key={debt.id} debt={debt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonsterBattle;
