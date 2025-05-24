
import React from 'react';
import { motion } from 'framer-motion';
import ParticleField from './ParticleField';

interface AnimeCardProps {
  children: React.ReactNode;
  className?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  glowing?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({
  children,
  className = '',
  rarity,
  glowing = false,
  hoverable = true,
  onClick
}) => {
  const getRarityClass = () => {
    if (!rarity) return '';
    return `rarity-${rarity}`;
  };

  const getRarityColors = () => {
    switch (rarity) {
      case 'common': return ['#10b981', '#34d399'];
      case 'rare': return ['#3b82f6', '#60a5fa'];
      case 'epic': return ['#8b5cf6', '#a78bfa'];
      case 'legendary': return ['#f59e0b', '#ff2d55', '#fbbf24'];
      default: return ['#64748b', '#94a3b8'];
    }
  };

  return (
    <motion.div
      className={`demon-card relative ${hoverable ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hoverable ? { scale: 1.02, y: -4 } : {}}
      whileTap={hoverable ? { scale: 0.98 } : {}}
      onClick={onClick}
      transition={{ duration: 0.2 }}
    >
      {/* Rarity Border */}
      {rarity && (
        <div className={`demon-card-border ${getRarityClass()}`}>
          <div className="demon-card h-full w-full">
            {children}
          </div>
        </div>
      )}
      
      {/* Normal Card */}
      {!rarity && children}
      
      {/* Glowing Particles */}
      {glowing && (
        <ParticleField 
          count={8} 
          colors={getRarityColors()} 
          className="opacity-60"
        />
      )}
    </motion.div>
  );
};

export default AnimeCard;
