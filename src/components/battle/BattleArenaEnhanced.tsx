import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Zap, Sword, TrendingUp, Target, LayoutGrid } from 'lucide-react';
import DebtMonster from '@/components/DebtMonster';
import { EnergyWave, AnimatedSlash, ElementalBurst, ScreenShake } from './BattleEffects';
import BattleTips from './BattleTips';
import BattleNarrator from './BattleNarrator';
import NarrativeMoment from '@/components/journey/NarrativeMoment';
import LootDropCard from '@/components/battle/LootDropCard';
import { useBattleState, BATTLE_STANCES } from '@/hooks/useBattleState';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import DemonCoin from '@/components/ui/DemonCoin';

interface BattleArenaProps {
  debtId: string;
  onComplete: () => void;
}

const BattleArenaEnhanced: React.FC<BattleArenaProps> = ({ debtId, onComplete }) => {
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
  
  // Import battle state hook
  const {
    battleState,
    inBattle,
    comboCount,
    comboMultiplier,
    currentStance,
    stances,
    overdriveMeter,
    overdriveActive,
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
  
  // Initialize battle when component mounts
  useEffect(() => {
    if (debt) {
      startBattle(debtId, debt);
      setPaymentAmount(Math.min(debt.minimumPayment, cash));
      addNarratorMessage(`You face ${debt.name}! Prepare for battle!`);
    }
  }, [debtId, debt]);
  
  // Update payment amount when cash or debt changes
  useEffect(() => {
    if (debt) {
      setPaymentAmount(prev => Math.min(prev, cash, debt.amount));
    }
  }, [cash, debt]);
  
  // Check for demon phase changes
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

  // Handle combo display animation
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
        <Button onClick={onComplete}>Continue Journey</Button>
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
  
  // Start main battle
  const handleStartBattle = () => {
    setBattleStage('battle');
    setShowNarrative(false);
  };
  
  // Handle stance change
  const handleStanceChange = (stanceId: string) => {
    switchStance(stanceId);
    
    const newStance = BATTLE_STANCES.find(s => s.id === stanceId);
    if (newStance) {
      addNarratorMessage(`Switched to ${newStance.name} stance!`);
    }
    
    // Play appropriate visual effect based on stance
    setShowBurst(true);
    setTimeout(() => setShowBurst(false), 800);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + " HP";
  };
  
  // Handle attack action
  const handleAttack = () => {
    if (!debt || paymentAmount <= 0 || paymentAmount > cash) {
      return;
    }
    
    // Increment turn counter
    setTurnCounter(prev => prev + 1);
    
    // Calculate damage with combo and stance bonuses
    const attackResult = calculateAttackDamage(paymentAmount, debt);
    setLastDamageInfo(attackResult);
    
    // Update the combo system if hit landed
    updateCombo(!attackResult.isMiss);
    
    // Play attack animations
    setShowSlash(true);
    setTimeout(() => {
      if (!attackResult.isMiss) {
        setShowBurst(true);
        setTimeout(() => setShowBurst(false), 500);
      }
    }, 300);
    
    // Apply damage if hit landed
    if (!attackResult.isMiss) {
      addNarratorMessage(`Attack hits for ${attackResult.damage} damage!${attackResult.isCritical ? ' CRITICAL HIT!' : ''}`);
      
      // Gain overdrive based on damage dealt relative to debt amount
      const overdriveGain = Math.max(5, Math.floor((attackResult.damage / debt.amount) * 100));
      gainOverdrive(overdriveGain);
      
      // If in battle mission, update progress
      if (currentMission?.type === 'damage') {
        updateMissionProgress('damage', attackResult.damage);
      } else if (currentMission?.type === 'combo' && comboCount >= currentMission.goal) {
        updateMissionProgress('combo', 1);
      }
      
      // Apply the damage to the demon
      setTimeout(() => {
        damageMonster(debtId, attackResult.damage);
        
        // Check if demon is defeated
        if (attackResult.damage >= debt.amount) {
          handleVictory();
        }
      }, 800);
      
      // Show the combo counter visual
      if (attackResult.comboCount > 1) {
        setComboDisplayActive(true);
        setTimeout(() => {
          setComboDisplayActive(false);
        }, 2000);
      }
    } else {
      addNarratorMessage("Your attack missed! Combo reset!");
    }
    
    // Randomly trigger battle events (20% chance)
    if (Math.random() < 0.2) {
      triggerRandomBattleEvent();
    }
    
    // Decrement overdrive turns if active
    decrementOverdrive();
  };
  
  // Handle special move
  const handleSpecialMove = () => {
    if (specialMoves <= 0) return;
    
    // Increment turn counter
    setTurnCounter(prev => prev + 1);
    
    setShowBurst(true);
    addNarratorMessage(`You unleash a special technique!`);
    
    // Apply special move effect
    setTimeout(() => {
      useSpecialMove(debtId);
      
      // Gain some overdrive
      gainOverdrive(15);
    }, 800);
  };
  
  // Handle narrative choice
  const handleNarrativeChoice = (choice: string) => {
    setNarrativeChoice(choice);
    setShowNarrative(false);
    addNarratorMessage(`Inner reflection: "${choice}"`);
    
    // Map choice to a stance
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
  
  // Handle victory
  const handleVictory = () => {
    // Generate loot
    const loot = generateLoot(debt);
    setSelectedLoot(loot);
    
    // Additional XP based on combo achieved
    if (gainXP) {
      const comboBonus = Math.floor(comboCount * 2);
      if (comboBonus > 0) {
        gainXP(comboBonus);
        addNarratorMessage(`Bonus XP from combo chain: +${comboBonus}XP!`);
      }
    }
    
    // Award mission reward if completed
    if (currentMission && currentMission.progress >= currentMission.goal) {
      switch (currentMission.reward) {
        case "XP Boost":
          if (gainXP) {
            gainXP(15);
            addNarratorMessage(`Mission reward: +15XP!`);
          }
          break;
        // Other reward types handled in their respective components
      }
    }
    
    endBattle(true);
    setBattleStage('loot');
  };
  
  // Handle loot collection
  const handleCollectLoot = (selectedItems: any[]) => {
    // Award loot to player here
    addNarratorMessage(`You collected: ${selectedItems[0]?.name || 'rewards'}!`);
    
    setTimeout(() => {
      onComplete();
    }, 1000);
  };
  
  // Trigger random battle event
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
    
    // Select random event
    const selectedEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
    
    // Add to battle events
    setBattleEvents(prev => [selectedEvent, ...prev].slice(0, 3));
    
    // Notify player
    addNarratorMessage(`🃏 Battle Event: ${selectedEvent.name} - ${selectedEvent.effect}`);
    
    // Apply event effect (simplified)
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
      
      {/* Combo counter display */}
      <AnimatePresence>
        {comboDisplayActive && comboCount > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          >
            <div className="bg-gradient-to-br from-amber-600 to-red-600 px-6 py-3 rounded-full shadow-lg border-2 border-yellow-300">
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-yellow-200 animate-pulse" />
                <span className="text-2xl font-bold text-white">COMBO x{comboCount}</span>
                <span className="text-sm text-yellow-200">{(comboMultiplier).toFixed(1)}x</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto py-10 px-4">
        {/* Battle header */}
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
        
        {/* Battle prep stage */}
        {battleStage === 'prepare' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <DebtMonster 
                debt={debt} 
                isInBattle={true}
              />
            </div>
            
            {showNarrative ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-slate-100 mb-4">Inner Reflection</h3>
                <p className="text-slate-300 mb-6 italic">
                  As you prepare to face this demon, what thoughts guide your approach?
                </p>
                
                <div className="space-y-3">
                  {[
                    "I'll face this head on, with everything I have.",
                    "Patience and wisdom will guide my actions.",
                    "Sometimes you have to gamble to get ahead.",
                    "Each demon requires a different strategy."
                  ].map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleNarrativeChoice(option)}
                      className="w-full p-3 text-left border border-slate-700 rounded-md bg-slate-800 hover:bg-slate-800/80 hover:border-slate-600 transition-colors"
                    >
                      <p className="text-slate-200">{option}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    currentStance === 'aggressive' ? 'bg-red-900/30 border border-red-800' : 
                    currentStance === 'defensive' ? 'bg-blue-900/30 border border-blue-800' : 
                    'bg-amber-900/30 border border-amber-800'
                  }`}>
                    {currentStance === 'aggressive' && <Flame className="w-5 h-5 text-red-400" />}
                    {currentStance === 'defensive' && <Shield className="w-5 h-5 text-blue-400" />}
                    {currentStance === 'risky' && <Zap className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-100 mb-1">Battle Preparation</h3>
                    <p className="text-slate-300 mb-2 italic">"{narrativeChoice}"</p>
                    <p className="text-sm text-slate-400">
                      Your mindset shapes your approach to this battle, influencing your technique and effectiveness.
                    </p>
                    
                    <Button 
                      onClick={handleStartBattle}
                      className={`mt-4 ${
                        currentStance === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600' : 
                        currentStance === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600' : 
                        'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600'
                      }`}
                    >
                      Begin Battle
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {showTips && <BattleTips stance={currentStance} onClose={() => setShowTips(false)} />}
          </motion.div>
        )}
        
        {/* Main battle stage */}
        {battleStage === 'battle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6"
          >
            {/* Left column - Monster */}
            <div className="md:col-span-5">
              {/* Demon monster card */}
              <DebtMonster 
                debt={debt} 
                isInBattle={true}
                ragePhase={ragePhase}
                frenzyPhase={frenzyPhase}
              />
              
              {/* Battle events */}
              <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Recent Events</h3>
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                  {battleEvents.length > 0 ? (
                    <div className="space-y-2">
                      {battleEvents.map((event, index) => (
                        <div 
                          key={index} 
                          className={`text-xs p-2 rounded border ${
                            event.type === 'positive' 
                              ? 'bg-green-950/30 border-green-800/30 text-green-400' 
                              : 'bg-red-950/30 border-red-800/30 text-red-400'
                          }`}
                        >
                          <p className="font-bold">{event.name}</p>
                          <p>{event.effect}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-1">No active events</p>
                  )}
                </div>
              </div>
              
              {/* Current mission */}
              {currentMission && (
                <div className="mt-4 bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-medium text-slate-300">Battle Mission</span>
                    </div>
                    <span className="text-xs text-amber-400 font-bold">
                      {currentMission.progress}/{currentMission.goal}
                    </span>
                  </div>
                  <Progress 
                    value={(currentMission.progress / currentMission.goal) * 100} 
                    className="h-1 mb-1"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">
                      {currentMission.type === 'damage' ? 'Deal damage' : 
                       currentMission.type === 'combo' ? 'Reach combo chain' : 
                       'Defeat quickly'}
                    </span>
                    <span className="text-slate-300">Reward: {currentMission.reward}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column - Battle controls */}
            <div className="md:col-span-7">
              {/* Battle HUD */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Combo meter */}
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-orange-400" /> 
                      <span className="text-sm font-medium text-slate-300">Combo Chain</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      comboCount > 2 ? 'text-orange-400' : 'text-slate-400'
                    }`}>
                      x{comboCount} ({(comboMultiplier).toFixed(1)}x)
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        comboCount >= 9 ? 'bg-gradient-to-r from-yellow-500 to-red-500' :
                        comboCount >= 6 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        comboCount >= 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                        'bg-amber-600'
                      }`} 
                      style={{ width: `${Math.min(100, (comboCount / 10) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>{comboCount > 0 ? "Active" : "No combo"}</span>
                    {comboCount >= 3 && (<span className="text-amber-500">Finisher ready!</span>)}
                  </div>
                </div>
                
                {/* Overdrive meter */}
                <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-400" /> 
                      <span className="text-sm font-medium text-slate-300">Overdrive</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      overdriveActive ? 'text-blue-400' : 'text-slate-400'
                    }`}>
                      {overdriveActive ? `Active (${overdriveTimeRemaining})` : `${overdriveMeter}%`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        overdriveActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse' : 
                        'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`} 
                      style={{ width: overdriveActive ? '100%' : `${overdriveMeter}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>{overdriveMeter < 25 ? "Building" : 
                          overdriveMeter < 75 ? "Charging" : 
                          overdriveMeter < 100 ? "Almost Ready" :
                          "MAXIMUM"}</span>
                    {overdriveActive && (<span className="text-blue-400 animate-pulse">ACTIVATED</span>)}
                  </div>
                </div>
              </div>
              
              {/* Attack controls */}
              <div className="bg-slate-900/90 border border-slate-700 rounded-lg p-6">
                {/* Stance switcher */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Combat Stance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {BATTLE_STANCES.map(stance => (
                      <Button
                        key={stance.id}
                        onClick={() => handleStanceChange(stance.id)}
                        variant={currentStance === stance.id ? "default" : "outline"}
                        className={`flex items-center justify-center gap-1 ${
                          currentStance === stance.id ? (
                            stance.id === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                            stance.id === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                            stance.id === 'risky' ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                          ) : 'border-slate-600'
                        }`}
                      >
                        {stance.id === 'aggressive' && <Flame className="w-4 h-4" />}
                        {stance.id === 'defensive' && <Shield className="w-4 h-4" />}
                        {stance.id === 'risky' && <Zap className="w-4 h-4" />}
                        {stance.name}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Attack power */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Attack Strength</span>
                    <span className="text-amber-400 font-medium">{formatCurrency(paymentAmount)}</span>
                  </div>
                  
                  <Slider
                    value={[paymentAmount]}
                    min={debt.minimumPayment > cash ? cash : debt.minimumPayment}
                    max={Math.min(cash, debt.amount)}
                    step={5}
                    onValueChange={(value) => setPaymentAmount(value[0])}
                    className="my-4"
                  />
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Min: {formatCurrency(debt.minimumPayment > cash ? cash : debt.minimumPayment)}</span>
                    <span>Max: {formatCurrency(Math.min(cash, debt.amount))}</span>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-400">Available Spirit Energy</span>
                      <span className="text-slate-300"><DemonCoin amount={cash} size="sm" /></span>
                    </div>
                  </div>
                </div>
                
                {/* Attack buttons */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAttack}
                      disabled={paymentAmount <= 0 || cash <= 0}
                      className={`w-full py-6 ${
                        currentStance === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' :
                        currentStance === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' :
                        currentStance === 'risky' ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500' :
                        'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
                      }`}
                    >
                      <Sword className="w-5 h-5 mr-2" />
