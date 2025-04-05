
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sword, Flame, Shield, Zap } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

type StanceType = 'slash' | 'defend' | 'surge' | null;

const MonthlyEncounter: React.FC = () => {
  const { 
    advanceMonth, 
    playerName, 
    playerTraits, 
    updatePlayerTrait,
    generateLifeEvent,
    cash,
    setCash,
    budget
  } = useGameContext();
  
  const [showEncounter, setShowEncounter] = useState(false);
  const [encounterStage, setEncounterStage] = useState<'intro' | 'stance' | 'result'>('intro');
  const [selectedStance, setSelectedStance] = useState<StanceType>(null);
  const [stanceEffects, setStanceEffects] = useState<{
    description: string;
    traitChanges?: {[key: string]: number};
    cashBonus?: number;
  } | null>(null);
  
  // Open the monthly encounter dialog
  const startEncounter = () => {
    setShowEncounter(true);
    setEncounterStage('intro');
    setSelectedStance(null);
    setStanceEffects(null);
  };
  
  // Close the dialog and reset state
  const closeEncounter = () => {
    setShowEncounter(false);
    // If the player completed the encounter, actually advance the month
    if (encounterStage === 'result') {
      advanceMonth();
      // 50% chance to trigger a life event after month advance
      if (Math.random() > 0.5) {
        setTimeout(() => {
          generateLifeEvent();
        }, 1000);
      }
    }
  };
  
  // Proceed to stance selection
  const proceedToStance = () => {
    setEncounterStage('stance');
  };
  
  // Select a stance and see the results
  const selectStance = (stance: StanceType) => {
    setSelectedStance(stance);
    
    // Calculate effects based on stance and player traits
    let effects: {
      description: string;
      traitChanges?: {[key: string]: number};
      cashBonus?: number;
    } = { description: "" };
    
    if (stance === 'slash') {
      // Offensive stance - high risk, high reward
      const slashSuccess = Math.random() < (playerTraits.courage / 10); // Courage affects success chance
      
      if (slashSuccess) {
        effects = {
          description: "Your decisive attack was successful! Your courage grows, and you find unexpected money.",
          traitChanges: { courage: 0.5 },
          cashBonus: Math.round(budget.income * 0.1) // 10% of monthly income as bonus
        };
      } else {
        effects = {
          description: "Your attack was too hasty. While you gained some discipline, you lost some cash in the process.",
          traitChanges: { discipline: 0.3, courage: -0.2 },
          cashBonus: -Math.round(budget.essentials * 0.05) // Lose 5% of monthly expenses
        };
      }
    } 
    else if (stance === 'defend') {
      // Defensive stance - safe, modest benefits
      effects = {
        description: "Your cautious approach pays off. You've strengthened your finances and gained discipline.",
        traitChanges: { discipline: 0.4 },
        cashBonus: Math.round(budget.savings * 0.5) // 50% of monthly savings as bonus
      };
    } 
    else if (stance === 'surge') {
      // Emotional stance - unpredictable
      const surgeResult = Math.random();
      
      if (surgeResult > 0.7) {
        effects = {
          description: "Your emotional surge creates a brilliant opportunity! Your wisdom grows significantly.",
          traitChanges: { wisdom: 0.7 },
          cashBonus: Math.round(budget.income * 0.15) // 15% of monthly income as bonus
        };
      } else if (surgeResult > 0.3) {
        effects = {
          description: "Your emotional approach has mixed results. You gain some wisdom but at a small cost.",
          traitChanges: { wisdom: 0.3 },
          cashBonus: -Math.round(budget.essentials * 0.03) // Lose 3% of monthly expenses
        };
      } else {
        effects = {
          description: "Your emotions led you astray this time. You've learned a lesson, but at a cost.",
          traitChanges: { wisdom: 0.2, courage: -0.2 },
          cashBonus: -Math.round(budget.essentials * 0.1) // Lose 10% of monthly expenses
        };
      }
    }
    
    setStanceEffects(effects);
    setEncounterStage('result');
    
    // Apply effects
    if (effects.traitChanges) {
      Object.entries(effects.traitChanges).forEach(([trait, change]) => {
        updatePlayerTrait(trait as keyof typeof playerTraits, playerTraits[trait as keyof typeof playerTraits] + change);
      });
    }
    
    if (effects.cashBonus) {
      setCash(prev => Math.max(0, prev + effects.cashBonus!));
      
      if (effects.cashBonus > 0) {
        toast({
          title: "Cash Bonus!",
          description: `You gained $${effects.cashBonus} from your approach.`,
          variant: "default",
        });
      } else if (effects.cashBonus < 0) {
        toast({
          title: "Cash Lost",
          description: `You lost $${Math.abs(effects.cashBonus)} from your approach.`,
          variant: "default",
        });
      }
    }
  };
  
  // Get breathing technique info based on traits
  const getBreathingStyle = () => {
    const { discipline, courage, wisdom } = playerTraits;
    
    if (discipline > courage && discipline > wisdom) {
      return { 
        name: "Water Breathing", 
        description: "A defensive style that focuses on flowing movements and adaptability.",
        color: "blue"
      };
    } else if (courage > discipline && courage > wisdom) {
      return { 
        name: "Flame Breathing", 
        description: "An aggressive style that emphasizes power and offensive strikes.",
        color: "red"
      };
    } else {
      return { 
        name: "Thunder Breathing", 
        description: "A tactical style that balances speed and precision for optimal results.",
        color: "purple"
      };
    }
  };
  
  const breathingStyle = getBreathingStyle();
  
  return (
    <>
      {/* Trigger button */}
      <Button 
        onClick={startEncounter} 
        className="oni-button w-full group"
      >
        <Flame className="w-4 h-4 mr-2 group-hover:animate-flame-pulse text-amber-200" />
        Advance to Next Month
        <Sword className="w-4 h-4 ml-2 group-hover:animate-sword-draw" />
      </Button>
      
      {/* Encounter Dialog */}
      <Dialog open={showEncounter} onOpenChange={setShowEncounter}>
        <DialogContent className="bg-night-sky border-demon-red/30 max-w-3xl p-0 overflow-hidden">
          <div className="relative w-full h-[60vh] flex flex-col">
            {/* Background effects */}
            <div className="absolute inset-0 bg-night-sky">
              {/* Animated moon */}
              <motion.div 
                className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/80 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
              
              {/* Mist effects */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-misty-mountains"></div>
              
              {/* Kanji background */}
              <div className="absolute inset-0 kanji-bg opacity-10"></div>
            </div>
            
            {/* Content based on current stage */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-white">
              <AnimatePresence mode="wait">
                {encounterStage === 'intro' && (
                  <motion.div
                    key="intro"
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent mb-6">
                      A New Moon Rises
                    </h2>
                    
                    <motion.div 
                      className={`w-24 h-24 mb-6 rounded-full flex items-center justify-center`}
                      initial={{ scale: 0.8 }}
                      animate={{ 
                        scale: 1.1,
                        boxShadow: [
                          '0 0 10px rgba(255,45,85,0.4)',
                          '0 0 20px rgba(255,45,85,0.6)',
                          '0 0 10px rgba(255,45,85,0.4)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-demon-red/60 to-demon-gold/30 rounded-full flex items-center justify-center">
                        <Sword className="w-12 h-12 text-white" />
                      </div>
                    </motion.div>
                    
                    <p className="text-lg text-white/90 mb-4">
                      The demons stir as dawn breaks over the financial dojo.
                    </p>
                    
                    <p className="text-lg text-white/90 mb-6">
                      <span className="font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent">{playerName}</span>, 
                      master of <span className={`font-bold text-demon-${breathingStyle.color}`}>{breathingStyle.name}</span>, 
                      prepares for a new day of battle.
                    </p>
                    
                    <Button onClick={proceedToStance} className="mt-4 bg-gradient-to-r from-demon-red to-demon-gold hover:opacity-90 text-white">
                      Prepare Your Stance
                    </Button>
                  </motion.div>
                )}
                
                {encounterStage === 'stance' && (
                  <motion.div
                    key="stance"
                    className="flex flex-col items-center text-center w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent mb-6">
                      Choose Your Approach
                    </h2>
                    
                    <p className="text-lg text-white/80 mb-6">
                      How will you face this month's financial challenges?
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                      {/* Offensive Stance */}
                      <motion.div
                        className="stance-card bg-gradient-to-b from-demon-red/20 to-black/40 border border-demon-red/30 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-demon-red/80"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(255,45,85,0.3)' }}
                        onClick={() => selectStance('slash')}
                      >
                        <div className="w-16 h-16 rounded-full bg-demon-red/20 flex items-center justify-center mb-3">
                          <Sword className="w-8 h-8 text-demon-red" />
                        </div>
                        <h3 className="text-xl font-bold text-demon-red mb-2">Slash Now</h3>
                        <p className="text-sm text-white/70">
                          Take an aggressive approach. High risk, high reward.
                        </p>
                        <p className="text-xs text-demon-red/80 mt-2">
                          Relies on Courage
                        </p>
                      </motion.div>
                      
                      {/* Defensive Stance */}
                      <motion.div
                        className="stance-card bg-gradient-to-b from-demon-blue/20 to-black/40 border border-demon-blue/30 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-demon-blue/80"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(14,165,233,0.3)' }}
                        onClick={() => selectStance('defend')}
                      >
                        <div className="w-16 h-16 rounded-full bg-demon-blue/20 flex items-center justify-center mb-3">
                          <Shield className="w-8 h-8 text-demon-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-demon-blue mb-2">Brace & Save</h3>
                        <p className="text-sm text-white/70">
                          Take a defensive approach. Safe, modest benefits.
                        </p>
                        <p className="text-xs text-demon-blue/80 mt-2">
                          Relies on Discipline
                        </p>
                      </motion.div>
                      
                      {/* Emotional Stance */}
                      <motion.div
                        className="stance-card bg-gradient-to-b from-demon-purple/20 to-black/40 border border-demon-purple/30 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-demon-purple/80"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 15px rgba(94,23,235,0.3)' }}
                        onClick={() => selectStance('surge')}
                      >
                        <div className="w-16 h-16 rounded-full bg-demon-purple/20 flex items-center justify-center mb-3">
                          <Zap className="w-8 h-8 text-demon-purple" />
                        </div>
                        <h3 className="text-xl font-bold text-demon-purple mb-2">Emotion Surge</h3>
                        <p className="text-sm text-white/70">
                          Follow your instincts. Unpredictable outcomes.
                        </p>
                        <p className="text-xs text-demon-purple/80 mt-2">
                          Relies on Wisdom
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {encounterStage === 'result' && stanceEffects && (
                  <motion.div
                    key="result"
                    className="flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent mb-6">
                      {selectedStance === 'slash' ? 'Your Attack Lands!' : 
                       selectedStance === 'defend' ? 'Your Defense Holds Strong!' : 
                       'Your Spirit Surges!'}
                    </h2>
                    
                    {/* Visual effect based on stance */}
                    <motion.div 
                      className={`w-32 h-32 mb-6 rounded-full flex items-center justify-center
                        ${selectedStance === 'slash' ? 'bg-gradient-to-br from-demon-red/40 to-demon-ember/20' : 
                          selectedStance === 'defend' ? 'bg-gradient-to-br from-demon-blue/40 to-demon-teal/20' : 
                          'bg-gradient-to-br from-demon-purple/40 to-demon-indigo/20'}`}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                        boxShadow: [
                          '0 0 10px rgba(255,255,255,0.2)',
                          '0 0 30px rgba(255,255,255,0.5)',
                          '0 0 10px rgba(255,255,255,0.2)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="w-24 h-24 rounded-full flex items-center justify-center">
                        {selectedStance === 'slash' ? 
                          <Sword className="w-12 h-12 text-demon-red" /> : 
                          selectedStance === 'defend' ? 
                          <Shield className="w-12 h-12 text-demon-blue" /> : 
                          <Zap className="w-12 h-12 text-demon-purple" />
                        }
                      </div>
                    </motion.div>
                    
                    <p className="text-lg text-white/90 mb-6">
                      {stanceEffects.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {stanceEffects.traitChanges && (
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <h3 className="text-lg font-medium text-white/90 mb-2">Traits Changed</h3>
                          {Object.entries(stanceEffects.traitChanges).map(([trait, change]) => (
                            <p key={trait} className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trait.charAt(0).toUpperCase() + trait.slice(1)}: {change > 0 ? '+' : ''}{change}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      {stanceEffects.cashBonus !== undefined && (
                        <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                          <h3 className="text-lg font-medium text-white/90 mb-2">Cash Impact</h3>
                          <p className={`text-xl font-bold ${stanceEffects.cashBonus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stanceEffects.cashBonus >= 0 ? '+' : '-'}${Math.abs(stanceEffects.cashBonus)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Button onClick={closeEncounter} className="mt-4 bg-gradient-to-r from-demon-blue to-demon-purple hover:opacity-90 text-white">
                      Begin Your Month
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyEncounter;
