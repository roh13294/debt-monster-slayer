import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';
import DebtMonster from '@/components/DebtMonster';
import { EnergyWave, AnimatedSlash, ElementalBurst, ScreenShake } from './BattleEffects';
import BattleNarrator from './BattleNarrator';
import { useBattleState, BATTLE_STANCES } from '@/hooks/useBattleState';
import BattleLog from './BattleLog';
import BattleHeader from './BattleHeader';
import ComboBadge from './ComboBadge';
import BattleHUD from './BattleHUD';
import BattleStanceSelector from './BattleStanceSelector';
import BattleAttackControls from './BattleAttackControls';
import BattleMissionTracker from './BattleMissionTracker';
import BattleEvents from './BattleEvents';
import BattleLootStage from './BattleLootStage';
import BattlePrepStage from './BattlePrepStage';
import { toast } from '@/hooks/use-toast';
import { LootItem } from '@/types/battleTypes';

interface BattleArenaProps {
  debtId: string;
  onComplete: (loot: LootItem[]) => void;
  onSwitchToRaid?: () => void;
}

const BattleArenaEnhanced: React.FC<BattleArenaProps> = ({ debtId, onComplete, onSwitchToRaid }) => {
  const { 
    debts, 
    cash, 
    damageMonster, 
    specialMoves, 
    useSpecialMove, 
    playerTraits, 
    gainXP 
  } = useGameContext();
  
  const debt = debts.find(d => d.id === debtId);
  const [paymentAmount, setPaymentAmount] = useState<number>(debt?.minimumPayment || 0);
  const [showNarrative, setShowNarrative] = useState<boolean>(true);
  const [showTips, setShowTips] = useState<boolean>(true);
  const [battleStage, setBattleStage] = useState<
    'prepare' | 'battle' | 'victory' | 'loot' | 'defeat'
  >('prepare');
  const [narrativeChoice, setNarrativeChoice] = useState<string | null>(null);
  const [narratorMessages, setNarratorMessages] = useState<string[]>([]);
  const [showSlash, setShowSlash] = useState<boolean>(false);
  const [showBurst, setShowBurst] = useState<boolean>(false);
  const [showShake, setShowShake] = useState<boolean>(false);
  const [selectedLoot, setSelectedLoot] = useState<any[]>([]);
  const [comboDisplayActive, setComboDisplayActive] = useState<boolean>(false);
  const [lastDamageInfo, setLastDamageInfo] = useState<any>(null);
  const [battleEvents, setBattleEvents] = useState<any[]>([]);
  const [turnCounter, setTurnCounter] = useState<number>(0);
  
  const {
    battleState,
    inBattle,
    comboCount,
    comboMultiplier,
    currentStance,
    stances,
    overdriveMeter,
    overdriveActive,
    overdriveTimeRemaining,
    currentMission,
    ragePhase,
    frenzyPhase,
    startBattle,
    endBattle,
    switchStance,
    calculateAttackDamage,
    updateCombo,
    checkDemonPhase,
    gainOverdrive,
    decrementOverdrive,
    updateMissionProgress,
    addBattleLog,
    getBattleLog,
    generateLoot
  } = useBattleState();
  
  useEffect(() => {
    if (debt) {
      startBattle(debtId, debt);
      setPaymentAmount(Math.min(debt.minimumPayment, cash));
      addNarratorMessage(`You face ${debt.name}! Prepare for battle!`);
    }
  }, [debtId, debt]);
  
  useEffect(() => {
    if (debt) {
      setPaymentAmount(prev => Math.min(prev, cash, debt.amount));
    }
  }, [cash, debt]);
  
  useEffect(() => {
    if (debt && inBattle) {
      const phaseChanged = checkDemonPhase(debt);
      
      if (phaseChanged && frenzyPhase) {
        setShowShake(true);
        setTimeout(() => setShowShake(false), 1000);
      } else if (phaseChanged && ragePhase) {
        setShowShake(true);
        setTimeout(() => setShowShake(false), 1000);
      }
    }
  }, [debt?.health, inBattle]);

  useEffect(() => {
    if (comboCount > 0) {
      setComboDisplayActive(true);
      const timer = setTimeout(() => {
        setComboDisplayActive(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [comboCount]);
  
  if (!debt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-300">No demons to battle</h2>
        <p className="text-slate-400 mb-6">You have no debts to battle against. Well done!</p>
        <button onClick={onComplete} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded">Continue Journey</button>
      </div>
    );
  }
  
  const addNarratorMessage = (message: string) => {
    setNarratorMessages(prev => [message, ...prev]);
  };
  
  const handleMessageProcessed = () => {
    if (narratorMessages.length > 0) {
      setNarratorMessages(prev => prev.slice(1));
    }
  };
  
  const handleSlashComplete = () => {
    setShowSlash(false);
  };
  
  const handleBurstComplete = () => {
    setShowBurst(false);
  };
  
  const handleShakeComplete = () => {
    setShowShake(false);
  };
  
  const handleStartBattle = () => {
    setBattleStage('battle');
    setShowNarrative(false);
  };
  
  const handleStanceChange = (stanceId: string) => {
    switchStance(stanceId);
    
    const newStance = BATTLE_STANCES.find(s => s.id === stanceId);
    if (newStance) {
      addNarratorMessage(`Switched to ${newStance.name} stance!`);
    }
    
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 800);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + " HP";
  };
  
  const handleAttack = (attackAmount: number) => {
    if (!debt || attackAmount <= 0) {
      return;
    }
    
    // Check if player has enough spirit energy
    if (attackAmount > cash) {
      toast({
        title: "Not Enough Spirit Energy",
        description: "You don't have enough spirit energy for this attack.",
        variant: "destructive",
      });
      return;
    }
    
    setTurnCounter(prev => prev + 1);
    
    const attackResult = calculateAttackDamage(attackAmount, debt);
    setLastDamageInfo(attackResult);
    
    updateCombo(!attackResult.isMiss);
    
    setShowSlash(true);
    setTimeout(() => {
      if (!attackResult.isMiss) {
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 500);
      }
    }, 300);
    
    if (!attackResult.isMiss) {
      addNarratorMessage(`Attack hits for ${attackResult.damage} damage!${attackResult.isCritical ? ' CRITICAL HIT!' : ''}`);
      
      const overdriveGain = Math.max(5, Math.floor((attackResult.damage / debt.amount) * 100));
      gainOverdrive(overdriveGain);
      
      if (currentMission?.type === 'damage') {
        updateMissionProgress('damage', attackResult.damage);
      } else if (currentMission?.type === 'combo' && comboCount >= currentMission.goal) {
        updateMissionProgress('combo', 1);
      }
      
      setTimeout(() => {
        // Fix the comparison between damageMonster result and boolean
        const success = damageMonster(debtId, attackResult.damage);
        
        if (success && attackResult.damage >= debt.balance) {
          handleVictory();
        }
      }, 800);
      
      if (attackResult.comboCount > 1) {
        setComboDisplayActive(true);
        setTimeout(() => {
          setComboDisplayActive(false);
        }, 2000);
      }
    } else {
      addNarratorMessage("Your attack missed! Combo reset!");
    }
    
    if (Math.random() < 0.2) {
      triggerRandomBattleEvent();
    }
    
    decrementOverdrive();
  };
  
  const handleSpecialMove = () => {
    if (specialMoves <= 0) return;
    
    setTurnCounter(prev => prev + 1);
    
    setShowBurst(true);
    addNarratorMessage(`You unleash a special technique!`);
    
    setTimeout(() => {
      useSpecialMove(debtId);
      
      gainOverdrive(15);
    }, 800);
  };
  
  const handleNarrativeChoice = (choice: string) => {
    setNarrativeChoice(choice);
    setShowNarrative(false);
    addNarratorMessage(`Inner reflection: "${choice}"`);
    
    if (choice.includes("head on") || choice.includes("won't know what hit it")) {
      switchStance('aggressive');
    } else if (choice.includes("patience") || choice.includes("careful approach")) {
      switchStance('defensive');
    } else if (choice.includes("gamble") || choice.includes("risks")) {
      switchStance('risky');
    }
    
    setTimeout(() => {
      handleStartBattle();
    }, 1000);
  };
  
  const handleVictory = () => {
    const loot = generateLoot(debt);
    setSelectedLoot(loot);
    
    if (gainXP) {
      const comboBonus = Math.floor(comboCount * 2);
      if (comboBonus > 0) {
        gainXP(comboBonus);
        addNarratorMessage(`Bonus XP from combo chain: +${comboBonus}XP!`);
      }
    }
    
    if (currentMission && currentMission.progress >= currentMission.goal) {
      switch (currentMission.reward) {
        case "XP Boost":
          if (gainXP) {
            gainXP(15);
            addNarratorMessage(`Mission reward: +15XP!`);
          }
          break;
      }
    }
    
    endBattle(true);
    setBattleStage('loot');
  };
  
  // Fix the handleCollectLoot function to handle the MouseEvent properly
  const handleCollectLoot = (selectedItems: LootItem[]) => {
    addNarratorMessage(`You collected: ${selectedItems[0]?.name || 'rewards'}!`);
    
    setTimeout(() => {
      onComplete(selectedItems);
    }, 1000);
  };
  
  const triggerRandomBattleEvent = () => {
    const eventPool = [
      { 
        name: "Market Surge", 
        description: "A sudden market opportunity appears!",
        effect: "Gain 5% extra damage this turn",
        type: "positive"
      },
      { 
        name: "Interest Spike", 
        description: "The demon's corruption aura intensifies!",
        effect: "Next attack costs 10% more",
        type: "negative"
      },
      { 
        name: "Focus Moment", 
        description: "Your concentration peaks!",
        effect: "Combo multiplier increased",
        type: "positive"
      },
      { 
        name: "Financial Insight", 
        description: "You spot a weakness in the demon's defenses!",
        effect: "+20% critical chance",
        type: "positive"
      }
    ];
    
    const selectedEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
    
    setBattleEvents(prev => [selectedEvent, ...prev].slice(0, 3));
    
    addNarratorMessage(`🃏 Battle Event: ${selectedEvent.name} - ${selectedEvent.effect}`);
    
    if (selectedEvent.type === "positive") {
      gainOverdrive(10);
    }
  };
  
  const getElementType = () => {
    switch(currentStance) {
      case 'aggressive': return 'fire';
      case 'defensive': return 'water';
      case 'risky': return 'lightning';
      default: return 'earth';
    }
  };
  
  return (
    <div className="min-h-[80vh] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
        <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5"></div>
        <EnergyWave color="purple" duration={6} />
        <EnergyWave color="blue" duration={8} delay={2} />
        
        {ragePhase && (
          <EnergyWave color="yellow" duration={4} />
        )}
        
        {frenzyPhase && (
          <EnergyWave color="red" duration={3} />
        )}
      </div>
      
      <AnimatedSlash 
        isActive={showSlash} 
        onComplete={handleSlashComplete}
      />
      
      <ElementalBurst
        element={getElementType()}
        isActive={showBurst}
        onComplete={handleBurstComplete}
      />
      
      <ScreenShake
        isActive={showShake}
        onComplete={handleShakeComplete}
      />
      
      <BattleNarrator 
        messageQueue={narratorMessages}
        onMessageShown={handleMessageProcessed}
      />
      
      <ComboBadge 
        active={comboDisplayActive} 
        count={comboCount} 
        multiplier={comboMultiplier} 
      />
      
      <div className="relative z-10 container mx-auto py-10 px-4">
        <BattleHeader 
          battleStage={battleStage}
          currentStance={currentStance}
          ragePhase={ragePhase}
          frenzyPhase={frenzyPhase}
        />
        
        {battleStage === 'prepare' && (
          <BattlePrepStage 
            debt={debt}
            showNarrative={showNarrative}
            narrativeChoice={narrativeChoice}
            showTips={showTips}
            currentStance={currentStance}
            onNarrativeChoice={handleNarrativeChoice}
            onStartBattle={handleStartBattle}
            onCloseTips={() => setShowTips(false)}
            onSwitchToRaid={onSwitchToRaid}
          />
        )}
        
        {battleStage === 'battle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
          >
            <div className="md:col-span-5">
              <DebtMonster 
                debt={debt} 
                isInBattle={true}
                ragePhase={ragePhase}
                frenzyPhase={frenzyPhase}
              />
              
              <BattleEvents events={battleEvents} />
              
              {currentMission && (
                <div className="mt-4">
                  <BattleMissionTracker mission={currentMission} />
                </div>
              )}
            </div>
            
            <div className="md:col-span-7">
              <BattleHUD
                comboCount={comboCount}
                comboMultiplier={comboMultiplier}
                overdriveMeter={overdriveMeter}
                overdriveActive={overdriveActive}
                overdriveTimeRemaining={overdriveTimeRemaining}
              />
              
              <BattleAttackControls
                debt={debt}
                cash={cash}
                specialMoves={specialMoves}
                currentStance={currentStance}
                onAttack={handleAttack}
                onSpecialMove={handleSpecialMove}
              />
              
              <BattleLog 
                entries={battleState.battleLog} 
                maxHeight="200px"
              />
            </div>
          </motion.div>
        )}
        
        {battleStage === 'loot' && (
          <BattleLootStage 
            loot={selectedLoot}
            onCollectLoot={handleCollectLoot}
          />
        )}
      </div>
    </div>
  );
};

export default BattleArenaEnhanced;
