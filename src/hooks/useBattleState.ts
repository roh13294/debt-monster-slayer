
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "@/hooks/use-toast";
import { Debt } from '../types/gameTypes';
import { BattleState, BattleLogEntry, SpecialTechnique, LootItem } from '../types/battleTypes';

// Stance definitions
export const BATTLE_STANCES = [
  { 
    id: 'aggressive', 
    name: 'Aggressive', 
    description: 'Increase damage dealt by 20% but take 10% more damage',
    styleType: 'flame',
    damageBoost: 1.2,
    defenseMod: 0.9
  },
  { 
    id: 'defensive', 
    name: 'Defensive', 
    description: 'Reduce damage taken by 20% but deal 10% less damage',
    styleType: 'water',
    damageBoost: 0.9,
    defenseMod: 1.2
  },
  { 
    id: 'risky', 
    name: 'Risky', 
    description: '25% chance to deal critical hits (2x damage), but 15% chance to miss',
    styleType: 'thunder',
    critChance: 0.25,
    missChance: 0.15
  }
];

export function useBattleState() {
  // Core battle state
  const [battleState, setBattleState] = useState<BattleState>({
    inBattle: false,
    currentDebtId: null,
    ragePhase: false,
    frenzyPhase: false,
    lastAttackTime: 0,
    comboCounter: 0,
    battleLog: []
  });
  
  // Combo system
  const [comboCount, setComboCount] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1);
  const [comboTimeoutId, setComboTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Stance system
  const [currentStance, setCurrentStance] = useState<string>('aggressive');
  
  // Overdrive system
  const [overdriveMeter, setOverdriveMeter] = useState<number>(0);
  const [overdriveActive, setOverdriveActive] = useState<boolean>(false);
  const [overdriveTimeRemaining, setOverdriveTimeRemaining] = useState<number>(0);
  
  // Battle missions
  const [currentMission, setCurrentMission] = useState<{
    type: string;
    goal: number;
    reward: string;
    progress: number;
  } | null>(null);
  
  // Special techniques
  const [specialTechniques, setSpecialTechniques] = useState<SpecialTechnique[]>([
    {
      id: 'interest-reduction',
      name: 'Chain Breaker',
      description: 'Reduce debt interest by 20%',
      cooldown: 3,
      currentCooldown: 0,
      effectType: 'interest',
      effectValue: 20,
      unlocked: true
    },
    {
      id: 'massive-strike',
      name: 'Breathing Form: First Style',
      description: 'Deal 2x damage in a single devastating strike',
      cooldown: 4,
      currentCooldown: 0,
      effectType: 'damage',
      effectValue: 2,
      unlocked: true
    }
  ]);

  // Initialize a battle
  const startBattle = (debtId: string, debt: Debt) => {
    setBattleState({
      inBattle: true,
      currentDebtId: debtId,
      ragePhase: false,
      frenzyPhase: false,
      lastAttackTime: Date.now(),
      comboCounter: 0,
      battleLog: [
        {
          id: uuidv4(),
          message: `Battle with ${debt.name} has begun!`,
          timestamp: Date.now(),
          type: 'system'
        }
      ]
    });
    
    // Reset combo
    setComboCount(0);
    setComboMultiplier(1);
    
    // Generate a random mission
    generateBattleMission(debt);
    
    // Reset overdrive
    setOverdriveMeter(0);
    setOverdriveActive(false);
    
    // Reset cooldowns on special techniques
    setSpecialTechniques(prev => prev.map(technique => ({
      ...technique,
      currentCooldown: 0
    })));
  };

  // End the current battle
  const endBattle = (wasVictory: boolean) => {
    if (wasVictory) {
      addBattleLog(`Victory! The demon has been defeated.`, 'system');
      
      // Complete mission if in progress
      if (currentMission && currentMission.progress > 0) {
        toast({
          title: "Mission Progress Saved",
          description: `Progress toward ${currentMission.type} mission: ${currentMission.progress}/${currentMission.goal}`,
          variant: "default",
        });
      }
    } else {
      addBattleLog(`Battle ended. The demon remains.`, 'system');
    }
    
    setBattleState(prev => ({
      ...prev,
      inBattle: false,
      currentDebtId: null
    }));
    
    // Clear combo timeout
    if (comboTimeoutId) {
      clearTimeout(comboTimeoutId);
      setComboTimeoutId(null);
    }
    
    // Reset stance to default
    setCurrentStance('aggressive');
  };

  // Switch battle stance
  const switchStance = (stanceId: string) => {
    const validStance = BATTLE_STANCES.find(s => s.id === stanceId);
    
    if (!validStance) {
      console.error(`Invalid stance: ${stanceId}`);
      return;
    }
    
    setCurrentStance(stanceId);
    addBattleLog(`Switched to ${validStance.name} stance!`, 'system');
    
    toast({
      title: "Stance Changed",
      description: `You've switched to ${validStance.name}: ${validStance.description}`,
      variant: "default",
    });
    
    // Small overdrive gain when switching stances
    gainOverdrive(5);
  };

  // Calculate damage based on combo, stance, and overdrive
  const calculateAttackDamage = (baseDamage: number, debt: Debt) => {
    // Get stance modifiers
    const stance = BATTLE_STANCES.find(s => s.id === currentStance) || BATTLE_STANCES[0];
    
    // Check for miss (risky stance)
    if (stance.id === 'risky' && Math.random() < stance.missChance) {
      addBattleLog(`Attack missed!`, 'attack');
      resetCombo();
      return { 
        damage: 0, 
        isCritical: false, 
        isMiss: true 
      };
    }
    
    // Apply combo multiplier
    const newComboCount = comboCount + 1;
    const newMultiplier = 1 + (newComboCount * 0.1); // 10% per combo step
    
    // Check for critical hit (risky stance)
    let isCritical = false;
    if (stance.id === 'risky' && Math.random() < stance.critChance) {
      isCritical = true;
      addBattleLog(`Critical hit! 2x damage`, 'attack');
    }
    
    // Base damage calculation
    let totalDamage = baseDamage * (stance.damageBoost || 1) * newMultiplier;
    
    // Apply critical hit multiplier
    if (isCritical) {
      totalDamage *= 2;
    }
    
    // Apply overdrive bonus if active
    if (overdriveActive) {
      totalDamage *= 1.5;
    }
    
    // Special handling for frenzy/rage phases
    if (battleState.frenzyPhase) {
      // In frenzy phase, player gets a bonus
      totalDamage *= 1.2;
    }
    
    return {
      damage: Math.floor(totalDamage),
      isCritical,
      isMiss: false,
      comboCount: newComboCount,
      comboMultiplier: newMultiplier
    };
  };

  // Handle combo system
  const updateCombo = (hit: boolean) => {
    if (hit) {
      // Increment combo
      const newComboCount = comboCount + 1;
      setComboCount(newComboCount);
      setComboMultiplier(1 + newComboCount * 0.1);
      
      // Clear any existing timeout
      if (comboTimeoutId) {
        clearTimeout(comboTimeoutId);
      }
      
      // Set new timeout - combo expires after 3 seconds of inactivity
      const timeoutId = setTimeout(() => {
        resetCombo();
        addBattleLog(`Combo chain broken!`, 'system');
      }, 3000);
      
      setComboTimeoutId(timeoutId);
      
      // Trigger combo finisher if applicable
      if (newComboCount >= 3 && newComboCount % 3 === 0) {
        triggerComboFinisher(newComboCount);
      }
      
      // Update last attack time
      setBattleState(prev => ({
        ...prev,
        lastAttackTime: Date.now()
      }));
    } else {
      resetCombo();
    }
  };

  // Reset combo
  const resetCombo = () => {
    setComboCount(0);
    setComboMultiplier(1);
    
    if (comboTimeoutId) {
      clearTimeout(comboTimeoutId);
      setComboTimeoutId(null);
    }
  };

  // Trigger special combo finisher
  const triggerComboFinisher = (comboSize: number) => {
    let finisherName = "Flame Concentration: First Form";
    let finisherEffect = "Style Boost";
    
    if (comboSize >= 6) {
      finisherName = "Total Concentration: Flowing Water";
      finisherEffect = "Super Effective!";
    } else if (comboSize >= 9) {
      finisherName = "Ultimate Style: Hinokami Kagura";
      finisherEffect = "DEVASTATING STRIKE!";
    }
    
    addBattleLog(`COMBO x${comboSize}! ${finisherName}: ${finisherEffect}`, 'special');
    
    toast({
      title: "Combo Finisher Activated!",
      description: `${finisherName}: ${finisherEffect}`,
      variant: "default",
    });
    
    // Gain overdrive points for combo finishers
    gainOverdrive(comboSize * 5);
  };

  // Handle overdrive system
  const gainOverdrive = (points: number) => {
    if (overdriveActive) return;
    
    setOverdriveMeter(prev => {
      const newValue = Math.min(100, prev + points);
      
      // Activate overdrive if meter is full
      if (newValue >= 100) {
        activateOverdrive();
        return 0; // Reset meter
      }
      
      return newValue;
    });
  };

  // Activate overdrive mode
  const activateOverdrive = () => {
    setOverdriveActive(true);
    setOverdriveTimeRemaining(3); // 3 turns
    
    addBattleLog("⚡ OVERDRIVE MODE ACTIVATED! All abilities enhanced for 3 turns!", 'special');
    
    toast({
      title: "⚡ OVERDRIVE ACTIVATED!",
      description: "Your powers surge! All damage increased by 50% for 3 turns!",
      variant: "default",
    });
  };

  // Tick down overdrive turns
  const decrementOverdrive = () => {
    if (!overdriveActive) return;
    
    setOverdriveTimeRemaining(prev => {
      const newValue = prev - 1;
      
      if (newValue <= 0) {
        setOverdriveActive(false);
        addBattleLog("Overdrive mode has ended.", 'system');
        return 0;
      }
      
      return newValue;
    });
  };

  // Check for demon phase changes
  const checkDemonPhase = (debt: Debt) => {
    const healthPercent = debt.health;
    
    if (healthPercent <= 33 && !battleState.frenzyPhase) {
      setBattleState(prev => ({
        ...prev,
        ragePhase: false,
        frenzyPhase: true
      }));
      
      addBattleLog(`${debt.name} enters FRENZY phase! It becomes desperate and dangerous!`, 'phase-change');
      
      toast({
        title: "⚠️ DEMON FRENZY!",
        description: `${debt.name} has entered a frenzied state! Be careful!`,
        variant: "destructive",
      });
      
      return true;
    } else if (healthPercent <= 66 && !battleState.ragePhase && !battleState.frenzyPhase) {
      setBattleState(prev => ({
        ...prev,
        ragePhase: true,
        frenzyPhase: false
      }));
      
      addBattleLog(`${debt.name} enters RAGE phase! Its attacks grow stronger!`, 'phase-change');
      
      toast({
        title: "⚠️ DEMON ENRAGED!",
        description: `${debt.name} has become enraged! Its attacks grow stronger!`,
        variant: "destructive",
      });
      
      return true;
    }
    
    return false;
  };

  // Generate a random battle mission
  const generateBattleMission = (debt: Debt) => {
    const missionTypes = [
      {
        type: "damage",
        name: "Deal massive damage",
        goal: Math.ceil(debt.amount * 0.5),
        reward: "DemonCoin Bonus"
      },
      {
        type: "combo",
        name: "Reach combo chain",
        goal: Math.floor(3 + Math.random() * 4), // 3-6
        reward: "XP Boost"
      },
      {
        type: "turns",
        name: "Defeat quickly",
        goal: Math.floor(3 + Math.random() * 3), // 3-5
        reward: "Spirit Fragment"
      }
    ];
    
    const selectedMission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    
    setCurrentMission({
      type: selectedMission.type,
      goal: selectedMission.goal,
      reward: selectedMission.reward,
      progress: 0
    });
    
    addBattleLog(`Battle Mission: ${selectedMission.name} (${selectedMission.goal}) for ${selectedMission.reward}`, 'system');
  };

  // Update mission progress
  const updateMissionProgress = (type: string, amount: number) => {
    if (!currentMission || currentMission.type !== type) return;
    
    setCurrentMission(prev => {
      if (!prev) return null;
      
      const newProgress = prev.progress + amount;
      
      // Check if mission is completed
      if (newProgress >= prev.goal && prev.progress < prev.goal) {
        completeMission(prev.reward);
        
        return {
          ...prev,
          progress: newProgress
        };
      }
      
      return {
        ...prev,
        progress: newProgress
      };
    });
  };

  // Complete a mission and provide reward
  const completeMission = (reward: string) => {
    addBattleLog(`🎯 Battle Mission Complete! Reward: ${reward}`, 'system');
    
    toast({
      title: "Mission Complete!",
      description: `You've earned: ${reward}`,
      variant: "default",
    });
    
    // Apply rewards based on type
    switch (reward) {
      case "DemonCoin Bonus":
        // Will be handled by the battle component
        break;
      case "XP Boost":
        // Will be handled by the battle component
        break;
      case "Spirit Fragment":
        // Will be handled by the battle component
        break;
    }
  };

  // Add entry to battle log
  const addBattleLog = (message: string, type: 'attack' | 'special' | 'phase-change' | 'system') => {
    setBattleState(prev => ({
      ...prev,
      battleLog: [
        {
          id: uuidv4(),
          message,
          timestamp: Date.now(),
          type
        },
        ...prev.battleLog.slice(0, 19) // Keep only last 20 entries
      ]
    }));
  };

  // Get battle log
  const getBattleLog = () => battleState.battleLog;

  // Generate random loot based on enemy defeated
  const generateLoot = (debt: Debt): LootItem[] => {
    const lootPool: LootItem[] = [];
    
    // Basic loot everyone gets
    lootPool.push({
      type: 'Demon Seal',
      rarity: 'Common',
      name: 'Minor Seal',
      description: 'A basic demon seal with minimal power',
      value: Math.floor(debt.amount * 0.02)
    });
    
    // Chance for better loot based on debt amount
    const rarityRoll = Math.random();
    if (debt.amount > 10000 || rarityRoll > 0.85) {
      lootPool.push({
        type: 'Spirit Fragment',
        rarity: 'Rare',
        name: 'Concentrated Spirit',
        description: 'Adds power to your breathing techniques',
        value: 2,
        effect: 'Breathing power +10%'
      });
    } else if (debt.amount > 5000 || rarityRoll > 0.7) {
      lootPool.push({
        type: 'Skill Scroll',
        rarity: 'Uncommon',
        name: 'Fire Scroll',
        description: 'Ancient knowledge of combat techniques',
        value: 1,
        effect: 'Unlocks new special move'
      });
    }
    
    // Very rare loot
    if (rarityRoll > 0.95) {
      lootPool.push({
        type: 'Skill Scroll',
        rarity: 'Epic',
        name: 'Ancestral Breathing Technique',
        description: 'The secret technique passed down through generations',
        value: 5,
        effect: 'Permanent Overdrive gain +20%'
      });
    }
    
    return lootPool;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (comboTimeoutId) {
        clearTimeout(comboTimeoutId);
      }
    };
  }, [comboTimeoutId]);

  return {
    // Battle state
    battleState,
    inBattle: battleState.inBattle,
    currentDebtId: battleState.currentDebtId,
    ragePhase: battleState.ragePhase,
    frenzyPhase: battleState.frenzyPhase,
    
    // Combo system
    comboCount,
    comboMultiplier,
    
    // Stance system
    currentStance,
    stances: BATTLE_STANCES,
    
    // Overdrive system
    overdriveMeter,
    overdriveActive,
    overdriveTimeRemaining,
    
    // Battle missions
    currentMission,
    
    // Special techniques
    specialTechniques,
    
    // Methods
    startBattle,
    endBattle,
    switchStance,
    calculateAttackDamage,
    updateCombo,
    resetCombo,
    checkDemonPhase,
    gainOverdrive,
    decrementOverdrive,
    updateMissionProgress,
    addBattleLog,
    getBattleLog,
    generateLoot
  };
}
