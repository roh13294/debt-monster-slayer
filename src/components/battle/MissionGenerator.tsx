
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';
import { Debt } from '@/types/gameTypes';
import { Target, Sword, Flame, RotateCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDemonElementType } from '@/utils/monsterImages';
import { toast } from '@/hooks/use-toast';
import { generateBattleMission } from '@/utils/missionGenerator';

interface MissionGeneratorProps {
  onMissionStart: (selectedDemons: Debt[], stance: string) => void;
  onCancel: () => void;
}

const MissionGenerator: React.FC<MissionGeneratorProps> = ({ onMissionStart, onCancel }) => {
  const { debts, playerTraits, cash } = useGameContext();
  const [selectedDemons, setSelectedDemons] = useState<Debt[]>([]);
  const [availableDemons, setAvailableDemons] = useState<Debt[]>([]);
  const [selectedStance, setSelectedStance] = useState<string>('aggressive');
  const [difficultyModifiers, setDifficultyModifiers] = useState<{
    shadowSurge: boolean;
    moonlessNight: boolean;
    inflationPulse: boolean;
  }>({
    shadowSurge: false,
    moonlessNight: false,
    inflationPulse: false
  });
  const [missionDescription, setMissionDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  // Generate available demons for the mission
  useEffect(() => {
    if (debts.length === 0) {
      toast({
        title: "No Demons Available",
        description: "There are no debt demons to battle. Your path is clear!",
        variant: "destructive",
      });
      onCancel();
      return;
    }

    setIsGenerating(true);
    
    // Select 3-5 demons based on current debt pool
    const demonCount = Math.min(Math.max(3, Math.ceil(debts.length / 2)), 5);
    const shuffledDemons = [...debts].sort(() => Math.random() - 0.5);
    const selectedDemons = shuffledDemons.slice(0, demonCount);
    
    // Apply difficulty modifiers
    const hasShadowSurge = Math.random() > 0.7;
    const hasMoonlessNight = Math.random() > 0.8;
    const hasInflationPulse = Math.random() > 0.75;
    
    setAvailableDemons(selectedDemons);
    setSelectedDemons(selectedDemons.slice(0, 1)); // Initially select first demon
    setDifficultyModifiers({
      shadowSurge: hasShadowSurge,
      moonlessNight: hasMoonlessNight,
      inflationPulse: hasInflationPulse
    });
    
    // Generate mission description
    const mission = generateBattleMission(selectedDemons, {
      shadowSurge: hasShadowSurge,
      moonlessNight: hasMoonlessNight,
      inflationPulse: hasInflationPulse
    });
    setMissionDescription(mission.description);
    
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  }, [debts]);

  // Toggle demon selection
  const toggleDemonSelection = (demon: Debt) => {
    if (selectedDemons.find(d => d.id === demon.id)) {
      if (selectedDemons.length > 1) {
        setSelectedDemons(prev => prev.filter(d => d.id !== demon.id));
      } else {
        toast({
          title: "Selection Required",
          description: "You must select at least one demon to battle.",
          variant: "destructive",
        });
      }
    } else {
      setSelectedDemons(prev => [...prev, demon]);
    }
  };

  const handleStanceSelection = (stance: string) => {
    setSelectedStance(stance);
  };

  const handleStartMission = () => {
    if (selectedDemons.length === 0) {
      toast({
        title: "No Demons Selected",
        description: "You must select at least one demon to battle.",
        variant: "destructive",
      });
      return;
    }
    
    onMissionStart(selectedDemons, selectedStance);
  };

  // Calculate total mission difficulty
  const calculateMissionDifficulty = () => {
    if (selectedDemons.length === 0) return 0;
    
    const baseScore = selectedDemons.reduce((sum, demon) => sum + demon.balance, 0) / cash;
    const modifierScore = 
      (difficultyModifiers.shadowSurge ? 0.2 : 0) + 
      (difficultyModifiers.moonlessNight ? 0.15 : 0) + 
      (difficultyModifiers.inflationPulse ? 0.25 : 0);
    
    const totalScore = baseScore + modifierScore;
    
    if (totalScore > 2.5) return "Extreme";
    if (totalScore > 1.8) return "Hard";
    if (totalScore > 1.2) return "Medium";
    return "Manageable";
  };

  return (
    <motion.div 
      className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-lg p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Sword className="w-6 h-6 mr-2 text-amber-400" />
          New Mission Available
        </h2>
        
        <div className="bg-slate-800/50 p-4 rounded-md border border-amber-800/30 mb-4">
          <h3 className="text-lg font-semibold text-amber-300 mb-2">Mission Briefing</h3>
          {isGenerating ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <p className="text-slate-300 italic">{missionDescription}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-3 rounded-md border ${difficultyModifiers.shadowSurge ? 'bg-purple-900/30 border-purple-700' : 'bg-slate-800/30 border-slate-700'}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-white">Shadow Surge</h4>
              <div className={`h-3 w-3 rounded-full ${difficultyModifiers.shadowSurge ? 'bg-purple-400' : 'bg-slate-600'}`}></div>
            </div>
            <p className="text-xs text-slate-300">Demons gain +10% HP due to shadow influence</p>
          </div>
          
          <div className={`p-3 rounded-md border ${difficultyModifiers.moonlessNight ? 'bg-blue-900/30 border-blue-700' : 'bg-slate-800/30 border-slate-700'}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-white">Moonless Night</h4>
              <div className={`h-3 w-3 rounded-full ${difficultyModifiers.moonlessNight ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
            </div>
            <p className="text-xs text-slate-300">Reduced loot drops from defeated demons</p>
          </div>
          
          <div className={`p-3 rounded-md border ${difficultyModifiers.inflationPulse ? 'bg-red-900/30 border-red-700' : 'bg-slate-800/30 border-slate-700'}`}>
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-white">Inflation Pulse</h4>
              <div className={`h-3 w-3 rounded-full ${difficultyModifiers.inflationPulse ? 'bg-red-400' : 'bg-slate-600'}`}></div>
            </div>
            <p className="text-xs text-slate-300">Demons deal increased interest-based damage</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-white">Select Targets</h3>
            <div className="bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
              Difficulty: {calculateMissionDifficulty()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableDemons.map(demon => {
              const isSelected = selectedDemons.some(d => d.id === demon.id);
              const elementType = getDemonElementType(demon.name);
              
              return (
                <motion.div
                  key={demon.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-700/80 border-amber-500 border-2' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'
                  }`}
                  onClick={() => toggleDemonSelection(demon)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-white">{demon.name}</h4>
                    <div className="flex items-center">
                      <div className={`px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                        elementType === 'fire' ? 'bg-red-900/70 text-red-300' :
                        elementType === 'water' ? 'bg-blue-900/70 text-blue-300' :
                        elementType === 'lightning' ? 'bg-purple-900/70 text-purple-300' :
                        'bg-yellow-900/70 text-yellow-300'
                      }`}>
                        {elementType}
                      </div>
                      {isSelected && <Target className="w-4 h-4 text-amber-400" />}
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Curse Power:</span>
                      <span className="text-amber-300">{demon.amount.toLocaleString()} HP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className={demon.interestRate > 10 ? 'text-red-400' : 'text-slate-300'}>
                        {demon.interestRate}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-2">Select Breathing Style</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.button
              className={`p-3 rounded-md flex flex-col items-center ${
                selectedStance === 'aggressive' ? 'bg-red-900/50 border-2 border-red-500' : 'bg-slate-800 border border-slate-700'
              }`}
              onClick={() => handleStanceSelection('aggressive')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Flame className={`w-6 h-6 ${selectedStance === 'aggressive' ? 'text-red-400' : 'text-slate-400'}`} />
              <span className="mt-1 text-sm">Flame Breathing</span>
              <span className="text-xs text-slate-400 mt-1">+20% damage</span>
            </motion.button>
            
            {/* Add other stance options here as needed */}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          className="bg-slate-800 hover:bg-slate-700 border-slate-600"
          onClick={onCancel}
        >
          <RotateCw className="w-4 h-4 mr-2" /> Shuffle Targets
        </Button>
        
        <Button 
          className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white"
          onClick={handleStartMission}
        >
          Begin Mission <Sword className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
};

export default MissionGenerator;
