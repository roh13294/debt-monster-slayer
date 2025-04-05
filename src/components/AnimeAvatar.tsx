
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Book, Shield, Sword, Flame, Sparkles, Zap } from 'lucide-react';

interface AnimeAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showAura?: boolean;
  showDetails?: boolean;
}

const AnimeAvatar: React.FC<AnimeAvatarProps> = ({ 
  className = '', 
  size = 'md', 
  showAura = true,
  showDetails = false
}) => {
  const { playerName, avatar, playerTraits, cash, totalDebt } = useGameContext();
  
  // Calculate wealth tier based on cash and debt ratio
  const calculateWealthTier = () => {
    if (totalDebt === 0) return 5; // Debt free is highest tier
    const ratio = cash / (totalDebt || 1);
    if (ratio >= 1) return 4;
    else if (ratio >= 0.5) return 3;
    else if (ratio >= 0.25) return 2;
    else return 1;
  };
  
  // Get aura color based on wealth tier
  const getAuraColor = () => {
    const tier = calculateWealthTier();
    switch (tier) {
      case 5: return 'from-demon-gold/50 to-demon-gold/10'; // Legendary
      case 4: return 'from-demon-purple/50 to-demon-purple/10'; // Epic
      case 3: return 'from-demon-blue/50 to-demon-blue/10'; // Rare
      case 2: return 'from-demon-teal/50 to-demon-teal/10'; // Uncommon
      default: return 'from-demon-red/30 to-demon-red/5'; // Common
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };
  
  // Get breathing style based on traits
  const getBreathingStyle = () => {
    const { discipline, courage, wisdom } = playerTraits;
    
    if (discipline > courage && discipline > wisdom) {
      return { name: 'Water Breathing', icon: <Shield className="w-4 h-4" />, color: 'water' };
    } else if (courage > discipline && courage > wisdom) {
      return { name: 'Flame Breathing', icon: <Flame className="w-4 h-4" />, color: 'flame' };
    } else {
      return { name: 'Thunder Breathing', icon: <Zap className="w-4 h-4" />, color: 'thunder' };
    }
  };
  
  const breathingStyle = getBreathingStyle();
  const tier = calculateWealthTier();
  const tierNames = ['Novice', 'Adept', 'Master', 'Hashira', 'Legend'];
  
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      {/* Aura effect */}
      {showAura && (
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getAuraColor()} blur-lg animate-breath-pulse -z-10`}></div>
      )}
      
      {/* Main avatar container */}
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-demon-black to-[#1f1f3a] border-2 border-demon-red/30 overflow-hidden z-0`}>
        {/* Background animation */}
        <div className="absolute inset-0 bg-night-sky"></div>
        
        {/* Breathing style kanji */}
        <div className={`absolute inset-0 kanji-${breathingStyle.color} kanji-bg opacity-20`}></div>
        
        {/* Character silhouette */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-white/10 rounded-full flex items-center justify-center">
            <Sword className="w-1/2 h-1/2 text-white/80" />
          </div>
        </div>
        
        {/* Tier indicator */}
        <div className="absolute bottom-1 right-1 bg-gradient-to-br from-demon-black to-[#1f1f3a] rounded-full w-6 h-6 flex items-center justify-center border border-demon-ember">
          <span className="text-xs text-demon-gold font-bold">{tier}</span>
        </div>
        
        {/* Breathing style indicator */}
        <div className="absolute top-1 left-1 bg-gradient-to-br from-demon-black to-[#1f1f3a] rounded-full w-6 h-6 flex items-center justify-center border border-demon-ember">
          {breathingStyle.icon}
        </div>
      </div>
      
      {/* Details section (optional) */}
      {showDetails && (
        <div className="mt-2 text-center">
          <h4 className={`text-sm font-bold ${breathingStyle.color}-breathing-text`}>
            {playerName || 'Slayer'}
          </h4>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Sparkles className="w-3 h-3 text-demon-gold" />
            <span className="text-xs text-white/80">{tierNames[tier-1]} {breathingStyle.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeAvatar;
