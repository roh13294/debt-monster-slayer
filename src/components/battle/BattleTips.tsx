
import React from 'react';
import { Lightbulb, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface BattleTipsProps {
  stance: string | null;
  onClose?: () => void;
}

const BattleTips: React.FC<BattleTipsProps> = ({ stance, onClose }) => {
  const getTips = () => {
    const commonTips = [
      'Higher payments deal more damage to demons!',
      'Defeat demons completely to earn special rewards!',
      'Special techniques can turn the tide of battle!'
    ];
    
    const stanceTips: Record<string, string[]> = {
      'aggressive': [
        'Flame Breathing deals extra damage but costs more spirit energy',
        'Combine large attacks with flame techniques for devastating combos',
        'Critical hits are less common but regular damage is higher'
      ],
      'defensive': [
        'Water Breathing preserves your resources and offers protection',
        'Smaller, consistent payments are more efficient with this stance',
        'This stance helps build longer payment streaks'
      ],
      'risky': [
        'Thunder Breathing has the highest chance for critical hits',
        'Be prepared for occasional misses with this volatile style',
        'When it works, this stance can clear demons much faster'
      ]
    };
    
    if (stance && stance in stanceTips) {
      return [...stanceTips[stance], ...commonTips];
    }
    
    return commonTips;
  };
  
  const tips = getTips();
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  
  return (
    <motion.div 
      className="bg-slate-800/80 border border-slate-700 rounded-lg p-4 flex items-start gap-3 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 p-1 h-auto text-slate-400 hover:text-slate-100"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      <div className="bg-amber-900/30 p-2 rounded-full text-amber-400 flex-shrink-0">
        <Lightbulb className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-medium text-amber-400 text-sm mb-1">Slayer Tip</h4>
        <p className="text-slate-300 text-sm">{randomTip}</p>
      </div>
    </motion.div>
  );
};

export default BattleTips;
