
import React from 'react';
import { User, Shield, Sword, Zap } from 'lucide-react';

interface AvatarProps {
  avatarType: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarType, className = '' }) => {
  return (
    <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center overflow-hidden shadow-md ${className}`}>
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-200 rounded-full"></div>
      
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full animate-pulse-subtle"></div>
      
      {/* User icon */}
      <User className="w-10 h-10 text-primary relative z-10" />
      
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
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm"></div>
          <div className="relative bg-blue-400 text-white rounded-full p-1 shadow-md">
            <Shield size={10} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
