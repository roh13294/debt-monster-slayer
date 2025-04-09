
import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Flame, Droplets, Zap, Wind, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SkillTreeProps {
  isOpen: boolean;
  onClose: () => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ isOpen, onClose }) => {
  const { shadowForm } = useGameContext();
  const [activeTab, setActiveTab] = useState('flame');
  
  // Would be maintained in context in full implementation
  const [breathingXP] = useState(5);
  
  const getTabIcon = (type: string) => {
    switch(type) {
      case 'flame': return <Flame className="h-4 w-4" />;
      case 'water': return <Droplets className="h-4 w-4" />;
      case 'thunder': return <Zap className="h-4 w-4" />;
      case 'wind': return <Wind className="h-4 w-4" />;
      case 'shadow': return <Eye className="h-4 w-4" />;
      default: return <Flame className="h-4 w-4" />;
    }
  };
  
  const getTabColor = (type: string) => {
    switch(type) {
      case 'flame': return {
        bg: 'from-red-600 to-orange-500',
        text: 'text-red-400',
        border: 'border-red-500/30'
      };
      case 'water': return {
        bg: 'from-blue-600 to-cyan-500',
        text: 'text-blue-400',
        border: 'border-blue-500/30'
      };
      case 'thunder': return {
        bg: 'from-purple-600 to-violet-500',
        text: 'text-purple-400',
        border: 'border-purple-500/30'
      };
      case 'wind': return {
        bg: 'from-green-600 to-emerald-500',
        text: 'text-green-400',
        border: 'border-green-500/30'
      };
      case 'shadow': return {
        bg: 'from-gray-600 to-slate-500',
        text: 'text-gray-400',
        border: 'border-gray-500/30'
      };
      default: return {
        bg: 'from-red-600 to-orange-500',
        text: 'text-red-400',
        border: 'border-red-500/30'
      };
    }
  };
  
  // Show shadow breathing tab only if the player has a shadow form
  const showShadowTab = shadowForm !== null;
  
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
              <div className="bg-slate-800/70 px-4 py-2 rounded-lg border border-slate-600/30">
                <span className="text-gray-400 text-sm">Breathing XP: </span>
                <span className="text-blue-400 font-bold">{breathingXP}</span>
              </div>
              
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
                {/* Flame Breathing Tree */}
                <TabsContent value="flame" className="h-full">
                  <BreathingTreeContent type="flame" breathingXP={breathingXP} />
                </TabsContent>
                
                {/* Water Breathing Tree */}
                <TabsContent value="water" className="h-full">
                  <BreathingTreeContent type="water" breathingXP={breathingXP} />
                </TabsContent>
                
                {/* Thunder Breathing Tree */}
                <TabsContent value="thunder" className="h-full">
                  <BreathingTreeContent type="thunder" breathingXP={breathingXP} />
                </TabsContent>
                
                {/* Wind Breathing Tree */}
                <TabsContent value="wind" className="h-full">
                  <BreathingTreeContent type="wind" breathingXP={breathingXP} />
                </TabsContent>
                
                {/* Shadow Breathing Tree */}
                <TabsContent value="shadow" className="h-full">
                  <BreathingTreeContent type="shadow" breathingXP={breathingXP} />
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
}

