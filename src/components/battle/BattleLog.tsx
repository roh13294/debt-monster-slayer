
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BattleLogEntry } from '@/types/battleTypes';
import { Flame, Shield, AlertCircle, Info } from 'lucide-react';

interface BattleLogProps {
  entries: BattleLogEntry[];
  maxHeight?: string;
}

const BattleLog: React.FC<BattleLogProps> = ({ 
  entries,
  maxHeight = "250px" 
}) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="bg-slate-800/70 rounded-lg p-4 border border-slate-700 text-center text-slate-400 text-sm">
        No battle events yet
      </div>
    );
  }
  
  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'attack':
        return <Flame size={14} className="text-red-400 flex-shrink-0" />;
      case 'special':
        return <Shield size={14} className="text-blue-400 flex-shrink-0" />;
      case 'phase-change':
        return <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />;
      default:
        return <Info size={14} className="text-slate-400 flex-shrink-0" />;
    }
  };
  
  const getEntryColor = (type: string) => {
    switch (type) {
      case 'attack':
        return 'text-red-300';
      case 'special':
        return 'text-blue-300';
      case 'phase-change':
        return 'text-amber-300';
      default:
        return 'text-slate-300';
    }
  };
  
  return (
    <div className="bg-slate-800/70 rounded-lg border border-slate-700">
      <div className="p-3 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-300">Battle Log</h3>
        <span className="text-xs text-slate-500">{entries.length} events</span>
      </div>
      <ScrollArea className={`p-2`} style={{ maxHeight }}>
        <div className="space-y-2 p-2">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm flex gap-2 items-start"
              >
                <div className="mt-0.5">{getEntryIcon(entry.type)}</div>
                <div className={getEntryColor(entry.type)}>{entry.message}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};

export default BattleLog;
