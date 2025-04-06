
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../context/GameContext';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sword, Flame, Shield, Zap, Wind, Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import AnimeAvatar from './AnimeAvatar';

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
    budget,
    specialMoves,
    setSpecialMoves
  } = useGameContext();
  
  const [showEncounter, setShowEncounter] = useState(false);
  const [encounterStage, setEncounterStage] = useState<'intro' | 'stance' | 'result'>('intro');
  const [selectedStance, setSelectedStance] = useState<StanceType>(null);
  const [stanceEffects, setStanceEffects] = useState<{
    description: string;
    traitChanges?: {[key: string]: number};
    cashBonus?: number;
    specialMoveBonus?: number;
  } | null>(null);
  
  // Visual enhancements
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState(false);
  const [dialogSize, setDialogSize] = useState<'normal' | 'expanded'>('normal');
  
  // Sound effects
  const playSound = (soundType: 'intro' | 'stance' | 'result' | 'success' | 'failure') => {
    // Sound would be implemented here in a full implementation
    console.log(`Playing ${soundType} sound`);
  };
  
  const startEncounter = () => {
    setShowEncounter(true);
    setEncounterStage('intro');
    setSelectedStance(null);
    setStanceEffects(null);
    setFloatingParticles(true);
    setDialogSize('normal');
    playSound('intro');
    
    // Start intro animation
    setAnimationPlaying(true);
    setTimeout(() => setAnimationPlaying(false), 1000);
  };
  
  const closeEncounter = () => {
    setShowEncounter(false);
    setFloatingParticles(false);
    
    if (encounterStage === 'result') {
      advanceMonth();
      if (Math.random() > 0.5) {
        setTimeout(() => {
          generateLifeEvent();
        }, 1000);
      }
    }
  };
  
  const proceedToStance = () => {
    setEncounterStage('stance');
    setDialogSize('expanded');
    playSound('stance');
    setAnimationPlaying(true);
    setTimeout(() => setAnimationPlaying(false), 800);
  };
  
  const selectStance = (stance: StanceType) => {
    setSelectedStance(stance);
    setAnimationPlaying(true);
    playSound('stance');
    
    let effects: {
      description: string;
      traitChanges?: {[key: string]: number};
      cashBonus?: number;
      specialMoveBonus?: number;
    } = { description: "" };
    
    if (stance === 'slash') {
      const slashSuccess = Math.random() < (playerTraits.courage / 10);
      
      if (slashSuccess) {
        effects = {
          description: "Your decisive strike was successful! Your courage grows, and you find unexpected money.",
          traitChanges: { courage: 0.5 },
          cashBonus: Math.round(budget.income * 0.15)
        };
        playSound('success');
      } else {
        effects = {
          description: "Your attack was too hasty. While you gained some discipline, you lost some cash in the process.",
          traitChanges: { discipline: 0.3, courage: -0.2 },
          cashBonus: -Math.round(budget.essentials * 0.05)
        };
        playSound('failure');
      }
    } 
    else if (stance === 'defend') {
      const defenseBonus = Math.random() < 0.8 ? 1 : 2; // 20% chance of critical defense
      
      effects = {
        description: `Your defensive stance pays off${defenseBonus > 1 ? ' brilliantly' : ''}. You've strengthened your finances and gained discipline.`,
        traitChanges: { discipline: 0.4 * defenseBonus },
        cashBonus: Math.round(budget.savings * 0.5 * defenseBonus),
        specialMoveBonus: defenseBonus > 1 ? 1 : 0
      };
      playSound(defenseBonus > 1 ? 'success' : 'stance');
    } 
    else if (stance === 'surge') {
      const surgeResult = Math.random();
      
      if (surgeResult > 0.7) {
        effects = {
          description: "Your emotional surge creates a brilliant opportunity! Your wisdom grows significantly.",
          traitChanges: { wisdom: 0.7 },
          cashBonus: Math.round(budget.income * 0.20),
          specialMoveBonus: 1
        };
        playSound('success');
      } else if (surgeResult > 0.3) {
        effects = {
          description: "Your emotional approach has mixed results. You gain some wisdom but at a small cost.",
          traitChanges: { wisdom: 0.3 },
          cashBonus: -Math.round(budget.essentials * 0.03)
        };
        playSound('stance');
      } else {
        effects = {
          description: "Your emotions led you astray this time. You've learned a lesson, but at a cost.",
          traitChanges: { wisdom: 0.2, courage: -0.2 },
          cashBonus: -Math.round(budget.essentials * 0.1)
        };
        playSound('failure');
      }
    }
    
    setStanceEffects(effects);
    
    // Delayed transition to result for animation
    setTimeout(() => {
      setEncounterStage('result');
      setAnimationPlaying(false);
      
      if (effects.traitChanges) {
        Object.entries(effects.traitChanges).forEach(([trait, change]) => {
          updatePlayerTrait(trait as keyof typeof playerTraits, playerTraits[trait as keyof typeof playerTraits] + change);
        });
      }
      
      if (effects.cashBonus !== undefined) {
        const newCashValue = Math.max(0, cash + effects.cashBonus);
        setCash(newCashValue);
        
        if (effects.cashBonus > 0) {
          toast({
            title: "💰 Cash Bonus!",
            description: `You gained $${effects.cashBonus} from your approach.`,
            variant: "default",
          });
        } else if (effects.cashBonus < 0) {
          toast({
            title: "💸 Cash Lost",
            description: `You lost $${Math.abs(effects.cashBonus)} from your approach.`,
            variant: "default",
          });
        }
      }
      
      if (effects.specialMoveBonus && effects.specialMoveBonus > 0) {
        setSpecialMoves(specialMoves + effects.specialMoveBonus);
        toast({
          title: "✨ Special Move Gained!",
          description: `You gained ${effects.specialMoveBonus} special move from your brilliant strategy!`,
          variant: "default",
        });
      }
    }, 1200);
  };
  
  const getBreathingStyle = () => {
    const { discipline, courage, wisdom } = playerTraits;
    
    if (discipline > courage && discipline > wisdom) {
      return { 
        name: "Water Breathing", 
        description: "A defensive style that focuses on flowing movements and adaptability.",
        color: "blue",
        icon: <Shield className="w-4 h-4" />
      };
    } else if (courage > discipline && courage > wisdom) {
      return { 
        name: "Flame Breathing", 
        description: "An aggressive style that emphasizes power and offensive strikes.",
        color: "red",
        icon: <Flame className="w-4 h-4" />
      };
    } else {
      return { 
        name: "Thunder Breathing", 
        description: "A tactical style that balances speed and precision for optimal results.",
        color: "purple",
        icon: <Zap className="w-4 h-4" />
      };
    }
  };
  
  const breathingStyle = getBreathingStyle();
  
  // Generate floating particles for visual effect
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 10 + 5
  }));
  
  return (
    <>
      <Button 
        onClick={startEncounter} 
        className="oni-button w-full group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-demon-red/30 to-demon-gold/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Flame className="w-4 h-4 mr-2 group-hover:animate-flame-pulse text-amber-200" />
        <span className="relative z-10">Begin Next Cycle</span>
        <Sword className="w-4 h-4 ml-2 group-hover:animate-sword-draw" />
      </Button>
      
      <Dialog open={showEncounter} onOpenChange={setShowEncounter}>
        <DialogContent className={`bg-night-sky border-demon-red/30 p-0 overflow-hidden ${
          dialogSize === 'expanded' ? 'max-w-4xl' : 'max-w-3xl'
        } transition-all duration-500`}>
          <div className="relative w-full h-[70vh] flex flex-col">
            {/* Dynamic background */}
            <div className="absolute inset-0 bg-night-sky">
              <motion.div 
                className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/80 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                initial={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: 0.8, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
              />
              
              {/* Floating particles for magical effect */}
              {floatingParticles && particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className={`absolute rounded-full bg-${breathingStyle.color}-breathing/50`}
                  style={{
                    width: particle.size,
                    height: particle.size,
                  }}
                  initial={{ 
                    x: `${particle.x}%`, 
                    y: `${particle.y + 100}%`,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: `${particle.y}%`,
                    opacity: [0, 0.7, 0],
                  }}
                  transition={{ 
                    duration: particle.duration,
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
              ))}
              
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-misty-mountains"></div>
              <div className="absolute inset-0 kanji-bg opacity-10"></div>
              
              {/* Dynamic stance-based background effects */}
              {selectedStance && (
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-t ${
                    selectedStance === 'slash' ? 'from-demon-red/20 to-transparent' : 
                    selectedStance === 'defend' ? 'from-demon-blue/20 to-transparent' : 
                    'from-demon-purple/20 to-transparent'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              )}
            </div>
            
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
                    <motion.h2 
                      className="text-3xl font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent mb-6"
                      initial={{ letterSpacing: "5px", opacity: 0.5 }}
                      animate={{ letterSpacing: "normal", opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    >
                      A New Challenge Rises
                    </motion.h2>
                    
                    <motion.div
                      className="relative w-32 h-32 mb-8"
                      initial={{ scale: 0.8, y: 10 }}
                      animate={{ 
                        scale: [0.8, 1, 0.95],
                        y: [10, -5, 0],
                      }}
                      transition={{ 
                        duration: 2,
                        times: [0, 0.6, 1],
                        ease: "easeOut" 
                      }}
                    >
                      <AnimeAvatar size="lg" showAura={true} />
                      
                      <motion.div 
                        className="absolute -inset-4 rounded-full border-2 border-dashed"
                        style={{ borderColor: `var(--demon-${breathingStyle.color})` }}
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 0.5, rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                    
                    <motion.p 
                      className="text-lg text-white/90 mb-4 italic"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      "The demons stir as dawn breaks over the financial dojo."
                    </motion.p>
                    
                    <motion.p 
                      className="text-lg text-white/90 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      <span className="font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent">{playerName}</span>, 
                      master of <span className={`font-bold text-demon-${breathingStyle.color}`}>{breathingStyle.name}</span>, 
                      prepares for a new day of battle.
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      <Button 
                        onClick={proceedToStance} 
                        className="mt-4 bg-gradient-to-r from-demon-red to-demon-gold hover:opacity-90 text-white relative overflow-hidden group"
                      >
                        <span className="relative z-10">Prepare Your Stance</span>
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 1
                          }}
                        />
                      </Button>
                    </motion.div>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
                      <motion.div
                        className="stance-card bg-gradient-to-b from-demon-red/20 to-black/40 border border-demon-red/30 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-demon-red/80 relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.03, 
                          boxShadow: '0 0 20px rgba(255,45,85,0.4)',
                          transition: { duration: 0.2 }
                        }}
                        onClick={() => selectStance('slash')}
                      >
                        <motion.div
                          className="absolute -right-10 -bottom-10 w-40 h-40 bg-demon-red/10 rounded-full blur-xl"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                        
                        <motion.div 
                          className="w-16 h-16 rounded-full bg-demon-red/20 flex items-center justify-center mb-3"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Sword className="w-8 h-8 text-demon-red" />
                        </motion.div>
                        
                        <h3 className="text-xl font-bold text-demon-red mb-2">Slash Now</h3>
                        <p className="text-sm text-white/70">
                          Take an aggressive approach. High risk, high reward.
                        </p>
                        <div className="mt-3 px-3 py-1 bg-demon-red/20 rounded text-xs">
                          <span className="text-demon-red/90">Based on Courage: {playerTraits.courage.toFixed(1)}/10</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="stance-card bg-gradient-to-b from-demon-blue/20 to-black/40 border border-demon-blue/30 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-demon-blue/80 relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.03, 
                          boxShadow: '0 0 20px rgba(14,165,233,0.4)',
                          transition: { duration: 0.2 }
                        }}
                        onClick={() => selectStance('defend')}
                      >
                        <motion.div
                          className="absolute -left-10 -bottom-10 w-40 h-40 bg-demon-blue/10 rounded-full blur-xl"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.7, 0.5]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />
                        
                        <motion.div 
                          className="w-16 h-16 rounded-full bg-demon-blue/20 flex items-center justify-center mb-3"
                          whileHover={{ rotate: -15, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Shield className="w-8 h-8 text-demon-blue" />
                        </motion.div>
                        
                        <h3 className="text-xl font-bold text-demon-blue mb-2">Brace & Save</h3>
                        <p className="text-sm text-white/70">
                          Take a defensive approach. Safe, modest benefits.
                        </p>
                        <div className="mt-3 px-3 py-1 bg-demon-blue/20 rounded text-xs">
                          <span className="text-demon-blue/90">Based on Discipline: {playerTraits.discipline.toFixed(1)}/10</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        className="stance-card bg-gradient-to-b from-demon-purple/20 to-black/40 border border-demon-purple/30 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:border-demon-purple/80 relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.03, 
                          boxShadow: '0 0 20px rgba(94,23,235,0.4)',
                          transition: { duration: 0.2 }
                        }}
                        onClick={() => selectStance('surge')}
                      >
                        <motion.div
                          className="absolute -right-10 -top-10 w-40 h-40 bg-demon-purple/10 rounded-full blur-xl"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.7, 0.5]
                          }}
                          transition={{ duration: 3.5, repeat: Infinity }}
                        />
                        
                        <motion.div 
                          className="w-16 h-16 rounded-full bg-demon-purple/20 flex items-center justify-center mb-3"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Zap className="w-8 h-8 text-demon-purple" />
                        </motion.div>
                        
                        <h3 className="text-xl font-bold text-demon-purple mb-2">Emotion Surge</h3>
                        <p className="text-sm text-white/70">
                          Follow your instincts. Unpredictable outcomes.
                        </p>
                        <div className="mt-3 px-3 py-1 bg-demon-purple/20 rounded text-xs">
                          <span className="text-demon-purple/90">Based on Wisdom: {playerTraits.wisdom.toFixed(1)}/10</span>
                        </div>
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
                    <motion.h2
                      className="text-2xl font-bold bg-gradient-to-r from-demon-red to-demon-gold bg-clip-text text-transparent mb-6"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {selectedStance === 'slash' ? 'Your Attack Lands!' : 
                       selectedStance === 'defend' ? 'Your Defense Holds Strong!' : 
                       'Your Spirit Surges!'}
                    </motion.h2>
                    
                    <motion.div 
                      className={`w-32 h-32 mb-6 rounded-full flex items-center justify-center relative
                        ${selectedStance === 'slash' ? 'bg-gradient-to-br from-demon-red/40 to-demon-ember/20' : 
                          selectedStance === 'defend' ? 'bg-gradient-to-br from-demon-blue/40 to-demon-teal/20' : 
                          'bg-gradient-to-br from-demon-purple/40 to-demon-indigo/20'}`}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <motion.div 
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: selectedStance === 'slash' ? 360 : 0 }}
                        transition={{ 
                          duration: selectedStance === 'slash' ? 2 : 0,
                          ease: "easeInOut"
                        }}
                      >
                        {selectedStance === 'slash' ? 
                          <Sword className="w-12 h-12 text-demon-red" /> : 
                          selectedStance === 'defend' ? 
                          <Shield className="w-12 h-12 text-demon-blue" /> : 
                          <Zap className="w-12 h-12 text-demon-purple" />
                        }
                      </motion.div>
                      
                      {/* Effect particles */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute w-2 h-2 rounded-full ${
                            selectedStance === 'slash' ? 'bg-demon-red' : 
                            selectedStance === 'defend' ? 'bg-demon-blue' : 
                            'bg-demon-purple'
                          }`}
                          initial={{ 
                            x: 0, 
                            y: 0, 
                            opacity: 1,
                            scale: 1
                          }}
                          animate={{ 
                            x: Math.sin(i * 45 * Math.PI / 180) * 70,
                            y: Math.cos(i * 45 * Math.PI / 180) * 70,
                            opacity: 0,
                            scale: 0
                          }}
                          transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            repeatDelay: i * 0.1
                          }}
                        />
                      ))}
                    </motion.div>
                    
                    <motion.p 
                      className="text-lg text-white/90 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      {stanceEffects.description}
                    </motion.p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {stanceEffects.traitChanges && (
                        <motion.div
                          className="bg-black/30 rounded-lg p-4 border border-white/10"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <h3 className="text-lg font-medium text-white/90 mb-2">Traits Changed</h3>
                          {Object.entries(stanceEffects.traitChanges).map(([trait, change]) => (
                            <motion.p 
                              key={trait} 
                              className={`text-sm ${change > 0 ? 'text-green-400' : 'text-red-400'}`}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7, duration: 0.3 }}
                            >
                              {trait.charAt(0).toUpperCase() + trait.slice(1)}: {change > 0 ? '+' : ''}{change}
                            </motion.p>
                          ))}
                        </motion.div>
                      )}
                      
                      {stanceEffects.cashBonus !== undefined && (
                        <motion.div
                          className="bg-black/30 rounded-lg p-4 border border-white/10"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                        >
                          <h3 className="text-lg font-medium text-white/90 mb-2">Cash Impact</h3>
                          <motion.p
                            className={`text-xl font-bold ${stanceEffects.cashBonus >= 0 ? 'text-green-400' : 'text-red-400'}`}
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              delay: 0.7,
                              type: "spring", 
                              stiffness: 200 
                            }}
                          >
                            {stanceEffects.cashBonus >= 0 ? '+' : '-'}${Math.abs(stanceEffects.cashBonus)}
                          </motion.p>
                        </motion.div>
                      )}
                      
                      {stanceEffects.specialMoveBonus && stanceEffects.specialMoveBonus > 0 && (
                        <motion.div
                          className="bg-black/30 rounded-lg p-4 border border-white/10 md:col-span-2"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <h3 className="text-lg font-medium text-white/90 mb-2">Special Move Gained!</h3>
                          <div className="flex items-center justify-center space-x-2">
                            <Star className="h-5 w-5 text-demon-gold animate-pulse" />
                            <p className="text-xl font-bold text-demon-gold">+{stanceEffects.specialMoveBonus}</p>
                            <Star className="h-5 w-5 text-demon-gold animate-pulse" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    <Button 
                      onClick={closeEncounter} 
                      className="mt-4 bg-gradient-to-r from-demon-blue to-demon-purple hover:opacity-90 text-white relative overflow-hidden"
                    >
                      <span className="relative z-10">Begin Your Month</span>
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                          duration: 1.2, 
                          repeat: Infinity,
                          repeatType: "loop" 
                        }}
                      />
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
