
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import BattleArenaEnhanced from './battle/BattleArenaEnhanced';
import TacticalRaidScreen, { RaidResult } from './battle/TacticalRaidScreen';
import RaidResultsScreen from './battle/RaidResultsScreen';
import { useGameContext } from '@/context/GameContext';
import { toast } from '@/hooks/use-toast';
import { LootItem } from '@/types/battleTypes';

interface EnhancedMonsterBattleProps {
  debtId: string;
  onClose: () => void;
}

const EnhancedMonsterBattle: React.FC<EnhancedMonsterBattleProps> = ({ debtId, onClose }) => {
  const { debts, updateDebt, damageMonster, gainXP, setCash } = useGameContext();
  
  // Find current debt
  const currentDebt = debts.find(debt => debt.id === debtId);
  
  // Battle states
  const [battleMode, setBattleMode] = useState<'single' | 'raid'>('single');
  const [raidResults, setRaidResults] = useState<RaidResult[]>([]);
  const [raidDebts, setRaidDebts] = useState<typeof debts>([]);
  
  // Initialize raid debts on first render
  useEffect(() => {
    // In a real implementation, we would select relevant debts for the raid
    // For now, just use all debts or a subset
    setRaidDebts(debts.slice(0, 3)); // Limit to 3 debts for the raid
  }, [debts]);
  
  // Handle battle completion for single mode
  const handleBattleComplete = (loot: LootItem[]) => {
    // Apply rewards from battle
    loot.forEach(item => {
      if (item.type === 'Spirit Fragment') {
        setCash(prev => prev + item.value);
        toast({
          title: "Rewards Collected",
          description: `You've received ${item.value} DemonCoins.`,
          variant: "default",
        });
      } else if (item.type === 'Demon Seal' && currentDebt) {
        // Apply interest reduction effect
        const interestReduction = parseFloat(item.effect?.match(/(\d+)%/)?.[1] || '0') / 100;
        if (interestReduction > 0) {
          const newInterestRate = Math.max(0, currentDebt.interestRate * (1 - interestReduction));
          updateDebt(currentDebt.id, { interestRate: newInterestRate });
          
          toast({
            title: "Interest Rate Reduced",
            description: `${currentDebt.name}'s interest rate has been reduced by ${interestReduction * 100}%.`,
            variant: "default",
          });
        }
      } else if (item.type === 'Skill Scroll') {
        // Grant breathing XP
        const xpGain = item.value;
        gainXP(xpGain);
        
        toast({
          title: "Skill Scroll Used",
          description: `You've gained ${xpGain} Breathing XP.`,
          variant: "default",
        });
      }
    });
    
    onClose();
  };
  
  // Handle raid completion
  const handleRaidComplete = (results: RaidResult[]) => {
    setRaidResults(results);
    setBattleMode('raid-results');
    
    // Apply damage to demons
    results.forEach(result => {
      const debt = debts.find(d => d.id === result.debtId);
      if (debt && result.damageDealt > 0) {
        damageMonster(debt.id, result.damageDealt);
      }
    });
  };
  
  // Handle collecting raid rewards
  const handleCollectRaidRewards = (loot: LootItem[]) => {
    // Process loot items (similar to handleBattleComplete)
    loot.forEach(item => {
      if (item.type === 'Spirit Fragment') {
        setCash(prev => prev + item.value);
      }
      // Process other item types as needed
    });
    
    onClose();
  };
  
  // Cancel tactical raid and go back to single battle mode
  const handleCancelRaid = () => {
    setBattleMode('single');
  };
  
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-night-sky p-0 border-slate-700 max-w-5xl">
        <div className="relative overflow-hidden p-0">
          {battleMode === 'single' && currentDebt && (
            <BattleArenaEnhanced 
              debtId={debtId} 
              onComplete={handleBattleComplete}
              onSwitchToRaid={() => setBattleMode('raid')}
            />
          )}
          
          {battleMode === 'raid' && (
            <TacticalRaidScreen
              debts={raidDebts}
              onComplete={handleRaidComplete}
              onCancel={handleCancelRaid}
            />
          )}
          
          {battleMode === 'raid-results' && (
            <RaidResultsScreen
              results={raidResults}
              debts={raidDebts}
              onCollectRewards={handleCollectRaidRewards}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedMonsterBattle;
