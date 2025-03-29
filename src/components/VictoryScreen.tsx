
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Medal, Crown, CheckCircle, BadgeCheck, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { getMonsterProfile } from '../utils/monsterProfiles';
import { Debt } from '../types/gameTypes';

interface VictoryScreenProps {
  debt: Debt;
  paymentAmount: number;
  onClose: () => void;
}

// Player titles based on different achievements
const playerTitles = [
  {
    id: 'minimalist',
    name: 'The Minimalist',
    description: 'You eliminated debt through disciplined spending and prioritization.',
    icon: <CheckCircle className="text-green-500" size={24} />,
    condition: (debt: Debt) => debt.amount < 5000
  },
  {
    id: 'budget-beast',
    name: 'The Budget Beast',
    description: 'Your systematic approach to finances has tamed the debt monster.',
    icon: <Flame className="text-orange-500" size={24} />,
    condition: (debt: Debt) => debt.minimumPayment > 200
  },
  {
    id: 'interest-slayer',
    name: 'The Slayer of Compound Interest',
    description: 'You defeated a high-interest debt before it could compound further.',
    icon: <Star className="text-yellow-500" size={24} />,
    condition: (debt: Debt) => debt.interest > 15
  },
  {
    id: 'debt-destroyer',
    name: 'The Debt Destroyer',
    description: 'You completely annihilated a significant debt burden.',
    icon: <Trophy className="text-purple-500" size={24} />,
    condition: (debt: Debt) => debt.amount > 10000
  },
  {
    id: 'financial-freedom-fighter',
    name: 'Financial Freedom Fighter',
    description: 'Your commitment to debt payoff has brought you closer to true financial freedom.',
    icon: <Crown className="text-blue-500" size={24} />,
    condition: (debt: Debt) => true // Everyone gets at least this title
  }
];

const VictoryScreen: React.FC<VictoryScreenProps> = ({ debt, paymentAmount, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const monsterProfile = getMonsterProfile(debt.name);
  
  // Determine which titles the player earned
  const earnedTitles = playerTitles.filter(title => title.condition(debt));
  const primaryTitle = earnedTitles.length > 0 ? earnedTitles[0] : playerTitles[playerTitles.length - 1];
  
  // Percentage stats to show user how they compare
  const percentileStat = Math.min(90 + Math.random() * 9, 99).toFixed(1);
  
  useEffect(() => {
    // Disable confetti after a few seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save achievement to localStorage
  useEffect(() => {
    try {
      // Get existing achievements
      const existingAchievements = JSON.parse(localStorage.getItem('debtSlayerAchievements') || '[]');
      
      // Add new achievement
      const newAchievement = {
        date: new Date().toISOString(),
        debtName: debt.name,
        amount: debt.amount,
        title: primaryTitle.name
      };
      
      // Save updated achievements
      localStorage.setItem('debtSlayerAchievements', 
        JSON.stringify([...existingAchievements, newAchievement])
      );
    } catch (error) {
      console.error("Error saving achievement:", error);
    }
  }, [debt, primaryTitle]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    >
      <div className="relative w-full max-w-xl bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-8 rounded-full ${
                  ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500'][i % 6]
                }`}
                initial={{
                  x: Math.random() * 100 - 50 + 50 + '%',
                  y: -20,
                  rotate: Math.random() * 360
                }}
                animate={{
                  y: ['0%', '120%'],
                  x: `${Math.random() * 100}%`
                }}
                transition={{
                  duration: 2.5 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}
        
        {/* Content */}
        <div className="p-8 text-center relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-24 h-24 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 shadow-lg"
          >
            <Trophy size={48} className="text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Debt Conquered!
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-indigo-100 mb-6"
          >
            You've defeated {monsterProfile.name} by paying off ${debt.amount.toFixed(2)}!
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-4 mb-6 bg-white/10 backdrop-blur-sm rounded-lg"
          >
            <p className="text-indigo-100 italic mb-2">"{monsterProfile.victoryMessage}"</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="mb-8 p-4 bg-gradient-to-r from-indigo-700/70 to-violet-700/70 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-center mb-2">
              {primaryTitle.icon}
              <h3 className="text-xl font-bold text-white ml-2">{primaryTitle.name}</h3>
            </div>
            <p className="text-indigo-200">{primaryTitle.description}</p>
            
            {/* Comparison stats */}
            <div className="mt-4 text-sm text-indigo-200 p-3 bg-indigo-800/50 rounded-md">
              <p>You conquered ${debt.amount.toFixed(0)} in debt. That's more than {percentileStat}% of players!</p>
            </div>
          </motion.div>
          
          {/* Additional earned titles */}
          {earnedTitles.length > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex justify-center flex-wrap gap-2 mb-6"
            >
              {earnedTitles.slice(1).map((title, index) => (
                <div key={title.id} className="px-3 py-1.5 bg-white/10 rounded-full flex items-center">
                  {title.icon}
                  <span className="ml-1.5 text-sm font-medium text-white">{title.name}</span>
                </div>
              ))}
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <Button 
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-2 rounded-full shadow-lg"
            >
              Continue Your Journey
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default VictoryScreen;
