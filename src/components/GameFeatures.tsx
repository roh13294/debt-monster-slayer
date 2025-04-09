
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sword, Wind, Flame, Award } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import BreathingStyleTree from '@/components/skills/BreathingStyleTree';
import DemonRun from './runs/DemonRun';

const GameFeatures: React.FC = () => {
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showDemonRun, setShowDemonRun] = useState(false);
  
  return (
    <div className="card-fun">
      <h2 className="text-xl font-bold flex items-center mb-4">
        <span className="p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-md mr-2">
          <Flame size={18} className="animate-pulse-subtle" />
        </span>
        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Slayer Training Grounds
        </span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Button
          onClick={() => setShowSkillTree(true)}
          variant="outline"
          className="h-auto py-6 flex flex-col items-center justify-center gap-3 border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 hover:from-indigo-900/30 hover:to-purple-900/30"
        >
          <Wind className="h-8 w-8 text-indigo-400" />
          <div className="text-center">
            <h3 className="font-medium text-indigo-300">Breathing Style</h3>
            <p className="text-xs text-slate-400">Master powerful techniques</p>
          </div>
        </Button>
        
        <Button
          onClick={() => setShowDemonRun(true)}
          variant="outline"
          className="h-auto py-6 flex flex-col items-center justify-center gap-3 border-red-500/30 bg-gradient-to-br from-red-900/20 to-amber-900/20 hover:from-red-900/30 hover:to-amber-900/30"
        >
          <Sword className="h-8 w-8 text-red-400" />
          <div className="text-center">
            <h3 className="font-medium text-red-300">Demon Run</h3>
            <p className="text-xs text-slate-400">Face a gauntlet of demons</p>
          </div>
        </Button>
      </div>
      
      {/* Uncomment when implementing additional features */}
      {/* <div className="text-center mt-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-slate-400 text-xs"
          onClick={() => {}}
        >
          <Award className="h-3 w-3 mr-1" />
          View All Training Options
        </Button>
      </div> */}
      
      {showSkillTree && (
        <div className="my-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
              <Wind className="w-5 h-5 text-indigo-400" />
              Breathing Style Techniques
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSkillTree(false)}>
              Close
            </Button>
          </div>
          <BreathingStyleTree />
        </div>
      )}
      
      <DemonRun isOpen={showDemonRun} onClose={() => setShowDemonRun(false)} />
    </div>
  );
};

export default GameFeatures;
