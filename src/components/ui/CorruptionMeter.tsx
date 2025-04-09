
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { Eye } from 'lucide-react';

interface CorruptionMeterProps {
  size?: 'sm' | 'md' | 'lg'; 
}

const CorruptionMeter: React.FC<CorruptionMeterProps> = ({ size = 'md' }) => {
  const { shadowForm, corruptionLevel } = useGameContext();
  
  if (!shadowForm || corruptionLevel === 0) {
    return null;
  }
  
  const getCorruptionColor = () => {
    if (corruptionLevel >= 90) return 'from-red-600 to-red-900';
    if (corruptionLevel >= 75) return 'from-red-500 to-red-800';
    if (corruptionLevel >= 50) return 'from-red-400 to-red-700';
    if (corruptionLevel >= 25) return 'from-red-300 to-red-600';
    return 'from-red-200 to-red-500';
  };
  
  const getShadowFormIcon = () => {
    switch(shadowForm) {
      case 'cursedBlade':
        return <div className="text-red-400">🔪</div>;
      case 'leecher':
        return <div className="text-purple-400">💀</div>;
      case 'whisperer':
        return <div className="text-blue-400">👁️</div>;
      default:
        return <Eye className="h-4 w-4 text-red-400" />;
    }
  };
  
  const getSizeClasses = () => {
    switch(size) {
      case 'sm': return 'h-1 w-16';
      case 'lg': return 'h-3 w-32';
      default: return 'h-2 w-24';
    }
  };
  
  const isPulsing = corruptionLevel >= 75;
  
  return (
    <div className="flex items-center space-x-1 relative">
      <div className={`${isPulsing ? 'animate-pulse' : ''}`}>
        {getShadowFormIcon()}
      </div>
      
      <div className="bg-slate-800/80 rounded-full overflow-hidden relative">
        <div 
          className={`${getSizeClasses()} bg-gradient-to-r ${getCorruptionColor()} ${isPulsing ? 'animate-pulse' : ''}`}
          style={{ width: `${Math.min(100, corruptionLevel)}%` }}
        ></div>
        
        {isPulsing && (
          <div className="absolute inset-0 bg-red-500/20 animate-ping rounded-full"></div>
        )}
      </div>
      
      {corruptionLevel >= 100 && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default CorruptionMeter;
