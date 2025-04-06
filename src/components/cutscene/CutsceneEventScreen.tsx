
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StanceOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  effect: string;
}

interface CutsceneEventScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStance: (stanceId: string) => void;
  isLoading?: boolean;
}

const CutsceneEventScreen: React.FC<CutsceneEventScreenProps> = ({
  isOpen,
  onClose,
  onSelectStance,
  isLoading = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showQuote, setShowQuote] = useState(true);
  
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setShowQuote(true);
      
      // Auto-hide the quote after 3 seconds
      const timer = setTimeout(() => {
        setShowQuote(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  const handleSelectOption = (optionId: string) => {
    if (isLoading) return;
    
    setSelectedOption(optionId);
    onSelectStance(optionId);
  };
  
  const stanceOptions: StanceOption[] = [
    {
      id: 'aggressive',
      title: 'Aggressive Slash',
      description: 'Focus your energy on slashing debt. Increases debt payment effectiveness by 15%.',
      icon: <Flame className="w-6 h-6 text-red-500" />,
      effect: 'Boost debt payment power'
    },
    {
      id: 'defensive',
      title: 'Defensive Guard',
      description: 'Take a cautious stance to protect your finances. Increases savings by 5%, reduces debt payment by 5%.',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      effect: 'Strengthen your savings'
    },
    {
      id: 'risky',
      title: 'Emotion Surge',
      description: 'Take a risk for potentially higher returns. Results are unpredictable!',
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      effect: 'High risk, high reward'
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const quoteVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <div className="relative w-full min-h-[50vh] overflow-hidden">
      {/* Animated background with particle effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {/* Animated particles using multiple psuedo elements via CSS */}
          <div className="absolute h-2 w-2 rounded-full bg-yellow-400 animate-float top-1/4 left-1/4"></div>
          <div className="absolute h-3 w-3 rounded-full bg-blue-400 animate-float-delayed top-3/4 left-2/3"></div>
          <div className="absolute h-2 w-2 rounded-full bg-purple-400 animate-float-slow top-2/3 left-1/3"></div>
          <div className="absolute h-4 w-4 rounded-full bg-red-400 animate-pulse-subtle top-1/2 left-3/4"></div>
        </div>
      </div>
      
      {/* Central content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-10 px-4">
        <AnimatePresence>
          {showQuote && (
            <motion.div 
              className="mb-12 text-center"
              variants={quoteVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <p className="text-2xl md:text-3xl font-bold text-white mb-3 text-shadow-glow">
                A new challenge awaits...
              </p>
              <p className="text-xl text-yellow-300 italic text-shadow-glow">
                "Choose your stance wisely, warrior."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Stance options */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stanceOptions.map((option) => (
            <motion.div 
              key={option.id} 
              variants={itemVariants}
              onClick={() => handleSelectOption(option.id)}
              className={`relative cursor-pointer group ${
                selectedOption === option.id ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900' : 
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className={`
                rounded-xl border p-4 transition-all duration-300
                ${option.id === 'aggressive' ? 'border-red-500/50 bg-gradient-to-br from-red-900/40 to-red-950/40' : ''}
                ${option.id === 'defensive' ? 'border-blue-500/50 bg-gradient-to-br from-blue-900/40 to-blue-950/40' : ''}
                ${option.id === 'risky' ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/40 to-purple-950/40' : ''}
                ${selectedOption === option.id ? 'transform scale-105' : 'hover:scale-105'}
                group-hover:shadow-glow-sm
              `}>
                <div className="flex items-center mb-3">
                  <div className={`
                    p-2 rounded-lg mr-3
                    ${option.id === 'aggressive' ? 'bg-gradient-to-br from-red-500 to-orange-600' : ''}
                    ${option.id === 'defensive' ? 'bg-gradient-to-br from-blue-500 to-cyan-600' : ''}
                    ${option.id === 'risky' ? 'bg-gradient-to-br from-purple-500 to-pink-600' : ''}
                  `}>
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{option.title}</h3>
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{option.description}</p>
                
                <div className={`
                  w-full text-center py-2 rounded-md text-sm font-medium
                  ${option.id === 'aggressive' ? 'bg-red-800/50 text-red-300' : ''}
                  ${option.id === 'defensive' ? 'bg-blue-800/50 text-blue-300' : ''}
                  ${option.id === 'risky' ? 'bg-purple-800/50 text-purple-300' : ''}
                `}>
                  {option.effect}
                </div>
                
                {/* Glow effect on hover */}
                <div className={`
                  absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${option.id === 'aggressive' ? 'bg-gradient-to-r from-red-600 to-orange-600' : ''}
                  ${option.id === 'defensive' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}
                  ${option.id === 'risky' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                  -z-10 blur-sm
                `}></div>
              </div>
              
              {/* Selection indicator */}
              {selectedOption === option.id && isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                  <div className="h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CutsceneEventScreen;
