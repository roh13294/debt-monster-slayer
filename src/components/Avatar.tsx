
import React from 'react';
import { User, Shield, Sword, Zap, Crown } from 'lucide-react';

interface AvatarProps {
  avatarType: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarType, className = '' }) => {
  const getAvatarContent = () => {
    switch (avatarType) {
      case 'warrior':
        return {
          icon: <Sword className="w-10 h-10 text-primary relative z-10" />,
          gradient: 'from-red-100 to-orange-200',
          glow: 'from-red-300/20 to-orange-400/20',
          accent: 'bg-red-400'
        };
      case 'guardian':
        return {
          icon: <Shield className="w-10 h-10 text-primary relative z-10" />,
          gradient: 'from-blue-100 to-cyan-200',
          glow: 'from-blue-300/20 to-cyan-400/20',
          accent: 'bg-blue-400'
        };
      case 'lightning':
        return {
          icon: <Zap className="w-10 h-10 text-primary relative z-10" />,
          gradient: 'from-purple-100 to-violet-200',
          glow: 'from-purple-300/20 to-violet-400/20',
          accent: 'bg-purple-400'
        };
      case 'royal':
        return {
          icon: <Crown className="w-10 h-10 text-primary relative z-10" />,
          gradient: 'from-yellow-100 to-amber-200',
          glow: 'from-yellow-300/20 to-amber-400/20',
          accent: 'bg-yellow-400'
        };
      default:
        return {
          icon: <User className="w-10 h-10 text-primary relative z-10" />,
          gradient: 'from-blue-100 to-indigo-200',
          glow: 'from-blue-300/20 to-indigo-400/20',
          accent: 'bg-blue-400'
        };
    }
  };

  const { icon, gradient, glow, accent } = getAvatarContent();

  return (
    <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden shadow-md ${className}`}>
      {/* Background animation */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-200 rounded-full`}></div>
      
      {/* Animated glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${glow} rounded-full animate-pulse-subtle`}></div>
      
      {/* Avatar icon */}
      {icon}
      
      {/* Avatar accessories */}
      <div className="absolute bottom-0 w-full h-1/3 bg-primary/10 backdrop-blur-sm"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 rounded-full blur-sm"></div>
          <div className="relative bg-yellow-300 text-yellow-800 rounded-full p-1 shadow-md">
            <Zap size={10} />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
        <div className="relative">
          <div className={`absolute inset-0 ${accent} rounded-full blur-sm`}></div>
          <div className={`relative ${accent} text-white rounded-full p-1 shadow-md`}>
            <Shield size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
