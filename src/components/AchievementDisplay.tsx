
import React, { useState, useEffect } from 'react';
import { Trophy, Award, Crown, Star, Scroll, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Achievement {
  date: string;
  debtName: string;
  amount: number;
  title: string;
}

const AchievementDisplay: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Load achievements from localStorage
  useEffect(() => {
    try {
      const savedAchievements = JSON.parse(localStorage.getItem('debtSlayerAchievements') || '[]');
      setAchievements(savedAchievements);
    } catch (error) {
      console.error("Error loading achievements:", error);
      setAchievements([]);
    }
  }, []);
  
  // Auto-rotate achievements
  useEffect(() => {
    if (achievements.length <= 1) return;
    
    const timer = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex(prevIndex => (prevIndex + 1) % achievements.length);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [achievements, isAnimating]);
  
  const handleNext = () => {
    if (isAnimating || achievements.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prevIndex => (prevIndex + 1) % achievements.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const handlePrev = () => {
    if (isAnimating || achievements.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex(prevIndex => (prevIndex - 1 + achievements.length) % achievements.length);
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  // If no achievements, display a placeholder
  if (achievements.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-gray-400" size={18} />
          <h3 className="text-gray-600 font-medium">Your Achievements</h3>
        </div>
        <div className="text-center py-4">
          <div className="inline-block p-3 bg-gray-200 rounded-full mb-2">
            <Award className="text-gray-400" size={24} />
          </div>
          <p className="text-sm text-gray-500">No achievements yet</p>
          <p className="text-xs text-gray-400 mt-1">Defeat debt monsters to earn titles and achievements</p>
        </div>
      </div>
    );
  }
  
  const currentAchievement = achievements[currentIndex];
  const formattedDate = new Date(currentAchievement.date).toLocaleDateString();

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="text-indigo-600" size={18} />
          <h3 className="text-indigo-800 font-medium">Your Achievements</h3>
        </div>
        
        {achievements.length > 1 && (
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 rounded-full"
              onClick={handlePrev}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 rounded-full"
              onClick={handleNext}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg mr-3">
              {currentAchievement.title.includes('Beast') ? (
                <Crown className="text-white" size={24} />
              ) : currentAchievement.title.includes('Slayer') ? (
                <Award className="text-white" size={24} />
              ) : (
                <Star className="text-white" size={24} />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className="font-bold text-gray-800">{currentAchievement.title}</h4>
              <p className="text-sm text-gray-600">
                You defeated {currentAchievement.debtName} worth ${currentAchievement.amount.toFixed(2)}
              </p>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Scroll size={12} className="mr-1" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {achievements.length > 1 && (
        <div className="flex justify-center mt-2">
          {achievements.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 w-1.5 rounded-full mx-0.5 ${
                index === currentIndex ? 'bg-indigo-500' : 'bg-indigo-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AchievementDisplay;
