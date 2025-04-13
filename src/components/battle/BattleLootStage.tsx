
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {loot.map((item, index) => (
          <LootDropCard 
            key={index}
            item={{
              name: item.name,
              description: item.description,
              rarity: item.rarity,
              effect: item.effect
            }}
            onSelect={() => {}} // Selection is handled by the LootDropCard component
          />
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          onClick={() => onCollectLoot(loot)}
          className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8 py-3"
        >
          Collect Rewards & Continue
        </Button>
      </div>
    </div>
  );
};

export default BattleLootStage;
