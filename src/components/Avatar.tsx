
import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  avatarType: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarType, className = '' }) => {
  // You can expand this with different avatar representations
  return (
    <div className={`relative w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-200 rounded-full"></div>
      <User className="w-10 h-10 text-primary relative z-10" />
      
      {/* Avatar accessories based on game progress could go here */}
      <div className="absolute bottom-0 w-full h-1/3 bg-primary/10 backdrop-blur-sm"></div>
    </div>
  );
};

export default Avatar;
