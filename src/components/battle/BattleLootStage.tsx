
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import LootDropCard from './LootDropCard';
import { LootItem } from '@/types/battleTypes';

interface BattleLootStageProps {
  loot: LootItem[];
  onCollectLoot: (items: LootItem[]) => void;
}

const BattleLootStage: React.FC<BattleLootStageProps> = ({ loot, onCollectLoot }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-800 rounded-full text-white text-sm font-medium mb-6"
        >
          <Flame className="mr-2 h-4 w-4" /> Demon Vanquished!
        </motion.div>
        
        <h2 className="text-xl font-bold text-white mb-4">Victory Rewards</h2>
        <p className="text-slate-300 mb-8">Select your rewards from the demon's defeated form</p>
      </div>
      
      <LootDropCard loot={loot} onCollect={onCollectLoot} />
    </div>
  );
};

export default BattleLootStage;
