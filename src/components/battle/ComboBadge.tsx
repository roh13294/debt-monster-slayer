
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

interface ComboBadgeProps {
  active: boolean;
  count: number;
  multiplier: number;
}

const ComboBadge: React.FC<ComboBadgeProps> = ({ active, count, multiplier }) => {
  if (!active || count <= 1) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.2 }}
        className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
      >
        <div className="bg-gradient-to-br from-amber-600 to-red-600 px-6 py-3 rounded-full shadow-lg border-2 border-yellow-300">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-yellow-200 animate-pulse" />
            <span className="text-2xl font-bold text-white">COMBO x{count}</span>
            <span className="text-sm text-yellow-200">{(multiplier).toFixed(1)}x</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComboBadge;
