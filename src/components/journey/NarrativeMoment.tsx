
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Book, Sword, Trophy, Flame } from 'lucide-react';
import { BattleContext } from '@/types/battleTypes';

interface NarrativeMomentProps {
  type: 'battle' | 'victory' | 'decision';
  context?: BattleContext;
  options?: string[];
  onChoice?: (choice: string) => void;
  onDismiss: () => void;
}

const NarrativeMoment: React.FC<NarrativeMomentProps> = ({
  type,
  context,
  options = [],
  onChoice,
  onDismiss
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const getBattleNarrative = () => {
    if (!context || !context.debt) {
      return {
        title: "A New Challenge",
        description: "A demon appears before you, ready to test your resolve."
      };
    }
    
    switch (context.stance) {
      case 'aggressive':
        return {
          title: "Flame of Determination",
          description: `Your spirit burns with determination as you face ${context.debt.name}. The flame within you grows stronger, ready to strike with fury.`
        };
      case 'defensive':
        return {
          title: "Flowing Like Water",
          description: `You center yourself, calm as still water, as ${context.debt.name} looms before you. Your defensive stance will help you weather this storm.`
        };
      case 'risky':
        return {
          title: "Thunder in Your Veins",
          description: `Lightning courses through you as you prepare to face ${context.debt.name}. Your risky approach could yield great rewards... or costly failures.`
        };
      default:
        return {
          title: `Face to Face with ${context.debt.name}`,
          description: `The demon's aura radiates corruption and dread. You steel yourself for battle, knowing this won't be easy.`
        };
    }
  };
  
  const getVictoryNarrative = () => {
    if (!context || !context.debt) {
      return {
        title: "A Battle Won",
        description: "You stand victorious, the demon's power diminished by your resolve."
      };
    }
    
    if (context.debt.health <= 0) {
      return {
        title: "Demon Vanquished",
        description: `With a final strike, ${context.debt.name} howls in defeat. The curse binding it to you shatters, freeing part of your spirit.`
      };
    } else {
      return {
        title: "Demon Weakened",
        description: `Your attacks have wounded ${context.debt.name}, but it retreats to recover. You've won this round, but the battle continues.`
      };
    }
  };
  
  const getDecisionNarrative = () => {
    return {
      title: "Choose Your Path",
      description: "As you stand at the crossroads, your decision will shape your journey forward. What will you prioritize?"
    };
  };
  
  const getNarrative = () => {
    switch (type) {
      case 'battle': return getBattleNarrative();
      case 'victory': return getVictoryNarrative();
      case 'decision': return getDecisionNarrative();
      default: return {
        title: "Your Journey Continues",
        description: "What path will you choose next?"
      };
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'battle': return <Sword className="w-6 h-6 text-red-400" />;
      case 'victory': return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'decision': return <Flame className="w-6 h-6 text-blue-400" />;
      default: return <Book className="w-6 h-6 text-slate-400" />;
    }
  };
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onChoice) {
      onChoice(option);
    } else {
      // If no choice handler, just dismiss after selection
      setTimeout(() => onDismiss(), 800);
    }
  };
  
  const narrative = getNarrative();
  
  return (
    <motion.div 
      className="bg-slate-900/95 border border-slate-700 rounded-lg p-6 mb-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-blue-500 to-amber-500 opacity-80"></div>
      <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5 z-0"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-slate-800/80 border border-slate-700">
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-slate-100">{narrative.title}</h3>
        </div>
        
        <p className="text-slate-300 mb-6 leading-relaxed">{narrative.description}</p>
        
        <div className="space-y-3">
          {options.length > 0 ? (
            <AnimatePresence>
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => handleOptionSelect(option)}
                    variant={selectedOption === option ? "default" : "outline"}
                    className={`w-full py-4 justify-start text-left ${
                      selectedOption === option 
                        ? 'bg-amber-900/30 border-amber-600 text-amber-100' 
                        : 'border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{option}</span>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <Button 
              onClick={onDismiss}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-8"
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NarrativeMoment;
