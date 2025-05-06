
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Shield, Flame, AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Debt } from '@/types/gameTypes';
import { getDemonElementType } from '@/utils/monsterImages';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface DemonQueueProps {
  demons: Debt[];
  activeTargetId: string;
  onSwitchTarget: (demonId: string) => void;
  spiritCost: number;
  cash: number;
  ragePhase?: boolean;
  frenzyPhase?: boolean;
}

const DemonQueue: React.FC<DemonQueueProps> = ({
  demons,
  activeTargetId,
  onSwitchTarget,
  spiritCost,
  cash,
  ragePhase = false,
  frenzyPhase = false
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 3 });
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Calculate how many demons can be shown at once based on screen size
  useEffect(() => {
    const handleResize = () => {
      // This is a simple responsive calculation, adjust as needed
      const maxVisible = window.innerWidth < 640 ? 1 : 
                          window.innerWidth < 1024 ? 2 : 3;
      
      setVisibleRange(prev => ({
        start: prev.start,
        end: prev.start + maxVisible
      }));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleTargetSwitch = (demonId: string) => {
    if (demonId === activeTargetId) return;
    
    // Check if player has enough spirit energy to switch
    if (cash < spiritCost) {
      toast({
        title: "Not Enough Spirit Energy",
        description: `You need ${spiritCost} spirit energy to change targets.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsAnimating(true);
    onSwitchTarget(demonId);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };
  
  const scrollLeft = () => {
    if (visibleRange.start > 0) {
      setVisibleRange(prev => ({
        start: prev.start - 1,
        end: prev.end - 1
      }));
    }
  };
  
  const scrollRight = () => {
    if (visibleRange.end < demons.length) {
      setVisibleRange(prev => ({
        start: prev.start + 1,
        end: prev.end + 1
      }));
    }
  };
  
  // If there are no demons, don't render anything
  if (!demons || demons.length === 0) return null;
  
  // Filter the visible demons
  const visibleDemons = demons.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-white text-sm flex items-center">
          <Target className="w-4 h-4 mr-1 text-amber-400" />
          Demon Targets ({demons.length})
        </h3>
        <div className="text-xs text-slate-400">
          Target Switch Cost: <span className="text-amber-400">{spiritCost}</span> Spirit
        </div>
      </div>
      
      <div className="flex items-center">
        {visibleRange.start > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto aspect-square" 
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex-1 flex space-x-2 overflow-hidden">
          <AnimatePresence mode="wait">
            {visibleDemons.map(demon => {
              const isActive = demon.id === activeTargetId;
              const elementType = getDemonElementType(demon.name);
              
              return (
                <motion.div
                  key={demon.id}
                  className={`flex-1 min-w-[100px] rounded-md cursor-pointer border ${
                    isActive 
                      ? 'bg-slate-800 border-amber-500' 
                      : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                  }`}
                  onClick={() => handleTargetSwitch(demon.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isActive ? 1.05 : 1,
                    y: isActive ? -4 : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2">
                    <div className="flex justify-between items-start">
                      <div className="text-sm font-medium text-white truncate mr-1" style={{maxWidth: '70%'}}>
                        {demon.name}
                      </div>
                      <div className={`px-1.5 py-0.5 rounded text-[10px] ${
                        elementType === 'fire' ? 'bg-red-900/70 text-red-300' :
                        elementType === 'water' ? 'bg-blue-900/70 text-blue-300' :
                        elementType === 'lightning' ? 'bg-purple-900/70 text-purple-300' :
                        'bg-yellow-900/70 text-yellow-300'
                      }`}>
                        {elementType}
                      </div>
                    </div>
                    
                    <div className="mt-1.5">
                      <Progress 
                        value={demon.health} 
                        className={`h-1.5 ${
                          demon.health > 70 ? 'bg-red-500' :
                          demon.health > 30 ? 'bg-amber-500' :
                          'bg-green-500'
                        }`}
                      />
                    </div>
                    
                    <div className="mt-1.5 flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        {new Intl.NumberFormat('en-US', {
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(demon.balance)} HP
                      </span>
                      
                      {isActive && (
                        <Target className="w-3 h-3 text-amber-400" />
                      )}
                    </div>
                  </div>
                  
                  {(ragePhase || frenzyPhase) && isActive && (
                    <div className={`px-2 py-0.5 text-center text-[10px] font-medium ${
                      frenzyPhase ? 'bg-red-900 text-red-200' : 'bg-amber-900 text-amber-200'
                    }`}>
                      {frenzyPhase ? 'FRENZY' : 'RAGE'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        {visibleRange.end < demons.length && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 h-auto aspect-square" 
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default DemonQueue;
