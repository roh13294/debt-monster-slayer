
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';
import { Debt } from '@/types/gameTypes';
import { toast } from '@/hooks/use-toast';
import MissionGenerator from './MissionGenerator';
import BattleArenaEnhanced from './BattleArenaEnhanced';
import MissionResults from './MissionResults';
import { Button } from '@/components/ui/button';
import { Sword, Calendar, ArrowRight, Shield, Target, Coins } from 'lucide-react';
import { LootItem } from '@/types/battleTypes';
import DemonQueue from './DemonQueue';

interface MonthlyMissionCampaignProps {
  onComplete: () => void;
}

const MonthlyMissionCampaign: React.FC<MonthlyMissionCampaignProps> = ({ onComplete }) => {
  const { 
    debts, 
    cash,
    setCash,
    processMonthlyFinancials,
    playerTraits,
    gainXP
  } = useGameContext();

  // Campaign state
  const [missionStage, setMissionStage] = useState<
    'selection' | 'battle' | 'results'
  >('selection');
  const [selectedDemons, setSelectedDemons] = useState<Debt[]>([]);
  const [completedDemons, setCompletedDemons] = useState<string[]>([]);
  const [activeTargetIndex, setActiveTargetIndex] = useState<number>(0);
  const [selectedStance, setSelectedStance] = useState<string>('aggressive');
  const [totalLoot, setTotalLoot] = useState<LootItem[]>([]);
  const [missionStats, setMissionStats] = useState({
    demonsDefeated: 0,
    totalDamageDealt: 0,
    highestCombo: 0,
    timeSpent: 0,
    xpGained: 0,
    coinsEarned: 0
  });
  const [targetSwitchCost, setTargetSwitchCost] = useState<number>(15);
  const [missionStartTime, setMissionStartTime] = useState<number>(0);

  // Reset mission state when debts change
  useEffect(() => {
    if (debts.length === 0 && missionStage !== 'results') {
      handleMissionComplete();
    }
  }, [debts]);

  // Track mission time
  useEffect(() => {
    if (missionStage === 'battle' && missionStartTime === 0) {
      setMissionStartTime(Date.now());
    }
  }, [missionStage]);

  // Handle mission generation
  const handleMissionStart = (demons: Debt[], stance: string) => {
    setSelectedDemons(demons);
    setSelectedStance(stance);
    setActiveTargetIndex(0);
    setCompletedDemons([]);
    setTotalLoot([]);
    setMissionStats({
      demonsDefeated: 0,
      totalDamageDealt: 0,
      highestCombo: 0,
      timeSpent: 0,
      xpGained: 0,
      coinsEarned: 0
    });
    setMissionStartTime(Date.now());
    setMissionStage('battle');
  };

  // Handle switching targets
  const handleSwitchTarget = (demonId: string) => {
    const targetIndex = selectedDemons.findIndex(demon => demon.id === demonId);
    if (targetIndex !== -1 && targetIndex !== activeTargetIndex) {
      // Deduct spirit cost for switching
      setCash(prev => prev - targetSwitchCost); // Fixed TypeScript error with arrow function
      
      // Update target index
      setActiveTargetIndex(targetIndex);
      
      toast({
        title: "Target Switched",
        description: `Now targeting: ${selectedDemons[targetIndex].name}`,
        variant: "default",
      });
    }
  };

  // Handle battle completion
  const handleBattleComplete = (loot: LootItem[]) => {
    // Add to total loot
    setTotalLoot(prev => [...prev, ...loot]);
    
    // Mark current demon as completed
    const completedDemonId = selectedDemons[activeTargetIndex].id;
    setCompletedDemons(prev => [...prev, completedDemonId]);
    
    // Update mission stats
    setMissionStats(prev => ({
      ...prev,
      demonsDefeated: prev.demonsDefeated + 1,
      xpGained: prev.xpGained + Math.floor(10 + Math.random() * 5),
      coinsEarned: prev.coinsEarned + Math.floor(selectedDemons[activeTargetIndex].minimumPayment * 0.1)
    }));
    
    // Check if all demons are defeated
    if (completedDemons.length + 1 >= selectedDemons.length) {
      handleMissionComplete();
    } else {
      // Find next undefeated demon
      const nextIndex = selectedDemons.findIndex(demon => !completedDemons.includes(demon.id) && demon.id !== completedDemonId);
      
      if (nextIndex !== -1) {
        setActiveTargetIndex(nextIndex);
      } else {
        handleMissionComplete();
      }
    }
  };

  // Handle mission completion
  const handleMissionComplete = () => {
    const timeSpent = Math.floor((Date.now() - missionStartTime) / 1000);
    
    setMissionStats(prev => ({
      ...prev,
      timeSpent
    }));
    
    // Award XP based on mission performance
    if (gainXP) {
      const baseXP = missionStats.demonsDefeated * 10;
      const timeBonus = Math.max(0, 60 - timeSpent) / 2;
      const totalXP = Math.floor(baseXP + timeBonus);
      
      gainXP(totalXP);
    }
    
    // Process monthly financials with selected stance
    processMonthlyFinancials(selectedStance);
    
    setMissionStage('results');
  };

  // Handle mission campaign completion
  const handleCampaignFinish = () => {
    onComplete();
  };

  // Get current active demon
  const currentDemon = selectedDemons[activeTargetIndex];
  
  // Determine if there's an active target
  const hasActiveTarget = currentDemon && !completedDemons.includes(currentDemon.id);
  
  // Check rage/frenzy phase for current demon
  const isInRagePhase = currentDemon?.health <= 66 && currentDemon?.health > 33;
  const isInFrenzyPhase = currentDemon?.health <= 33;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
      {missionStage === 'selection' && (
        <MissionGenerator 
          onMissionStart={handleMissionStart}
          onCancel={onComplete}
        />
      )}
      
      {missionStage === 'battle' && hasActiveTarget && (
        <>
          {selectedDemons.length > 1 && (
            <div className="container mx-auto py-4">
              <DemonQueue
                demons={selectedDemons}
                activeTargetId={currentDemon.id}
                onSwitchTarget={(id) => handleSwitchTarget(id)}
                spiritCost={targetSwitchCost}
                cash={cash}
                ragePhase={isInRagePhase}
                frenzyPhase={isInFrenzyPhase}
              />
            </div>
          )}
          
          <BattleArenaEnhanced
            debtId={currentDemon.id}
            onComplete={handleBattleComplete}
            onSwitchToRaid={() => setMissionStage('selection')}
          />
        </>
      )}
      
      {missionStage === 'results' && (
        <MissionResults
          demons={selectedDemons}
          completedDemons={completedDemons}
          loot={totalLoot}
          stats={missionStats}
          onContinue={handleCampaignFinish}
        />
      )}
    </div>
  );
};

export default MonthlyMissionCampaign;
