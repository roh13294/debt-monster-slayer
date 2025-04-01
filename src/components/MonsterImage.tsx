
import React from 'react';
import { getMonsterImage } from '../utils/monsterImages';
import { getMonsterProfile } from '../utils/monsterProfiles';

interface MonsterImageProps {
  debtName: string;
  className?: string;
  isInBattle?: boolean;
  animateAttack?: boolean;
  animateSpecial?: boolean;
}

const MonsterImage: React.FC<MonsterImageProps> = ({ 
  debtName, 
  className = "", 
  isInBattle = false,
  animateAttack = false,
  animateSpecial = false
}) => {
  const imageSrc = getMonsterImage(debtName);
  const monsterProfile = getMonsterProfile(debtName);
  
  return (
    <div className={`relative ${isInBattle ? 'h-64' : 'h-48'} w-full overflow-hidden flex items-center justify-center ${className}`}>
      <div 
        className={`
          transform transition-all duration-500 
          ${animateAttack ? 'scale-110 -rotate-3' : ''} 
          ${animateSpecial ? 'scale-125 rotate-6 brightness-150' : ''}
          ${isInBattle ? 'hover:scale-105' : 'hover:scale-102'} 
          relative z-10
        `}
      >
        <img 
          src={imageSrc} 
          alt={`${monsterProfile.name} - ${debtName} Monster`} 
          className={`
            max-h-full max-w-full object-contain 
            ${isInBattle ? 'h-60' : 'h-44'} 
            drop-shadow-2xl
          `}
        />
      </div>
      
      {/* Visual effects for battle mode */}
      {isInBattle && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-0"></div>
          <div className="absolute -inset-1 bg-gradient-to-br from-transparent via-transparent to-black/20 z-0 rounded-xl"></div>
        </>
      )}
      
      {/* Special attack effect */}
      {animateSpecial && (
        <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full z-0"></div>
      )}
    </div>
  );
};

export default MonsterImage;
