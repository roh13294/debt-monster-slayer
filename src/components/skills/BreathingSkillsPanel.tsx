
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { Wind, Flame, Droplets } from 'lucide-react';

interface BreathingSkillsProps {
  onClose: () => void;
}

interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'flame' | 'water' | 'thunder' | 'wind' | 'shadow';
  position: { x: number; y: number };
  connections: string[];
  unlocked: boolean;
  effect: string;
  icon: React.ReactNode;
}

const BreathingSkillsPanel: React.FC<BreathingSkillsProps> = ({ onClose }) => {
  const { breathingXP, addBreathingXP } = useGameContext();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [activeBranch, setActiveBranch] = useState<string>('flame');
  
  // Define skill tree data for each breathing technique
  const flameSkillTree: SkillNode[] = [
    {
      id: 'flame-1',
      name: 'Flame Breath',
      description: 'The foundational breathing technique of Flame users.',
      cost: 5,
      type: 'flame',
      position: { x: 50, y: 50 },
      connections: ['flame-2', 'flame-3'],
      unlocked: true,
      effect: '+10% damage in Flame stance',
      icon: <Flame className="h-5 w-5 text-red-400" />
    },
    {
      id: 'flame-2',
      name: 'Rising Flame',
      description: 'Channel heat upward to increase attack power.',
      cost: 15,
      type: 'flame',
      position: { x: 30, y: 100 },
      connections: ['flame-4'],
      unlocked: false,
      effect: '+15% critical hit chance in Flame stance',
      icon: <Flame className="h-5 w-5 text-orange-400" />
    },
    {
      id: 'flame-3',
      name: 'Explosive Core',
      description: 'Concentrate breathing to create explosive attacks.',
      cost: 20,
      type: 'flame',
      position: { x: 70, y: 100 },
      connections: ['flame-5'],
      unlocked: false,
      effect: '+25% damage on first strike in battle',
      icon: <Flame className="h-5 w-5 text-yellow-400" />
    },
    {
      id: 'flame-4',
      name: 'Dancing Embers',
      description: 'Move like flickering flames to increase combo potential.',
      cost: 35,
      type: 'flame',
      position: { x: 30, y: 150 },
      connections: ['flame-6'],
      unlocked: false,
      effect: '+2 seconds to combo window duration',
      icon: <Flame className="h-5 w-5 text-red-500" />
    },
    {
      id: 'flame-5',
      name: 'Scorching Will',
      description: 'Burning determination that increases with each strike.',
      cost: 40,
      type: 'flame',
      position: { x: 70, y: 150 },
      connections: ['flame-6'],
      unlocked: false,
      effect: 'Damage increases by 5% with each consecutive hit',
      icon: <Flame className="h-5 w-5 text-orange-500" />
    },
    {
      id: 'flame-6',
      name: 'Blazing Absorption',
      description: 'Master technique that converts demon essence to power.',
      cost: 80,
      type: 'flame',
      position: { x: 50, y: 200 },
      connections: [],
      unlocked: false,
      effect: 'Convert 10% of damage dealt to DemonCoins',
      icon: <Flame className="h-5 w-5 text-amber-500" />
    }
  ];
  
  const waterSkillTree: SkillNode[] = [
    {
      id: 'water-1',
      name: 'Flowing Water',
      description: 'The foundational breathing technique of Water users.',
      cost: 5,
      type: 'water',
      position: { x: 50, y: 50 },
      connections: ['water-2', 'water-3'],
      unlocked: true,
      effect: '+20% defense in Water stance',
      icon: <Droplets className="h-5 w-5 text-blue-400" />
    },
    // More water skills would be defined here
    {
      id: 'water-2',
      name: 'Surface Calm',
      description: 'Maintain tranquility even in battle.',
      cost: 15,
      type: 'water',
      position: { x: 30, y: 100 },
      connections: [],
      unlocked: false,
      effect: 'Reduce damage taken by 10%',
      icon: <Droplets className="h-5 w-5 text-cyan-400" />
    }
  ];
  
  // Add other breathing style trees here (thunder, wind, shadow)
  // For now, we'll use placeholder arrays
  const thunderSkillTree: SkillNode[] = [];
  const windSkillTree: SkillNode[] = [];
  const shadowSkillTree: SkillNode[] = [];
  
  // Get the active skill tree based on selected branch
  const getActiveSkillTree = (): SkillNode[] => {
    switch (activeBranch) {
      case 'flame': return flameSkillTree;
      case 'water': return waterSkillTree;
      case 'thunder': return thunderSkillTree;
      case 'wind': return windSkillTree;
      case 'shadow': return shadowSkillTree;
      default: return flameSkillTree;
    }
  };
  
  // Handle unlocking a skill
  const handleUnlockSkill = (skill: SkillNode) => {
    // Check if player has enough XP
    if (breathingXP < skill.cost) {
      return;
    }
    
    // In a real implementation, we would:
    // 1. Update the skill's unlocked status
    // 2. Deduct the XP cost
    // 3. Apply the skill's effects
    // For this demonstration, we'll just log the action
    console.log(`Unlocking skill: ${skill.name}`);
    
    // Deduct XP (in a real implementation)
    // addBreathingXP(-skill.cost);
    
    // Play unlock sound
    const audio = new Audio('/sounds/skill-unlock.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
  };
  
  // Render connections between skill nodes
  const renderConnections = () => {
    const activeTree = getActiveSkillTree();
    const connections: JSX.Element[] = [];
    
    activeTree.forEach(node => {
      node.connections.forEach(targetId => {
        const targetNode = activeTree.find(n => n.id === targetId);
        if (targetNode) {
          // Define connection styles based on unlock status
          const unlocked = node.unlocked && targetNode.unlocked;
          const canUnlock = node.unlocked && !targetNode.unlocked;
          
          connections.push(
            <div 
              key={`${node.id}-${targetId}`}
              className={`absolute h-1 rounded-full transform origin-left ${
                unlocked ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                canUnlock ? 'bg-gradient-to-r from-blue-500/50 to-blue-400/50' :
                'bg-slate-700/50'
              }`}
              style={{
                left: `${node.position.x}%`,
                top: `${node.position.y}%`,
                width: `${Math.sqrt(
                  Math.pow(targetNode.position.x - node.position.x, 2) + 
                  Math.pow(targetNode.position.y - node.position.y, 2)
                )}%`,
                transform: `rotate(${Math.atan2(
                  targetNode.position.y - node.position.y,
                  targetNode.position.x - node.position.x
                )}rad)`,
              }}
            />
          );
        }
      });
    });
    
    return connections;
  };
  
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Breathing Techniques</h2>
        <div>
          <span className="text-sm text-slate-400">Breathing XP: </span>
          <span className="text-lg font-bold text-blue-400">{breathingXP}</span>
        </div>
      </div>
      
      <div className="flex mb-6 border-b border-slate-700 pb-4">
        <Button
          variant={activeBranch === 'flame' ? 'default' : 'outline'}
          className={`mr-2 ${activeBranch === 'flame' ? 'bg-red-600' : 'border-red-700/40'}`}
          onClick={() => setActiveBranch('flame')}
        >
          <Flame className="w-4 h-4 mr-1" />
          Flame
        </Button>
        
        <Button
          variant={activeBranch === 'water' ? 'default' : 'outline'}
          className={`mr-2 ${activeBranch === 'water' ? 'bg-blue-600' : 'border-blue-700/40'}`}
          onClick={() => setActiveBranch('water')}
        >
          <Droplets className="w-4 h-4 mr-1" />
          Water
        </Button>
        
        <Button
          variant={activeBranch === 'thunder' ? 'default' : 'outline'}
          className={`mr-2 ${activeBranch === 'thunder' ? 'bg-yellow-600' : 'border-yellow-700/40'}`}
          onClick={() => setActiveBranch('thunder')}
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3L4 14H12L11 21L20 10H12L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Thunder
        </Button>
        
        <Button
          variant={activeBranch === 'wind' ? 'default' : 'outline'}
          className={`mr-2 ${activeBranch === 'wind' ? 'bg-green-600' : 'border-green-700/40'}`}
          onClick={() => setActiveBranch('wind')}
        >
          <Wind className="w-4 h-4 mr-1" />
          Wind
        </Button>
        
        <Button
          variant={activeBranch === 'shadow' ? 'default' : 'outline'}
          className={`${activeBranch === 'shadow' ? 'bg-purple-600' : 'border-purple-700/40'}`}
          onClick={() => setActiveBranch('shadow')}
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3v1m0 16v1m-8-9H3m3.314-5.686L5.5 5.5m12.186.814L18.5 5.5m-12.186 12.186L5.5 18.5m12.186-.814L18.5 18.5M6 12a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Shadow
        </Button>
      </div>
      
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 mb-6 relative h-96">
        {/* Skill connections */}
        {renderConnections()}
        
        {/* Skill nodes */}
        {getActiveSkillTree().map(skill => (
          <motion.div
            key={skill.id}
            whileHover={{ scale: 1.1 }}
            className={`absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center cursor-pointer ${
              skill.unlocked ? 'bg-gradient-to-br from-emerald-600 to-emerald-800 border-2 border-emerald-400' :
              'bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600'
            }`}
            style={{
              left: `${skill.position.x}%`,
              top: `${skill.position.y}%`,
            }}
            onClick={() => setSelectedSkill(skill)}
          >
            <div className="text-white">
              {skill.icon}
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedSkill && (
        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 mb-6">
          <h3 className="text-lg font-medium text-white mb-1">{selectedSkill.name}</h3>
          <p className="text-sm text-slate-300 mb-3">{selectedSkill.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Effect</p>
              <p className="text-emerald-400">{selectedSkill.effect}</p>
            </div>
            <div className="bg-slate-700/50 rounded p-3">
              <p className="text-xs text-slate-400 mb-1">Cost</p>
              <p className={`${breathingXP >= selectedSkill.cost ? 'text-blue-400' : 'text-red-400'}`}>
                {selectedSkill.cost} Breathing XP
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              disabled={selectedSkill.unlocked || breathingXP < selectedSkill.cost}
              onClick={() => handleUnlockSkill(selectedSkill)}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600"
            >
              {selectedSkill.unlocked ? 'Already Unlocked' : 'Unlock Skill'}
            </Button>
          </div>
        </div>
      )}
      
      <Button onClick={onClose} variant="outline" className="border-slate-700 hover:bg-slate-800">
        Return to Dashboard
      </Button>
    </div>
  );
};

export default BreathingSkillsPanel;
