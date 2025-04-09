import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, MessageSquare } from 'lucide-react';

interface BattleNarratorProps {
  messageQueue: string[];
  onMessageShown?: () => void;
}

const BattleNarrator: React.FC<BattleNarratorProps> = ({ 
  messageQueue,
  onMessageShown
}) => {
  const [visibleMessages, setVisibleMessages] = useState<string[]>([]);
  const maxVisibleMessages = 3;

  // Process the queue of battle narration messages
  useEffect(() => {
    if (messageQueue.length > 0 && visibleMessages.length < maxVisibleMessages) {
      const newMessage = messageQueue[0];
      
      setVisibleMessages(prev => {
        // Add new message and keep only the most recent ones
        const updated = [newMessage, ...prev];
        return updated.slice(0, maxVisibleMessages);
      });
      
      if (onMessageShown) {
        onMessageShown();
      }
    }
  }, [messageQueue, onMessageShown, visibleMessages.length]);

  if (visibleMessages.length === 0) return null;

  return (
    <div className="absolute left-4 bottom-4 z-30 w-64 pointer-events-none">
      <div className="bg-slate-900/80 border-l-4 border-amber-500 rounded-md p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Book className="w-4 h-4 text-amber-400" />
          <h3 className="text-amber-400 text-sm font-semibold">Battle Chronicle</h3>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((message, index) => (
              <motion.div
                key={`${message.substring(0, 10)}-${index}`}
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-white text-xs"
              >
                <div className="flex gap-1.5 items-start">
                  <MessageSquare className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                  <p>{message}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BattleNarrator;
