
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Zap, Droplet, Wind, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';
import { toast } from "@/hooks/use-toast";
import DemonCoin from '@/components/ui/DemonCoin';

export interface BreathingSkill {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  requires?: string[];
  effectType: 'damage' | 'defense' | 'resource' | 'passive';
  effectValue: number;
  breathingStyle: 'flame' | 'water' | 'thunder' | 'wind' | 'shadow';
  icon: React.ReactNode;
}

const BreathingStyleTree: React.FC = () => {
  const { cash, setCash, playerTraits, updatePlayerTrait } = useGameContext();
  
  const [skills, setSkills] = React.useState<BreathingSkill[]>([
    {
      id: 'flame-1',
      name: 'Flame Breathing: First Form',
      description: 'Unleash a blazing strike that deals +20% damage',
      cost: 500,
      unlocked: true,
      effectType: 'damage',
      effectValue: 20,
      breathingStyle: 'flame',
      icon: <Flame className="w-5 h-5 text-red-500" />
    },
    {
      id: 'flame-2',
      name: 'Flame Breathing: Second Form',
      description: 'Your attacks have a 15% chance to burn enemies, dealing extra damage over time',
      cost: 1000,
      unlocked: false,
      requires: ['flame-1'],
      effectType: 'damage',
      effectValue: 15,
      breathingStyle: 'flame',
      icon: <Flame className="w-5 h-5 text-red-500" />
    },
    {
      id: 'water-1',
      name: 'Water Breathing: First Form',
      description: 'Flow like water, reducing damage taken by 15%',
      cost: 500,
      unlocked: true,
      effectType: 'defense',
      effectValue: 15,
      breathingStyle: 'water',
      icon: <Droplet className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'water-2',
      name: 'Water Breathing: Second Form',
      description: 'Heal 5% of your maximum health after each battle',
      cost: 1000,
      unlocked: false,
      requires: ['water-1'],
      effectType: 'passive',
      effectValue: 5,
      breathingStyle: 'water',
      icon: <Droplet className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'thunder-1',
      name: 'Thunder Breathing: First Form',
      description: 'Increase critical hit chance by 10%',
      cost: 500,
      unlocked: true,
      effectType: 'damage',
      effectValue: 10,
      breathingStyle: 'thunder',
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 'thunder-2',
      name: 'Thunder Breathing: Second Form',
      description: '20% chance to strike twice in a single attack',
      cost: 1200,
      unlocked: false,
      requires: ['thunder-1'],
      effectType: 'damage',
      effectValue: 20,
      breathingStyle: 'thunder',
      icon: <Zap className="w-5 h-5 text-yellow-500" />
    }
  ]);
  
  const unlockSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    
    if (!skill) return;
    
    if (cash < skill.cost) {
      toast({
        title: "Not Enough DemonCoins",
        description: `You need ${skill.cost} DemonCoins to unlock this breathing technique.`,
        variant: "destructive",
      });
      return;
    }
    
    if (skill.requires) {
      const allRequirementsMet = skill.requires.every(req => 
        skills.find(s => s.id === req)?.unlocked
      );
      
      if (!allRequirementsMet) {
        toast({
          title: "Requirements Not Met",
          description: "You must unlock the previous techniques in this style first.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setCash(cash - skill.cost);
    
    setSkills(prev => 
      prev.map(s => s.id === skillId ? { ...s, unlocked: true } : s)
    );
    
    if (skill.effectType === 'damage') {
      updatePlayerTrait('discipline', playerTraits.discipline + 1);
    } else if (skill.effectType === 'defense') {
      updatePlayerTrait('determination', playerTraits.determination + 1);
    } else if (skill.effectType === 'resource') {
      updatePlayerTrait('savingAbility', playerTraits.savingAbility + 1);
    }
    
    toast({
      title: "New Breathing Technique Unlocked!",
      description: `You've mastered ${skill.name}!`,
      variant: "default",
    });
  };
  
  const flameSkills = skills.filter(s => s.breathingStyle === 'flame');
  const waterSkills = skills.filter(s => s.breathingStyle === 'water');
  const thunderSkills = skills.filter(s => s.breathingStyle === 'thunder');
  
  return (
    <div className="p-6 bg-slate-900 border border-slate-700 rounded-lg">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Breathing Style Techniques</h2>
      
      <div className="grid gap-8">
        <section>
          <h3 className="text-xl font-medium text-red-400 flex items-center gap-2 mb-4">
            <Flame className="w-6 h-6" />
            Flame Breathing
          </h3>
          
          <div className="grid gap-4">
            {flameSkills.map((skill, index) => (
              <motion.div 
                key={skill.id}
                className={`p-4 rounded-lg border ${
                  skill.unlocked 
                    ? 'bg-red-950/30 border-red-700' 
                    : 'bg-slate-800/50 border-slate-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      skill.unlocked ? 'bg-red-700/50' : 'bg-slate-700/50'
                    }`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-100">{skill.name}</h4>
                      <p className="text-sm text-slate-400">{skill.description}</p>
                    </div>
                  </div>
                  
                  {!skill.unlocked && (
                    <Button 
                      onClick={() => unlockSkill(skill.id)}
                      variant={cash >= skill.cost ? "default" : "outline"}
                      size="sm"
                      className={cash >= skill.cost 
                        ? "bg-red-700 hover:bg-red-600"
                        : "border-red-900 text-red-400"
                      }
                    >
                      <DemonCoin amount={skill.cost} size="sm" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-blue-400 flex items-center gap-2 mb-4">
            <Droplet className="w-6 h-6" />
            Water Breathing
          </h3>
          
          <div className="grid gap-4">
            {waterSkills.map((skill, index) => (
              <motion.div 
                key={skill.id}
                className={`p-4 rounded-lg border ${
                  skill.unlocked 
                    ? 'bg-blue-950/30 border-blue-700' 
                    : 'bg-slate-800/50 border-slate-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      skill.unlocked ? 'bg-blue-700/50' : 'bg-slate-700/50'
                    }`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-100">{skill.name}</h4>
                      <p className="text-sm text-slate-400">{skill.description}</p>
                    </div>
                  </div>
                  
                  {!skill.unlocked && (
                    <Button 
                      onClick={() => unlockSkill(skill.id)}
                      variant={cash >= skill.cost ? "default" : "outline"}
                      size="sm"
                      className={cash >= skill.cost 
                        ? "bg-blue-700 hover:bg-blue-600"
                        : "border-blue-900 text-blue-400"
                      }
                    >
                      <DemonCoin amount={skill.cost} size="sm" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-medium text-yellow-400 flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6" />
            Thunder Breathing
          </h3>
          
          <div className="grid gap-4">
            {thunderSkills.map((skill, index) => (
              <motion.div 
                key={skill.id}
                className={`p-4 rounded-lg border ${
                  skill.unlocked 
                    ? 'bg-yellow-950/30 border-yellow-700' 
                    : 'bg-slate-800/50 border-slate-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${
                      skill.unlocked ? 'bg-yellow-700/50' : 'bg-slate-700/50'
                    }`}>
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-100">{skill.name}</h4>
                      <p className="text-sm text-slate-400">{skill.description}</p>
                    </div>
                  </div>
                  
                  {!skill.unlocked && (
                    <Button 
                      onClick={() => unlockSkill(skill.id)}
                      variant={cash >= skill.cost ? "default" : "outline"}
                      size="sm"
                      className={cash >= skill.cost 
                        ? "bg-yellow-700 hover:bg-yellow-600"
                        : "border-yellow-900 text-yellow-400"
                      }
                    >
                      <DemonCoin amount={skill.cost} size="sm" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BreathingStyleTree;
