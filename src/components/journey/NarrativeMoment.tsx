
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';

interface NarrativeMomentProps {
  type: 'battle' | 'victory' | 'decision';
  context?: any;
  onDismiss?: () => void;
  autoHide?: boolean;
}

const NarrativeMoment: React.FC<NarrativeMomentProps> = ({ 
  type, 
  context, 
  onDismiss,
  autoHide = true
}) => {
  const { playerTraits } = useGameContext();
  const [isVisible, setIsVisible] = useState(true);
  const [currentQuote, setCurrentQuote] = useState("");
  
  // Generate a narrative moment based on context and player traits
  useEffect(() => {
    const generateNarrativeQuote = () => {
      // Battle quotes - contextual to combat situations
      const battleQuotes = [
        "Every strike against these demons is a step toward freedom.",
        "The path is long, but each battle makes me stronger.",
        "I can see the patterns in how these demons move and attack.",
        "Focus. Breathe. Strike with purpose, not just force.",
        "This challenge reveals more about myself than my enemy."
      ];
      
      // Victory quotes - for when player succeeds
      const victoryQuotes = [
        "One more burden lifted, one more step toward freedom.",
        "The weight feels lighter with each demon vanquished.",
        "Progress isn't always visible, but it's always real.",
        "Small victories lead to significant change over time.",
        "Each success reveals a clearer path forward."
      ];
      
      // Decision quotes - for moments of choice
      const decisionQuotes = [
        "My choices shape my path more than my circumstances.",
        "Wisdom isn't avoiding all risks, but knowing which are worth taking.",
        "Each decision carries weight, but none define the entire journey.",
        "The path becomes clear when I listen to my instincts.",
        "Sometimes the hardest choices yield the greatest growth."
      ];
      
      // Trait-specific quotes
      const disciplineQuotes = playerTraits.discipline > 6 ? [
        "Consistency carves the path to freedom, not occasional effort.",
        "My disciplined approach transforms difficulty into routine."
      ] : [];
      
      const determinationQuotes = playerTraits.determination > 6 ? [
        "My resolve is my greatest weapon against these demons.",
        "Where others fall, I endure. Where others quit, I persist."
      ] : [];
      
      const knowledgeQuotes = playerTraits.financialKnowledge > 6 ? [
        "Knowledge illuminates the demons' weaknesses.",
        "Understanding the nature of my challenges reveals paths to overcome them."
      ] : [];
      
      // Add context-specific quotes if we have a debt context
      const contextQuotes = [];
      if (context?.debt) {
        if (type === 'battle') {
          contextQuotes.push(
            `This ${context.debt.name} demon's power comes from binding others with its chains.`,
            `I can sense ${context.debt.name}'s weakness - consistent attacks will overcome it.`
          );
        } else if (type === 'victory') {
          contextQuotes.push(
            `The ${context.debt.name} demon fades, its power over me weakening.`,
            `One less chain binding my spirit. ${context.debt.name} no longer controls my path.`
          );
        }
      }
      
      // Style-specific quotes based on stance
      const stanceQuotes = [];
      if (context?.stance) {
        switch(context.stance) {
          case 'aggressive':
            stanceQuotes.push(
              "My flame burns through obstacles, leaving only victory.",
              "The hotter the flame, the quicker the battle ends."
            );
            break;
          case 'defensive':
            stanceQuotes.push(
              "Like water, I flow around obstacles rather than forcing through them.",
              "Patience creates openings that haste overlooks."
            );
            break;
          case 'risky':
            stanceQuotes.push(
              "The lightning strike doesn't announce itself before impact.",
              "Fortune favors the bold and punishes hesitation."
            );
            break;
        }
      }
      
      // Select appropriate quote set based on narrative moment type
      let quotePool: string[] = [];
      
      switch(type) {
        case 'battle':
          quotePool = [...battleQuotes, ...disciplineQuotes, ...contextQuotes, ...stanceQuotes];
          break;
        case 'victory':
          quotePool = [...victoryQuotes, ...determinationQuotes, ...contextQuotes];
          break;
        case 'decision':
          quotePool = [...decisionQuotes, ...knowledgeQuotes];
          break;
        default:
          quotePool = battleQuotes;
      }
      
      // Select random quote from the combined pool
      return quotePool[Math.floor(Math.random() * quotePool.length)];
    };
    
    setCurrentQuote(generateNarrativeQuote());
    
    // Auto-hide after delay if enabled
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          setTimeout(onDismiss, 500); // Allow animation to complete
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [type, context, playerTraits, autoHide, onDismiss]);
  
  // Determine the appropriate color class based on the narrative type
  const getColorClass = () => {
    switch(type) {
      case 'battle': return 'text-slate-300';
      case 'victory': return 'text-emerald-300';
      case 'decision': return 'text-amber-300';
      default: return 'text-slate-300';
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.5 }}
          className={`text-center p-4 ${type === 'victory' ? 'shadow-glow-amber' : ''}`}
        >
          <blockquote className={`italic ${getColorClass()} text-lg font-medium px-6 relative`}>
            <span className="text-3xl absolute -top-2 left-0 text-slate-500">"</span>
            {currentQuote}
            <span className="text-3xl absolute -bottom-2 right-0 text-slate-500">"</span>
          </blockquote>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NarrativeMoment;
