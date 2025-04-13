
import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

interface BattleHUDProps {
  comboCount: number;
  comboMultiplier: number;
  overdriveMeter: number;
  overdriveActive: boolean;
  overdriveTimeRemaining: number;
}

const BattleHUD: React.FC<BattleHUDProps> = ({
  comboCount,
  comboMultiplier,
  overdriveMeter,
  overdriveActive,
  overdriveTimeRemaining
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {/* Combo meter */}
      <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-orange-400" /> 
            <span className="text-sm font-medium text-slate-300">Combo Chain</span>
          </div>
          <span className={`text-sm font-medium ${
            comboCount > 2 ? 'text-orange-400' : 'text-slate-400'
          }`}>
            x{comboCount} ({(comboMultiplier).toFixed(1)}x)
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              comboCount >= 9 ? 'bg-gradient-to-r from-yellow-500 to-red-500' :
              comboCount >= 6 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
              comboCount >= 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
              'bg-amber-600'
            }`} 
            style={{ width: `${Math.min(100, (comboCount / 10) * 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{comboCount > 0 ? "Active" : "No combo"}</span>
          {comboCount >= 3 && (<span className="text-amber-500">Finisher ready!</span>)}
        </div>
      </div>
      
      {/* Overdrive meter */}
      <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-blue-400" /> 
            <span className="text-sm font-medium text-slate-300">Overdrive</span>
          </div>
          <span className={`text-sm font-medium ${
            overdriveActive ? 'text-blue-400' : 'text-slate-400'
          }`}>
            {overdriveActive ? `Active (${overdriveTimeRemaining})` : `${overdriveMeter}%`}
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              overdriveActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse' : 
              'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`} 
            style={{ width: overdriveActive ? '100%' : `${overdriveMeter}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-slate-500">
          <span>{overdriveMeter < 25 ? "Building" : 
                overdriveMeter < 75 ? "Charging" : 
                overdriveMeter < 100 ? "Almost Ready" :
                "MAXIMUM"}</span>
          {overdriveActive && (<span className="text-blue-400 animate-pulse">ACTIVATED</span>)}
        </div>
      </div>
    </div>
  );
};

export default BattleHUD;
