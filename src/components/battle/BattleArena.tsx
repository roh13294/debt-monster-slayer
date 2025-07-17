import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Zap, Sword } from 'lucide-react';
import DebtMonster from '@/components/DebtMonster';
import { EnergyWave, AnimatedSlash, ElementalBurst, ScreenShake } from './BattleEffects';
import BattleControls from './BattleControls';
import BattleTips from './BattleTips';
import BattleNarrator from './BattleNarrator';
import NarrativeMoment from '@/components/journey/NarrativeMoment';
import LootDropCard from '@/components/battle/LootDropCard';
import { LootItem } from '@/types/battleTypes';

interface BattleArenaProps {
  stance: string | null;
  onComplete: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({ stance, onComplete }) => {
  const { debts, cash, damageMonster, specialMoves, useSpecialMove, playerTraits } = useGameContext();
  const [currentDebtIndex, setCurrentDebtIndex] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [battlePhase, setBattlePhase] = useState<'prepare' | 'battle' | 'result' | 'loot' | 'loot'>('prepare');
  const [battleResult, setBattleResult] = useState<'victory' | 'partial' | null>(null);
  const [showNarrative, setShowNarrative] = useState(true);
  const [narrativeChoice, setNarrativeChoice] = useState<string | null>(null);
  const [narrativeOptions, setNarrativeOptions] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(true);
  const [ragePhase, setRagePhase] = useState<boolean>(false);
  const [frenzyPhase, setFrenzyPhase] = useState<boolean>(false);
  const [narratorMessages, setNarratorMessages] = useState<string[]>([]);
  const [showSlash, setShowSlash] = useState<boolean>(false);
  const [showElementalBurst, setShowElementalBurst] = useState<boolean>(false);
  const [showScreenShake, setShowScreenShake] = useState<boolean>(false);
  const [lootDrops, setLootDrops] = useState<LootItem[]>([]);

  const currentDebt = debts.length > 0 ? debts[currentDebtIndex] : null;

  useEffect(() => {
    if (!currentDebt) return;

    if (currentDebt.health <= 66 && currentDebt.health > 33 && !ragePhase && !frenzyPhase) {
      setRagePhase(true);
      addNarratorMessage(`${currentDebt.name} enters RAGE phase! Attack power increases!`);
      setShowScreenShake(true);
    } else if (currentDebt.health <= 33 && !frenzyPhase) {
      setFrenzyPhase(true);
      setRagePhase(false);
      addNarratorMessage(`${currentDebt.name} enters FRENZY phase! Grows desperate and dangerous!`);
      setShowScreenShake(true);
    }

    let options: string[] = [];

    switch(stance) {
      case 'aggressive':
        options = [
          "I'll face this head on, with everything I have.",
          "This demon won't know what hit it.",
          "My strength grows with every challenge."
        ];
        break;
      case 'defensive':
        options = [
          "Patience and wisdom will guide my actions.",
          "A careful approach will reveal the path forward.",
          "Defense builds the foundation for lasting victory."
        ];
        break;
      case 'risky':
        options = [
          "Sometimes you have to gamble to get ahead.",
          "The greatest rewards often come with the greatest risks.",
          "Fortune favors the bold."
        ];
        break;
      default:
        options = [
          "I'll find the right approach for this challenge.",
          "Each demon requires a different strategy.",
          "I must adapt my technique to this opponent."
        ];
    }

    if (playerTraits.determination > 7) {
      options.push("No matter the odds, I will persevere.");
    }

    if (playerTraits.financialKnowledge > 7) {
      options.push("Understanding the patterns reveals the solution.");
    }

    const shuffled = options.sort(() => 0.5 - Math.random());
    setNarrativeOptions(shuffled.slice(0, 3));
  }, [currentDebt, stance, playerTraits, ragePhase, frenzyPhase]);

  const addNarratorMessage = (message: string) => {
    setNarratorMessages(prev => [message, ...prev]);
  };

  const handleDebtAttack = (amount: number) => {
    if (!currentDebt) return;

    setShowSlash(true);

    setTimeout(() => {
      setShowElementalBurst(true);
    }, 300);

    if (amount >= currentDebt.amount) {
      addNarratorMessage(`Massive strike obliterates ${currentDebt.name}!`);
    } else if (amount > currentDebt.amount * 0.5) {
      addNarratorMessage(`Powerful attack deals significant damage!`);
    } else {
      addNarratorMessage(`Your attack strikes ${currentDebt.name}!`);
    }

    setTimeout(() => {
      damageMonster(currentDebt.id, amount);

      if (amount >= currentDebt.amount) {
        generateLootDrops();

        if (currentDebtIndex < debts.length - 1) {
          setCurrentDebtIndex(currentDebtIndex + 1);
          setBattlePhase('prepare');
          setShowNarrative(true);
          setRagePhase(false);
          setFrenzyPhase(false);
        } else {
          setBattleResult('victory');
          setBattlePhase('loot');
        }
      } else {
        if (amount > currentDebt.amount * 0.3) {
          setBattleResult('partial');
          setBattlePhase('result');
        }
      }
    }, 1000);
  };

  const handleSpecialMove = () => {
    if (!currentDebt) return;

    setShowElementalBurst(true);
    addNarratorMessage(`You unleash a special technique on ${currentDebt.name}!`);

    setTimeout(() => {
      useSpecialMove('', currentDebt.id);
      addNarratorMessage(`${currentDebt.name}'s corruption aura weakens significantly!`);
    }, 800);
  };

  const handleNarrativeChoice = (choice: string) => {
    setNarrativeChoice(choice);
    setShowNarrative(false);
    addNarratorMessage(`Inner reflection: "${choice}"`);

    setTimeout(() => {
      setBattlePhase('battle');
    }, 500);
  };

  const handleNextEnemy = () => {
    if (currentDebtIndex < debts.length - 1) {
      setCurrentDebtIndex(currentDebtIndex + 1);
      setBattlePhase('prepare');
      setShowNarrative(true);
      setRagePhase(false);
      setFrenzyPhase(false);
    } else {
      onComplete();
    }
  };

  const handleFinishBattle = () => {
    onComplete();
  };

  const handleCloseTips = () => {
    setShowTips(false);
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
    setShowElementalBurst(false);
  };

  const handleShakeComplete = () => {
    setShowScreenShake(false);
  };

  const generateLootDrops = () => {
    if (!currentDebt) return;

    const rarityRoll = Math.random();
    let rarity: 'Common' | 'Rare' | 'Epic' = 'Common';

    if (rarityRoll > 0.95) rarity = 'Epic';
    else if (rarityRoll > 0.75) rarity = 'Rare';

    const lootPool: LootItem[] = [
      {
        type: 'Demon Seal',
        rarity,
        name: 'Prosperity Seal',
        description: 'Increases spirit energy by 5-15%',
        value: Math.floor(currentDebt.amount * 0.05)
      },
      {
        type: 'Spirit Fragment',
        rarity,
        name: 'Focus Fragment',
        description: 'Improves attack precision',
        value: 1
      },
      {
        type: 'Skill Scroll',
        rarity,
        name: 'Breathing Technique',
        description: 'Enhances your combat style',
        value: 1,
        effect: 'Stance power +5%'
      }
    ];

    if (currentDebt.amount > 10000) {
      lootPool.push({
        type: 'Skill Scroll',
        rarity: 'Rare',
        name: 'Demon Ward',
        description: 'Protects against future interest increases',
        value: 2,
        effect: 'Interest protection'
      });
    }

    setLootDrops(lootPool);
  };

  const handleCollectLoot = (selectedLoot: LootItem[]) => {
    addNarratorMessage(`You collected: ${selectedLoot[0].name}!`);

    setTimeout(() => {
      if (currentDebtIndex < debts.length - 1) {
        setCurrentDebtIndex(currentDebtIndex + 1);
        setBattlePhase('prepare');
        setShowNarrative(true);
      } else {
        handleFinishBattle();
      }
    }, 1500);
  };

  if (!currentDebt) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-slate-300">No demons to battle</h2>
        <p className="text-slate-400 mb-6">You have no debts to battle against. Well done!</p>
        <Button onClick={onComplete}>Continue Journey</Button>
      </div>
    );
  }

  const getElementType = () => {
    switch(stance) {
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
        isActive={showElementalBurst}
        onComplete={handleBurstComplete}
      />

      <ScreenShake
        isActive={showScreenShake}
        onComplete={handleShakeComplete}
      />

      <BattleNarrator 
        messageQueue={narratorMessages}
        onMessageShown={handleMessageProcessed}
      />

      <div className="relative z-10 container mx-auto py-10 px-4">
        <div className="mb-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 bg-slate-800 rounded-full mb-2 text-sm"
          >
            <span className="text-amber-400 font-medium">
              {stance === 'aggressive' && 'Flame Breathing Style'}
              {stance === 'defensive' && 'Water Breathing Style'}
              {stance === 'risky' && 'Thunder Breathing Style'}
              {!stance && 'Standard Stance'}
            </span>
          </motion.div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {battlePhase === 'prepare' && 'Prepare for Battle'}
            {battlePhase === 'battle' && (frenzyPhase ? '⚠️ Frenzy Phase' : ragePhase ? '⚠️ Rage Phase' : 'Demon Encounter!')}
            {battlePhase === 'result' && battleResult === 'victory' && 'Demon Defeated!'}
            {battlePhase === 'result' && battleResult === 'partial' && 'Demon Weakened'}
            {battlePhase === 'loot' && 'Victory Rewards'}
          </h1>

          <p className="text-slate-300 max-w-2xl mx-auto">
            {battlePhase === 'prepare' && 'Center your focus and prepare your spirit for the coming battle.'}
            {battlePhase === 'battle' && !ragePhase && !frenzyPhase && 'Channel your energy to strike at the demon\'s core.'}
            {battlePhase === 'battle' && ragePhase && 'The demon\'s attacks grow stronger as it becomes enraged!'}
            {battlePhase === 'battle' && frenzyPhase && 'The demon enters a desperate frenzy as its health dwindles!'}
            {battlePhase === 'result' && 'Your technique has proved effective, but the journey continues.'}
            {battlePhase === 'loot' && 'The demon\'s defeat has yielded valuable treasures. Choose your reward.'}
          </p>
        </div>

        {battlePhase === 'prepare' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <DebtMonster 
                debt={currentDebt} 
                isInBattle={true}
                onClick={() => {}}
              />
            </div>

            {showNarrative ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-slate-100 mb-4">Inner Reflection</h3>
                <p className="text-slate-300 mb-6 italic">
                  As you prepare to face this demon, what thoughts guide your approach?
                </p>

                <div className="space-y-3">
                  {narrativeOptions.map((option, index) => (
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
                  <div className="p-2 rounded-full bg-blue-900/30 border border-blue-800">
                    <Shield className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-slate-100 mb-1">Battle Preparation</h3>
                    <p className="text-slate-300 mb-2 italic">"{narrativeChoice}"</p>
                    <p className="text-sm text-slate-400">
                      Your mindset shapes your approach to this battle, influencing your technique and effectiveness.
                    </p>

                    <Button 
                      onClick={() => setBattlePhase('battle')}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    >
                      Begin Battle
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {showTips && <BattleTips stance={stance} onClose={handleCloseTips} />}
          </motion.div>
        )}

        {battlePhase === 'battle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <DebtMonster 
                debt={currentDebt} 
                isInBattle={true}
                ragePhase={ragePhase}
                frenzyPhase={frenzyPhase}
                onClick={() => {}}
              />

              <div className="mt-4">
                <NarrativeMoment 
                  type="battle" 
                  context={{ 
                    debt: currentDebt, 
                    stance,
                    ragePhase,
                    frenzyPhase 
                  }} 
                  onDismiss={() => {}}
                />
              </div>
            </div>

            <div>
              <BattleControls
                debt={currentDebt}
                stance={stance}
                cash={cash}
                specialMoves={specialMoves.length}
                onAttack={handleDebtAttack}
                onSpecialMove={handleSpecialMove}
              />
            </div>
          </motion.div>
        )}

        {battlePhase === 'result' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            {battleResult === 'victory' ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-900/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Sword className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-2">Demon Defeated!</h2>
                  <p className="text-slate-300">
                    You've successfully vanquished {currentDebt.name}, freeing yourself from its binding curse.
                  </p>
                </div>

                <NarrativeMoment type="victory" context={{ debt: currentDebt, stance }} onDismiss={() => {}} />

                <div className="mt-6">
                  {currentDebtIndex < debts.length - 1 ? (
                    <Button 
                      onClick={handleNextEnemy}
                      className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600"
                    >
                      <Sword className="w-5 h-5 mr-2" />
                      Face Next Demon
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinishBattle}
                      className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    >
                      Complete Monthly Battles
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-8">
                <div className="mb-6">
                  <div className="w-20 h-20 rounded-full bg-amber-900/20 border-2 border-amber-500 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-amber-400 mb-2">Demon Weakened</h2>
                  <p className="text-slate-300">
                    You've damaged {currentDebt.name}, but it still lingers. Your consistent attacks will eventually prevail.
                  </p>
                </div>

                <NarrativeMoment type="decision" context={{ debt: currentDebt, stance }} onDismiss={() => {}} />

                <div className="mt-6">
                  {currentDebtIndex < debts.length - 1 ? (
                    <Button 
                      onClick={handleNextEnemy}
                      className="px-8 py-6 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
                    >
                      <Sword className="w-5 h-5 mr-2" />
                      Face Next Demon
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinishBattle}
                      className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    >
                      Complete Monthly Battles
                    </Button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {battlePhase === 'loot' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <LootDropCard
              loot={lootDrops}
              onCollect={handleCollectLoot}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BattleArena;
