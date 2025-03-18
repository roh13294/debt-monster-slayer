
import React from 'react';
import { useGameContext } from '../context/GameContext';
import DebtMonster from './DebtMonster';

const MonsterBattle: React.FC = () => {
  const { debts } = useGameContext();

  return (
    <div className="card-elegant">
      <h2 className="text-xl font-bold mb-4">Debt Monster Battle</h2>
      
      {debts.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-lg mb-2">No Debt Monsters Found!</p>
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
  );
};

export default MonsterBattle;
