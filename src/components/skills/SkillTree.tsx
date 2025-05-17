
import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Flame, Droplets, Zap, Wind, Skull, Star, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillTreeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Skill {
  id: string;
  tier: number;
  name: string;
  description: string;
  xpCost: number;
  unlockable: boolean;
  unlocked: boolean;
  passiveEffects: string[];
  requires?: string[];
  isUltimate?: boolean;
  isCorrupted?: boolean;
}

const SkillTree: React.FC<SkillTreeProps> = ({ isOpen, onClose }) => {
  const { shadowForm, breathingXP } = useGameContext();
  const [activeTab, setActiveTab] = useState('flame');
  const [showSkillDetails, setShowSkillDetails] = useState<string | null>(null);
  
  const getTabIcon = (type: string) => {
    switch(type) {
      case 'flame': return <Flame className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'thunder': return <Zap className="h-4 w-4" />;
      case 'wind': return <Wind className="h-4 w-4" />;
      case 'shadow': return <Skull className="h-4 w-4" />;
      default: return <Flame className="h-4 w-4" />;
    }
  };
  
  const showShadowTab = shadowForm !== null;
  
  const playUnlockSound = () => {
    const audio = new Audio('/sounds/skill-unlock.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
  };

  const handleUnlockSkill = (type: string, tier: number, name: string, xpCost: number) => {
    if (breathingXP < xpCost) {
      toast({
        title: "Not Enough XP",
        description: `You need ${xpCost} Breathing XP to unlock this skill.`,
        variant: "destructive",
      });
      return;
    }
    
    playUnlockSound();
    
    toast({
      title: `${name} Unlocked!`,
      description: `You've mastered the ${type} breathing technique.`,
      variant: "default",
    });
    
    if (name.includes("Combo")) {
      // Special combo animation would go here
    }
  };
  
  const handleViewSkillDetails = (skillId: string) => {
    setShowSkillDetails(skillId === showSkillDetails ? null : skillId);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-transparent border-0 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-slate-600/30 shadow-xl shadow-slate-900/20">
          <DialogHeader className="p-6 border-b border-slate-700/50">
            <DialogTitle className="text-2xl font-bold text-center">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Breathing Skill Tree</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <motion.div 
                className="bg-slate-800/70 px-4 py-2 rounded-lg border border-slate-600/30 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <span className="text-gray-400 text-sm">Breathing XP: </span>
                  <span className="text-blue-400 font-bold">{breathingXP}</span>
                </div>
              </motion.div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Close</Button>
                <Button>Reset Tree (Coming Soon)</Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-4 bg-slate-800/50">
                <TabsTrigger value="flame" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-900 data-[state=active]:to-red-800">
                  {getTabIcon('flame')}
                  <span className="ml-1">Flame</span>
                </TabsTrigger>
                
                <TabsTrigger value="water" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900 data-[state=active]:to-blue-800">
                  {getTabIcon('water')}
                  <span className="ml-1">Water</span>
                </TabsTrigger>
                
                <TabsTrigger value="thunder" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-900 data-[state=active]:to-purple-800">
                  {getTabIcon('thunder')}
                  <span className="ml-1">Thunder</span>
                </TabsTrigger>
                
                <TabsTrigger value="wind" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-900 data-[state=active]:to-green-800">
                  {getTabIcon('wind')}
                  <span className="ml-1">Wind</span>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="shadow" 
                  disabled={!showShadowTab}
                  className={`
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-900 data-[state=active]:to-gray-800
                    ${!showShadowTab ? 'opacity-50' : ''}
                  `}
                >
                  {getTabIcon('shadow')}
                  <span className="ml-1">Shadow</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="h-[500px] overflow-auto p-4 bg-slate-800/20 rounded-lg border border-slate-700/30">
                <TabsContent value="flame" className="h-full m-0">
                  <BreathingTreeContent 
                    type="flame" 
                    breathingXP={breathingXP}
                    shadowForm={shadowForm}
                    onUnlock={handleUnlockSkill}
                    showSkillDetails={showSkillDetails}
                    onViewDetails={handleViewSkillDetails}
                  />
                </TabsContent>
                
                <TabsContent value="water" className="h-full m-0">
                  <BreathingTreeContent 
                    type="water" 
                    breathingXP={breathingXP} 
                    shadowForm={shadowForm}
                    onUnlock={handleUnlockSkill}
                    showSkillDetails={showSkillDetails}
                    onViewDetails={handleViewSkillDetails}
                  />
                </TabsContent>
                
                <TabsContent value="thunder" className="h-full m-0">
                  <BreathingTreeContent 
                    type="thunder" 
                    breathingXP={breathingXP} 
                    shadowForm={shadowForm}
                    onUnlock={handleUnlockSkill}
                    showSkillDetails={showSkillDetails}
                    onViewDetails={handleViewSkillDetails}
                  />
                </TabsContent>
                
                <TabsContent value="wind" className="h-full m-0">
                  <BreathingTreeContent 
                    type="wind" 
                    breathingXP={breathingXP} 
                    shadowForm={shadowForm}
                    onUnlock={handleUnlockSkill}
                    showSkillDetails={showSkillDetails}
                    onViewDetails={handleViewSkillDetails}
                  />
                </TabsContent>
                
                <TabsContent value="shadow" className="h-full m-0">
                  <BreathingTreeContent 
                    type="shadow" 
                    breathingXP={breathingXP} 
                    shadowForm={shadowForm}
                    onUnlock={handleUnlockSkill}
                    showSkillDetails={showSkillDetails}
                    onViewDetails={handleViewSkillDetails}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface BreathingTreeContentProps {
  type: 'flame' | 'water' | 'thunder' | 'wind' | 'shadow';
  breathingXP: number;
  shadowForm: string | null;
  onUnlock: (type: string, tier: number, name: string, xpCost: number) => void;
  showSkillDetails: string | null;
  onViewDetails: (skillId: string) => void;
}

const BreathingTreeContent: React.FC<BreathingTreeContentProps> = ({ 
  type, 
  breathingXP, 
  shadowForm,
  onUnlock,
  showSkillDetails,
  onViewDetails
}) => {
  const colors = getTypeColors(type);
  const isCorrupted = shadowForm !== null && type !== 'shadow';
  
  const getSkillTree = (): Skill[] => {
    const basicSkills: Skill[] = [
      {
        id: `${type}_basic`,
        tier: 1,
        name: `Basic ${capitalizeFirst(type)} Breathing`,
        description: `Master the fundamentals of ${type} breathing techniques.`,
        xpCost: 3,
        unlockable: breathingXP >= 3,
        unlocked: false,
        passiveEffects: [`+10% ${type} damage`, '+5% spirit regeneration'],
        isCorrupted: false
      },
      {
        id: `${type}_burst`,
        tier: 2,
        name: `${capitalizeFirst(type)} Burst`,
        description: `Channel ${type} energy in a powerful direct attack.`,
        xpCost: 6,
        unlockable: breathingXP >= 6,
        unlocked: false,
        requires: [`${type}_basic`],
        passiveEffects: [`+15% ${type} damage`, '-5% debt interest'],
        isCorrupted: false
      },
      {
        id: `${type}_aura`,
        tier: 2,
        name: `${capitalizeFirst(type)} Aura`,
        description: `Create a protective ${type} aura around yourself.`,
        xpCost: 6,
        unlockable: breathingXP >= 6,
        unlocked: false,
        requires: [`${type}_basic`],
        passiveEffects: ['+15% spirit defense', '+10% savings protection'],
        isCorrupted: false
      },
      {
        id: `${type}_ultimate`,
        tier: 3,
        name: `Ultimate ${capitalizeFirst(type)} Technique`,
        description: `A legendary breathing technique of immense power.`,
        xpCost: 12,
        unlockable: breathingXP >= 12,
        unlocked: false,
        requires: [`${type}_burst`, `${type}_aura`],
        passiveEffects: ['Special move regeneration +1', '+20% payment effectiveness'],
        isUltimate: true,
        isCorrupted: false
      }
    ];
    
    if (isCorrupted) {
      return [
        ...basicSkills,
        {
          id: `${type}_blood`,
          tier: 2,
          name: `Blood ${capitalizeFirst(type)}`,
          description: `A forbidden technique that harnesses the shadow's power through your ${type} breathing.`,
          xpCost: 5,
          unlockable: breathingXP >= 5 && shadowForm !== null,
          unlocked: false,
          requires: [`${type}_basic`],
          passiveEffects: ['+25% damage', '-10% DemonCoins per use'],
          isCorrupted: true
        },
        {
          id: `${type}_void`,
          tier: 3,
          name: `Void ${capitalizeFirst(type)} Annihilation`,
          description: `A devastating technique that sacrifices your spirit for immense power.`,
          xpCost: 10,
          unlockable: breathingXP >= 10 && shadowForm !== null,
          unlocked: false,
          requires: [`${type}_blood`],
          passiveEffects: ['One-shot any debt under 25% health', '+15 corruption per use'],
          isCorrupted: true,
          isUltimate: true
        }
      ];
    }
    
    if (type === 'shadow') {
      return [
        {
          id: 'shadow_embrace',
          tier: 1,
          name: 'Shadow Embrace',
          description: 'Embrace the darkness within, gaining power from your corruption.',
          xpCost: 3,
          unlockable: breathingXP >= 3 && shadowForm !== null,
          unlocked: false,
          passiveEffects: ['Convert 10% corruption to attack power', '-5% interest rate'],
          isCorrupted: true
        },
        {
          id: 'shadow_drain',
          tier: 2,
          name: 'Void Drain',
          description: 'Channel the void to drain energy from your debts.',
          xpCost: 6,
          unlockable: breathingXP >= 6 && shadowForm !== null,
          unlocked: false,
          requires: ['shadow_embrace'],
          passiveEffects: ['Heal 5% spirit on debt payment', '+10% corruption per use'],
          isCorrupted: true
        },
        {
          id: 'shadow_form',
          tier: 2,
          name: 'Shadow Form',
          description: 'Transform into pure shadow, gaining temporary invulnerability.',
          xpCost: 6,
          unlockable: breathingXP >= 6 && shadowForm !== null,
          unlocked: false,
          requires: ['shadow_embrace'],
          passiveEffects: ['No interest for 1 month', '+15% corruption per use'],
          isCorrupted: true
        },
        {
          id: 'shadow_ultimate',
          tier: 3,
          name: 'Abyss Incarnation',
          description: 'Become one with the abyss, unlocking your full potential.',
          xpCost: 15,
          unlockable: breathingXP >= 15 && shadowForm !== null,
          unlocked: false,
          requires: ['shadow_drain', 'shadow_form'],
          passiveEffects: ['Convert all savings to debt payment power', 'Max corruption for 1 month'],
          isUltimate: true,
          isCorrupted: true
        }
      ];
    }
    
    return basicSkills;
  };
  
  const skills = getSkillTree();
  
  return (
    <div className="relative h-full w-full">
      {/* SVG connection lines */}
      <svg className="absolute top-0 left-0 h-full w-full" style={{ zIndex: 1 }}>
        <defs>
          <marker id={`arrowhead-${type}`} markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={isCorrupted ? '#ef4444' : colors.line} />
          </marker>
          
          {isCorrupted && (
            <filter id="distortion">
              <feTurbulence baseFrequency="0.05" numOctaves="2" result="turbulence" />
              <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="5" />
            </filter>
          )}
        </defs>
        
        {/* Draw connection lines between skill nodes */}
        {skills.map(skill => {
          if (!skill.requires) return null;
          
          return skill.requires.map(reqId => {
            const parentSkill = skills.find(s => s.id === reqId);
            if (!parentSkill) return null;
            
            const fromTier = parentSkill.tier;
            const toTier = skill.tier;
            
            // Calculate vertical positions based on tier
            const fromY = fromTier * 150 - 75; // Adjusted spacing
            const toY = toTier * 150 - 75;     // Adjusted spacing
            
            // Calculate horizontal positions based on node index within tier
            const tierSkills = skills.filter(s => s.tier === fromTier);
            const fromX = (tierSkills.indexOf(parentSkill) + 0.5) * (100 / (tierSkills.length + 1)) + '%';
            
            const toTierSkills = skills.filter(s => s.tier === toTier);
            const toX = (toTierSkills.indexOf(skill) + 0.5) * (100 / (toTierSkills.length + 1)) + '%';
            
            return (
              <line 
                key={`${reqId}-to-${skill.id}`}
                x1={fromX} 
                y1={fromY} 
                x2={toX} 
                y2={toY} 
                stroke={skill.isCorrupted ? '#ef4444' : colors.line} 
                strokeWidth="2" 
                strokeDasharray={skill.isCorrupted ? "5,5" : ""} 
                markerEnd={`url(#arrowhead-${type})`} 
                filter={skill.isCorrupted ? "url(#distortion)" : ""}
              />
            );
          });
        }).flat().filter(Boolean)}
      </svg>
      
      {/* Skill node tiers */}
      {[1, 2, 3].map(tier => {
        const tierSkills = skills.filter(skill => skill.tier === tier);
        return (
          <div key={`tier-${tier}`} className="absolute w-full" style={{ top: `${tier * 150 - 100}px` }}>
            <div className="flex justify-evenly">
              {tierSkills.map((skill, index) => (
                <div 
                  key={skill.id} 
                  className="relative z-10 transform -translate-x-1/2" 
                  style={{ 
                    left: `${(index + 0.5) * (100 / (tierSkills.length + 1))}%`
                  }}
                >
                  <SkillNode 
                    type={type} 
                    tier={tier}
                    skill={skill}
                    isCorrupted={!!skill.isCorrupted}
                    onUnlock={() => onUnlock(type, tier, skill.name, skill.xpCost)}
                    onViewDetails={() => onViewDetails(skill.id)}
                    isExpanded={showSkillDetails === skill.id}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {type === 'thunder' && (
        <div className="absolute bottom-10 right-10 p-3 bg-slate-800/80 border border-amber-500/30 rounded-lg">
          <div className="text-xs text-amber-400 font-semibold mb-1 flex items-center">
            <Star className="w-3 h-3 mr-1" />
            <span>Special Combo Available</span>
          </div>
          <div className="text-xs text-gray-400">
            Unlock Thunder + Wind trees for<br />
            <span className="text-green-400">Shock Cyclone Style</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface SkillNodeProps {
  type: string;
  tier: number;
  skill: Skill;
  isCorrupted?: boolean;
  onUnlock: () => void;
  onViewDetails: () => void;
  isExpanded: boolean;
}

const SkillNode: React.FC<SkillNodeProps> = ({ 
  type, 
  tier, 
  skill,
  isCorrupted = false,
  onUnlock,
  onViewDetails,
  isExpanded
}) => {
  const colors = getTypeColors(type);
  const baseColors = isCorrupted ? 
    { bg: 'bg-gradient-to-br from-red-900/70 to-black/70', text: 'text-red-400', border: 'border-red-500/30' } : 
    colors;
  
  return (
    <motion.div
      initial="default"
      whileHover="hover"
      variants={nodeWrapperVariants}
      className="relative"
    >
      <motion.div
        onClick={onViewDetails}
        className={`
          w-56 p-4 rounded-lg border ${skill.unlockable ? baseColors.border : 'border-gray-700'} 
          ${skill.unlockable ? baseColors.bg : 'bg-gray-800/80'} 
          ${skill.isUltimate && skill.unlockable ? 'animate-pulse shadow-lg' : ''}
          transition-all hover:shadow-md cursor-pointer
          ${isCorrupted ? 'shadow-red-900/30' : ''}
        `}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-bold ${skill.unlockable ? baseColors.text : 'text-gray-400'}`}>
            {skill.name}
            {isCorrupted && <span className="text-red-500 text-xs ml-1">🔥</span>}
          </h3>
          <div className={`px-2 py-0.5 rounded text-xs font-medium ${skill.unlockable ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
            Tier {tier}
          </div>
        </div>
        
        <p className={`text-xs mb-3 ${skill.unlockable ? 'text-gray-300' : 'text-gray-500'}`}>
          {skill.description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className={`text-xs ${skill.unlockable ? 'text-amber-400' : 'text-gray-500'}`}>
            {skill.xpCost} XP
          </span>
          
          <Button 
            variant={skill.unlockable ? "default" : "outline"}
            size="sm"
            disabled={!skill.unlockable}
            onClick={(e) => { 
              e.stopPropagation();
              onUnlock();
            }}
            className={`text-xs ${!skill.unlockable ? 'opacity-50' : ''} ${isCorrupted ? 'bg-red-900 hover:bg-red-800' : ''}`}
          >
            {skill.unlockable ? (
              <>
                Learn
                {isCorrupted && <span className="ml-1">⚠️</span>}
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Locked</span>
              </div>
            )}
          </Button>
        </div>
        
        {skill.isUltimate && skill.unlockable && (
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-md"></div>
        )}
        
        {isCorrupted && (
          <div className="absolute inset-0 -z-10 rounded-lg bg-red-900/10 animate-pulse"></div>
        )}
      </motion.div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="mt-2 bg-slate-800 rounded-lg border border-slate-700 p-3 overflow-hidden"
          >
            <h4 className="text-sm font-semibold mb-2">Passive Effects:</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              {skill.passiveEffects.map((effect, i) => (
                <li key={i} className="flex items-center">
                  <Star className="h-3 w-3 text-amber-400 mr-1 flex-shrink-0" />
                  <span>{effect}</span>
                </li>
              ))}
            </ul>
            
            {skill.isCorrupted && (
              <div className="mt-2 p-2 bg-red-900/20 border border-red-500/20 rounded text-xs text-red-400">
                <span className="font-semibold">Warning:</span> This skill draws on corrupted power and may have unexpected consequences.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getTypeColors = (type: string) => {
  switch(type) {
    case 'flame':
      return {
        bg: 'bg-gradient-to-br from-red-900/70 to-red-800/70',
        text: 'text-red-400',
        border: 'border-red-500/30',
        line: '#ef4444'
      };
    case 'water':
      return {
        bg: 'bg-gradient-to-br from-blue-900/70 to-blue-800/70',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        line: '#3b82f6'
      };
    case 'thunder':
      return {
        bg: 'bg-gradient-to-br from-purple-900/70 to-purple-800/70',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        line: '#a855f7'
      };
    case 'wind':
      return {
        bg: 'bg-gradient-to-br from-green-900/70 to-green-800/70',
        text: 'text-green-400',
        border: 'border-green-500/30',
        line: '#22c55e'
      };
    case 'shadow':
      return {
        bg: 'bg-gradient-to-br from-gray-900/70 to-gray-800/70',
        text: 'text-gray-400',
        border: 'border-gray-500/30',
        line: '#6b7280'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-red-900/70 to-red-800/70',
        text: 'text-red-400',
        border: 'border-red-500/30',
        line: '#ef4444'
      };
  }
};

const nodeWrapperVariants = {
  default: { scale: 1 },
  hover: { scale: 1.05 }
};

export default SkillTree;
