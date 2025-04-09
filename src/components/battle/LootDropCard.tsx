
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Award, Heart, Book } from 'lucide-react';

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
  onCollect: (loot: LootItem[]) => void;
}

const LootDropCard: React.FC<LootDropCardProps> = ({ loot, onCollect }) => {
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const handleReveal = (index: number) => {
    setSelectedIndex(index);
    setIsRevealing(true);
    
    // Simulating card flip animation
    setTimeout(() => {
      setIsRevealing(false);
      setRevealed(true);
    }, 1000);
  };
  
  const handleCollect = () => {
    if (selectedIndex !== null) {
      onCollect([loot[selectedIndex]]);
    }
  };
  
  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'Common': 
        return {
          bg: 'from-slate-700 to-slate-800',
          border: 'border-slate-600',
          text: 'text-white',
          glow: ''
        };
      case 'Rare':
        return {
          bg: 'from-blue-700 to-indigo-800',
          border: 'border-blue-500',
          text: 'text-blue-300',
          glow: 'shadow-blue-500/30 shadow-lg'
        };
      case 'Epic':
        return {
          bg: 'from-purple-700 to-pink-800',
          border: 'border-purple-500',
          text: 'text-purple-300',
          glow: 'shadow-purple-500/30 shadow-lg'
        };
      default:
        return {
          bg: 'from-slate-700 to-slate-800',
          border: 'border-slate-600',
          text: 'text-white',
          glow: ''
        };
    }
  };
  
  const getLootIcon = (type: string) => {
    switch (type) {
      case 'Demon Seal': return <Award className="w-6 h-6 text-amber-300" />;
      case 'Spirit Fragment': return <Heart className="w-6 h-6 text-red-400" />;
      case 'Skill Scroll': return <Book className="w-6 h-6 text-blue-300" />;
      default: return <Sparkles className="w-6 h-6 text-purple-300" />;
    }
  };
  
  return (
    <div className="bg-slate-900/90 rounded-lg border border-slate-700 p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Demon's Treasure
        </h2>
        <p className="text-slate-300 text-sm">Choose one reward from your victory</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {loot.map((item, index) => {
          const rarityColors = getRarityColors(item.rarity);
          
          return (
            <AnimatePresence key={`loot-${index}`} mode="wait">
              {(!revealed || selectedIndex === index) ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {!isRevealing && !revealed ? (
                    <motion.button
                      className="w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border-2 border-amber-600/30 flex items-center justify-center hover:border-amber-500 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReveal(index)}
                    >
                      <div className="text-center">
                        <Sparkles className="w-8 h-8 text-amber-500/60 mx-auto mb-2" />
                        <span className="text-amber-500/80 text-sm font-medium">Click to Reveal</span>
                      </div>
                    </motion.button>
                  ) : isRevealing ? (
                    <motion.div
                      className="w-full aspect-square bg-gradient-to-br from-amber-700 to-amber-900 rounded-lg border-2 border-amber-500 flex items-center justify-center"
                      animate={{ 
                        rotateY: [0, 90, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 1 }}
                    >
                      <Sparkles className="w-10 h-10 text-amber-300 animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`w-full aspect-square bg-gradient-to-br ${rarityColors.bg} rounded-lg border-2 ${rarityColors.border} p-3 flex flex-col ${rarityColors.glow}`}
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded-full bg-slate-800/70">
                          {getLootIcon(item.type)}
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-slate-900/60 border border-slate-700 text-xs font-medium">
                          {item.rarity}
                        </div>
                      </div>
                      
                      <div className="mt-auto text-center">
                        <h4 className={`font-bold ${rarityColors.text}`}>{item.name}</h4>
                        <p className="text-xs text-slate-300 mt-1">{item.description}</p>
                      </div>
                      
                      {revealed && selectedIndex === index && (
                        <motion.div
                          className="mt-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Button 
                            onClick={handleCollect}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white"
                          >
                            Collect
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="w-full aspect-square bg-slate-800/40 rounded-lg border border-slate-700/30" />
              )}
            </AnimatePresence>
          );
        })}
      </div>
    </div>
  );
};

export default LootDropCard;
