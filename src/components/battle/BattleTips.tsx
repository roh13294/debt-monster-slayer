
import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, Flame, Shield, Zap, Sword } from 'lucide-react';
import { motion } from 'framer-motion';

interface BattleTipsProps {
  stance: string | null;
  onClose: () => void;
}

const BattleTips: React.FC<BattleTipsProps> = ({ stance, onClose }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 p-4 rounded-xl border border-slate-700 mb-4 relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        variant="ghost" 
        size="sm" 
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        ✕
      </Button>
      
      <h3 className="font-bold text-sm mb-2 flex items-center text-white">
        {stance === 'aggressive' && <Flame className="w-4 h-4 mr-1 text-red-400" />}
        {stance === 'defensive' && <Shield className="w-4 h-4 mr-1 text-blue-400" />}
        {stance === 'risky' && <Zap className="w-4 h-4 mr-1 text-purple-400" />}
        {!stance && <Target className="w-4 h-4 mr-1 text-fun-purple" />}
        Slayer Combat Techniques
      </h3>
      
      <ul className="text-xs text-gray-300 space-y-1.5 list-none">
        <motion.li 
          className="flex items-start gap-2"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Sword className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
          <span>Use the <strong>slider</strong> to focus your spirit energy for attacks</span>
        </motion.li>
        
        <motion.li 
          className="flex items-start gap-2"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sword className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
          <span>Strike rapidly in succession to trigger <strong>Combo Effects</strong></span>
        </motion.li>
        
        <motion.li 
          className="flex items-start gap-2"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Sword className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
          <span>Use <strong>Special Techniques</strong> when demons enter Rage or Frenzy phases</span>
        </motion.li>
        
        <motion.li 
          className="flex items-start gap-2"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Sword className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
          <span>Defeat all demons in a single session for <strong>Streak Bonuses</strong></span>
        </motion.li>
        
        {stance === 'aggressive' && (
          <motion.li 
            className="flex items-start gap-2 bg-red-950/30 p-1.5 rounded border border-red-900/30 mt-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Flame className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
            <span><strong>Flame Breathing</strong> increases attack power by 20% but makes demon strikes more damaging</span>
          </motion.li>
        )}
        
        {stance === 'defensive' && (
          <motion.li 
            className="flex items-start gap-2 bg-blue-950/30 p-1.5 rounded border border-blue-900/30 mt-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Shield className="w-3 h-3 text-blue-400 mt-0.5 shrink-0" />
            <span><strong>Water Breathing</strong> reduces demon attack power by 10% and improves counter chances</span>
          </motion.li>
        )}
        
        {stance === 'risky' && (
          <motion.li 
            className="flex items-start gap-2 bg-purple-950/30 p-1.5 rounded border border-purple-900/30 mt-2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Zap className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" />
            <span><strong>Thunder Breathing</strong> has a 25% chance to trigger critical strikes (2x damage)</span>
          </motion.li>
        )}
      </ul>
      
      <div className="mt-3 pt-2 border-t border-slate-700">
        <p className="text-amber-400/80 text-xs italic">Watch for demon phase changes as their health decreases!</p>
      </div>
    </motion.div>
  );
};

export default BattleTips;
