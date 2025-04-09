
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { LootItem } from '@/types/battleTypes';

export interface LootItem {
  type: 'Demon Seal' | 'Spirit Fragment' | 'Skill Scroll';
  rarity: 'Common' | 'Rare' | 'Epic';
  name: string;
  description: string;
  value: number;
  effect?: string;
}

interface LootDropCardProps {
  loot: LootItem[];
  onCollect: () => void;
}

const LootDropCard: React.FC<LootDropCardProps> = ({ loot, onCollect }) => {
  const [flipping, setFlipping] = useState<Record<string, boolean>>({});
  const [allRevealed, setAllRevealed] = useState(false);
  
  const flipCard = (index: number) => {
    setFlipping(prev => ({ ...prev, [index]: true }));
    
    // Check if all cards are now flipped
    const newFlipping = { ...flipping, [index]: true };
    if (Object.values(newFlipping).filter(Boolean).length === loot.length) {
      setAllRevealed(true);
    }
  };
  
  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'Epic':
        return {
          bg: 'bg-gradient-to-b from-purple-600 to-purple-900',
          border: 'border-purple-500',
          glow: 'shadow-glow-purple',
          text: 'text-purple-300'
        };
      case 'Rare':
        return {
          bg: 'bg-gradient-to-b from-blue-600 to-blue-900',
          border: 'border-blue-500',
          glow: 'shadow-glow-blue',
          text: 'text-blue-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-green-600 to-green-900',
          border: 'border-green-700',
          glow: '',
          text: 'text-green-300'
        };
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Demon Seal':
        return '💰';
      case 'Spirit Fragment':
        return '✨';
      case 'Skill Scroll':
        return '📜';
      default:
        return '🎁';
    }
  };
  
  return (
    <div className="p-6 bg-slate-900/95 border border-slate-700 rounded-lg max-w-xl mx-auto text-center">
      <h2 className="text-xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        Victory Rewards
      </h2>
      
      <p className="text-slate-400 mb-6 text-sm">Click on the cards to reveal your rewards!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {loot.map((item, index) => {
          const isFlipped = flipping[index];
          const styles = getRarityStyles(item.rarity);
          
          return (
            <div key={index} className="h-60 perspective-1000">
              <motion.div 
                className="relative w-full h-full transition-transform duration-500"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onClick={() => !isFlipped && flipCard(index)}
              >
                {/* Card Back */}
                <div 
                  className={`absolute inset-0 backface-hidden bg-slate-800 border-2 border-amber-600 rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                    isFlipped ? 'hidden' : ''
                  }`}
                >
                  <div className="text-5xl mb-2">🎁</div>
                  <p className="text-amber-400 font-medium">Click to Reveal</p>
                </div>
                
                {/* Card Front */}
                <div 
                  className={`absolute inset-0 backface-hidden ${styles.bg} border-2 ${styles.border} rounded-lg flex flex-col p-4 ${styles.glow} ${
                    !isFlipped ? 'hidden' : 'rotateY-180'
                  }`}
                >
                  <div className="bg-black/20 rounded-full w-10 h-10 flex items-center justify-center mb-2 mx-auto">
                    <span className="text-xl">{getTypeIcon(item.type)}</span>
                  </div>
                  
                  <div className="mb-1">
                    <span className={`text-xs font-bold ${styles.text} bg-black/30 px-2 py-0.5 rounded-full`}>
                      {item.rarity}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-300 mb-3">{item.description}</p>
                  
                  {item.effect && (
                    <div className="bg-black/30 rounded p-2 mt-auto mb-2">
                      <p className="text-xs italic text-slate-300">{item.effect}</p>
                    </div>
                  )}
                  
                  {item.value > 0 && (
                    <div className="text-sm font-medium text-amber-400 mt-auto">
                      Value: {item.value} DemonCoins
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      
      <AnimatePresence>
        {allRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={onCollect}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8 py-6 h-auto"
              size="lg"
            >
              Collect All Rewards
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LootDropCard;
