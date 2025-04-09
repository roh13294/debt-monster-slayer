
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Zap, Gift, Award, X } from 'lucide-react';
import DebtMonster from '@/components/DebtMonster';
import { toast } from '@/hooks/use-toast';
import DemonCoin from '@/components/ui/DemonCoin';

interface DemonRunProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RunReward {
  id: string;
  name: string;
  description: string;
  type: 'coin' | 'buff' | 'relic';
  value: number;
  icon: React.ReactNode;
}

interface RunEnemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  monsterType: string;
}

const DemonRun: React.FC<DemonRunProps> = ({ isOpen, onClose }) => {
  const { cash, setCash, playerTraits, updatePlayerTrait } = useGameContext();
  
  const [stage, setStage] = useState<'intro' | 'battle' | 'reward' | 'complete' | 'defeat'>('intro');
  const [currentEnemyIndex, setCurrentEnemyIndex] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [runEnemies, setRunEnemies] = useState<RunEnemy[]>([]);
  const [runRewards, setRunRewards] = useState<RunReward[]>([]);
  const [selectedReward, setSelectedReward] = useState<RunReward | null>(null);
  const [playerBuffs, setPlayerBuffs] = useState<string[]>([]);
  const [runRank, setRunRank] = useState<'bronze' | 'silver' | 'gold' | null>(null);
  const [attackPower, setAttackPower] = useState(15);

  // Generate a random run of enemies
  useEffect(() => {
    if (isOpen) {
      generateRunEnemies();
      setStage('intro');
      setPlayerHealth(100);
      setCurrentEnemyIndex(0);
      setPlayerBuffs([]);
      setAttackPower(15);
    }
  }, [isOpen]);

  const generateRunEnemies = () => {
    const monsterTypes = ['fire', 'water', 'earth', 'shadow', 'thunder'];
    const enemyCount = 3 + Math.floor(Math.random() * 2); // 3-4 enemies
    
    const enemies = Array.from({ length: enemyCount }, (_, i) => {
      const monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
      
      return {
        id: `enemy-${i}`,
        name: `${monsterType.charAt(0).toUpperCase() + monsterType.slice(1)} Demon ${i+1}`,
        health: 70 + Math.floor(Math.random() * 50), // 70-120 health
        maxHealth: 70 + Math.floor(Math.random() * 50),
        damage: 10 + Math.floor(Math.random() * 10), // 10-20 damage
        monsterType
      };
    });
    
    setRunEnemies(enemies);
  };

  const generateRewards = () => {
    const possibleRewards: RunReward[] = [
      {
        id: 'coin-bonus',
        name: 'DemonCoin Cache',
        description: 'Gain 300 DemonCoins immediately',
        type: 'coin',
        value: 300,
        icon: <DemonCoin size="sm" />
      },
      {
        id: 'attack-buff',
        name: 'Sharpened Edge',
        description: '+20% attack power for next battle',
        type: 'buff',
        value: 20,
        icon: <Sword className="w-5 h-5 text-red-500" />
      },
      {
        id: 'defense-relic',
        name: 'Demon Ward',
        description: 'Reduce damage taken by 15% for the remainder of this run',
        type: 'relic',
        value: 15,
        icon: <Shield className="w-5 h-5 text-blue-500" />
      }
    ];
    
    // Shuffle and pick 3
    const shuffled = [...possibleRewards].sort(() => 0.5 - Math.random());
    setRunRewards(shuffled.slice(0, 3));
  };

  const startRun = () => {
    setStage('battle');
  };

  const attackEnemy = () => {
    if (runEnemies.length === 0) return;
    
    const currentEnemy = runEnemies[currentEnemyIndex];
    let damage = attackPower;
    
    // Apply buffs
    if (playerBuffs.includes('attack-buff')) {
      damage = damage * 1.2;
    }
    
    const updatedEnemies = [...runEnemies];
    updatedEnemies[currentEnemyIndex] = {
      ...currentEnemy,
      health: Math.max(0, currentEnemy.health - damage)
    };
    
    setRunEnemies(updatedEnemies);
    
    // Check if enemy is defeated
    if (updatedEnemies[currentEnemyIndex].health <= 0) {
      // Move to next enemy or rewards
      if (currentEnemyIndex < updatedEnemies.length - 1) {
        setTimeout(() => {
          setCurrentEnemyIndex(currentEnemyIndex + 1);
          generateRewards();
          setStage('reward');
        }, 1000);
      } else {
        // Run complete
        setTimeout(() => {
          completeRun();
        }, 1000);
      }
    } else {
      // Enemy attacks back
      setTimeout(() => {
        let enemyDamage = currentEnemy.damage;
        
        // Apply defense buffs
        if (playerBuffs.includes('defense-relic')) {
          enemyDamage = enemyDamage * 0.85;
        }
        
        setPlayerHealth(Math.max(0, playerHealth - enemyDamage));
        
        // Check if player is defeated
        if (playerHealth - enemyDamage <= 0) {
          setStage('defeat');
        }
      }, 500);
    }
  };

  const selectReward = (reward: RunReward) => {
    setSelectedReward(reward);
    
    switch (reward.type) {
      case 'coin':
        setCash(cash + reward.value);
        toast({
          title: "Reward Claimed",
          description: `You gained ${reward.value} DemonCoins!`,
          variant: "default",
        });
        break;
      case 'buff':
        setPlayerBuffs([...playerBuffs, reward.id]);
        setAttackPower(attackPower * (1 + reward.value/100));
        toast({
          title: "Battle Buff Gained",
          description: reward.description,
          variant: "default",
        });
        break;
      case 'relic':
        setPlayerBuffs([...playerBuffs, reward.id]);
        toast({
          title: "Relic Acquired",
          description: reward.description,
          variant: "default",
        });
        break;
    }
    
    // Continue to next battle
    setStage('battle');
  };

  const completeRun = () => {
    // Determine rank based on remaining health
    let rank: 'bronze' | 'silver' | 'gold';
    
    if (playerHealth >= 80) {
      rank = 'gold';
      setCash(cash + 500);
    } else if (playerHealth >= 50) {
      rank = 'silver';
      setCash(cash + 300);
    } else {
      rank = 'bronze';
      setCash(cash + 150);
    }
    
    setRunRank(rank);
    setStage('complete');
    
    // Update player traits
    updatePlayerTrait('determination', playerTraits.determination + 0.5);
  };

  const currentEnemy = runEnemies[currentEnemyIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-slate-900 p-0 border-slate-700">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950">
            <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5"></div>
          </div>
          
          <div className="relative z-10 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sword className="w-6 h-6 text-red-500" />
                <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                  Gauntlet of Demons
                </span>
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {stage === 'intro' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-red-900/30 border border-red-700 rounded-full flex items-center justify-center mx-auto">
                    <Sword className="h-10 w-10 text-red-500" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-2">
                  Demon Gauntlet Challenge
                </h3>
                
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Face a series of {runEnemies.length} demons in sequence without rest. 
                  Defeat each one to earn rewards and prove your skills as a Slayer.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Challenge Rules:</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>• Your health won't recover between battles</li>
                    <li>• Choose one reward after each victory</li>
                    <li>• Better performance earns higher rank rewards</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={startRun}
                  className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 px-6 py-6"
                >
                  <Sword className="mr-2 h-5 w-5" />
                  Begin Challenge
                </Button>
              </motion.div>
            )}
            
            {stage === 'battle' && currentEnemy && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4 p-3 bg-slate-800/60 rounded-lg">
                    <h3 className="font-medium text-slate-200 mb-2">Battle {currentEnemyIndex + 1} of {runEnemies.length}</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-400">Your Health</p>
                        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${playerHealth}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-300">{playerHealth}/100</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-slate-400">Enemy Health</p>
                        <div className="w-full bg-slate-700 rounded-full h-2.5 mb-1">
                          <div 
                            className="bg-red-600 h-2.5 rounded-full"
                            style={{ 
                              width: `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-300">
                          {currentEnemy.health}/{currentEnemy.maxHealth}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/60 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-slate-200 mb-2">Active Buffs</h3>
                    {playerBuffs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {playerBuffs.includes('attack-buff') && (
                          <div className="px-2 py-1 bg-red-900/50 text-red-300 rounded text-xs flex items-center">
                            <Sword className="w-3 h-3 mr-1" />
                            +20% Attack
                          </div>
                        )}
                        {playerBuffs.includes('defense-relic') && (
                          <div className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs flex items-center">
                            <Shield className="w-3 h-3 mr-1" />
                            -15% Damage
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No active buffs</p>
                    )}
                  </div>
                  
                  <div className="p-4 bg-slate-800/60 rounded-lg">
                    <div className="flex justify-center">
                      <DebtMonster 
                        debt={{
                          id: currentEnemy.id,
                          name: currentEnemy.name,
                          balance: currentEnemy.health,
                          interestRate: 0,
                          minimumPayment: 0,
                          psychologicalImpact: 0,
                          amount: currentEnemy.maxHealth,
                          interest: 0,
                          health: (currentEnemy.health / currentEnemy.maxHealth) * 100,
                          monsterType: currentEnemy.monsterType
                        }} 
                        isInBattle={true}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-slate-100 mb-3">
                      {currentEnemy.name}
                    </h3>
                    <p className="text-slate-300 mb-4">
                      A fearsome demon blocking your path. It will attack for {currentEnemy.damage} damage after your strike.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/70 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Battle Stats</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">Your Attack:</span>{' '}
                          <span className="text-red-400">{attackPower.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Enemy Attack:</span>{' '}
                          <span className="text-red-400">{currentEnemy.damage}</span>
                        </div>
                      </div>
                    </div>
                    
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={attackEnemy}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 flex items-center justify-center gap-2 py-6"
                      >
                        <Sword className="w-5 h-5" />
                        <span className="text-lg">Attack Demon</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}
            
            {stage === 'reward' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-4"
              >
                <h3 className="text-xl font-bold text-amber-400 mb-4">
                  Victory! Choose Your Reward
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {runRewards.map((reward) => (
                    <motion.div 
                      key={reward.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-800/80"
                      onClick={() => selectReward(reward)}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
                        {reward.icon}
                      </div>
                      <h4 className="font-medium text-slate-200 mb-1">{reward.name}</h4>
                      <p className="text-xs text-slate-400">{reward.description}</p>
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-sm text-slate-400">
                  Your next opponent awaits! Choose wisely.
                </p>
              </motion.div>
            )}
            
            {stage === 'complete' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-amber-900/30 border border-amber-700 rounded-full flex items-center justify-center mx-auto">
                    <Award className="h-10 w-10 text-amber-500" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-amber-400 mb-2">
                  Gauntlet Complete!
                </h3>
                
                <div className="mb-6">
                  <p className="text-lg text-slate-200 mb-1">
                    Rank: {' '}
                    <span className={
                      runRank === 'gold' ? 'text-amber-400' : 
                      runRank === 'silver' ? 'text-slate-300' : 
                      'text-amber-700'
                    }>
                      {runRank?.toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm text-slate-400">
                    You completed the challenge with {playerHealth}% health remaining.
                  </p>
                </div>
                
                <div className="mb-6 p-4 bg-slate-800/60 rounded-lg max-w-xs mx-auto">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Rewards Earned:</h4>
                  <div className="flex items-center justify-center gap-2">
                    <DemonCoin 
                      amount={runRank === 'gold' ? 500 : runRank === 'silver' ? 300 : 150} 
                      size="md" 
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    +0.5 Determination trait
                  </p>
                </div>
                
                <Button 
                  onClick={onClose}
                  variant="default"
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Return to Journey
                </Button>
              </motion.div>
            )}
            
            {stage === 'defeat' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <div className="mb-6">
                  <div className="w-20 h-20 bg-red-900/30 border border-red-700 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-10 w-10 text-red-500" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  Challenge Failed
                </h3>
                
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  The demons proved too powerful this time, but a true Slayer never gives up.
                  Return when you've strengthened your techniques.
                </p>
                
                <div className="mb-6 p-4 bg-slate-800/60 rounded-lg max-w-xs mx-auto">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Consolation Reward:</h4>
                  <div className="flex items-center justify-center gap-2">
                    <DemonCoin amount={50} size="md" />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    For your valiant effort
                  </p>
                </div>
                
                <Button 
                  onClick={onClose}
                  variant="default"
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Return to Journey
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemonRun;
