
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface BattleNarratorProps {
  message: string;
  onProcessed: () => void;
}

const BattleNarrator: React.FC<BattleNarratorProps> = ({ 
  message,
  onProcessed
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onProcessed();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [message, onProcessed]);
  
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/90 border border-slate-700 rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 mb-4"
        >
          <div className="bg-amber-900/50 p-1.5 rounded-full">
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-amber-200 text-sm font-medium">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BattleNarrator;
