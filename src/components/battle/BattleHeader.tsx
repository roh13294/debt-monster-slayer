
import React from 'react';
import { motion } from 'framer-motion';

interface BattleHeaderProps {
  battleStage: 'prepare' | 'battle' | 'victory' | 'loot' | 'defeat';
  currentStance: string;
  ragePhase: boolean;
  frenzyPhase: boolean;
}

const BattleHeader: React.FC<BattleHeaderProps> = ({ 
  battleStage, 
  currentStance, 
  ragePhase, 
  frenzyPhase 
}) => {
  return (
    <div className="mb-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block px-3 py-1 bg-slate-800 rounded-full mb-2 text-sm"
      >
        <span className={`font-medium ${
          currentStance === 'aggressive' ? 'text-red-400' : 
          currentStance === 'defensive' ? 'text-blue-400' : 
          'text-amber-400'
        }`}>
          {currentStance === 'aggressive' && 'Flame Breathing Style'}
          {currentStance === 'defensive' && 'Water Breathing Style'}
          {currentStance === 'risky' && 'Thunder Breathing Style'}
        </span>
      </motion.div>
      
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {battleStage === 'prepare' && 'Prepare for Battle'}
        {battleStage === 'battle' && (frenzyPhase ? '⚠️ Frenzy Phase' : ragePhase ? '⚠️ Rage Phase' : 'Demon Encounter!')}
        {battleStage === 'victory' && 'Demon Defeated!'}
        {battleStage === 'loot' && 'Victory Rewards'}
        {battleStage === 'defeat' && 'Retreat'}
      </h1>
      
      <p className="text-slate-300 max-w-2xl mx-auto">
        {battleStage === 'prepare' && 'Center your focus and prepare your spirit for the coming battle.'}
        {battleStage === 'battle' && !ragePhase && !frenzyPhase && 'Channel your energy to strike at the demon\'s core.'}
        {battleStage === 'battle' && ragePhase && 'The demon\'s attacks grow stronger as it becomes enraged!'}
        {battleStage === 'battle' && frenzyPhase && 'The demon enters a desperate frenzy as its health dwindles!'}
        {battleStage === 'victory' && 'Your technique has vanquished the demon!'}
        {battleStage === 'loot' && 'The demon\'s defeat has yielded valuable treasures. Choose your reward.'}
      </p>
    </div>
  );
};

export default BattleHeader;
