
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Debt } from '@/types/gameTypes';
import { RaidResult } from './TacticalRaidScreen';
import { Flame, Check, Coins } from 'lucide-react';
import { LootItem } from '@/types/battleTypes';
import { useGameContext } from '@/context/GameContext';

interface RaidResultsScreenProps {
  results: RaidResult[];
  debts: Debt[];
  onCollectRewards: (loot: LootItem[]) => void;
}

const RaidResultsScreen: React.FC<RaidResultsScreenProps> = ({ 
  results, 
  debts,
  onCollectRewards 
}) => {
  const { gainXP } = useGameContext();
  const [showingDetails, setShowingDetails] = useState<boolean>(false);
  
  // Generate loot items from raid results
  const generateLoot = (): LootItem[] => {
    const loot: LootItem[] = [];
    
    results.forEach(result => {
      if (result.damageDealt > 0) {
        const debt = debts.find(d => d.id === result.debtId);
        
        if (debt) {
          // Add XP reward
          if (result.rewards.xp > 0) {
            gainXP(result.rewards.xp);
          }
          
          // Check for spirit fragment (guaranteed for any damage)
          loot.push({
            type: 'Spirit Fragment',
            rarity: 'Common',
            name: `${debt.monsterType} Spirit Fragment`,
            description: `A fragment of spirit energy harvested from the ${debt.name} demon.`,
            value: result.rewards.coins,
            effect: `Grants ${result.rewards.coins} DemonCoins when collected.`
          });
          
          // Check for demon seal (based on damage percentage)
          const damagePercent = Math.min(100, Math.floor((result.damageDealt / debt.health) * 100));
          if (damagePercent >= 30) {
            loot.push({
              type: 'Demon Seal',
              rarity: damagePercent >= 75 ? 'Epic' : damagePercent >= 50 ? 'Rare' : 'Common',
              name: `${debt.monsterType} Demon Seal`,
              description: `A magical seal containing some of the ${debt.name} demon's power.`,
              value: Math.floor(result.rewards.xp / 2),
              effect: `Reduces the interest rate of ${debt.name} by ${Math.floor(damagePercent/10)}% for 3 months.`
            });
          }
          
          // Check for skill scroll (based on relic chance)
          if (Math.random() * 100 < result.rewards.relicChance) {
            loot.push({
              type: 'Skill Scroll',
              rarity: result.rewards.relicChance >= 10 ? 'Epic' : result.rewards.relicChance >= 5 ? 'Rare' : 'Common',
              name: `${debt.monsterType} Technique Scroll`,
              description: `Ancient knowledge that enhances your breathing techniques.`,
              value: Math.floor(result.rewards.relicChance * 10),
              effect: `Grants ${Math.floor(result.rewards.relicChance * 10)} Breathing XP when used.`
            });
          }
        }
      }
    });
    
    return loot;
  };
  
  const loot = generateLoot();
  const totalDamageDealt = results.reduce((sum, r) => sum + r.damageDealt, 0);
  const totalCoins = results.reduce((sum, r) => sum + r.rewards.coins, 0);
  const totalXP = results.reduce((sum, r) => sum + r.rewards.xp, 0);
  
  const handleCollect = () => {
    onCollectRewards(loot);
  };
  
  return (
    <div className="bg-slate-900/95 backdrop-blur-md p-5 rounded-xl border border-slate-700 shadow-lg text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full text-white text-sm font-medium mb-6"
      >
        <Flame className="mr-2 h-4 w-4" /> Raid Complete!
      </motion.div>
      
      <h2 className="text-2xl font-bold text-white mb-2">Battle Results</h2>
      
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Demons Attacked</p>
          <p className="text-lg font-bold text-white">{results.filter(r => r.damageDealt > 0).length}</p>
        </div>
        
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Damage Dealt</p>
          <p className="text-lg font-bold text-red-400">{totalDamageDealt}</p>
        </div>
        
        <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Rewards</p>
          <p className="text-lg font-bold text-amber-400">{loot.length} Items</p>
        </div>
      </div>
      
      {!showingDetails ? (
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">DemonCoins</p>
              <div className="flex items-center justify-center">
                <Coins className="h-4 w-4 text-amber-400 mr-1" />
                <p className="text-xl font-bold text-amber-400">{totalCoins}</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-1">Experience</p>
              <p className="text-xl font-bold text-indigo-400">+{totalXP} XP</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowingDetails(true)}
            className="text-sm text-slate-400 border-slate-700 hover:bg-slate-800"
          >
            Show Detailed Results
          </Button>
        </div>
      ) : (
        <div className="mb-6">
          <div className="max-h-60 overflow-y-auto mb-4 pr-2">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400">
                <tr>
                  <th className="px-3 py-2">Demon</th>
                  <th className="px-3 py-2">Damage</th>
                  <th className="px-3 py-2">Coins</th>
                  <th className="px-3 py-2">XP</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => {
                  const debt = debts.find(d => d.id === result.debtId);
                  if (!debt) return null;
                  
                  return (
                    <tr key={index} className="border-t border-slate-800">
                      <td className="px-3 py-2 text-slate-300">{debt.name}</td>
                      <td className="px-3 py-2 text-red-400">{result.damageDealt}</td>
                      <td className="px-3 py-2 text-amber-400">{result.rewards.coins}</td>
                      <td className="px-3 py-2 text-indigo-400">{result.rewards.xp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowingDetails(false)}
            className="text-sm text-slate-400 border-slate-700 hover:bg-slate-800"
          >
            Hide Details
          </Button>
        </div>
      )}
      
      {loot.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold text-amber-300 mb-3">Loot Acquired</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {loot.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className={`p-2 rounded-md w-24 text-center ${
                  item.rarity === 'Epic' ? 'bg-purple-500/20 border border-purple-500/50' :
                  item.rarity === 'Rare' ? 'bg-blue-500/20 border border-blue-500/50' :
                  'bg-green-500/20 border border-green-500/50'
                }`}
              >
                <div className="text-2xl mb-1">
                  {item.type === 'Spirit Fragment' ? '✧' : 
                   item.type === 'Demon Seal' ? '✦' : '✺'}
                </div>
                <div className="text-xs font-medium">
                  {item.type === 'Spirit Fragment' ? 
                    <span className="text-green-400">{item.type}</span> :
                   item.type === 'Demon Seal' ?
                    <span className="text-blue-400">{item.type}</span> :
                    <span className="text-purple-400">{item.type}</span>
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="py-4 mb-4">
          <p className="text-slate-400 italic">No loot obtained from this raid</p>
        </div>
      )}
      
      <Button 
        onClick={handleCollect}
        className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 px-8 py-2"
      >
        <Check className="mr-2 h-4 w-4" />
        Collect & Continue
      </Button>
    </div>
  );
};

export default RaidResultsScreen;