const BreathingTreeContent: React.FC<BreathingTreeContentProps> = ({ type, breathingXP }) => {
  const colors = getTypeColors(type);
  
  // Simplified tree structure - in full implementation this would be more complex and interactive
  return (
    <div className="relative h-full w-full">
      {/* Tree structure with SVG lines would go here */}
      <svg className="absolute top-0 left-0 h-full w-full" style={{ zIndex: 1 }}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.line} />
          </marker>
        </defs>
        
        {/* Tier 1 to Tier 2 */}
        <line x1="50%" y1="110" x2="25%" y2="230" stroke={colors.line} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="50%" y1="110" x2="75%" y2="230" stroke={colors.line} strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Tier 2 to Tier 3 */}
        <line x1="25%" y1="310" x2="50%" y2="430" stroke={colors.line} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="75%" y1="310" x2="50%" y2="430" stroke={colors.line} strokeWidth="2" markerEnd="url(#arrowhead)" />
      </svg>
      
      {/* Tier 1 Node */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-10" style={{ zIndex: 2 }}>
        <SkillNode 
          type={type} 
          tier={1} 
          name={`Basic ${capitalizeFirst(type)} Breathing`}
          description={`Master the fundamentals of ${type} breathing techniques.`}
          xpCost={3}
          unlocked={breathingXP >= 3}
        />
      </div>
      
      {/* Tier 2 Nodes */}
      <div className="absolute left-1/4 transform -translate-x-1/2 top-[230px]" style={{ zIndex: 2 }}>
        <SkillNode 
          type={type} 
          tier={2} 
          name={`${capitalizeFirst(type)} Burst`}
          description={`Channel ${type} energy in a powerful direct attack.`}
          xpCost={6}
          unlocked={breathingXP >= 6}
        />
      </div>
      
      <div className="absolute left-3/4 transform -translate-x-1/2 top-[230px]" style={{ zIndex: 2 }}>
        <SkillNode 
          type={type} 
          tier={2} 
          name={`${capitalizeFirst(type)} Aura`}
          description={`Create a protective ${type} aura around yourself.`}
          xpCost={6}
          unlocked={breathingXP >= 6}
        />
      </div>
      
      {/* Tier 3 Node */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[430px]" style={{ zIndex: 2 }}>
        <SkillNode 
          type={type} 
          tier={3} 
          name={`Ultimate ${capitalizeFirst(type)} Technique`}
          description={`A legendary breathing technique of immense power.`}
          xpCost={12}
          unlocked={breathingXP >= 12}
          isUltimate
        />
      </div>
    </div>
  );
};

interface SkillNodeProps {
  type: 'flame' | 'water' | 'thunder' | 'wind' | 'shadow';
  tier: 1 | 2 | 3;
  name: string;
  description: string;
  xpCost: number;
  unlocked: boolean;
  isUltimate?: boolean;
}

const SkillNode: React.FC<SkillNodeProps> = ({ 
  type, 
  tier, 
  name, 
  description, 
  xpCost,
  unlocked,
  isUltimate
}) => {
  const colors = getTypeColors(type);
  
  const handleUnlockSkill = () => {
    // This would be implemented in the full version
    toast({
      title: "Coming Soon",
      description: "Skill unlocking will be available in the next update!",
      variant: "default",
    });
  };
  
  return (
    <div className={`
      w-56 p-4 rounded-lg border ${unlocked ? colors.border : 'border-gray-700'} 
      ${unlocked ? colors.bg : 'bg-gray-800/80'} 
      ${isUltimate && unlocked ? 'animate-pulse shadow-lg' : ''}
      transition-all hover:shadow-md
    `}>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-bold ${unlocked ? colors.text : 'text-gray-400'}`}>{name}</h3>
        <div className={`px-2 py-0.5 rounded text-xs font-medium ${unlocked ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-700 text-gray-400'}`}>
          Tier {tier}
        </div>
      </div>
      
      <p className={`text-xs mb-3 ${unlocked ? 'text-gray-300' : 'text-gray-500'}`}>
        {description}
      </p>
      
      <div className="flex justify-between items-center">
        <span className={`text-xs ${unlocked ? 'text-amber-400' : 'text-gray-500'}`}>
          {xpCost} XP
        </span>
        
        <Button 
          variant={unlocked ? "default" : "outline"}
          size="sm"
          disabled={!unlocked}
          onClick={handleUnlockSkill}
          className={`text-xs ${!unlocked ? 'opacity-50' : ''}`}
        >
          {unlocked ? 'Learn' : 'Locked'}
        </Button>
      </div>
    </div>
  );
};

// Helper functions

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

export default SkillTree;
